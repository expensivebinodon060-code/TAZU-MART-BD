/**
 * Firebase Service Layer (Mocked for Phase 1 Foundation)
 * This service simulates the interaction with Firebase Firestore, Storage, and Auth.
 */

import { Product, Order, Notification, Ticket } from '../types';
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_NOTIFICATIONS, MOCK_TICKETS } from '../mockData';

class FirebaseService {
  // Authentication
  async login(email: string, pass: string) {
    console.log('Firebase Auth: Attempting login for', email);
    return new Promise((resolve) => setTimeout(() => resolve({ uid: 'admin-123', email }), 800));
  }

  // Firestore: Products
  async getProducts(): Promise<Product[]> {
    console.log('Firestore: Fetching products...');
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_PRODUCTS), 500));
  }

  async addProduct(product: Partial<Product>) {
    console.log('Firestore: Adding product', product);
    return { id: Math.random().toString(36).substr(2, 9) };
  }

  // Firestore: Orders
  async getOrders(): Promise<Order[]> {
    console.log('Firestore: Fetching orders...');
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_ORDERS), 500));
  }

  // Firestore: Home Page Configuration
  async getHomePageConfig() {
    console.log('Firestore: Fetching home page sections...');
    return {
      hero: {
        title: 'Elevate Your Digital Lifestyle',
        subtitle: 'Discover the latest in premium tech',
        image: 'https://picsum.photos/seed/hero/1920/1080'
      },
      sections: [
        { type: 'categories', title: 'Shop by Category' },
        { type: 'featured', title: 'Featured Products' }
      ]
    };
  }
}

export const firebase = new FirebaseService();
