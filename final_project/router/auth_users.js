const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// Check if username exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Check username and password
const authenticatedUser = (username, password) => {
    return users.some(
        user => user.username === username && user.password === password
    );
};

// Only registered users can login
regd_users.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password required"
        });
    }

    if (authenticatedUser(username, password)) {

        let accessToken = jwt.sign(
            { username: username },
            "access",
            { expiresIn: 3600 }
        );

        req.session.authorization = {
            accessToken
        };

        req.session.username = username;

        return res.status(200).json({
            message: "User successfully logged in",
            token: accessToken
        });
    }

    return res.status(208).json({
        message: "Invalid Login. Check username and password"
    });

});


// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.username;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });

});


// Delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.session.username;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (
        books[isbn].reviews &&
        books[isbn].reviews[username]
    ) {
        delete books[isbn].reviews[username];

        return res.status(200).json({
            message: "Review deleted successfully"
        });
    }

    return res.status(404).json({
        message: "Review not found"
    });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;