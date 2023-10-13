const form = document.getElementById('resetPasswordForm');

form.addEventListener('submit', e=>{
    e.preventDefault();
    const emailInput = form.querySelector('input[name="email"]').value;
    console.log(emailInput);
    console.log(typeof emailInput)
    const data = { email: emailInput };
    console.log(data)
    fetch('/api/users/sendResetPassEmail',{
        method:'POST',
        body:JSON.stringify(data),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>{
        if(result.status===200){
            console.log("Email enviado");
        }
    })
    console.log('despues del fetch de email');
   
})
