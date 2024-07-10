const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password)
    {
        if(!isValid(username))
        {
            users.push({"username": username, "password": password});
            res.status(200).json("Username and password registered successfully");
        }
        else {
            res.status(404).json("User with the username " + username + " already exists");
        }
    }
    else {
        res.status(404).json("Username and/or password was not provided. Please provide both a username and a password to register")
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;

    if(books[isbn])
        res.send(books[isbn])
    else
        res.status(403).json("invalid ISBN")
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let bookDetails = [];
    let bookKeys = Object.keys(books);

    bookKeys.forEach(key => {
        if (books[key].author === author)
        {
            bookDetails.push(books[key]);
        }
    });

    if(bookDetails != [])
    {
        res.send(bookDetails);
    } else {
        res.status(403).json("Author does not exist");
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let bookDetails = [];
    let bookKeys = Object.keys(books);

    bookKeys.forEach(key => {
        if (books[key].title === title)
        {
            bookDetails.push(books[key]);
        }
    });

    if(bookDetails != [])
    {
        res.send(bookDetails);
    } else {
        res.status(403).json("A book with specified title does not exist");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn

    if(books[isbn])
        res.send(books[isbn].reviews)
    else
        res.status(403).json("invalid ISBN")
});

module.exports.general = public_users;
