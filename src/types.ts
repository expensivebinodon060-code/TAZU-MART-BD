export interface Domain {
  id: string;
  domainName: string;
  domainType: 'Primary' | 'Addon' | 'Subdomain' | 'Parked';
  serverIp: string;
  ns1: string;
  ns2: string;
  ns3?: string;
  sslEnabled: boolean;
  sslType: 'LetsEncrypt' | 'Custom' | 'Cloudflare';
  sslCertificate?: string;
  sslPrivateKey?: string; // Encrypted
  caBundle?: string;
  forceHttps: boolean;
  hstsEnabled: boolean;
  maintenanceMode: boolean;
  redirectUrl?: string;
  redirectType?: '301' | '302';
  cdnEnabled: boolean;
  emailEnabled: boolean;
  wwwPreference: 'Auto' | 'With' | 'Without';
  status: 'Active' | 'Pending' | 'Error';
  dnsStatus: 'Active' | 'Error' | 'Pending';
  createdAt: string;
  updatedAt: string;
}

export interface DomainLog {
  id: string;
  domainId: string;
  action: string;
  changedBy: string;
  oldValue: any;
  newValue: any;
  timestamp: string;
}

export interface HostingConfig {
  id: string;
  // Basic Info
  providerName: string;
  serverType: 'Shared' | 'VPS' | 'Dedicated' | 'Cloud';
  serverIp: string;
  serverPort: number;
  os: string;
  controlPanel: 'cPanel' | 'Plesk' | 'None';
  
  // App Config
  appName: string;
  environmentMode: 'Production' | 'Staging' | 'Development';
  runtimeType: 'Node.js' | 'PHP' | 'Python';
  runtimeVersion: string;
  appRoot: string;
  publicDir: string;
  
  // Database
  dbType: 'MySQL' | 'PostgreSQL' | 'MongoDB';
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUsername: string;
  dbPassword: string; // Encrypted
  dbSslRequired: boolean;
  
  // Domain & SSL
  primaryDomain: string;
  subdomain?: string;
  sslStatus: 'Active' | 'Expired' | 'Pending';
  forceHttps: boolean;
  
  // Storage
  uploadPath: string;
  maxUploadSize: number;
  filePermission: string;
  backupPath: string;
  
  // Security
  firewallEnabled: boolean;
  sshEnabled: boolean;
  rateLimit: number;
  allowedIps: string[];
  adminIpRestriction: string[];
  
  // Advanced
  cronSetup: string;
  backgroundWorkerEnabled: boolean;
  cacheDriver: 'Redis' | 'File' | 'Memcached';
  queueDriver: string;
  logLevel: 'Error' | 'Warning' | 'Info' | 'Debug';
  
  // Controls
  maintenanceMode: boolean;
  debugMode: boolean;
  
  updatedAt: string;
}

export interface HostingStats {
  cpuUsage: number;
  ramUsage: number;
  storageUsed: number;
  storageTotal: number;
  bandwidthUsage: number;
  activeConnections: number;
  dbSize: number;
  backgroundJobs: number;
  uptime: string;
  lastRestart: string;
  status: 'Online' | 'Offline' | 'Maintenance';
  location: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Delivered' | 'Cancelled' | 'Confirmed' | 'Completed' | 'Returned' | 'Refunded';
export type ProductStatus = 'active' | 'inactive' | 'draft';
export type StockStatus = 'In Stock' | 'Out of Stock' | 'Low Stock';
export type OrderSource = 'website' | 'admin_manual';
export type PaymentStatus = 'pending' | 'partial' | 'paid';

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  productImage?: string;
  customerName: string;
  rating: number;
  title?: string;
  comment: string;
  image?: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  isFeatured?: boolean;
}

