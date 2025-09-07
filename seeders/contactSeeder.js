import mongoose from 'mongoose';
import Contact from '../models/Contact.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleContacts = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    subject: 'Project Inquiry',
    message: 'Hi, I am interested in developing a web application for my business. I would like to discuss the requirements and get a quote. Please let me know when you are available for a consultation.',
    status: 'new',
    priority: 'high',
    source: 'website',
    tags: ['web-development', 'inquiry'],
    notes: 'Potential client interested in web application development'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 987-6543',
    subject: 'Mobile App Development',
    message: 'We are looking for a reliable development partner to create a mobile app for our startup. The app should have user authentication, payment integration, and real-time notifications. Please provide your portfolio and pricing.',
    status: 'read',
    priority: 'high',
    source: 'website',
    tags: ['mobile-development', 'startup'],
    notes: 'Startup looking for mobile app development partner'
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@designstudio.com',
    phone: '+1 (555) 456-7890',
    subject: 'UI/UX Design Services',
    message: 'Hello, I am the creative director at Design Studio. We are looking for a talented UI/UX designer to join our team on a project basis. Do you offer design services or can you recommend someone?',
    status: 'replied',
    priority: 'medium',
    source: 'email',
    tags: ['ui-ux', 'design'],
    notes: 'Design studio looking for UI/UX designer',
    repliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@ecommerce.com',
    phone: '+1 (555) 321-6547',
    subject: 'E-commerce Website',
    message: 'I need a complete e-commerce website for my online store. The website should include product catalog, shopping cart, payment processing, and admin panel. What is your timeline and cost estimate?',
    status: 'new',
    priority: 'high',
    source: 'website',
    tags: ['e-commerce', 'website'],
    notes: 'E-commerce website requirement'
  },
  {
    name: 'David Wilson',
    email: 'david.wilson@consulting.com',
    phone: '+1 (555) 789-0123',
    subject: 'Consultation Request',
    message: 'I am planning to start a digital transformation project for my company. I would like to schedule a consultation to discuss our current systems and how we can improve them with modern technology solutions.',
    status: 'read',
    priority: 'medium',
    source: 'phone',
    tags: ['consultation', 'digital-transformation'],
    notes: 'Digital transformation consultation request'
  },
  {
    name: 'Lisa Garcia',
    email: 'lisa.garcia@restaurant.com',
    phone: '+1 (555) 654-3210',
    subject: 'Restaurant Website',
    message: 'I own a restaurant and need a simple website with online ordering system. The website should display our menu, allow customers to place orders, and include a contact form. What would be the cost?',
    status: 'closed',
    priority: 'low',
    source: 'website',
    tags: ['restaurant', 'website', 'online-ordering'],
    notes: 'Restaurant website with online ordering',
    repliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    name: 'Robert Brown',
    email: 'robert.brown@startup.com',
    phone: '+1 (555) 012-3456',
    subject: 'MVP Development',
    message: 'I have an idea for a SaaS product and need help developing an MVP. The product should include user management, subscription billing, and basic analytics. Can you help me build this?',
    status: 'replied',
    priority: 'high',
    source: 'website',
    tags: ['saas', 'mvp', 'startup'],
    notes: 'SaaS MVP development request',
    repliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    name: 'Jennifer Lee',
    email: 'jennifer.lee@agency.com',
    phone: '+1 (555) 345-6789',
    subject: 'Partnership Opportunity',
    message: 'I run a digital marketing agency and we are looking for a reliable development partner to handle our clients\' technical projects. Would you be interested in a partnership arrangement?',
    status: 'new',
    priority: 'medium',
    source: 'email',
    tags: ['partnership', 'agency'],
    notes: 'Digital marketing agency partnership opportunity'
  },
  {
    name: 'Thomas Anderson',
    email: 'thomas.anderson@enterprise.com',
    phone: '+1 (555) 678-9012',
    subject: 'Enterprise Software',
    message: 'Our company needs a custom enterprise software solution for inventory management. The system should integrate with our existing ERP and handle multiple warehouses. Please provide a detailed proposal.',
    status: 'read',
    priority: 'high',
    source: 'website',
    tags: ['enterprise', 'inventory-management', 'erp'],
    notes: 'Enterprise inventory management system'
  },
  {
    name: 'Amanda Taylor',
    email: 'amanda.taylor@nonprofit.com',
    phone: '+1 (555) 901-2345',
    subject: 'Non-Profit Website',
    message: 'I work for a non-profit organization and we need a website to raise awareness and accept donations. The website should be accessible, mobile-friendly, and include donation functionality. Do you offer discounts for non-profits?',
    status: 'new',
    priority: 'medium',
    source: 'website',
    tags: ['non-profit', 'website', 'donations'],
    notes: 'Non-profit website with donation functionality'
  }
];

const seedContacts = async () => {
  try {
    console.log('🚀 Starting contact seeder...');
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://khizarjamshaidiqbal:uJLam6FepeeYgpWL@cluster0.ygxxdws.mongodb.net/epsoldev?retryWrites=true&w=majority&appName=Cluster0';
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Contact.deleteMany({});
    console.log('🗑️  Cleared existing contacts');

    const insertedContacts = await Contact.insertMany(sampleContacts);
    console.log(`✅ Successfully seeded ${insertedContacts.length} contacts`);

    console.log('\n📋 Created contacts:');
    insertedContacts.forEach(contact => {
      console.log(`  - ${contact.name} (${contact.email}) - ${contact.subject} - ${contact.status} - ${contact.priority}`);
    });

    console.log('\n🎉 Contact seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding contacts:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

seedContacts();

export default seedContacts;
