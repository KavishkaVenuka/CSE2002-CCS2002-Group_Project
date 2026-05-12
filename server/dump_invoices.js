import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Invoice from './models/Invoice.js';

dotenv.config();

async function dumpInvoices() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const invoices = await Invoice.find().limit(10);
    console.log(JSON.stringify(invoices, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

dumpInvoices();
