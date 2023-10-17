import sweetalert2 from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.20/+esm'
const form = document.getElementById('loginForm');



form.addEventListener('submit',e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=> obj[key] = value);
    fetch('/api/users/login',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(response => response.json())  // Parse the response JSON
    .then(result => {
        if (result.status === "success") {
            window.location.replace('/products');
        } else if (result.status == "error") {
                sweetalert2.fire({
                    icon: 'error',
                    title: 'Ups...',
                    text: 'Contraseña no valida!',
                });
            };
    })

})