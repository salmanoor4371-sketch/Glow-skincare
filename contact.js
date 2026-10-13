
const orderForm = document.getElementById("order-form");
const customerName = document.getElementById("customer-name");
const customerEmail = document.getElementById("customer-email");
const customerPhone = document.getElementById("customer-phone");
const orderProduct = document.getElementById("order-product");
const orderQuantity = document.getElementById("order-quantity");
const orderNotes = document.getElementById("order-notes");
const orderMessage = document.getElementById("order-message");

function getProducts() {
    fetch("http://localhost:3000/products")
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Could not load products");
            }

            return response.json();
        })
        .then(function(products) {
            products.forEach(function(product) {
                const option = document.createElement("option");

                option.value = product.id;
                option.textContent = product.name + " - KSh " + product.price;

                orderProduct.appendChild(option);
            });
        })
        .catch(function() {
            orderMessage.textContent = "Could not load products.";
        });
}

orderForm.addEventListener("submit", function(event) {
    event.preventDefault();

    fetch("http://localhost:3000/products/" + orderProduct.value)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Product not found");
            }

            return response.json();
        })
        .then(function(product) {
            const order = {
                customerName: customerName.value,
                email: customerEmail.value,
                phone: customerPhone.value,
                productId: product.id,
                productName: product.name,
                price: product.price,
                quantity: Number(orderQuantity.value),
                total: product.price * Number(orderQuantity.value),
                message: orderNotes.value,
                status: "Pending"
            };

            return fetch("http://localhost:3000/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(order)
            });
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Order failed");
            }

            return response.json();
        })
        .then(function() {
            orderMessage.textContent = "Your order has been submitted successfully.";
            orderForm.reset();
        })
        .catch(function() {
            orderMessage.textContent = "Could not submit your order. Please try again.";
        });
});

getProducts();