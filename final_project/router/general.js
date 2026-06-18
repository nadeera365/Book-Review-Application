const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const general_routes = express.Router();


function doesExist(username) {
    return users.some(user => user.username === username);
}

general_routes.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {

        if (!doesExist(username)) {

            users.push({ username: username, password: password });

            return res.status(200).json({
                message: "User successfully registered"
            });

        } else {
            return res.status(409).json({
                message: "User already exists"
            });
        }

    }

    return res.status(400).json({
        message: "Username and password are required"
    });

});

// Get the book list available in the shop
/*public_users.get('/',function (req, res) {
   return res.status(200).json(books);
});*/
const axios = require("axios");

general_routes.get("/books", async(req,res)=>{
    try{
        const response = await axios.get("http://localhost:5000/books");
        return res.json(books);
    }catch(error){
        return res.status(500).json({message:"Error fetching books"});
    }
});

// Get book details based on ISBN
/*public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }
    return res.status(404).json({ message: "Book not found" });
 });*/
 general_routes.get('/isbn/:isbn',(req,res)=>{
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.json(book);
    }

    return res.status(404).json({ message: "Book not found" });
 });
  
// Get book details based on author
/*public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  const result = {};

  // 1. Get all book ISBN keys
  const allBooks = Object.keys(books);

  // 2. Loop through books
  allBooks.forEach((isbn) => {
    if (books[isbn].author === authorName) {
      result[isbn] = books[isbn];
    }
  });

  // 3. Return result
  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({
    message: "No books found for this author"
  });
});*/
general_routes.get('/author/:author', async(req,res)=>{
    try{
        const author = req.params.author;
        let result = [];

        for(let key in books){
            if(books[key].author === author){
                result.push(books[key]);
            }
        }
        return res.json(result);
    }catch(error){
        return res.status(500).json({message:"Error"})
    }
});

// Get all books based on title
/*public_users.get('/title/:title',function (req, res) {
  const titleName = req.params.title;
  const result = {};

  // 1. Get all book ISBN keys
  const allBooks = Object.keys(books);

  // 2. Loop through books
  allBooks.forEach((isbn) => {
    if (books[isbn].author === titleName) {
      result[isbn] = books[isbn];
    }
  });

  // 3. Return result
  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({
    message: "No books found for this title"
  });
});*/
general_routes.get("/title/:title", async (req, res) => {
    try {
        const title = req.params.title;
        let result = [];

        for (let key in books) {
            if (books[key].title === title) {
                result.push(books[key]);
            }
        }

        return res.json(result);
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
});

//  Get book review
general_routes.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});

module.exports.general = general_routes;
