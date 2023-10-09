const form = document.getElementById('restartPasswordForm');

form.addEventListener('submit',e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    fetch('/api/users/restartPassword',{
        method:'PUT',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>{
        if(result.status===200){
            req.logger.info("Contraseña restaurada");
            window.location.replace('/login');
        }
    })
})