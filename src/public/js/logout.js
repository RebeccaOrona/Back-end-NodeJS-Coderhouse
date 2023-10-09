function logout() {
    fetch('/api/users/logout', {
      method: 'GET'
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
        req.logger.error('Error during logout:', error);
        // Handle any error that occurred during logout (optional)
      });
  }
  
  // Call the logout function when the document is loaded
  document.addEventListener('DOMContentLoaded', () => {
    logout();
  });
