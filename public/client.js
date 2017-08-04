var searchTerm = "";

function validateUrl(url) {
    var output = '';
    if (url === undefined) {
        // if ((url != '') || (url != null) || (url != undefined) || (typeof url != undefined) || (url)) {

        output = 'image/image-not-found.jpg';
    }
    else {
        output = url.thumbnail;
    }
    return output;
}

function validateText(text) {
    var output = '';
    // if ((text == '') || (text == null) || (text == undefined) || (typeof text == undefined) || (text) || (text.length == 0)) {
    if (text === undefined) {
        output = 'No Description Available';
    }
    else {
        output = text;

    }
    return output;
}

function bookApiCall(searchTerm) {

    $.ajax({
            url: "/book/" + searchTerm,
            type: 'GET',
            dataType: 'json'
        })
        .done(function(result) {
            console.log(result);
            $('.landing').hide();
            $('.errorMessage').hide();
            displayQuery(result);
        })
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            $('.errorMessage').show();
            $('.errorMessage p').text("Opps there was an error handeling your request.")
        });
}

function displayQuery(data) {
    console.log(data);
    var addHTML = "";
    $.each(data.items, function(index, book) {
        addHTML += "<li class ='bookContain'>";
        addHTML += "<div class='bookPreview' type='submit'>";
        addHTML += "<div class='bookTitle'>";
        addHTML += "<h2>" + book.volumeInfo.title + "</h2>";
        addHTML += "</div>";
        addHTML += "<a href='" + book.volumeInfo.previewLink + "' target='_blank'>";
        addHTML += "<div class='book-image' style='background-image: url(" + validateUrl(book.volumeInfo.imageLinks) + ") '></div>";
        addHTML += "</a>";
        addHTML += "<a href='" + book.volumeInfo.previewLink + "' target='_blank' class='button'>Preview Book</a>";
        addHTML += "<ul class='bookInfo'>";
        addHTML += "<li class='catagoy'>" + validateText(book.volumeInfo.categories) + "</li>";
        addHTML += "<li class='author'>" + book.volumeInfo.authors + "</li>";
        addHTML += "</ul>";
        addHTML += "<div class='description'>";
        addHTML += "<p>" + validateText(book.volumeInfo.description) + "</p>";
        addHTML += "</div>";
        addHTML += "<form class='addBookToCart'>";
        addHTML += "<input type='hidden' class='addToCartBookValue' value='" + book.volumeInfo.title + "'>";
        addHTML += "<input type='hidden' class='addToCartLinkValue' value='" + book.volumeInfo.canonicalVolumeLink + "'>";
        addHTML += "<input type='hidden' class='addToCartIdValue' value='" + book.id + "'>";
        addHTML += "<input type='hidden' class='addToCartImgValue' value='" + book.volumeInfo.imageLinks.thumbnail + "'>";
        addHTML += "<input type='hidden' class='addToCartDesValue' value='" + book.volumeInfo.description + "'>";
        addHTML += "<button class='addToCartButton' type='submit'>";
        addHTML += "add to Shelf";
        addHTML += "</button>";
        addHTML += "</form>";
        addHTML += "</li>";
    });
    $('.bookTitles ul').html(addHTML);
}

function populateCartContainer() {

    $.ajax({
            type: "GET",
            url: "/populate-cart",
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function(data) {
            //If successful, set some globals instead of using result object
            console.log(data);


            var addHTML = "";

            $.each(data, function(index, book) {
                addHTML += "<li class='itemContain'>";
                addHTML += "<div class = 'bookImg'>";
                addHTML += "<a href='" + book.link + "' target='_blank'>";
                addHTML += "<img src='" + book.image + "'/>";
                addHTML += "</a>";
                addHTML += "</div>";
                addHTML += "<button class='clearCartButton'>";
                addHTML += "<img src='/image/cancel-square.png' class='clear-cart-icon'>";
                addHTML += '</button>';
                addHTML += "<div class='title'>";
                addHTML += "<a href='" + book.link + "' target='_blank'>" + book.name + "</a>";
                addHTML += "</div>";
                addHTML += "<div class='bookDescription'>";
                addHTML += "<p>" + book.description + "</p>";
                addHTML += "</div>";
                addHTML += "<ul class='userNotes-" + index + "'>";
                addHTML += "</ul>";
                addHTML += "<form class='commentInput'>";
                addHTML += "<input type='text' id='uComment' class='userComment' placeholder='Add Notes'>";
                addHTML += "<button class='addComment'>Add</button>";
                addHTML += "</form>";
                addHTML += "<input type='hidden' class='deleteIdValue' value='" + book.idValue + "'>";
                addHTML += "</li>";
            });
            $(".shelf ul").html(addHTML);
        })
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            $('.errorMessage').show();
            $('.errorMessage p').text("Opps there was an error handeling your request.")
        });
}


