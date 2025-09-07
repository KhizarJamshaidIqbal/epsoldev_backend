import mongoose from 'mongoose';
import User from '../models/User.js';
import connectDB from '../config/db.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Demo admin credentials
const DEMO_ADMIN = {
  name: 'Demo Admin',
  email: 'admin@epsoldev.com',
  password: 'admin123',
  role: 'admin'
};

const seedAdmin = async () => {
  try {
    console.log('🌱 Starting admin seeding process...');
    
    // Connect to database
    const isConnected = await connectDB();
    if (!isConnected) {
      console.error('❌ Database connection failed');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: DEMO_ADMIN.email });
    
    if (existingAdmin) {
      console.log(`👤 Demo admin already exists with email: ${DEMO_ADMIN.email}`);
      console.log('📝 Admin credentials:');
      console.log(`   Email: ${DEMO_ADMIN.email}`);
      console.log(`   Password: ${DEMO_ADMIN.password}`);
      
      // Update password in case it was changed
      existingAdmin.password = DEMO_ADMIN.password;
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log('🔄 Demo admin credentials updated');
    } else {
      // Create new admin
      const admin = await User.create(DEMO_ADMIN);
      console.log(`✅ Demo admin created successfully with email: ${admin.email}`);
      console.log('📝 Admin credentials:');
      console.log(`   Email: ${DEMO_ADMIN.email}`);
      console.log(`   Password: ${DEMO_ADMIN.password}`);
    }

    // Verify admin was created/updated correctly
    const adminUser = await User.findOne({ email: DEMO_ADMIN.email });
    console.log(`🔍 Verification - Admin role: ${adminUser.role}, isAdmin: ${adminUser.isAdmin}`);

    console.log('✨ Admin seeding completed successfully!');
    console.log('🔐 You can now login to the admin panel with the above credentials');
    
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('📚 Database connection closed');
    process.exit(0);
  }
};

// Run the seeding function
seedAdmin();
