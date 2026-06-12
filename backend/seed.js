import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

import MenuItem from './models/MenuItem.js';
import Review from './models/Review.js';
import Offer from './models/Offer.js';
import Reservation from './models/Reservation.js';
import Subscriber from './models/Subscriber.js';
import User from './models/User.js';
import Order from './models/Order.js';



dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, 'data', 'local_db.json');

const menuItemsData = [
  {
    name: 'Wagyu Ribeye Steak',
    description: 'A 45-day dry-aged premium Wagyu ribeye seared with smoked cherrywood crust, fresh herbs, and gold leaf reduction.',
    price: 89,
    category: 'Mains',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLuIimpTFXpS8yHUX1RyqhNBaKDtDmS1rvMOW2n6nuQNWzyeTAE-odZKpCuMUZ_cieX0ro5Lv6fkv_m4UGjAKlWU4zeZK697TGj_4tj5hAa_G3ovBPqZgV4x5QkDMgxQdPzfWZd2f4NLSJXU1uTOH6Nyb86y9GAFeS8YM0AneZr0tpBmh_AcEQPIpU5532DIkG1wrN3AygHtd-l03XBCbD7Pbz9C1sEDpZBkPEKK3MxJ08VGC_i2NKypzDrj',
    isChefSpecial: true,
    allergens: ['Dairy-Free Available']
  },
  {
    name: 'Lobster Agnolotti',
    description: 'Handmade pasta stuffed with fresh Maine lobster claws, served in a rich saffron-infused brown butter sauce.',
    price: 48,
    category: 'Mains',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLsRg_5gVHQ5c3a1wNveX9dlMZbPHjv6OLexZIr_WRs3_7apBu8L9Al5_1kDf5VQXECWEn8gmN0k-P8qwnd8EAqDDFwJzfXl7eCCHwEAoh_uXWoh1KBsuHWxrlEOwxmmthK4Sj2NLz9ezTkRfBpjlFara9PRZ-Raq0nVnFaXTWazX0Lpuy3b5aSufZXUP8_CXPDEhzuIsQOIje8s_vWWkHYACn7v7wsJcywVE4SUn2lwEWHlIUVyfci7nBtq',
    isChefSpecial: true,
    allergens: ['Contains Shellfish', 'Gluten']
  },
  {
    name: 'Crispy Cherrywood Pork Belly',
    description: 'Slow-roasted pork belly with cherrywood smoke, served over parsnip puree and drizzled with spicy honey gastrique.',
    price: 22,
    category: 'Appetizers',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLvyS5TOznW_SNp06M5Vb7jwMIBLQAVw24EXi2Zvy8dwzOW0iCqBqrYRKCfzouTuqRbVgj622FN87t57-u2xHY7gKYht7cqknuq-azBynAvoLSokQI8lxunrT8bRl1ZOxks-MrPpm-jYB7_63zFmeDCgp5-zOauzDHnFQ9tsLiX76ziV7SM2XioZQQ5sbXeXAYKPEAQCGK2D4z31j-TlQaaqd_4Hu1_l-XgY4y6d2b0EqUwJyT16Rfy0oa0',
    isChefSpecial: false,
    allergens: ['Gluten-Free']
  },
  {
    name: 'Orange Spiced Soufflé',
    description: 'Baked to order Grand Marnier orange soufflé, served warm with caramelized orange zest syrup and fresh mint.',
    price: 24,
    category: 'Desserts',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLv3mgwolov7v19ybw1WuOM8jUQJShyjDXlYznmdVhhs_pUMVefGrPnnFCW3Q0oWdAWPVuUxagILINVVBQehlHXfO15pxDVjh4vEiEK0hrkvE5Rh0R7vMcFOOnuzyw9XSdIEPWgU35XykbBmIJVEWAwQYJsLrxOd-odpMdenWXsyFUe183o_2U1DQ5M7RYkDgqKp4nvf1AqtZCV5oELQi2xwSz8-n_xVQzR6nGPwrWiI1HjtRE0pbo2JiWA',
    isChefSpecial: false,
    allergens: ['Vegetarian', 'Nuts']
  },
  {
    name: 'Golden Saffron Calamari',
    description: 'Crisp hand-cut calamari tossed in saffron salt, served with fresh garlic confit aioli and charred lemon wedges.',
    price: 26,
    category: 'Appetizers',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLvyS5TOznW_SNp06M5Vb7jwMIBLQAVw24EXi2Zvy8dwzOW0iCqBqrYRKCfzouTuqRbVgj622FN87t57-u2xHY7gKYht7cqknuq-azBynAvoLSokQI8lxunrT8bRl1ZOxks-MrPpm-jYB7_63zFmeDCgp5-zOauzDHnFQ9tsLiX76ziV7SM2XioZQQ5sbXeXAYKPEAQCGK2D4z31j-TlQaaqd_4Hu1_l-XgY4y6d2b0EqUwJyT16Rfy0oa0',
    isChefSpecial: false,
    allergens: ['Contains Shellfish']
  },
  {
    name: 'Aged Chocolate Fondant',
    description: 'Decadent Valrhona dark chocolate cake with a molten center, served with Madagascan vanilla bean ice cream.',
    price: 18,
    category: 'Desserts',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLv3mgwolov7v19ybw1WuOM8jUQJShyjDXlYznmdVhhs_pUMVefGrPnnFCW3Q0oWdAWPVuUxagILINVVBQehlHXfO15pxDVjh4vEiEK0hrkvE5Rh0R7vMcFOOnuzyw9XSdIEPWgU35XykbBmIJVEWAwQYJsLrxOd-odpMdenWXsyFUe183o_2U1DQ5M7RYkDgqKp4nvf1AqtZCV5oELQi2xwSz8-n_xVQzR6nGPwrWiI1HjtRE0pbo2JiWA',
    isChefSpecial: false,
    allergens: ['Vegetarian']
  },
  {
    name: 'Smoked Amber Old Fashioned',
    description: 'Premium bourbon whiskey infused with orange peel and local honey, smoked tableside with white oak chips.',
    price: 22,
    category: 'Beverages',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLuIimpTFXpS8yHUX1RyqhNBaKDtDmS1rvMOW2n6nuQNWzyeTAE-odZKpCuMUZ_cieX0ro5Lv6fkv_m4UGjAKlWU4zeZK697TGj_4tj5hAa_G3ovBPqZgV4x5QkDMgxQdPzfWZd2f4NLSJXU1uTOH6Nyb86y9GAFeS8YM0AneZr0tpBmh_AcEQPIpU5532DIkG1wrN3AygHtd-l03XBCbD7Pbz9C1sEDpZBkPEKK3MxJ08VGC_i2NKypzDrj',
    isChefSpecial: false,
    allergens: ['Contains Alcohol']
  }
];