$(document).ready(function() {
    populateCartContainer();
    $('.js-search-form').submit(function(event) {
        event.preventDefault();
        searchTerm = $('.js-query').val();
        console.log('searchTerm =', searchTerm);
        bookApiCall(searchTerm);

    });
    function populateNotes(index) {
    $('body').on('click', '.addComment' + index, function(event) {
        event.preventDefault();
        event.stopPropagation();
    });

    $.ajax({
            type: "GET",
            url: "/populate-notes",
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function(data) {
            //If successful, set some globals instead of using result object
            console.log(data);
            console.log(data.length, 'comments');
            
            $.each(data, function(index, comment) {
                var addHTML = "";
                $('.userNotes-' + index).html("")
                addHTML += "<li class='noteContain'>";
                addHTML += "<div class = 'addedNote'>";
                addHTML += "<p>" + comment.text + "</p>";
                addHTML += "<button class='delComment'>Remove</button>";
                addHTML += "</div>";
                addHTML += "<input type='hidden' class='delCommentId' value='" + comment._id + "'>";
                addHTML += "</li>";
                $(".userNotes-" + index).append(addHTML);
                console.log('gethere', comment.text, index);
                console.log(comment._id);
            });
        })
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            $('.errorMessage').show();
            $('.errorMessage p').text("Opps there was an error handeling your request.")
        });
}

$('body').on('click', '.addComment', function(event) {
    event.preventDefault();
    var commentValue = $(this).parent().find('.userComment').val();
    var commentId = $(this).parent().find('.delcommentId').val();
    console.log("comment", commentValue ,'id:', commentId);
    
    var commentObject = {
        'text': commentValue,
        'commentId': commentId
    };
    $.ajax({
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(commentObject),
        url: '/add-to-comment/'
    })
    .done(function(result) {
        console.log('com res', result);
        populateNotes();
    })
    .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            $('.errorMessage').show();
            $('.errorMessage p').text("Opps there was an error handeling your request.")
        });
});

$('body').on('click', '.addToCartButton', function(event) {
    //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
    event.preventDefault();
    //get the value from the input box
    var bookValue = $(this).parent().find('.addToCartBookValue').val();
    var linkValue = $(this).parent().find('.addToCartLinkValue').val();
    var idValue = $(this).parent().find('.addToCartIdValue').val();
    var imgValue = $(this).parent().find('.addToCartImgValue').val();
    var desValue = $(this).parent().find('.addToCartDesValue').val();
    console.log(bookValue, linkValue, imgValue);
    alert(bookValue + ' added to shelf');


    var nameObject = {
        'name': bookValue,
        'link': linkValue,
        'idValue': idValue,
        'description': desValue,
        'image': imgValue
    };

    $.ajax({
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(nameObject),
            url: '/add-to-cart/'
        })
        .done(function(result) {
            console.log('result', result);
            populateCartContainer();
        })
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            $('.errorMessage').show();
            $('.errorMessage p').text("Opps there was an error handeling your request.")
        });
});


$('body').on('click', '.clearCartButton', function(event) {
    //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
    event.preventDefault();
    event.stopPropagation();
    var idValue = $(this).parent().find('.deleteIdValue').val();
    console.log('id value', idValue);

    var bookid = {
        idValue: idValue
    };

    $.ajax({
            method: 'DELETE',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(bookid),
            url: '/delete-cart',
        })
        .done(function(result) {
            console.log(result);
            populateCartContainer();
        })
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            $('.errorMessage').show();
            $('.errorMessage p').text("Opps there was an error handeling your request.")
        });
});

$('body').on('click', '.delComment', function(event) {
    //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
    event.preventDefault();
    event.stopPropagation();
    var commentId = $(this).parent().find('.delCommentId').val();
    console.log('noteId value', commentId);

    var comments = {
        commentId: commentId
    };

    $.ajax({
            method: 'DELETE',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(comments),
            url: '/delete-comment',
        })
        .done(function(result) {
            console.log(result);
            populateCartContainer();
        })
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            $('.errorMessage').show();
            $('.errorMessage p').text("Opps there was an error handeling your request.")
        });
});
    $('.commentInput').submit(function(event) {
        event.preventDefault();
        var notes = $('.userComment').val();
        populateNotes(notes);
    });
});


