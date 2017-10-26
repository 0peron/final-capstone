var searchTerm = "";

function validateUrl(url) {
    var output = '';
    if (url === undefined) {
        output = 'image/image-not-found.jpg';
    } else {
        output = url.thumbnail;
    }
    return output;
}

function validateText(text) {
    var output = '';
    if (text === undefined) {
        output = 'No Description Available';
    } else {
        output = text;

    }
    return output;
}

function loggingOut() {
    if (localStorage.getItem('authToken') === null) {
        $('.logout').hide();
        $('.logging').show();
    } else {
        $('.logout').show();
        $('.logging').hide();
    }
}

function bookApiCall(searchTerm) {

    $.ajax({
            url: "/book/" + searchTerm,
            type: 'GET',
            dataType: 'json'
        })
        .done(function (result) {
            $('.landing').hide();
            $('.errorMessage').hide();
            displayQuery(result);
        })
        .fail(function (jqXHR, error, errorThrown) {
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
    var users = "";
    $.each(data.items, function (index, book) {
        console.log(users);
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
        addHTML += "<input type='hidden' class='addToCartImgValue' value='" + validateUrl(book.volumeInfo.imageLinks) + "'>";
        addHTML += "<input type='hidden' class='addToCartDesValue' value='" + validateText(book.volumeInfo.description) + "'>";
        addHTML += "<input type='hidden' class='addToCartDesValue' value='" + users._id + "'>";

        addHTML += "<button class='addToCartButton' type='submit'>";
        addHTML += "add to Shelf";
        addHTML += "</button>";
        addHTML += "</form>";
        addHTML += "</li>";
    });
    $('.bookTitles ul').html(addHTML);
}

function populateCartContainer() {
    if (localStorage.getItem('authToken') === null) {
        console.log('Login');
    } else {
        $.ajax({
                type: "GET",
                url: "/populate-cart",
                dataType: 'json',
                contentType: 'application/json',
                headers: {
                    "Authorization": 'Bearer ' + localStorage.getItem('authToken')
                }
            })
            .done(function (data) {
                console.log(data);
                if (!data.length) {
                    $('.emptyShelf').show();
                    var addHTML = "";

                    $.each(data, function (index, book) {
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
                        addHTML += "<div class ='textBox'>";
                        addHTML += "<ul class='userNotes-" + book.idValue + "'>";
                        addHTML += "</ul>";
                        addHTML += "<form class='commentInput'>";
                        addHTML += "<input type='text' class='userComment' placeholder='Add Notes'>";
                        addHTML += "<input type='hidden' class='comId' value='" + book.idValue + "'>";
                        addHTML += "<button class='addComment' id=" + book.idValue + ">Add</button>";
                        addHTML += "</form>";
                        addHTML += "</div>";
                        addHTML += "<input type='hidden' class='deleteIdValue' value='" + book._id + "'>"
                        addHTML += "</li>";
                    });
                    $(".shelf ul").html(addHTML);
                } else {
                    var addHTML = "";

                    $.each(data, function (index, book) {
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
                        addHTML += "<div class ='textBox'>";
                        addHTML += "<ul class='userNotes-" + book.idValue + "'>";
                        addHTML += "</ul>";
                        addHTML += "<form class='commentInput'>";
                        addHTML += "<input type='text' class='userComment' placeholder='Add Notes'>";
                        addHTML += "<input type='hidden' class='comId' value='" + book.idValue + "'>";
                        addHTML += "<button class='addComment' id=" + book.idValue + ">Add</button>";
                        addHTML += "</form>";
                        addHTML += "</div>";
                        addHTML += "<input type='hidden' class='deleteIdValue' value='" + book._id + "'>"
                        addHTML += "</li>";
                    });
                    $('.emptyShelf').hide();
                    $(".shelf ul").html(addHTML);
                    populateNotes();
                }
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                $('.errorMessage').show();
                $('.errorMessage p').text("Opps there was an error handeling your request.")
            });
    }
}

function populateNotes() {
    if (localStorage.getItem('authToken') === null) {
        console.log('Login');
    } else {
        $.ajax({
                type: "GET",
                url: "/populate-notes",
                dataType: 'json',
                contentType: 'application/json',
                headers: {
                    "Authorization": 'Bearer ' + localStorage.getItem('authToken')
                }
            })
            .done(function (data) {
                if (!data.length) {
                    return;
                }
                console.log(data);
                console.log(data.length, 'comments');
                $('ul[class*="userNotes"]').html("");
                $.each(data, function (book, comment, index) {
                    console.log('comment:', comment, 'bookid:', comment.bookId);
                    var addHTML = "";
                    addHTML += "<li class='noteContain'>";
                    addHTML += "<div class = 'addedNote'>";
                    addHTML += "<p class = 'text'>" + comment.text + "</p>";
                    addHTML += "<button class='delComment'>Remove</button>";
                    addHTML += "</div>";
                    addHTML += "<input type='hidden' class='delCommentId' value='" + comment._id + "'>";
                    addHTML += "</li>";
                    $(".userNotes-" + comment.bookId).append(addHTML);
                    console.log(comment._id);
                });
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                $('.errorMessage').show();
                $('.errorMessage p').text("Opps there was an error handeling your request.")
            });
    }
}

function usersApiCall(username, password) {
    var params = {
        'username': username,
        'password': password
    };

    $.ajax({
            url: "/users",
            type: 'POST',
            data: JSON.stringify(params),
            dataType: 'json',
            processData: false,
            contentType: 'application/json'

        })
        .done(function (result) {
            console.log(result);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            console.log("these are params", params);
            $('.errorMessage').show();
            $('.errorMessage p').text("Opps there was an error handeling your request.")
        });
}

function login(username, password) {
    var params = {
        'username': username,
        'password': password
    };

    var loginString = btoa(username + ':' + password)
    $.ajax({
            url: "/login",
            type: 'POST',
            data: JSON.stringify(params),
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                "Authorization": 'Basic ' + loginString
            }
        })
        .done(function (result) {
            console.log(result);
            localStorage.setItem('authToken', result.authToken);
            window.location = '/'
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            $('.errorMessage').show();
            $('.errorMessage p').text("Opps there was an error handeling your request.")
        });
}

$(document).ready(function () {
    populateCartContainer();
    $('.register').hide();
    $('.logout').hide();
    loggingOut();
    $('.reg').on('click', function (event) {
        event.preventDefault();
        $('.register').show();
        $('.reg').hide();
    });

    $('.js-search-form').submit(function (event) {
        event.preventDefault();
        searchTerm = $('.js-query').val();
        console.log('searchTerm =', searchTerm);
        bookApiCall(searchTerm);
    });

    $('a.shelf').on('click', function (event) {
        if (localStorage.getItem('authToken') === null) {
            alert('you are not logged in');
            window.location.href = '/login.html';
        } else {
            event.preventDefault();
            window.location.href = '/shelf.html';
        }
    });

    $('body').on('click', '.addComment', function (event) {
        if (localStorage.getItem('authToken') === null) {
            alert('you are not logged in');
            window.location.href = '/login.html';
        } else {
            event.preventDefault();
            var commentValue = $(this).parent().find('.userComment').val();
            var bookId = $(this).parent().find('.comId').val();
            console.log('on click bookid:', bookId);
            console.log("comment", commentValue);

            var commentObject = {
                'text': commentValue,
                'bookId': bookId,
            };

            $.ajax({
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(commentObject),
                    url: '/add-to-comment/',
                    headers: {
                        "Authorization": 'Bearer ' + localStorage.getItem('authToken')
                    }
                })
                .done(function (result) {
                    console.log('comment res', result);
                    populateNotes();
                })
                .fail(function (jqXHR, error, errorThrown) {
                    console.log(jqXHR);
                    console.log(error);
                    console.log(errorThrown);
                    $('.errorMessage').show();
                    $('.errorMessage p').text("Opps there was an error handeling your request.")
                });
        }

    });

    $('body').on('click', '.logout', function (event) {
        localStorage.removeItem('authToken')
        alert('You have been Logged Out');
        window.location = '/login.html';
    });

    $('body').on('click', '.addToCartButton', function (event) {
        if (localStorage.getItem('authToken') === null) {
            alert('you are not logged in');
            window.location = '/login.html';
        } else {
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
                'image': imgValue,
            };

            $.ajax({
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(nameObject),
                    url: '/add-to-cart',
                    headers: {
                        "Authorization": 'Bearer ' + localStorage.getItem('authToken')
                    }
                })
                .done(function (result) {
                    console.log('result', result);
                    populateCartContainer();
                })
                .fail(function (jqXHR, error, errorThrown) {
                    console.log(jqXHR);
                    console.log(error);
                    console.log(errorThrown);
                    $('.errorMessage').show();
                    $('.errorMessage p').text("Opps there was an error handeling your request.")
                });
        }
    });


    $('body').on('click', '.clearCartButton', function (event) {
        //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
        event.preventDefault();
        event.stopPropagation();
        var idValue = $(this).parent().find('.deleteIdValue').val();
        console.log('id value', idValue);

        var bookid = {
            _id: idValue,
        };

        $.ajax({
                method: 'DELETE',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(bookid),
                url: '/delete-cart',
            })
            .done(function (result) {
                console.log(result);
                populateCartContainer();
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                $('.errorMessage').show();
                $('.errorMessage p').text("Opps there was an error handeling your request.")
            });
    });

    $('body').on('click', '.delComment', function (event) {
        //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
        event.preventDefault();
        event.stopPropagation();
        var commentId = $(this).parent().parent().find('.delCommentId').val();
        console.log('noteId value', commentId);

        var comments = {
            _id: commentId
        };

        $.ajax({
                method: 'DELETE',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(comments),
                url: '/delete-comment',
            })
            .done(function (result) {
                console.log(result);
                populateCartContainer();
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                $('.errorMessage').show();
                $('.errorMessage p').text("Opps there was an error handeling your request.")
            });
    });
    $('.commentInput').submit(function (event) {
        event.preventDefault();
        var notes = $('.userComment').val();
        populateNotes(notes);
    });

    //login and create new user//

    $('body').on('submit', "#log", function (event) {
        event.preventDefault();
        var username = $('.js-user').val();
        var password = $(".js-password").val();
        console.log(username, password);
        login(username, password);
    });

    $('body').on("submit", "#create", function (event) {
        event.preventDefault();
        var username = $(".js-userReg").val();
        var password = $(".js-passwordReg").val();
        console.log(username, password);
        usersApiCall(username, password);
    });
});
