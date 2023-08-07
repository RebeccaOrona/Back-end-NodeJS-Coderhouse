function logout() {
    fetch('/api/sessions/logout', {
      method: 'GET'
    })
      .then(result => {
        if (result.status === 200) {
          // Logout was successful, redirect to the login page
          setTimeout(() => {
            window.location.replace('/login');
          }, 3000); // Redirect after 3 seconds
        }
      })
      .catch(error => {
        console.error('Error during logout:', error);
        // Handle any error that occurred during logout (optional)
      });
  }
  
  // Call the logout function when the document is loaded
  document.addEventListener('DOMContentLoaded', () => {
    logout();
  });