const reviewsData = [
  {
    name: 'Charlotte Dubois',
    rating: 5,
    comment: 'FlavorNest provided the single best dining experience of my life. The Wagyu Ribeye was seared to absolute perfection, and the tableside Smoked Old Fashioned was theatrical yet sophisticated.',
    isFeatured: true,
    isApproved: true
  },
  {
    name: 'Julian Carter',
    rating: 5,
    comment: 'Simply outstanding. The attention to detail in the Lobster Agnolotti is remarkable. Elegant casual atmosphere at its absolute finest.',
    isFeatured: true,
    isApproved: true
  },
  {
    name: 'Sophia Rossi',
    rating: 5,
    comment: 'The Chef\'s Table reservation is an absolute must-try. Watching the meticulous plating of the pork belly was mesmerizing. Truly culinary art.',
    isFeatured: true,
    isApproved: true
  },
  {
    name: 'Alexander Sterling',
    rating: 4,
    comment: 'Very professional staff and an atmospheric, gorgeous interior. Perfect location for hosting our corporate dinner clients.',
    isFeatured: false,
    isApproved: true
  }
];

const offersData = [
  {
    title: 'Signature Tasting Menu Experience',
    description: 'An exclusive 5-course curated journey through our chef\'s most acclaimed creations. Available Mon-Thu.',
    discountCode: 'TASTENEST',
    isActive: true
  },
  {
    title: 'Intimate Chef\'s Counter Showcase',
    description: 'Reserve a front-row seat to the culinary stage. Includes complementary champagne pairings.',
    discountCode: 'CHEFSTAGE',
    isActive: true
  }
];

