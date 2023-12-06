
function updateRole(button) {
    const form = button.parentElement;
    const email = form.getAttribute('data-email');
    const selectedRole = form.querySelector('#role').value;

    const data = {
        email: email,
        role: selectedRole
    };

    fetch('/api/users/premium', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(result => {
        if(result.status == 200){
            window.location.replace('/api/users');
        }
    })
    .catch(error => {
        console.error('Error updating role:', error);
    });
}

function deleteUser(button) {
    const form = button.parentElement;
    const email = form.getAttribute('data-email');
    let data = {
        email: email
    }

    fetch('/api/users/deleteUser', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(result => {
        if(result.status == 200){
            window.location.replace('/api/users');
        }
    })
    .catch(error => {
        console.error('Error deleting user:', error);
    });

}
