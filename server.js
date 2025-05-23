const express = require('express');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library'); // Corrected import
const jwt = require('jsonwebtoken'); // For future use
const app = express();
const port = 3001;

// --- Configuration ---
// IMPORTANT: Replace these with your actual Google Client ID and Secret
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const GOOGLE_CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET';
const REDIRECT_URI = `http://localhost:${port}/api/auth/google/callback`;

const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

app.use(express.json()); // Middleware to parse JSON bodies

let users = []; // In-memory user store
let nextUserId = 1; // Simple ID generator

app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running' });
});

// --- Standard Registration ---
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newUser = {
      id: nextUserId++,
      username,
      passwordHash,
      authProvider: 'local'
    };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// --- Standard Login ---
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const user = users.find(u => u.username === username && u.authProvider === 'local');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // In a real app, generate a JWT here
    res.status(200).json({ message: 'Login successful', token: 'dummy-jwt-token' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// --- Google OAuth ---

// 1. Initial Redirect to Google
app.get('/api/auth/google', (req, res) => {
  if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID' || GOOGLE_CLIENT_SECRET === 'YOUR_GOOGLE_CLIENT_SECRET') {
    return res.status(500).send('Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server.js');
  }
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    prompt: 'consent' // Optional: forces consent screen
  });
  res.redirect(authorizeUrl);
});

// 2. Google OAuth Callback
app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code missing.');
  }

  console.log(`Received authorization code: ${code}`);

  // Simulate token exchange and profile fetch
  // In a real app, you would exchange the code for tokens and then fetch the user's profile.
  // const { tokens } = await oauth2Client.getToken(code);
  // oauth2Client.setCredentials(tokens);
  // const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  // const { data: googleProfile } = await oauth2.userinfo.get();
  // const { email, sub: googleId, name } = googleProfile;

  // --- Simulation Start ---
  const simulatedGoogleProfile = {
    email: 'testuser@google.com',
    sub: 'dummy-google-id-12345', // googleId
    name: 'Test Google User'
  };
  const { email, sub: googleId, name } = simulatedGoogleProfile;
  // --- Simulation End ---

  try {
    let user = users.find(u => u.authProvider === 'google' && u.googleId === googleId);

    if (!user) {
      // User not found, create a new one
      user = {
        id: nextUserId++,
        username: email, // Or a generated username based on email/name
        googleId: googleId,
        displayName: name,
        authProvider: 'google',
        passwordHash: null // No password for OAuth users
      };
      users.push(user);
      console.log('New Google user created:', user);
    } else {
      console.log('Existing Google user found:', user);
    }

    // In a real app, generate a JWT for this user
    const token = `dummy-jwt-token-google-${user.id}`;

    // In a real app, generate a JWT for this user
    const token = `dummy-jwt-token-google-${user.id}`;

    // Redirect to the frontend callback URL with the token in the hash fragment
    const frontendCallbackUrl = 'http://localhost:5173/auth/google/callback';
    res.redirect(`${frontendCallbackUrl}#token=${token}`);

  } catch (error) {
    console.error('Error in Google OAuth callback:', error);
    // if (error.response) {
    //   console.error('Google API Error:', error.response.data);
    // }
    res.status(500).send('Error during Google authentication.');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
