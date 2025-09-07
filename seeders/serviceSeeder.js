import mongoose from 'mongoose';
import Service from '../models/Service.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const sampleServices = [
  {
    title: 'Mobile App Development',
    description: 'Custom iOS and Android applications built with modern technologies and best practices. We create native and cross-platform mobile applications that deliver exceptional user experiences.',
    shortDescription: 'Custom iOS and Android applications',
    icon: 'smartphone',
    features: [
      'Native iOS & Android Development',
      'Cross-platform Solutions',
      'UI/UX Design',
      'App Store Optimization',
      'Maintenance & Updates'
    ],
    price: 5000,
    priceType: 'fixed',
    priceDisplay: '$5000+',
    category: 'development',
    status: 'active',
    featured: true,
    order: 1
  },
  {
    title: 'Web Development',
    description: 'Responsive websites and web applications built with cutting-edge technologies. From simple landing pages to complex web applications, we deliver scalable and maintainable solutions.',
    shortDescription: 'Responsive websites and web applications',
    icon: 'globe',
    features: [
      'Responsive Design',
      'Frontend & Backend Development',
      'E-commerce Solutions',
      'Content Management Systems',
      'Performance Optimization'
    ],
    price: 3000,
    priceType: 'fixed',
    priceDisplay: '$3000+',
    category: 'development',
    status: 'active',
    featured: true,
    order: 2
  },
  {
    title: 'UI/UX Design',
    description: 'User-centered design solutions that create intuitive and engaging user experiences. We focus on usability, accessibility, and visual appeal to deliver designs that users love.',
    shortDescription: 'User-centered design solutions',
    icon: 'palette',
    features: [
      'User Research & Analysis',
      'Wireframing & Prototyping',
      'Visual Design',
      'User Testing',
      'Design Systems'
    ],
    price: 2000,
    priceType: 'fixed',
    priceDisplay: '$2000+',
    category: 'design',
    status: 'active',
    featured: true,
    order: 3
  },
  {
    title: 'SEO Services',
    description: 'Search engine optimization to improve your website\'s visibility and drive organic traffic. We implement comprehensive SEO strategies to help you rank higher in search results.',
    shortDescription: 'Search engine optimization',
    icon: 'search',
    features: [
      'Keyword Research',
      'On-page SEO',
      'Technical SEO',
      'Content Strategy',
      'Performance Monitoring'
    ],
    price: 1000,
    priceType: 'fixed',
    priceDisplay: '$1000+',
    category: 'marketing',
    status: 'active',
    featured: false,
    order: 4
  },
  {
    title: 'Custom Software',
    description: 'Tailor-made software solutions designed to meet your specific business needs. We develop custom applications that streamline your operations and improve efficiency.',
    shortDescription: 'Tailor-made software solutions',
    icon: 'code',
    features: [
      'Requirements Analysis',
      'Custom Development',
      'Database Design',
      'Integration Services',
      'Training & Support'
    ],
    price: 7000,
    priceType: 'fixed',
    priceDisplay: '$7000+',
    category: 'development',
    status: 'active',
    featured: true,
    order: 5
  },
  {
    title: 'API Integration',
    description: 'Connect systems and applications through robust API development and integration. We help you build and integrate APIs that enable seamless data flow between platforms.',
    shortDescription: 'Connect systems and applications',
    icon: 'link',
    features: [
      'API Development',
      'Third-party Integrations',
      'Data Migration',
      'Security Implementation',
      'Documentation'
    ],
    price: 2500,
    priceType: 'fixed',
    priceDisplay: '$2500+',
    category: 'development',
    status: 'active',
    featured: false,
    order: 6
  },
  {
    title: 'E-commerce Solutions',
    description: 'Complete online store development with payment processing, inventory management, and customer experience optimization. We build e-commerce platforms that drive sales.',
    shortDescription: 'Online store development',
    icon: 'shopping-cart',
    features: [
      'Online Store Development',
      'Payment Gateway Integration',
      'Inventory Management',
      'Order Processing',
      'Analytics & Reporting'
    ],
    price: 4000,
    priceType: 'fixed',
    priceDisplay: '$4000+',
    category: 'development',
    status: 'active',
    featured: true,
    order: 7
  },
  {
    title: 'Maintenance & Support',
    description: 'Ongoing technical support and maintenance services to keep your applications running smoothly. We provide reliable support to ensure your systems remain up-to-date and secure.',
    shortDescription: 'Ongoing technical support',
    icon: 'settings',
    features: [
      '24/7 Monitoring',
      'Bug Fixes & Updates',
      'Security Patches',
      'Performance Optimization',
      'Technical Support'
    ],
    price: 500,
    priceType: 'hourly',
    priceDisplay: '$500+/month',
    category: 'support',
    status: 'active',
    featured: false,
    order: 8
  }
];

const seedServices = async () => {
  try {
    console.log('🚀 Starting service seeder...');
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://khizarjamshaidiqbal:uJLam6FepeeYgpWL@cluster0.ygxxdws.mongodb.net/epsoldev?retryWrites=true&w=majority&appName=Cluster0';
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('🗑️  Cleared existing services');

    // Insert sample services one by one to ensure slug generation works properly
    const insertedServices = [];
    for (const serviceData of sampleServices) {
      const service = new Service(serviceData);
      const savedService = await service.save();
      insertedServices.push(savedService);
    }
    console.log(`✅ Successfully seeded ${insertedServices.length} services`);

    // Display created services
    console.log('\n📋 Created services:');
    insertedServices.forEach(service => {
      console.log(`  - ${service.title} (${service.category}) - ${service.priceDisplay}`);
    });

    console.log('\n🎉 Service seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding services:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seeder if this file is executed directly
seedServices();

export default seedServices;
