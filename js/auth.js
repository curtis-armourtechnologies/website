// MSAL Configuration
const msalConfig = {
    auth: {
      clientId: '371b9466-6c79-433a-8328-4c641f9cedff', // Replace with your Azure App Registration Client ID
      authority: 'https://login.microsoftonline.com/common', // Common authority for all users
      redirectUri: window.location.href // The URI to redirect back to (can be /dashboard)
    },
    cache: {
      cacheLocation: 'sessionStorage', // Stores the cache in sessionStorage (for session-based logins)
      storeAuthStateInCookie: true // Helps with IE 11 compatibility
    }
  };
  
  const msalInstance = new msal.PublicClientApplication(msalConfig);
  
  // Check if the user is logged in
  msalInstance.handleRedirectPromise().then(response => {
    if (response) {
      console.log("Logged in successfully:", response);
      fetchUserData(response.accessToken); // Call a function to fetch user data
    } else {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        // User is already logged in, use the first account
        fetchUserData();
      } else {
        // No accounts found, initiate login flow
        msalInstance.loginRedirect(); // Redirects the user to Microsoft login
      }
    }
  }).catch(error => {
    console.error(error);
  });
  
  function fetchUserData(accessToken) {
    // Make a Graph API call to fetch user data using the access token
    fetch('https://graph.microsoft.com/v1.0/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Pass the access token here
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(userData => {
      const userDiv = document.getElementById('user-info');
      userDiv.innerHTML = `<h2>User Info</h2><pre>${JSON.stringify(userData, null, 2)}</pre>`;
    })
    .catch(err => {
      console.error('Error fetching user data from Graph API:', err);
      document.getElementById('user-info').innerHTML = '<p>Failed to load user data.</p>';
    });
  
    // Organization data call
    fetch('https://graph.microsoft.com/v1.0/organization', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(orgData => {
      const orgDiv = document.getElementById('org-info');
      orgDiv.innerHTML = `<h2>Organization Info</h2><pre>${JSON.stringify(orgData, null, 2)}</pre>`;
    })
    .catch(err => {
      console.error('Error fetching organization data from Graph API:', err);
      document.getElementById('org-info').innerHTML = '<p>Failed to load organization data.</p>';
    });
  }
  