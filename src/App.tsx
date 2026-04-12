/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart as CartIcon, 
  Heart, 
  User as UserIcon, 
  MapPin, 
  CreditCard, 
  Bell, 
  Headphones, 
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Lock,
  Search,
  Coins,
  Gift,
  BarChart3,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, CartItem, Product, User } from './types';
import { MOCK_ORDERS, MOCK_PRODUCTS } from './mockData';

// Components
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import Profile from './components/Profile';
import Support from './components/Support';
import Notifications from './components/Notifications';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProductDetails from './components/ProductDetails';
import Checkout from './components/Checkout';
import Payment from './components/Payment';
import Invoice from './components/Invoice';
import InvoicePage from './components/admin/InvoicePage';
import BottomImageBanner from './components/BottomImageBanner';
import Navbar from './components/Navigation/Navbar';
import BottomNav from './components/BottomNav';
import CategorySidebar from './components/Navigation/CategorySidebar';
import Footer from './components/Footer';
import LuckyDraw from './components/LuckyDraw';
import RewardDashboard from './components/RewardDashboard';
import AdminOrdersManagement from './components/AdminOrdersManagement';
import AdminRewardManagement from './components/AdminRewardManagement';
import AdminCampaignManagement from './components/AdminCampaignManagement';
import AdminCartMonitoring from './components/AdminCartMonitoring';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CustomerDashboard from './components/CustomerDashboard';
import CustomerPanelManagement from './components/admin/CustomerPanelManagement';
import BrandingManagement from './components/admin/BrandingManagement';
import AIChatControl from './components/admin/AIChatControl';
import CustomerSystem from './components/admin/CustomerSystem';
import ChatWidget from './components/ChatWidget';
import CategoryPage from './components/CategoryPage';
import TazuGamesCenter from './components/TazuGamesCenter';
import BuyAny3Offer from './components/BuyAny3Offer';
import PickupLocations from './components/PickupLocations';
import AffiliateDashboard from './components/AffiliateDashboard';
import TopRankingProducts from './components/TopRankingProducts';
import { Zap, Star, Layout, Palette } from 'lucide-react';
import { Category } from './types';
import { MOCK_CATEGORIES } from './mockData';

// Settings Sub-components
import Settings from './components/Settings';
import MessageSettings from './components/settings/MessageSettings';
import CountrySettings from './components/settings/CountrySettings';
import LanguageSettings from './components/settings/LanguageSettings';
import Policies from './components/settings/Policies';
import HelpCenter from './components/settings/HelpCenter';
import MyReviews from './components/MyReviews';
import PaymentMethods from './components/PaymentMethods';
import Feedback from './components/settings/Feedback';
import SecuritySettings from './components/settings/SecuritySettings';

import { ThemeProvider } from './contexts/ThemeContext';
import { BrandingProvider } from './contexts/BrandingContext';

import Offers from './components/Offers';

type View = 'home' | 'dashboard' | 'orders' | 'wishlist' | 'profile' | 'notifications' | 'support' | 'settings' | 'admin-login' | 'admin-dashboard' | 'product-details' | 'checkout' | 'payment' | 'messages' | 'featured' | 'admin-invoice' | 'lucky-draw' | 'rewards' | 'admin-orders' | 'admin-rewards' | 'admin-campaigns' | 'admin-carts' | 'admin-customer-panel' | 'admin-branding' | 'admin-ai-chat' | 'admin-customer-system' | 'login' | 'signup' | 'settings-messages' | 'settings-country' | 'settings-language' | 'settings-policies' | 'settings-help' | 'settings-feedback' | 'settings-security' | 'category' | 'tazu-games' | 'buy-any-3' | 'pickup-locations' | 'affiliate-dashboard' | 'help' | 'reviews' | 'payments' | 'top-ranking-products' | 'offers';


