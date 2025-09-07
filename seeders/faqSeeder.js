import mongoose from 'mongoose';
import FAQ from '../models/FAQ.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleFAQs = [
  // General FAQs
  {
    question: 'What services does EpsolDev offer?',
    answer: 'EpsolDev offers comprehensive web development services including frontend development, backend development, full-stack development, mobile app development, UI/UX design, and digital consulting. We specialize in React, Node.js, MongoDB, and modern web technologies.',
    category: 'general',
    tags: ['services', 'web development', 'overview'],
    status: 'active',
    order: 1,
    featured: true,
    views: 150,
    helpful: 25,
    notHelpful: 2,
    createdBy: '507f1f77bcf86cd799439011'
  },
  {
    question: 'How can I contact EpsolDev for a project?',
    answer: 'You can contact us through multiple channels: Email us at info@epsoldev.com, call us at +92 3107923290, or fill out our project request form on the website. We typically respond within 24 hours during business days.',
    category: 'general',
    tags: ['contact', 'project', 'communication'],
    status: 'active',
    order: 2,
    featured: true,
    views: 120,
    helpful: 18,
    notHelpful: 1,
    createdBy: '507f1f77bcf86cd799439011'
  },
  {
    question: 'What is the typical project timeline?',
    answer: 'Project timelines vary depending on complexity. Simple websites take 2-4 weeks, medium projects 1-3 months, and complex applications 3-6 months. We provide detailed timelines during the initial consultation and keep you updated throughout the process.',
    category: 'general',
    tags: ['timeline', 'project duration', 'planning'],
    status: 'active',
    order: 3,
    featured: false,
    views: 95,
    helpful: 15,
    notHelpful: 3,
    createdBy: '507f1f77bcf86cd799439011'
  },

  // Technical FAQs
  {
    question: 'What technologies do you use for development?',
    answer: 'We use modern, industry-standard technologies including React.js, Next.js, Node.js, Express.js, MongoDB, PostgreSQL, TypeScript, and various cloud platforms. We choose the best technology stack based on your specific project requirements.',
    category: 'technical',
    tags: ['technologies', 'stack', 'development'],
    status: 'active',
    order: 1,
    featured: true,
    views: 180,
    helpful: 30,
    notHelpful: 2,
    createdBy: '507f1f77bcf86cd799439011'
  },
  {
    question: 'Do you provide hosting and domain services?',
    answer: 'Yes, we provide comprehensive hosting solutions including cloud hosting, domain registration, SSL certificates, and ongoing maintenance. We can also work with your existing hosting provider if preferred.',
    category: 'technical',
    tags: ['hosting', 'domain', 'deployment'],
    status: 'active',
    order: 2,
    featured: false,
    views: 85,
    helpful: 12,
    notHelpful: 1,
    createdBy: '507f1f77bcf86cd799439011'
  },
  {
    question: 'Can you work with existing codebases?',
    answer: 'Absolutely! We can work with existing codebases, refactor legacy code, add new features, or migrate to modern technologies. We conduct a thorough code review and provide recommendations for improvements.',
    category: 'technical',
    tags: ['legacy', 'refactoring', 'maintenance'],
    status: 'active',
    order: 3,
    featured: false,
    views: 70,
    helpful: 10,
    notHelpful: 2,
    createdBy: '507f1f77bcf86cd799439011'
  },

  // Billing FAQs
  {
    question: 'What are your pricing models?',
    answer: 'We offer flexible pricing models: Fixed price for well-defined projects, hourly rates for ongoing work, and monthly retainers for maintenance. We provide detailed quotes after understanding your requirements and can work within your budget.',
    category: 'billing',
    tags: ['pricing', 'cost', 'budget'],
    status: 'active',
    order: 1,
    featured: true,
    views: 200,
    helpful: 35,
    notHelpful: 5,
    createdBy: '507f1f77bcf86cd799439011'
  },
  {
    question: 'Do you require upfront payment?',
    answer: 'We typically require a 50% upfront payment to begin work, with the remaining 50% due upon project completion. For larger projects, we can arrange milestone-based payments. We accept various payment methods including bank transfers and digital payments.',
    category: 'billing',
    tags: ['payment', 'deposit', 'milestones'],
    status: 'active',
    order: 2,
    featured: false,
    views: 110,
    helpful: 20,
    notHelpful: 3,
    createdBy: '507f1f77bcf86cd799439011'
  },
  {
    question: 'Do you provide maintenance packages?',
    answer: 'Yes, we offer various maintenance packages including bug fixes, security updates, performance optimization, and feature additions. Packages can be monthly or annual, and we provide detailed reports of all work performed.',
    category: 'billing',
    tags: ['maintenance', 'support', 'updates'],
    status: 'active',
    order: 3,
    featured: false,
    views: 75,
    helpful: 12,
    notHelpful: 1,
    createdBy: '507f1f77bcf86cd799439011'
  },

  // Account FAQs
  {
    question: 'How do I access my project dashboard?',
    answer: 'Once your project begins, we provide you with access to a project dashboard where you can track progress, view milestones, communicate with the team, and access project files. Login credentials are sent via email.',
    category: 'account',
    tags: ['dashboard', 'access', 'project management'],
    status: 'active',
    order: 1,
    featured: false,
    views: 60,
    helpful: 8,
    notHelpful: 1,
    createdBy: '507f1f77bcf86cd799439011'
  },
  {
    question: 'Can I request changes during development?',
    answer: 'Yes, we encourage feedback and can accommodate changes during development. Minor changes are usually included, while major scope changes may require timeline or budget adjustments. We maintain clear communication throughout the process.',
    category: 'account',
    tags: ['changes', 'feedback', 'scope'],
    status: 'active',
    order: 2,
    featured: false,
    views: 90,
    helpful: 15,
    notHelpful: 2,
    createdBy: '507f1f77bcf86cd799439011'
  },

  // Services FAQs
  {
    question: 'Do you provide SEO optimization?',
    answer: 'Yes, we provide comprehensive SEO services including on-page optimization, technical SEO, content optimization, and performance improvements. We also offer ongoing SEO maintenance and monitoring services.',
    category: 'services',
    tags: ['SEO', 'optimization', 'marketing'],
    status: 'active',
    order: 1,
    featured: false,
    views: 100,
    helpful: 18,
    notHelpful: 2,
    createdBy: '507f1f77bcf86cd799439011'
  },
  {
    question: 'Can you integrate third-party APIs?',
    answer: 'Absolutely! We have extensive experience integrating various third-party APIs including payment gateways, social media platforms, email services, analytics tools, and custom APIs. We ensure secure and efficient integration.',
    category: 'services',
    tags: ['APIs', 'integration', 'third-party'],
    status: 'active',
    order: 2,
    featured: false,
    views: 80,
    helpful: 14,
    notHelpful: 1,
    createdBy: '507f1f77bcf86cd799439011'
  },

  // Support FAQs
  {
    question: 'What support do you provide after launch?',
    answer: 'We provide comprehensive post-launch support including bug fixes, performance monitoring, security updates, and user training. We offer various support packages and are available for emergency issues 24/7.',
    category: 'support',
    tags: ['support', 'post-launch', 'maintenance'],
    status: 'active',
    order: 1,
    featured: true,
    views: 140,
    helpful: 25,
    notHelpful: 3,
    createdBy: '507f1f77bcf86cd799439011'
  },
  {
    question: 'How do you handle security and data protection?',
    answer: 'We follow industry best practices for security including HTTPS, data encryption, secure coding practices, regular security audits, and compliance with data protection regulations. We never store sensitive data unnecessarily.',
    category: 'support',
    tags: ['security', 'data protection', 'privacy'],
    status: 'active',
    order: 2,
    featured: false,
    views: 95,
    helpful: 16,
    notHelpful: 2,
    createdBy: '507f1f77bcf86cd799439011'
  }
];

const seedFAQs = async () => {
  try {
    console.log('🚀 Starting FAQ seeder...');
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://khizarjamshaidiqbal:uJLam6FepeeYgpWL@cluster0.ygxxdws.mongodb.net/epsoldev?retryWrites=true&w=majority&appName=Cluster0';
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await FAQ.deleteMany({});
    console.log('🗑️  Cleared existing FAQs');

    const insertedFAQs = await FAQ.insertMany(sampleFAQs);
    console.log(`✅ Successfully seeded ${insertedFAQs.length} FAQs`);

    console.log('\n📋 Created FAQs by category:');
    const categoryCounts = {};
    insertedFAQs.forEach(faq => {
      categoryCounts[faq.category] = (categoryCounts[faq.category] || 0) + 1;
    });
    
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count} FAQs`);
    });

    console.log('\n🎉 FAQ seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding FAQs:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

seedFAQs();

export default seedFAQs;
