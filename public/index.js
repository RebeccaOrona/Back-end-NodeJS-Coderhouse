const socket = io();


  document.getElementById('newProductForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const productName = document.querySelector('input[name="product"]').value;

    // Emitir el evento 'newProduct' al servidor con los datos del producto
    socket.emit('newProductData', { title: productName });

    // Limpiar el campo de texto
    document.querySelector('input[name="product"]').value = '';
  });

  // Escuchar el evento 'productCreated' enviado por el servidor y actualizar la lista de productos
  socket.on('productCreated', async (newProductData) => {
    // Obtener la lista de productos en el DOM
    const productList = document.getElementById('productList');
  

    // Crear un nuevo elemento de lista y asignarle el contenido del nuevo producto
    const listItem = document.createElement('li');
  listItem.setAttribute('data-productId', await newProductData.id);

  const titleParagraph = document.createElement('p');
  titleParagraph.textContent = 'Title: ' + await newProductData.title;

  const idParagraph = document.createElement('p');
  idParagraph.textContent = 'Id: ' + await newProductData.id;

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('deleteButton');
  deleteButton.textContent = 'Delete';
  deleteButton.setAttribute('data-productId', newProductData.id);


  listItem.appendChild(titleParagraph);
  listItem.appendChild(idParagraph);
  listItem.appendChild(deleteButton);

    // Agregar el nuevo elemento a la lista
    productList.appendChild(listItem);
  });

  // Listen for click events on delete buttons
document.addEventListener('click', (event) => {
  console.log("a");
  if (event.target.classList.contains('deleteButton')) {
    const productId = event.target.getAttribute('data-productId');
    console.log(productId);
    // Emit the 'deleteProduct' event to the server with the productId
    socket.emit('deleteProduct', productId);
  }
});

  // Escuchar el evento 'productDeleted' enviado por el servidor y actualizar la lista de productos
  socket.on('productDeleted', (productId) => {
    const productList = document.getElementById('productList');
    const itemToDelete = productList.querySelector(`li[data-productId="${productId}"]`);
    if (itemToDelete) {
      itemToDelete.remove();
    }
  });
  // socket.on('productDeleted', (productId) => {
  //   /// Obtener la lista de productos en el DOM
  //   const productList = document.getElementById('productList');

  //   // Buscar el elemento de lista que corresponde al producto eliminado por su identificador
  //   const itemToDelete = Array.from(productList.children).find((item) => item.dataset.productId === productId);

  //   // Eliminar el elemento de la lista si se encontró
  //   if (itemToDelete) {
  //     itemToDelete.remove();
  //   }
  // });
