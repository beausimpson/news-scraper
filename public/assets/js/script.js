
// list all articles in db
$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#scraped-articles").append(
            `<div class="card" data-id='${data[i]._id}' data-savedStatus="${data[i].saved}">
                <h5 class="card-header">${data[i].title}</h5>
                <div class="card-body">
                    <a href="${data[i].link}"><p class="card-text">...Summary...</p></a>
                    <button data-id='${data[i]._id}' class="btn btn-danger save">Save <i class="fas fa-bookmark"></i></button>
                </div>
            </div>`
        );
    };
});

// list all saved articles
$.getJSON("/savedarticles", function (savedData) {
    for (var i = 0; i < savedData.length; i++) {
        $("#saved-articles").append(
            `<div class="card" data-id='${savedData[i]._id}'>
                <h5 class="card-header">${savedData[i].title}</h5>
                <div class="card-body">
                    <a href="${savedData[i].link}"><p class="card-text">...Summary...</p></a>
                    <button 
                    data-id='${savedData[i]._id}' class="btn btn-danger delete">Delete <i class="fas fa-trash-alt"></i></button>
                </div>
            </div>`
        );
    };
});

// delete article
$(document).on("click", ".delete", function () {
    var thisId = $(this).attr("data-id");
    console.log(thisId)

    $.ajax({
        method: "POST",
        url: `/savedarticles/${thisId}`,
        data: {
            saved: false
        }
    })
        .then(function (data) {
            location.reload();
            console.log(`${thisId} deleted`);
        });

});

// save article
$(document).on("click", ".save", function () {
    var thisId = $(this).attr("data-id");
    console.log(thisId)

    $.ajax({
        method: "POST",
        url: `/updatedarticles/${thisId}`,
        data: {
            saved: true
        }
    })
        .then(function (data) {
            location.reload();
            console.log(data);
        });

});

// create note
$(document).on("click", ".card", function () {

    $("#article-note").empty();

    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: `/articles/${thisId}`
    })
        .then(function (data) {
            // console.log(data);
            $("#article-note").append(
                `<div class="note">
                    <h3>${data.title}</h3>
                    <input id='titleinput' name='title' placeholder="Enter Title:">
                    <textarea id='bodyinput' name='body' placeholder="Enter Note:"></textarea>
                    <button data-id=${data._id} id='save' class="btn btn-primary">Save Note <i class="fas fa-file-alt"></i></button>
                </div>`
            );

            if (data.note) {

                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});

// save note
$(document).on("click", "#save", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: `/articles/${thisId}`,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function (data) {
            // console.log(data);
            $("#notes").empty();
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});