$(function() {
  $("#threadBoard").change(function() {
    $("#replyBoard").val($("#threadBoard").val());
  });

  $("#replyBoard").change(function() {
    $("#threadBoard").val($("#replyBoard").val());
  });

  function getFormDataObject(formId) {
    return $("#" + formId)
      .serializeArray()
      .reduce(function(object, item) {
        object[item.name] = item.value;
        return object;
      }, {});
  }

  function displayResult(result) {
    $("#apiOutput").text(JSON.stringify(result, null, 2));
    hljs.highlightBlock(document.getElementById("apiOutput"));
    $("#apiOutputModal").modal("show");
  }

  $("#addNewThread").submit(function() {
    event.preventDefault();
    if ($("#threadBoard").val()) {
      $.ajax({
        url: "/api/threads/" + $("#threadBoard").val(),
        type: "post",
        dataType: "json",
        data: getFormDataObject("addNewThread"),
        success: displayResult,
        error: function() {
          window.location.href =
            "https://ty-messageboard.glitch.me/b/" +
            $("#threadBoard").val();
        }
      });
    } else {
      $("#threadBoard").focus();
    }
  });

  $("#getRecentThreads").submit(function() {
    event.preventDefault();
    if ($("#threadBoard").val()) {
      $.ajax({
        url: "/api/threads/" + $("#threadBoard").val(),
        type: "get",
        success: displayResult
      });
    } else {
      $("#threadBoard").focus();
    }
  });

  $("#reportThread").submit(function() {
    event.preventDefault();
    if ($("#threadBoard").val()) {
      $.ajax({
        url: "/api/threads/" + $("#threadBoard").val(),
        type: "put",
        data: getFormDataObject("reportThread"),
        success: displayResult
      });
    } else {
      $("#threadBoard").focus();
    }
  });

  $("#deleteThread").submit(function() {
    event.preventDefault();
    if ($("#threadBoard").val()) {
      $.ajax({
        url: "/api/threads/" + $("#threadBoard").val(),
        type: "delete",
        data: getFormDataObject("deleteThread"),
        success: displayResult
      });
    } else {
      $("#threadBoard").focus();
    }
  });

  $("#addNewReply").submit(function() {
    event.preventDefault();
    if ($("#replyBoard").val()) {
      $.ajax({
        url: "/api/replies/" + $("#replyBoard").val(),
        type: "post",
        data: getFormDataObject("addNewReply"),
        dataType: "json",
        success: displayResult,
        error: function() {
          window.location.href =
            "https://ty-messageboard.glitch.me/b/" +
            $("#replyBoard").val() +
            "/" +
            $("#postReplyThreadId").val();
        }
      });
    } else {
      $("#replyBoard").focus();
    }
  });

  $("#getThreadAndReplies").submit(function() {
    event.preventDefault();
    if ($("#replyBoard").val()) {
      $.ajax({
        url: "/api/replies/" + $("#replyBoard").val(),
        type: "get",
        data: $("#getThreadAndReplies").serialize(),
        success: displayResult
      });
    } else {
      $("#replyBoard").focus();
    }
  });

  $("#reportReply").submit(function() {
    event.preventDefault();
    if ($("#replyBoard").val()) {
      $.ajax({
        url: "/api/replies/" + $("#replyBoard").val(),
        type: "put",
        data: getFormDataObject("reportReply"),
        success: displayResult
      });
    } else {
      $("#replyBoard").focus();
    }
  });

  $("#deleteReply").submit(function() {
    event.preventDefault();
    if ($("#replyBoard").val()) {
      $.ajax({
        url: "/api/replies/" + $("#replyBoard").val(),
        type: "delete",
        data: getFormDataObject("deleteReply"),
        success: displayResult
      });
    } else {
      $("#replyBoard").focus();
    }
  });
});
