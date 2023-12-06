function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const token = getCookie('cookieToken'); 


async function getUserData() {
  const response = await fetch('/api/users/currentUser', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
}


function logout(user) {
  
    fetch('/api/users/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user })
    })
    .then(result => {
      if (result.status === 200) {
        // Logout was successful, redirect to the login page
        setTimeout(() => {
          window.location.replace('/');
        }, 3000); // Redirect after 3 seconds
      }
    })
    .catch(error => {
        console.error('Error during logout:', error);
      });
  }

  

  // Call the logout function when the document is loaded
  document.addEventListener('DOMContentLoaded', () => {
    getUserData()
    .then(user => {
      logout(user.payload);
    })
    .catch(error => {
      console.error('Error getting user data:', error);
    });
});
