"use strict";

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const dbName = "messageboard";

function ReplyHandler() {
  this.addNewReply = async (req, res) => {
    const client = new MongoClient(process.env.DB, {
      useUnifiedTopology: true
    });
    try {
      await client.connect();
      const col = client.db(dbName).collection(req.params.board);

      const response = await col.updateOne(
        { _id: new ObjectId(req.body.thread_id) },
        {
          $set: { bumped_on: new Date() },
          $push: {
            replies: {
              _id: new ObjectId(),
              text: req.body.text,
              created_on: new Date(),
              delete_password: req.body.delete_password,
              reported: false
            }
          }
        }
      );

      if (response.modifiedCount) {
        res.redirect("/b/" + req.params.board + "/" + req.body.thread_id);
      } else {
        res.json({ error: "No such thread _id" });
      }
    } catch (e) {
      console.log(e);
      if (
        e
          .toString()
          .search(
            "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
          ) === -1
      ) {
        res.json({ error: "Database error" });
      } else {
        res.json({ error: "No such thread _id" });
      }
    }

    client.close();
  };

  this.getThreadAndReplies = async (req, res) => {
    const client = new MongoClient(process.env.DB, {
      useUnifiedTopology: true
    });
    try {
      await client.connect();
      const col = client.db(dbName).collection(req.params.board);

      const threadAndReplies = await col.findOne(
        { _id: new ObjectId(req.query.thread_id) },
        {
          projection: {
            reported: 0,
            delete_password: 0,
            "replies.reported": 0,
            "replies.delete_password": 0
          }
        }
      );

      if (threadAndReplies) {
        res.json(threadAndReplies);
      } else {
        res.send("No such thread _id");
      }
    } catch (e) {
      console.log(e);
      if (
        e
          .toString()
          .search(
            "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
          ) === -1
      ) {
        res.send("Database error");
      } else {
        res.send("No such thread _id");
      }
    }

    client.close();
  };

  this.reportReply = async (req, res) => {
    const client = new MongoClient(process.env.DB, {
      useUnifiedTopology: true
    });
    try {
      await client.connect();
      const col = client.db(dbName).collection(req.params.board);

      const updateResult = await col.updateOne(
        {
          _id: new ObjectId(req.body.thread_id),
          "replies._id": new ObjectId(req.body.reply_id)
        },
        { $set: { "replies.$.reported": true } }
      );

      if (updateResult.modifiedCount == 1) {
        res.send("success");
      } else {
        const threadResult = await col.findOne({
          _id: new ObjectId(req.body.thread_id)
        });
        if (threadResult) {
          const replyResult = await col.findOne({
            _id: new ObjectId(req.body.thread_id),
            "replies._id": new ObjectId(req.body.reply_id)
          });
          if (replyResult) {
            res.send("incorrect password");
          } else {
            res.send("No such reply _id");
          }
        } else {
          res.send("No such thread _id");
        }
      }
    } catch (e) {
      console.log(e);
      if (
        e
          .toString()
          .search(
            "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
          ) === -1
      ) {
        res.send("Database error");
      } else {
        res.send("Incorrect _id format");
      }
    }

    client.close();
  };

  this.deleteReply = async (req, res) => {
    const client = new MongoClient(process.env.DB, {
      useUnifiedTopology: true
    });
    try {
      await client.connect();
      const col = client.db(dbName).collection(req.params.board);

      const updateResult = await col.updateOne(
        {
          _id: new ObjectId(req.body.thread_id),
          replies: {
            $elemMatch: {
              _id: new ObjectId(req.body.reply_id),
              delete_password: req.body.delete_password
            }
          }
        },
        { $set: { "replies.$.text": "[deleted]" } }
      );

      if (updateResult.modifiedCount == 1) {
        res.send("success");
      } else {
        const threadResult = await col.findOne({
          _id: new ObjectId(req.body.thread_id)
        });
        if (threadResult) {
          const replyResult = await col.findOne({
            _id: new ObjectId(req.body.thread_id),
            replies: {
              $elemMatch: {
                _id: new ObjectId(req.body.reply_id)
              }
            }
          });
          if (replyResult) {
            res.send("incorrect password");
          } else {
            res.send("No such reply _id");
          }
        } else {
          res.send("No such thread _id");
        }
      }
    } catch (e) {
      console.log(e);
      if (
        e
          .toString()
          .search(
            "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
          ) === -1
      ) {
        res.send("Database error");
      } else {
        res.send("Incorrect _id format");
      }
    }

    client.close();
  };
}

module.exports = ReplyHandler;
