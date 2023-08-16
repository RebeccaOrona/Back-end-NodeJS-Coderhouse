import sweetalert2 from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.20/+esm'
const form = document.getElementById('registerForm');

form.addEventListener('submit',e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    fetch('/api/sessions/register',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=> {
        if(result.status===200){
            window.location.replace('/');
        } else if (result.status === 400) {
            sweetalert2.fire({
                icon: 'error',
                title: 'Ocurrio un error...',
                text: 'Datos no validos!',
            });
        };
})
})