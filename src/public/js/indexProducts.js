import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';
import sweetalert2 from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.20/+esm'
import socketIoClient from 'https://cdn.jsdelivr.net/npm/socket.io-client@4.7.2/+esm'



const socket = socketIoClient();
var cartId = null;

socket.on('newClientConnected', async() => {
    console.log('A new client has connected');
  try {
    const response = await axios.post(`/api/carts`);
    console.log(response.data)
    cartId = response.data.cartId;
    const carritoLink = document.getElementById('carritoLink');
    carritoLink.href = `/api/carts/${cartId}`;
    socket.emit('cartCreated', cartId);
    
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
  });

  // socket.on('userData', (userData) => {
  //   // Escuchar el evento 'userData' enviado desde el servidor
  //   // Obtener el elemento donde se mostrará el mensaje de bienvenida
  //   const welcomeMessage = document.getElementById('welcomeMessage');
  //   console.log(welcomeMessage);
  //   console.log(userData);
  //   if (userData) {
  //   // Crear el mensaje de bienvenida con los datos del usuario
  //   const message = `¡Bienvenidx, ${userData.name}! Tu correo es ${userData.email} y tienes ${userData.age} años.`;
  //     socket.emit('userDataGotten', userData);
  //   // Mostrar el mensaje de bienvenida en el elemento del DOM
  //   welcomeMessage.textContent = message;
  //   }
    
    
  // });
  document.addEventListener('DOMContentLoaded', () => {
  // const welcomeButton = document.getElementById('welcomeButton');
    const userInfo = document.getElementById('userInfo');

    // Counter for page entry count
    let entryCount = 0;

    // Function to display user information
    function showUserInfo() {
      // Display user information section
      userInfo.style.display = 'block';
    }


    // Code to fetch user data and display it when the page loads
    fetch('/api/sessions/userData') // Assuming this endpoint provides the user data
      .then(response => response.json())
      .then(userData => {
        // Display user information if available
        if (userData) {
          showUserInfo();

          // Update the welcome message with page entry count and user information
          entryCount++;
          const welcomeMessage = document.getElementById('welcomeMessage');
          if(entryCount===1) welcomeMessage.textContent = "¡Bienvenidx a la página!"
          else welcomeMessage.textContent = `¡Bienvenido a la página! Has ingresado ${entryCount} veces.`;

          
          const nameElement = document.getElementById('userName');
          const emailElement = document.getElementById('userEmail');
          const ageElement = document.getElementById('userAge');
          const userElement = document.getElementById('userRole');
          const checkIcon = document.createElement('i');
          checkIcon.classList.add('fas', 'fa-check');
          if(userData.email==='adminCoder@coder.com'){
            emailElement.textContent = userData.email;
            userElement.textContent = userData.role;
            userElement.appendChild(checkIcon);
            nameElement.textContent = 'No existente';
            ageElement.textContent = 'No existente';
          } else {

            
          nameElement.textContent = userData.name;
            
          emailElement.textContent = userData.email;
          
          ageElement.textContent = userData.age;
        
          userElement.textContent = userData.role;
          }
        }
  })
      .catch(error => console.error('Error fetching user data:', error));
  });






  // sweetalert2.fire({
    //   icon: 'success',
    //   title: 'Bienvenidx',
    //   text: `¡Bienvenidx, ${userData.name}! Tu correo es ${userData.email} y tienes ${userData.age} años.`,
    //   toast: true,
    //   position: 'top-right',
    //   showConfirmButton: false,
    //   timer: 3000
    // });
  //  // Emit an event to request the userData from the server
  //  socket.emit('getUserData', (userData) => {
  //   // Event acknowledgment: This function will be called once the server responds with the userData
  //   const welcomeMessage = document.getElementById('welcomeMessage');
  //   if (userData) {
  //     const message = `¡Bienvenidx, ${userData.name}! Tu correo es ${userData.email} y tienes ${userData.age} años.`;
  //     welcomeMessage.textContent = message;
  //   }
  // });
  


var productId = null;
// Escuchar el evento de click del boton 'agregar al carrito'
  document.addEventListener('click', (event) => {
    console.log(event.target.classList.contains('addToCartButton'));
    if (event.target.classList.contains('addToCartButton')) {
    
      productId = event.target.getAttribute('data-productid');
      console.log("productid: "+ productId);

      socket.emit('addToCart', {productId: productId, cartId: cartId} );
    }
  });
  
  // Emitir el evento 'addToCart' al servidor con el productId
  
  socket.on('productAddedToCart', (productId) => {
    sweetalert2.fire({
      icon: 'success',
      title: 'Product Added to Cart',
      text: `Product with ID ${productId} added to cart!`,
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 3000
    });
    alert(`Product with ID ${productId} added to cart!`);
  });
  

