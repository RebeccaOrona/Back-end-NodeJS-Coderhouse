import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.20/+esm';
import socketIoClient from 'https://cdn.jsdelivr.net/npm/socket.io-client@4.7.2/+esm'

const socket = socketIoClient();
var cartId = null;
let purchaser = null;
let baseUrl = 'https://back-end-nodejs-coderhouse-production.up.railway.app';

    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const token = getCookie('cookieToken'); 

    socket.on('newClientConnected', async() => {
      const carritoLink = document.getElementById('carritoLink');
    try {
      fetch('/api/users/currentUser', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }) 
      .then(response => response.json())
      .then(userData => {
          
        purchaser = userData.payload.email;
      
        fetch(`/api/carts/findCartByPurchaser/${purchaser}`)
        .then(response => response.json())
        .then(cart => {
          if(purchaser == cart.cart[0].purchaser){
            cartId = cart.cart[0]._id;
            carritoLink.href = `/api/carts/${cartId}`;
            socket.emit('cartCreated', cartId);
          } else {
            fetch('/api/carts')
            .then(response => response.json())
            .then(response =>{
              cartId = response.data.cartId
              carritoLink.href = `/api/carts/${cartId}`;
              socket.emit('cartCreated', cartId);
            });
          };
        });
      });
           
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
    });

    const userInfo = document.getElementById('userInfo');

    
    let entryCount = 0;

    function showUserInfo() {
      userInfo.style.display = 'block';
    }
    
    fetch('/api/users/currentUser', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }) 
      .then(response => response.json())
      .then(userData => {
        if (userData) {
          showUserInfo();
          entryCount++;
          const welcomeMessage = document.getElementById('welcomeMessage');
          if(entryCount===1) welcomeMessage.textContent = "¡Bienvenidx a la página!"
          else welcomeMessage.textContent = `¡Bienvenido a la página! Has ingresado ${entryCount} veces.`;

          const userButtonContainer = document.getElementById('userButtonContainer');
          const nameElement = document.getElementById('userName');
          const emailElement = document.getElementById('userEmail');
          const ageElement = document.getElementById('userAge');
          const roleElement = document.getElementById('userRole');
          const checkIcon = document.createElement('i');
          checkIcon.classList.add('fas', 'fa-check');
          if(userData.payload.email=='adminCoder@coder.com'){
            nameElement.textContent = userData.payload.name;
            emailElement.textContent = userData.payload.email;
            ageElement.textContent = userData.payload.age;
            roleElement.textContent = userData.payload.role;
            roleElement.appendChild(checkIcon);
            
            const adminButton = document.createElement('a');
            adminButton.href = 'https://back-end-nodejs-coderhouse-production.up.railway.app/api/users';
            adminButton.textContent = 'Users page';
            adminButton.classList.add('btn', 'btn-primary');
            userButtonContainer.appendChild(adminButton);
          } else {

            
          nameElement.textContent = userData.payload.name;
            
          emailElement.textContent = userData.payload.email;
          
          ageElement.textContent = userData.payload.age;
        
          roleElement.textContent = userData.payload.role;
          }
        }
  })
      .catch(error => console.error('Error fetching user data:', error));
  // });

var productId = null;
// Escuchar el evento de click del boton 'agregar al carrito'
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('addToCartButton')) {
    
      productId = event.target.getAttribute('data-productid');
      try {
        const response = await fetch(`${baseUrl}/api/carts/${cartId}/product/${productId}`, {
          method: 'POST',
          credentials: 'include', // Incluir cookies  
        });
          
        if (response.status === 403) {
          Swal.fire("No puedes agregar productos al carrito", "No eres un usuario válido", "error");
        } else if (!response.ok) {
          throw new Error('Request failed');
        } else {
          socket.emit('addToCart', {productId: productId, cartId: cartId} );
        }
    } catch (error) {
      console.error('Error:', error);
    }
}
  });
  
  // Emitir el evento 'addToCart' al servidor con el productId
  
  socket.on('productAddedToCart', (productId) => {
    Swal.fire({
      icon: 'success',
      title: 'Product Added to Cart',
      text: `Product with ID ${productId} added to cart!`,
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 3000
    });
  
  });
  

