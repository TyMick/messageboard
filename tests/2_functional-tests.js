/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  let id1, id2, replyId;

  suite("API ROUTING FOR /api/threads/:board", () => {
    suite("POST (addNewThread)", () => {
      test("Create two new threads", done => {
        chai
          .request(server)
          .post("/api/threads/test")
          .send({
            text: "First thread",
            delete_password: "password1"
          })
          .end((err, res) => {
            assert.strictEqual(res.status, 200);
          });
        chai
          .request(server)
          .post("/api/threads/test")
          .send({
            text: "Second thread",
            delete_password: "password2"
          })
          .end((err, res) => {
            assert.strictEqual(res.status, 200);
            done();
          });
      });
    });

    suite("GET (getRecentThreads)", () => {
      test("Get recent threads", done => {
        chai
          .request(server)
          .get("/api/threads/test")
          .end((err, res) => {
            assert.strictEqual(res.status, 200);
            assert.isArray(res.body);
            assert.isAtMost(res.body.length, 10);
            assert.property(res.body[0], "_id");
            assert.property(res.body[0], "text");
            if (res.body[0].text === "First thread") {
              id1 = res.body[0]._id;
            } else if (res.body[0].text === "Second thread") {
              id2 = res.body[0]._id;
            }
            if (res.body[1].text === "First thread") {
              id1 = res.body[1]._id;
            } else if (res.body[1].text === "Second thread") {
              id2 = res.body[1]._id;
            }
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "bumped_on");
            assert.notProperty(res.body[0], "reported");
            assert.notProperty(res.body[0], "delete_password");
            assert.property(res.body[0], "replies");
            assert.isArray(res.body[0].replies);
            assert.isAtMost(res.body[0].replies.length, 3);
            done();
          });
      });
    });

    suite("PUT (reportThread)", () => {
      test("Report a thread", done => {
        chai
          .request(server)
          .put("/api/threads/test")
          .send({ thread_id: id1 })
          .end((err, res) => {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.text, "success");
            done();
          });
      });
    });

    suite("DELETE (deleteThread)", () => {
      test("Attempt to delete a thread with an incorrect password", done => {
        chai.request(server)
        .delete("/api/threads/test")
        .send({ thread_id: id1, delete_password: "monkey" })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, "incorrect password");
          done();
        })
      });

      test("Delete a thread with a correct password", done => {
        chai.request(server)
        .delete("/api/threads/test")
        .send({ thread_id: id1, delete_password: "password1" })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, "success");
          done();
        })
      });
    });
  });

  suite("API ROUTING FOR /api/replies/:board", () => {
    suite("POST (addNewReply)", () => {
      test("Reply to a thread", done => {
        chai.request(server)
        .post("/api/replies/test")
        .send({
          thread_id: id2,
          text: "Reply text",
          delete_password: "replypassword"
        })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          done();
        })
      });
    });

    suite("GET (getThreadAndReplies)", () => {
      test("Get one thread and all replies", done => {
        chai.request(server)
        .get("/api/replies/test")
        .query({ thread_id: id2 })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.property(res.body, "_id");
          assert.equal(res.body._id, id2);
          assert.property(res.body, "text");
          assert.strictEqual(res.body.text, "Second thread");
          assert.property(res.body, "created_on");
          assert.property(res.body, "bumped_on");
          assert.notProperty(res.body, "reported");
          assert.notProperty(res.body, "delete_password");
          assert.property(res.body, "replies");
          assert.isArray(res.body.replies);
          const last = res.body.replies.length - 1;
          assert.property(res.body.replies[last], "_id");
          replyId = res.body.replies[last]._id;
          assert.property(res.body.replies[last], "text");
          assert.strictEqual(res.body.replies[last].text, "Reply text");
          assert.property(res.body.replies[last], "created_on");
          assert.notProperty(res.body.replies[last], "delete_password");
          assert.notProperty(res.body.replies[last], "reported");
          done();
        })
      });
    });

    suite("PUT (reportReply)", () => {
      test("Report a reply", done => {
        chai.request(server)
        .put("/api/replies/test")
        .send({ thread_id: id2, reply_id: replyId })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, "success");
          done();
        })
      });
    });

    suite("DELETE (deleteReply)", () => {
      test("Attempt to delete a reply with an incorrect password", done => {
        chai.request(server)
        .delete("/api/replies/test")
        .send({
          thread_id: id2,
          reply_id: replyId,
          delete_password: "i should have used a password manager"
        })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, "incorrect password");
          done();
        })
      });

      test("Delete a reply with a correct password", done => {
        chai.request(server)
        .delete("/api/replies/test")
        .send({
          thread_id: id2,
          reply_id: replyId,
          delete_password: "replypassword"
        })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, "success");
          done();
        })
      });
    });
  });
});
