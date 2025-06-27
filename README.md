# 🌱 Green Haven Nursery - Full-Stack E-Commerce Platform

A modern, full-featured online nursery e-commerce platform built with Next.js, MongoDB, and integrated with Stripe payments and ImageBB for image hosting. Perfect for plant retailers looking to establish a professional online presence.

![Green Haven Nursery](https://green-haven-nursary.vercel.app/)

## 🚀 Features Overview

### 🛍️ **Customer Features**

- **Product Browsing**: Browse plants with advanced filtering and search
- **Shopping Cart**: Add/remove items with real-time inventory checking
- **Secure Checkout**: Multiple payment options (Cash on Delivery & Stripe)
- **Order Tracking**: Real-time order status updates
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Product Details**: Detailed product pages with care instructions

### 👨‍💼 **Admin Features**

- **Product Management**: Full CRUD operations for products
- **Category Management**: Organize products into categories
- **Order Management**: Track and update order statuses
- **Image Upload**: Bulk image upload with drag-and-drop support
- **Inventory Tracking**: Real-time stock management
- **Analytics Dashboard**: Overview of sales and inventory

### 🔧 **Technical Features**

- **Modern Stack**: Next.js 14, TypeScript, MongoDB, Redux Toolkit
- **Image Hosting**: ImageBB integration for reliable image storage
- **Payment Processing**: Stripe integration for secure payments
- **State Management**: Redux Toolkit for predictable state updates
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication Ready**: Prepared for user authentication integration

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Features Deep Dive](#features-deep-dive)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- Stripe account (for payments)
- ImageBB account (for image hosting)

### 1-Minute Setup

\`\`\`bash

# Clone the repository

git clone https://github.com/yourusername/green-haven-nursery.git
cd green-haven-nursery

# Install dependencies

npm install

# Set up environment variables

cp .env.example .env.local

# Edit .env.local with your credentials

# Run the development server

npm run dev
\`\`\`

Visit `http://localhost:3000` to see your nursery in action! 🎉

## 📦 Installation

### Step 1: Clone and Install

\`\`\`bash
git clone https://github.com/AR-Raju/green-haven-nursary.git
cd green-haven-nursery
npm install
\`\`\`

### Step 2: Database Setup

#### Option A: Local MongoDB

\`\`\`bash

# Install MongoDB locally

# macOS

brew install mongodb-community

# Ubuntu

sudo apt-get install mongodb

# Start MongoDB

mongod
\`\`\`

#### Option B: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Add it to your `.env.local` file

### Step 3: Third-Party Services

#### Stripe Setup (Payment Processing)

1. Visit [Stripe Dashboard](https://dashboard.stripe.com)
2. Create an account or sign in
3. Navigate to **Developers** → **API Keys**
4. Copy your **Publishable Key** and **Secret Key**
5. Add them to your environment variables

#### ImageBB Setup (Image Hosting)

1. Go to [ImageBB](https://imgbb.com)
2. Create a free account
3. Navigate to **API** section
4. Generate an API key
5. Add it to your environment variables

## 🔐 Environment Setup

Create a `.env.local` file in your project root:

\`\`\`env

# Database

MONGODB_URI=mongodb://localhost:27017/nursery

# OR for MongoDB Atlas:

# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nursery

# ImageBB (Image Hosting)

IMAGE_BB_API_KEY=your_imagebb_api_key_here

# Stripe (Payment Processing)

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Optional: For production

# NEXT_PUBLIC_APP_URL=https://yourdomain.com

\`\`\`

### 🔑 Getting API Keys

#### Stripe Keys:

1. **Test Mode**: Use for development (keys start with `sk_test_` and `pk_test_`)
2. **Live Mode**: Use for production (keys start with `sk_live_` and `pk_live_`)

#### ImageBB API Key:

- Free tier: 100 MB storage, unlimited bandwidth
- Paid plans available for higher storage needs

## 📁 Project Structure

\`\`\`
green-haven-nursery/
├── app/ # Next.js App Router
│ ├── api/ # API Routes
│ │ ├── products/ # Product CRUD operations
│ │ ├── categories/ # Category management
│ │ ├── orders/ # Order processing
│ │ ├── upload/ # Image upload to ImageBB
│ │ ├── create-payment-intent/# Stripe payment setup
│ │ └── confirm-payment/ # Payment confirmation
│ ├── admin/ # Admin dashboard
│ ├── products/ # Product pages
│ ├── cart/ # Shopping cart
│ ├── checkout/ # Checkout process
│ └── order-success/ # Order confirmation
├── components/ # Reusable components
│ ├── ui/ # shadcn/ui components
│ ├── admin/ # Admin-specific components
│ ├── Navbar.tsx # Navigation component
│ ├── Footer.tsx # Footer component
│ ├── ProductCard.tsx # Product display card
│ ├── PaymentForm.tsx # Stripe payment form
│ └── StripeProvider.tsx # Stripe context provider
├── redux/ # State management
│ ├── store.ts # Redux store configuration
│ └── slices/ # Redux slices
│ ├── productsSlice.ts # Product state management
│ ├── categoriesSlice.ts # Category state management
│ ├── cartSlice.ts # Shopping cart state
│ └── ordersSlice.ts # Order state management
├── models/ # MongoDB schemas
│ ├── Product.ts # Product model
│ ├── Category.ts # Category model
│ └── Order.ts # Order model
├── lib/ # Utility functions
│ └── mongodb.ts # Database connection
└── hooks/ # Custom React hooks
├── useDebounce.ts # Debounce hook
└── useBeforeUnload.ts # Cart protection hook
\`\`\`

## 🎯 Features Deep Dive

### 🛒 Shopping Experience

#### Product Catalog

- **Advanced Filtering**: Filter by category, price range, availability
- **Search Functionality**: Real-time search with debouncing
- **Sorting Options**: Sort by price, name, rating, date added
- **Pagination**: Efficient loading of large product catalogs
- **Responsive Grid**: Adapts to different screen sizes

#### Product Details

- **High-Quality Images**: Zoom and gallery functionality
- **Detailed Descriptions**: Comprehensive product information
- **Care Instructions**: Plant-specific care guidelines
- **Stock Information**: Real-time availability status
- **Related Products**: Suggestions based on category

#### Shopping Cart

- **Persistent Storage**: Cart persists across browser sessions
- **Real-time Updates**: Instant price and quantity calculations
- **Stock Validation**: Prevents overselling
- **Quick Actions**: Easy add/remove/update operations
- **Cart Protection**: Warns before leaving with items in cart

### 💳 Payment System

#### Payment Methods

1. **Cash on Delivery (COD)**

   - No upfront payment required
   - Pay when order arrives
   - Suitable for local customers

2. **Credit/Debit Cards (Stripe)**
   - Secure payment processing
   - Supports major card brands
   - International payments
   - Real-time payment confirmation

#### Checkout Process

1. **Customer Information**: Name, email, phone validation
2. **Shipping Address**: Complete address with validation
3. **Payment Method**: Choose between COD and card payment
4. **Order Review**: Final confirmation before payment
5. **Payment Processing**: Secure payment handling
6. **Order Confirmation**: Email confirmation and tracking

### 🔧 Admin Dashboard

#### Product Management

- **Add Products**: Rich form with image upload
- **Edit Products**: Update any product information
- **Delete Products**: Safe deletion with confirmation
- **Bulk Operations**: Mass update capabilities
- **Image Management**: Drag-and-drop image upload
- **Inventory Tracking**: Real-time stock levels

#### Order Management

- **Order Overview**: Complete order listing
- **Order Details**: Detailed order information
- **Status Updates**: Change order and payment status
- **Customer Information**: Access customer details
- **Search & Filter**: Find orders quickly

#### Analytics Dashboard

- **Sales Overview**: Revenue and order statistics
- **Product Performance**: Best-selling products
- **Inventory Alerts**: Low stock notifications
- **Customer Insights**: Order patterns and trends

### 📱 Responsive Design

#### Mobile Optimization

- **Touch-Friendly**: Large buttons and easy navigation
- **Fast Loading**: Optimized images and code splitting
- **Offline Support**: Basic functionality without internet
- **Progressive Web App**: Can be installed on mobile devices

#### Desktop Features

- **Advanced Filtering**: More filter options on larger screens
- **Bulk Operations**: Admin bulk actions for efficiency
- **Keyboard Shortcuts**: Power user features
- **Multi-column Layouts**: Better use of screen space

## 🔌 API Documentation

### Products API

#### Get All Products

```http
GET /api/products
```