export interface Ticket {
  id: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  date: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string;
  status: 'Active' | 'Inactive';
  icon?: string;
  image?: string;
  banner?: string;
  order?: number;
  isVisible?: boolean;
  isFeatured?: boolean;
  showOnHomepage?: boolean;
  showInMenu?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  icon?: string;
  image?: string;
  banner?: string;
  bannerMobile?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
  count?: number;
  order?: number;
  isVisible?: boolean;
  isFeatured?: boolean;
  showOnHomepage?: boolean;
  showInMenu?: boolean;
  startingPrice?: string;
  subCategories?: SubCategory[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface ProductCategory {
  id: string;
  productId: string;
  categoryId: string;
}

export interface ProductVariation {
  id: string;
  productId: string;
  attributeType: 'color' | 'size' | string;
  attributeValue: string;
  colorCode?: string;
  image?: string;
  images?: string[];
  isVisible: boolean;
  isActive: boolean;
  isRequired: boolean;
  stockQuantity: number;
  priceAdjustment: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductLike {
  id: string;
  productId: string;
  userId?: string;
  ipAddress: string;
  createdAt: string;
}

export interface ProductShare {
  id: string;
  productId: string;
  platform: string;
  ipAddress: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  price: number;
  oldPrice?: number;
  regularPrice?: number;
  salePrice?: number;
  costPrice?: number; // Admin only
  image: string;
  galleryImages?: string[];
  category: string; // Keep for backward compatibility
  categoryId: string; // Keep for backward compatibility
  categoryIds?: string[]; // Many-to-many
  description?: string;
  shortDescription?: string;
  tags?: string[];
  sku?: string;
  stockQuantity?: number;
  lowStockLimit?: number;
  manageStock?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSelling?: boolean;
  status: ProductStatus;
  publishStatus?: 'Published' | 'Draft';
  stockStatus: StockStatus;
  rating?: number;
  viewCount?: number;
  likeCount?: number;
  shareCount?: number;
  views: number;
  discount?: string | number;
  fastDelivery?: boolean;
  code?: string;
  featuredOrder?: number;
  brand?: string;
  images?: string[];
  variant?: string;
  variations?: ProductVariation[];
  reviews?: Review[];
  rewardCoins?: number;
  videoUrl?: string;
  condition?: 'New' | 'Used' | 'Refurbished';
  warranty?: string;
  unitName?: string;
  extraDetails?: { title: string; description: string; }[];
  shippingCharges?: { division: string; charge: number; }[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string; // For Soft Delete
  activeOffer?: Offer;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

export type PaymentMethod = 'bKash' | 'Nagad' | 'Cash on Delivery' | 'Bank Transfer';
export type PaymentMode = 'Manual' | 'Merchant' | 'COD';
export type Environment = 'Sandbox' | 'Live';

export interface BkashConfig {
  appKey: string;
  appSecret: string;
  username: string;
  password: string;
  baseUrl: string;
  callbackUrl: string;
  isEnabled: boolean;
  manualNumber: string;
  accountType: 'Personal' | 'Merchant';
  instruction: string;
}

export interface NagadConfig {
  merchantId: string;
  publicKey: string;
  privateKey: string;
  baseUrl: string;
  callbackUrl: string;
  isEnabled: boolean;
  manualNumber: string;
  instruction: string;
}

export interface BankConfig {
  accountName: string;
  accountNumber: string;
  bankName: string;
  branch: string;
  isEnabled: boolean;
}

export interface DNSRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX' | 'SPF' | 'DKIM' | 'DMARC' | 'NS';
  name: string;
  value: string;
  ttl: number;
  status: 'Active' | 'Propagating' | 'Error';
}

export interface DomainEntry {
  id: string;
  name: string;
  isPrimary: boolean;
  isEnabled: boolean;
  wwwEnabled: boolean;
  sslStatus: 'Active' | 'Expired' | 'Pending';
  verificationStatus: 'Verified' | 'Unverified' | 'Pending';
  manualIpOverride?: string;
}

export interface DomainConfig {
  primary: string;
  staging: string;
  backup: string;
  subdomains: string[];
  dnsRecords: DNSRecord[];
  environment: 'Free' | 'Paid';
  domains: DomainEntry[];
  forceHttps: boolean;
}

export interface ServerOverview {
  os: string;
  phpVersion: string;
  dbVersion: string;
  lastRestart: string;
  lastBackup: string;
  healthScore: number;
}

export interface InfrastructureConfig {
  domain: DomainConfig;
  hosting: HostingConfig;
  overview: ServerOverview;
  ssl: {
    expiryDays: number;
    autoRenew: boolean;
    forceHttps: boolean;
    firewallActive: boolean;
  };
  deployment: {
    lastDeploy: string;
    status: 'Idle' | 'Deploying' | 'Success' | 'Failed';
    maintenanceBeforeDeploy: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    cdnActive: boolean;
    imageOptimization: boolean;
    minifyAssets: boolean;
    highTrafficProtection: boolean;
    rateLimitPerIp: number;
    queueEnabled: boolean;
  };
}

export interface PaymentConfig {
  bkash: BkashConfig;
  nagad: NagadConfig;
  bank: BankConfig;
  paymentMode: PaymentMode;
  environment: Environment;
  codEnabled: boolean;
  onlineEnabled: boolean;
  bankEnabled: boolean;
  bkashNumber: string;
  bkashType: 'personal' | 'merchant';
  nagadNumber: string;
  nagadType: 'personal' | 'merchant';
  codMaxAmount: number;
  codMinAmount: number;
  maintenanceMode: boolean;
  highTrafficMode: boolean;
  instruction: string;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
}

export interface FooterSettings {
  logoUrl: string;
  description: string;
  facebookUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  quickLinks: FooterLink[];
  customerServiceLinks: FooterLink[];
  address: string;
  phone: string;
  email: string;
  copyrightText: string;
}

export interface BrandingSettings {
  id: string;
  appName: string;
  shortName: string;
  welcomeText: string;
  coinLabel: string;
  rewardLabel: string;
  gamesLabel: string;
  referralLabel: string;
  primaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  splashLogoUrl: string;
  bottomNavMiddleText: string;
  footer?: FooterSettings;
  updatedAt: string;
}

export interface ServiceConfig {
  id: string;
  key: string;
  label: string;
  icon: string;
  route: string;
  isEnabled: boolean;
  positionOrder: number;
}

export type LoginProvider = 'manual' | 'google' | 'facebook';

export interface CoinRecord {
  id: string;
  userId: string;
  orderId: string;
  productName: string;
  coins: number;
  date: string;
  status: 'Earned' | 'Redeemed';
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  provider: LoginProvider;
  providerId?: string;
  role: 'customer' | 'admin' | 'super-admin';
  rewardPoints: number;
  coins: number;
  coinHistory?: CoinRecord[];
  profileImage?: string;
  address?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  createdAt: string;
}

export interface LoginLog {
  id: string;
  userId: string;
  loginMethod: 'manual' | 'google' | 'facebook';
  ipAddress?: string;
  deviceType?: string;
  loginTime: string;
}

export interface SmartRewardPointsRecord {
  id: string;
  userId: string;
  userName: string;
  orderId?: string;
  pointsAdded: number;
  pointsDeducted: number;
  actionType: 'Earned' | 'Redeemed' | 'Manual' | 'Deducted';
  reason?: string;
  dateTime: string;
}

export interface RewardSettings {
  pointsPerCurrencyRatio: number; // e.g., 1 point per 100 currency
  minRedeemAmount: number;
  expiryDurationDays?: number;
  isEnabled: boolean;
}

export interface LuckyDrawPrize {
  id: string;
  name: string;
  image?: string;
  probability: number; // 0 to 1
  stock: number;
}

export interface LuckyDrawCampaign {
  id: string;
  name: string;
  prizes: LuckyDrawPrize[];
  dailyAttemptLimit: number;
  isEnabled: boolean;
  startDate: string;
  endDate: string;
}

export interface LuckyDrawLog {
  id: string;
  userId: string;
  userName: string;
  prizeId: string;
  prizeName: string;
  dateTime: string;
}

export interface CartRecord {
  id: string;
  userId: string;
  items: CartItem[];
  lastActivity: string;
  isAbandoned: boolean;
}

export interface IncompleteOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  items: OrderItem[];
  cartValue: number;
  checkoutTime: string;
  lastActivity: string;
  status: 'Incomplete Checkout';
}

export interface Order {
  id: string;
  date: string;
  amount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  shippingAddress: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  division?: string;
  district?: string;
  upazila?: string;
  transactionId?: string;
  paymentTime?: string;
  customerNote?: string;
  deliveryCharge: number;
  discount?: number;
  trackingNumber?: string;
  internalNote?: string;
  orderSource: OrderSource;
  courierName?: string;
  courierTrackingId?: string;
  courierStatus?: string;
  courierResponse?: any;
  dispatchedAt?: string;
  coinsAwarded?: boolean;
}

export interface CartItem extends OrderItem {}

export interface CustomerPanelSection {
  id: string;
  sectionKey: string;
  displayName: string;
  isEnabled: boolean;
  positionOrder: number;
  icon?: string;
  redirectUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface InventoryStats {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalStockValue: number;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockLimit: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

// --- Delivery System ---
export interface Courier {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface CourierCredential {
  courierId: string;
  apiBaseUrl: string;
  apiKey: string;
  secretKey: string;
  merchantId: string;
  sandboxMode: boolean;
}

export interface CourierConfig {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  secretKey: string;
  merchantId: string;
  isSandbox: boolean;
  isActive: boolean;
}

export interface DeliveryZone {
  id: string;
  division: string;
  district: string;
  charge: number;
  deliveryTime: string;
  codFee: number;
  freeDeliveryThreshold?: number;
  isActive: boolean;
}

export interface DeliveryLog {
  id: string;
  orderId: string;
  courierName: string;
  trackingId: string;
  status: string;
  timestamp: string;
  message: string;
}

// --- Workshop ---
export type PackagingStatus = 'Pending' | 'Processing' | 'Ready to Ship' | 'Shipped';

export interface HomepageBanner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link: string;
  type: string;
  isVisible: boolean;
  buttonText?: string;
  startDate?: string;
  endDate?: string;
  order?: number;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  type: string;
  isVisible: boolean;
  linkedProducts?: string[];
}

export interface WorkshopOrder extends Order {
  packagingStatus: PackagingStatus;
  assignedCourier?: string;
  labelPrinted: boolean;
  invoicePrinted: boolean;
}

// --- Vendor ---
export interface Vendor {
  id: string;
  vendorId: string; // VND-0001
  name: string;
  companyName: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  upazila?: string;
  nidNumber?: string;
  tradeLicense?: string;
  commissionPercentage: number;
  totalProducts: number;
  totalOrders: number;
  totalEarnings: number; // For marketplace mode
  totalPurchaseAmount: number; // For supplier mode
  totalPaid: number;
  currentDue: number;
  status: 'Active' | 'Inactive' | 'Blocked' | 'Suspended';
  bankInfo?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    routingNumber: string;
  };
  bkashNumber?: string;
  nagadNumber?: string;
  openingBalance: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface VendorPurchase {
  id: string;
  vendorId: string;
  invoiceNumber: string;
  purchaseDate: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    buyingPrice: number;
    subtotal: number;
  }[];
  subtotal: number;
  vat?: number;
  discount?: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: string;
  note?: string;
  createdAt: string;
}

export interface VendorPayment {
  id: string;
  vendorId: string;
  paymentDate: string;
  amount: number;
  method: 'Bank' | 'bKash' | 'Nagad' | 'Cash';
  transactionId?: string;
  note?: string;
  createdAt: string;
}

export interface VendorLedgerEntry {
  id: string;
  vendorId: string;
  date: string;
  reference: string; // Purchase ID or Payment ID
  type: 'Purchase' | 'Payment' | 'Opening Balance';
  debit: number; // Purchase Amount
  credit: number; // Payment Amount
  balance: number; // Running Balance
  note?: string;
}

export interface ExternalCustomerRecord {
  id: string;
  customerId: string;
  courier: string;
  status: string;
  date: string;
  note: string;
}

export interface Customer {
  id: string;
  customerUniqueId: string; // CUST-0001
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  district: string;
  upazila: string;
  totalOrders: number;
  totalPurchase: number;
  totalPaid: number;
  totalDue: number;
  status: 'Active' | 'Blocked';
  lastOrderDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  provider?: LoginProvider;
  role?: 'customer' | 'admin';
  lastLoginAt?: string;
  lastIp?: string;
  lastDevice?: string;
}

export interface CustomerPayment {
  id: string;
  customerId: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  trxId?: string;
  date: string;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  activeCustomers: number;
  totalDueAmount: number;
  newCustomersToday: number;
  newCustomersMonth: number;
  repeatCustomerRate: number;
  averageOrderValue: number;
  lifetimeValue: number;
  customerGrowth: number;
  topBuyers: Customer[];
}

export interface CustomerIntelligence {
  totalOrders: number;
  delivered: number;
  cancelled: number;
  returned: number;
  fraudCount: number;
  successRate: number;
  courierStats: {
    [key: string]: {
      total: number;
      successful: number;
      cancelled: number;
      returned: number;
      successRate: number;
    };
  };
  riskLevel: 'Low' | 'Medium' | 'High';
  externalRecords: ExternalCustomerRecord[];
}

export interface VendorPayout {
  id: string;
  vendorId: string;
  amount: number;
  status: 'Pending' | 'Processed' | 'Rejected';
  method: 'Bank' | 'bKash';
  timestamp: string;
  reference?: string;
}

// --- TAZU MART BD Admin Settings ---

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  isEmailVerified: boolean;
  profileImage?: string;
  roleId: string;
  status: 'Active' | 'Suspended';
  twoFactorEnabled: boolean;
  twoFactorType?: 'Email' | 'SMS' | 'Authenticator';
  lastLogin?: string;
  lastIp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSession {
  id: string;
  adminId: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface BusinessSettings {
  storeName: string;
  logo: string;
  logoLight?: string;
  favicon: string;
  address: string;
  phone: string;
  email: string;
  tradeLicense?: string;
  vatId?: string;
  taxId?: string;
  invoiceConfig: {
    prefix: string;
    footer: string;
    signature?: string;
    autoNumbering: boolean;
    nextNumber: number;
    defaultOrderStatus: OrderStatus;
  };
}

export interface ThemeSettings {
  id: string;
  panelType: 'admin' | 'customer' | 'frontend';
  themeName: string;
  isPublished: boolean;
  activeMood: 'Corporate' | 'Luxury' | 'Minimal' | 'Festive' | 'Flash Sale' | 'Ramadan' | 'Night' | 'High Contrast' | 'Custom';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    sectionBg: string;
    cardBg: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    sidebarBg: string;
    topbarBg: string;
    hover: string;
    active: string;
    // Text Colors
    textHeading: string;
    textParagraph: string;
    textMenu: string;
    textMenuHover: string;
    textMenuActive: string;
    textFooter: string;
    textButton: string;
    textPrice: string;
    textDiscount: string;
    textError: string;
    textSuccess: string;
    textBadge: string;
  };
  gradient: {
    enabled: boolean;
    colors: string[];
    direction: string;
  };
  typography: {
    primaryFont: string;
    headingFont: string;
    baseFontSize: string;
    headingFontSize: string;
    lineHeight: string;
    letterSpacing: string;
    fontWeight: string;
    textShadow: string;
  };
  components: {
    button: {
      shape: 'Rounded' | 'Sharp' | 'Pill';
      shadow: 'None' | 'Soft' | 'Heavy';
      animation: boolean;
    };
    card: {
      style: 'Flat' | 'Soft Shadow' | 'Glass' | 'Border Highlight';
      borderRadius: string;
      shadowDepth: string;
    };
    table: {
      style: 'Minimal' | 'Striped' | 'Shadowed';
    };
    visibility: {
      announcementBar: { visible: boolean; devices: 'all' | 'desktop' | 'mobile'; schedule?: { start: string; end: string } };
      bannerSlider: { visible: boolean; devices: 'all' | 'desktop' | 'mobile'; schedule?: { start: string; end: string } };
      featuredProducts: { visible: boolean; devices: 'all' | 'desktop' | 'mobile'; schedule?: { start: string; end: string } };
      flashSale: { visible: boolean; devices: 'all' | 'desktop' | 'mobile'; schedule?: { start: string; end: string } };
      testimonials: { visible: boolean; devices: 'all' | 'desktop' | 'mobile'; schedule?: { start: string; end: string } };
      blogSection: { visible: boolean; devices: 'all' | 'desktop' | 'mobile'; schedule?: { start: string; end: string } };
      newsletterPopup: { visible: boolean; devices: 'all' | 'desktop' | 'mobile'; schedule?: { start: string; end: string } };
      floatingButtons: { visible: boolean; devices: 'all' | 'desktop' | 'mobile'; schedule?: { start: string; end: string } };
    };
  };
  layout: {
    width: 'Full' | 'Boxed';
    headerStyle: 'Classic' | 'Centered' | 'Mega' | 'Minimal';
    stickyHeader: boolean;
    footerStyle: 'Simple' | 'Detailed' | 'Minimal';
    sidebarPosition: 'Left' | 'Right' | 'Hidden';
    sidebarWidth: 'Compact' | 'Normal' | 'Expanded';
    sidebarIconOnly: boolean;
    widgetDensity: 'Comfort' | 'Compact';
    productCardStyle: 'Grid' | 'List' | 'Modern' | 'Compact';
  };
  advanced: {
    customCss: string;
    animationsEnabled: boolean;
    animationSpeed: 'Slow' | 'Normal' | 'Fast';
    preloaderEnabled: boolean;
    preloaderImage?: string;
    cursorStyle: 'Default' | 'Pointer' | 'Custom';
  };
  updatedAt: string;
}

export interface TaxSettings {
  defaultTaxPercentage: number;
  taxInclusive: boolean;
  vatAutoCalculation: boolean;
  taxNumber?: string;
}

export interface CurrencySettings {
  defaultCurrency: string;
  currencySymbol: string;
  currencyPosition: 'Left' | 'Right';
  decimalSeparator: string;
  thousandSeparator: string;
  numberOfDecimals: number;
  multiCurrencyEnabled: boolean;
}

export interface AutomationRules {
  order: {
    autoConfirm: boolean;
    autoStockDeduction: boolean;
    autoInvoiceGeneration: boolean;
    autoStatusUpdateAfterPayment: boolean;
    autoCancelUnpaidHours: number;
  };
  customer: {
    autoCreateOnOrder: boolean;
    autoTagging: boolean;
    dueReminderSms: boolean;
    thankYouMessageAfterDelivery: boolean;
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'OrderConfirmation' | 'Invoice' | 'PaymentConfirmation' | 'ShippingUpdate' | 'DueReminder';
  isActive: boolean;
}

export interface SmsTemplate {
  id: string;
  name: string;
  body: string;
  type: 'OrderConfirmation' | 'ShippingUpdate' | 'DueReminder' | 'OTP';
  isActive: boolean;
}

export interface ApiIntegration {
  id: string;
  name: string;
  provider: string;
  type: 'Payment' | 'SMS' | 'Courier' | 'Email' | 'OAuth';
  credentials: Record<string, string>;
  isEnabled: boolean;
  isSandbox: boolean;
}

// --- Marketing Module ---

export type CampaignType = 'Percentage' | 'Fixed' | 'Flash Sale' | 'Buy X Get Y';
export type MarketingStatus = 'Active' | 'Draft' | 'Expired' | 'Scheduled';

export interface Coupon {
  id: string;
  code: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  usageLimitGlobal: number;
  usageLimitPerCustomer: number;
  usageCount: number;
  expiryDate: string;
  minOrderAmount: number;
  firstOrderOnly: boolean;
  targetCustomerIds?: string[];
  status: 'Active' | 'Inactive' | 'Expired';
  createdAt: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  filters: {
    customerType?: 'New' | 'Repeat' | 'VIP' | 'Inactive' | 'High Spending';
    minOrderCount?: number;
    minTotalPurchase?: number;
    lastPurchaseBefore?: string;
    lastPurchaseAfter?: string;
  };
  customerCount: number;
  createdAt: string;
}

export interface EmailMarketingCampaign {
  id: string;
  name: string;
  subject: string;
  content: string; // HTML/Rich Text
  segmentId: string;
  scheduledAt?: string;
  status: 'Draft' | 'Queued' | 'Sending' | 'Sent' | 'Failed';
  stats: {
    sent: number;
    opened: number;
    clicked: number;
  };
  createdAt: string;
}

export interface SmsMarketingCampaign {
  id: string;
  name: string;
  content: string;
  segmentId: string;
  scheduledAt?: string;
  status: 'Draft' | 'Queued' | 'Sending' | 'Sent' | 'Failed';
  stats: {
    sent: number;
    delivered: number;
  };
  createdAt: string;
}

export interface AbandonedCartRecord {
  id: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  lastActivity: string;
  reminderSent: boolean;
  recovered: boolean;
  recoveredOrderId?: string;
  createdAt: string;
}

export interface ReferralRecord {
  id: string;
  customerId: string;
  referralCode: string;
  commissionPercentage: number;
  totalReferrals: number;
  totalCommission: number;
  pendingCommission: number;
  withdrawnCommission: number;
  status: 'Active' | 'Suspended';
}

export interface ReferralWithdrawalRequest {
  id: string;
  referralId: string;
  amount: number;
  method: 'Bank' | 'bKash' | 'Nagad';
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: string;
  processedAt?: string;
}

export interface LoyaltyPointsRecord {
  id: string;
  customerId: string;
  currentPoints: number;
  totalEarned: number;
  totalRedeemed: number;
  history: {
    id: string;
    type: 'Earned' | 'Redeemed' | 'Expired';
    points: number;
    reason: string;
    date: string;
  }[];
}

export interface BannerPopup {
  id: string;
  type: 'Banner' | 'Offer Popup' | 'Exit Intent Popup' | 'Countdown Popup';
  title: string;
  image: string;
  link?: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive';
  targetPage: string; // e.g., 'Home', 'All', 'Category'
  showOnMobile: boolean;
  createdAt: string;
}

export interface SocialTrackingConfig {
  id: string;
  platform: 'Facebook Pixel' | 'Google Analytics' | 'TikTok Pixel' | 'Custom';
  trackingId: string;
  script?: string;
  isActive: boolean;
}

export interface MarketingAnalytics {
  campaignPerformance: {
    name: string;
    conversions: number;
    revenue: number;
  }[];
  couponUsage: {
    code: string;
    count: number;
  }[];
  emailStats: {
    openRate: number;
    clickRate: number;
  };
  smsStats: {
    deliveryRate: number;
  };
  cartRecoveryRate: number;
  referralConversions: number;
}

export interface SystemPreferences {
  defaultOrderStatus: OrderStatus;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  autoEmailAfterOrder: boolean;
  orderIdFormat: string;
  customerIdFormat: string;
  cacheEnabled: boolean;
  imageCompressionLevel: number;
  lazyLoadEnabled: boolean;
  debugMode: boolean;
  sessionTimeout: number;
  loginAttemptLimit: number;
  ipRestrictionEnabled: boolean;
}

export interface AuditLog {
  id: string;
  module: string;
  action: string;
  performedBy: {
    id: string;
    name: string;
    role: string;
  };
  entityId?: string;
  oldValue?: any;
  newValue?: any;
  ip: string;
  device: string;
  timestamp: string;
  status: 'Success' | 'Failed' | 'Warning';
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface BackupRecord {
  id: string;
  filename: string;
  size: number;
  type: 'Manual' | 'Auto';
  status: 'Success' | 'Failed';
  timestamp: string;
}

// --- Notification Module ---

export type NotificationPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type NotificationModule = 'Orders' | 'Customers' | 'System' | 'Marketing' | 'Security';

export interface AdminNotification {
  id: string;
  adminId?: string; // Nullable for global
  type: string;
  module: NotificationModule;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  isArchived: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface NotificationPreferences {
  enableBell: boolean;
  enableEmail: boolean;
  enableSms: boolean;
  enablePush: boolean;
  criticalOnlyMode: boolean;
  categories: {
    orders: boolean;
    customers: boolean;
    system: boolean;
    marketing: boolean;
    security: boolean;
  };
}

// --- Finance Module ---

export type TransactionType = 'Credit' | 'Debit';
export type PayoutStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed';
export type CommissionType = 'Fixed' | 'Percentage' | 'Tiered';

export interface FinancialTransaction {
  id: string;
  adminId?: string;
  sellerId?: string;
  type: TransactionType;
  amount: number;
  beforeBalance: number;
  afterBalance: number;
  category: string; // e.g., 'Order Revenue', 'Commission', 'Payout', 'Refund', 'Expense'
  description: string;
  referenceId?: string; // e.g., Order ID or Payout ID
  ipAddress: string;
  timestamp: string;
}

export interface OrderRevenue {
  id: string;
  orderId: string;
  customerName: string;
  sellerName?: string;
  orderAmount: number;
  deliveryCharge: number;
  discount: number;
  tax: number;
  commission: number;
  netReceivable: number;
  paymentStatus: string;
  revenueStatus: 'Pending' | 'Processing' | 'Completed' | 'Refunded' | 'Disputed';
  createdAt: string;
}

export interface CommissionRule {
  id: string;
  name: string;
  type: CommissionType;
  value: number;
  targetType: 'Global' | 'Category' | 'Seller';
  targetId?: string;
  minSalesAmount?: number; // For tiered
  maxSalesAmount?: number; // For tiered
  isActive: boolean;
}

export interface PayoutRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  method: 'Bank' | 'bKash' | 'Nagad' | 'Manual';
  status: PayoutStatus;
  requestedAt: string;
  processedAt?: string;
  adminNote?: string;
  transactionId?: string;
}

export interface ExpenseRecord {
  id: string;
  title: string;
  category: 'Marketing' | 'Operational' | 'Refund Loss' | 'Shipping Subsidy' | 'Gateway Charges' | 'Other';
  amount: number;
  date: string;
  notes?: string;
  attachmentUrl?: string;
  createdBy: string;
}

export interface FinanceAnalytics {
  totalRevenue: number;
  totalOrdersValue: number;
  totalCommission: number;
  netProfit: number;
  pendingPayout: number;
  completedPayout: number;
  refundAmount: number;
  codPending: number;
  revenueGrowth: { date: string; revenue: number; commission: number }[];
}

// --- Reports Module ---

export interface ReportSummary {
  totalSales: number;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  totalRefunds: number;
  totalProfit: number;
  pendingOrders: number;
  cancelledOrders: number;
  returnRate: number;
}

export interface SalesReportRecord {
  id: string;
  orderId: string;
  customerName: string;
  sellerName: string;
  products: string;
  quantity: number;
  amount: number;
  discount: number;
  tax: number;
  shippingFee: number;
  commission: number;
  netProfit: number;
  orderStatus: OrderStatus;
  paymentStatus: string;
  createdAt: string;
}

export interface ProductReportRecord {
  id: string;
  name: string;
  sku: string;
  category: string;
  totalSold: number;
  totalRevenue: number;
  returnRate: number;
  stockQuantity: number;
}

export interface CustomerReportRecord {
  id: string;
  name: string;
  totalOrders: number;
  totalSpend: number;
  avgOrderValue: number;
  lastOrderDate: string;
  clv: number; // Customer Lifetime Value
}

export interface SellerReportRecord {
  id: string;
  name: string;
  totalSales: number;
  commissionPaid: number;
  pendingPayout: number;
  refundAmount: number;
  disputeCount: number;
  rating: number;
}

// --- Disputes Module ---

export type DisputeStatus = 
  | 'Open' 
  | 'Under Review' 
  | 'Waiting for Seller' 
  | 'Waiting for Buyer' 
  | 'Escalated' 
  | 'Approved' 
  | 'Rejected' 
  | 'Closed';

export type DisputeType = 
  | 'Refund Conflict' 
  | 'Return Conflict' 
  | 'Delivery Issue' 
  | 'Fraud Claim' 
  | 'Product Mismatch';

export type DisputePriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface DisputeMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'Buyer' | 'Seller' | 'Admin';
  message: string;
  attachments?: string[];
  createdAt: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  sellerId: string;
  sellerName: string;
  type: DisputeType;
  amount: number;
  status: DisputeStatus;
  priority: DisputePriority;
  messages: DisputeMessage[];
  evidence: string[];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

// --- Roles & Permissions Module ---

export type PermissionAction = 'View' | 'Create' | 'Edit' | 'Delete' | 'Export' | 'Approve' | 'Reject';

export interface ModulePermissions {
  moduleId: string;
  moduleName: string;
  actions: Record<PermissionAction, boolean>;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  isSystemRole: boolean;
  permissions: ModulePermissions[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: 'Role Created' | 'Role Updated' | 'Role Deleted' | 'Role Assigned';
  targetRoleId?: string;
  targetRoleName?: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

// --- SEO Management Module ---

export interface GlobalSEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  robotsTxt: string;
  googleVerification: string;
  bingVerification: string;
  sitemapEnabled: boolean;
}

export interface PageSEO {
  id: string;
  pageType: 'Home' | 'Category' | 'Product' | 'Blog' | 'Static';
  pageName: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  noIndex: boolean;
  noFollow: boolean;
  canonicalUrl?: string;
}

export interface RedirectRule {
  id: string;
  fromUrl: string;
  toUrl: string;
  type: '301' | '302';
  createdAt: string;
}

export interface SEOAnalyticsScripts {
  googleAnalyticsId: string;
  googleTagManagerId: string;
  facebookPixelId: string;
  customHeaderScript: string;
  customFooterScript: string;
}

// --- User Settings & Notification Module ---

export interface UserNotificationSettings {
  userId: string;
  promotions: boolean;
  orders: boolean;
  activities: boolean;
  sellerPromo: boolean;
  chat: boolean;
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
}

// --- Policies Module ---

export interface Policy {
  id: string;
  policyType: 'privacy' | 'terms' | 'return' | 'refund';
  title: string;
  contentHtml: string;
  lastUpdated: string;
}

// --- Help Center Module ---

export interface FAQCategory {
  id: string;
  name: string;
  icon?: string;
  order: number;
}

export interface HelpFAQ {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
  isTopQuestion: boolean;
  order: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  category: string;
  orderId?: string;
  description: string;
  status: 'Pending' | 'Replied' | 'Closed';
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderRole: 'user' | 'admin';
  message: string;
  attachments?: string[];
  createdAt: string;
}

// --- Feedback & Reports Module ---

export interface PromotionBanner {
  id: string;
  image: string;
  title: string;
  description?: string;
  type?: 'Flash Sale' | 'Daily Deal' | 'Campaign' | 'Offer' | 'Daily Offer';
  link?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  isVisible: boolean;
  order: number;
}

export interface HomepageVisibility {
  mainBanner: boolean;
  categoryNav: boolean;
  searchBar: boolean;
  promotionBanners: boolean;
  productSections: boolean;
}

export interface PageErrorReport {
  id: string;
  userId: string;
  pageUrl: string;
  errorType: 'Page not loading' | 'Broken layout' | 'Wrong information' | 'Payment error' | 'Button not working' | 'Other';
  description: string;
  imageUrls: string[];
  status: 'Pending' | 'In Review' | 'Resolved' | 'Rejected';
  createdAt: string;
}

export interface CustomerSuggestion {
  id: string;
  userId: string;
  category: 'Website Improvement' | 'New Feature' | 'UI Design' | 'Payment System' | 'Delivery System' | 'Other';
  title: string;
  description: string;
  imageUrls: string[];
  status: 'New' | 'Under Review' | 'Approved' | 'Implemented' | 'Rejected';
  createdAt: string;
}

// --- Offer System Module ---

export interface Offer {
  id: string;
  title: string;
  name?: string;
  type: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  banner?: string;
  image?: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive' | 'Scheduled' | 'Expired';
  productIds: string[];
  priority?: number;
  link?: string;
  showOnFloatingButton?: boolean;
  showOnHomepage?: boolean;
  showOnBanner?: boolean;
  views?: number;
  clicks?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OfferProduct {
  id: string;
  offerId: string;
  productId: string;
}

export interface OfferSettings {
  isOfferButtonEnabled: boolean;
  offerButtonText: string;
  offerButtonIcon?: string;
  activeOfferId?: string;
}
