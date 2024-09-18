document.getElementById('purchaseBtn').addEventListener('click', function () {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    if (!loggedInUser.phone || !loggedInUser.username) {
        alert('You must be logged in to make a purchase.');
        return;
    }

    // Log data for debugging
    console.log('Logged In User:', loggedInUser);
    console.log('Cart Data:', JSON.parse(localStorage.getItem('cart')));
    console.log('Total Price:', document.getElementById('totalPrice').textContent.replace('៛ ', ''));

    // Prepare data to send to PHP
    const purchaseData = {
        username: loggedInUser.username,
        phone: loggedInUser.phone,
        cart: JSON.parse(localStorage.getItem('cart')),
        totalPrice: document.getElementById('totalPrice').textContent.replace('៛ ', '')
    };

    // Send data to PHP script
    fetch('addtocart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Thank you for your purchase! Your order has been sent.');
            localStorage.removeItem('cart');
            localStorage.removeItem('loggedInUser');
            window.location.href = 'index.html'; // Redirect to index.html
        } else {
            alert('There was an issue with your purchase. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to send purchase details. Please try again.');
    });
});
