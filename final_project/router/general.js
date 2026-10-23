const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (isValid(username)) {
        return res.status(409).json({ message: "Username already exists" });
      }
  
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfully registered" });
    }
  
    return res.status(400).json({ message: "Username and password are required" });
  });

// Get the book list available in the shop

public_users.get('/', function (req, res) {
    return res.status(200).json(books);
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    }
    return res.status(404).json({ message: "Book not found" });
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const result = Object.values(books).filter(
      book => book.author.toLowerCase() === author
    );
    return res.status(200).json(result);
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const result = Object.values(books).filter(
      book => book.title.toLowerCase() === title
    );
    return res.status(200).json(result);
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
    }
    return res.status(404).json({ message: "Book not found" });
  });
  const axios = require('axios');

  const booksApiUrl = 'http://localhost:5000';
  
  async function getAllBooks() {
      try {
          const response = await axios.get(booksApiUrl + '/');
          return response.data;
      } catch (error) {
          return { error: error.message };
      }
  }
  
  async function getBookByISBN(isbn) {
      try {
          const response = await axios.get(booksApiUrl + '/isbn/' + encodeURIComponent(isbn));
          return response.data;
      } catch (error) {
          return { error: error.message };
      }
  }
  
  async function getBooksByAuthor(author) {
      try {
          const response = await axios.get(booksApiUrl + '/author/' + encodeURIComponent(author));
          return response.data;
      } catch (error) {
          return { error: error.message };
      }
  }
  
  async function getBooksByTitle(title) {
      try {
          const response = await axios.get(booksApiUrl + '/title/' + encodeURIComponent(title));
          return response.data;
      } catch (error) {
          return { error: error.message };
      }
  }
  
  module.exports.getAllBooks = getAllBooks;
  module.exports.getBookByISBN = getBookByISBN;
  module.exports.getBooksByAuthor = getBooksByAuthor;
  module.exports.getBooksByTitle = getBooksByTitle;
module.exports.general = public_users;
