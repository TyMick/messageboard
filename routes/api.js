/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const expect = require("chai").expect;
const ThreadHandler = require("../controllers/threadHandler.js");
const ReplyHandler = require("../controllers/replyHandler.js");

module.exports = app => {
  const threadHandler = new ThreadHandler();
  const replyHandler = new ReplyHandler();

  app
    .route("/api/threads/:board")
    .post(threadHandler.addNewThread)
    .get(threadHandler.getRecentThreads)
    .put(threadHandler.reportThread)
    .delete(threadHandler.deleteThread);

  app
    .route("/api/replies/:board")
    .post(replyHandler.addNewReply)
    .get(replyHandler.getThreadAndReplies)
    .put(replyHandler.reportReply)
    .delete(replyHandler.deleteReply);
};
