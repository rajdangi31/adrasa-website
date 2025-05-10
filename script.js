document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // Carousel functionality (for home and featured pages)
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const items = carousel.querySelectorAll('.carousel-item');
        const prevButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');
        let currentIndex = 0;

        if (track && items.length > 0) {
            const itemWidth = items[0].offsetWidth + 20;
            const maxIndex = Math.ceil(items.length - (carousel.offsetWidth / itemWidth));

            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
                }
            });

            nextButton.addEventListener('click', () => {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
                }
            });

            // Touch support
            let touchStartX = 0;
            let touchEndX = 0;

            track.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            track.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50 && currentIndex < maxIndex) {
                    currentIndex++;
                    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
                } else if (touchEndX - touchStartX > 50 && currentIndex > 0) {
                    currentIndex--;
                    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
                }
            });
        }
    });

    // Dynamic featured page carousel
    const featuredCarousel = document.getElementById('featured-carousel');
    if (featuredCarousel) {
        const products = [
            { id: "1", name: "Casual T-Shirt", price: 29.99, img: "images/product1.jpg" },
            { id: "2", name: "Denim Jacket", price: 59.99, img: "images/product2.jpg" },
            // Add 158 more products (8 per page x 20 pages)
            // Sample for brevity; extend with your product data
        ];

        for (let page = 0; page < 20; page++) {
            const pageDiv = document.createElement('div');
            pageDiv.classList.add('carousel-page');
            const grid = document.createElement('div');
            grid.classList.add('product-grid');

            for (let i = page * 8; i < (page + 1) * 8 && i < products.length; i++) {
                const product = products[i];
                grid.innerHTML += `
                    <div class="product">
                        <img src="${product.img}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>$${product.price.toFixed(2)}</p>
                        <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
                    </div>
                `;
            }

            pageDiv.appendChild(grid);
            featuredCarousel.appendChild(pageDiv);
        }

        const pages = featuredCarousel.querySelectorAll('.carousel-page');
        let currentPage = 0;
        const pageIndicator = document.getElementById('page-indicator');
        const prevBtn = featuredCarousel.parentElement.querySelector('.carousel-prev');
        const nextBtn = featuredCarousel.parentElement.querySelector('.carousel-next');

        prevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                featuredCarousel.style.transform = `translateX(-${currentPage * 100}%)`;
                pageIndicator.textContent = `${currentPage + 1} / 20`;
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentPage < pages.length - 1) {
                currentPage++;
                featuredCarousel.style.transform = `translateX(-${currentPage * 100}%)`;
                pageIndicator.textContent = `${currentPage + 1} / 20`;
            }
        });
    }

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);

            const item = { id, name, price, quantity: 1 };
            const existingItem = cart.find(cartItem => cartItem.id === id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push(item);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert(`${name} added to cart!`);
        });
    });

    // Form toggle for account page
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (button.dataset.form === 'login') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            }
        });
    });

    // Cart page rendering
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        renderCart();
    }

    // Login form
    if (loginForm) {
        loginForm.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Login functionality not implemented yet.');
        });
    }

    // Register form
    if (registerForm) {
        registerForm.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Registration functionality not implemented yet.');
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('Checkout functionality not implemented yet.');
        });
    }

    function updateCartCount() {
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('#cart-count').forEach(span => {
            span.textContent = cartCount;
        });
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
                <span class="quantity-control">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        document.getElementById('cart-total').textContent = total.toFixed(2);

        // Quantity controls
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.id;
                const item = cart.find(cartItem => cartItem.id === id);

                if (button.classList.contains('increase')) {
                    item.quantity += 1;
                } else if (item.quantity > 1) {
                    item.quantity -= 1;
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                updateCartCount();
            });
        });

        // Remove item
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.id;
                cart = cart.filter(item => item.id !== id);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                updateCartCount();
            });
        });
    }
});