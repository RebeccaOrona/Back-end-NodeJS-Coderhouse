import sweetalert2 from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.20/+esm'

document.addEventListener('DOMContentLoaded', function () {
    const cartContainer = document.querySelector('[data-cart-id]');
    const cartId = cartContainer.getAttribute('data-cart-id');
    const incrementButtons = document.querySelectorAll('.increment-btn');
    const decrementButtons = document.querySelectorAll('.decrement-btn');

    incrementButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productIndex = this.getAttribute('data-product-index');
            const cartItem = document.querySelector(`#cart-item-${productIndex}`);
            const productId = cartItem.querySelector('[data-product-id]').getAttribute('data-product-id');
            const quantityElement = document.querySelector(`#cart-item-${productIndex} .quantity`);
            let currentQuantity = parseInt(quantityElement.textContent);
            fetch(`${cartId}/product/${productId}`,{
                method:'POST'
            })
            .then(response => {
                if (response.status === 200) {
                    currentQuantity++;
                    quantityElement.textContent = currentQuantity;
                }
            })
            .catch(error => {
                req.logger.error('Fetch error:', error);
            })
        });
    });
    

    decrementButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productIndex = this.getAttribute('data-product-index');
            const cartItem = document.querySelector(`#cart-item-${productIndex}`);
            const productId = cartItem.querySelector('[data-product-id]').getAttribute('data-product-id');
            const quantityElement = document.querySelector(`#cart-item-${productIndex} .quantity`);
            let currentQuantity = parseInt(quantityElement.textContent);
            fetch(`${cartId}/product/${productId}`,{
                method:'DELETE'
            })
            .then(response => {
                if (response.status === 200) {
                    currentQuantity--;
                    quantityElement.textContent = currentQuantity;
                    if (currentQuantity === 0) {
                        cartItem.remove();
                    }
                }
            })
            .catch(error => {
                req.logger.error('Fetch error:', error);
            })
    });
    });


    function showSuccessToast() {
        return new Promise((resolve) => {
            sweetalert2.fire({
                icon: 'success',
                title: 'Cart purchased successfully.',
                text: `You purchased the items in your cart successfully!`,
                toast: true,
                position: 'top-right',
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonText: 'OK',
                timer: 6000
            }).then((result) => {
                if (result.isConfirmed) {
                    resolve(); // Resolve the Promise if the user confirms
                }
            });
        });
    }
    
    function showErrorToast() {
        return new Promise((resolve) => {
            sweetalert2.fire({
                icon: 'error',
                title: 'Failed to purchase your cart',
                text: `There isn't enough stock for certain items to purchase from your cart`,
                toast: true,
                position: 'top-right',
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonText: 'OK',
                timer: 6000
            }).then((result) => {
                if (result.isConfirmed) {
                    resolve(); // Resolve the Promise if the user confirms
                }
            });
        });
    }

    const purchaseButton = document.getElementById('purchaseButton');

    purchaseButton.addEventListener('click', function () {
        
        // Construct the purchase URL
        const purchaseUrl = `http://localhost:8080/api/carts/${cartId}/purchase`;

        // Perform the purchase by making a fetch request
        fetch(purchaseUrl, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(async (response) => {
            if (response.status === 200) {
                // Purchase was successful
                await showSuccessToast();
                window.location.replace(`${cartId}`);
            } else {
                // Purchase failed
                await showErrorToast();
                window.location.replace(`${cartId}`);
            }
        })
        .catch(error => {
            req.logger.error('Purchase error:', error);
            
        });
    });
});
