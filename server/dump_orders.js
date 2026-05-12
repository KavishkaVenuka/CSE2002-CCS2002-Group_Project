import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';

dotenv.config();

async function dumpOrders() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const orders = await Order.find().limit(5);
    console.log(JSON.stringify(orders, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

dumpOrders();
