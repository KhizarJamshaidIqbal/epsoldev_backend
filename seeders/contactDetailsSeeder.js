import mongoose from 'mongoose';
import ContactDetails from '../models/ContactDetails.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleContactDetails = {
  email: 'info@epsoldev.com',
  phone: '+92 3107923290',
  address: 'Lahore, Pakistan',
  googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217896.956993587712d74.17610033203123!3d31.483115999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3922a4a3e5f5f5f5%3A0x5f5f5f5f5f5f5f5!2sLahore%2C%20Pakistan!5e0!3m2!1sen!2s!4v1234567890',
  socialMedia: {
    facebook: 'https://facebook.com/epsoldev',
    twitter: 'https://twitter.com/epsoldev',
    linkedin: 'https://linkedin.com/company/epsoldev',
    instagram: 'https://instagram.com/epsoldev',
    github: 'https://github.com/epsoldev',
    youtube: 'https://youtube.com/@epsoldev',
    discord: 'https://discord.gg/epsoldev',
    stackoverflow: 'https://stackoverflow.com/company/epsoldev',
    medium: 'https://medium.com/@epsoldev',
    behance: 'https://behance.net/epsoldev',
    threads: 'https://threads.net/@epsoldev',
    telegram: 'https://t.me/epsoldev'
  },
  businessHours: {
    monday: '9:00 AM - 6:00 PM',
    tuesday: '9:00 AM - 6:00 PM',
    wednesday: '9:00 AM - 6:00 PM',
    thursday: '9:00 AM - 6:00 PM',
    friday: '9:00 AM - 6:00 PM',
    saturday: '10:00 AM - 4:00 PM',
    sunday: 'Closed'
  }
};

const seedContactDetails = async () => {
  try {
    console.log('🚀 Starting contact details seeder...');
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://khizarjamshaidiqbal:uJLam6FepeeYgpWL@cluster0.ygxxdws.mongodb.net/epsoldev?retryWrites=true&w=majority&appName=Cluster0';
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await ContactDetails.deleteMany({});
    console.log('🗑️  Cleared existing contact details');

    const insertedContactDetails = await ContactDetails.create(sampleContactDetails);
    console.log(`✅ Successfully seeded contact details`);

    console.log('\n📋 Created contact details:');
    console.log(`  - Email: ${insertedContactDetails.email}`);
    console.log(`  - Phone: ${insertedContactDetails.phone}`);
    console.log(`  - Address: ${insertedContactDetails.address}`);
    console.log(`  - Facebook: ${insertedContactDetails.socialMedia.facebook}`);
    console.log(`  - Twitter: ${insertedContactDetails.socialMedia.twitter}`);
    console.log(`  - LinkedIn: ${insertedContactDetails.socialMedia.linkedin}`);
    console.log(`  - Instagram: ${insertedContactDetails.socialMedia.instagram}`);
    console.log(`  - GitHub: ${insertedContactDetails.socialMedia.github}`);
    console.log(`  - YouTube: ${insertedContactDetails.socialMedia.youtube}`);
    console.log(`  - Discord: ${insertedContactDetails.socialMedia.discord}`);
    console.log(`  - Stack Overflow: ${insertedContactDetails.socialMedia.stackoverflow}`);
    console.log(`  - Medium: ${insertedContactDetails.socialMedia.medium}`);
    console.log(`  - Behance: ${insertedContactDetails.socialMedia.behance}`);
    console.log(`  - Threads: ${insertedContactDetails.socialMedia.threads}`);
    console.log(`  - Telegram: ${insertedContactDetails.socialMedia.telegram}`);

    console.log('\n🎉 Contact details seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding contact details:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

seedContactDetails();

export default seedContactDetails;
