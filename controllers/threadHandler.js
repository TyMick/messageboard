"use strict";

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const dbName = "messageboard";

function ThreadHandler() {
  this.addNewThread = async (req, res) => {
    const client = new MongoClient(process.env.DB, {
      useUnifiedTopology: true
    });
    try {
      await client.connect();
      const col = client.db(dbName).collection(req.params.board);

      await col.insertOne({
        text: req.body.text,
        created_on: new Date(),
        bumped_on: new Date(),
        reported: false,
        delete_password: req.body.delete_password,
        replies: []
      });

      res.redirect("/b/" + req.params.board + "/");
    } catch (e) {
      console.log(e);
      res.json({ error: "Database error" });
    }

    client.close();
  };

  this.getRecentThreads = async (req, res) => {
    const client = new MongoClient(process.env.DB, {
      useUnifiedTopology: true
    });
    try {
      await client.connect();
      const col = client.db(dbName).collection(req.params.board);

      let recentThreads = await col
        .find({})
        .project({
          reported: 0,
          delete_password: 0,
          "replies.reported": 0,
          "replies.delete_password": 0
        })
        .sort("bumped_on", -1)
        .limit(10)
        .toArray();
      recentThreads.forEach(thread => {
        thread.replies = thread.replies.slice(-3);
      });

      res.json(recentThreads);
    } catch (e) {
      console.log(e);
      res.send("Database error");
    }

    client.close();
  };

  this.reportThread = async (req, res) => {
    const client = new MongoClient(process.env.DB, {
      useUnifiedTopology: true
    });
    try {
      await client.connect();
      const col = client.db(dbName).collection(req.params.board);

      const updateResult = await col.updateOne(
        { _id: new ObjectId(req.body.thread_id) },
        { $set: { reported: true } }
      );

      if (updateResult.modifiedCount == 1) {
        res.send("success");
      } else {
        const findResult = await col.findOne(
          { _id: new ObjectId(req.body.thread_id) },
          { projection: { _id: 1 } }
        );
        if (findResult) {
          res.send("incorrect password");
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
        res.send("No such thread _id");
      }
    }

    client.close();
  };

  this.deleteThread = async (req, res) => {
    const client = new MongoClient(process.env.DB, {
      useUnifiedTopology: true
    });
    try {
      await client.connect();
      const col = client.db(dbName).collection(req.params.board);

      const deleteResult = await col.deleteOne({
        _id: new ObjectId(req.body.thread_id),
        delete_password: req.body.delete_password
      });

      if (deleteResult.deletedCount == 1) {
        res.send("success");
      } else {
        const findResult = await col.findOne(
          { _id: new ObjectId(req.body.thread_id) },
          { projection: { _id: 1 } }
        );
        if (findResult) {
          res.send("incorrect password");
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
        res.send("No such thread _id");
      }
    }

    client.close();
  };
}

module.exports = ThreadHandler;
