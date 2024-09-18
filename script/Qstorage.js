document.addEventListener('DOMContentLoaded', function () {
    // Predefined stock quantities for products
    const productStocks = {
        "ជី DAP": 20,
        "ជី A-An": 15,
        "ជី NP": 25,
        "ជី N": 29,
        "ថ្នាំ​": 20,
        // Add more products and their stock values here
    };

    // Initialize stock values in localStorage
    function initializeStock() {
        Object.keys(productStocks).forEach(productName => {
            const stockKey = `${productName}-stock`;
            if (localStorage.getItem(stockKey) === null) {
                localStorage.setItem(stockKey, productStocks[productName]);
            }
        });
    }

    // Update the stock display and handle cart actions
    function handleProductStock(productCard) {
        const productName = productCard.querySelector('.product-name').textContent.trim(); // Get product name
        const stockElement = productCard.querySelector('.stock-quantity'); // Element displaying stock
        const stockKey = `${productName}-stock`; // Unique key for storing stock in localStorage

        console.log(`Handling stock for: ${productName}`);

        // Check if stockElement is found
        if (!stockElement) {
            console.error(`Stock element not found for ${productName}`);
            return;
        }

        let stockQuantity = parseInt(localStorage.getItem(stockKey));
        if (isNaN(stockQuantity)) {
            stockQuantity = 0;
        }

        // Update the stock display in the UI
        stockElement.textContent = stockQuantity;
        console.log(`Updated UI stock for ${productName}: ${stockQuantity}`);

        const addToCartButton = productCard.querySelector('.add-to-cart');
        const quantityDisplay = productCard.querySelector('.quantity');

        // Handle 'Add to Cart' button click
        addToCartButton.addEventListener('click', function () {
            const selectedQuantity = parseInt(quantityDisplay.textContent); // Get selected quantity to add to cart
            let currentStock = parseInt(localStorage.getItem(stockKey)); // Fetch stock from localStorage

            if (currentStock >= selectedQuantity) {
                // Decrease the stock based on the selected quantity
                currentStock -= selectedQuantity;
                localStorage.setItem(stockKey, currentStock); // Update stock in localStorage
                stockElement.textContent = currentStock; // Update the stock in the UI

                if (currentStock === 0) {
                    alert(`${productName} is out of stock!`);
                    addToCartButton.disabled = true; // Disable button if out of stock
                }
            } else {
                alert(`Insufficient stock for ${productName}. Only ${currentStock} left.`);
            }
        });

        // Handle quantity increase/decrease
        productCard.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', function () {
                const action = this.getAttribute('data-action');
                let currentQuantity = parseInt(quantityDisplay.textContent);

                if (action === 'increase') {
                    quantityDisplay.textContent = currentQuantity + 1;
                } else if (action === 'decrease' && currentQuantity > 1) {
                    quantityDisplay.textContent = currentQuantity - 1;
                }
            });
        });

        // Disable "Add to Cart" button if out of stock
        if (parseInt(stockElement.textContent) === 0) {
            addToCartButton.disabled = true;
        }
    }

    // Initialize stock values in localStorage
    initializeStock();

    // Apply stock handling to all product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        handleProductStock(card);
    });
});
