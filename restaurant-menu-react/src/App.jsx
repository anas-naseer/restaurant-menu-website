import React, { useEffect } from 'react'
import { useState } from 'react'


const App = () => {


  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const buttons = document.querySelectorAll(".menu-items-group .plus-button");
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

          const originalPrice = Number(existingItem.dataset.originalPrice);
          existingItem.querySelector(".item-price").textContent =
            "£" + (originalPrice * quantity).toFixed(2);

          updateCart();
          return;
        }

        const cartItem = item.cloneNode(true);

        const unitPrice = parseFloat(
          item.querySelector(".item-price").textContent.replace("£", "")
        );
        cartItem.dataset.originalPrice = unitPrice;
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

          const originalPrice = Number(
            cartItem.dataset.originalPrice
          );

          cartItem.querySelector(".item-price").textContent =
            "£" + (originalPrice * quantity).toFixed(2);

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

            const originalPrice = Number(
              cartItem.dataset.originalPrice
            );

            cartItem.querySelector(".item-price").textContent =
              "£" + (originalPrice * quantity).toFixed(2);
          }

          updateCart();
        });

        cart.insertBefore(cartItem, cartInfo);

        updateCart();


      }, { signal });


    });





    function updateCart() {



      const cartItems = cart.querySelectorAll(".item");


      let totalQuantity = 0;
      let totalPrice = 0;


      cartItems.forEach(function (item) {

        const quantity = Number(item.dataset.quantity);
        const originalPrice = Number(item.dataset.originalPrice) || 0;

        totalQuantity += quantity;
        totalPrice += originalPrice * quantity;
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
    }, { signal });


    categoryOptions.forEach(function (option) {

      option.addEventListener("click", function () {

        selectedCategory = option.dataset.category;

        categoryPickerButton.textContent = option.textContent;

        filterMenu();
      }, { signal });
    });

    return () => {
      controller.abort();
    };

  }, [])
  return (



    < div >

      <h1 className="menu-title">Restaurant Menu</h1>

      <div className="menu-content">

        <div className="categories">


          <h2 className="categories-title">Menu</h2>
          <h3 className="category-name">Pizza</h3>
          <h3 className="category-name">Burgers</h3>
          <h3 className="category-name">Pasta</h3>
          <h3 className="category-name">Desserts</h3>
          <h3 className="category-name">Drinks</h3>


        </div>



        <div className="search-bar">
          <div className="search-container">
            <input className="search-input" type="text" placeholder="Search menu..." />

            <div className="category-picker">
              <div className="category-picker-button">Category</div>

              <div className="category-options">
                <div className="category-option" data-category="all">All</div>
                <div className="category-option" data-category="pizza">Pizza</div>
                <div className="category-option" data-category="burgers">Burgers</div>
                <div className="category-option" data-category="pasta">Pasta</div>
                <div className="category-option" data-category="desserts">Desserts</div>
                <div className="category-option" data-category="drinks">Drinks</div>
              </div>
            </div>
          </div>

          <div className="menu-items-group">
            <div className="item" data-category="pizza">
              <img className="item-image" src="Public/Images/pizza.jpg" alt="Spicy Chicken Ranch" />
              <div className="item-details">
                <h3 className="item-title">Spicy Chicken Ranch</h3>
                <p className="item-description">Grilled chicken, tomatoes, mushrooms and jalapeno peppers, chopped
                  garlic, creamy ranch sauce.</p>
              </div>
              <div className="item-price-section">
                <p className="item-price">£12.00</p>

                <div className="plus-button">
                  <span className="plus">+</span>
                </div>
              </div>

            </div>



            <div className="item" data-category="pizza">
              <img className="item-image" src="Public/Images/Vegetarian.jpg" alt="Vegetarian" />
              <div className="item-details">
                <h3 className="item-title">Vegetarian</h3>
                <p className="item-description">Green pepper, fresh tomato, onion loaded on tomato base and topped
                  with mozzarella cheese..</p>
              </div>
              <div className="item-price-section">
                <p className="item-price">£10.50</p>

                <div className="plus-button">
                  <span className="plus">+</span>
                </div>
              </div>
            </div>

            <div className="item" data-category="pizza">
              <img className="item-image" src="Public/Images/bbq.webp" alt="BBQ Chicken" />
              <div className="item-details">
                <h3 className="item-title">BBQ Chicken Ranch</h3>
                <p className="item-description">BBQ sauce, grilled chicken, onions, and mozzarella cheese on a ranch
                  base.</p>
              </div>
              <div className="item-price-section">
                <p className="item-price">£13.00</p>

                <div className="plus-button">
                  <span className="plus">+</span>
                </div>
              </div>
            </div>

            <div className="item" data-category="burgers">
              <img className="item-image" src="Public/Images/bbqcheeseburger.jpg" alt="BBQ Cheeseburger" />
              <div className="item-details">
                <h3 className="item-title">BBQ Cheeseburger</h3>
                <p className="item-description">Juicy beef patty, melted cheddar, crispy bacon, and our signature
                  tangy BBQ sauce, all nestled in a toasted brioche bun..</p>
              </div>
              <div className="item-price-section">
                <p className="item-price">£11.50</p>

                <div className="plus-button">
                  <span className="plus">+</span>
                </div>
              </div>
            </div>

            <div className="item" data-category="burgers">
              <img className="item-image" src="Public/Images/vegBurger.jpg" alt="Veggie Supreme" />
              <div className="item-details">
                <h3 className="item-title">Veggie Supreme</h3>
                <p className="item-description">A vibrant medley of roasted bell peppers, zucchini, red onions, and
                  creamy avocado mayo, tucked into a warm ciabatta bun.</p>
              </div>
              <div className="item-price-section">
                <p className="item-price">£9.50</p>

                <div className="plus-button">
                  <span className="plus">+</span>
                </div>
              </div>
            </div>

            <div className="item" data-category="pasta">
              <img className="item-image" src="Public/Images/bolognese.jpg" alt="Bolognese Pasta" />
              <div className="item-details">
                <h3 className="item-title">Bolognese Pasta</h3>
                <p className="item-description">Classic comfort in a bowl. Rich, slow-cooked meat ragu tossed with
                  perfectly al dente spaghetti and finished with a sprinkle of fresh Parmesan.</p>
              </div>
              <div className="item-price-section">
                <p className="item-price">£12.00</p>

                <div className="plus-button">
                  <span className="plus">+</span>
                </div>
              </div>
            </div>

            <div className="item" data-category="pasta">
              <img className="item-image" src="Public/Images/pastaAlfredo.jpg" alt="Chicken Alfredo Pasta" />
              <div className="item-details">
                <h3 className="item-title">Chicken Alfredo Pasta</h3>
                <p className="item-description">Tender grilled chicken breast slices swimming in a luxurious,
                  velvety
                  Alfredo sauce made with cream, butter, and Parmesan, clinging perfectly to every strand of
                  spagh.</p>
              </div>
              <div className="item-price-section">
                <p className="item-price">£13.50</p>

                <div className="plus-button">
                  <span className="plus">+</span>
                </div>
              </div>
            </div>

            <div className="item" data-category="desserts">
              <img className="item-image" src="Public/Images/strawberryCake.jpg" alt="Strawberry Cake" />
              <div className="item-details">
                <h3 className="item-title">Strawberry Cheesecake</h3>
                <p className="item-description">A slice of pure indulgence. Creamy New York-style strawberry
                  cheesecake with a
                  buttery graham cracker crust, crowned with a vibrant swirl of fresh strawberry topping and
                  a delicate dusting of powdered sugar.
                </p>
              </div>
              <div className="item-price-section">
                <p className="item-price">£6.50</p>

                <div className="plus-button">
                  <span className="plus">+</span>
                </div>
              </div>
            </div>

            <div className="item" data-category="desserts">
              <img className="item-image" src="Public/Images/doubleChocolate.jpg" alt="Double Chocolate Muffin" />
              <div className="item-details">
                <h3 className="item-title">Double Chocolate Muffin</h3>
                <p className="item-description">Indulge your dark chocolate cravings with our decadent Double
                  Chocolate Muffin. Bursting with rich chocolate chips and topped with a delicate cocoa
                  drizzle, this soft, moist muffin delivers a double dose of pure chocolate bliss in every
                  bite.</p>
              </div>
              <div className="item-price-section">
                <p className="item-price">£4.50</p>

                <div className="plus-button">
                  <span className="plus">+</span>
                </div>
              </div>
            </div>

            <div className="item" data-category="drinks">
              <img className="item-image" src="Public/Images/vanillaLatte.jpg" alt="Vanilla Latte" />
              <div className="item-details">
                <h3 className="item-title">Vanilla Latte</h3>
                <p className="item-description">A classic combination of rich, aromatic espresso and creamy, steamed
                  milk, enhanced with a touch of sweet vanilla syrup for a delightful twist.</p>
              </div>
              <div className="item-price-section">
                <p className="item-price">£4.00</p>

                <div className="plus-button">
                  <span className="plus">+</span>
                </div>
              </div>
            </div>

            <div className="item" data-category="drinks">
              <img className="item-image" src="Public/Images/chocolateLatte.jpg" alt="Chocolate Latte" />
              <div className="item-details">
                <h3 className="item-title">Chocolate Latte</h3>
                <p className="item-description">A luxurious blend of bold espresso, velvety steamed milk, and rich
                  chocolate syrup, crafted to create a decadent and comforting coffee experience with every
                  sip.
                </p>
              </div>
              <div className="item-price-section">
                <p className="item-price">£4.00</p>

                <div className="plus-button">
                  <span className="plus">+</span>
                </div>
              </div>






            </div>





          </div>

        </div>

        <div className="cart-container">
          <div className="cart-title">




            <h1 style={{ fontWeight: 500 }}>Your cart</h1>


          </div>

          <div className="empty-cart">

            <h2>Your cart is empty, add an item from the menu to get started.</h2>


          </div>

          <div className="cart-info">
            <p>Quantity: <span id="cart-quantity">0</span></p>
            <p>Total: £<span id="cart-total">0.00</span></p>
          </div>




        </div>




      </div>

    </div >
  )
}

export default App