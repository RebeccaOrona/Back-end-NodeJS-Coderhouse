const form = document.getElementById('resetPasswordForm');

form.addEventListener('submit', e=>{
    e.preventDefault();
    const emailInput = form.querySelector('input[name="email"]').value;
    const data = { email: emailInput };
    const messageContainer = document.createElement('div'); // Create a new div element
    messageContainer.textContent = "Se le envió un correo a su dirección de email con un link para restablecer su contraseña.";
    messageContainer.style.backgroundColor = "white";
    messageContainer.style.border = "2px solid #007BFF";
    messageContainer.style.padding = "10px";
    messageContainer.style.color = "black";
    messageContainer.style.marginTop = "10px";
    fetch('/api/users/sendResetPassEmail',{
        method:'POST',
        body:JSON.stringify(data),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>{
        if(result.status===200){
            form.appendChild(messageContainer); // Append the message to the form
        }
    })
   
})
