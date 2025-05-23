import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Assuming react-router-dom is used
import { useAuth } from '../contexts/AuthContext';

const GoogleAuthCallback: React.FC = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    console.log('GoogleAuthCallback: Mounted. Location:', location);

    // Attempt to parse token from URL fragment (#token=...)
    // Or from query string (?token=...)
    // The backend's /api/auth/google/callback is expected to redirect here
    // with the token after server-side processing.

    let token: string | null = null;

    // Check fragment
    if (location.hash) {
      const params = new URLSearchParams(location.hash.substring(1)); // Remove #
      token = params.get('token');
      console.log('GoogleAuthCallback: Token from hash:', token);
    }

    // If not in fragment, check query string (less common for this pattern but good to check)
    if (!token) {
      const params = new URLSearchParams(location.search);
      token = params.get('token');
      console.log('GoogleAuthCallback: Token from query:', token);
    }
    
    // If the backend sends user data as JSON in a query parameter
    // (as per the backend's /api/auth/google/callback response)
    // For example, if backend redirects to /auth/google/callback?userData={"token": "...", ...}
    if(!token) {
        const params = new URLSearchParams(location.search);
        const userDataString = params.get('userData');
        if (userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                if (userData && userData.token) {
                    token = userData.token;
                    console.log('GoogleAuthCallback: Token from userData query parameter:', token);
                }
            } catch (e) {
                console.error("GoogleAuthCallback: Error parsing userData from query string", e);
            }
        }
    }


    if (token) {
      login(token);
      console.log('GoogleAuthCallback: Token found and login function called.');
      navigate('/'); // Redirect to dashboard/home page
    } else {
      console.warn('GoogleAuthCallback: No token found in URL. Redirecting to login.');
      navigate('/login'); // Redirect to login page if no token
    }
  }, [login, location, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Processing Google Authentication...</h2>
      <p>Please wait while we securely log you in.</p>
      {/* You can add a spinner or loading animation here */}
    </div>
  );
};

export default GoogleAuthCallback;
