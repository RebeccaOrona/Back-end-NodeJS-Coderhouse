import socketIoClient from 'https://cdn.jsdelivr.net/npm/socket.io-client@4.7.2/+esm'
import sweetalert2 from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.20/+esm'

    const socket = socketIoClient();

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      }
  
  
    const token = getCookie('cookieToken'); 
    let user = null;
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');

    

    document.addEventListener("DOMContentLoaded", function() {
      const chatIcon = document.getElementById("chat-icon");
      const chat = document.getElementById("chat");
      const closeChatButton = document.getElementById("close-chat-button");

      function scrollToBottom() {
        chat.scrollTop = chat.scrollHeight;
      }

      function openChat() {
        chat.style.transform = "translateX(0)";
        chat.classList.add("open");
        closeChatButton.style.display = "inline-block";
        chatIcon.style.display = "none";
        scrollToBottom(); 
      }
      function closeChat() {
        chat.style.transform = "translateX(100%)";
        setTimeout(() => {
          chat.classList.remove("open");
          closeChatButton.style.display = "none"; // Ocultar el botón de cierre
        }, 300);
        chatIcon.style.display = "flex";
        closeChatButton.classList.add("closing");
      }

      chatIcon.addEventListener("click", openChat);

      closeChatButton.addEventListener("click", closeChat);
});

        socket.on('newClientConnected', async() => {
            fetch('api/chat/')
            .then((response) => response.json())
            .then((data) => {
                const chat = data.chat;
                chat.forEach((item) => {
                    const li = document.createElement('li');
                    li.textContent = `${item.sender} dice: ${item.message}`;
                    messages.appendChild(li);
                })
            })
            .catch((error) => console.error('Error:', error));
        })

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (input.value) {
                socket.emit('chat message', { message: input.value } );
                input.value = '';
            }
        });

        socket.on('chat message', (input) => {
            fetch('api/chat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(input)
            })
            .then((response) => {
              if (response.status === 403) {
                // Muestra un SweetAlert si el código de estado es 403
                new sweetalert2("No se puede enviar el mensaje", "No eres un usuario válido", "error");
              } else if (response.ok) {
                fetch('/api/users/currentUser', {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                })
                .then(response => response.json())
                .then(userData => { 
                  user = userData.payload.email;
                  const li = document.createElement('li');
                  li.textContent = (`${user} dice: ` + input.message);
                  messages.appendChild(li);
                })
                return response.json();
              } else {
                  // Maneja otros errores de la respuesta
                  console.error('Error en la respuesta:', response);
              }
            })
            .catch((error) => console.error('Error:', error));
            
          
      })
              
              
     