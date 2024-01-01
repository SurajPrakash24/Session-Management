const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const users = require('./usersData');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Initialize express-session middleware
app.use(
    session({
      secret: 'mySecretKey',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
);

// SignUp API endpoint
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const newUser = { username, password };
    users.push(newUser);
    res.status(201).send('User created successfully');
});

// Login API endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) {
        res.status(401).send('Invalid credentials');
    } else {
        // Set session data upon successful login
        req.session.username = username;
        res.status(200).send('Login successful');
    }
});

// Logout API endpoint
app.post('/logout', (req, res) => {
    // Destroy the session upon logout
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send('Error logging out');
        } else {
            res.clearCookie('connect.sid'); // Clear session cookie
            res.status(200).send('Logged out successfully');
        }
    });
});

// Protected Area endpoint
app.get('/protected', (req, res) => {
    // Check if user is authenticated (session exists)
    if (req.session && req.session.username) {
        res.status(200).send(`Welcome to the protected area, ${req.session.username}!`);
    } else {
        res.status(401).send('Please login to access this resource.');
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});