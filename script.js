const buttons = document.querySelectorAll(".plus-button");
const cart = document.querySelector(".cart-container");
const emptyCart = document.querySelector(".empty-cart");
const cartInfo = document.querySelector(".cart-info");
const cartQuantity = document.querySelector("#cart-quantity");
const cartTotal = document.querySelector("#cart-total");

const searchInput = document.querySelector(".search-input");
const menuItems = document.querySelectorAll(".menu-items-group .item");

const categoryPickerButton = document.querySelector(".category-picker-button");
const categoryOptions = document.querySelectorAll(".category-option");

let selectedCategory = "all";

cartInfo.style.display = "none";

buttons.forEach(function (button) {
    button.addEventListener("click", function () {

        const item = button.closest(".item");
        const itemTitle = item.querySelector(".item-title").textContent;

        const cartItems = cart.querySelectorAll(".item");
        let existingItem = null;

        cartItems.forEach(function (cartItem) {
            const title = cartItem.querySelector(".item-title").textContent;

            if (title === itemTitle) {
                existingItem = cartItem;
            }
        });

        if (existingItem) {
            let quantity = Number(existingItem.dataset.quantity);
            quantity++;
            existingItem.dataset.quantity = quantity;

            existingItem.querySelector(".quantity-number").textContent = quantity;

            updateCart();
            return;
        }

        const cartItem = item.cloneNode(true);

        cartItem.dataset.quantity = 1;

        const plusButton = cartItem.querySelector(".plus-button");

        const minusButton = document.createElement("div");
        minusButton.classList.add("minus-button");
        minusButton.textContent = "−";

        const cartButtons = document.createElement("div");
        cartButtons.classList.add("cart-buttons");

        const quantity = document.createElement("p");
        quantity.classList.add("quantity");
        quantity.innerHTML = "QTY: <span class=\"quantity-number\">1</span>";



        const deleteButton = document.createElement("div");
        deleteButton.classList.add("delete-button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            cartItem.remove();
            updateCart();
        });

        plusButton.remove();

        cartButtons.appendChild(minusButton);
        cartButtons.appendChild(button.cloneNode(true));

        const cartControls = document.createElement("div");
        cartControls.classList.add("cart-controls");

        cartControls.appendChild(cartButtons);
        cartControls.appendChild(quantity);
        cartControls.appendChild(deleteButton);

        cartItem.querySelector(".item-price-section").appendChild(cartControls);

        cartItem.querySelector(".cart-buttons .plus-button").addEventListener("click", function () {

            let quantity = Number(cartItem.dataset.quantity);
            quantity++;

            cartItem.dataset.quantity = quantity;
            cartItem.querySelector(".quantity-number").textContent = quantity;

            updateCart();
        });

        minusButton.addEventListener("click", function () {

            let quantity = Number(cartItem.dataset.quantity);

            quantity--;

            if (quantity <= 0) {


                cartItem.remove();
            } else {

                cartItem.dataset.quantity = quantity;
                cartItem.querySelector(".quantity-number").textContent = quantity;
            }

            updateCart();
        });

        cart.insertBefore(cartItem, cartInfo);

        updateCart();


    });


});





function updateCart() {



    const cartItems = cart.querySelectorAll(".item");


    let totalQuantity = 0;
    let totalPrice = 0;


    cartItems.forEach(function (item) {

        const quantity = Number(item.dataset.quantity);
        const price = parseFloat(
            item.querySelector(".item-price").textContent.replace("£", "")
        );

        totalQuantity += quantity;
        totalPrice += price * quantity;
    });

    cartQuantity.textContent = totalQuantity;
    cartTotal.textContent = totalPrice.toFixed(2);

    if (totalQuantity === 0) {


        emptyCart.style.display = "block";
        cartInfo.style.display = "none";


    }

    else {

        emptyCart.style.display = "none";
        cartInfo.style.display = "flex";
    }
}


function filterMenu() {


    const searchText = searchInput.value.toLowerCase();


    menuItems.forEach(function (item) {

        const title = item.querySelector(".item-title").textContent.toLowerCase();
        const description = item.querySelector(".item-description").textContent.toLowerCase();

        const matchesSearch =
            title.includes(searchText) ||
            description.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            item.dataset.category === selectedCategory;



        if (matchesSearch && matchesCategory) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}


searchInput.addEventListener("input", function () {
    filterMenu();
});


categoryOptions.forEach(function (option) {

    option.addEventListener("click", function () {

        selectedCategory = option.dataset.category;

        categoryPickerButton.textContent = option.textContent;

        filterMenu();
    });
});