import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_HOMEPAGE_BANNERS, MOCK_PROMOTION_BANNERS, MOCK_OFFERS, MOCK_OFFER_SETTINGS, MOCK_HOMEPAGE_VISIBILITY, MOCK_INCOMPLETE_ORDERS } from './src/mockData.js';
import { 
  CourierConfig, 
  DeliveryZone, 
  DeliveryLog, 
  Vendor, 
  VendorPayout,
  Category,
  ProductCategory,
  ProductVariation,
  ProductLike,
  ProductShare,
  Product,
  LoginProvider
} from "./src/types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { BANGLADESH_LOCATIONS } from './src/locationData.js';
import crypto from 'crypto';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const JWT_SECRET = process.env.JWT_SECRET || 'tazu-mart-bd-secret-key';
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
  const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());

  // Stock Reservation System
  let stockReservations: any[] = [];
  const RESERVATION_TIMEOUT = 180 * 1000; // 3 minutes

  const cleanupReservations = () => {
    const now = Date.now();
    stockReservations = stockReservations.filter(res => {
      if (now - res.timestamp > RESERVATION_TIMEOUT) {
        // Release stock
        const product = MOCK_PRODUCTS.find(p => p.id === res.productId);
        if (product) {
          product.stockQuantity += res.quantity;
          if (product.stockQuantity > 0) product.stockStatus = 'In Stock';
        }
        return false;
      }
      return true;
    });
  };

  setInterval(cleanupReservations, 10000); // Cleanup every 10 seconds

  // Rate Limiting Simulation
  const requestCounts: Record<string, { count: number, resetAt: number }> = {};
  const loginAttempts: Record<string, { count: number, lockUntil: number }> = {};

  app.use((req, res, next) => {
    // Apply to checkout, payment, and login routes
    if (req.path.startsWith('/api/orders') || req.path.startsWith('/api/payment') || req.path === '/api/auth/login') {
      const ip = req.ip || 'unknown';
      const now = Date.now();

      // Check login specific lock
      if (req.path === '/api/auth/login' && loginAttempts[ip] && now < loginAttempts[ip].lockUntil) {
        return res.status(429).json({ 
          success: false, 
          message: `Too many failed attempts. Please try again in ${Math.ceil((loginAttempts[ip].lockUntil - now) / 1000)} seconds.` 
        });
      }

      if (infraConfig.performance.highTrafficProtection || req.path === '/api/auth/login') {
        const limit = req.path === '/api/auth/login' ? 5 : infraConfig.performance.rateLimitPerIp;
        
        if (!requestCounts[ip] || now > requestCounts[ip].resetAt) {
          requestCounts[ip] = { count: 1, resetAt: now + 60000 }; // 1 minute window
        } else {
          requestCounts[ip].count++;
        }

        if (requestCounts[ip].count > limit) {
          return res.status(429).json({ 
            error: 'Too many requests.',
            retryAfter: Math.ceil((requestCounts[ip].resetAt - now) / 1000)
          });
        }
      }
    }
    next();
  });

  // Location Endpoints
  app.get('/api/locations/divisions', (req, res) => {
    res.json(BANGLADESH_LOCATIONS.divisions);
  });

  app.get('/api/locations/districts/:divisionId', (req, res) => {
    const { divisionId } = req.params;
    res.json(BANGLADESH_LOCATIONS.districts.filter(d => d.division_id === divisionId));
  });

  app.get('/api/locations/upazilas/:districtId', (req, res) => {
    const { districtId } = req.params;
    res.json(BANGLADESH_LOCATIONS.upazilas.filter(u => u.district_id === districtId));
  });

  // Direct Checkout Endpoint
  app.post('/api/orders/direct', (req, res) => {
    const { items, customerInfo } = req.body;
    
    // Server-side validation
    if (!customerInfo.fullName || !customerInfo.mobileNumber || !customerInfo.address) {
      return res.status(400).json({ error: 'Missing required customer information' });
    }

    // More flexible phone validation (allows +880 or just 11 digits)
    const phoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
    if (!phoneRegex.test(customerInfo.mobileNumber)) {
      return res.status(400).json({ error: 'Invalid Bangladesh mobile number format' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No products selected' });
    }

    // Check stock for all items
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.stockQuantity < item.quantity) {
        return res.status(400).json({ error: `Product ${product?.name || item.productId} out of stock or insufficient quantity` });
      }
    }

    // Reserve stock for all items
    const reservationId = crypto.randomBytes(16).toString('hex');
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        product.stockQuantity -= item.quantity;
        if (product.stockQuantity === 0) product.stockStatus = 'Out of Stock';
        
        stockReservations.push({
          id: reservationId,
          productId: item.productId,
          quantity: item.quantity,
          timestamp: Date.now()
        });
      }
    }

    // Create temporary order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const encryptedOrderId = crypto.createHash('sha256').update(orderId).digest('hex');

    res.json({ 
      success: true, 
      orderId, 
      encryptedOrderId,
      reservationId,
      timeout: 180 
    });
  });

  // --- Inventory Endpoints ---
  app.get('/api/admin/inventory', (req, res) => {
    const inventory = products.map(p => ({
      id: p.id,
      productName: p.name,
      productImage: p.image,
      sku: p.sku || `SKU-${p.id}`,
      currentStock: p.stockQuantity,
      reservedStock: stockReservations.filter(r => r.productId === p.id).reduce((sum, r) => sum + r.quantity, 0),
      availableStock: p.stockQuantity,
      status: p.stockStatus,
      price: p.price
    }));
    res.json(inventory);
  });

  app.get('/api/admin/inventory/stats', (req, res) => {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5).length;
    const outOfStockProducts = products.filter(p => p.stockQuantity === 0).length;
    const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0);

    res.json({
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalStockValue
    });
  });

  app.put('/api/admin/inventory/:id', (req, res) => {
    const { id } = req.params;
    const { currentStock } = req.body;
    const product = products.find(p => p.id === id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    product.stockQuantity = currentStock;
    product.stockStatus = currentStock === 0 ? 'Out of Stock' : currentStock <= 5 ? 'Low Stock' : 'In Stock';
    
    const inventoryItem = {
      id: product.id,
      productName: product.name,
      productImage: product.image,
      sku: product.sku || `SKU-${product.id}`,
      currentStock: product.stockQuantity,
      reservedStock: stockReservations.filter(r => r.productId === product.id).reduce((sum, r) => sum + r.quantity, 0),
      availableStock: product.stockQuantity,
      status: product.stockStatus,
      price: product.price
    };
    
    res.json({ inventoryItem });
  });

  // Payment Gateway Simulation
  app.post('/api/payment/create', (req, res) => {
    const { orderId, method } = req.body;
    
    if (method === 'COD') {
      // Handle COD
      const order = {
        id: orderId,
        status: 'Pending',
        paymentStatus: 'Pending',
        paymentMethod: 'COD',
        createdAt: new Date().toISOString()
      };
      // In a real app, save to DB
      return res.json({ success: true, order });
    }

    // Redirect to gateway simulation
    const gatewayUrl = `/payment-gateway?orderId=${orderId}&method=${method}`;
    res.json({ success: true, gatewayUrl });
  });

  app.post('/api/payment/webhook', (req, res) => {
    const { orderId, transactionId, status } = req.body;
    
    // In a real app, verify signature and update DB
    if (status === 'Success') {
      // Clear reservation
      stockReservations = stockReservations.filter(r => r.orderId !== orderId);
      res.json({ success: true, message: 'Payment confirmed' });
    } else {
      res.status(400).json({ success: false });
    }
  });

  // In-memory storage for payment config (would be a DB in production)
  let paymentConfig = {
    bkash: {
      appKey: '',
      appSecret: '',
      username: '',
      password: '',
      baseUrl: 'https://sandbox.bka.sh',
      callbackUrl: 'http://localhost:3000/api/payment/bkash/callback',
      isEnabled: true,
      manualNumber: '01671060679',
      accountType: 'Personal',
      instruction: 'Send Money Only'
    },
    nagad: {
      merchantId: '',
      publicKey: '',
      privateKey: '',
      baseUrl: 'https://sandbox.nagad.com',
      callbackUrl: 'http://localhost:3000/api/payment/nagad/callback',
      isEnabled: true,
      manualNumber: '01671060679',
      instruction: 'Send Money Only'
    },
    bank: {
      accountName: 'TAZU MART BD',
      accountNumber: '123456789',
      bankName: 'Dutch Bangla Bank',
      branch: 'Main Branch',
      isEnabled: true
    },
    paymentMode: 'Manual',
    environment: 'Sandbox',
    codEnabled: true,
    onlineEnabled: true,
    bankEnabled: true,
    bkashNumber: '01700000000',
    bkashType: 'personal',
    nagadNumber: '01800000000',
    nagadType: 'personal',
    codMaxAmount: 5000,
    codMinAmount: 100,
    maintenanceMode: false,
    highTrafficMode: false,
    instruction: 'Payment করার পর Transaction ID দিন'
  };

  let infraConfig = {
    domain: {
      primary: 'aurielcanvas.com',
      staging: 'staging.aurielcanvas.com',
      backup: 'backup.aurielcanvas.com',
      subdomains: ['api', 'admin', 'cdn'],
      dnsRecords: [
        { id: '1', type: 'A', name: '@', value: '192.168.1.1', ttl: 3600, status: 'Active' },
        { id: '2', type: 'CNAME', name: 'www', value: 'aurielcanvas.com', ttl: 3600, status: 'Active' },
        { id: '3', type: 'TXT', name: '@', value: 'v=spf1 include:_spf.google.com ~all', ttl: 3600, status: 'Active' },
        { id: '4', type: 'NS', name: '@', value: 'ns1.digitalocean.com', ttl: 86400, status: 'Active' },
        { id: '5', type: 'MX', name: '@', value: 'aspmx.l.google.com', ttl: 3600, status: 'Active' },
        { id: '6', type: 'TXT', name: '_google-site-verification', value: 'google-site-verification=abc123xyz', ttl: 3600, status: 'Active' }
      ],
      environment: 'Free',
      domains: [
        { id: 'd1', name: 'aurielcanvas.com', isPrimary: true, isEnabled: true, wwwEnabled: true, sslStatus: 'Active', verificationStatus: 'Verified' },
        { id: 'd2', name: 'shop.aurielcanvas.com', isPrimary: false, isEnabled: true, wwwEnabled: false, sslStatus: 'Active', verificationStatus: 'Verified' }
      ],
      forceHttps: true
    },
    hosting: {
      providerName: 'DigitalOcean',
      serverIp: '192.168.1.1',
      sshPort: 22,
      ftpUser: 'auriel_admin',
      cpanelUrl: 'https://cpanel.aurielcanvas.com',
      dbHost: 'localhost',
      phpVersion: '8.2',
      nodeVersion: '20.x',
      serverStatus: 'Online',
      environmentMode: 'Production',
      runtimeVersion: 'Node.js 20.11.0',
      databaseStatus: 'Connected',
      debugMode: false,
      resources: {
        cpu: 12,
        ram: 45,
        storage: 28,
        bandwidth: 15,
        uptime: '99.99%',
        load: 0.45
      }
    },
    overview: {
      os: 'Ubuntu 22.04 LTS',
      phpVersion: '8.2.10',
      dbVersion: 'PostgreSQL 15.4',
      lastRestart: '2024-02-20 10:00 AM',
      lastBackup: '2024-02-21 03:00 AM',
      healthScore: 98
    },
    ssl: {
      expiryDays: 85,
      autoRenew: true,
      forceHttps: true,
      firewallActive: true
    },
    deployment: {
      lastDeploy: '2024-02-21 02:30 PM',
      status: 'Idle',
      maintenanceBeforeDeploy: true
    },
    performance: {
      cacheEnabled: true,
      cdnActive: true,
      imageOptimization: true,
      minifyAssets: true,
      highTrafficProtection: false,
      rateLimitPerIp: 10,
      queueEnabled: false
    }
  };

  let domains: any[] = [
    {
      id: 'd1',
      domainName: 'aurielcanvas.com',
      domainType: 'Primary',
      serverIp: '192.168.1.1',
      ns1: 'ns1.digitalocean.com',
      ns2: 'ns2.digitalocean.com',
      sslEnabled: true,
      sslType: 'LetsEncrypt',
      forceHttps: true,
      hstsEnabled: true,
      maintenanceMode: false,
      cdnEnabled: true,
      emailEnabled: true,
      wwwPreference: 'With',
      status: 'Active',
      dnsStatus: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  let domainLogs: any[] = [];

  let courierConfigs: any[] = [
    {
      id: 'c1',
      name: 'Steadfast Courier',
      baseUrl: 'https://portal.steadfast.com.bd/api/v1',
      apiKey: '',
      secretKey: '',
      merchantId: '',
      isSandbox: true,
      isActive: true
    },
    {
      id: 'c2',
      name: 'Pathao Courier',
      baseUrl: 'https://api-hermes.pathao.com',
      apiKey: '',
      secretKey: '',
      merchantId: '',
      isSandbox: true,
      isActive: true
    }
  ];

  let couriers: any[] = [
    { id: 'c1', name: 'Steadfast', slug: 'steadfast', isActive: true },
    { id: 'c2', name: 'Pathao', slug: 'pathao', isActive: true }
  ];

  let courierCredentials: any[] = [
    { courierId: 'c1', apiBaseUrl: 'https://portal.steadfast.com.bd/api/v1', apiKey: '', secretKey: '', merchantId: '', sandboxMode: true },
    { courierId: 'c2', apiBaseUrl: 'https://api-hermes.pathao.com', apiKey: '', secretKey: '', merchantId: '', sandboxMode: true }
  ];

  let globalDeliveryRules = {
    free_delivery_threshold: 2000,
    global_cod_fee: 0,
    auto_dispatch_steadfast: false,
    auto_dispatch_pathao: false
  };

  let deliveryZones: any[] = [
    // Dhaka Division
    { id: 'dz1', division: 'Dhaka', district: 'Dhaka', charge: 60, deliveryTime: '1-2 days', codFee: 0, isActive: true },
    { id: 'dz2', division: 'Dhaka', district: 'Gazipur', charge: 100, deliveryTime: '2-3 days', codFee: 5, isActive: true },
    { id: 'dz3', division: 'Dhaka', district: 'Narayanganj', charge: 100, deliveryTime: '2-3 days', codFee: 5, isActive: true },
    // Chattogram Division
    { id: 'dz4', division: 'Chattogram', district: 'Chattogram', charge: 120, deliveryTime: '3-5 days', codFee: 10, isActive: true },
    { id: 'dz5', division: 'Chattogram', district: 'Cox’s Bazar', charge: 150, deliveryTime: '4-6 days', codFee: 15, isActive: true },
    // Rajshahi Division
    { id: 'dz6', division: 'Rajshahi', district: 'Rajshahi', charge: 120, deliveryTime: '3-5 days', codFee: 10, isActive: true },
    // Khulna Division
    { id: 'dz7', division: 'Khulna', district: 'Khulna', charge: 120, deliveryTime: '3-5 days', codFee: 10, isActive: true },
    // Barishal Division
    { id: 'dz8', division: 'Barishal', district: 'Barishal', charge: 130, deliveryTime: '4-6 days', codFee: 10, isActive: true },
    // Sylhet Division
    { id: 'dz9', division: 'Sylhet', district: 'Sylhet', charge: 130, deliveryTime: '4-6 days', codFee: 10, isActive: true },
    // Rangpur Division
    { id: 'dz10', division: 'Rangpur', district: 'Rangpur', charge: 130, deliveryTime: '4-6 days', codFee: 10, isActive: true },
    // Mymensingh Division
    { id: 'dz11', division: 'Mymensingh', district: 'Mymensingh', charge: 120, deliveryTime: '3-5 days', codFee: 10, isActive: true },
  ];

  let deliveryLogs: any[] = [];

  let vendors: any[] = [
    {
      id: 'v1',
      vendorId: 'VND-0001',
      name: 'Artisan Hub',
      companyName: 'Artisan Hub Ltd.',
      phone: '01700000000',
      email: 'vendor@example.com',
      address: 'Dhaka, Bangladesh',
      district: 'Dhaka',
      commissionPercentage: 10,
      totalProducts: 5,
      totalOrders: 12,
      totalEarnings: 15000,
      totalPurchaseAmount: 50000,
      totalPaid: 45000,
      currentDue: 5000,
      status: 'Active',
      openingBalance: 0,
      createdAt: new Date().toISOString()
    }
  ];

  let vendorPurchases: any[] = [];
  let vendorPayments: any[] = [];
  let vendorLedger: any[] = [];
let vendorPayouts: any[] = [];

  // --- TAZU MART BD Admin Settings Data ---
  let adminUsers: any[] = [
    {
      id: 'admin-1',
      username: 'superadmin',
      fullName: 'Super Admin',
      email: 'tazumartbd@gmail.com',
      isEmailVerified: true,
      roleId: 'role-superadmin',
      status: 'Active',
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  let adminRoles: any[] = [
    {
      id: 'role-superadmin',
      name: 'Super Admin',
      description: 'Full access to all modules',
      permissions: [
        { module: 'dashboard', actions: ['view'] },
        { module: 'orders', actions: ['view', 'create', 'edit', 'delete', 'export'] },
        { module: 'products', actions: ['view', 'create', 'edit', 'delete', 'export'] },
        { module: 'customers', actions: ['view', 'create', 'edit', 'delete', 'export'] },
        { module: 'settings', actions: ['view', 'create', 'edit', 'delete', 'export'] }
      ],
      isCustom: false,
      createdAt: new Date().toISOString()
    }
  ];

  let adminSessions: any[] = [
    {
      id: 'sess-1',
      adminId: 'admin-1',
      device: 'MacBook Pro',
      browser: 'Chrome',
      os: 'macOS',
      ip: '192.168.1.1',
      location: 'Dhaka, Bangladesh',
      lastActive: new Date().toISOString(),
      isCurrent: true
    }
  ];

  let businessSettings = {
    storeName: 'TAZU MART BD',
    logo: 'https://picsum.photos/seed/logo/200/200',
    favicon: 'https://picsum.photos/seed/favicon/32/32',
    address: '123 Business Ave, Dhaka, Bangladesh',
    phone: '+880 1700 000000',
    email: 'support@tazumartbd.com',
    tradeLicense: 'TR-123456',
    vatId: 'VAT-7890',
    taxId: 'TAX-4567',
    invoiceConfig: {
      prefix: 'INV-',
      footer: 'Thank you for shopping with us!',
      autoNumbering: true,
      nextNumber: 1001
    }
  };

  const createDefaultTheme = (id: string, name: string, panel: 'admin' | 'customer' | 'frontend', primary: string, bg: string, surface: string): any => ({
    id,
    panelType: panel,
    themeName: name,
    colors: {
      primary,
      accent: primary,
      background: bg,
      surface,
      border: bg.includes('#0') || bg.includes('#1') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      sidebarBg: surface,
      topbarBg: bg,
      hover: 'rgba(255,255,255,0.05)',
      active: primary
    },
    gradient: { enabled: false, colors: [primary, primary], direction: 'to right' },
    typography: {
      primaryFont: 'Inter',
      secondaryFont: 'Inter',
      headingWeight: '700',
      baseFontSize: '16px',
      lineHeight: '1.5',
      letterSpacing: '0px'
    },
    components: {
      button: { shape: 'Rounded', shadow: 'Soft', animationSpeed: '0.3s' },
      card: { style: 'Soft Shadow' },
      table: { style: 'Minimal' }
    },
    layout: {
      sidebarWidth: 'Normal',
      sidebarIconOnly: false,
      topbarFixed: true,
      widgetDensity: 'Comfort'
    },
    darkMode: { enabled: bg.includes('#0') || bg.includes('#1'), autoDetect: true },
    updatedAt: new Date().toISOString()
  });

  let themeMaster: any[] = [
    createDefaultTheme('t1', 'TAZU MART BD Dark Pro', 'admin', '#FF6A00', '#0F172A', '#1E293B'),
    createDefaultTheme('t2', 'Sapphire Business Blue', 'admin', '#2563EB', '#F8FAFC', '#FFFFFF'),
    createDefaultTheme('t3', 'Emerald Growth Green', 'admin', '#10B981', '#F0FDF4', '#FFFFFF'),
    createDefaultTheme('t4', 'Luxury Gold Elite', 'admin', '#D4AF37', '#1A1A1A', '#2D2D2D'),
    createDefaultTheme('t5', 'Royal Purple SaaS', 'admin', '#8B5CF6', '#F5F3FF', '#FFFFFF'),
    createDefaultTheme('t6', 'Arctic White Minimal', 'admin', '#0F172A', '#FFFFFF', '#F8FAFC'),
    createDefaultTheme('t7', 'Carbon Black Tech', 'admin', '#3B82F6', '#000000', '#111111'),
    createDefaultTheme('t8', 'Sunset Corporate', 'admin', '#F97316', '#FFF7ED', '#FFFFFF'),
    createDefaultTheme('t9', 'Deep Ocean Navy', 'admin', '#0EA5E9', '#082F49', '#0C4A6E'),
    createDefaultTheme('t10', 'Modern Glass UI', 'admin', '#FFFFFF', 'rgba(15, 23, 42, 0.9)', 'rgba(30, 41, 59, 0.7)'),
    createDefaultTheme('t11', 'Midnight Gradient Pro', 'admin', '#6366F1', '#020617', '#0F172A'),
    createDefaultTheme('t12', 'Clean Startup Light', 'admin', '#4F46E5', '#FFFFFF', '#F9FAFB'),
  ];

  let activeThemes: Record<'admin' | 'customer' | 'frontend', any> = {
    admin: { ...themeMaster[0] },
    customer: { ...themeMaster[1], panelType: 'customer' },
    frontend: { ...themeMaster[11], panelType: 'frontend' }
  };

  let taxSettings = {
    defaultTaxPercentage: 5,
    taxInclusive: false,
    vatAutoCalculation: true
  };

  let currencySettings = {
    defaultCurrency: 'BDT',
    currencySymbol: '৳',
    currencyPosition: 'Left',
    decimalSeparator: '.',
    thousandSeparator: ',',
    numberOfDecimals: 2
  };

  let automationRules = {
    order: {
      autoConfirm: false,
      autoStockDeduction: true,
      autoInvoiceGeneration: true,
      autoStatusUpdateAfterPayment: true,
      autoCancelUnpaidHours: 24
    },
    customer: {
      autoCreateOnOrder: true,
      autoTagging: true,
      dueReminderSms: true,
      thankYouMessageAfterDelivery: true
    }
  };

  let emailTemplates: any[] = [
    { id: 'et-1', name: 'Order Confirmation', subject: 'Your Order {order_id} is Confirmed', body: 'Hi {customer_name}, your order is confirmed...', type: 'OrderConfirmation', isActive: true }
  ];

  let smsTemplates: any[] = [
    { id: 'st-1', name: 'Order Confirmation', body: 'Hi {customer_name}, your order {order_id} is confirmed.', type: 'OrderConfirmation', isActive: true }
  ];

  let apiIntegrations: any[] = [
    { id: 'api-1', name: 'bKash Merchant API', provider: 'bKash', type: 'Payment', credentials: { appKey: '***', appSecret: '***' }, isEnabled: true, isSandbox: true }
  ];

  let systemPreferences = {
    defaultOrderStatus: 'Pending',
    maintenanceMode: false,
    autoEmailAfterOrder: true,
    orderIdFormat: 'ORD-{NUMBER}',
    customerIdFormat: 'CUS-{NUMBER}',
    cacheEnabled: true,
    imageCompressionLevel: 80,
    lazyLoadEnabled: true,
    debugMode: false
  };

  // --- AI Installation & Modules Data ---
  let aiInstallation = {
    isInstalled: false,
    installedAt: null as string | null,
    version: '1.0.0',
    neuralCoreStatus: 'Active',
    apiStatus: 'Connected'
  };

  let aiFeatures = {
    'ai-dashboard': true,
    'ai-customer-detection': true,
    'ai-chat-support': true,
    'ai-content-generator': true,
    'ai-seo-assistant': true,
    'ai-image-optimizer': true,
    'ai-visitor-analytics': true,
    'ai-fraud-detection': true,
    'ai-product-recommendation': true,
    'ai-review-analyzer': true,
    'ai-marketing-automation': true,
    'ai-sales-prediction': true,
    'ai-inventory-prediction': true,
    'ai-customer-behavior': true,
    'ai-security-monitoring': true,
    'ai-notification-system': true,
  };

  let aiChatSettings = {
    isEnabled: true,
    autoReply: true,
    humanEscalation: true,
    welcomeMessage: 'Hello! How can I help you today?',
    deliveryInfo: {
      dhaka: '2-3 business days',
      outsideDhaka: '3-5 business days'
    }
  };

  let chatHistory: any[] = [
    { id: 'chat-1', userMessage: 'What is the price of Smart Watch?', aiResponse: 'The Smart Watch Pro is priced at ৳ 1,250. It is currently in stock!', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
    { id: 'chat-2', userMessage: 'Do you deliver to Chittagong?', aiResponse: 'Yes, we deliver all over Bangladesh. Delivery to Chittagong usually takes 3-5 business days.', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() }
  ];

  let aiSecurityLogs: any[] = [
    { id: 'sec-1', event: 'Admin Login', user: 'superadmin', status: 'Success', ip: '192.168.1.1', time: '10 mins ago' },
    { id: 'sec-2', event: 'Database Backup', user: 'System', status: 'Completed', ip: '-', time: '2 hours ago' },
    { id: 'sec-3', event: 'File Integrity Scan', user: 'System', status: 'Clean', ip: '-', time: '5 hours ago' },
    { id: 'sec-4', event: 'Failed Login Attempt', user: 'unknown', status: 'Blocked', ip: '45.12.33.1', time: '8 hours ago' },
  ];

  let auditLogs: any[] = [
    {
      id: 'LOG-A1B2C3D4E',
      module: 'Authentication',
      action: 'Admin Login',
      performedBy: { name: 'Admin User', role: 'Super Admin', id: 'admin-1' },
      entityId: 'admin-1',
      oldValue: null,
      newValue: 'Successful Login',
      ip: '192.168.1.45',
      device: 'Chrome / Windows 11',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: 'Success',
      riskLevel: 'Low'
    },
    {
      id: 'LOG-F5G6H7I8J',
      module: 'Security',
      action: 'Failed Login Attempt',
      performedBy: { name: 'Unknown', role: 'Guest', id: 'anonymous' },
      entityId: 'admin-1',
      oldValue: null,
      newValue: 'Invalid Password',
      ip: '45.12.88.21',
      device: 'Firefox / Linux',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      status: 'Failed',
      riskLevel: 'High'
    },
    {
      id: 'LOG-K9L0M1N2O',
      module: 'Products',
      action: 'Price Update',
      performedBy: { name: 'Manager Sarah', role: 'Admin', id: 'admin-2' },
      entityId: 'PROD-123',
      oldValue: '৳ 1,250',
      newValue: '৳ 1,450',
      ip: '192.168.1.12',
      device: 'Safari / macOS',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      status: 'Success',
      riskLevel: 'Medium'
    },
    {
      id: 'LOG-P1Q2R3S4T',
      module: 'Orders',
      action: 'Order Refunded',
      performedBy: { name: 'Admin User', role: 'Super Admin', id: 'admin-1' },
      entityId: '#ORD-8291',
      oldValue: { status: 'Delivered' },
      newValue: { status: 'Refunded' },
      ip: '192.168.1.45',
      device: 'Chrome / Windows 11',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: 'Success',
      riskLevel: 'Medium'
    },
    {
      id: 'LOG-U5V6W7X8Y',
      module: 'System',
      action: 'Database Backup Created',
      performedBy: { name: 'System Cron', role: 'System', id: 'system' },
      entityId: 'bak-1',
      oldValue: null,
      newValue: 'backup_2024_02_26.sql',
      ip: '127.0.0.1',
      device: 'Server',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: 'Success',
      riskLevel: 'Low'
    }
  ];

  let backups: any[] = [
    { id: 'bak-1', filename: 'backup_2024_02_26.sql', size: 1024 * 1024 * 5, type: 'Auto', status: 'Success', timestamp: new Date().toISOString() }
  ];

  const addAuditLog = (
    adminId: string, 
    adminName: string, 
    role: string,
    action: string, 
    module: string, 
    entityId?: string,
    oldValue?: any,
    newValue?: any,
    status: 'Success' | 'Failed' | 'Warning' = 'Success',
    riskLevel: 'Low' | 'Medium' | 'High' = 'Low'
  ) => {
    auditLogs.unshift({
      id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      module,
      action,
      performedBy: { id: adminId, name: adminName, role },
      entityId,
      oldValue,
      newValue,
      ip: '127.0.0.1', // In real app, get from req.ip
      device: 'System Browser',
      timestamp: new Date().toISOString(),
      status,
      riskLevel
    });
    
    // Auto-retention: Keep only last 1000 logs for demo
    if (auditLogs.length > 1000) {
      auditLogs = auditLogs.slice(0, 1000);
    }
  };

  let categories: any[] = MOCK_CATEGORIES.map(cat => ({
    ...cat,
    startingPrice: cat.id === 'cat-electronics' ? 'From 40৳' : 
                   cat.id === 'cat-fashion' ? 'From 20৳' : 
                   cat.id === 'cat-home' ? 'From 50৳' : 
                   cat.id === 'cat-accessories' ? 'From 10৳' : 
                   cat.id === 'cat-beauty' ? 'From 15৳' : 
                   cat.id === 'cat-kids' ? 'From 25৳' : 'From 1৳'
  }));
  let productCategories: any[] = [];
  let productVariations: any[] = [];
  let productLikes: any[] = [];
  let productShares: any[] = [];

  let products: any[] = [...MOCK_PRODUCTS];
  let wishlists: any[] = [];
  let incompleteOrders: any[] = [...MOCK_INCOMPLETE_ORDERS];

  let banners: any[] = [...MOCK_HOMEPAGE_BANNERS];
  let promotionBanners: any[] = [...MOCK_PROMOTION_BANNERS];
  let campaigns: any[] = [
    {
      id: 'c1',
      title: 'Flash Sale',
      description: 'Up to 70% off on all electronics',
      discountPercentage: 70,
      startDate: '2024-03-20T10:00:00Z',
      endDate: '2024-03-20T22:00:00Z',
      type: 'Flash Sale',
      isVisible: true,
      linkedProducts: ['p1', 'p3']
    }
  ];

  let orders: any[] = [
    {
      id: 'ORD-1001',
      date: new Date().toISOString(),
      amount: 1260,
      status: 'Pending',
      paymentMethod: 'bKash',
      paymentStatus: 'pending',
      items: [
        { productId: 'p1', name: 'Premium Canvas Print', price: 1200, quantity: 1, image: 'https://picsum.photos/seed/canvas/400/400', variant: '12x18' }
      ],
      shippingAddress: '123 Main St, Dhaka, Bangladesh',
      customerName: 'John Doe',
      customerPhone: '01711223344',
      customerEmail: 'john@example.com',
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Gulshan',
      deliveryCharge: 60,
      discount: 0,
      internalNote: '',
      packagingStatus: 'Pending',
      labelPrinted: false,
      invoicePrinted: false,
      orderSource: 'website'
    }
  ];

  let users: any[] = [
    {
      id: 'admin-1',
      fullName: 'Super Admin',
      email: 'tazumartbd@gmail.com',
      admin_email: 'tazumartbd@gmail.com',
      admin_mobile: '01533975029',
      phone: '01533975029',
      passwordHash: bcrypt.hashSync('tazuMART060@#', 10),
      provider: 'manual',
      role: 'admin',
      rewardPoints: 0,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'admin-2',
      fullName: 'TazuMart Admin',
      email: 'admin.tazumartbd@gmail.com',
      admin_email: 'admin.tazumartbd@gmail.com',
      admin_mobile: '01700000000',
      phone: '01700000000',
      passwordHash: bcrypt.hashSync('896388', 10),
      provider: 'manual',
      role: 'admin',
      rewardPoints: 0,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'u1',
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '8801711223344',
      passwordHash: bcrypt.hashSync('password123', 10),
      provider: 'manual',
      providerId: null,
      role: 'customer',
      rewardPoints: 500,
      profileImage: 'https://picsum.photos/seed/u1/200/200',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    }
  ];

  let sessions: any[] = [];

  let loginLogs: any[] = [
    { id: 'l1', userId: 'u1', loginMethod: 'manual', ipAddress: '192.168.1.1', deviceType: 'Mobile', loginTime: new Date(Date.now() - 3600000).toISOString() },
    { id: 'l2', userId: 'u1', loginMethod: 'google', ipAddress: '192.168.1.1', deviceType: 'Mobile', loginTime: new Date(Date.now() - 7200000).toISOString() },
    { id: 'l3', userId: 'admin-1', loginMethod: 'manual', ipAddress: '10.0.0.1', deviceType: 'Desktop', loginTime: new Date().toISOString() }
  ];

  let rewardSettings = {
    pointsPerCurrencyRatio: 100, // 1 point per 100 currency
    minRedeemAmount: 50,
    isEnabled: true
  };

  let rewardLogs: any[] = [
    {
      id: 'rl1',
      userId: 'u1',
      userName: 'John Doe',
      orderId: 'ORD-1001',
      pointsAdded: 12,
      pointsDeducted: 0,
      actionType: 'Earned',
      dateTime: new Date().toISOString()
    }
  ];

  let luckyDrawCampaign = {
    id: 'ld1',
    name: 'Lucky Reward Draw',
    prizes: [
      { id: 'priz1', name: '10% Discount', probability: 0.2, stock: 100 },
      { id: 'priz2', name: '50 Smart Points', probability: 0.3, stock: 500 },
      { id: 'priz3', name: 'Free Shipping', probability: 0.1, stock: 50 },
      { id: 'priz4', name: 'Better Luck Next Time', probability: 0.4, stock: 9999 }
    ],
    dailyAttemptLimit: 1,
    isEnabled: true,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };

  let luckyDrawLogs: any[] = [];

  let carts: any[] = [
    {
      id: 'cart1',
      userId: 'u1',
      items: [
        { productId: 'p1', name: 'Premium Canvas Print', price: 1200, quantity: 1, image: 'https://picsum.photos/seed/canvas/400/400' }
      ],
      lastActivity: new Date().toISOString(),
      isAbandoned: false
    }
  ];

  let externalCustomerRecords: any[] = [];

  let customers: any[] = [
    {
      id: 'c1',
      customerUniqueId: 'CUST-0001',
      fullName: 'John Doe',
      phone: '8801711223344',
      email: 'john@example.com',
      address: '123 Main St, Dhaka',
      district: 'Dhaka',
      upazila: 'Gulshan',
      totalOrders: 1,
      totalPurchase: 1260,
      totalPaid: 1260,
      totalDue: 0,
      status: 'Active',
      lastOrderDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  let customerPanelSections: any[] = [
    { id: '1', sectionKey: 'profile_header', displayName: 'Profile Header', isEnabled: true, positionOrder: 1 },
    { id: '2', sectionKey: 'stats_row', displayName: 'Stats Row', isEnabled: true, positionOrder: 2 },
    { id: '3', sectionKey: 'nova_points', displayName: 'Nova Points', isEnabled: true, positionOrder: 3 },
    { id: '4', sectionKey: 'flash_deals', displayName: 'Flash Deals', isEnabled: true, positionOrder: 4 },
    { id: '5', sectionKey: 'my_orders', displayName: 'My Orders', isEnabled: true, positionOrder: 5 },
    { id: '6', sectionKey: 'recently_viewed', displayName: 'Recently Viewed', isEnabled: true, positionOrder: 6 }
  ];

  let brandingSettings: any = {
    id: '1',
    appName: 'TAZU MART BD',
    shortName: 'TAZU',
    welcomeText: 'Hello, Welcome to TAZU MART BD !',
    coinLabel: 'TAZU MART BD Coins',
    rewardLabel: 'TAZU MART BD Rewards',
    gamesLabel: 'TAZU MART BD Games',
    referralLabel: 'Refer & Earn',
    primaryColor: '#FF6A00',
    logoUrl: 'https://picsum.photos/seed/logo/200/200',
    faviconUrl: 'https://picsum.photos/seed/favicon/32/32',
    splashLogoUrl: 'https://picsum.photos/seed/splash/500/500',
    bottomNavMiddleText: 'BUY+SAVE+',
    footer: {
      logoUrl: 'https://picsum.photos/seed/footer-logo/200/200',
      description: 'TAZU MART BD is a trusted online shopping platform in Bangladesh. We provide quality products, fast delivery, and reliable service for customers across the country.',
      facebookUrl: 'https://facebook.com/tazumartbd',
      youtubeUrl: 'https://youtube.com/tazumartbd',
      instagramUrl: 'https://instagram.com/tazumartbd',
      tiktokUrl: 'https://tiktok.com/@tazumartbd',
      quickLinks: [
        { id: '1', label: 'Shop', url: '/shop' },
        { id: '2', label: 'Offers', url: '/offers' },
        { id: '3', label: 'Top Sales', url: '/top-sales' },
        { id: '4', label: 'All Products', url: '/products' },
        { id: '5', label: 'Become a Seller', url: '/seller' }
      ],
      customerServiceLinks: [
        { id: '1', label: 'Help Center', url: '/help' },
        { id: '2', label: 'Contact Us', url: '/contact' },
        { id: '3', label: 'Order Tracking', url: '/tracking' },
        { id: '4', label: 'Return Policy', url: '/returns' },
        { id: '5', label: 'Refund Policy', url: '/refunds' },
        { id: '6', label: 'Terms & Conditions', url: '/terms' },
        { id: '7', label: 'Privacy Policy', url: '/privacy' }
      ],
      address: 'Jatrabari, Rayerbagh Pair of Poles, Dhaka, Bangladesh',
      phone: '01834800916',
      email: 'tazumartbd@gmail.com',
      copyrightText: '© 2026 TAZU MART BD. All Rights Reserved.'
    },
    updatedAt: new Date().toISOString()
  };

  let offers = [...MOCK_OFFERS];
  let offerSettings = { ...MOCK_OFFER_SETTINGS };

  let servicesConfig: any[] = [
    { id: '1', key: 'games', label: 'TAZU MART BD Games', icon: 'Gamepad2', route: '/tazu-games', isEnabled: true, positionOrder: 1 },
    { id: '2', key: 'buy_any_3', label: 'Buy Any 3', icon: 'ShoppingBag', route: '/buy-any-3', isEnabled: true, positionOrder: 2 },
    { id: '3', key: 'pickup_points', label: 'Pickup Points', icon: 'MapPin', route: '/pickup-locations', isEnabled: true, positionOrder: 3 },
    { id: '4', key: 'affiliates', label: 'My Affiliates', icon: 'Users', route: '/affiliate-dashboard', isEnabled: true, positionOrder: 4 },
    { id: '5', key: 'help_center', label: 'Help Center', icon: 'HelpCircle', route: '/help', isEnabled: true, positionOrder: 5 },
    { id: '6', key: 'customer_care', label: 'Contact Customer Care', icon: 'Headphones', route: '/support', isEnabled: true, positionOrder: 6 },
    { id: '7', key: 'reviews', label: 'My Reviews', icon: 'Star', route: '/reviews', isEnabled: true, positionOrder: 7 },
    { id: '8', key: 'payment_options', label: 'Payment Options', icon: 'CreditCard', route: '/payments', isEnabled: true, positionOrder: 8 },
    { id: '9', key: 'settings', label: 'Settings', icon: 'Settings', route: '/settings', isEnabled: true, positionOrder: 9 }
  ];

  let gamePrizes: any[] = [
    { id: '1', name: '৳10 Coupon', type: 'coupon', value: 10, probability: 0.3 },
    { id: '2', name: '৳50 Discount', type: 'discount', value: 50, probability: 0.1 },
    { id: '3', name: 'Free Delivery', type: 'free_delivery', value: 0, probability: 0.2 },
    { id: '4', name: '100 Bonus Points', type: 'points', value: 100, probability: 0.3 },
    { id: '5', name: 'Better Luck Next Time', type: 'none', value: 0, probability: 0.1 }
  ];

  let dailyQuizzes: any[] = [
    { id: '1', question: 'What is the capital of Bangladesh?', options: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi'], correctIndex: 0, rewardPoints: 50 },
    { id: '2', question: 'Which is the national fruit of Bangladesh?', options: ['Mango', 'Jackfruit', 'Banana', 'Lychee'], correctIndex: 1, rewardPoints: 50 }
  ];

  let pickupPoints: any[] = [
    { id: '1', name: 'Dhaka Pickup Point', address: 'Mirpur 10, Dhaka', hours: '10am - 8pm', lat: 23.8069, lng: 90.3687 },
    { id: '2', name: 'Chittagong Pickup Point', address: 'GEC Circle, Chittagong', hours: '10am - 8pm', lat: 22.3591, lng: 91.8213 }
  ];

  let affiliates: any[] = [
    { userId: 'u1', referralCode: 'john_tazu', totalEarnings: 3250, totalJoined: 25, level: 1 }
  ];

  let affiliateCommissions: any[] = [
    { id: '1', userId: 'u1', orderId: '#TZ123', amount: 50, date: new Date().toISOString() },
    { id: '2', userId: 'u1', orderId: '#TZ125', amount: 70, date: new Date().toISOString() }
  ];

  let affiliateWithdrawals: any[] = [
    { id: '1', userId: 'u1', amount: 500, method: 'Bkash', status: 'Pending', date: new Date().toISOString() }
  ];

  let customerPayments: any[] = [];

  let userNotificationSettings: any[] = [
    {
      userId: 'u1',
      promotions: true,
      orders: true,
      activities: true,
      sellerPromo: true,
      chat: true,
      email: true,
      sms: true,
      whatsapp: true
    }
  ];

  let policies: any[] = [
    {
      id: 'pol1',
      policyType: 'privacy',
      title: 'Privacy Policy',
      contentHtml: `
        <h2>1. Introduction</h2>
        <p>We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application, website, and related services.</p>
        <p>By accessing or using our platform, you agree to the terms of this Privacy Policy.</p>
        <h2>2. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li><strong>Personal Information:</strong> Full Name, Phone Number, Email Address, Shipping Address</li>
          <li><strong>Payment Information:</strong> Transaction ID, Payment Method (Note: We do not store full card details.)</li>
          <li><strong>Device Information:</strong> Device Model, Operating System, IP Address, App Usage Data</li>
        </ul>
        <h2>3. How We Use Your Information</h2>
        <p>We use your information to process orders, provide customer support, improve user experience, send promotional notifications (if enabled), and prevent fraud.</p>
        <h2>4. Sharing of Information</h2>
        <p>We may share your data with delivery partners, payment gateways, and legal authorities (if required by law). We do not sell your personal data to third parties.</p>
        <h2>5. Data Security</h2>
        <p>We use secure servers, encryption, and access control mechanisms to protect your personal data.</p>
        <h2>6. Your Rights</h2>
        <p>You have the right to update your information, request account deletion, and withdraw marketing consent.</p>
        <h2>7. Updates to This Policy</h2>
        <p>We may update this policy periodically. Changes will be posted in this section.</p>
      `,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'pol2',
      policyType: 'terms',
      title: 'Terms & Conditions',
      contentHtml: `
        <h2>1. Introduction</h2>
        <p>Welcome to our platform. By using our services, you agree to comply with these Terms and Conditions.</p>
        <h2>2. Account Registration</h2>
        <p>You must provide accurate and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials.</p>
        <h2>3. Orders & Payments</h2>
        <p>All orders are subject to availability and confirmation. Prices are subject to change without prior notice.</p>
        <h2>4. Cancellation Policy</h2>
        <p>Orders may be canceled before shipment. Once shipped, cancellation may not be possible.</p>
        <h2>5. Delivery</h2>
        <p>Delivery times are estimated and may vary due to unforeseen circumstances.</p>
        <h2>6. Prohibited Activities</h2>
        <p>Users must not use fake information, attempt fraud, or abuse the platform.</p>
        <h2>7. Limitation of Liability</h2>
        <p>We are not liable for indirect or consequential damages arising from platform use.</p>
        <h2>8. Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time.</p>
      `,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'pol3',
      policyType: 'return',
      title: 'Return Policy',
      contentHtml: `
        <h2>1. Eligibility</h2>
        <p>Items can be returned within 7 days of delivery if the product is unused, original packaging is intact, and a valid reason is provided.</p>
        <h2>2. Non-Returnable Items</h2>
        <p>Digital products, personal care items, and perishable goods are non-returnable.</p>
        <h2>3. Return Process</h2>
        <p>Go to My Orders, select the product, tap "Request Return", and submit the reason and images.</p>
        <h2>4. Inspection</h2>
        <p>Returned items will be inspected before approval.</p>
        <h2>5. Approval / Rejection</h2>
        <p>If approved, a refund will be processed. If rejected, the item will be returned to the customer.</p>
      `,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'pol4',
      policyType: 'refund',
      title: 'Refund Policy',
      contentHtml: `
        <h2>1. Refund Eligibility</h2>
        <p>Refunds are issued after return approval or order cancellation (if applicable).</p>
        <h2>2. Refund Methods</h2>
        <p>Original payment method, wallet balance, or bank transfer.</p>
        <h2>3. Refund Timeline</h2>
        <ul>
          <li>Wallet: 1–2 working days</li>
          <li>Bank/Card: 5–10 working days</li>
        </ul>
        <h2>4. Partial Refund</h2>
        <p>Partial refunds may apply if the item is damaged or incomplete.</p>
        <h2>5. Delayed Refund</h2>
        <p>If a refund is delayed, contact customer support.</p>
      `,
      lastUpdated: new Date().toISOString()
    }
  ];

  let faqCategories: any[] = [
    { id: 'fc1', name: 'Order Issues', icon: 'ShoppingBag', order: 1 },
    { id: 'fc2', name: 'Delivery', icon: 'Truck', order: 2 },
    { id: 'fc3', name: 'Return & Refund', icon: 'RotateCcw', order: 3 },
    { id: 'fc4', name: 'Payment', icon: 'CreditCard', order: 4 },
    { id: 'fc5', name: 'Account Management', icon: 'User', order: 5 }
  ];

  let helpFAQs: any[] = [
    { id: 'faq1', categoryId: 'fc1', question: 'How do I place an order?', answer: 'Browse products, add to cart, and proceed to checkout.', isTopQuestion: true, order: 1 },
    { id: 'faq2', categoryId: 'fc1', question: 'Can I change my order after placing it?', answer: 'You can change it before it is processed by contacting support.', isTopQuestion: true, order: 2 },
    { id: 'faq3', categoryId: 'fc2', question: 'How long does delivery take?', answer: 'Usually 2-5 working days depending on your location.', isTopQuestion: true, order: 3 },
    { id: 'faq4', categoryId: 'fc3', question: 'How do I request a return?', answer: 'Go to My Orders and select the return option for the specific item.', isTopQuestion: true, order: 4 }
  ];

  let supportTickets: any[] = [
    {
      id: 'tkt1',
      userId: 'u1',
      subject: 'Order not received',
      category: 'Delivery',
      orderId: 'ORD-1001',
      description: 'My order was supposed to be delivered yesterday but I haven\'t received it yet.',
      status: 'Replied',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  let ticketMessages: any[] = [
    {
      id: 'msg1',
      ticketId: 'tkt1',
      senderId: 'u1',
      senderRole: 'user',
      message: 'My order was supposed to be delivered yesterday but I haven\'t received it yet.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'msg2',
      ticketId: 'tkt1',
      senderId: 'admin1',
      senderRole: 'admin',
      message: 'We apologize for the delay. Our courier partner is experiencing some issues. Your order will be delivered today.',
      createdAt: new Date().toISOString()
    }
  ];

  let pageErrorReports: any[] = [];
  let customerSuggestions: any[] = [];

  // Helper to sync customer data
  const syncCustomer = (order: any) => {
    let customer = customers.find(c => c.phone === order.customerPhone);
    
    if (!customer) {
      const nextId = customers.length + 1;
      customer = {
        id: `cust_${Date.now()}`,
        customerUniqueId: `CUST-${nextId.toString().padStart(4, '0')}`,
        fullName: order.customerName,
        phone: order.customerPhone,
        email: order.customerEmail,
        address: order.shippingAddress,
        district: order.district || '',
        upazila: order.upazila || '',
        totalOrders: 0,
        totalPurchase: 0,
        totalPaid: 0,
        totalDue: 0,
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      customers.push(customer);
    }

    // Update stats
    customer.totalOrders += 1;
    customer.totalPurchase += order.amount;
    customer.lastOrderDate = order.date;
    
    if (order.paymentStatus === 'paid') {
      customer.totalPaid += order.amount;
    } else if (order.paymentStatus === 'partial') {
      // Assuming partial payment amount is passed or calculated
      // For now, let's just use what's in the order if available
      customer.totalPaid += (order.paidAmount || 0);
    }
    
    customer.totalDue = customer.totalPurchase - customer.totalPaid;
    customer.updatedAt = new Date().toISOString();
    
    // Record payment if any
    if (order.paymentStatus === 'paid' || (order.paidAmount && order.paidAmount > 0)) {
      customerPayments.push({
        id: `pay_${Date.now()}`,
        customerId: customer.id,
        orderId: order.id,
        amount: order.paymentStatus === 'paid' ? order.amount : order.paidAmount,
        paymentMethod: order.paymentMethod,
        trxId: order.transactionId,
        date: order.date
      });
    }

    return customer.id;
  };

  let inventory: any[] = [
    {
      id: 'inv1',
      productId: 'p1',
      productName: 'Premium Canvas Print',
      productImage: 'https://picsum.photos/seed/canvas/400/400',
      sku: 'CAN-001',
      currentStock: 50,
      reservedStock: 5,
      availableStock: 45,
      lowStockLimit: 10,
      status: 'In Stock'
    }
  ];

  let hostingConfig = {
    id: 'h1',
    providerName: 'DigitalOcean',
    serverType: 'VPS',
    serverIp: '192.168.1.1',
    serverPort: 443,
    os: 'Ubuntu 22.04 LTS',
    controlPanel: 'None',
    appName: 'Auriel Canvas',
    environmentMode: 'Production',
    runtimeType: 'Node.js',
    runtimeVersion: '20.x',
    appRoot: '/var/www/auriel',
    publicDir: 'dist',
    dbType: 'PostgreSQL',
    dbHost: 'localhost',
    dbPort: 5432,
    dbName: 'auriel_db',
    dbUsername: 'auriel_admin',
    dbPassword: 'ENCRYPTED_PASSWORD_MASKED', // Simulated encryption
    dbSslRequired: true,
    primaryDomain: 'aurielcanvas.com',
    sslStatus: 'Active',
    forceHttps: true,
    uploadPath: '/var/www/auriel/uploads',
    maxUploadSize: 50,
    filePermission: '755',
    backupPath: '/var/www/auriel/backups',
    firewallEnabled: true,
    sshEnabled: true,
    rateLimit: 100,
    allowedIps: ['*'],
    adminIpRestriction: ['127.0.0.1'],
    cronSetup: '0 0 * * * backup.sh',
    backgroundWorkerEnabled: true,
    cacheDriver: 'Redis',
    queueDriver: 'Redis',
    logLevel: 'Info',
    maintenanceMode: false,
    debugMode: false,
    updatedAt: new Date().toISOString()
  };

  let hostingStats = {
    cpuUsage: 12,
    ramUsage: 45,
    storageUsed: 28,
    storageTotal: 100,
    bandwidthUsage: 15,
    activeConnections: 124,
    dbSize: 1.2,
    backgroundJobs: 5,
    uptime: '15d 4h 22m',
    lastRestart: '2024-02-10 10:00 AM',
    status: 'Online',
    location: 'San Francisco, US'
  };

  // Admin API: Get Payment Config
  app.get('/api/admin/payment-config', (req, res) => {
    res.json(paymentConfig);
  });

  // Admin API: Update Payment Config
  app.post('/api/admin/payment-config', (req, res) => {
    paymentConfig = { ...paymentConfig, ...req.body };
    res.json({ success: true, config: paymentConfig });
  });

  // Admin API: Get Infrastructure Config
  app.get('/api/admin/infra-config', (req, res) => {
    res.json(infraConfig);
  });

  // Admin API: Update Infrastructure Config
  app.post('/api/admin/infra-config', (req, res) => {
    infraConfig = { ...infraConfig, ...req.body };
    res.json({ success: true, config: infraConfig });
  });

  // Admin API: Get All Domains
  app.get('/api/admin/domains', (req, res) => {
    res.json(domains);
  });

  // Admin API: Add New Domain (Store)
  app.post('/api/admin/infra-config/domain/add', (req, res) => {
    const newDomainData = req.body;
    
    // Security Rules & Validation
    if (!newDomainData.domainName || !newDomainData.serverIp || !newDomainData.ns1 || !newDomainData.ns2) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    // 1. Domain duplicate check mandatory
    const isDuplicate = domains.some(d => d.domainName.toLowerCase() === newDomainData.domainName.toLowerCase());
    if (isDuplicate) {
      return res.status(400).json({ success: false, message: 'Domain already exists in the infrastructure.' });
    }

    // 2. DNS Validation before Save (Simulated)
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(newDomainData.domainName)) {
      return res.status(400).json({ success: false, message: 'Invalid domain name format.' });
    }

    // Create new domain entry
    const newEntry = {
      id: `d${Date.now()}`,
      domainName: newDomainData.domainName,
      domainType: newDomainData.domainType || 'Primary',
      serverIp: newDomainData.serverIp,
      ns1: newDomainData.ns1,
      ns2: newDomainData.ns2,
      ns3: newDomainData.ns3,
      sslEnabled: newDomainData.sslEnabled || false,
      sslType: newDomainData.sslType || 'LetsEncrypt',
      sslCertificate: newDomainData.sslCertificate,
      sslPrivateKey: newDomainData.sslPrivateKey, // Should be encrypted in real app
      caBundle: newDomainData.caBundle,
      forceHttps: newDomainData.forceHttps || false,
      hstsEnabled: newDomainData.hstsEnabled || false,
      maintenanceMode: newDomainData.maintenanceMode || false,
      redirectUrl: newDomainData.redirectUrl,
      redirectType: newDomainData.redirectType,
      cdnEnabled: newDomainData.cdnEnabled || false,
      emailEnabled: newDomainData.emailEnabled || false,
      wwwPreference: newDomainData.wwwPreference || 'Auto',
      status: 'Active',
      dnsStatus: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    domains.push(newEntry);

    // Activity Log
    const logEntry = {
      id: `log-${Date.now()}`,
      domainId: newEntry.id,
      action: 'DOMAIN_ADDED',
      changedBy: 'Super Admin',
      oldValue: null,
      newValue: newEntry,
      timestamp: new Date().toISOString()
    };
    domainLogs.push(logEntry);
    console.log(`[ACTIVITY LOG]`, JSON.stringify(logEntry, null, 2));

    res.json({ success: true, domain: newEntry });
  });

  // Admin API: Get Domain by ID (Edit)
  app.get('/api/admin/domains/:id', (req, res) => {
    const domain = domains.find(d => d.id === req.params.id);
    if (!domain) return res.status(404).json({ success: false, message: 'Domain not found' });
    res.json(domain);
  });

  // Admin API: Update Domain
  app.put('/api/admin/domains/:id', (req, res) => {
    const index = domains.findIndex(d => d.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Domain not found' });

    const oldDomain = { ...domains[index] };
    domains[index] = { ...domains[index], ...req.body, updatedAt: new Date().toISOString() };
    const newDomain = domains[index];

    // Activity Log
    const logEntry = {
      id: `log-${Date.now()}`,
      domainId: newDomain.id,
      action: 'DOMAIN_UPDATED',
      changedBy: 'Super Admin',
      oldValue: oldDomain,
      newValue: newDomain,
      timestamp: new Date().toISOString()
    };
    domainLogs.push(logEntry);

    res.json({ success: true, domain: newDomain });
  });

  // Admin API: Delete Domain
  app.delete('/api/admin/domains/:id', (req, res) => {
    const index = domains.findIndex(d => d.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Domain not found' });

    const deletedDomain = domains[index];
    
    // Prevent deleting primary domain if it's the only one
    if (deletedDomain.domainType === 'Primary' && domains.filter(d => d.domainType === 'Primary').length <= 1) {
      return res.status(400).json({ success: false, message: 'Cannot delete the only primary domain.' });
    }

    domains.splice(index, 1);

    // Activity Log
    const logEntry = {
      id: `log-${Date.now()}`,
      domainId: deletedDomain.id,
      action: 'DOMAIN_DELETED',
      changedBy: 'Super Admin',
      oldValue: deletedDomain,
      newValue: null,
      timestamp: new Date().toISOString()
    };
    domainLogs.push(logEntry);

    res.json({ success: true });
  });

  // Admin API: Get Domain Logs
  app.get('/api/admin/domain-logs', (req, res) => {
    res.json(domainLogs);
  });

  // Admin API: Orders
  app.get('/api/admin/orders', (req, res) => {
    res.json(orders);
  });

  // Admin API: Incomplete Orders
  app.get('/api/admin/incomplete-orders', async (req, res) => {
    try {
      res.json(incompleteOrders);
    } catch (error) {
      console.error('Error fetching incomplete orders:', error);
      res.status(500).json({ error: 'Failed to fetch incomplete orders' });
    }
  });

  app.delete('/api/admin/incomplete-orders/:id', async (req, res) => {
    incompleteOrders = incompleteOrders.filter(o => o.id !== req.params.id);
    res.json({ success: true, message: 'Incomplete order deleted' });
  });

  app.post('/api/admin/incomplete-orders/:id/convert', async (req, res) => {
    const incompleteOrderIndex = incompleteOrders.findIndex(o => o.id === req.params.id);
    if (incompleteOrderIndex === -1) {
      return res.status(404).json({ error: 'Incomplete order not found' });
    }

    const incompleteOrder = incompleteOrders[incompleteOrderIndex];
    
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      amount: incompleteOrder.cartValue,
      status: 'Pending Payment',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'pending',
      items: incompleteOrder.items,
      shippingAddress: incompleteOrder.customerAddress || 'N/A',
      customerName: incompleteOrder.customerName,
      customerPhone: incompleteOrder.customerPhone,
      division: '',
      district: '',
      upazila: '',
      deliveryCharge: 0,
      discount: 0,
      orderSource: 'admin_manual',
      packagingStatus: 'Pending',
      labelPrinted: false,
      invoicePrinted: false
    };

    // Sync Customer
    const customerId = syncCustomer(newOrder);
    (newOrder as any).customerId = customerId;

    orders.unshift(newOrder);
    incompleteOrders.splice(incompleteOrderIndex, 1);

    res.json({ success: true, message: 'Converted to order successfully', order: newOrder });
  });

  app.get('/api/admin/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  });

  app.put('/api/admin/orders/:id/status', (req, res) => {
    const { status, paymentStatus } = req.body;
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) return res.status(404).json({ message: 'Order not found' });

    const order = orders[orderIndex];
    const oldStatus = order.status;
    const oldPaymentStatus = order.paymentStatus;

    order.status = status || order.status;
    order.paymentStatus = paymentStatus || order.paymentStatus;

    addAuditLog(
      adminUsers[0].id, 
      adminUsers[0].fullName, 
      adminUsers[0].role, 
      'Order Status Updated', 
      'Orders', 
      order.id,
      { status: oldStatus, paymentStatus: oldPaymentStatus },
      { status: order.status, paymentStatus: order.paymentStatus }
    );

    // Sync with customer if payment status changed
    if (paymentStatus && paymentStatus !== oldPaymentStatus) {
      const customer = customers.find(c => c.phone === order.customerPhone);
      if (customer) {
        if (oldPaymentStatus !== 'paid' && paymentStatus === 'paid') {
          customer.totalPaid += order.amount;
          customerPayments.push({
            id: `pay_${Date.now()}`,
            customerId: customer.id,
            orderId: order.id,
            amount: order.amount,
            paymentMethod: order.paymentMethod,
            trxId: order.transactionId,
            date: new Date().toISOString()
          });
        } else if (oldPaymentStatus === 'paid' && paymentStatus !== 'paid') {
          customer.totalPaid -= order.amount;
        }
        customer.totalDue = customer.totalPurchase - customer.totalPaid;
        customer.updatedAt = new Date().toISOString();
      }
    }

    // Inventory logic: If confirmed, deduct stock. If cancelled, restore stock.
    if (status === 'Confirmed' && oldStatus === 'Pending') {
      orders[orderIndex].items.forEach((item: any) => {
        const invItem = inventory.find(inv => inv.productId === item.productId);
        if (invItem) {
          invItem.currentStock -= item.quantity;
          invItem.reservedStock -= item.quantity;
          invItem.availableStock = invItem.currentStock - invItem.reservedStock;
          if (invItem.currentStock <= 0) invItem.status = 'Out of Stock';
          else if (invItem.currentStock <= invItem.lowStockLimit) invItem.status = 'Low Stock';
        }
      });
    } else if (status === 'Cancelled') {
      if (oldStatus === 'Pending') {
        orders[orderIndex].items.forEach((item: any) => {
          const invItem = inventory.find(inv => inv.productId === item.productId);
          if (invItem) {
            invItem.reservedStock -= item.quantity;
            invItem.availableStock = invItem.currentStock - invItem.reservedStock;
          }
        });
      } else if (['Confirmed', 'Processing', 'Shipped', 'Out For Delivery'].includes(oldStatus)) {
        orders[orderIndex].items.forEach((item: any) => {
          const invItem = inventory.find(inv => inv.productId === item.productId);
          if (invItem) {
            invItem.currentStock += item.quantity;
            invItem.availableStock = invItem.currentStock - invItem.reservedStock;
            if (invItem.currentStock > invItem.lowStockLimit) invItem.status = 'In Stock';
            else if (invItem.currentStock > 0) invItem.status = 'Low Stock';
          }
        });
      }
    }

    res.json({ success: true, order: orders[orderIndex] });
  });

  app.post('/api/admin/orders/:id/note', (req, res) => {
    const { note } = req.body;
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) return res.status(404).json({ message: 'Order not found' });

    orders[orderIndex].internalNote = note;
    res.json({ success: true, order: orders[orderIndex] });
  });

  // --- Admin Manual Order ---
  app.post('/api/admin/orders/create-manual', (req, res) => {
    const { customerInfo, items, deliveryCharge, orderSource } = req.body;
    
    // Validate stock
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) return res.status(404).json({ error: `Product ${item.productId} not found` });
      
      if (product.manageStock) {
        if (item.variationId && product.variations) {
          const variation = product.variations.find((v: any) => v.id === item.variationId);
          if (!variation || variation.stockQuantity < item.quantity) {
            return res.status(400).json({ error: `Insufficient stock for variation ${item.variationId}` });
          }
          variation.stockQuantity -= item.quantity;
        } else {
          if ((product.stockQuantity || 0) < item.quantity) {
            return res.status(400).json({ error: `Insufficient stock for product ${product.id}` });
          }
          product.stockQuantity = (product.stockQuantity || 0) - item.quantity;
        }
      }
    }

    const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const total = subtotal + (deliveryCharge || 0);

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      amount: total,
      status: 'Pending Payment',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'pending',
      items,
      shippingAddress: customerInfo.address,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      division: customerInfo.division,
      district: customerInfo.district,
      upazila: customerInfo.thana,
      deliveryCharge: deliveryCharge || 0,
      discount: 0,
      orderSource: orderSource || 'admin_manual',
      packagingStatus: 'Pending',
      labelPrinted: false,
      invoicePrinted: false
    };

    // Sync Customer
    const customerId = syncCustomer(newOrder);
    (newOrder as any).customerId = customerId;

    orders.unshift(newOrder);
    res.status(201).json(newOrder);
  });

  // --- Website Order ---
  app.post('/api/orders', (req, res) => {
    const orderData = req.body;
    
    // Check if customer is blocked
    const customer = customers.find(c => c.phone === orderData.customerPhone);
    if (customer && customer.status === 'Blocked') {
      return res.status(403).json({ error: 'Your account is restricted. Please contact support.' });
    }

    const newOrder = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      status: 'Pending',
      packagingStatus: 'Pending',
      labelPrinted: false,
      invoicePrinted: false
    };

    // Sync Customer
    const customerId = syncCustomer(newOrder);
    (newOrder as any).customerId = customerId;

    orders.unshift(newOrder);
    res.status(201).json(newOrder);
  });

  // --- Courier Dispatch ---
  app.post('/api/courier/:provider/send', (req, res) => {
    const { provider } = req.params;
    const { orderId } = req.body;
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.dispatchedAt) return res.status(400).json({ error: 'Order already dispatched' });

    // Simulate API call
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      order.courierName = provider;
      order.courierTrackingId = `${provider.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      order.courierStatus = 'Dispatched';
      order.dispatchedAt = new Date().toISOString();
      order.courierResponse = { status: 'success', message: 'Order received by courier' };
      res.json({ success: true, trackingId: order.courierTrackingId });
    } else {
      res.status(500).json({ error: `Failed to send to ${provider}` });
    }
  });

  // --- Global Delivery Rules ---
  app.get('/api/admin/delivery/global-rules', (req, res) => {
    res.json(globalDeliveryRules);
  });

  app.put('/api/delivery/global-rules', (req, res) => {
    const { free_delivery_threshold, global_cod_fee, auto_dispatch_steadfast, auto_dispatch_pathao } = req.body;
    globalDeliveryRules.free_delivery_threshold = free_delivery_threshold;
    globalDeliveryRules.global_cod_fee = global_cod_fee;
    globalDeliveryRules.auto_dispatch_steadfast = auto_dispatch_steadfast;
    globalDeliveryRules.auto_dispatch_pathao = auto_dispatch_pathao;
    res.json({ success: true, rules: globalDeliveryRules });
  });

  // --- Payment Status ---
  app.put('/api/orders/:id/payment-status', (req, res) => {
    const { id } = req.params;
    const { payment_status } = req.body;
    const order = orders.find(o => o.id === id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    const oldStatus = order.paymentStatus;
    order.paymentStatus = payment_status;

    // Sync with customer
    const customer = customers.find(c => c.phone === order.customerPhone);
    if (customer) {
      if (oldStatus !== 'paid' && payment_status === 'paid') {
        customer.totalPaid += order.amount;
        
        // Record payment
        customerPayments.push({
          id: `pay_${Date.now()}`,
          customerId: customer.id,
          orderId: order.id,
          amount: order.amount,
          paymentMethod: order.paymentMethod,
          trxId: order.transactionId,
          date: new Date().toISOString()
        });
      } else if (oldStatus === 'paid' && payment_status !== 'paid') {
        customer.totalPaid -= order.amount;
        // In a real app, we'd also remove or mark the payment record as reversed
      }
      
      customer.totalDue = customer.totalPurchase - customer.totalPaid;
      customer.updatedAt = new Date().toISOString();
    }

    res.json({ success: true, paymentStatus: order.paymentStatus });
  });

  // --- Customer Intelligence ---
  app.get('/api/customers/:id/intelligence', (req, res) => {
    const { id } = req.params;
    const customerOrders = orders.filter(o => o.customerPhone === id); // Using phone as ID for simplicity
    
    const delivered = customerOrders.filter(o => o.status === 'Delivered').length;
    const cancelled = customerOrders.filter(o => o.status === 'Cancelled').length;
    const returned = 0; // Mock
    const fraudCount = 0; // Mock
    const total = customerOrders.length;
    const successRate = total > 0 ? (delivered / total) * 100 : 0;

    const intelligence = {
      totalOrders: total,
      delivered,
      cancelled,
      returned,
      fraudCount,
      successRate,
      courierStats: {
        pathao: { total: 0, successful: 0, cancelled: 0, returned: 0, successRate: 0 },
        steadfast: { total: 0, successful: 0, cancelled: 0, returned: 0, successRate: 0 }
      },
      riskLevel: successRate > 70 ? 'Low' : successRate > 40 ? 'Medium' : 'High',
      externalRecords: externalCustomerRecords.filter(r => r.customerId === id)
    };

    res.json(intelligence);
  });

  app.post('/api/customers/:id/external-records', (req, res) => {
    const { id } = req.params;
    const { courier, status, date, note } = req.body;
    const newRecord = {
      id: `EXT-${Date.now()}`,
      customerId: id,
      courier,
      status,
      date,
      note
    };
    externalCustomerRecords.push(newRecord);
    res.status(201).json(newRecord);
  });

  // --- Delivery System API ---
  app.get('/api/admin/delivery/couriers', (req, res) => res.json(courierConfigs));
  app.post('/api/admin/delivery/couriers', (req, res) => {
    const config = { ...req.body, id: `c${Date.now()}` };
    courierConfigs.push(config);
    res.json({ success: true, config });
  });
  app.put('/api/admin/delivery/couriers/:id', (req, res) => {
    const idx = courierConfigs.findIndex(c => c.id === req.params.id);
    if (idx !== -1) {
      courierConfigs[idx] = { ...courierConfigs[idx], ...req.body };
      res.json({ success: true, config: courierConfigs[idx] });
    } else res.status(404).json({ message: 'Not found' });
  });

  app.get('/api/admin/delivery/zones', (req, res) => res.json(deliveryZones));
  app.post('/api/admin/delivery/zones', (req, res) => {
    const zone = { ...req.body, id: `dz${Date.now()}` };
    deliveryZones.push(zone);
    res.json({ success: true, zone });
  });
  app.put('/api/admin/delivery/zones/:id', (req, res) => {
    const idx = deliveryZones.findIndex(z => z.id === req.params.id);
    if (idx !== -1) {
      deliveryZones[idx] = { ...deliveryZones[idx], ...req.body };
      res.json({ success: true, zone: deliveryZones[idx] });
    } else res.status(404).json({ message: 'Not found' });
  });

  app.get('/api/admin/delivery/logs', (req, res) => res.json(deliveryLogs));

  // --- TAZU MART BD Admin Settings API ---
  app.get('/api/admin/settings/profile', (req, res) => res.json(adminUsers[0]));
  app.put('/api/admin/settings/profile', (req, res) => {
    adminUsers[0] = { ...adminUsers[0], ...req.body, updatedAt: new Date().toISOString() };
    addAuditLog(adminUsers[0].id, adminUsers[0].fullName, adminUsers[0].role, 'Updated Profile', 'Settings', adminUsers[0].id);
    res.json(adminUsers[0]);
  });

  app.get('/api/admin/settings/sessions', (req, res) => res.json(adminSessions));
  app.post('/api/admin/settings/sessions/logout-all', (req, res) => {
    adminSessions = adminSessions.filter(s => s.isCurrent);
    addAuditLog(adminUsers[0].id, adminUsers[0].fullName, adminUsers[0].role, 'Logged out all other sessions', 'Security', adminUsers[0].id);
    res.json({ success: true });
  });

  app.get('/api/admin/settings/roles', (req, res) => res.json(adminRoles));
  app.post('/api/admin/settings/roles', (req, res) => {
    const role = { ...req.body, id: `role-${Date.now()}`, isCustom: true, createdAt: new Date().toISOString() };
    adminRoles.push(role);
    addAuditLog(adminUsers[0].id, adminUsers[0].fullName, adminUsers[0].role, `Created Role: ${role.name}`, 'RBAC', role.id);
    res.json(role);
  });

  app.get('/api/admin/settings/business', (req, res) => res.json(businessSettings));
  app.put('/api/admin/settings/business', (req, res) => {
    businessSettings = { ...businessSettings, ...req.body };
    addAuditLog(adminUsers[0].id, adminUsers[0].fullName, adminUsers[0].role, 'Updated Business Info', 'Settings', 'business-settings');
    res.json(businessSettings);
  });

  app.get('/api/admin/settings/theme-master', (req, res) => res.json(themeMaster));
  app.get('/api/admin/settings/theme/:panel', (req, res) => {
    const panel = req.params.panel as 'admin' | 'customer' | 'frontend';
    res.json(activeThemes[panel] || activeThemes.admin);
  });
  app.put('/api/admin/settings/theme/:panel', (req, res) => {
    const panel = req.params.panel as 'admin' | 'customer' | 'frontend';
    activeThemes[panel] = { ...activeThemes[panel], ...req.body, updatedAt: new Date().toISOString() };
    addAuditLog(adminUsers[0].id, adminUsers[0].fullName, adminUsers[0].role, `Updated ${panel} Theme Settings`, 'Branding', `theme-${panel}`);
    res.json(activeThemes[panel]);
  });

  app.get('/api/admin/settings/tax', (req, res) => res.json(taxSettings));
  app.put('/api/admin/settings/tax', (req, res) => {
    taxSettings = { ...taxSettings, ...req.body };
    addAuditLog(adminUsers[0].id, adminUsers[0].fullName, adminUsers[0].role, 'Updated Tax Settings', 'Finance', 'tax-settings');
    res.json(taxSettings);
  });

  app.get('/api/admin/settings/currency', (req, res) => res.json(currencySettings));
  app.put('/api/admin/settings/currency', (req, res) => {
    currencySettings = { ...currencySettings, ...req.body };
    addAuditLog(adminUsers[0].id, adminUsers[0].fullName, adminUsers[0].role, 'Updated Currency Settings', 'Finance', 'currency-settings');
    res.json(currencySettings);
  });

  app.get('/api/admin/settings/automation', (req, res) => res.json(automationRules));
  app.put('/api/admin/settings/automation', (req, res) => {
    automationRules = { ...automationRules, ...req.body };
    addAuditLog(adminUsers[0].id, adminUsers[0].fullName, adminUsers[0].role, 'Updated Automation Rules', 'Automation', 'automation-rules');
    res.json(automationRules);
  });

  app.get('/api/admin/settings/email-templates', (req, res) => res.json(emailTemplates));
  app.put('/api/admin/settings/email-templates/:id', (req, res) => {
    const idx = emailTemplates.findIndex(t => t.id === req.params.id);
    if (idx !== -1) {
      emailTemplates[idx] = { ...emailTemplates[idx], ...req.body };
      addAuditLog(adminUsers[0].id, adminUsers[0].fullName, adminUsers[0].role, `Updated Email Template: ${emailTemplates[idx].name}`, 'Templates', emailTemplates[idx].id);
      res.json(emailTemplates[idx]);
    } else res.status(404).json({ message: 'Not found' });
  });

  app.get('/api/admin/settings/sms-templates', (req, res) => res.json(smsTemplates));
  app.put('/api/admin/settings/sms-templates/:id', (req, res) => {
    const idx = smsTemplates.findIndex(t => t.id === req.params.id);
    if (idx !== -1) {
      smsTemplates[idx] = { ...smsTemplates[idx], ...req.body };
      addAuditLog(adminUsers[0].id, adminUsers[0].fullName, adminUsers[0].role, `Updated SMS Template: ${smsTemplates[idx].name}`, 'Templates', smsTemplates[idx].id);
      res.json(smsTemplates[idx]);
    } else res.status(404).json({ message: 'Not found' });
  });

  app.get('/api/admin/settings/api-integrations', (req, res) => res.json(apiIntegrations));
  app.put('/api/admin/settings/api-integrations/:id', (req, res) => {
    const idx = apiIntegrations.findIndex(i => i.id === req.params.id);
    if (idx !== -1) {
      apiIntegrations[idx] = { ...apiIntegrations[idx], ...req.body };
      addAuditLog(adminUsers[0].id, adminUsers[0].fullName, adminUsers[0].role, `Updated API Integration: ${apiIntegrations[idx].name}`, 'Integrations', apiIntegrations[idx].id);
      res.json(apiIntegrations[idx]);
    } else res.status(404).json({ message: 'Not found' });
  });

  app.get('/api/admin/settings/preferences', (req, res) => res.json(systemPreferences));
  app.put('/api/admin/settings/preferences', (req, res) => {
    systemPreferences = { ...systemPreferences, ...req.body };
    addAuditLog(adminUsers[0].id, adminUsers[0].fullName, adminUsers[0].role, 'Updated System Preferences', 'Settings', 'system-preferences');
    res.json(systemPreferences);
  });

  let notificationSettings = {
    enableBell: true,
    enableEmail: true,
    enableSms: false,
    enablePush: true,
    criticalOnlyMode: false,
    categories: {
      orders: true,
      customers: true,
      system: true,
      marketing: false,
      security: true,
    }
  };

  app.get('/api/admin/settings/notifications', (req, res) => res.json(notificationSettings));
  app.put('/api/admin/settings/notifications', (req, res) => {
    notificationSettings = { ...notificationSettings, ...req.body };
    addAuditLog(adminUsers[0].id, adminUsers[0].fullName, adminUsers[0].role, 'Updated Notification Preferences', 'Settings', 'notification-settings');
    res.json(notificationSettings);
  });

  app.get('/api/admin/settings/logs', (req, res) => {
    const { module, status, riskLevel, search, limit = 50, offset = 0 } = req.query;
    
    let filteredLogs = [...auditLogs];
    
    if (module && module !== 'All') {
      filteredLogs = filteredLogs.filter(log => log.module === module);
    }
    
    if (status && status !== 'All') {
      filteredLogs = filteredLogs.filter(log => log.status === status);
    }
    
    if (riskLevel && riskLevel !== 'All') {
      filteredLogs = filteredLogs.filter(log => log.riskLevel === riskLevel);
    }
    
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        log.id.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        log.performedBy.name.toLowerCase().includes(searchLower) ||
        (log.entityId && log.entityId.toLowerCase().includes(searchLower))
      );
    }
    
    const total = filteredLogs.length;
    const paginatedLogs = filteredLogs.slice(Number(offset), Number(offset) + Number(limit));
    
    res.json({
      logs: paginatedLogs,
      total,
      limit: Number(limit),
      offset: Number(offset)
    });
  });

  app.get('/api/admin/settings/logs/export', (req, res) => {
    // In a real app, generate CSV/Excel. For demo, return JSON as "file"
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=system_logs.csv');
    
    const headers = 'ID,Timestamp,Module,Action,Performed By,Role,Status,Risk Level,IP\n';
    const rows = auditLogs.map(log => 
      `${log.id},${log.timestamp},${log.module},${log.action},${log.performedBy.name},${log.performedBy.role},${log.status},${log.riskLevel},${log.ip}`
    ).join('\n');
    
    res.send(headers + rows);
  });

  let marketingConfig = {
    adSetup: {
      facebook: {
        businessManagerId: '',
        adAccountId: '',
        pageId: '',
        pixelId: '',
        appId: '',
        appSecret: '',
        accessToken: '',
        isEnabled: false,
        status: 'Not Connected'
      },
      google: {
        customerId: '',
        conversionId: '',
        conversionLabel: '',
        measurementId: '',
        merchantCenterId: '',
        isEnabled: false,
        status: 'Not Connected'
      },
      tiktok: {
        businessAccountId: '',
        adAccountId: '',
        pixelId: '',
        accessToken: '',
        isEnabled: false,
        status: 'Not Connected'
      },
      gtm: {
        containerId: '',
        environment: 'Live',
        measurementId: '',
        conversionLinker: true,
        isEnabled: false,
        status: 'Not Connected'
      }
    },
    tracking: {
      website: {
        isEnabled: true,
        headerScript: '',
        footerScript: '',
        globalTrackingCode: '',
        events: {
          pageView: true,
          viewContent: true,
          addToCart: true,
          initiateCheckout: true,
          purchase: true,
          completeRegistration: true
        }
      },
      serverSide: {
        facebookApiKey: '',
        googleServerKey: '',
        tiktokApiToken: '',
        isEnabled: false,
        retryQueueEnabled: true
      }
    }
  };

  app.get('/api/admin/marketing/config', (req, res) => res.json(marketingConfig));
  app.put('/api/admin/marketing/config', (req, res) => {
    marketingConfig = { ...marketingConfig, ...req.body };
    addAuditLog(adminUsers[0].id, adminUsers[0].fullName, adminUsers[0].role, 'Updated Marketing Configuration', 'Marketing', 'marketing-config');
    res.json(marketingConfig);
  });

  app.post('/api/admin/marketing/validate/:platform', (req, res) => {
    const { platform } = req.params;
    // Simulate validation logic
    setTimeout(() => {
      if (marketingConfig.adSetup[platform as keyof typeof marketingConfig.adSetup]) {
        (marketingConfig.adSetup[platform as keyof typeof marketingConfig.adSetup] as any).status = 'Connected';
        res.json({ success: true, message: `${platform} connection validated successfully.` });
      } else {
        res.status(400).json({ success: false, message: `Invalid platform: ${platform}` });
      }
    }, 1000);
  });
  
  app.get('/api/admin/settings/backups', (req, res) => res.json(backups));
  app.post('/api/admin/settings/backups', (req, res) => {
    const backup = {
      id: `bak-${Date.now()}`,
      filename: `backup_${new Date().toISOString().split('T')[0]}.sql`,
      size: Math.floor(Math.random() * 10000000),
      type: 'Manual',
      status: 'Success',
      timestamp: new Date().toISOString()
    };
    backups.unshift(backup);
    addAuditLog(adminUsers[0].id, adminUsers[0].fullName, adminUsers[0].role, 'Created Manual Backup', 'System', backup.id);
    res.json(backup);
  });

  // --- Customer Management API ---
  app.get('/api/admin/customers', (req, res) => {
    const { status, district, search, provider } = req.query;
    let filtered = customers.filter(c => !c.deletedAt);

    if (status) filtered = filtered.filter(c => c.status === status);
    if (district) filtered = filtered.filter(c => c.district === district);
    if (provider) filtered = filtered.filter(c => (c.provider || 'manual') === provider);
    if (search) {
      const s = (search as string).toLowerCase();
      filtered = filtered.filter(c => 
        c.fullName.toLowerCase().includes(s) || 
        c.phone.includes(s) || 
        c.customerUniqueId.toLowerCase().includes(s)
      );
    }

    res.json(filtered);
  });

  app.get('/api/admin/customers/stats', (req, res) => {
    const active = customers.filter(c => c.status === 'Active' && !c.deletedAt).length;
    const totalDue = customers.reduce((acc, c) => acc + (c.totalDue || 0), 0);
    
    const today = new Date().toISOString().split('T')[0];
    const newToday = customers.filter(c => c.createdAt.startsWith(today)).length;
    
    const thisMonth = new Date().toISOString().substring(0, 7);
    const newMonth = customers.filter(c => c.createdAt.startsWith(thisMonth)).length;

    const topBuyers = [...customers]
      .sort((a, b) => b.totalPurchase - a.totalPurchase)
      .slice(0, 5);

    res.json({
      totalCustomers: customers.length,
      activeCustomers: active,
      totalDueAmount: totalDue,
      newCustomersToday: newToday,
      newCustomersMonth: newMonth,
      topBuyers
    });
  });

  app.get('/api/admin/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const customerOrders = orders.filter(o => o.customerId === customer.id);
    const customerPaymentsList = customerPayments.filter(p => p.customerId === customer.id);

    res.json({
      ...customer,
      orders: customerOrders,
      payments: customerPaymentsList
    });
  });

  app.put('/api/admin/customers/:id/status', (req, res) => {
    const idx = customers.findIndex(c => c.id === req.params.id);
    if (idx !== -1) {
      customers[idx].status = req.body.status;
      customers[idx].updatedAt = new Date().toISOString();
      res.json({ success: true, customer: customers[idx] });
    } else res.status(404).json({ message: 'Not found' });
  });

  app.put('/api/admin/customers/:id/role', (req, res) => {
    const { role } = req.body;
    const customer = customers.find(c => c.id === req.params.id);
    if (customer) {
      // Find corresponding user
      const user = users.find(u => u.id === customer.userId || u.email === customer.email);
      if (user) {
        user.role = role;
        user.updatedAt = new Date().toISOString();
      }
      customer.role = role; // Sync role to customer object too for easier UI
      customer.updatedAt = new Date().toISOString();
      res.json({ success: true, customer });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  });

  app.post('/api/admin/customers/:id/notes', (req, res) => {
    const idx = customers.findIndex(c => c.id === req.params.id);
    if (idx !== -1) {
      customers[idx].notes = req.body.notes;
      customers[idx].updatedAt = new Date().toISOString();
      res.json({ success: true, customer: customers[idx] });
    } else res.status(404).json({ message: 'Not found' });
  });

  app.delete('/api/admin/customers/:id', (req, res) => {
    const idx = customers.findIndex(c => c.id === req.params.id);
    if (idx !== -1) {
      customers[idx].deletedAt = new Date().toISOString();
      res.json({ success: true });
    } else res.status(404).json({ message: 'Not found' });
  });

  app.post('/api/admin/customers/:id/payments', (req, res) => {
    const { id } = req.params;
    const { amount, method, trxId, date } = req.body;
    const customer = customers.find(c => c.id === id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const payment = {
      id: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      customerPhone: customer.phone,
      amount: Number(amount),
      paymentMethod: method,
      trxId: trxId,
      date: date || new Date().toISOString()
    };

    customerPayments.push(payment);
    
    // Re-sync customer to update totals
    syncCustomer({ phone: customer.phone });

    res.json(payment);
  });

  app.get('/api/admin/customers/analytics', (req, res) => {
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    
    const repeatCustomers = customers.filter(c => c.totalOrders > 1).length;
    const repeatRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;
    
    const totalRevenue = orders.reduce((acc, o) => acc + o.amount, 0);
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const ltv = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    res.json({
      repeatCustomerRate: repeatRate,
      averageOrderValue: aov,
      lifetimeValue: ltv,
      outstandingDue: customers.reduce((acc, c) => acc + (c.totalDue || 0), 0)
    });
  });

  // --- Workshop API ---
  app.get('/api/admin/workshop/orders', (req, res) => {
    const workshopOrders = orders.filter(o => ['Pending', 'Confirmed', 'Processing'].includes(o.status));
    res.json(workshopOrders);
  });

  app.put('/api/admin/workshop/orders/:id/packaging', (req, res) => {
    const idx = orders.findIndex(o => o.id === req.params.id);
    if (idx !== -1) {
      orders[idx].packagingStatus = req.body.status;
      res.json({ success: true, order: orders[idx] });
    } else res.status(404).json({ message: 'Not found' });
  });

  app.put('/api/admin/workshop/orders/:id/courier', (req, res) => {
    const idx = orders.findIndex(o => o.id === req.params.id);
    if (idx !== -1) {
      orders[idx].assignedCourier = req.body.courier;
      res.json({ success: true, order: orders[idx] });
    } else res.status(404).json({ message: 'Not found' });
  });

  app.put('/api/admin/workshop/orders/:id/print', (req, res) => {
    const idx = orders.findIndex(o => o.id === req.params.id);
    if (idx !== -1) {
      if (req.body.type === 'invoice') orders[idx].invoicePrinted = true;
      if (req.body.type === 'label') orders[idx].labelPrinted = true;
      res.json({ success: true, order: orders[idx] });
    } else res.status(404).json({ message: 'Not found' });
  });

  // --- Vendor API ---
  app.get('/api/admin/vendors', (req, res) => res.json(vendors));
  
  app.post('/api/admin/vendors', (req, res) => {
    const lastVendor = vendors[vendors.length - 1];
    const lastNum = lastVendor ? parseInt(lastVendor.vendorId.split('-')[1]) : 0;
    const nextId = `VND-${(lastNum + 1).toString().padStart(4, '0')}`;

    const vendor = { 
      ...req.body, 
      id: `v${Date.now()}`, 
      vendorId: nextId,
      totalProducts: 0, 
      totalOrders: 0, 
      totalEarnings: 0, 
      totalPurchaseAmount: 0,
      totalPaid: 0,
      currentDue: req.body.openingBalance || 0,
      createdAt: new Date().toISOString() 
    };

    if (vendor.openingBalance > 0) {
      vendorLedger.push({
        id: `ledger-${Date.now()}`,
        vendorId: vendor.id,
        date: new Date().toISOString(),
        reference: 'Opening Balance',
        type: 'Opening Balance',
        debit: vendor.openingBalance,
        credit: 0,
        balance: vendor.openingBalance,
        note: 'Initial opening balance'
      });
    }

    vendors.push(vendor);
    res.json({ success: true, vendor });
  });

  app.put('/api/admin/vendors/:id', (req, res) => {
    const idx = vendors.findIndex(v => v.id === req.params.id);
    if (idx !== -1) {
      vendors[idx] = { ...vendors[idx], ...req.body, updatedAt: new Date().toISOString() };
      res.json({ success: true, vendor: vendors[idx] });
    } else res.status(404).json({ message: 'Not found' });
  });

  app.delete('/api/admin/vendors/:id', (req, res) => {
    const idx = vendors.findIndex(v => v.id === req.params.id);
    if (idx !== -1) {
      // Check if purchase exists
      const hasPurchases = vendorPurchases.some(p => p.vendorId === req.params.id);
      if (hasPurchases) {
        return res.status(400).json({ message: 'Cannot delete vendor with existing purchases.' });
      }
      vendors[idx].deletedAt = new Date().toISOString();
      res.json({ success: true });
    } else res.status(404).json({ message: 'Not found' });
  });

  // --- Vendor Purchases ---
  app.get('/api/admin/vendors/purchases', (req, res) => res.json(vendorPurchases));
  
  app.post('/api/admin/vendors/purchases', (req, res) => {
    const purchase = { 
      ...req.body, 
      id: `pur-${Date.now()}`, 
      createdAt: new Date().toISOString() 
    };

    const vendor = vendors.find(v => v.id === purchase.vendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    // 1. Update Vendor Financials
    vendor.totalPurchaseAmount += purchase.totalAmount;
    vendor.totalPaid += purchase.paidAmount;
    vendor.currentDue += purchase.dueAmount;

    // 2. Update Stock
    purchase.items.forEach((item: any) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        product.stockQuantity += item.quantity;
        product.costPrice = item.buyingPrice; // Update buying price
        
        // Sync to inventory
        const invItem = inventory.find(inv => inv.productId === item.productId);
        if (invItem) {
          invItem.currentStock += item.quantity;
          invItem.availableStock = invItem.currentStock - invItem.reservedStock;
          invItem.status = invItem.currentStock > invItem.lowStockLimit ? 'In Stock' : (invItem.currentStock > 0 ? 'Low Stock' : 'Out of Stock');
        }
      }
    });

    // 3. Create Ledger Entry
    const lastLedger = vendorLedger.filter(l => l.vendorId === vendor.id).pop();
    const lastBalance = lastLedger ? lastLedger.balance : 0;

    vendorLedger.push({
      id: `ledger-${Date.now()}`,
      vendorId: vendor.id,
      date: purchase.purchaseDate,
      reference: purchase.invoiceNumber,
      type: 'Purchase',
      debit: purchase.totalAmount,
      credit: purchase.paidAmount,
      balance: lastBalance + purchase.dueAmount,
      note: purchase.note
    });

    vendorPurchases.push(purchase);
    res.json({ success: true, purchase });
  });

  // --- Vendor Payments ---
  app.get('/api/admin/vendors/payments', (req, res) => res.json(vendorPayments));

  app.post('/api/admin/vendors/payments', (req, res) => {
    const payment = { 
      ...req.body, 
      id: `pay-${Date.now()}`, 
      createdAt: new Date().toISOString() 
    };

    const vendor = vendors.find(v => v.id === payment.vendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    // 1. Update Vendor Financials
    vendor.totalPaid += payment.amount;
    vendor.currentDue -= payment.amount;

    // 2. Create Ledger Entry
    const lastLedger = vendorLedger.filter(l => l.vendorId === vendor.id).pop();
    const lastBalance = lastLedger ? lastLedger.balance : 0;

    vendorLedger.push({
      id: `ledger-${Date.now()}-2`,
      vendorId: vendor.id,
      date: payment.paymentDate,
      reference: payment.transactionId || 'Manual Payment',
      type: 'Payment',
      debit: 0,
      credit: payment.amount,
      balance: lastBalance - payment.amount,
      note: payment.note
    });

    vendorPayments.push(payment);
    res.json({ success: true, payment });
  });

  // --- Vendor Ledger ---
  app.get('/api/admin/vendors/:id/ledger', (req, res) => {
    const ledger = vendorLedger.filter(l => l.vendorId === req.params.id);
    res.json(ledger);
  });

  // --- Vendor Reports ---
  app.get('/api/admin/vendors/reports/summary', (req, res) => {
    const summary = {
      totalPurchases: vendorPurchases.reduce((acc, p) => acc + p.totalAmount, 0),
      totalPaid: vendorPayments.reduce((acc, p) => acc + p.amount, 0),
      totalDue: vendors.reduce((acc, v) => acc + v.currentDue, 0),
      monthlyPurchases: vendorPurchases.reduce((acc, p) => {
        const month = p.purchaseDate.substring(0, 7);
        acc[month] = (acc[month] || 0) + p.totalAmount;
        return acc;
      }, {}),
      topVendors: vendors
        .sort((a, b) => b.totalPurchaseAmount - a.totalPurchaseAmount)
        .slice(0, 5)
    };
    res.json(summary);
  });

  app.get('/api/admin/vendors/payouts', (req, res) => res.json(vendorPayouts));
  app.post('/api/admin/vendors/payouts', (req, res) => {
    const payout = { ...req.body, id: `payout-${Date.now()}`, timestamp: new Date().toISOString() };
    vendorPayouts.push(payout);
    res.json({ success: true, payout });
  });

  // --- Category API ---
  app.get('/api/categories', (req, res) => {
    console.log('GET /api/categories hit');
    const { status } = req.query;
    if (status) {
      return res.json(categories.filter(c => c.status === status));
    }
    res.json(categories);
  });

  app.post('/api/categories', (req, res) => {
    console.log('POST /api/categories hit', req.body);
    const newCategory = { ...req.body, id: `cat${Date.now()}` };
    categories.push(newCategory);
    res.status(201).json(newCategory);
  });

  app.put('/api/categories/:id', (req, res) => {
    console.log(`PUT /api/categories/${req.params.id} hit`, req.body);
    const { id } = req.params;
    categories = categories.map(c => c.id === id ? { ...c, ...req.body } : c);
    res.json(categories.find(c => c.id === id));
  });

  app.delete('/api/categories/:id', (req, res) => {
    console.log(`DELETE /api/categories/${req.params.id} hit`);
    const { id } = req.params;
    categories = categories.filter(c => c.id !== id);
    res.status(204).send();
  });

  // --- Banners Endpoints ---
  app.get('/api/admin/banners', (req, res) => res.json(banners));
  app.post('/api/admin/banners', (req, res) => {
    const newBanner = { ...req.body, id: `b${Date.now()}` };
    banners.push(newBanner);
    res.status(201).json(newBanner);
  });
  app.put('/api/admin/banners/:id', (req, res) => {
    const { id } = req.params;
    banners = banners.map(b => b.id === id ? { ...b, ...req.body } : b);
    res.json(banners.find(b => b.id === id));
  });
  app.delete('/api/admin/banners/:id', (req, res) => {
    const { id } = req.params;
    banners = banners.filter(b => b.id !== id);
    res.status(204).send();
  });

  // --- Orders Endpoints ---
  app.get('/api/orders', (req, res) => {
    res.json(orders);
  });

  app.get('/api/incomplete-orders', (req, res) => {
    res.json(incompleteOrders);
  });

  app.post('/api/incomplete-orders', (req, res) => {
    const data = req.body;
    // Check if we already have an incomplete order for this phone
    const existingIdx = incompleteOrders.findIndex(o => o.mobileNumber === data.mobileNumber && data.mobileNumber);
    if (existingIdx !== -1) {
      incompleteOrders[existingIdx] = { ...incompleteOrders[existingIdx], ...data, updatedAt: new Date().toISOString() };
      res.json(incompleteOrders[existingIdx]);
    } else {
      const newIncomplete = { ...data, id: `INC-${Date.now()}`, createdAt: new Date().toISOString() };
      incompleteOrders.unshift(newIncomplete);
      res.status(201).json(newIncomplete);
    }
  });

  // --- Dashboard Stats ---
  app.get('/api/admin/stats', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => o.date.startsWith(today));
    
    const pendingOrders = orders.filter(o => o.status === 'Pending');
    const confirmedOrders = orders.filter(o => o.status === 'Confirmed');
    const deliveredOrders = orders.filter(o => o.status === 'Delivered');
    const completedOrders = orders.filter(o => o.status === 'Completed');
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled');
    const returnedOrders = orders.filter(o => o.status === 'Returned');
    const refundedOrders = orders.filter(o => o.status === 'Refunded');

    const totalRevenue = orders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + o.amount, 0);
    const totalSales = orders.filter(o => !['Cancelled', 'Returned', 'Refunded'].includes(o.status)).reduce((sum, o) => sum + o.amount, 0);

    res.json({
      todayOrders: todayOrders.length,
      pendingOrders: pendingOrders.length,
      confirmedOrders: confirmedOrders.length,
      deliveredOrders: deliveredOrders.length,
      completedOrders: completedOrders.length,
      cancelledOrders: cancelledOrders.length,
      returnedOrders: returnedOrders.length,
      refundedOrders: refundedOrders.length,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalRevenue,
      totalSales,
      totalCustomers: customers.length,
    });
  });

  // --- Campaigns Endpoints ---
  app.get('/api/admin/campaigns', (req, res) => res.json(campaigns));
  app.post('/api/admin/campaigns', (req, res) => {
    const newCampaign = { ...req.body, id: `c${Date.now()}` };
    campaigns.push(newCampaign);
    res.status(201).json(newCampaign);
  });
  app.put('/api/admin/campaigns/:id', (req, res) => {
    const { id } = req.params;
    campaigns = campaigns.map(c => c.id === id ? { ...c, ...req.body } : c);
    res.json(campaigns.find(c => c.id === id));
  });
  app.delete('/api/admin/campaigns/:id', (req, res) => {
    const { id } = req.params;
    campaigns = campaigns.filter(c => c.id !== id);
    res.status(204).send();
  });

  // --- Workshop Endpoints ---
  app.get('/api/admin/workshop/orders', (req, res) => {
    const workshopOrders = orders.map(order => ({
      ...order,
      packagingStatus: order.packagingStatus || 'Pending',
      labelPrinted: order.labelPrinted || false,
      invoicePrinted: order.invoicePrinted || false
    }));
    res.json(workshopOrders);
  });

  app.put('/api/admin/workshop/orders/:id/packaging', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = orders.find(o => o.id === id);
    if (order) {
      order.packagingStatus = status;
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  });

  app.put('/api/admin/workshop/orders/:id/print', (req, res) => {
    const { id } = req.params;
    const { type } = req.body;
    const order = orders.find(o => o.id === id);
    if (order) {
      if (type === 'invoice') order.invoicePrinted = true;
      if (type === 'label') order.labelPrinted = true;
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  });

  // --- Admin Review Endpoints ---
  app.get('/api/admin/reviews', (req, res) => {
    res.json(userReviews);
  });

  app.put('/api/admin/reviews/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const review = userReviews.find(r => r.id === id);
    if (review) {
      review.status = status;
      res.json(review);
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  });

  app.delete('/api/admin/reviews/:id', (req, res) => {
    userReviews = userReviews.filter(r => r.id !== req.params.id);
    res.json({ success: true });
  });

  app.put('/api/admin/reviews/:id/feature', (req, res) => {
    const { id } = req.params;
    const { isFeatured } = req.body;
    const review = userReviews.find(r => r.id === id);
    if (review) {
      review.isFeatured = isFeatured;
      res.json(review);
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  });

  // --- Reports Endpoints ---
  app.post('/api/admin/reports/export/:type', (req, res) => {
    const { type } = req.params;
    res.json({ success: true, message: `${type.toUpperCase()} report generated successfully.` });
  });

  // --- Footer Endpoints ---
  app.get('/api/admin/footer', (req, res) => res.json(brandingSettings.footer));
  app.put('/api/admin/footer', (req, res) => {
    brandingSettings.footer = { ...brandingSettings.footer, ...req.body };
    res.json(brandingSettings.footer);
  });

  // --- Product Endpoints ---
  app.get('/api/products', (req, res) => res.json(products.filter(p => !p.deletedAt)));

  app.post('/api/products/:id/view', (req, res) => {
    const { id } = req.params;
    const product = products.find(p => String(p.id) === String(id));
    if (product) {
      product.views = (Number(product.views) || 0) + 1;
      return res.json({ success: true, views: product.views });
    }
    return res.status(404).json({ success: false, error: 'Product not found' });
  });

  app.get('/api/related-products', (req, res) => {
    const { categoryId, productId } = req.query;
    let related = products.filter(p => p.id !== productId);
    
    if (categoryId) {
      const sameCategory = related.filter(p => p.categoryId === categoryId);
      if (sameCategory.length > 0) {
        related = sameCategory;
      }
    }
    
    // If not enough same category, add featured or latest
    if (related.length < 6) {
      const featured = products.filter(p => p.isFeatured && p.id !== productId && !related.find(r => r.id === p.id));
      related = [...related, ...featured];
    }
    
    if (related.length < 6) {
      const latest = products.filter(p => p.id !== productId && !related.find(r => r.id === p.id)).reverse();
      related = [...related, ...latest];
    }

    res.json(related.slice(0, 10));
  });
  app.get('/api/faqs', (req, res) => res.json(helpFAQs));
  
  let connectivitySettings = {
    whatsappNumber: "01834800916",
    messengerLink: "https://m.me/tazumartbd",
    supportPhone: "+8801834800916",
    supportEmail: "support@tazumartbd.com"
  };

  app.get('/api/admin/connectivity', (req, res) => res.json(connectivitySettings));
  app.put('/api/admin/connectivity', (req, res) => {
    connectivitySettings = { ...connectivitySettings, ...req.body };
    res.json(connectivitySettings);
  });

  // --- Live Chat Endpoints ---
  let liveChatMessages: any[] = [];
  app.get('/api/live-chat/messages', (req, res) => {
    const { userId } = req.query;
    const messages = liveChatMessages.filter(m => m.userId === userId || m.recipientId === userId);
    res.json(messages);
  });

  app.post('/api/live-chat/send', (req, res) => {
    const message = {
      id: `msg-${Date.now()}`,
      ...req.body,
      timestamp: new Date().toISOString(),
      status: 'Sent'
    };
    liveChatMessages.push(message);
    res.json(message);
  });

  // --- Offer System Endpoints ---
  // Auto-expiry logic
  setInterval(() => {
    const now = new Date();
    let changed = false;
    offers.forEach(o => {
      const startDate = new Date(o.startDate);
      const endDate = new Date(o.endDate);
      
      if (o.status === 'Active' && endDate < now) {
        o.status = 'Expired';
        changed = true;
      } else if (o.status === 'Inactive' && startDate <= now && endDate >= now) {
        // Optional: Auto-activate if it was inactive but now in range
        // o.status = 'Active';
        // changed = true;
      }
    });
    if (changed) {
      console.log('Auto-updated offer statuses based on expiry');
    }
  }, 60000); // Check every minute

  app.get('/api/offers', (req, res) => {
    res.json(offers);
  });

  app.get('/api/offers/active', (req, res) => {
    const now = new Date();
    const activeOffers = offers.filter(o => 
      o.status === 'Active' && 
      new Date(o.startDate) <= now && 
      new Date(o.endDate) >= now
    );
    res.json(activeOffers);
  });

  app.post('/api/offers', (req, res) => {
    const offer = {
      ...req.body,
      id: `off-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    offers.push(offer);
    res.json(offer);
  });

  app.put('/api/offers/:id', (req, res) => {
    const { id } = req.params;
    const index = offers.findIndex(o => o.id === id);
    if (index !== -1) {
      offers[index] = { ...offers[index], ...req.body, updatedAt: new Date().toISOString() };
      res.json(offers[index]);
    } else {
      res.status(404).json({ error: 'Offer not found' });
    }
  });

  app.delete('/api/offers/:id', (req, res) => {
    const { id } = req.params;
    offers = offers.filter(o => o.id !== id);
    res.json({ success: true });
  });

  app.post('/api/offers/:id/view', (req, res) => {
    const { id } = req.params;
    const offer = offers.find(o => o.id === id);
    if (offer) {
      offer.views = (offer.views || 0) + 1;
      res.json({ success: true, views: offer.views });
    } else {
      res.status(404).json({ error: 'Offer not found' });
    }
  });

  app.post('/api/offers/:id/click', (req, res) => {
    const { id } = req.params;
    const offer = offers.find(o => o.id === id);
    if (offer) {
      offer.clicks = (offer.clicks || 0) + 1;
      res.json({ success: true, clicks: offer.clicks });
    } else {
      res.status(404).json({ error: 'Offer not found' });
    }
  });

  app.get('/api/offers/settings', (req, res) => {
    res.json(offerSettings);
  });

  app.put('/api/offers/settings', (req, res) => {
    offerSettings = { ...offerSettings, ...req.body };
    res.json(offerSettings);
  });

  // --- Variations API ---
  app.get('/api/products/:id/variations', (req, res) => {
    const variations = productVariations.filter(v => v.productId === req.params.id);
    res.json(variations);
  });

  app.post('/api/products/:id/variations', (req, res) => {
    const productId = req.params.id;
    const variation = {
      ...req.body,
      id: `v-${Date.now()}`,
      productId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    productVariations.push(variation);
    res.json({ success: true, variation });
  });

  // --- Likes & Shares API ---
  app.post('/api/products/:id/like', (req, res) => {
    const productId = req.params.id;
    const ipAddress = req.ip;
    
    // Prevent duplicate like
    const existing = productLikes.find(l => l.productId === productId && l.ipAddress === ipAddress);
    if (existing) {
      return res.status(400).json({ message: 'Already liked' });
    }
    
    const like = {
      id: `l-${Date.now()}`,
      productId,
      ipAddress,
      createdAt: new Date().toISOString()
    };
    productLikes.push(like);
    
    // Update product like count
    const product = products.find(p => p.id === productId);
    if (product) {
      product.likeCount = (product.likeCount || 0) + 1;
    }
    
    res.json({ success: true, likeCount: product?.likeCount || 0 });
  });

  app.get('/api/products/:id/likes', (req, res) => {
    const count = productLikes.filter(l => l.productId === req.params.id).length;
    res.json({ count });
  });

  app.post('/api/products/:id/share', (req, res) => {
    const productId = req.params.id;
    const { platform } = req.body;
    const ipAddress = req.ip;
    
    const share = {
      id: `s-${Date.now()}`,
      productId,
      platform,
      ipAddress,
      createdAt: new Date().toISOString()
    };
    productShares.push(share);
    
    // Update product share count
    const product = products.find(p => p.id === productId);
    if (product) {
      product.shareCount = (product.shareCount || 0) + 1;
    }
    
    res.json({ success: true, shareCount: product?.shareCount || 0 });
  });

  // Admin API: Products
  app.get('/api/admin/products', (req, res) => {
    // Return non-deleted products
    res.json(products.filter(p => !p.deletedAt));
  });

  app.post('/api/admin/products', (req, res) => {
    const newProduct = {
      ...req.body,
      id: `p${Date.now()}`,
      rating: 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.push(newProduct);
    
    // Also add to inventory
    inventory.push({
      id: `inv${Date.now()}`,
      productId: newProduct.id,
      productName: newProduct.name,
      productImage: newProduct.image,
      sku: newProduct.sku,
      currentStock: newProduct.stockQuantity,
      reservedStock: 0,
      availableStock: newProduct.stockQuantity,
      lowStockLimit: newProduct.lowStockLimit,
      status: newProduct.stockQuantity > newProduct.lowStockLimit ? 'In Stock' : (newProduct.stockQuantity > 0 ? 'Low Stock' : 'Out of Stock')
    });

    res.json({ success: true, product: newProduct });
  });

  app.put('/api/admin/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Product not found' });

    const oldProduct = { ...products[index] };
    products[index] = { ...products[index], ...req.body, updatedAt: new Date().toISOString() };
    
    addAuditLog(
      adminUsers[0].id, 
      adminUsers[0].fullName, 
      adminUsers[0].role, 
      'Product Updated', 
      'Products', 
      products[index].id,
      { price: oldProduct.price, stock: oldProduct.stockQuantity },
      { price: products[index].price, stock: products[index].stockQuantity }
    );
    
    // Update inventory as well
    const invIndex = inventory.findIndex(inv => inv.productId === req.params.id);
    if (invIndex !== -1) {
      inventory[invIndex] = {
        ...inventory[invIndex],
        productName: products[index].name,
        productImage: products[index].image,
        sku: products[index].sku,
        currentStock: products[index].stockQuantity,
        availableStock: products[index].stockQuantity - inventory[invIndex].reservedStock,
        lowStockLimit: products[index].lowStockLimit,
        status: products[index].stockQuantity > products[index].lowStockLimit ? 'In Stock' : (products[index].stockQuantity > 0 ? 'Low Stock' : 'Out of Stock')
      };
    }

    res.json({ success: true, product: products[index] });
  });

  app.delete('/api/admin/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Product not found' });

    // Soft delete
    products[index].deletedAt = new Date().toISOString();
    res.json({ success: true });
  });

  // Admin API: Inventory
  app.get('/api/admin/inventory', (req, res) => {
    res.json(inventory);
  });

  app.get('/api/admin/inventory/stats', (req, res) => {
    const stats = {
      totalProducts: products.filter(p => !p.deletedAt).length,
      lowStockProducts: inventory.filter(inv => inv.status === 'Low Stock').length,
      outOfStockProducts: inventory.filter(inv => inv.status === 'Out of Stock').length,
      totalStockValue: products.filter(p => !p.deletedAt).reduce((acc, p) => acc + (p.costPrice || 0) * p.stockQuantity, 0)
    };
    res.json(stats);
  });

  app.put('/api/admin/inventory/:id', (req, res) => {
    const index = inventory.findIndex(inv => inv.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Inventory item not found' });

    const { currentStock } = req.body;
    inventory[index].currentStock = currentStock;
    inventory[index].availableStock = currentStock - inventory[index].reservedStock;
    inventory[index].status = currentStock > inventory[index].lowStockLimit ? 'In Stock' : (currentStock > 0 ? 'Low Stock' : 'Out of Stock');

    // Sync back to product
    const prodIndex = products.findIndex(p => p.id === inventory[index].productId);
    if (prodIndex !== -1) {
      products[prodIndex].stockQuantity = currentStock;
      products[prodIndex].stockStatus = currentStock > 0 ? 'In Stock' : 'Out of Stock';
    }

    res.json({ success: true, inventoryItem: inventory[index] });
  });

  // Admin API: Get Hosting Config
  app.get('/api/admin/hosting/config', (req, res) => {
    // Mask password before sending to frontend
    const config = { ...hostingConfig, dbPassword: '****************' };
    res.json(config);
  });

  // Admin API: Update Hosting Config
  app.post('/api/admin/hosting/config', (req, res) => {
    const newConfig = req.body;
    
    // Simulate encryption for password
    if (newConfig.dbPassword && newConfig.dbPassword !== '****************') {
      newConfig.dbPassword = `ENCRYPTED_${Buffer.from(newConfig.dbPassword).toString('base64')}`;
    } else {
      newConfig.dbPassword = hostingConfig.dbPassword;
    }

    hostingConfig = { ...hostingConfig, ...newConfig, updatedAt: new Date().toISOString() };
    
    // Activity Log
    const logEntry = {
      id: `log-${Date.now()}`,
      action: 'HOSTING_CONFIG_UPDATED',
      changedBy: 'Super Admin',
      timestamp: new Date().toISOString()
    };
    domainLogs.push(logEntry);

    res.json({ success: true, config: { ...hostingConfig, dbPassword: '****************' } });
  });

  // Admin API: Get Hosting Stats
  app.get('/api/admin/hosting/stats', (req, res) => {
    // Simulate dynamic stats
    hostingStats = {
      ...hostingStats,
      cpuUsage: Math.floor(Math.random() * 20) + 5,
      ramUsage: Math.floor(Math.random() * 10) + 40,
      activeConnections: Math.floor(Math.random() * 50) + 100,
      status: hostingConfig.maintenanceMode ? 'Maintenance' : 'Online'
    };
    res.json(hostingStats);
  });

  // Admin API: Hosting Controls
  app.post('/api/admin/hosting/control', (req, res) => {
    const { action, value } = req.body;

    if (action === 'maintenance') {
      hostingConfig.maintenanceMode = value;
      hostingStats.status = value ? 'Maintenance' : 'Online';
    } else if (action === 'debug') {
      hostingConfig.debugMode = value;
    } else if (action === 'restart') {
      hostingStats.lastRestart = new Date().toLocaleString();
      hostingStats.uptime = '0d 0h 0m';
    }

    // Activity Log
    const logEntry = {
      id: `log-${Date.now()}`,
      action: `HOSTING_${action.toUpperCase()}_${value !== undefined ? (value ? 'ENABLED' : 'DISABLED') : 'TRIGGERED'}`,
      changedBy: 'Super Admin',
      timestamp: new Date().toISOString()
    };
    domainLogs.push(logEntry);

    res.json({ success: true });
  });

  // bKash Payment Routes
  app.post('/api/payment/bkash/create', (req, res) => {
    const { amount, orderId } = req.body;
    if (paymentConfig.paymentMode === 'Manual') {
      res.json({ success: true, mode: 'Manual', number: paymentConfig.bkash.manualNumber });
    } else {
      res.json({ success: true, mode: 'Merchant', gatewayUrl: `/simulated-gateway/bkash?amount=${amount}&orderId=${orderId}` });
    }
  });

  app.post('/api/payment/bkash/execute', (req, res) => res.json({ success: true }));
  app.get('/api/payment/bkash/success', (req, res) => res.send('Payment Success'));
  app.get('/api/payment/bkash/fail', (req, res) => res.send('Payment Failed'));
  app.get('/api/payment/bkash/cancel', (req, res) => res.send('Payment Cancelled'));
  app.post('/api/payment/bkash/ipn', (req, res) => res.json({ success: true }));

  // Nagad Payment Routes
  app.post('/api/payment/nagad/create', (req, res) => {
    const { amount, orderId } = req.body;
    if (paymentConfig.paymentMode === 'Manual') {
      res.json({ success: true, mode: 'Manual', number: paymentConfig.nagad.manualNumber });
    } else {
      res.json({ success: true, mode: 'Merchant', gatewayUrl: `/simulated-gateway/nagad?amount=${amount}&orderId=${orderId}` });
    }
  });

  app.get('/api/payment/nagad/verify', (req, res) => res.json({ success: true }));
  app.get('/api/payment/nagad/success', (req, res) => res.send('Payment Success'));
  app.get('/api/payment/nagad/fail', (req, res) => res.send('Payment Failed'));
  app.get('/api/payment/nagad/cancel', (req, res) => res.send('Payment Cancelled'));
  app.post('/api/payment/nagad/ipn', (req, res) => res.json({ success: true }));

  // Legacy Initiation (for compatibility during transition)
  app.post('/api/payment/bkash/init', (req, res) => {
    const { amount, orderId } = req.body;
    res.json({
      success: true,
      gatewayUrl: `/simulated-gateway/bkash?amount=${amount}&orderId=${orderId}`
    });
  });

  app.post('/api/payment/nagad/init', (req, res) => {
    const { amount, orderId } = req.body;
    res.json({
      success: true,
      gatewayUrl: `/simulated-gateway/nagad?amount=${amount}&orderId=${orderId}`
    });
  });

  // --- AUTH MODULES ---

  app.get('/api/auth/google/url', (req, res) => {
    const host = req.get('host');
    const protocol = req.protocol;
    const redirectUri = `${protocol}://${host}/auth/callback`;
    
    console.log(`[OAuth] Generating Google Auth URL with redirect_uri: ${redirectUri}`);
    
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID || 'MOCK_CLIENT_ID',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account',
      state: 'google_' + Math.random().toString(36).substring(7)
    });
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    res.json({ url: googleAuthUrl });
  });

  app.get('/api/auth/facebook/url', (req, res) => {
    const redirectUri = `${req.protocol}://${req.get('host')}/auth/callback`;
    const params = new URLSearchParams({
      client_id: FACEBOOK_APP_ID || 'MOCK_FB_ID',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'email,public_profile',
      state: 'facebook_' + Math.random().toString(36).substring(7)
    });
    
    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
    res.json({ url: facebookAuthUrl });
  });

  app.get('/api/auth/google/client-id', (req, res) => {
    res.json({ clientId: GOOGLE_CLIENT_ID });
  });

  app.get('/api/auth/facebook/app-id', (req, res) => {
    res.json({ appId: FACEBOOK_APP_ID });
  });

  app.post('/api/auth/google/verify', async (req, res) => {
    const { idToken } = req.body;
    if (!idToken || !GOOGLE_CLIENT_ID) {
      return res.status(400).json({ message: 'Missing token or configuration' });
    }

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      if (!payload) throw new Error('Invalid payload');

      const googleUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      };

      let user = users.find(u => u.email === googleUser.email || u.providerId === googleUser.id);
      
      if (!user) {
        user = {
          id: `u${Date.now()}`,
          fullName: googleUser.name || 'Google User',
          email: googleUser.email || '',
          profileImage: googleUser.picture,
          provider: 'google',
          providerId: googleUser.id,
          role: 'customer',
          rewardPoints: 0,
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        users.push(user);

        // Also create a customer entry
        const newCustomer = {
          id: `c${Date.now()}`,
          userId: user.id,
          customerUniqueId: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
          fullName: user.fullName,
          email: user.email,
          phone: '',
          address: '',
          district: 'Unknown',
          upazila: 'Unknown',
          totalOrders: 0,
          totalPurchase: 0,
          totalPaid: 0,
          totalDue: 0,
          status: 'Active',
          provider: 'google',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };
        customers.push(newCustomer);
      } else {
        user.provider = 'google';
        user.providerId = googleUser.id;
      }

      const { accessToken, refreshToken } = createAuthSession(user, req, res);
      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword, accessToken, refreshToken });
    } catch (err) {
      console.error('Google verification failed:', err);
      res.status(401).json({ message: 'Google verification failed' });
    }
  });

  // AI Chat API
  app.get('/api/admin/ai-chat/settings', (req, res) => {
    res.json(aiChatSettings);
  });

  app.post('/api/admin/ai-chat/settings', (req, res) => {
    aiChatSettings = { ...aiChatSettings, ...req.body };
    res.json({ success: true, settings: aiChatSettings });
  });

  // --- AI Installation & Modules Endpoints ---
  app.get('/api/ai/installation', (req, res) => {
    res.json(aiInstallation);
  });

  app.post('/api/ai/install', (req, res) => {
    aiInstallation.isInstalled = true;
    aiInstallation.installedAt = new Date().toISOString();
    
    // Create a backup log
    backups.unshift({
      id: `bak-${Date.now()}`,
      filename: `ai_pre_install_backup_${new Date().toISOString().split('T')[0]}.sql`,
      size: 1024 * 1024 * 8,
      type: 'Auto',
      status: 'Success',
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, installation: aiInstallation });
  });

  app.get('/api/ai/features', (req, res) => {
    res.json(aiFeatures);
  });

  app.post('/api/ai/features/toggle', (req, res) => {
    const { featureId, isEnabled } = req.body;
    if (aiFeatures.hasOwnProperty(featureId)) {
      (aiFeatures as any)[featureId] = isEnabled;
      res.json({ success: true, features: aiFeatures });
    } else {
      res.status(400).json({ error: 'Invalid feature ID' });
    }
  });

  app.get('/api/ai/dashboard/stats', (req, res) => {
    res.json({
      visitors: 12840,
      activeCustomers: 842,
      suspiciousUsers: 14,
      recommendedProducts: 450,
      chatConversations: 1240,
      seoScore: 84,
      performance: 98,
      accuracy: 99.2
    });
  });

  app.get('/api/ai/security/logs', (req, res) => {
    res.json(aiSecurityLogs);
  });

  app.post('/api/ai/generate-content', async (req, res) => {
    const { type, prompt } = req.body;
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: `Generate a professional ${type} for an e-commerce product based on this: ${prompt}. Return only the generated text.` }] }],
      });
      res.json({ result: response.text });
    } catch (error) {
      console.error('AI Content Generation Error:', error);
      res.status(500).json({ error: 'Failed to generate content' });
    }
  });

  app.post('/api/ai/analyze-seo', async (req, res) => {
    const { content } = req.body;
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: `Analyze this content for SEO and provide 3 keyword suggestions and a meta description. Content: ${content}. Return JSON format with keys: keywords (array), metaDescription (string).` }] }],
        config: { responseMimeType: "application/json" }
      });
      res.json(JSON.parse(response.text));
    } catch (error) {
      console.error('AI SEO Analysis Error:', error);
      res.status(500).json({ error: 'Failed to analyze SEO' });
    }
  });

  app.post('/api/ai/analyze-reviews', async (req, res) => {
    const { reviews } = req.body;
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: `Analyze these customer reviews and provide a sentiment summary and key takeaways. Reviews: ${JSON.stringify(reviews)}. Return JSON format with keys: summary (string), sentiment (string), takeaways (array).` }] }],
        config: { responseMimeType: "application/json" }
      });
      res.json(JSON.parse(response.text));
    } catch (error) {
      console.error('AI Review Analysis Error:', error);
      res.status(500).json({ error: 'Failed to analyze reviews' });
    }
  });

  app.get('/api/admin/ai-chat/history', (req, res) => {
    res.json(chatHistory);
  });

  app.post('/api/ai/chat', async (req, res) => {
    const { message, history = [] } = req.body;

    if (!aiChatSettings.isEnabled) {
      return res.status(503).json({ error: 'AI Chat is currently disabled.' });
    }

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const productContext = MOCK_PRODUCTS.map(p => ({
        name: p.name,
        price: p.price,
        stock: p.stockQuantity > 0 ? 'Available' : 'Out of Stock',
        description: p.description,
        category: p.category
      }));

      const systemInstruction = `
        You are the official AI assistant for TAZU MART BD, a leading e-commerce platform in Bangladesh.
        Your goal is to help customers with product inquiries, order status, and general support.
        
        Product Database Context:
        ${JSON.stringify(productContext)}
        
        Delivery Information:
        - Inside Dhaka: ${aiChatSettings.deliveryInfo.dhaka}
        - Outside Dhaka: ${aiChatSettings.deliveryInfo.outsideDhaka}
        
        Policies:
        - Refund: 7-day easy return policy for defective products.
        - Payment: We accept bKash, Nagad, and Cash on Delivery (COD).
        
        Guidelines:
        - Be professional, helpful, and concise.
        - If a customer asks about a product, provide its price and availability.
        - If you cannot answer a question accurately, suggest connecting with a human agent.
        - Use Taka (৳) for prices.
        - Always mention if a product is in stock or out of stock.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: systemInstruction }] },
          ...history.map((h: any) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
      });

      const aiResponse = response.text;
      
      // Store in history
      const chatEntry = {
        id: `chat-${Date.now()}`,
        userMessage: message,
        aiResponse: aiResponse,
        timestamp: new Date().toISOString()
      };
      chatHistory.push(chatEntry);

      res.json({ response: aiResponse });
    } catch (error) {
      console.error('AI Chat Error:', error);
      res.status(500).json({ error: 'Failed to process AI chat request.' });
    }
  });

  app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
    const { code, state } = req.query;
    
    if (!code) {
      return res.send(`
        <html>
          <body>
            <script>
              window.close();
            </script>
            <p>Authentication failed. No code received.</p>
          </body>
        </html>
      `);
    }

    try {
      let userData: any = null;
      let provider: LoginProvider = 'manual';

      if (state?.toString().startsWith('google_')) {
        provider = 'google';
        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code: code.toString(),
            client_id: GOOGLE_CLIENT_ID || '',
            client_secret: GOOGLE_CLIENT_SECRET || '',
            redirect_uri: `${req.protocol}://${req.get('host')}/auth/callback`,
            grant_type: 'authorization_code'
          })
        });
        const tokens = await tokenResponse.json();
        
        if (!tokens.access_token) throw new Error('Failed to get Google access token');

        // Fetch user info
        const userRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
          headers: { Authorization: `Bearer ${tokens.access_token}` }
        });
        const googleUser = await userRes.json();
        userData = {
          id: googleUser.sub,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture
        };
      } else if (state?.toString().startsWith('facebook_')) {
        provider = 'facebook';
        // Exchange code for tokens
        const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code: code.toString(),
            client_id: FACEBOOK_APP_ID || '',
            client_secret: FACEBOOK_APP_SECRET || '',
            redirect_uri: `${req.protocol}://${req.get('host')}/auth/callback`
          })
        });
        const tokens = await tokenResponse.json();

        if (!tokens.access_token) throw new Error('Failed to get Facebook access token');

        // Fetch user profile
        const userRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokens.access_token}`);
        const fbUser = await userRes.json();
        userData = {
          id: fbUser.id,
          email: fbUser.email,
          name: fbUser.name,
          picture: fbUser.picture?.data?.url
        };
      }

      if (userData) {
        let user = users.find(u => u.email === userData.email || u.providerId === userData.id);
        
        if (!user) {
          user = {
            id: `u${Date.now()}`,
            fullName: userData.name || `${provider} User`,
            email: userData.email || '',
            profileImage: userData.picture,
            provider: provider,
            providerId: userData.id,
            role: 'customer',
            rewardPoints: 0,
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          users.push(user);

          // Create customer entry
          const newCustomer = {
            id: `c${Date.now()}`,
            userId: user.id,
            customerUniqueId: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
            fullName: user.fullName,
            email: user.email,
            phone: '',
            address: '',
            district: 'Unknown',
            upazila: 'Unknown',
            totalOrders: 0,
            totalPurchase: 0,
            totalPaid: 0,
            totalDue: 0,
            status: 'Active',
            provider: provider,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          };
          customers.push(newCustomer);
        } else {
          user.provider = provider;
          user.providerId = userData.id;
          user.lastLoginAt = new Date().toISOString();
        }

        // Create session
        const { accessToken } = createAuthSession(user, req, res);

        res.send(`
          <html>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ 
                    type: 'OAUTH_AUTH_SUCCESS', 
                    user: ${JSON.stringify(user)},
                    accessToken: '${accessToken}'
                  }, '*');
                  window.close();
                } else {
                  window.location.href = '/';
                }
              </script>
              <p>Authentication successful. This window should close automatically.</p>
            </body>
          </html>
        `);
      } else {
        throw new Error('Failed to retrieve user data');
      }
    } catch (err) {
      console.error('OAuth callback error:', err);
      res.send(`
        <html>
          <body>
            <script>
              setTimeout(() => window.close(), 3000);
            </script>
            <p>Authentication failed. Please try again.</p>
          </body>
        </html>
      `);
    }
  });

  // Helper to create session and tokens
  const createAuthSession = (user: any, req: any, res: any) => {
    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    const session = {
      id: `sess-${Date.now()}`,
      userId: user.id,
      deviceInfo: req.headers['user-agent'] || 'Unknown',
      ipAddress: req.ip || 'Unknown',
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    };
    
    sessions.push(session);
    
    // Set cookies
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000
    });
    
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    user.lastLoginAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();

    loginLogs.unshift({
      id: `log-${Date.now()}`,
      userId: user.id,
      loginMethod: user.provider,
      ipAddress: req.ip,
      deviceType: req.headers['user-agent']?.includes('Mobile') ? 'Mobile' : 'Desktop',
      loginTime: user.lastLoginAt
    });

    return { accessToken, refreshToken, session };
  };

  app.get('/api/auth/me', (req, res) => {
    const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = users.find(u => u.id === decoded.id);
      if (!user) return res.status(401).json({ error: 'User not found' });

      const { passwordHash, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) {
      sessions = sessions.filter(s => s.refreshToken !== refreshToken);
    }
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    res.json({ success: true });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const ip = req.ip || 'unknown';
    
    // Dual login logic: check if input is email or mobile
    const isEmail = email.includes('@');
    
    const user = users.find(u => {
      if (isEmail) {
        return u.email === email || u.admin_email === email;
      } else {
        return u.phone === email || u.admin_mobile === email;
      }
    });
    
    if (user && user.passwordHash && user.provider === 'manual') {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (isMatch) {
        // Reset login attempts on success
        delete loginAttempts[ip];
        
        const { accessToken, refreshToken } = createAuthSession(user, req, res);
        const { passwordHash, ...userWithoutPassword } = user;
        return res.json({ success: true, user: userWithoutPassword, accessToken, refreshToken });
      }
    }
    
    // Track failed attempt
    const now = Date.now();
    if (!loginAttempts[ip]) {
      loginAttempts[ip] = { count: 1, lockUntil: 0 };
    } else {
      loginAttempts[ip].count++;
      if (loginAttempts[ip].count >= 5) {
        loginAttempts[ip].lockUntil = now + 300000; // 5 minute lock
      }
    }
    
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  });

  // --- Auth Endpoints ---

  app.post('/api/auth/facebook', async (req, res) => {
    const { accessToken: fbAccessToken } = req.body;
    try {
      // Verify with Facebook Graph API
      const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${fbAccessToken}`);
      const fbUser = await response.json();
      
      if (fbUser.error) {
        throw new Error(fbUser.error.message);
      }

      let user = users.find(u => u.email === fbUser.email);
      if (!user) {
        user = {
          id: `u${Date.now()}`,
          fullName: fbUser.name,
          email: fbUser.email || `${fbUser.id}@facebook.com`,
          profileImage: fbUser.picture?.data?.url || 'https://picsum.photos/seed/fb/200/200',
          provider: 'facebook',
          providerId: fbUser.id,
          role: 'customer',
          rewardPoints: 0,
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        users.push(user);
      } else {
        user.provider = 'facebook';
        user.providerId = fbUser.id;
      }

      const { accessToken, refreshToken } = createAuthSession(user, req, res);
      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword, accessToken, refreshToken });
    } catch (error) {
      console.error('Facebook Auth Error:', error);
      res.status(401).json({ success: false, message: 'Facebook authentication failed' });
    }
  });

  app.post('/api/auth/refresh', async (req, res) => {
    const refreshToken = req.cookies.refresh_token || req.body.refreshToken;
    if (!refreshToken) return res.status(401).json({ success: false });

    try {
      const decoded: any = jwt.verify(refreshToken, JWT_SECRET);
      const user = users.find(u => u.id === decoded.id);
      if (!user) return res.status(401).json({ success: false });

      const { accessToken, refreshToken: newRefreshToken } = createAuthSession(user, req, res);
      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword, accessToken, refreshToken: newRefreshToken });
    } catch (error) {
      res.status(401).json({ success: false });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    const { fullName, email, password, phone, address } = req.body;
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    if (users.find(u => u.phone === phone)) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `u${Date.now()}`,
      fullName,
      email,
      phone,
      address,
      passwordHash,
      provider: 'manual',
      role: 'customer',
      rewardPoints: 0,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    
    users.push(newUser);

    // Also create a customer entry
    const newCustomer = {
      id: `c${Date.now()}`,
      userId: newUser.id,
      customerUniqueId: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
      district: 'Dhaka', // Default
      upazila: 'Gulshan', // Default
      totalOrders: 0,
      totalPurchase: 0,
      totalPaid: 0,
      totalDue: 0,
      status: 'Active',
      provider: 'manual',
      createdAt: newUser.createdAt,
      updatedAt: newUser.createdAt
    };
    customers.push(newCustomer);

    loginLogs.unshift({
      id: `log-${Date.now()}`,
      userId: newUser.id,
      loginMethod: 'manual',
      ipAddress: req.ip,
      deviceType: req.headers['user-agent']?.includes('Mobile') ? 'Mobile' : 'Desktop',
      loginTime: newUser.lastLoginAt
    });
    
    const { accessToken, refreshToken } = createAuthSession(newUser, req, res);
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    res.json({ success: true, user: userWithoutPassword, accessToken, refreshToken });
  });

  // User Settings & Notifications
  app.get('/api/settings/notifications/:userId', (req, res) => {
    const settings = userNotificationSettings.find(s => s.userId === req.params.userId);
    if (!settings) {
      const newSettings = {
        userId: req.params.userId,
        promotions: true,
        orders: true,
        activities: true,
        sellerPromo: true,
        chat: true,
        email: true,
        sms: true,
        whatsapp: true
      };
      userNotificationSettings.push(newSettings);
      return res.json(newSettings);
    }
    res.json(settings);
  });

  app.post('/api/settings/notifications', (req, res) => {
    const { userId, ...updates } = req.body;
    const index = userNotificationSettings.findIndex(s => s.userId === userId);
    if (index !== -1) {
      userNotificationSettings[index] = { ...userNotificationSettings[index], ...updates };
      res.json({ success: true, settings: userNotificationSettings[index] });
    } else {
      const newSettings = { userId, ...updates };
      userNotificationSettings.push(newSettings);
      res.json({ success: true, settings: newSettings });
    }
  });

  // Policies
  app.get('/api/policies', (req, res) => res.json(policies));
  app.get('/api/policies/:type', (req, res) => {
    const policy = policies.find(p => p.policyType === req.params.type);
    if (!policy) return res.status(404).json({ message: 'Policy not found' });
    res.json(policy);
  });
  app.post('/api/policies', (req, res) => {
    const { id, ...updates } = req.body;
    const index = policies.findIndex(p => p.id === id);
    if (index !== -1) {
      policies[index] = { ...policies[index], ...updates, lastUpdated: new Date().toISOString() };
      res.json({ success: true, policy: policies[index] });
    } else {
      const newPolicy = { id: `pol${Date.now()}`, ...updates, lastUpdated: new Date().toISOString() };
      policies.push(newPolicy);
      res.json({ success: true, policy: newPolicy });
    }
  });

  // Help Center
  app.get('/api/help/categories', (req, res) => res.json(faqCategories));
  app.get('/api/help/faqs', (req, res) => res.json(helpFAQs));
  app.get('/api/help/faqs/search', (req, res) => {
    const q = (req.query.q as string || '').toLowerCase();
    const results = helpFAQs.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
    res.json(results);
  });

  app.get('/api/help/tickets/:userId', (req, res) => {
    const tickets = supportTickets.filter(t => t.userId === req.params.userId);
    res.json(tickets);
  });

  app.post('/api/help/tickets', (req, res) => {
    const newTicket = {
      id: `tkt${Date.now()}`,
      ...req.body,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    supportTickets.unshift(newTicket);
    res.json({ success: true, ticket: newTicket });
  });

  app.get('/api/help/tickets/:ticketId/messages', (req, res) => {
    const messages = ticketMessages.filter(m => m.ticketId === req.params.ticketId);
    res.json(messages);
  });

  app.post('/api/help/tickets/messages', (req, res) => {
    const newMessage = {
      id: `msg${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    ticketMessages.push(newMessage);
    
    // Update ticket status if admin replied
    const ticket = supportTickets.find(t => t.id === req.body.ticketId);
    if (ticket) {
      ticket.status = req.body.senderRole === 'admin' ? 'Replied' : 'Pending';
      ticket.updatedAt = new Date().toISOString();
    }
    
    res.json({ success: true, message: newMessage });
  });

  // Feedback & Reports
  app.post('/api/feedback/error-report', (req, res) => {
    const newReport = {
      id: `err${Date.now()}`,
      ...req.body,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    pageErrorReports.unshift(newReport);
    res.json({ success: true, report: newReport });
  });

  app.post('/api/feedback/suggestion', (req, res) => {
    const newSuggestion = {
      id: `sug${Date.now()}`,
      ...req.body,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    customerSuggestions.unshift(newSuggestion);
    res.json({ success: true, suggestion: newSuggestion });
  });

  // Admin Feedback Endpoints
  app.get('/api/admin/error-reports', (req, res) => res.json(pageErrorReports));
  app.get('/api/admin/suggestions', (req, res) => res.json(customerSuggestions));
  
  app.post('/api/admin/error-reports/:id/status', (req, res) => {
    const report = pageErrorReports.find(r => r.id === req.params.id);
    if (report) {
      report.status = req.body.status;
      res.json({ success: true, report });
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  });

  app.post('/api/admin/suggestions/:id/status', (req, res) => {
    const suggestion = customerSuggestions.find(s => s.id === req.params.id);
    if (suggestion) {
      suggestion.status = req.body.status;
      res.json({ success: true, suggestion });
    } else {
      res.status(404).json({ message: 'Suggestion not found' });
    }
  });

  // Reward Endpoints
  app.get('/api/rewards/settings', (req, res) => res.json(rewardSettings));
  app.post('/api/rewards/settings', (req, res) => {
    rewardSettings = { ...rewardSettings, ...req.body };
    res.json({ success: true, settings: rewardSettings });
  });

  app.get('/api/rewards/logs', (req, res) => res.json(rewardLogs));
  
  app.post('/api/rewards/adjust', (req, res) => {
    const { userId, points, actionType, reason } = req.body;
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (actionType === 'Manual' || actionType === 'Earned') {
      user.rewardPoints += points;
      rewardLogs.unshift({
        id: `rl${Date.now()}`,
        userId,
        userName: user.fullName,
        pointsAdded: points,
        pointsDeducted: 0,
        actionType,
        reason,
        dateTime: new Date().toISOString()
      });
    } else {
      user.rewardPoints -= points;
      rewardLogs.unshift({
        id: `rl${Date.now()}`,
        userId,
        userName: user.fullName,
        pointsAdded: 0,
        pointsDeducted: points,
        actionType,
        reason,
        dateTime: new Date().toISOString()
      });
    }
    res.json({ success: true, rewardPoints: user.rewardPoints });
  });

  app.get('/api/rewards/analytics', (req, res) => {
    const totalIssued = rewardLogs.reduce((acc, log) => acc + log.pointsAdded, 0);
    const totalRedeemed = rewardLogs.reduce((acc, log) => acc + log.pointsDeducted, 0);
    const activeUsersWithPoints = users.filter(u => u.rewardPoints > 0).length;
    res.json({
      totalIssued,
      totalRedeemed,
      activeUsersWithPoints,
      expiredPoints: 0
    });
  });

  // Lucky Draw Endpoints
  app.get('/api/campaigns/lucky-draw', (req, res) => res.json(luckyDrawCampaign));
  app.post('/api/campaigns/lucky-draw/settings', (req, res) => {
    luckyDrawCampaign = { ...luckyDrawCampaign, ...req.body };
    res.json({ success: true, campaign: luckyDrawCampaign });
  });

  app.post('/api/campaigns/lucky-draw/spin', (req, res) => {
    const { userId } = req.body;
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check daily limit
    const today = new Date().toISOString().split('T')[0];
    const userSpinsToday = luckyDrawLogs.filter(log => log.userId === userId && log.dateTime.startsWith(today)).length;
    if (userSpinsToday >= luckyDrawCampaign.dailyAttemptLimit) {
      return res.status(400).json({ message: 'Daily limit reached' });
    }

    // Spin logic
    const rand = Math.random();
    let cumulative = 0;
    let wonPrize = luckyDrawCampaign.prizes[luckyDrawCampaign.prizes.length - 1]; // Default to last (Better Luck)

    for (const prize of luckyDrawCampaign.prizes) {
      cumulative += prize.probability;
      if (rand <= cumulative && prize.stock > 0) {
        wonPrize = prize;
        prize.stock--;
        break;
      }
    }

    // If won points, add them
    if (wonPrize.id === 'priz2') {
      user.rewardPoints += 50;
      rewardLogs.unshift({
        id: `rl${Date.now()}`,
        userId,
        userName: user.fullName,
        pointsAdded: 50,
        pointsDeducted: 0,
        actionType: 'Earned',
        reason: 'Lucky Draw Win',
        dateTime: new Date().toISOString()
      });
    }

    luckyDrawLogs.unshift({
      id: `ldl${Date.now()}`,
      userId,
      userName: user.fullName,
      prizeId: wonPrize.id,
      prizeName: wonPrize.name,
      dateTime: new Date().toISOString()
    });

    res.json({ success: true, prize: wonPrize });
  });

  app.get('/api/campaigns/lucky-draw/logs', (req, res) => res.json(luckyDrawLogs));

  // Cart Endpoints
  // --- Wishlist Endpoints ---
  app.get('/api/wishlist/:userId', (req, res) => {
    const wishlist = wishlists.find(w => w.userId === req.params.userId);
    res.json(wishlist || { userId: req.params.userId, items: [] });
  });

  app.post('/api/wishlist', (req, res) => {
    const { userId, productId } = req.body;
    let wishlist = wishlists.find(w => w.userId === userId);
    if (!wishlist) {
      wishlist = { userId, items: [] };
      wishlists.push(wishlist);
    }
    if (!wishlist.items.includes(productId)) {
      wishlist.items.push(productId);
    }
    res.json({ success: true, wishlist });
  });

  app.delete('/api/wishlist/:userId/:productId', (req, res) => {
    const { userId, productId } = req.params;
    const wishlist = wishlists.find(w => w.userId === userId);
    if (wishlist) {
      wishlist.items = wishlist.items.filter(id => id !== productId);
    }
    res.json({ success: true });
  });

  app.get('/api/cart/:userId', (req, res) => {
    const cart = carts.find(c => c.userId === req.params.userId);
    res.json(cart || { userId: req.params.userId, items: [] });
  });

  app.post('/api/cart', (req, res) => {
    const { userId, items } = req.body;
    let cart = carts.find(c => c.userId === userId);
    if (cart) {
      cart.items = items;
      cart.lastActivity = new Date().toISOString();
      cart.isAbandoned = false;
    } else {
      cart = {
        id: `cart${Date.now()}`,
        userId,
        items,
        lastActivity: new Date().toISOString(),
        isAbandoned: false
      };
      carts.push(cart);
    }
    res.json({ success: true, cart });
  });

  app.get('/api/admin/carts/active', (req, res) => {
    const now = Date.now();
    const activeCarts = carts.filter(c => (now - new Date(c.lastActivity).getTime()) < 30 * 60 * 1000);
    res.json(activeCarts);
  });

  app.get('/api/admin/carts/abandoned', (req, res) => {
    const now = Date.now();
    const abandonedCarts = carts.filter(c => (now - new Date(c.lastActivity).getTime()) >= 30 * 60 * 1000);
    res.json(abandonedCarts);
  });

  // Order Status Update with Reward Logic
  app.post('/api/admin/orders/:id/status', (req, res) => {
    const { status } = req.body;
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const oldStatus = order.status;
    order.status = status;

    // Reward Logic: 1 Point per 100 currency spent
    // Points added ONLY when order status = Delivered
    if (status === 'Delivered' && oldStatus !== 'Delivered') {
      const user = users.find(u => u.phone === order.customerPhone || u.email === order.customerEmail);
      if (user) {
        const points = Math.floor(order.amount / rewardSettings.pointsPerCurrencyRatio);
        user.rewardPoints += points;
        rewardLogs.unshift({
          id: `rl${Date.now()}`,
          userId: user.id,
          userName: user.fullName,
          orderId: order.id,
          pointsAdded: points,
          pointsDeducted: 0,
          actionType: 'Earned',
          reason: `Order ${order.id} Delivered`,
          dateTime: new Date().toISOString()
        });
      }
    }

    // Cancellation Rule: If points already added -> auto deduct
    if ((status === 'Cancelled' || status === 'Returned') && oldStatus === 'Delivered') {
      const user = users.find(u => u.phone === order.customerPhone || u.email === order.customerEmail);
      if (user) {
        const points = Math.floor(order.amount / rewardSettings.pointsPerCurrencyRatio);
        user.rewardPoints -= points;
        rewardLogs.unshift({
          id: `rl${Date.now()}`,
          userId: user.id,
          userName: user.fullName,
          orderId: order.id,
          pointsAdded: 0,
          pointsDeducted: points,
          actionType: 'Deducted',
          reason: `Order ${order.id} ${status}`,
          dateTime: new Date().toISOString()
        });
      }
    }

    res.json({ success: true, order });
  });

  let helpCategories: any[] = [
    { id: '1', name: 'Order & Delivery', icon: 'Truck' },
    { id: '2', name: 'Payment Issues', icon: 'CreditCard' },
    { id: '3', name: 'Return & Refund', icon: 'RotateCcw' },
    { id: '4', name: 'Account Problems', icon: 'User' },
    { id: '5', name: 'Seller / Product Issues', icon: 'ShoppingBag' }
  ];

  let helpArticles: any[] = [
    { id: '1', categoryId: '1', title: 'How to place order', content: 'To place an order, browse our products, add them to your cart, and proceed to checkout. Fill in your delivery details and choose a payment method.' },
    { id: '2', categoryId: '1', title: 'How to cancel order', content: 'You can cancel your order from the "My Orders" section within 30 minutes of placing it. After that, please contact customer support.' },
    { id: '3', categoryId: '1', title: 'How to track order', content: 'Once your order is shipped, you will receive a tracking number via SMS and email. You can also track it from the "My Orders" page.' },
    { id: '4', categoryId: '2', title: 'Payment methods', content: 'We support bKash, Nagad, Credit/Debit Cards, and Cash on Delivery.' }
  ];

  let userReviews: any[] = [
    { id: '1', userId: '1', productId: '1', productName: 'Premium Wireless Headphones', image: 'https://picsum.photos/seed/headphones/100/100', rating: 5, comment: 'Amazing sound quality!', status: 'reviewed', date: '2024-03-01' },
    { id: '2', userId: '1', productId: '2', productName: 'Smart Watch Series 7', image: 'https://picsum.photos/seed/watch/100/100', rating: 0, comment: '', status: 'pending', date: '2024-03-05' }
  ];

  let paymentMethods: any[] = [
    { id: '1', userId: '1', type: 'card', provider: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
    { id: '2', userId: '1', type: 'mobile', provider: 'bKash', number: '017XXXXX123', isDefault: false }
  ];

  // --- HELP CENTER API ---
  app.get('/api/help/categories', (req, res) => res.json(helpCategories));
  app.get('/api/help/faqs', (req, res) => res.json(helpArticles.map(a => ({ id: a.id, question: a.title, answer: a.content, isTopQuestion: true }))));
  app.get('/api/help/articles/:categoryId', (req, res) => {
    const { categoryId } = req.params;
    res.json(helpArticles.filter(a => a.categoryId === categoryId));
  });

  // --- REVIEWS API ---
  app.get('/api/reviews/:userId', (req, res) => {
    const { userId } = req.params;
    res.json(userReviews.filter(r => r.userId === userId));
  });
  app.post('/api/reviews', (req, res) => {
    const review = { id: Date.now().toString(), ...req.body, status: 'reviewed', date: new Date().toISOString().split('T')[0] };
    userReviews.push(review);
    res.json(review);
  });
  app.delete('/api/reviews/:id', (req, res) => {
    userReviews = userReviews.filter(r => r.id !== req.params.id);
    res.json({ success: true });
  });

  // --- PAYMENT METHODS API ---
  app.get('/api/payment-methods/:userId', (req, res) => {
    const { userId } = req.params;
    res.json(paymentMethods.filter(p => p.userId === userId));
  });
  app.post('/api/payment-methods', (req, res) => {
    const method = { id: Date.now().toString(), ...req.body };
    paymentMethods.push(method);
    res.json(method);
  });
  app.delete('/api/payment-methods/:id', (req, res) => {
    paymentMethods = paymentMethods.filter(p => p.id !== req.params.id);
    res.json({ success: true });
  });

  // --- TAZU GAMES API ---
  app.get('/api/games/prizes', (req, res) => res.json(gamePrizes));
  app.get('/api/games/quiz/daily', (req, res) => {
    const quiz = dailyQuizzes[Math.floor(Math.random() * dailyQuizzes.length)];
    res.json(quiz);
  });
  app.post('/api/games/spin', (req, res) => {
    const { userId } = req.body;
    const prize = gamePrizes[Math.floor(Math.random() * gamePrizes.length)];
    res.json({ success: true, prize });
  });

  // --- PICKUP POINTS API ---
  app.get('/api/pickup-points', (req, res) => res.json(pickupPoints));

  // --- AFFILIATE API ---
  app.get('/api/affiliate/dashboard/:userId', (req, res) => {
    const { userId } = req.params;
    let affiliate = affiliates.find(a => a.userId === userId);
    if (!affiliate) {
      affiliate = { userId, referralCode: `user_${userId}`, totalEarnings: 0, totalJoined: 0, level: 1 };
      affiliates.push(affiliate);
    }
    const commissions = affiliateCommissions.filter(c => c.userId === userId);
    res.json({ affiliate, commissions });
  });
  app.post('/api/affiliate/withdraw', (req, res) => {
    const { userId, amount, method } = req.body;
    const withdrawal = { id: `w-${Date.now()}`, userId, amount, method, status: 'Pending', date: new Date().toISOString() };
    affiliateWithdrawals.push(withdrawal);
    res.json({ success: true, withdrawal });
  });

  // --- END NEW MODULES ---

  // Customer Panel API
  app.get('/api/customer-panel/sections', (req, res) => res.json(customerPanelSections.sort((a, b) => a.positionOrder - b.positionOrder)));
  app.post('/api/customer-panel/sections', (req, res) => {
    const newSection = { ...req.body, id: Math.random().toString(36).substr(2, 9), sectionKey: `custom_${Date.now()}` };
    customerPanelSections.push(newSection);
    res.json(newSection);
  });
  app.put('/api/customer-panel/sections/:id', (req, res) => {
    const { id } = req.params;
    customerPanelSections = customerPanelSections.map(s => s.id === id ? { ...s, ...req.body } : s);
    res.json(customerPanelSections.find(s => s.id === id));
  });
  app.delete('/api/customer-panel/sections/:id', (req, res) => {
    const { id } = req.params;
    customerPanelSections = customerPanelSections.filter(s => s.id !== id);
    res.json({ success: true });
  });

  app.get('/api/customer-panel/analytics', (req, res) => {
    res.json({
      totalUsers: users.length,
      activeUsers: users.filter(u => u.lastLoginAt && new Date(u.lastLoginAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
      totalPointsIssued: rewardLogs.reduce((acc, log) => acc + (log.pointsAdded || 0), 0),
      flashDealParticipation: 1240
    });
  });

  // Branding & Services API
  let homepageVisibility = { ...MOCK_HOMEPAGE_VISIBILITY };

  app.get('/api/homepage/visibility', (req, res) => res.json(homepageVisibility));
  app.put('/api/admin/homepage/visibility', (req, res) => {
    homepageVisibility = { ...homepageVisibility, ...req.body };
    res.json(homepageVisibility);
  });

  app.get('/api/banners', (req, res) => res.json(banners.filter(b => b.isVisible)));
  app.get('/api/banners/promotional', (req, res) => res.json(promotionBanners.filter(b => b.isVisible)));
  app.get('/api/branding', (req, res) => res.json(brandingSettings));
  app.put('/api/branding', (req, res) => {
    brandingSettings = { ...brandingSettings, ...req.body, updatedAt: new Date().toISOString() };
    res.json(brandingSettings);
  });

  app.get('/api/services-config', (req, res) => res.json(servicesConfig));
  app.put('/api/services-config/:id', (req, res) => {
    const { id } = req.params;
    servicesConfig = servicesConfig.map(s => s.id === id ? { ...s, ...req.body } : s);
    res.json(servicesConfig.find(s => s.id === id));
  });

  app.get('/api/admin/login-stats', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    res.json({
      totalUsers: users.length,
      activeUsers: users.filter(u => u.lastLoginAt && u.lastLoginAt.startsWith(today)).length,
      manualLogins: loginLogs.filter(l => l.loginMethod === 'manual').length,
      googleLogins: loginLogs.filter(l => l.loginMethod === 'google').length,
      facebookLogins: loginLogs.filter(l => l.loginMethod === 'facebook').length,
      newSignupsToday: users.filter(u => u.createdAt && u.createdAt.startsWith(today)).length
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
