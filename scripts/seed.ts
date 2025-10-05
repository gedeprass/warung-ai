import { db } from '../db';
import { products } from '../db/schema';

const sampleProducts = [
  {
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with excellent cushioning perfect for daily runs and marathon training. Features breathable mesh upper and durable rubber outsole.",
    price: "129.99",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80",
    stock: 50,
  },
  {
    name: "Sony WH-1000XM4 Wireless Headphones",
    description: "Premium noise-canceling wireless headphones with exceptional sound quality, 30-hour battery life, and comfortable over-ear design.",
    price: "349.99",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
    stock: 25,
  },
  {
    name: "Eco-Friendly Bamboo Kitchen Set",
    description: "Sustainable kitchen utensil set made from organic bamboo. Includes spatulas, spoons, and cutting boards. Perfect for eco-conscious cooking.",
    price: "45.99",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80",
    stock: 100,
  },
  {
    name: "Apple Watch Series 8",
    description: "Advanced smartwatch with health monitoring, fitness tracking, and seamless integration with iOS devices. Water-resistant with all-day battery life.",
    price: "399.99",
    imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&q=80",
    stock: 30,
  },
  {
    name: "Yoga Mat Premium",
    description: "Extra-thick, non-slip yoga mat with alignment markers. Perfect for yoga, pilates, and floor exercises. Includes carrying strap.",
    price: "35.99",
    imageUrl: "https://images.unsplash.com/photo-1506629905687-662f5b5fbe2c?w=300&q=80",
    stock: 75,
  },
  {
    name: "Leather Handbag Collection",
    description: "Elegant genuine leather handbag with multiple compartments and adjustable strap. Perfect gift for special occasions.",
    price: "189.99",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80",
    stock: 20,
  },
  {
    name: "Bluetooth Portable Speaker",
    description: "Waterproof wireless speaker with 360-degree sound, 12-hour battery life, and built-in microphone for hands-free calls.",
    price: "79.99",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&q=80",
    stock: 60,
  },
  {
    name: "Organic Skincare Set",
    description: "Complete facial skincare routine with natural ingredients. Includes cleanser, toner, moisturizer, and serum for all skin types.",
    price: "89.99",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80",
    stock: 40,
  },
  {
    name: "Fitness Resistance Bands Set",
    description: "Complete workout set with 5 resistance levels, handles, ankle straps, and door anchor. Perfect for home strength training.",
    price: "29.99",
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80",
    stock: 80,
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Insulated 32oz water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free with leak-proof design.",
    price: "24.99",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7112425d35e5?w=300&q=80",
    stock: 120,
  },
];

async function seed() {
  try {
    console.log('🌱 Seeding database with sample products...');

    await db.insert(products).values(sampleProducts);

    console.log('✅ Database seeded successfully!');
    console.log(`📦 Added ${sampleProducts.length} products to the database.`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();