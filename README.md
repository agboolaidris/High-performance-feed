# 🛍️ Hyber Feed - E-Commerce Mobile App

A modern e-commerce mobile application built with **React Native** and **Expo** as part of a technical assignment for a recruiting process. This app demonstrates product browsing, cart management, and saved items functionality.

## 📸 App Screenshots

### Home & Product Catalog

![Home Screen](https://github.com/agboolaidris/High-performance-feed/blob/main/screenshots/product-list.png?raw=true)
_Browse products with infinite scrolling and search_

### Product Details

![Product Details](https://github.com/agboolaidris/High-performance-feed/blob/main/screenshots/product-detail.png?raw=true)
_Detailed product view with image gallery and add to cart_

### Shopping Cart

![Shopping Cart](https://github.com/agboolaidris/High-performance-feed/blob/main/screenshots/cart-list.png?raw=true)
_Manage cart items with quantity controls_

### Saved Items

![Saved Items](https://github.com/agboolaidris/High-performance-feed/blob/main/screenshots/liked-products.png?raw=true)
_View and manage your favorite products_

### Search Functionality

![Search](https://via.placeholder.com/300x600/9013FE/FFFFFF?text=Search+Products)
_Real-time search with category filtering_

## 📱 Assignment Overview

This project was developed to showcase skills in:

- **React Native** development with **Expo**
- **TypeScript** for type safety
- **State management** with Zustand
- **Modern UI/UX** principles
- **Performance optimization** techniques

## 🎯 Features Implemented

### Core Functionality

- **Product Catalog** - Browse products with infinite scrolling
- **Product Search** - Real-time search with cancel functionality
- **Shopping Cart** - Add, remove, and manage cart items
- **Saved Items** - Save and manage favorite products
- **Product Details** - Detailed product views with image galleries
- **Category Filtering** - Browse products by categories

### Technical Features

- **Offline Image Caching** - Images are cached for offline viewing
- **State Persistence** - Cart and saved items persist between app sessions
- **Responsive Design** - Optimized for various screen sizes
- **Type Safety** - Full TypeScript implementation
- **Performance** - Optimized lists and efficient re-renders

## 🏗️ Technical Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Storage**: AsyncStorage for persistence
- **UI Components**: Custom design system

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Expo CLI
- Android Studio / Xcode (for emulators)

### Installation & Running

1. **Install dependencies**

   ```bash
   yarn install
   ```

2. **Run on specific platforms**

   ```bash
   # Android
   yarn android

   # iOS
   yarn ios
   ```

## 🎨 Design System

The app features a custom design system with:

### Color Palette

```typescript
export const COLORS = {
  black: {
    100: "#E6E6E6", // Light gray
    200: "#CCCCCC",
    300: "#B3B3B3",
    400: "#999999",
    500: "#808080", // Medium gray
    600: "#666666",
    700: "#4D4D4D",
    800: "#333333",
    900: "#1A1A1A", // Near black
  },
  white: "#ffffff",
  red: "#ED1010", // For discounts/actions
  green: "#0C9409", // For stock status
};
```

### Typography System

- **Headers**: `header1` to `header4` for titles
- **Body Text**: `body1` to `body3` for content
- **Custom weights**: Regular, medium, semibold, bold

## 📱 App Architecture

### Screen Structure

```
app/
├── (tabs)/
│   ├── index.tsx      # Home - Product catalog
│   ├── cart.tsx       # Shopping cart
│   └── saved.tsx      # Saved items
└── product/
    └── [id].tsx       # Product details
```

### State Management

- **cartProductsStore**: Manages shopping cart state
- **savedProductsStore**: Manages saved/favorite items
- **Persistent storage**: Using AsyncStorage

### Key Components

- `ProductCard`: Displays product information in lists
- `CachedImage`: Optimized image component with offline caching
- `TextField`: Custom input with search functionality
- State components for loading, error, and empty states

## 🔧 Development Highlights

### Performance Optimizations

- **Image Caching**: Automatic caching of product images
- **Infinite Scrolling**: Efficient pagination for product lists
- **Memoized Components**: Prevent unnecessary re-renders
- **Optimized Lists**: Using FlashList for better performance

### Code Quality

- **TypeScript**: Full type coverage
- **ESLint & Prettier**: Consistent code style
- **Husky**: Pre-commit hooks for quality checks
- **Modular Architecture**: Reusable components and hooks

## 🎯 Technical Decisions

### Why Expo?

- Faster development cycle
- Built-in navigation solution
- Easy deployment and testing
- Access to native APIs

### Why Zustand?

- Simple and minimal API
- Excellent TypeScript support
- No boilerplate code
- Built-in persistence

### Why TanStack Query?

- Efficient server state management
- Built-in caching and background updates
- Excellent devtools
- Optimistic updates

## 📈 Performance Considerations

1. **Image Optimization**
   - Cached images for offline use
   - Proper sizing and compression
   - Lazy loading implementation

2. **State Optimization**
   - Selective re-renders with Zustand
   - Memoized callbacks and values
   - Efficient list rendering

3. **Bundle Size**
   - Tree-shaking with TypeScript
   - Minimal dependencies
   - Efficient code splitting

## 🚀 Future Enhancements

Potential features that could be added:

- User authentication and profiles
- Order management system
- Payment integration
- Push notifications
- Advanced search filters
- Product reviews and ratings
- Wishlist sharing

## 📝 Assignment Requirements Met

✅ **Core Features**

- Product listing with search
- Shopping cart functionality
- Saved/favorites system
- Product detail views

✅ **Technical Requirements**

- React Native with Expo
- TypeScript implementation
- State management
- Responsive design
- Code quality tools

✅ **Bonus Points**

- Offline capabilities
- Performance optimizations
- Modern UI/UX
- Clean code architecture

## 🤝 Contact

**Developer**: Agboola Idris  
**Repository**: [https://github.com/agboolaidris/High-performance-feed](https://github.com/agboolaidris/High-performance-feed)
