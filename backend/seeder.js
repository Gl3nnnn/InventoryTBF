const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedAdminUser = async () => {
  try {
    await connectDB();

    const adminEmail = 'admin@1';

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return; // Changed from process.exit() to return
    }

    const bcrypt = require('bcryptjs');

    // Create admin user with hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('111111', salt);

    const adminUser = new User({
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
    });

    await adminUser.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    process.exit();
  }
};

seedAdminUser();