const seedJSON = () => {
  console.log('Seeding Local JSON Database file...');
  const dir = path.dirname(dbFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedAdminPassword = bcrypt.hashSync('admin123', salt);

  const dbData = {
    users: [
      {
        _id: 'user_admin',
        name: 'FlavorNest Admin',
        email: 'admin@flavornest.com',
        password: hashedAdminPassword,
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ],
    reservations: [],
    orders: [
      {
        _id: 'order_1',
        customerName: 'Sarah Jenkins',
        email: 'sarah@example.com',
        phone: '555-0199',
        deliveryAddress: '742 Evergreen Terrace, Springfield',
        items: [
          { menuItem: 'menu_1', name: 'Wagyu Ribeye Steak', quantity: 1, price: 89 },
          { menuItem: 'menu_3', name: 'Crispy Cherrywood Pork Belly', quantity: 2, price: 22 }
        ],
        totalAmount: 133,
        status: 'Preparing',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        _id: 'order_2',
        customerName: 'Michael Chang',
        email: 'michael@example.com',
        phone: '555-0182',
        deliveryAddress: '100 Maple Avenue, Apt 4B',
        items: [
          { menuItem: 'menu_2', name: 'Lobster Agnolotti', quantity: 2, price: 48 },
          { menuItem: 'menu_4', name: 'Orange Spiced Soufflé', quantity: 1, price: 24 }
        ],
        totalAmount: 120,
        status: 'Delivered',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ],
    subscribers: [
      { _id: 'sub_1', email: 'patron@example.com', subscribedAt: new Date().toISOString() }
    ],

    menuItems: menuItemsData.map((item, idx) => ({
      _id: `menu_${idx + 1}`,
      createdAt: new Date().toISOString(),
      ...item
    })),
    reviews: reviewsData.map((rev, idx) => ({
      _id: `rev_${idx + 1}`,
      createdAt: new Date().toISOString(),
      ...rev
    })),
    offers: offersData.map((off, idx) => ({
      _id: `off_${idx + 1}`,
      createdAt: new Date().toISOString(),
      ...off
    }))
  };

  fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2), 'utf-8');
  console.log('Local JSON Database seeded successfully!');
};


const seedMongo = async () => {
  console.log('Connecting to MongoDB for seeding...');
  const connUri = process.env.MONGO_URI || 'mongodb://localhost:27017/flavornest';
  
  try {
    await mongoose.connect(connUri, { serverSelectionTimeoutMS: 3000 });
    console.log('Connected to MongoDB.');
    
    // Clear collections
    await MenuItem.deleteMany({});
    await Review.deleteMany({});
    await Offer.deleteMany({});
    await Reservation.deleteMany({});
    await Subscriber.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing MongoDB data.');

    // Insert admin user
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin123', salt);
    await User.create({
      name: 'FlavorNest Admin',
      email: 'admin@flavornest.com',
      password: hashedAdminPassword,
      role: 'admin'
    });

    // Insert items
    const insertedMenu = await MenuItem.insertMany(menuItemsData);
    await Review.insertMany(reviewsData);
    await Offer.insertMany(offersData);
    
    // Insert orders
    await Order.create([
      {
        customerName: 'Sarah Jenkins',
        email: 'sarah@example.com',
        phone: '555-0199',
        deliveryAddress: '742 Evergreen Terrace, Springfield',
        items: [
          { menuItem: insertedMenu[0]._id, name: insertedMenu[0].name, quantity: 1, price: insertedMenu[0].price },
          { menuItem: insertedMenu[2]._id, name: insertedMenu[2].name, quantity: 2, price: insertedMenu[2].price }
        ],
        totalAmount: 133,
        status: 'Preparing',
        createdAt: new Date(Date.now() - 3600000 * 2)
      },
      {
        customerName: 'Michael Chang',
        email: 'michael@example.com',
        phone: '555-0182',
        deliveryAddress: '100 Maple Avenue, Apt 4B',
        items: [
          { menuItem: insertedMenu[1]._id, name: insertedMenu[1].name, quantity: 2, price: insertedMenu[1].price },
          { menuItem: insertedMenu[3]._id, name: insertedMenu[3].name, quantity: 1, price: insertedMenu[3].price }
        ],
        totalAmount: 120,
        status: 'Delivered',
        createdAt: new Date(Date.now() - 3600000 * 24)
      }
    ]);
    
    console.log('MongoDB database seeded successfully!');

    await mongoose.disconnect();
  } catch (error) {
    console.warn(`MongoDB Seed failed: ${error.message}`);
    console.log('Automatically falling back to seed JSON database file.');
    seedJSON();
  }
};

const runSeeder = async () => {
  // If MONGO_URI is not set, or we want to populate JSON, check parameters
  const forceJSON = process.argv.includes('--json');
  if (forceJSON || !process.env.MONGO_URI) {
    seedJSON();
  } else {
    await seedMongo();
  }
};

runSeeder();
