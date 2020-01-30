# Anononymous message board microservice

I created this microservice as a requirement for [my freeCodeCamp Information Security and Quality Assurance Certification](https://www.freecodecamp.org/certification/tywmick/information-security-and-quality-assurance), using [Node.js](https://nodejs.org/en/), [Express](https://expressjs.com/), [MongoDB](https://mongodb.github.io/node-mongodb-native/), [Chai](https://www.chaijs.com/), and [Helmet](https://helmetjs.github.io/). The front end API tests on the home page also use [Bootstrap](https://getbootstrap.com/), [jQuery](https://jquery.com/), and [highlight.js](https://highlightjs.org/).

You can read the functional tests I wrote on [GitHub](https://github.com/tywmick/messageboard/tree/glitch/tests/2_functional-tests.js) or [Glitch](https://glitch.com/edit/#!/ty-messageboard?path=tests/2_functional-tests.js). To run the tests yourself, create a MongoDB database, fork/remix this project, create a `.env` file with `DB="{your MongoDB connection string}"` and `NODE_ENV="test"`, start the server, and look at the server console logs.

This project fulfills the following user stories:

1.  Only allow your site to be loading in an iframe on your own pages.
2.  Do not allow DNS prefetching.
3.  Only allow your site to send the referrer for your own pages.
4.  I can **POST** a thread to a specific message board by passing form data `text` and `delete_password` to `/api/threads/{board}`. (Recomend `res.redirect` to board page `/b/{board}`) Saved will be `_id`, `text`, `created_on` (date&time), `bumped_on` (date&time, starts same as created_on), `reported` (boolean), `delete_password`, & `replies` (array).
5.  I can **POST** a reply to a thead on a specific board by passing form data `text`, `delete_password`, & `thread_id` to `/api/replies/{board}` and it will also update the `bumped_on` date to the comment's date. (Recomend `res.redirect` to thread page `/b/{board}/{thread_id}`) In the thread's `replies` array will be saved `_id`, `text`, `created_on`, `delete_password`, & `reported`.
6.  I can **GET** an array of the most recent 10 bumped threads on the board with only the most recent 3 replies from `/api/threads/{board}`. The `reported` and `delete_password` fields will not be sent.
7.  I can **GET** an entire thread with all its replies from `/api/replies/{board}?thread_id={thread_id}`. Also hiding the same fields.
8.  I can delete a thread completely if I send a **DELETE** request to `/api/threads/{board}` and pass along the `thread_id` & `delete_password`. (Text response will be `"incorrect password"` or `"success"`)
9.  I can delete a post (just changing the text to `"[deleted]"`) if I send a **DELETE** request to `/api/replies/{board}` and pass along the `thread_id`, `reply_id`, & `delete_password`. (Text response will be `"incorrect password"` or `"success"`)
10. I can report a thread and change its `reported` value to `true` by sending a **PUT** request to `/api/threads/{board}` and passing along the `thread_id`. (Text response will be `"success"`)
11. I can report a reply and change its `reported` value to `true` by sending a **PUT** request to `/api/replies/{board}` and passing along the `thread_id` & `reply_id`. (Text response will be `"success"`)
12. Complete functional tests that wholly test routes and pass.

> _Wholly test routes, Batman!_
