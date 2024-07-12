//script.js:


$(document).ready(function() {
    // Function to show/hide nav on header click
    $('#menu-icon').click(function() {
        $('nav ul').toggle();
    });

    // Show nav links when cursor moves in and hide when cursor moves out
    $('nav').hover(function() {
        $(this).find('ul').stop(true, true).slideDown(300);
    }, function() {
        $(this).find('ul').stop(true, true).slideUp(300);
    });

    // Load saved items from localStorage
    function loadSavedItems() {
        return JSON.parse(localStorage.getItem('savedItems')) || [];
    }

    // Load comments from localStorage or initialize if empty
    function loadComments() {
        return JSON.parse(localStorage.getItem('comments')) || [];
    }

    // Save comments to localStorage
    function saveComments(comments) {
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    // Save items to localStorage
    function saveItems(items) {
        localStorage.setItem('savedItems', JSON.stringify(items));
    }

    // Save for later functionality with animation
    $('.save-for-later').click(function() {
        const item = {
            id: $(this).closest('.item').data('item-id'),
            name: $(this).closest('.item').data('item-name'),
            image: $(this).closest('.item').data('item-image'),
            liked: false,
            comments: []
        };
        let savedItems = loadSavedItems();
        if (!savedItems.some(savedItem => savedItem.id === item.id)) {
            savedItems.push(item);
            saveItems(savedItems);
            $(this).text('Saved').prop('disabled', true); // Update button text and disable it
            // Animation effects chained together
            $(this).animate({ backgroundColor: '#217dbb' }, 200)
                   .animate({ backgroundColor: '#3498db' }, 200)
                   .animate({ backgroundColor: '#217dbb' }, 200)
                   .animate({ backgroundColor: '#3498db' }, 200);

            alert('Item saved! You have ' + savedItems.length + ' items saved.');
        }
    });

    // Handle like form submission with animation
    $('.like-form').on('submit', function(e) {
        e.preventDefault();
        const button = $(this).find('button[type="submit"]');
        const itemId = $(this).closest('.item').data('item-id');
        let savedItems = loadSavedItems();
        let savedItem = savedItems.find(savedItem => savedItem.id === itemId);
        if (savedItem && !savedItem.liked) {
            savedItem.liked = true;
            saveItems(savedItems);
            
            // Animation loop
            $('header, footer').animate({ backgroundColor: '#FF0000' }, 200)
                               .animate({ backgroundColor: '#FF7F00' }, 200)
                               .animate({ backgroundColor: '#FFFF00' }, 200)
                               .animate({ backgroundColor: '#00FF00' }, 200)
                               .animate({ backgroundColor: '#0000FF' }, 200)
                               .animate({ backgroundColor: '#4B0082' }, 200)
                               .animate({ backgroundColor: '#8B00FF' }, 200);

            button.animate({ backgroundColor: '#25a25a' }, 200)
                  .animate({ backgroundColor: '#2ecc71' }, 200)
                  .animate({ backgroundColor: '#25a25a' }, 200)
                  .animate({ backgroundColor: '#2ecc71' }, 200, function() {
                      alert('Thank you for liking this item!');
                      $(this).text('Liked').prop('disabled', true); // Update button text and disable it
                  });
        }
    });

    // Function to display saved items on the page
    function displaySavedItems() {
        $('#saved-list').empty(); // Clear existing items
        let savedItems = loadSavedItems();

        savedItems.forEach(item => {
            let $savedItem = $('<li class="saved-item">' +
                               '<img src="' + item.image + '" alt="' + item.name + '">' +
                               item.name + 
                               ' <button class="remove-item">Remove</button> ');
            $savedItem.find('.remove-item').click(function() {
                removeSavedItem(item.id); // Remove item when remove button is clicked
            });
            $('#saved-list').append($savedItem);
        });
    }

    // Function to remove a saved item
    function removeSavedItem(itemId) {
        let savedItems = loadSavedItems();
        let updatedItems = savedItems.filter(item => item.id !== itemId);
        saveItems(updatedItems);
        displaySavedItems(); // Update saved items display after removal
    }

    // Handle comment form submission
    $('#comment-section').submit(function(e) {
        e.preventDefault();
        let commentText = $('#comment').val().trim();
        if (commentText) {
            let comment = {
                id: Date.now(), // Unique ID for each comment
                text: commentText
            };
            let comments = loadComments();
            comments.push(comment);
            saveComments(comments);
            $('#comment').val(''); // Clear the comment textarea
            displayComments(); // Update displayed comments
        }
    });

    // Function to display comments
    function displayComments() {
        $('#comments-list').empty(); // Clear existing comments
        let comments = loadComments();

        comments.forEach(comment => {
            let $commentItem = $('<li class="comment">' +
                                '<span>' + comment.text + '</span>' +
                                '<div class="comment-actions">' +
                                '<button class="edit-button">Edit</button>' +
                                '<button class="delete-button">Delete</button>' +
                                '</div>' +
                                '</li>');

            // Edit comment button functionality
            $commentItem.find('.edit-button').click(function() {
                editComment(comment.id);
            });

            // Delete comment button functionality
            $commentItem.find('.delete-button').click(function() {
                removeComment(comment.id);
            });

            $('#comments-list').append($commentItem);
        });
    }

    // Function to edit a comment
    function editComment(commentId) {
        let comments = loadComments();
        let comment = comments.find(comment => comment.id === commentId);
        if (comment) {
            let newText = prompt('Enter new comment text:', comment.text);
            if (newText !== null) {
                comment.text = newText;
                saveComments(comments);
                displayComments(); // Update displayed comments
            }
        }
    }

    // Function to remove a comment
    function removeComment(commentId) {
        let comments = loadComments();
        let updatedComments = comments.filter(comment => comment.id !== commentId);
        saveComments(updatedComments);
        displayComments(); // Update displayed comments
    }


    function updateButtonStates() {
        let savedItems = loadSavedItems(); // Load the current saved items
        
        // Update save-for-later buttons
        $('.save-for-later').each(function() {
            let itemId = $(this).closest('.item').data('item-id'); // Assuming data attribute is 'data-item-id'
            let itemExists = savedItems.some(savedItem => savedItem.id === itemId);
    
            if (itemExists) {
                $(this).text('Saved').prop('disabled', true); // Update button text and disable it
            } else {
                $(this).text('Save for Later').prop('disabled', false); // Revert to default state
            }
        });
    
        // Update like buttons
        $('.like-form').each(function() {
            let itemId = $(this).closest('.item').data('item-id'); // Assuming data attribute is 'data-item-id'
            let savedItem = savedItems.find(savedItem => savedItem.id === itemId);
    
            if (savedItem && savedItem.liked) {
                $(this).find('button[type="submit"]').text('Liked').prop('disabled', true); // Update button text and disable it
            } else {
                $(this).find('button[type="submit"]').text('Like').prop('disabled', false); // Revert to default state
            }
        });
    }

    // Display saved items and comments when the page loads
    displaySavedItems();
    displayComments();
    updateButtonStates();
    // Initialize DataTable
    $('#example').DataTable();
});
