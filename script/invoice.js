document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};

    // Check if cart has items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        renderCartItems();
    }

    // Function to update the total price
    function updateTotalPrice() {
        let totalPrice = cart.reduce((sum, item) => sum + parseInt(item.price) * item.quantity, 0);
        totalPriceElement.textContent = `៛ ${totalPrice}`;
    }

    // Function to render cart items
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('col-md-4', 'cart-item', 'mb-3');
            cartItem.innerHTML = `
                <img src="${item.image}" class="img-fluid mb-2" alt="${item.name}">
                <h5>${item.name}</h5>
                <p>Price: ៛ ${item.price}</p>
                <div class="quantity">
                    <button class="btn btn-sm btn-success" onclick="changeQuantity(${index}, -1)">-</button>
                    <input type="text" value="${item.quantity}" readonly>
                    <button class="btn btn-sm btn-success" onclick="changeQuantity(${index}, 1)">+</button>
                </div>
                <button class="btn btn-danger mt-2" onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        updateTotalPrice();
    }

    // Function to change quantity
    window.changeQuantity = function (index, delta) {
        if (cart[index].quantity + delta > 0) {
            cart[index].quantity += delta;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
        }
    };

    // Function to remove item from cart
    window.removeFromCart = function (index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    };

    // Purchase button functionality
    document.getElementById('purchaseBtn').addEventListener('click', function () {
        if (!loggedInUser.phone || !loggedInUser.username) {
            alert('You must be logged in to make a purchase.');
            return;
        }

        // Prepare data for sending to PHP
        const purchaseData = {
            phone: loggedInUser.phone,
            username: loggedInUser.username,
            products: cart,
            totalPrice: totalPriceElement.textContent.replace('៛ ', '')
        };

        // Send purchase details to PHP
        fetch('addtocart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'purchase',
                phone: purchaseData.phone,
                username: purchaseData.username,
                products: JSON.stringify(purchaseData.products),
                totalPrice: purchaseData.totalPrice
            })
        })
        .then(response => response.text())
        .then(result => {
            if (result === 'success') {
                cartItemsContainer.innerHTML = "<h2>Thank you for your purchase! Your order has been sent.</h2>";
                totalPriceElement.textContent = '';
                document.getElementById('purchaseBtn').style.display = 'none';
                const backButton = document.createElement('button');
                backButton.textContent = 'Go Back to Home';
                backButton.classList.add('btn', 'btn-primary', 'btn-back');
                backButton.addEventListener('click', () => window.location.href = 'index2.html');
                cartItemsContainer.appendChild(backButton);
                localStorage.removeItem('cart');
                localStorage.removeItem('loggedInUser');
                cart = [];
            } else {
                alert('There was an issue with your purchase. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to send purchase details. Please try again.');
        });
    });

    renderCartItems();
});