export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [user, setUser] = useState<User | null>(null);
  const isAdmin = user?.role === 'admin';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [ordersTab, setOrdersTab] = useState<string>('All');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Try refresh token
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            const refreshRes = await fetch('/api/auth/refresh', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
            });
            if (refreshRes.ok) {
              const data = await refreshRes.json();
              if (data.accessToken) localStorage.setItem('access_token', data.accessToken);
              if (data.refreshToken) localStorage.setItem('refresh_token', data.refreshToken);
              setUser(data.user);
            } else {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
            }
          }
        }
      } catch (err) {
        console.error('Session check failed', err);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        // Re-check session after successful OAuth
        fetch('/api/auth/me')
          .then(res => res.json())
          .then(async (data) => {
            if (data.user) {
              // Sync guest cart to server before setting user
              const guestCart = localStorage.getItem('guest_cart');
              if (guestCart) {
                const items = JSON.parse(guestCart);
                if (items.length > 0) {
                  await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: data.user.id, items })
                  });
                  localStorage.removeItem('guest_cart');
                }
              }
              setUser(data.user);
              setCurrentView('dashboard');
            }
          });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLoginSuccess = (u: User) => {
    setUser(u);
    if (u.role === 'admin') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setCurrentView('home');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const getPanel = (): 'admin' | 'customer' | 'frontend' => {
    if (currentView.startsWith('admin-')) return 'admin';
    if (['dashboard', 'profile', 'orders', 'notifications', 'settings'].includes(currentView)) return 'customer';
    return 'frontend';
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);
        if (prodRes.ok) setProducts(await prodRes.json());
        if (catRes.ok) setCategories(await catRes.json());
      } catch (err) {
        console.error('Failed to fetch initial data', err);
      }
    };
    fetchData();
  }, []);

  // Sync wishlist with server if user is logged in
  useEffect(() => {
    if (user) {
      fetch(`/api/wishlist/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.items) {
            const wishlistProducts = products.filter(p => data.items.includes(p.id));
            setWishlist(wishlistProducts);
          }
        });
    }
  }, [user, products]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = async (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      let newCart;
      if (existing) {
        newCart = prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        newCart = [...prev, {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          variant: product.variant
        }];
      }
      
      // Sync with server if logged in
      if (user) {
        fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, items: newCart })
        });
      } else {
        localStorage.setItem('guest_cart', JSON.stringify(newCart));
      }
      
      return newCart;
    });
    showToast('✔ Product Added To Cart');
  };

  // Load cart on mount or user change
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          const res = await fetch(`/api/cart/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setCart(data.items || []);
          }
        } catch (err) {
          console.error('Failed to load cart from server', err);
        }
      } else {
        const localCart = localStorage.getItem('guest_cart');
        if (localCart) {
          setCart(JSON.parse(localCart));
        }
      }
    };
    loadCart();
  }, [user]);

  // Sync cart to server/localstorage
  useEffect(() => {
    const syncCart = async () => {
      if (user) {
        try {
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, items: cart })
          });
        } catch (err) {
          console.error('Failed to sync cart to server', err);
        }
      } else {
        localStorage.setItem('guest_cart', JSON.stringify(cart));
      }
    };
    if (cart.length > 0 || user) {
      syncCart();
    }
  }, [cart, user]);

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const reorder = (order: Order) => {
    const item = order.items[0];
    if (item) {
      setCart([item]);
      setCurrentView('checkout');
    }
  };

  const toggleWishlist = async (product: Product) => {
    const isWishlisted = wishlist.find(p => p.id === product.id);
    
    if (user) {
      try {
        if (isWishlisted) {
          await fetch(`/api/wishlist/${user.id}/${product.id}`, { method: 'DELETE' });
        } else {
          await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, productId: product.id })
          });
        }
      } catch (err) {
        console.error('Wishlist sync failed', err);
      }
    }

    setWishlist(prev => {
      if (isWishlisted) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const navItems = isAdmin ? [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-orders', label: 'Orders Management', icon: Package },
    { id: 'admin-customer-system', label: 'Customer System', icon: Layout },
    { id: 'admin-rewards', label: 'Smart Reward Points', icon: Coins },
    { id: 'admin-campaigns', label: 'Lucky Reward Draw', icon: Gift },
    { id: 'admin-customer-panel', label: 'Customer Panel Management', icon: Layout },
    { id: 'admin-branding', label: 'Branding & UI Control', icon: Palette },
    { id: 'admin-ai-chat', label: 'AI Support Control', icon: Bot },
    { id: 'admin-carts', label: 'Cart Monitoring', icon: CartIcon },
    { id: 'admin-analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admin-settings', label: 'Settings', icon: SettingsIcon },
  ] : [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'dashboard', label: 'Account', icon: UserIcon },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlist.length },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 2 },
    { id: 'support', label: 'Support Center', icon: Headphones },
  ];

  const renderView = () => {
    // Auth Guard for Account views
    if (!user && ['profile', 'orders', 'notifications', 'settings', 'rewards', 'lucky-draw'].includes(currentView)) {
      return (
        <Login 
          onLogin={handleLoginSuccess}
          onSignUpClick={() => setCurrentView('signup')}
        />
      );
    }

    switch (currentView) {
      case 'login':
        return (
          <Login 
            onLogin={handleLoginSuccess}
            onSignUpClick={() => setCurrentView('signup')}
          />
        );
      case 'signup':
        return (
          <SignUp 
            onSignUp={handleLoginSuccess}
            onBack={() => setCurrentView('login')}
          />
        );
      case 'home': return (
        <Home 
          products={products}
          categories={categories}
          onAddToCart={addToCart} 
          setCurrentView={setCurrentView} 
          onProductClick={(p) => { setSelectedProduct(p); setCurrentView('product-details'); }} 
          onCategoryClick={(c) => { setSelectedCategory(c); setCurrentView('category'); }}
          onToggleWishlist={toggleWishlist}
          wishlist={wishlist}
        />
      );
      case 'category': return selectedCategory ? (
        <CategoryPage 
          category={selectedCategory} 
          products={products}
          categories={categories}
          onBack={() => setCurrentView('home')} 
          onAddToCart={addToCart} 
          onProductClick={(p) => { setSelectedProduct(p); setCurrentView('product-details'); }} 
          onToggleWishlist={toggleWishlist} 
          wishlist={wishlist} 
        />
      ) : (
        <Home 
          products={products} 
          categories={categories} 
          onAddToCart={addToCart} 
          setCurrentView={setCurrentView} 
          onProductClick={(p) => { setSelectedProduct(p); setCurrentView('product-details'); }} 
          onCategoryClick={(c) => { setSelectedCategory(c); setCurrentView('category'); }} 
          onToggleWishlist={toggleWishlist} 
          wishlist={wishlist} 
        />
      );
      case 'product-details': return selectedProduct ? <ProductDetails product={selectedProduct} onBack={() => setCurrentView('home')} onAddToCart={addToCart} onOrderNow={(p) => { setCheckoutProduct({ productId: p.id, name: p.name, price: p.price, image: p.image, quantity: p.quantity || 1, variant: p.variant }); setCurrentView('checkout'); }} onToggleWishlist={toggleWishlist} isWishlisted={wishlist.some(p => p.id === selectedProduct.id)} setCurrentView={setCurrentView} onProductClick={(p) => { setSelectedProduct(p); setCurrentView('product-details'); }} /> : <Home products={products} categories={categories} onAddToCart={addToCart} setCurrentView={setCurrentView} onProductClick={(p) => { setSelectedProduct(p); setCurrentView('product-details'); }} onCategoryClick={(c) => { setSelectedCategory(c); setCurrentView('category'); }} onToggleWishlist={toggleWishlist} wishlist={wishlist} />;
      case 'checkout': return <Checkout items={checkoutProduct ? [checkoutProduct] : cart} onBack={() => { setCheckoutProduct(null); setCurrentView(checkoutProduct ? 'product-details' : 'cart'); }} onSuccess={(order) => { setCompletedOrder(order); setCart([]); setCheckoutProduct(null); setCurrentView('home'); }} />;
      case 'cart': return <Cart items={cart} onRemove={removeFromCart} onUpdateQty={updateCartQty} onCheckout={() => { setCheckoutProduct(null); setCurrentView('checkout'); }} onGoShopping={() => setCurrentView('home')} />;
      case 'payment': return <Payment orderDetails={orderDetails} onBack={() => setCurrentView('checkout')} onSuccess={async (payment) => {
        const newOrderData = {
          amount: orderDetails.total,
          paymentMethod: payment.method,
          paymentStatus: payment.status === 'Paid' ? 'paid' : 'pending',
          items: cart,
          shippingAddress: orderDetails.address,
          customerName: orderDetails.fullName,
          customerPhone: orderDetails.mobileNumber,
          customerEmail: orderDetails.email,
          division: orderDetails.division,
          district: orderDetails.district,
          upazila: orderDetails.upazila,
          // New Pickup Fields
          deliveryMethod: orderDetails.deliveryMethod,
          pickupPointId: orderDetails.pickupPointId,
          pickupDistrict: orderDetails.pickupDistrict,
          pickupThana: orderDetails.pickupThana,
          pickupDate: orderDetails.pickupDate,
          altPhone: orderDetails.altPhone,
          customerNote: payment.customerNote || orderDetails.customerNote,
          // Payment Details
          transactionId: payment.transactionId,
          paymentTime: payment.time,
          deliveryCharge: orderDetails.deliveryCharge,
          orderSource: 'website'
        };

        try {
          const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrderData)
          });
          
          if (res.ok) {
            const createdOrder = await res.json();
            setCompletedOrder(createdOrder);
            setCart([]); // Clear cart after successful order
          } else {
            const error = await res.json();
            alert(error.error || 'Failed to place order');
          }
        } catch (err) {
          console.error('Order placement failed', err);
          alert('Failed to place order. Please try again.');
        }
      }} />;
      case 'dashboard': 
        return (
          <CustomerDashboard 
            user={user} 
            orders={MOCK_ORDERS} 
            wishlist={wishlist} 
            onLogout={handleLogout} 
            setCurrentView={(view, tab) => {
              if (view === 'orders' && tab) {
                setOrdersTab(tab);
              } else if (view === 'orders') {
                setOrdersTab('All');
              }
              setCurrentView(view);
            }}
            onProductClick={(p) => { setSelectedProduct(p); setCurrentView('product-details'); }}
          />
        );
      case 'admin-customer-panel': return <CustomerPanelManagement userRole={user?.role} />;
      case 'admin-customer-system': return isAdmin ? <CustomerSystem /> : <AdminLogin onLogin={handleLoginSuccess} />;
      case 'admin-branding': return <BrandingManagement />;
      case 'admin-ai-chat': return <AIChatControl />;
      case 'orders': return <Orders orders={MOCK_ORDERS} initialTab={ordersTab} onReorder={reorder} onProductClick={(id) => { /* find product */ }} />;
      case 'wishlist': return <Wishlist wishlist={wishlist} onRemoveFromWishlist={toggleWishlist} onAddToCart={addToCart} onProductClick={(p) => { setSelectedProduct(p); setCurrentView('product-details'); }} onBack={() => setCurrentView('home')} />;
      case 'profile': return <Profile onBack={() => setCurrentView('dashboard')} />;
      case 'notifications': return <Notifications />;
      case 'support': return <Support setCurrentView={setCurrentView} user={user} />;
      case 'messages': return <Support setCurrentView={setCurrentView} user={user} />;
      case 'featured': return <div className="p-8 space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-primary">Promotional Center</h1>
          <p className="text-secondary">Exclusive rewards and lucky draws just for you.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentView('rewards')}
            className="p-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl text-left text-white shadow-xl shadow-indigo-200 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <Coins size={48} className="mb-6" />
              <h2 className="text-2xl font-bold mb-2">Smart Reward Points</h2>
              <p className="text-indigo-100 text-sm">Check your balance and earning history.</p>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform">
              <Coins size={200} />
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentView('lucky-draw')}
            className="p-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl text-left text-white shadow-xl shadow-pink-200 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <Gift size={48} className="mb-6" />
              <h2 className="text-2xl font-bold mb-2">Lucky Reward Draw</h2>
              <p className="text-pink-100 text-sm">Spin the wheel and win exciting prizes daily.</p>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform">
              <Gift size={200} />
            </div>
          </motion.button>
        </div>
      </div>;
      case 'rewards': return <RewardDashboard user={user} />;
      case 'lucky-draw': return <LuckyDraw user={user} onUpdateUser={setUser} />;
      case 'tazu-games': return <TazuGamesCenter onBack={() => setCurrentView('home')} user={user} onUpdateUser={setUser} />;
      case 'buy-any-3': return <BuyAny3Offer onBack={() => setCurrentView('home')} onAddToCart={addToCart} />;
      case 'pickup-locations': return <PickupLocations onBack={() => setCurrentView('home')} />;
      case 'affiliate-dashboard': return <AffiliateDashboard onBack={() => setCurrentView('dashboard')} user={user} />;
      case 'help': return <HelpCenter onBack={() => setCurrentView('dashboard')} userId={user?.id || '1'} setCurrentView={setCurrentView} />;
      case 'reviews': return <MyReviews onBack={() => setCurrentView('dashboard')} userId={user?.id || '1'} />;
      case 'payments': return <PaymentMethods onBack={() => setCurrentView('dashboard')} userId={user?.id || '1'} />;
      case 'top-ranking-products': return <TopRankingProducts onBack={() => setCurrentView('home')} onAddToCart={addToCart} onProductClick={(p) => { setSelectedProduct(p); setCurrentView('product-details'); }} onToggleWishlist={toggleWishlist} wishlist={wishlist} />;
      case 'offers': return <Offers onAddToCart={addToCart} onProductClick={(p) => { setSelectedProduct(p); setCurrentView('product-details'); }} onBack={() => setCurrentView('home')} />;
      case 'admin-login': return <AdminLogin onLogin={handleLoginSuccess} />;
      case 'admin-dashboard': return isAdmin ? <AdminDashboard onPrintInvoice={(id) => { setSelectedOrderId(id); setCurrentView('admin-invoice'); }} /> : <AdminLogin onLogin={handleLoginSuccess} />;
      case 'admin-orders': return isAdmin ? <AdminOrdersManagement /> : <AdminLogin onLogin={handleLoginSuccess} />;
      case 'admin-rewards': return isAdmin ? <AdminRewardManagement /> : <AdminLogin onLogin={handleLoginSuccess} />;
      case 'admin-campaigns': return isAdmin ? <AdminCampaignManagement /> : <AdminLogin onLogin={handleLoginSuccess} />;
      case 'admin-carts': return isAdmin ? <AdminCartMonitoring /> : <AdminLogin onLogin={handleLoginSuccess} />;
      case 'admin-invoice': return selectedOrderId ? <InvoicePage orderId={selectedOrderId} onBack={() => setCurrentView('admin-dashboard')} /> : <AdminDashboard />;
      case 'settings': return <Settings onBack={() => setCurrentView('dashboard')} onNavigate={(v) => setCurrentView(`settings-${v}` as View)} />;
      case 'settings-messages': return user ? <MessageSettings userId={user.id} onBack={() => setCurrentView('settings')} /> : <Login onLogin={setUser} onSignUpClick={() => setCurrentView('signup')} />;
      case 'settings-country': return <CountrySettings onBack={() => setCurrentView('settings')} />;
      case 'settings-language': return <LanguageSettings onBack={() => setCurrentView('settings')} />;
      case 'settings-policies': return <Policies onBack={() => setCurrentView('settings')} />;
      case 'settings-help': return user ? <HelpCenter userId={user.id} onBack={() => setCurrentView('settings')} setCurrentView={setCurrentView} /> : <Login onLogin={setUser} onSignUpClick={() => setCurrentView('signup')} />;
      case 'settings-feedback': return user ? <Feedback userId={user.id} onBack={() => setCurrentView('settings')} /> : <Login onLogin={setUser} onSignUpClick={() => setCurrentView('signup')} />;
      case 'settings-security': return user ? <SecuritySettings user={user} onBack={() => setCurrentView('settings')} onLogout={handleLogout} /> : <Login onLogin={setUser} onSignUpClick={() => setCurrentView('signup')} />;
      default: return <Home products={products} categories={categories} onAddToCart={addToCart} setCurrentView={setCurrentView} onProductClick={(p) => { setSelectedProduct(p); setCurrentView('product-details'); }} onCategoryClick={(c) => { setSelectedCategory(c); setCurrentView('category'); }} onToggleWishlist={toggleWishlist} wishlist={wishlist} />;
    }
  };

  if (currentView === 'admin-invoice') {
    return <InvoicePage orderId={selectedOrderId!} onBack={() => setCurrentView('admin-dashboard')} />;
  }

  return (
    <ThemeProvider panel={getPanel()}>
      <BrandingProvider>
        <div className="flex h-screen bg-bg text-primary overflow-hidden font-sans flex-col">
          {getPanel() !== 'admin' && (
            <Navbar 
              categories={MOCK_CATEGORIES}
              cartCount={cart.length}
              wishlistCount={wishlist.length}
              user={user}
              onNavigate={setCurrentView}
              onCategoryClick={(c) => { setSelectedCategory(c); setCurrentView('category'); }}
              onSubCategoryClick={(s) => { 
                // Find parent category
                const parent = MOCK_CATEGORIES.find(c => c.id === s.parentId);
                if (parent) {
                  setSelectedCategory(parent);
                  setCurrentView('category');
                }
              }}
              onLogout={handleLogout}
              onAdminClick={() => setCurrentView('admin-login')}
            />
          )}

          <div className="flex flex-1 overflow-hidden">
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
              {/* Toast Notification */}
              <AnimatePresence>
                {toast && (
                  <motion.div
                    initial={{ opacity: 0, y: 50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 20, x: '-50%' }}
                    className="fixed bottom-24 left-1/2 z-[1000] px-6 py-3 bg-gray-900 text-white rounded-full shadow-2xl flex items-center gap-3 border border-white/10"
                  >
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-[12px]">
                      ✔
                    </div>
                    <span className="text-sm font-bold">{toast.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Invoice Popup */}
              <AnimatePresence>
                {completedOrder && (
                  <Invoice 
                    order={completedOrder} 
                    onClose={() => setCompletedOrder(null)} 
                    onBackHome={() => { setCompletedOrder(null); setCurrentView('dashboard'); }} 
                    onViewInvoice={() => {
                      setSelectedOrderId(completedOrder.id);
                      setCompletedOrder(null);
                      setCurrentView('admin-invoice');
                    }}
                  />
                )}
              </AnimatePresence>

              <div className="max-w-7xl mx-auto p-0 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentView}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderView()}
                  </motion.div>
                </AnimatePresence>
                {getPanel() !== 'admin' && <Footer />}
              </div>
            </main>
          </div>

        {/* Bottom Navigation (Mobile Only) */}
        {getPanel() !== 'admin' && (
          <BottomNav 
            currentView={currentView} 
            setCurrentView={setCurrentView} 
            cartCount={cart.length}
            messageCount={2}
          />
        )}

      </div>
      </BrandingProvider>
    </ThemeProvider>
  );
}
