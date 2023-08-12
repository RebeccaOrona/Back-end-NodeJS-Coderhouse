import sweetalert2 from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.20/+esm'
const form = document.getElementById('loginForm');



form.addEventListener('submit',e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=> obj[key] = value);
    fetch('/api/sessions/login',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(result=>{
        if(result.status===200){
            window.location.replace('/products');
        } else if (result.status === 403) {
            sweetalert2.fire({
                icon: 'error',
                title: 'Ups...',
                text: 'Contraseña no valida!',
            });
        };
    })
})