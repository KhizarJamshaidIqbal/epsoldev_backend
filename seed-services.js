import { seedServices } from './seeders/services.seeder.js';
import connectDB from './config/db.js';

const runSeeder = async () => {
  try {
    console.log('🚀 Starting Services Seeder...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');
    
    // Run the seeder
    await seedServices();
    
    console.log('🎉 Services seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeeder();
