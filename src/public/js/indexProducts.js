import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.20/+esm';
import socketIoClient from 'https://cdn.jsdelivr.net/npm/socket.io-client@4.7.2/+esm'

const socket = socketIoClient();
var cartId = null;
let purchaser = null;
let baseUrl = 'https://back-end-nodejs-coderhouse-production.up.railway.app';
const updateProductForm = document.querySelector('.update-product-form');

function addAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function showUpdateProduct() {
  // Find the "Agregar al Carrito" button
  const addToCartButtons = document.querySelectorAll('.addToCartButton');

  // Iterate through the buttons and add an "Update Product" button after each one
  addToCartButtons.forEach(addToCartButton => {
      const updateProductButton = document.createElement('div');
      updateProductButton.classList.add('updateProductButton'); // You can define the CSS styles for this class
      updateProductButton.innerHTML = '<i class="fas fa-pencil-alt"></i> Actualizar Producto';
      updateProductButton.setAttribute('data-productId', addToCartButton.getAttribute('data-productId'));

      // Insert the "Update Product" button after the "Agregar al Carrito" button
      addAfter(addToCartButton, updateProductButton);

      updateProductButton.addEventListener('click', async (event) => {
        const parentContainer = event.target.parentElement; // Get the parent container
        const updateProductForm = parentContainer.querySelector('.update-product-form');

        if (updateProductForm.style.display === 'block') {
            // If the form is already displayed, hide it and reset the button text
            updateProductForm.style.display = 'none';
            updateProductButton.innerHTML = '<i class="fas fa-pencil-alt"></i> Actualizar Producto';
        } else {
            // If the form is not displayed, show it and change the button text
            updateProductForm.style.display = 'block';
            updateProductButton.innerHTML = '<i class="fas fa-times"></i> Cancelar modificacion del producto';
        }
    });
  });
}

async function updateProduct(button){
  const form = button.parentElement;

  // Get the product details from the form input fields
  const title = form.querySelector('#title').value;
  const description = form.querySelector('#description').value;
  const code = form.querySelector('#code').value;
  const priceValue = form.querySelector('#price').value;
  const price = Number.parseFloat(priceValue);
  const statusValue = form.querySelector('#status').value;
  const status = statusValue === 'true';
  const stockValue = form.querySelector('#stock').value;
  const stock = Number.parseInt(stockValue)
  const category = form.querySelector('#category').value;
  const thumbnail = form.querySelector('#thumbnail').value;

  // Get the productId from the "Update Product" button
  const productId = button.getAttribute('data-productId');

  // Prepare the data for the PUT request
  const productData = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail
  };

  try {
    const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
    });
    console.log(await response.json())
    if (response.ok) {
      updateProductForm.style.display = 'none';
      Swal.fire({
        icon: 'success',
        title: 'Producto modificado correctamente',
        text: `El producto con el ID ${productId} fue modificado con exito!`,
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000
      });
      setTimeout(() => {
        window.location.replace('/products');
      }, 3000);
    } else {
        console.error('Error updating product:', response.statusText);
    }
  } catch (error) {
      console.error('Error updating product:', error);
  }
};

document.addEventListener("DOMContentLoaded", function () {
  // Find the buttons and attach the event listener
  const updateButtons = document.querySelectorAll('.updateButton');

  updateButtons.forEach((button) => {
    button.addEventListener('click', function() {
      updateProduct(this);
    });
  });

  const rellenarButtons = document.querySelectorAll('.rellenarButton');
  rellenarButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      // Get the data-field attribute to determine which field to fill
      const field = button.getAttribute('data-field');
      const dataValue = button.getAttribute(`data-${field}`);
      const inputField = document.getElementById(field);
        if (inputField) {
          inputField.value = dataValue;
        }
    });
  });

});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function updateCartCount(count) {
  const cartCountElement = document.getElementById('cart-count');
  cartCountElement.textContent = count;
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
        if (userData.payload.role === 'admin' || userData.payload.role === 'premium') {
          showUpdateProduct();
        }
        purchaser = userData.payload.email;
      
        fetch(`/api/carts/findCartByPurchaser/${purchaser}`)
        .then(response => response.json())
        .then(cart => {
          if(purchaser == cart.cart[0].purchaser){
            cartId = cart.cart[0]._id;
            carritoLink.href = `/api/carts/${cartId}`;
            socket.emit('cartCreated', cartId);
            const numProductsInCart = cart.cart[0].products.length;
              updateCartCount(numProductsInCart);
          } else {
            fetch('/api/carts')
            .then(response => response.json())
            .then(response =>{
              cartId = response.data.cartId
              carritoLink.href = `/api/carts/${cartId}`;
              socket.emit('cartCreated', cartId);
              const numProductsInCart = response.data.cart[0].products.length;
              updateCartCount(numProductsInCart);
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
            adminButton.textContent = 'Usuarios';
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
    
      let productName = event.target.getAttribute('data-title');
      console.log(productName)
      productId = event.target.getAttribute('data-productId');
      try {
        fetch(`${baseUrl}/api/carts/${cartId}/product/${productId}`, {
          method: 'POST',
          credentials: 'include', // Incluir cookies  
        }).then(response => response.json())
        .then(result => {
          if (result.status === 400) {
            Swal.fire("No puedes agregar productos al carrito", "No eres un usuario válido", "error");
          } else {
            socket.emit('addToCart', {name: productName} );
          }
        })
    } catch (error) {
      console.error('Error:', error);
    }
}
  });
  
  // Emitir el evento 'addToCart' al servidor con el productId
  
  socket.on('productAddedToCart', (productName) => {
    Swal.fire({
      icon: 'success',
      title: 'Producto agregado al carrito',
      text: `El producto: ${productName} fue agregado al carrito!`,
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 3000
    });
    fetch(`/api/carts/findCartByPurchaser/${purchaser}`)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          const numProductsInCart = result.cart[0].products.length;
          console.log(result.cart[0].products.length)
          updateCartCount(numProductsInCart);
        })
  });
  

