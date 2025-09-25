// Test file with obvious security vulnerabilities for testing the scanner

const express = require('express');
const app = express();

// Hardcoded secrets - should be detected
const API_KEY = "sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop";
const PASSWORD = "super_secret_password_123";
const GITHUB_TOKEN = "ghp_1234567890abcdefghijklmnopqrstuvwxyz123";

// SQL Injection vulnerability
app.get('/users', (req, res) => {
  const userId = req.query.id;
  const query = "SELECT * FROM users WHERE id = " + userId; // Vulnerable to SQL injection
  db.execute(query, (err, results) => {
    res.json(results);
  });
});

// XSS vulnerability
app.get('/profile', (req, res) => {
  const username = req.query.username;
  const html = "<h1>Welcome " + username + "</h1>"; // XSS vulnerability
  res.send(html);
});

// Command Injection vulnerability
app.post('/backup', (req, res) => {
  const filename = req.body.filename;
  const command = "tar -czf backup.tar.gz " + filename; // Command injection
  exec(command, (error, stdout, stderr) => {
    res.send('Backup created');
  });
});

// Weak cryptography
const crypto = require('crypto');
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex'); // Weak MD5
}

// Path traversal vulnerability
app.get('/download', (req, res) => {
  const filename = req.query.file;
  const filePath = "./uploads/" + filename; // Path traversal vulnerability
  res.sendFile(filePath);
});

// Eval usage - dangerous
app.post('/calculate', (req, res) => {
  const expression = req.body.expr;
  const result = eval(expression); // Code injection via eval
  res.json({ result: result });
});

console.log('Server starting with vulnerabilities...');