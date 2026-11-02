
import { useEffect, useMemo, useState } from 'react';
import './App.css';
import {
  Search, ShoppingBag, Menu, X, Heart, ArrowUpRight,
  ArrowRight, Star, UserRound, Check, Trash2, Plus, Minus,
  MapPin, Phone, Package, Truck, Mail
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const collections = [
  {
    title: 'Electronics',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900&q=85',
  },
  {
    title: 'Fashion',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85',
  },
  {
    title: 'Home & Living',
    category: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=85',
  },
  {
    title: 'Beauty',
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=85',
  },
];

const money = (amount) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const initialCheckoutForm = {
  shippingName: '',
  customerEmail: '',
  shippingPhone: '',
  shippingCity: '',
  shippingAddress: '',
};

function App() {
  // Products from PostgreSQL
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState('');

  // Shopping states
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [email, setEmail] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [wishlistOnly, setWishlistOnly] = useState(false);

  // Product details
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailQuantity, setDetailQuantity] = useState(1);

  // Checkout
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState(initialCheckoutForm);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  // Fetch products from PostgreSQL
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        setProductsError('');

        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error(`Server returned an error (${response.status}).`);
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.products)) {
          throw new Error('Invalid product data received from server.');
        }

        const formattedProducts = data.products.map((product) => ({
          ...product,
          id: product.id,
          name: product.name,
          category: product.category || 'Other',
          price: Number(product.price),
          stock: Number(product.stock) || 0,
          image: product.image_url || '',
          description: product.description || '',
          rating: null,
          badge: '',
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error('Product fetching error:', error);
        setProductsError(
          error.message || 'Unable to connect to the ShopSphere server.'
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const showNotice = (message) => {
    setNotice(message);

    window.clearTimeout(window.noticeTimer);

    window.noticeTimer = window.setTimeout(() => {
      setNotice('');
    }, 2500);
  };

  // Open product details
  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setDetailQuantity(1);
  };

  // Search, category filtering and sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'All') {
      result = result.filter(
        (item) => item.category === activeCategory
      );
    }

    if (wishlistOnly) {
      result = result.filter(
        (item) => wishlist.includes(item.id)
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term)
      );
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === 'rating') {
      result.sort(
        (a, b) => (b.rating || 0) - (a.rating || 0)
      );
    }

    return result;
  }, [
    products,
    activeCategory,
    searchTerm,
    sortBy,
    wishlistOnly,
    wishlist,
  ]);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Add product to cart with stock validation
  const addToCart = (product, quantity = 1) => {
    const requestedQuantity = Number(quantity);
    const availableStock = Number(product.stock) || 0;

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      showNotice('Please select a valid quantity.');
      return;
    }

    if (availableStock <= 0) {
      showNotice('Sorry, this product is out of stock.');
      return;
    }

    setCart((current) => {
      const existing = current.find(
        (item) => String(item.id) === String(product.id)
      );

      const currentQuantity = existing ? existing.quantity : 0;
      const newQuantity = currentQuantity + requestedQuantity;

      if (newQuantity > availableStock) {
        showNotice(`Only ${availableStock} units are available.`);
        return current;
      }

      if (existing) {
        return current.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      return [
        ...current,
        { ...product, quantity: requestedQuantity },
      ];
    });

    showNotice(`${product.name} added to your cart`);
  };

  // Update cart quantity with stock validation
  const updateQuantity = (id, amount) => {
    setCart((current) =>
      current
        .map((item) => {
          if (String(item.id) !== String(id)) return item;

          const newQuantity = item.quantity + amount;
          const availableStock = Number(item.stock) || 0;

          if (newQuantity > availableStock) {
            showNotice(`Only ${availableStock} units are available.`);
            return item;
          }

          return { ...item, quantity: newQuantity };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Wishlist
  const toggleWishlist = (product) => {
    const saved = wishlist.includes(product.id);

    setWishlist((current) =>
      saved
        ? current.filter((id) => id !== product.id)
        : [...current, product.id]
    );

    showNotice(
      saved ? 'Removed from wishlist' : 'Added to wishlist'
    );
  };

  // Reset filters
  const resetFilters = () => {
    setActiveCategory('All');
    setSearchTerm('');
    setWishlistOnly(false);
    setSortBy('featured');
  };

  // Open checkout
  const openCheckout = () => {
    if (cart.length === 0) {
      showNotice('Your cart is empty.');
      return;
    }

    setCheckoutError('');
    setCheckoutForm(initialCheckoutForm);
    setCheckoutOpen(true);
  };

  // Update checkout fields
  const handleCheckoutChange = (event) => {
    const { name, value } = event.target;

    setCheckoutForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Submit order to the backend
  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (submittingOrder) return;

    if (cart.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    setSubmittingOrder(true);
    setCheckoutError('');

    try {
      const orderPayload = {
        shippingName: checkoutForm.shippingName.trim(),
        customerEmail: checkoutForm.customerEmail.trim().toLowerCase(),
        shippingPhone: checkoutForm.shippingPhone.trim(),
        shippingAddress: checkoutForm.shippingAddress.trim(),
        shippingCity: checkoutForm.shippingCity.trim(),
        paymentMethod: 'cod',
        items: cart.map((item) => ({
          id: item.id,
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message ||
          data.error ||
          'Unable to place your order. Please try again.'
        );
      }

      const returnedOrder =
        data.order ||
        data.data?.order ||
        {};

      const returnedOrderNumber =
        data.orderNumber ||
        data.order_number ||
        returnedOrder.orderNumber ||
        returnedOrder.order_number ||
        (data.orderId
          ? `SS-${String(data.orderId).padStart(6, '0')}`
          : returnedOrder.id
            ? `SS-${String(returnedOrder.id).padStart(6, '0')}`
            : 'Confirmed');

      // Update frontend stock after successful order
      setProducts((current) =>
        current.map((product) => {
          const orderedItem = cart.find(
            (item) => String(item.id) === String(product.id)
          );

          if (!orderedItem) return product;

          return {
            ...product,
            stock: Math.max(
              0,
              product.stock - orderedItem.quantity
            ),
          };
        })
      );

      setOrderConfirmation({
        orderNumber: returnedOrderNumber,
        customerName: checkoutForm.shippingName.trim(),
        customerEmail: checkoutForm.customerEmail.trim().toLowerCase(),
        emailStatus: data.emailStatus || 'failed',
        total: Number(returnedOrder.total ?? cartTotal),
        itemCount: cartCount,
      });

      setCart([]);
      setCheckoutForm(initialCheckoutForm);
      setCheckoutOpen(false);
      setCartOpen(false);

    } catch (error) {
      console.error('Order submission error:', error);
      setCheckoutError(
        error.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Newsletter
  const handleNewsletter = (event) => {
    event.preventDefault();

    if (!email.trim()) return;

    showNotice('Thank you for joining VistaCart!');
    setEmail('');
  };

  return (
    <div className="site-shell">
      <div className="announcement-bar">
        FREE DELIVERY ON ORDERS ABOVE RS. 5,000 &nbsp; • &nbsp;
        SHOP THE LATEST COLLECTION
      </div>

      <header className="header">
        <div className="header-inner">
          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          <a href="#home" className="logo">
            VistaCart<span>.</span>
          </a>

          <nav className="nav-links">
            <a href="#home">Home</a>
            <a href="#collections">Categories</a>
            <a href="#products">Shop All</a>
            <a href="#story">About Us</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="header-actions">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              {searchOpen ? <X size={19} /> : <Search size={19} />}
            </button>

            <button
              onClick={() => {
                setWishlistOnly(!wishlistOnly);
                setActiveCategory('All');

                document
                  .getElementById('products')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              aria-label="Wishlist"
            >
              <Heart size={19} />

              {wishlist.length > 0 && (
                <span className="cart-count">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setCartOpen(true)}
              aria-label="Shopping cart"
            >
              <ShoppingBag size={19} />

              {cartCount > 0 && (
                <span className="cart-count">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() =>
                showNotice('Customer accounts are coming soon!')
              }
              aria-label="Account"
            >
              <UserRound size={19} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="mobile-menu">
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Home
            </a>
            <a href="#collections" onClick={() => setMenuOpen(false)}>
              Categories
            </a>
            <a href="#products" onClick={() => setMenuOpen(false)}>
              Shop All
            </a>
            <a href="#story" onClick={() => setMenuOpen(false)}>
              About Us
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>
          </nav>
        )}

        {searchOpen && (
          <div className="search-panel">
            <input
              type="search"
              placeholder="Search products or categories..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setWishlistOnly(false);
              }}
              autoFocus
            />
          </div>
        )}
      </header>

      <section className="hero hero-slideshow" id="home">
        <div
          className="hero-slides"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(20,18,17,.82), rgba(20,18,17,.18)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800&q=90")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="hero-overlay" />

        <div className="hero-content">
          <p className="hero-eyebrow">THE NEW WAY TO SHOP</p>

          <h1 className="hero-title">
            Everything You Love. One Place.
          </h1>

          <p className="hero-description">
            Discover quality products across technology, fashion, beauty and
            home essentials — all carefully selected for you.
          </p>

          <a href="#products" className="hero-button">
            EXPLORE THE STORE <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="hero-slide-count">01 / 01</div>
      </section>

      <section className="intro-strip">
        <div>
          <h3>Curated Selection</h3>
          <p>Products worth discovering</p>
        </div>

        <div>
          <h3>Great Value</h3>
          <p>Quality for every budget</p>
        </div>

        <div>
          <h3>Shopping Made Easy</h3>
          <p>Your favourites in one place</p>
        </div>
      </section>

      <section className="collections-section" id="collections">
        <div className="section-heading">
          <p className="section-eyebrow">EXPLORE VISTACART</p>

          <h2 className="section-title">
            Shop By Category
          </h2>

          <p className="section-description">
            Find everything you need, from everyday essentials to something
            special.
          </p>
        </div>

        <div className="collections-grid">
          {collections.map((collection) => (
            <button
              className="collection-card"
              key={collection.category}
              onClick={() => {
                setActiveCategory(collection.category);
                setWishlistOnly(false);

                document
                  .getElementById('products')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                padding: 0,
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <img
                src={collection.image}
                alt={collection.title}
                loading="lazy"
              />

              <div className="collection-overlay">
                <h3 className="collection-title">
                  {collection.title}
                </h3>

                <span className="collection-link">
                  EXPLORE CATEGORY <ArrowUpRight size={13} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="products-section" id="products">
        <div className="section-heading">
          <p className="section-eyebrow">THE VISTACART EDIT</p>

          <h2 className="section-title">
            {wishlistOnly
              ? 'Your Wishlist'
              : 'Discover Our Products'}
          </h2>

          <p className="section-description">
            Explore our handpicked selection of products across every category.
          </p>
        </div>

        <div className="products-toolbar">
          <div className="category-filters">
            {[
              'All',
              'Electronics',
              'Fashion',
              'Home & Living',
              'Beauty',
            ].map((category) => (
              <button
                key={category}
                className={
                  activeCategory === category ? 'active' : ''
                }
                onClick={() => {
                  setActiveCategory(category);
                  setWishlistOnly(false);
                }}
              >
                {category}
              </button>
            ))}

            <button
              className={wishlistOnly ? 'active' : ''}
              onClick={() => setWishlistOnly(!wishlistOnly)}
            >
              <Heart size={13} /> Wishlist
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <p className="section-description" style={{ marginBottom: 22 }}>
          {loadingProducts
            ? 'Loading products...'
            : `Showing ${filteredProducts.length} products`}
        </p>

        {loadingProducts ? (
          <div className="empty-state">
            <h3>Loading products...</h3>
            <p>Please wait while we connect to our store.</p>
          </div>
        ) : productsError ? (
          <div className="empty-state">
            <h3>Unable to load products</h3>
            <p>{productsError}</p>

            <button
              className="hero-button"
              onClick={() => window.location.reload()}
            >
              TRY AGAIN
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div
                  className="product-image-wrap"
                  onClick={() => openProductDetails(product)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      openProductDetails(product);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                  aria-label={`View ${product.name} details`}
                >
                  {product.image ? (
                    <img
                      className="product-image"
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="product-image">
                      Product image unavailable
                    </div>
                  )}

                  {product.badge && (
                    <span className="product-badge">
                      {product.badge}
                    </span>
                  )}

                  <button
                    className={`wishlist-button ${
                      wishlist.includes(product.id) ? 'active' : ''
                    }`}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleWishlist(product);
                    }}
                    aria-label="Toggle wishlist"
                  >
                    <Heart
                      size={17}
                      fill={
                        wishlist.includes(product.id)
                          ? 'currentColor'
                          : 'none'
                      }
                    />
                  </button>
                </div>

                <div className="product-info">
                  <p className="product-category">
                    {product.category}
                  </p>

                  <h3
                    className="product-name"
                    onClick={() => openProductDetails(product)}
                    style={{ cursor: 'pointer' }}
                  >
                    {product.name}
                  </h3>

                  <div className="product-rating">
                    {product.rating ? (
                      <>
                        <Star size={13} fill="currentColor" />
                        {product.rating}
                        <span>Customer rating</span>
                      </>
                    ) : (
                      <span>New arrival</span>
                    )}
                  </div>

                  <p className="product-price">
                    {money(product.price)}
                  </p>

                  <button
                    type="button"
                    onClick={() => openProductDetails(product)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginBottom: '8px',
                      border: '1px solid #805c39',
                      background: 'transparent',
                      color: '#805c39',
                      cursor: 'pointer',
                      fontSize: '11px',
                      letterSpacing: '1px',
                      fontWeight: 600,
                    }}
                  >
                    VIEW DETAILS
                  </button>

                  <button
                    className="add-to-cart-button"
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    style={{
                      opacity: product.stock <= 0 ? 0.5 : 1,
                      cursor: product.stock <= 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {product.stock <= 0
                      ? 'OUT OF STOCK'
                      : <>ADD TO CART <ArrowUpRight size={14} /></>}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Try another category or search term.</p>

            <button
              className="hero-button"
              onClick={resetFilters}
            >
              CLEAR FILTERS
            </button>
          </div>
        )}
      </section>

      <section className="story-section" id="story">
        <div className="story-image">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=85"
            alt="Modern shopping experience"
            loading="lazy"
          />
        </div>

        <div className="story-content">
          <p className="section-eyebrow">OUR PHILOSOPHY</p>

          <h2>A Better Way to Discover.</h2>

          <p>
            VistaCart brings multiple shopping categories together in one
            convenient digital destination. Our goal is to make discovering
            products simple, enjoyable and accessible.
          </p>

          <p>
            From technology and fashion to home essentials and beauty, explore
            a world of products in one place.
          </p>

          <a href="#products" className="story-link">
            EXPLORE VISTACART <ArrowRight size={14} />
          </a>
        </div>
      </section>

      <section className="newsletter-section" id="contact">
        <p className="section-eyebrow">STAY CONNECTED</p>

        <h2>Good Finds Start Here.</h2>

        <p>
          Join our community to hear about new arrivals and featured collections.
        </p>

        <form
          className="newsletter-form"
          onSubmit={handleNewsletter}
        >
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <button type="submit">
            Subscribe <ArrowUpRight size={14} />
          </button>
        </form>
      </section>

      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>VistaCart.</h2>

            <p>
              Your destination for everyday essentials, modern style and
              products worth discovering.
            </p>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>
            <a href="#home">Home</a>
            <a href="#collections">Categories</a>
            <a href="#products">Shop All</a>
            <a href="#story">About Us</a>
          </div>

          <div className="footer-column">
            <h3>Categories</h3>
            <a href="#products">Electronics</a>
            <a href="#products">Fashion</a>
            <a href="#products">Home & Living</a>
            <a href="#products">Beauty</a>
          </div>

          <div className="footer-column">
            <h3>Customer Care</h3>
            <a href="#contact">Contact Us</a>
            <a href="#contact">Customer Support</a>
            <a href="#contact">Shipping Information</a>
            <a href="#contact">Privacy Policy</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} VistaCart. All rights reserved.
          </p>

          <p>Everything You Love. One Place.</p>
        </div>
      </footer>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            background: 'rgba(0,0,0,.68)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
            overflowY: 'auto',
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              width: 'min(900px, 100%)',
              maxHeight: '92vh',
              overflowY: 'auto',
              background: '#faf7f1',
              color: '#30231f',
              borderRadius: 8,
              padding: 24,
              gap: 28,
            }}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              aria-label="Close product details"
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 2,
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: 'none',
                background: '#eee5d9',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <div
              style={{
                minHeight: 280,
                background: '#eee5d9',
                borderRadius: 5,
                overflow: 'hidden',
              }}
            >
              {selectedProduct.image ? (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: 280,
                    maxHeight: 500,
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div style={{ padding: 30 }}>
                  Product image unavailable
                </div>
              )}
            </div>

            <div style={{ padding: '18px 8px' }}>
              <p
                style={{
                  color: '#805c39',
                  letterSpacing: 2,
                  fontSize: 12,
                  textTransform: 'uppercase',
                }}
              >
                {selectedProduct.category}
              </p>

              <h2
                style={{
                  fontSize: 'clamp(25px, 4vw, 36px)',
                  lineHeight: 1.2,
                  margin: '12px 0',
                }}
              >
                {selectedProduct.name}
              </h2>

              <p
                style={{
                  fontSize: 25,
                  fontWeight: 700,
                  color: '#805c39',
                  margin: '18px 0',
                }}
              >
                {money(selectedProduct.price)}
              </p>

              <div
                style={{
                  height: 1,
                  background: '#ddd2c3',
                  margin: '20px 0',
                }}
              />

              <h3 style={{ marginBottom: 10 }}>Product Description</h3>

              <p
                style={{
                  lineHeight: 1.8,
                  color: '#695b51',
                  fontSize: 14,
                  whiteSpace: 'pre-line',
                }}
              >
                {selectedProduct.description ||
                  'Discover this quality product from our carefully selected collection.'}
              </p>

              <div
                style={{
                  marginTop: 22,
                  padding: 13,
                  background: '#eee9df',
                  borderRadius: 4,
                }}
              >
                <strong>Availability: </strong>

                <span
                  style={{
                    color:
                      selectedProduct.stock > 0 ? '#287647' : '#b42318',
                  }}
                >
                  {selectedProduct.stock > 0
                    ? `${selectedProduct.stock} units in stock`
                    : 'Out of stock'}
                </span>
              </div>

              {selectedProduct.stock > 0 && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 15,
                      marginTop: 22,
                    }}
                  >
                    <strong>Quantity</strong>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 18,
                        border: '1px solid #c9b9a5',
                        padding: '8px 12px',
                      }}
                    >
                      <button
                        onClick={() =>
                          setDetailQuantity((quantity) =>
                            Math.max(1, quantity - 1)
                          )
                        }
                        disabled={detailQuantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={15} />
                      </button>

                      <strong>{detailQuantity}</strong>

                      <button
                        onClick={() =>
                          setDetailQuantity((quantity) =>
                            Math.min(
                              selectedProduct.stock,
                              quantity + 1
                            )
                          )
                        }
                        disabled={
                          detailQuantity >= selectedProduct.stock
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: 13,
                      color: '#695b51',
                      marginTop: 15,
                    }}
                  >
                    Subtotal: {money(selectedProduct.price * detailQuantity)}
                  </p>

                  <button
                    className="hero-button"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}
                    onClick={() => {
                      addToCart(selectedProduct, detailQuantity);
                      setSelectedProduct(null);
                      setDetailQuantity(1);
                    }}
                  >
                    ADD TO CART <ShoppingBag size={16} />
                  </button>
                </>
              )}

              {selectedProduct.stock <= 0 && (
                <button
                  disabled
                  style={{
                    width: '100%',
                    padding: 14,
                    marginTop: 20,
                    background: '#b8aaa0',
                    border: 'none',
                    color: '#fff',
                    cursor: 'not-allowed',
                  }}
                >
                  OUT OF STOCK
                </button>
              )}

              <button
                onClick={() => setSelectedProduct(null)}
                style={{
                  width: '100%',
                  padding: 13,
                  marginTop: 10,
                  background: 'transparent',
                  border: '1px solid #805c39',
                  color: '#805c39',
                  cursor: 'pointer',
                }}
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Drawer */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(0,0,0,.55)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: 'min(440px, 100%)',
              height: '100%',
              overflowY: 'auto',
              background: '#faf7f1',
              padding: 25,
              color: '#30231f',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 25,
              }}
            >
              <h2 style={{ fontSize: 30 }}>
                Your Cart ({cartCount})
              </h2>

              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                <X />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-state">
                <ShoppingBag size={35} />
                <h3>Your cart is empty</h3>
                <p>Discover something you love.</p>

                <button
                  className="hero-button"
                  onClick={() => setCartOpen(false)}
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: 14,
                      padding: '15px 0',
                      borderBottom: '1px solid #ddd2c3',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 85,
                        height: 95,
                        objectFit: 'cover',
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <h3>{item.name}</h3>

                      <p
                        style={{
                          margin: '8px 0',
                          color: '#805c39',
                        }}
                      >
                        {money(item.price)}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={15} />
                        </button>

                        {item.quantity}

                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.stock}
                          aria-label="Increase quantity"
                        >
                          <Plus size={15} />
                        </button>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, -item.quantity)
                          }
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    marginTop: 25,
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 19,
                  }}
                >
                  <strong>Total</strong>
                  <strong>{money(cartTotal)}</strong>
                </div>

                <p
                  style={{
                    color: '#74675c',
                    fontSize: 12,
                    marginTop: 8,
                  }}
                >
                  Delivery charges, if applicable, will be confirmed during
                  order processing.
                </p>

                <button
                  className="hero-button"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}
                  onClick={openCheckout}
                >
                  PROCEED TO CHECKOUT <ArrowRight size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div
          onClick={() => {
            if (!submittingOrder) {
              setCheckoutOpen(false);
              setCheckoutError('');
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 400,
            background: 'rgba(0,0,0,.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 15,
            overflowY: 'auto',
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: 'min(650px, 100%)',
              maxHeight: '94vh',
              overflowY: 'auto',
              background: '#faf7f1',
              color: '#30231f',
              padding: '28px',
              borderRadius: 8,
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (!submittingOrder) {
                  setCheckoutOpen(false);
                  setCheckoutError('');
                }
              }}
              disabled={submittingOrder}
              aria-label="Close checkout"
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              <X size={22} />
            </button>

            <p
              style={{
                color: '#805c39',
                letterSpacing: 2,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              VISTACART CHECKOUT
            </p>

            <h2 style={{ fontSize: 30, margin: '10px 0' }}>
              Delivery Information
            </h2>

            <p style={{ color: '#74675c', fontSize: 14, lineHeight: 1.6 }}>
              Enter your details so we can deliver your order and email your
              confirmation.
            </p>

            <form onSubmit={handlePlaceOrder}>
              <div style={{ marginTop: 24 }}>
                <label
                  htmlFor="shippingName"
                  style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}
                >
                  <UserRound size={15} style={{ verticalAlign: 'middle' }} />{' '}
                  Full Name
                </label>

                <input
                  id="shippingName"
                  name="shippingName"
                  type="text"
                  value={checkoutForm.shippingName}
                  onChange={handleCheckoutChange}
                  placeholder="Enter your full name"
                  required
                  maxLength={100}
                  autoComplete="name"
                  disabled={submittingOrder}
                  style={{
                    width: '100%',
                    padding: 13,
                    border: '1px solid #c9b9a5',
                    background: '#fff',
                    color: '#30231f',
                    borderRadius: 4,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Customer Email */}
              <div style={{ marginTop: 18 }}>
                <label
                  htmlFor="customerEmail"
                  style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}
                >
                  <Mail size={15} style={{ verticalAlign: 'middle' }} />{' '}
                  Email Address
                </label>

                <input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  value={checkoutForm.customerEmail}
                  onChange={handleCheckoutChange}
                  placeholder="Enter your email address"
                  required
                  maxLength={255}
                  autoComplete="email"
                  disabled={submittingOrder}
                  style={{
                    width: '100%',
                    padding: 13,
                    border: '1px solid #c9b9a5',
                    background: '#fff',
                    color: '#30231f',
                    borderRadius: 4,
                    boxSizing: 'border-box',
                  }}
                />

                <p style={{ fontSize: 12, color: '#74675c', marginTop: 7 }}>
                  Your order confirmation will be sent to this email address.
                </p>
              </div>

              <div style={{ marginTop: 18 }}>
                <label
                  htmlFor="shippingPhone"
                  style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}
                >
                  <Phone size={15} style={{ verticalAlign: 'middle' }} />{' '}
                  Phone Number
                </label>

                <input
                  id="shippingPhone"
                  name="shippingPhone"
                  type="tel"
                  value={checkoutForm.shippingPhone}
                  onChange={handleCheckoutChange}
                  placeholder="03XX XXXXXXX"
                  required
                  maxLength={30}
                  autoComplete="tel"
                  disabled={submittingOrder}
                  style={{
                    width: '100%',
                    padding: 13,
                    border: '1px solid #c9b9a5',
                    background: '#fff',
                    color: '#30231f',
                    borderRadius: 4,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginTop: 18 }}>
                <label
                  htmlFor="shippingCity"
                  style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}
                >
                  <MapPin size={15} style={{ verticalAlign: 'middle' }} />{' '}
                  City
                </label>

                <input
                  id="shippingCity"
                  name="shippingCity"
                  type="text"
                  value={checkoutForm.shippingCity}
                  onChange={handleCheckoutChange}
                  placeholder="Enter your city"
                  required
                  maxLength={100}
                  autoComplete="address-level2"
                  disabled={submittingOrder}
                  style={{
                    width: '100%',
                    padding: 13,
                    border: '1px solid #c9b9a5',
                    background: '#fff',
                    color: '#30231f',
                    borderRadius: 4,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginTop: 18 }}>
                <label
                  htmlFor="shippingAddress"
                  style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}
                >
                  <Truck size={15} style={{ verticalAlign: 'middle' }} />{' '}
                  Complete Delivery Address
                </label>

                <textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  value={checkoutForm.shippingAddress}
                  onChange={handleCheckoutChange}
                  placeholder="House number, street, area and nearby landmark"
                  required
                  maxLength={2000}
                  rows={3}
                  autoComplete="street-address"
                  disabled={submittingOrder}
                  style={{
                    width: '100%',
                    padding: 13,
                    border: '1px solid #c9b9a5',
                    background: '#fff',
                    color: '#30231f',
                    borderRadius: 4,
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: 22,
                  padding: 16,
                  background: '#eee9df',
                  borderRadius: 5,
                }}
              >
                <h3 style={{ marginBottom: 10 }}>
                  Payment Method
                </h3>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked
                    readOnly
                  />

                  <span>
                    <strong>Cash on Delivery</strong>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 12,
                        color: '#74675c',
                        marginTop: 3,
                      }}
                    >
                      Pay when your order arrives.
                    </span>
                  </span>
                </label>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 22,
                  paddingTop: 17,
                  borderTop: '1px solid #ddd2c3',
                  fontSize: 19,
                }}
              >
                <strong>Order Total</strong>
                <strong style={{ color: '#805c39' }}>
                  {money(cartTotal)}
                </strong>
              </div>

              {checkoutError && (
                <div
                  role="alert"
                  style={{
                    marginTop: 16,
                    padding: 13,
                    background: '#fce8e6',
                    color: '#b42318',
                    borderRadius: 4,
                    fontSize: 13,
                  }}
                >
                  {checkoutError}
                </div>
              )}

              <button
                type="submit"
                disabled={submittingOrder || cart.length === 0}
                className="hero-button"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: 22,
                  opacity: submittingOrder ? 0.65 : 1,
                  cursor: submittingOrder ? 'wait' : 'pointer',
                }}
              >
                {submittingOrder
                  ? 'PLACING YOUR ORDER...'
                  : <>CONFIRM ORDER <ArrowRight size={16} /></>}
              </button>

              <p
                style={{
                  textAlign: 'center',
                  fontSize: 11,
                  color: '#74675c',
                  marginTop: 12,
                }}
              >
                Your order will be securely submitted to VistaCart.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Successful Order Confirmation */}
      {orderConfirmation && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 500,
            background: 'rgba(0,0,0,.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              width: 'min(470px, 100%)',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#faf7f1',
              color: '#30231f',
              padding: 32,
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: '#e4f2e8',
                color: '#287647',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <Check size={34} />
            </div>

            <p
              style={{
                color: '#805c39',
                letterSpacing: 2,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              ORDER SUCCESSFULLY PLACED
            </p>

            <h2 style={{ fontSize: 30, margin: '12px 0' }}>
              Thank You!
            </h2>

            <p style={{ color: '#74675c', lineHeight: 1.7 }}>
              Thank you, {orderConfirmation.customerName}. Your order has
              been received successfully.
            </p>

            {/* Email delivery result */}
            <div
              style={{
                marginTop: 18,
                padding: 14,
                background:
                  orderConfirmation.emailStatus === 'sent'
                    ? '#e4f2e8'
                    : '#fff0dc',
                color:
                  orderConfirmation.emailStatus === 'sent'
                    ? '#287647'
                    : '#87551a',
                borderRadius: 5,
                textAlign: 'left',
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={17} />
                <strong>
                  {orderConfirmation.emailStatus === 'sent'
                    ? 'Confirmation email sent!'
                    : 'Order confirmed — email not sent yet'}
                </strong>
              </div>

              <p style={{ margin: '7px 0 0', overflowWrap: 'anywhere' }}>
                {orderConfirmation.emailStatus === 'sent'
                  ? `A confirmation email has been sent to ${orderConfirmation.customerEmail}.`
                  : `Your order is saved. We could not send an email to ${orderConfirmation.customerEmail}. Please check your email configuration.`}
              </p>
            </div>

            <div
              style={{
                marginTop: 24,
                padding: 18,
                background: '#eee9df',
                borderRadius: 5,
                textAlign: 'left',
              }}
            >
              <p style={{ fontSize: 12, color: '#74675c' }}>
                ORDER NUMBER
              </p>

              <h3
                style={{
                  fontSize: 22,
                  color: '#805c39',
                  margin: '5px 0 16px',
                }}
              >
                {orderConfirmation.orderNumber}
              </h3>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 8,
                }}
              >
                <span>Items</span>
                <strong>{orderConfirmation.itemCount}</strong>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 12,
                }}
              >
                <span>Total</span>
                <strong>{money(orderConfirmation.total)}</strong>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 12,
                }}
              >
                <span>Payment</span>
                <strong>Cash on Delivery</strong>
              </div>
            </div>

            <p
              style={{
                fontSize: 13,
                color: '#74675c',
                lineHeight: 1.6,
                marginTop: 20,
              }}
            >
              Please keep your phone available. Our team can contact you
              regarding your delivery.
            </p>

            <button
              className="hero-button"
              onClick={() => setOrderConfirmation(null)}
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: 22,
              }}
            >
              CONTINUE SHOPPING <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Notification */}
      {notice && (
        <div className="toast-message">
          <Check size={16} /> {notice}
        </div>
      )}
    </div>
  );
}

export default App;
