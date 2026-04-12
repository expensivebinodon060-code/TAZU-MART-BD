import { Order, Product, Notification, Category, Review, Ticket, HomepageBanner, PromotionBanner, HomepageVisibility, Offer, OfferProduct, OfferSettings } from './types';

export const MOCK_OFFERS: Offer[] = [
  {
    id: 'off-1',
    title: 'Flash Sale - 50% Off',
    type: 'Flash Sale',
    discountType: 'Percentage',
    discountValue: 50,
    banner: 'https://picsum.photos/seed/flash/1200/400',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
    status: 'Active',
    productIds: ['1', '2', '3'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'off-2',
    title: 'Eid Special Combo',
    type: 'Combo',
    discountType: 'Fixed',
    discountValue: 200,
    banner: 'https://picsum.photos/seed/eid/1200/400',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 604800000).toISOString(), // 7 days from now
    status: 'Active',
    productIds: ['4', '5'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const MOCK_OFFER_SETTINGS: OfferSettings = {
  isOfferButtonEnabled: true,
  offerButtonText: 'OFFERS',
  offerButtonIcon: 'Flame',
  activeOfferId: 'off-1'
};

export const MOCK_HOMEPAGE_BANNERS: HomepageBanner[] = [
  { id: 'b1', image: 'https://picsum.photos/seed/banner1/1920/1080', title: 'Eid Special Sale', order: 1, isVisible: true, link: '/offers', type: 'Main Slider' },
  { id: 'b2', image: 'https://picsum.photos/seed/banner2/1920/1080', title: 'Summer Collection', order: 2, isVisible: true, link: '/category/fashion', type: 'Main Slider' },
  { id: 'b3', image: 'https://picsum.photos/seed/banner3/1920/1080', title: 'Tech Gadgets 2026', order: 3, isVisible: true, link: '/category/electronics', type: 'Main Slider' },
];

export const MOCK_PROMOTION_BANNERS: PromotionBanner[] = [
  { id: 'pb1', image: 'https://picsum.photos/seed/promo1/600/400', title: 'Flash Sale', categoryId: 'cat1', startDate: '2026-03-01', endDate: '2026-03-10', isVisible: true, order: 1 },
  { id: 'pb2', image: 'https://picsum.photos/seed/promo2/600/400', title: 'Trending Products', categoryId: 'cat2', startDate: '2026-03-01', endDate: '2026-03-15', isVisible: true, order: 2 },
  { id: 'pb3', image: 'https://picsum.photos/seed/promo3/600/400', title: 'Hot Deals', categoryId: 'cat4', startDate: '2026-03-01', endDate: '2026-03-20', isVisible: true, order: 3 },
  { id: 'pb4', image: 'https://picsum.photos/seed/promo4/600/400', title: 'Limited Offer', categoryId: 'cat3', startDate: '2026-03-01', endDate: '2026-03-25', isVisible: true, order: 4 },
];

export const MOCK_HOMEPAGE_VISIBILITY: HomepageVisibility = {
  mainBanner: true,
  categoryNav: true,
  searchBar: true,
  promotionBanners: false, // Disabling large cards by default as per request
  productSections: true,
};

export const MOCK_CATEGORIES: Category[] = [
  { 
    id: 'cat-electronics', 
    name: 'Electronics', 
    slug: 'electronics', 
    status: 'Active', 
    icon: '📱', 
    image: 'https://picsum.photos/seed/electronics/400/250', 
    banner: 'https://picsum.photos/seed/elec-banner/1200/400',
    bannerMobile: 'https://picsum.photos/seed/elec-banner-mob/800/400',
    isVisible: true, 
    isFeatured: true,
    showOnHomepage: true,
    showInMenu: true,
    order: 1,
    seoTitle: 'Electronics - Best Gadgets Online | Tazu Mart BD',
    seoDescription: 'Shop the latest electronics, smartphones, laptops, and more at Tazu Mart BD. Best prices and fast delivery in Bangladesh.',
    seoKeywords: 'electronics, smartphones, laptops, gadgets, bangladesh',
    subCategories: [
      { id: 'sub-phones', name: 'Smartphones', slug: 'smartphones', parentId: 'cat-electronics', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/phone/300/300' },
      { id: 'sub-laptops', name: 'Laptops', slug: 'laptops', parentId: 'cat-electronics', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/laptop/300/300' },
      { id: 'sub-audio', name: 'Audio', slug: 'audio', parentId: 'cat-electronics', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/audio/300/300' },
      { id: 'sub-cameras', name: 'Cameras', slug: 'cameras', parentId: 'cat-electronics', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/camera/300/300' },
      { id: 'sub-gaming', name: 'Gaming', slug: 'gaming', parentId: 'cat-electronics', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/gaming/300/300' },
    ]
  },
  { 
    id: 'cat-fashion', 
    name: 'Fashion', 
    slug: 'fashion', 
    status: 'Active', 
    icon: '👗', 
    image: 'https://picsum.photos/seed/fashion/400/250', 
    banner: 'https://picsum.photos/seed/fashion-banner/1200/400',
    isVisible: true, 
    order: 2,
    subCategories: [
      { id: 'sub-men-fashion', name: 'Men Fashion', slug: 'men-fashion', parentId: 'cat-fashion', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/menf/300/300' },
      { id: 'sub-women-fashion', name: 'Women Fashion', slug: 'women-fashion', parentId: 'cat-fashion', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/womenf/300/300' },
      { id: 'sub-kids-fashion', name: 'Kids Fashion', slug: 'kids-fashion', parentId: 'cat-fashion', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/kidsf/300/300' },
    ]
  },
  { 
    id: 'cat-home', 
    name: 'Home & Living', 
    slug: 'home-living', 
    status: 'Active', 
    icon: '🏠', 
    image: 'https://picsum.photos/seed/home/400/250', 
    banner: 'https://picsum.photos/seed/home-banner/1200/400',
    isVisible: true, 
    order: 3,
    subCategories: [
      { id: 'sub-furniture', name: 'Furniture', slug: 'furniture', parentId: 'cat-home', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/furn/300/300' },
      { id: 'sub-decor', name: 'Home Decor', slug: 'home-decor', parentId: 'cat-home', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/decor/300/300' },
      { id: 'sub-kitchen', name: 'Kitchen', slug: 'kitchen', parentId: 'cat-home', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/kitchen/300/300' },
    ]
  },
  { 
    id: 'cat-accessories', 
    name: 'Accessories', 
    slug: 'accessories', 
    status: 'Active', 
    icon: '⌚', 
    image: 'https://picsum.photos/seed/acc/400/250', 
    banner: 'https://picsum.photos/seed/acc-banner/1200/400',
    isVisible: true, 
    order: 4,
    subCategories: [
      { id: 'sub-watches', name: 'Watches', slug: 'watches', parentId: 'cat-accessories', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/watch/300/300' },
      { id: 'sub-belts', name: 'Belts', slug: 'belts', parentId: 'cat-accessories', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/belt/300/300' },
      { id: 'sub-sunglasses', name: 'Sunglasses', slug: 'sunglasses', parentId: 'cat-accessories', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/sun/300/300' },
    ]
  },
  { 
    id: 'cat-beauty', 
    name: 'Beauty', 
    slug: 'beauty', 
    status: 'Active', 
    icon: '💄', 
    image: 'https://picsum.photos/seed/beauty/400/250', 
    banner: 'https://picsum.photos/seed/beauty-banner/1200/400',
    isVisible: true, 
    order: 5,
    subCategories: [
      { id: 'sub-skincare', name: 'Skincare', slug: 'skincare', parentId: 'cat-beauty', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/skin/300/300' },
      { id: 'sub-makeup', name: 'Makeup', slug: 'makeup', parentId: 'cat-beauty', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/makeup/300/300' },
      { id: 'sub-haircare', name: 'Haircare', slug: 'haircare', parentId: 'cat-beauty', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/hair/300/300' },
    ]
  },
  { 
    id: 'cat-kids', 
    name: 'Kids', 
    slug: 'kids', 
    status: 'Active', 
    icon: '🧸', 
    image: 'https://picsum.photos/seed/kids/400/250', 
    banner: 'https://picsum.photos/seed/kids-banner/1200/400',
    isVisible: true, 
    order: 6,
    subCategories: [
      { id: 'sub-toys', name: 'Toys', slug: 'toys', parentId: 'cat-kids', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/toys/300/300' },
      { id: 'sub-baby-care', name: 'Baby Care', slug: 'baby-care', parentId: 'cat-kids', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/baby/300/300' },
    ]
  },
  { 
    id: 'cat-shoes', 
    name: 'Shoes', 
    slug: 'shoes', 
    status: 'Active', 
    icon: '👟', 
    image: 'https://picsum.photos/seed/shoes/400/250', 
    isVisible: true, 
    order: 7,
    subCategories: [
      { id: 'sub-m-shoes', name: 'Men Shoes', slug: 'men-shoes', parentId: 'cat-shoes', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/mshoes/300/300' },
      { id: 'sub-m-boots', name: 'Men Boots', slug: 'men-boots', parentId: 'cat-shoes', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/mboots/300/300' },
      { id: 'sub-l-shoes', name: 'Ladies Shoes', slug: 'ladies-shoes', parentId: 'cat-shoes', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/lshoes/300/300' },
      { id: 'sub-l-boots', name: 'Ladies Boot', slug: 'ladies-boot', parentId: 'cat-shoes', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/lboots/300/300' },
      { id: 'sub-heels', name: 'High Heels', slug: 'high-heels', parentId: 'cat-shoes', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/heels/300/300' },
      { id: 'sub-formal', name: 'Formal Shoes', slug: 'formal-shoes', parentId: 'cat-shoes', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/formal/300/300' },
      { id: 'sub-sandals', name: 'Sandals', slug: 'sandals', parentId: 'cat-shoes', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/sandals/300/300' },
      { id: 'sub-running', name: 'Running Shoes', slug: 'running-shoes', parentId: 'cat-shoes', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/running/300/300' },
      { id: 'sub-gym', name: 'Gym Shoes', slug: 'gym-shoes', parentId: 'cat-shoes', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/gym/300/300' },
      { id: 'sub-casual', name: 'Casual Shoes', slug: 'casual-shoes', parentId: 'cat-shoes', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/casual/300/300' },
      { id: 'sub-loafers', name: 'Loafers', slug: 'loafers', parentId: 'cat-shoes', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/loafers/300/300' },
      { id: 'sub-sports', name: 'Sports Shoes', slug: 'sports-shoes', parentId: 'cat-shoes', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/sports/300/300' },
    ]
  },
  { 
    id: 'cat-bags', 
    name: 'Bags', 
    slug: 'bags', 
    status: 'Active', 
    icon: '👜', 
    image: 'https://picsum.photos/seed/bags/400/250', 
    isVisible: true, 
    order: 8,
    subCategories: [
      { id: 'sub-backpacks', name: 'Backpacks', slug: 'backpacks', parentId: 'cat-bags', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/backpack/300/300' },
      { id: 'sub-handbags', name: 'Handbags', slug: 'handbags', parentId: 'cat-bags', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/handbag/300/300' },
      { id: 'sub-wallets', name: 'Wallets', slug: 'wallets', parentId: 'cat-bags', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/wallet/300/300' },
    ]
  },
  { 
    id: 'cat-jewelry', 
    name: 'Jewelry', 
    slug: 'jewelry', 
    status: 'Active', 
    icon: '💍', 
    image: 'https://picsum.photos/seed/jewelry/400/250', 
    isVisible: true, 
    order: 9,
    subCategories: [
      { id: 'sub-rings', name: 'Rings', slug: 'rings', parentId: 'cat-jewelry', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/ring/300/300' },
      { id: 'sub-necklaces', name: 'Necklaces', slug: 'necklaces', parentId: 'cat-jewelry', status: 'Active', isVisible: true, image: 'https://picsum.photos/seed/necklace/300/300' },
    ]
  },
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'r1', productId: 'p1', customerName: 'John Doe', rating: 5, comment: 'Amazing sound quality! Highly recommend.', date: '2024-02-15', status: 'Approved' },
  { id: 'r2', productId: 'p1', customerName: 'Jane Smith', rating: 4, comment: 'Very comfortable for long sessions.', date: '2024-02-10', status: 'Approved' },
  { id: 'r3', productId: 'p9', customerName: 'Mike Ross', rating: 5, comment: 'Perfect fit and great material.', date: '2024-02-18', status: 'Approved' },
];

export const MOCK_PRODUCTS: Product[] = [
  { 
    id: 'p1', 
    name: 'Premium Wireless Headphones', 
    price: 299, 
    regularPrice: 350,
    image: 'https://picsum.photos/seed/h1/400/400', 
    images: ['https://picsum.photos/seed/h1/800/800', 'https://picsum.photos/seed/h2/800/800', 'https://picsum.photos/seed/h3/800/800'],
    category: 'Electronics', 
    categoryId: 'cat1', 
    brand: 'Sony',
    description: 'Experience industry-leading noise cancellation and premium sound quality with these wireless headphones. Perfect for travel, work, or just relaxing at home.',
    isFeatured: true, 
    featuredOrder: 1, 
    fastDelivery: true, 
    views: 3240, 
    discount: '-15%', 
    code: 'PRD-1001',
    status: 'active',
    stockStatus: 'In Stock',
    variations: [
      { 
        id: 'v1', 
        productId: 'p1', 
        attributeType: 'color', 
        attributeValue: 'Black', 
        colorCode: '#000000', 
        isVisible: true, 
        isActive: true, 
        isRequired: true, 
        stockQuantity: 10, 
        priceAdjustment: 0 
      }
    ],
    reviews: MOCK_REVIEWS.filter(r => r.productId === 'p1')
  },
  { 
    id: 'p9', 
    name: 'Cotton T-Shirt', 
    price: 25, 
    regularPrice: 35,
    image: 'https://picsum.photos/seed/f1/400/400', 
    images: ['https://picsum.photos/seed/f1/800/800', 'https://picsum.photos/seed/f2/800/800'],
    category: 'Fashion', 
    categoryId: 'cat2', 
    brand: 'Levis',
    description: 'A classic cotton t-shirt that is perfect for everyday wear. Made from 100% organic cotton for maximum comfort and durability.',
    fastDelivery: true, 
    views: 5200, 
    discount: '-30%', 
    code: 'PRD-1009',
    status: 'active',
    stockStatus: 'In Stock',
    variations: [
      { 
        id: 'v2', 
        productId: 'p9', 
        attributeType: 'color', 
        attributeValue: 'White', 
        colorCode: '#FFFFFF', 
        images: [
          'https://picsum.photos/seed/white-shirt-1/800/800',
          'https://picsum.photos/seed/white-shirt-2/800/800',
          'https://picsum.photos/seed/white-shirt-3/800/800'
        ],
        isVisible: true, 
        isActive: true, 
        isRequired: true, 
        stockQuantity: 20, 
        priceAdjustment: 0 
      },
      { 
        id: 'v3', 
        productId: 'p9', 
        attributeType: 'color', 
        attributeValue: 'Black', 
        colorCode: '#000000', 
        images: [
          'https://picsum.photos/seed/black-shirt-1/800/800',
          'https://picsum.photos/seed/black-shirt-2/800/800',
          'https://picsum.photos/seed/black-shirt-3/800/800'
        ],
        isVisible: true, 
        isActive: true, 
        isRequired: true, 
        stockQuantity: 15, 
        priceAdjustment: 0 
      },
      { 
        id: 'v4', 
        productId: 'p9', 
        attributeType: 'size', 
        attributeValue: 'M', 
        isVisible: true, 
        isActive: true, 
        isRequired: true, 
        stockQuantity: 10, 
        priceAdjustment: 0 
      },
      { 
        id: 'v5', 
        productId: 'p9', 
        attributeType: 'size', 
        attributeValue: 'L', 
        isVisible: true, 
        isActive: true, 
        isRequired: true, 
        stockQuantity: 10, 
        priceAdjustment: 5 
      },
      { 
        id: 'v6', 
        productId: 'p9', 
        attributeType: 'size', 
        attributeValue: 'XL', 
        isVisible: true, 
        isActive: true, 
        isRequired: true, 
        stockQuantity: 5, 
        priceAdjustment: 10 
      }
    ],
    reviews: MOCK_REVIEWS.filter(r => r.productId === 'p9')
  },
  { id: 'p2', name: 'Ergonomic Mechanical Keyboard', price: 159, image: 'https://picsum.photos/seed/k1/400/400', category: 'Accessories', categoryId: 'cat4', isFeatured: true, featuredOrder: 2, fastDelivery: true, views: 3180, discount: '-10%', code: 'PRD-1002', status: 'active', stockStatus: 'In Stock' },
  { id: 'p3', name: 'Ultra-wide 4K Monitor', price: 599, image: 'https://picsum.photos/seed/m1/400/400', category: 'Electronics', categoryId: 'cat1', isFeatured: true, featuredOrder: 3, fastDelivery: true, views: 3320, discount: '-20%', code: 'PRD-1003', status: 'active', stockStatus: 'In Stock' },
  { id: 'p4', name: 'Minimalist Desk Lamp', price: 49, image: 'https://picsum.photos/seed/l1/400/400', category: 'Home & Living', categoryId: 'cat-home', isFeatured: true, featuredOrder: 4, fastDelivery: false, views: 3090, discount: '-5%', code: 'PRD-1004', status: 'active', stockStatus: 'In Stock' },
  { id: 'p5', name: 'Leather Laptop Sleeve', price: 79, image: 'https://picsum.photos/seed/s1/400/400', category: 'Accessories', categoryId: 'cat-accessories', fastDelivery: true, views: 3120, discount: '-12%', code: 'PRD-1005', status: 'active', stockStatus: 'In Stock' },
  { id: 'p6', name: 'Smart Watch Series X', price: 399, image: 'https://picsum.photos/seed/w1/400/400', category: 'Electronics', categoryId: 'cat-electronics', fastDelivery: true, views: 4500, discount: '-25%', code: 'PRD-1006', status: 'active', stockStatus: 'In Stock' },
  { id: 'p7', name: 'Noise Cancelling Earbuds', price: 199, image: 'https://picsum.photos/seed/e1/400/400', category: 'Electronics', categoryId: 'cat-electronics', fastDelivery: true, views: 3210, discount: '-18%', code: 'PRD-1007', status: 'active', stockStatus: 'In Stock' },
  { id: 'p8', name: 'Gaming Mouse Pro', price: 89, image: 'https://picsum.photos/seed/mouse1/400/400', category: 'Accessories', categoryId: 'cat-accessories', fastDelivery: true, views: 3150, discount: '-10%', code: 'PRD-1008', status: 'active', stockStatus: 'In Stock' },
  { id: 'p10', name: 'Denim Jacket', price: 85, image: 'https://picsum.photos/seed/f2/400/400', category: 'Fashion', categoryId: 'cat-fashion', fastDelivery: true, views: 3270, discount: '-22%', code: 'PRD-1010', status: 'active', stockStatus: 'In Stock' },
  { id: 'p11', name: 'Sneakers', price: 120, image: 'https://picsum.photos/seed/f3/400/400', category: 'Fashion', categoryId: 'cat-fashion', fastDelivery: true, views: 3800, discount: '-15%', code: 'PRD-1011', status: 'active', stockStatus: 'In Stock' },
  { id: 'p12', name: 'Backpack', price: 65, image: 'https://picsum.photos/seed/f4/400/400', category: 'Fashion', categoryId: 'cat-fashion', fastDelivery: true, views: 3190, discount: '-10%', code: 'PRD-1012', status: 'active', stockStatus: 'In Stock' },
  { id: 'p13', name: 'Matte Lipstick Set', price: 45, image: 'https://picsum.photos/seed/beauty1/400/400', category: 'Beauty', categoryId: 'cat-beauty', fastDelivery: true, views: 3110, discount: '-5%', code: 'PRD-1013', status: 'active', stockStatus: 'In Stock' },
  { id: 'p14', name: 'Face Serum Pro', price: 35, image: 'https://picsum.photos/seed/beauty2/400/400', category: 'Beauty', categoryId: 'cat-beauty', fastDelivery: true, views: 3080, discount: '-10%', code: 'PRD-1014', status: 'active', stockStatus: 'In Stock' },
  { id: 'p15', name: 'Organic Face Wash', price: 15, image: 'https://picsum.photos/seed/beauty3/400/400', category: 'Beauty', categoryId: 'cat-beauty', fastDelivery: true, views: 3250, discount: '-15%', code: 'PRD-1015', status: 'active', stockStatus: 'In Stock' },
  { id: 'p16', name: 'Plush Teddy Bear', price: 25, image: 'https://picsum.photos/seed/kids1/400/400', category: 'Kids', categoryId: 'cat-kids', fastDelivery: true, views: 3140, discount: '-10%', code: 'PRD-1016', status: 'active', stockStatus: 'In Stock' },
  { id: 'p17', name: 'Building Blocks Set', price: 40, image: 'https://picsum.photos/seed/kids2/400/400', category: 'Kids', categoryId: 'cat-kids', fastDelivery: true, views: 3320, discount: '-20%', code: 'PRD-1017', status: 'active', stockStatus: 'In Stock' },
  { id: 'p18', name: 'Remote Control Car', price: 55, image: 'https://picsum.photos/seed/kids3/400/400', category: 'Kids', categoryId: 'cat-kids', fastDelivery: true, views: 3210, discount: '-12%', code: 'PRD-1018', status: 'active', stockStatus: 'In Stock' },
  { id: 'p19', name: 'Smart LED Bulb', price: 12, image: 'https://picsum.photos/seed/home1/400/400', category: 'Home & Living', categoryId: 'cat-home', fastDelivery: true, views: 3050, discount: '-5%', code: 'PRD-1019', status: 'active', stockStatus: 'In Stock' },
  { id: 'p20', name: 'Velvet Cushion Cover', price: 18, image: 'https://picsum.photos/seed/home2/400/400', category: 'Home & Living', categoryId: 'cat-home', fastDelivery: true, views: 3070, discount: '-10%', code: 'PRD-1020', status: 'active', stockStatus: 'In Stock' },
  { id: 'p21', name: 'Wall Clock Modern', price: 35, image: 'https://picsum.photos/seed/home3/400/400', category: 'Home & Living', categoryId: 'cat-home', fastDelivery: true, views: 3120, discount: '-15%', code: 'PRD-1021', status: 'active', stockStatus: 'In Stock' },
  { id: 'p22', name: 'Scented Candle Set', price: 22, image: 'https://picsum.photos/seed/home4/400/400', category: 'Home & Living', categoryId: 'cat-home', fastDelivery: true, views: 3090, discount: '-8%', code: 'PRD-1022', status: 'active', stockStatus: 'In Stock' },
  { id: 'p23', name: 'Kitchen Knife Set', price: 45, image: 'https://picsum.photos/seed/home5/400/400', category: 'Home & Living', categoryId: 'cat-home', fastDelivery: true, views: 3150, discount: '-12%', code: 'PRD-1023', status: 'active', stockStatus: 'In Stock' },
  { id: 'p24', name: 'Cotton Bed Sheet', price: 55, image: 'https://picsum.photos/seed/home6/400/400', category: 'Home & Living', categoryId: 'cat-home', fastDelivery: true, views: 3230, discount: '-20%', code: 'PRD-1024', status: 'active', stockStatus: 'In Stock' },
];

export const MOCK_INCOMPLETE_ORDERS: any[] = [
  {
    id: 'INC-1001',
    customerName: 'Rahim Uddin',
    customerPhone: '01711223344',
    customerEmail: 'rahim@gmail.com',
    address: 'House 12, Road 5, Dhanmondi',
    city: 'Dhaka',
    items: [
      { productId: 'p1', name: 'Premium Wireless Headphones', price: 299, quantity: 1, image: 'https://picsum.photos/seed/h1/400/400' }
    ],
    cartValue: 299,
    checkoutTime: '2026-04-10T14:30:00Z',
    lastActivity: '2026-04-10T14:35:00Z',
    status: 'Incomplete Checkout'
  },
  {
    id: 'INC-1002',
    customerName: 'Karim Hasan',
    customerPhone: '01822334455',
    customerEmail: 'karim.hasan@yahoo.com',
    address: 'Flat 4A, Building 7, Nasirabad',
    city: 'Chattogram',
    items: [
      { productId: 'p3', name: 'Ultra-wide 4K Monitor', price: 599, quantity: 1, image: 'https://picsum.photos/seed/m1/400/400' },
      { productId: 'p4', name: 'Minimalist Desk Lamp', price: 49, quantity: 2, image: 'https://picsum.photos/seed/l1/400/400' }
    ],
    cartValue: 697,
    checkoutTime: '2026-04-10T16:45:00Z',
    lastActivity: '2026-04-10T16:50:00Z',
    status: 'Incomplete Checkout'
  },
  {
    id: 'INC-1003',
    customerName: 'Sadia Islam',
    customerPhone: '01933445566',
    customerEmail: 'sadia.islam@hotmail.com',
    address: 'Sector 4, Uttara',
    city: 'Dhaka',
    items: [
      { productId: 'p10', name: 'Denim Jacket', price: 85, quantity: 1, image: 'https://picsum.photos/seed/f2/400/400' }
    ],
    cartValue: 85,
    checkoutTime: '2026-04-11T09:15:00Z',
    lastActivity: '2026-04-11T09:20:00Z',
    status: 'Incomplete Checkout'
  }
];

export const MOCK_ORDERS: Order[] = [
  { 
    id: 'ORD-8291', 
    date: '2026-02-15', 
    amount: 314, 
    status: 'Delivered', 
    paymentMethod: 'bKash', 
    paymentStatus: 'paid',
    items: [
      { productId: 'p1', name: 'Premium Wireless Headphones', price: 299, quantity: 1, image: 'https://picsum.photos/seed/h1/400/400' }
    ],
    shippingAddress: 'House 12, Road 5, Dhanmondi, Dhaka',
    customerName: 'John Doe',
    customerPhone: '8801712345678',
    deliveryCharge: 15,
    transactionId: 'BKW882910',
    paymentTime: '2026-02-15 14:30',
    orderSource: 'website'
  },
  { 
    id: 'ORD-7742', 
    date: '2026-02-18', 
    amount: 614, 
    status: 'Delivered', 
    paymentMethod: 'Cash on Delivery', 
    paymentStatus: 'pending',
    items: [
      { productId: 'p3', name: 'Ultra-wide 4K Monitor', price: 599, quantity: 1, image: 'https://picsum.photos/seed/m1/400/400' }
    ],
    shippingAddress: 'Flat 4A, Building 7, Nasirabad, Chattogram',
    customerName: 'Jane Smith',
    customerPhone: '8801812345678',
    deliveryCharge: 15,
    trackingNumber: 'TRK99210034',
    orderSource: 'website'
  },
  {
    id: 'ORD-9012',
    date: '2026-02-20',
    amount: 143,
    status: 'Confirmed',
    paymentMethod: 'Nagad',
    paymentStatus: 'paid',
    shippingAddress: '123 Tech Lane, Silicon Valley, CA',
    customerName: 'Alice Johnson',
    customerPhone: '8801912345678',
    deliveryCharge: 15,
    transactionId: 'NGD992100',
    paymentTime: '2026-02-20 10:15',
    orderSource: 'website',
    items: [
      { productId: 'p4', name: 'Minimalist Desk Lamp', price: 49, quantity: 1, image: 'https://picsum.photos/seed/l1/400/400' },
      { productId: 'p5', name: 'Leather Laptop Sleeve', price: 79, quantity: 1, image: 'https://picsum.photos/seed/s1/400/400' },
    ]
  },
  {
    id: 'ORD-1122',
    date: '2026-03-01',
    amount: 350,
    status: 'Pending',
    paymentMethod: 'bKash',
    paymentStatus: 'pending',
    shippingAddress: 'House 45, Road 2, Banani, Dhaka',
    customerName: 'John Doe',
    customerPhone: '8801712345678',
    deliveryCharge: 15,
    orderSource: 'website',
    items: [
      { productId: 'p1', name: 'Premium Wireless Headphones', price: 299, quantity: 1, image: 'https://picsum.photos/seed/h1/400/400' }
    ]
  },
  {
    id: 'ORD-3344',
    date: '2026-03-02',
    amount: 174,
    status: 'Confirmed',
    paymentMethod: 'Nagad',
    paymentStatus: 'paid',
    shippingAddress: 'Sector 4, Uttara, Dhaka',
    customerName: 'John Doe',
    customerPhone: '8801712345678',
    deliveryCharge: 15,
    orderSource: 'website',
    items: [
      { productId: 'p2', name: 'Ergonomic Mechanical Keyboard', price: 159, quantity: 1, image: 'https://picsum.photos/seed/k1/400/400' }
    ]
  },
  {
    id: 'ORD-5566',
    date: '2026-03-03',
    amount: 135,
    status: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'pending',
    shippingAddress: 'Mirpur 10, Dhaka',
    customerName: 'John Doe',
    customerPhone: '8801712345678',
    deliveryCharge: 15,
    trackingNumber: 'TRK12345678',
    courierName: 'Pathao Courier',
    orderSource: 'website',
    items: [
      { productId: 'p11', name: 'Sneakers', price: 120, quantity: 1, image: 'https://picsum.photos/seed/f3/400/400' }
    ]
  },
  {
    id: 'ORD-7788',
    date: '2026-03-04',
    amount: 100,
    status: 'Delivered',
    paymentMethod: 'bKash',
    paymentStatus: 'paid',
    shippingAddress: 'Gulshan 2, Dhaka',
    customerName: 'John Doe',
    customerPhone: '8801712345678',
    deliveryCharge: 15,
    orderSource: 'website',
    items: [
      { productId: 'p10', name: 'Denim Jacket', price: 85, quantity: 1, image: 'https://picsum.photos/seed/f2/400/400' }
    ]
  },
  {
    id: 'ORD-9900',
    date: '2026-03-05',
    amount: 80,
    status: 'Returned',
    paymentMethod: 'bKash',
    paymentStatus: 'paid',
    shippingAddress: 'Dhanmondi, Dhaka',
    customerName: 'John Doe',
    customerPhone: '8801712345678',
    deliveryCharge: 15,
    orderSource: 'website',
    items: [
      { productId: 'p12', name: 'Backpack', price: 65, quantity: 1, image: 'https://picsum.photos/seed/f4/400/400' }
    ]
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Order Shipped', message: 'Your order ORD-7742 has been shipped.', date: '2026-02-19', read: false },
  { id: 'n2', title: 'New Arrival', message: 'Check out our new collection of desk accessories.', date: '2026-02-18', read: true },
];

export const MOCK_TICKETS: Ticket[] = [
  { id: 'T-1001', subject: 'Inquiry about warranty', status: 'Resolved', date: '2026-01-15' },
  { id: 'T-1005', subject: 'Shipping delay for ORD-7742', status: 'In Progress', date: '2026-02-20' },
];
