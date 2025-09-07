import mongoose from 'mongoose';
import Testimonial from '../models/Testimonial.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const sampleTestimonials = [
  {
    name: 'John Smith',
    company: 'ABC Corp',
    content: 'Working with EPSOL Dev was a fantastic experience. They delivered our project on time and exceeded our expectations. The team was professional, communicative, and truly understood our business needs.',
    rating: 5,
    status: 'approved',
    featured: true,
    position: 'CEO'
  },
  {
    name: 'Sarah Johnson',
    company: 'XYZ Inc',
    content: 'The team at EPSOL Dev provided excellent support throughout our website redesign project. Their attention to detail and commitment to quality was outstanding.',
    rating: 4,
    status: 'approved',
    featured: true,
    position: 'Marketing Director'
  },
  {
    name: 'Michael Brown',
    company: 'Tech Solutions',
    content: 'Our mobile app was delivered with exceptional quality and attention to detail. The development process was smooth and the final product exceeded our expectations.',
    rating: 5,
    status: 'approved',
    featured: true,
    position: 'CTO'
  },
  {
    name: 'Emily Davis',
    company: 'Global Retail',
    content: 'The e-commerce solution they developed increased our online sales by 45%. The platform is user-friendly and the backend is robust and scalable.',
    rating: 5,
    status: 'approved',
    featured: false,
    position: 'Operations Manager'
  },
  {
    name: 'Robert Wilson',
    company: 'Service Plus',
    content: 'Highly professional team with excellent communication skills. They delivered our project on time and within budget. Highly recommended!',
    rating: 4,
    status: 'approved',
    featured: false,
    position: 'Project Manager'
  },
  {
    name: 'Laura Thompson',
    company: 'Thompson Design',
    content: 'Their attention to UI/UX details made our application stand out. The user experience is intuitive and the design is modern and professional.',
    rating: 5,
    status: 'pending',
    featured: false,
    position: 'Creative Director'
  },
  {
    name: 'David Chen',
    company: 'Innovation Labs',
    content: 'EPSOL Dev transformed our outdated system into a modern, efficient platform. The migration was seamless and the new features have significantly improved our workflow.',
    rating: 5,
    status: 'approved',
    featured: true,
    position: 'IT Director'
  },
  {
    name: 'Jennifer Martinez',
    company: 'Startup Ventures',
    content: 'As a startup, we needed a partner who could move fast and deliver quality. EPSOL Dev exceeded our expectations and helped us launch our MVP ahead of schedule.',
    rating: 5,
    status: 'approved',
    featured: false,
    position: 'Founder'
  },
  {
    name: 'Alex Rodriguez',
    company: 'Digital Marketing Pro',
    content: 'The custom dashboard they built for us has revolutionized how we track and analyze our marketing campaigns. The insights we get are invaluable.',
    rating: 4,
    status: 'approved',
    featured: false,
    position: 'Digital Marketing Manager'
  },
  {
    name: 'Maria Garcia',
    company: 'Healthcare Solutions',
    content: 'Working with EPSOL Dev on our healthcare platform was excellent. They understood the compliance requirements and delivered a secure, HIPAA-compliant solution.',
    rating: 5,
    status: 'approved',
    featured: true,
    position: 'Healthcare Administrator'
  },
  {
    name: 'James Wilson',
    company: 'Financial Services Co',
    content: 'The financial management system they developed for us is robust and secure. It handles complex calculations and provides real-time reporting capabilities.',
    rating: 5,
    status: 'approved',
    featured: false,
    position: 'Finance Director'
  },
  {
    name: 'Lisa Anderson',
    company: 'Education First',
    content: 'Our learning management system is now more intuitive and engaging for students. The platform has improved our course completion rates significantly.',
    rating: 4,
    status: 'pending',
    featured: false,
    position: 'Educational Technology Coordinator'
  }
];

const seedTestimonials = async () => {
  try {
    console.log('🚀 Starting testimonial seeder...');
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://khizarjamshaidiqbal:uJLam6FepeeYgpWL@cluster0.ygxxdws.mongodb.net/epsoldev?retryWrites=true&w=majority&appName=Cluster0';
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing testimonials
    await Testimonial.deleteMany({});
    console.log('🗑️  Cleared existing testimonials');

    // Insert sample testimonials
    const insertedTestimonials = await Testimonial.insertMany(sampleTestimonials);
    console.log(`✅ Successfully seeded ${insertedTestimonials.length} testimonials`);

    // Display created testimonials
    console.log('\n📋 Created testimonials:');
    insertedTestimonials.forEach(testimonial => {
      console.log(`  - ${testimonial.name} (${testimonial.company}) - ${testimonial.rating} stars - ${testimonial.status} ${testimonial.featured ? '- Featured' : ''}`);
    });

    console.log('\n🎉 Testimonial seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding testimonials:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seeder if this file is executed directly
seedTestimonials();

export default seedTestimonials;
