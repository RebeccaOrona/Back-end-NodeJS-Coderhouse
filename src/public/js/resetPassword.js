import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.20/+esm';

document.addEventListener('DOMContentLoaded', function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('token');
    const expirationTime = urlParams.get('exp');

    if (!token || !expirationTime) {
        // Handle case where token or expiration time is missing
        alert('Token or expiration time is missing');
    } else {
        const currentTime = Math.floor(Date.now() / 1000);
        console.log(token)
        if (currentTime > expirationTime) {
            window.location.href = '/tokenExpired';
        } else {
            const form = document.getElementById('resetPasswordForm');
            const passwordField = form.querySelector('input[name="password"]');
            const passwordRepField = form.querySelector('input[name="passwordrep"]');
            form.addEventListener('submit', e=>{
                e.preventDefault();
                if (passwordField.value.trim() === '' || passwordRepField.value.trim() === '') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `Los campos de contraseñas no pueden estar vacios`,
                        toast: true,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 3000
                      });
                }
                const headers = new Headers();
                headers.append('Authorization', `Bearer ${token}`);
                headers.append('Content-Type', 'application/json');
                const data = new FormData(form);
                const obj = {};
                data.forEach((value,key)=>obj[key]=value);
                fetch('/api/users/resetPassword',{
                    method:'PUT',
                    body:JSON.stringify(obj),
                    headers: headers
                }).then(result=>{
                    if(result.status===200){
                        console.log("Contraseña restablecida");
                        Swal.fire({
                            icon: 'success',
                            title: 'Restablecimiento exitoso',
                            text: `La contraseña se restablecio correctamente, redireccionando...`,
                            toast: true,
                            position: 'top-right',
                            showConfirmButton: false,
                            timer: 3000
                          });
                        setTimeout(() => {
                            window.location.replace('/');
                        }, 3000); // Redirect after 3 seconds
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'No se logro restablecer la contraseña',
                            text: `La nueva contraseña no debe ser la misma que la anterior`,
                            toast: true,
                            position: 'center',
                            showConfirmButton: true
                          });
                    }
                })
            })
        }
    }
})
