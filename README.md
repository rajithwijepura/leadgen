# Simple Express.js Server

This is a basic Express.js server created to demonstrate a simple backend setup, including user registration, login functionality, and Google OAuth 2.0 integration.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (which includes npm)
- Libraries: `express`, `bcrypt`, `google-auth-library`, `jsonwebtoken` (will be installed via `npm install`)

## Configuration

### Google OAuth 2.0 Credentials

To use the Google OAuth functionality, you need to obtain a `Client ID` and `Client Secret` from the [Google Cloud Platform Console](https://console.cloud.google.com/).

1.  Create a new project or select an existing one.
2.  Navigate to "APIs & Services" > "Credentials".
3.  Click "Create Credentials" > "OAuth client ID".
4.  Choose "Web application" as the application type.
5.  Add an "Authorized JavaScript origin" (e.g., `http://localhost:3000` if your frontend runs there).
6.  Add an "Authorized redirect URI": `http://localhost:3001/api/auth/google/callback` (assuming the server runs on port 3001).
7.  Once created, copy the `Client ID` and `Client Secret`.
8.  **Update `server.js`:** Replace the placeholder values for `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` with your actual credentials.

```javascript
// In server.js
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const GOOGLE_CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET';
```

**Note:** Without valid credentials, the Google OAuth flow will not fully work but will show a configuration error message. The current implementation includes a simulation for the callback part if credentials are not set, allowing for partial testing of the flow.

## Getting Started

1.  **Clone the repository or download the files.**

2.  **Navigate to the project directory:**
    ```bash
    cd path/to/your/project-directory
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Configure Google Credentials (see above).**

5.  **Run the server:**
    ```bash
    npm start
    ```
    You should see a message in the console: `Server listening at http://localhost:3001`

## API Endpoints

### `GET /api/status`

-   **Description:** Returns the current status of the server.
-   **Method:** `GET`
-   **URL:** `/api/status`
-   **Success Response:**
    -   **Code:** 200
    -   **Content:** `{ "status": "Server is running" }`

### `POST /api/register`

-   **Description:** Registers a new user with username and password.
-   **Method:** `POST`
-   **URL:** `/api/register`
-   **Request Body:** `{ "username": "testuser", "password": "password123" }`
-   **Success Response:** `{ "message": "User registered successfully", "userId": 1 }` (201 Created)

### `POST /api/login`

-   **Description:** Logs in an existing user with username and password.
-   **Method:** `POST`
-   **URL:** `/api/login`
-   **Request Body:** `{ "username": "testuser", "password": "password123" }`
-   **Success Response:** `{ "message": "Login successful", "token": "dummy-jwt-token" }` (200 OK)

### Google OAuth 2.0 Endpoints

This server supports Google OAuth 2.0 for user authentication.

**Flow Overview:**
1.  The client (e.g., your frontend application) directs the user to `GET /api/auth/google`.
2.  The server redirects the user to Google's authentication page.
3.  The user authenticates with Google and grants permissions.
4.  Google redirects the user back to `GET /api/auth/google/callback` with an authorization code.
5.  The server (currently simulates) exchanges this code for tokens, fetches user profile information, and then finds or creates a user in its database.
6.  A token is issued to the client for future authenticated requests.

#### `GET /api/auth/google`

-   **Description:** Initiates the Google OAuth 2.0 authentication flow. It constructs the Google OAuth URL and redirects the user to Google's authentication service.
-   **Method:** `GET`
-   **URL:** `/api/auth/google`
-   **Action:** Redirects to Google's OAuth 2.0 consent screen.
-   **Note:** Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to be correctly configured in `server.js`. If not, it will return a 500 error.

#### `GET /api/auth/google/callback`

-   **Description:** Handles the callback from Google after the user has authenticated. It receives an authorization code from Google.
    **Currently, this endpoint simulates the token exchange and profile fetching.** It will log the received code, then attempt to find or create a user based on a pre-defined simulated Google profile (`testuser@google.com`).
-   **Method:** `GET`
-   **URL:** `/api/auth/google/callback` (This is the `redirect_uri` you configure in Google Cloud Console)
-   **Query Parameters:**
    -   `code` (string): The authorization code provided by Google.
-   **Success Response (Simulated):**
    -   **Code:** 200 OK
    -   **Content:** `{ "message": "Google login successful", "token": "dummy-jwt-token-google-USER_ID", "userId": USER_ID, "username": "testuser@google.com" }`
-   **Error Responses:**
    -   **Code:** 400 Bad Request
        -   **Content:** `Authorization code missing.`
    -   **Code:** 500 Internal Server Error
        -   **Content:** `Error during Google authentication.` (e.g., if `code` exchange fails in a real scenario)

---

**Example `curl` commands are not directly applicable for the OAuth redirect flow as it involves browser interaction. To test:**
1. Ensure the server is running.
2. Open `http://localhost:3001/api/auth/google` in your browser.
3. If credentials are set up, you'll be taken to Google. After authentication, Google will redirect to `http://localhost:3001/api/auth/google/callback?code=...`.
4. If credentials are not set up, `/api/auth/google` will show an error. The callback can be tested by manually providing a dummy `code` (e.g., `http://localhost:3001/api/auth/google/callback?code=testcode123`) to see the simulated user creation/login.

This will output the JSON response from the callback.
```json
{
  "message": "Google login successful",
  "token": "dummy-jwt-token-google-1",
  "userId": 1,
  "username": "testuser@google.com"
}
```
(The `userId` might vary based on existing users in the in-memory store).
