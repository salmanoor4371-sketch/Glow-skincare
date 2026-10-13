const productsContainer = document.getElementById("products-container");
const productForm = document.getElementById("product-form");
const productId = document.getElementById("product-id");
const productName = document.getElementById("product-name");
const productPrice = document.getElementById("product-price");
const productDescription = document.getElementById("product-description");
const saveButton = document.getElementById("save-button");
const cancelButton = document.getElementById("cancel-button");
const productMessage = document.getElementById("product-message");

function getProducts() {
    fetch("http://localhost:3000/products")
        .then(function(response) {
            return response.json();
        })
        .then(function(products) {
            productsContainer.innerHTML = "";

            products.forEach(function(product) {
                const card = document.createElement("div");
                card.className = "product-card";

                const name = document.createElement("h3");
                name.textContent = product.name;

                const price = document.createElement("p");
                price.textContent = "Price: KSh " + product.price;

                const description = document.createElement("p");
                description.textContent = product.description;

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";

                editButton.addEventListener("click", function() {
                
                    productId.value = product.id;
                    productName.value = product.name;
                    productPrice.value = product.price;
                    productDescription.value = product.description;

                    saveButton.textContent = "Update Product";
                    cancelButton.hidden = false;
                    productMessage.textContent = "Editing " + product.name;
                    productForm.scrollIntoView({behavior: "smooth"})

                });

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "delete-button";

                deleteButton.addEventListener("click", function() {
                    deleteProduct(product.id);
                });

                card.appendChild(name);
                card.appendChild(price);
                card.appendChild(description);
                card.appendChild(editButton);
                card.appendChild(deleteButton);

                productsContainer.appendChild(card);
            });
        })
        .catch(function() {
            productsContainer.textContent = "Could not load products. Start JSON Server and refresh.";
        });
}

productForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const product = {
        name: productName.value,
        price: Number(productPrice.value),
        description: productDescription.value
    };

    let request;

    if (productId.value === "") {
        request = fetch("http://localhost:3000/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        });
    } else {
        request = fetch("http://localhost:3000/products/" + productId.value, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        });
    }

    request
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Request failed");
            }

            return response.json();
        })
        .then(function() {
            productMessage.textContent = productId.value === ""
                ? "Product added successfully."
                : "Product updated successfully.";

            resetForm();
            getProducts();
        })
        .catch(function() {
            productMessage.textContent = "Could not save product.";
        });
});

function deleteProduct(id) {
    const answer = confirm("Do you want to delete this product?");

    if (answer === true) {
        fetch("http://localhost:3000/products/" + id, {
            method: "DELETE"
        })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error("Could not delete product");
                }

                productMessage.textContent = "Product deleted successfully.";
                getProducts();
            })
            .catch(function() {
                productMessage.textContent = "Could not delete product.";
            });
    }
}

function resetForm() {
    productForm.reset();
    productId.value = "";
    saveButton.textContent = "Add Product";
    cancelButton.hidden = true;
}

cancelButton.addEventListener("click", function() {
    resetForm();
    productMessage.textContent = "";
});

getProducts();
