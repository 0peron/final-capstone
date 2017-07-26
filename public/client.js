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
        addHTML += "add to cart";
        addHTML += "</button>";
        addHTML += "</form>";
        addHTML += "</li>";
    });
    $('.bookTitles ul').html(addHTML);
}



$(window).click(function() {
    $('.dropdown-content').hide();
});

function populateCartContainer() {
    $(document).on('click', '.dropbtn', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $('.dropdown-content').show();
    });

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
                addHTML += "<li class='dropdown'>";
                addHTML += "<h2>";
                addHTML += "<button class='clearCartButton'>";
                addHTML += "<img src='/image/cancel-square.png' class='clear-cart-icon'>";
                addHTML += '</button>';
                addHTML += "<a href='" + book.link + "' target='_blank'>" + book.name + "</a>";
                addHTML += "<input type='hidden' class='deleteIdValue' value='" + book.idValue + "'>";
                addHTML += "</h2>";
                addHTML += "</li>";
                alert(book.name + ' added to cart');
            });
            $(".drop ul").html(addHTML);
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
});


$(document).on('click', '.addToCartButton', function(event) {
    //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
    event.preventDefault();
    $('.dropdown-content').show();
    //get the value from the input box
    var bookValue = $(this).parent().find('.addToCartBookValue').val();
    var linkValue = $(this).parent().find('.addToCartLinkValue').val();
    var idValue = $(this).parent().find('.addToCartIdValue').val();
    var imgValue = $(this).parent().find('.addToCartImgValue').val();
    var desValue = $(this).parent().find('.addToCartDesValue').val();
    console.log(bookValue, linkValue, imgValue);


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

$(document).on('click', '.clearCartButton', function(event) {
    //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
    event.preventDefault();
    event.stopPropagation();
    $('.dropdown-content').show();
    console.log('delete fire');
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
