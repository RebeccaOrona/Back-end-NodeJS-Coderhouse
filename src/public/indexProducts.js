import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';
import sweetalert2 from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.20/+esm'


const socket = io();
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
  

