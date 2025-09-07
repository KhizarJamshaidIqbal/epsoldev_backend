import mongoose from 'mongoose';
import Content from '../models/Content.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleContent = [
  // About Us Content
  {
    type: 'about',
    title: 'About EPSOL Dev',
    subtitle: 'Building innovative digital solutions since 2018',
    description: `EPSOL Dev is a leading software development company focused on creating cutting-edge solutions that help businesses thrive in the digital landscape. Founded in 2018, we've grown from a small team of passionate developers to a full-service digital agency with expertise across multiple technologies and industries.

Our mission is to empower businesses through innovative technology solutions that drive growth, enhance efficiency, and create exceptional user experiences.

With a team of skilled developers, designers, and strategists, we take pride in delivering high-quality software solutions that address real business challenges. Whether you're a startup looking to build your first MVP or an established enterprise seeking digital transformation, our tailored approach ensures that we deliver solutions aligned with your specific goals and requirements.`,
    mission: 'To empower organizations through custom software solutions that transform their operations, enhance user experiences, and accelerate growth.',
    vision: 'To be the preferred technology partner for businesses seeking innovative digital solutions that drive real-world impact.',
    values: [
      'Excellence - We are committed to delivering the highest quality in everything we do.',
      'Innovation - We embrace new technologies and creative approaches to solve complex problems.',
      'Integrity - We maintain honesty, transparency, and ethical standards in all our interactions.',
      'Collaboration - We work closely with our clients, fostering partnerships based on trust and mutual respect.',
      'Continuous Improvement - We constantly seek to learn, grow, and enhance our processes and solutions.'
    ],
    status: 'active',
    createdBy: '507f1f77bcf86cd799439011'
  },
  // Privacy Policy Content
  {
    type: 'privacy',
    title: 'Privacy Policy',
    subtitle: 'How we protect and handle your information',
    description: 'This Privacy Policy describes how EPSOL Dev collects, uses, and protects your personal information when you use our services.',
    content: 'Our comprehensive privacy policy ensures your data is protected and handled responsibly.',
    lastUpdated: new Date('2024-03-15'),
    sections: [
      {
        title: '1. Information We Collect',
        content: 'We collect information that you provide directly to us, including: name and contact information, account credentials, payment information, and communication preferences.'
      },
      {
        title: '2. How We Use Your Information',
        content: 'We use the information we collect to: provide and maintain our services, process your transactions, send you technical notices and support messages, and communicate with you about products, services, and events.'
      },
      {
        title: '3. Information Sharing',
        content: 'We do not sell or rent your personal information to third parties. We may share your information with: service providers and business partners, legal authorities when required by law, and other parties with your consent.'
      },
      {
        title: '4. Data Security',
        content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
      },
      {
        title: '5. Your Rights',
        content: 'You have the right to: access your personal information, correct inaccurate data, request deletion of your data, and object to data processing.'
      }
    ],
    status: 'active',
    createdBy: '507f1f77bcf86cd799439011'
  },
  // Terms of Service Content
  {
    type: 'terms',
    title: 'Terms of Service',
    subtitle: 'Our terms and conditions for using our services',
    description: 'These Terms of Service govern your use of EPSOL Dev services and outline the rights and responsibilities of both parties.',
    content: 'Our terms of service establish the framework for our business relationship and service delivery.',
    lastUpdated: new Date('2024-03-15'),
    sections: [
      {
        title: '1. Acceptance of Terms',
        content: 'By accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.'
      },
      {
        title: '2. Description of Services',
        content: 'EPSOL Dev provides software development, web development, mobile app development, and related digital services as described on our website and in service agreements.'
      },
      {
        title: '3. User Responsibilities',
        content: 'Users are responsible for: providing accurate information, maintaining the confidentiality of account credentials, using services in compliance with applicable laws, and paying agreed-upon fees for services rendered.'
      },
      {
        title: '4. Intellectual Property',
        content: 'Unless otherwise specified in a service agreement: we retain ownership of our proprietary code, frameworks, and tools; clients receive ownership of custom code developed specifically for their project; open source components remain subject to their original licenses.'
      },
      {
        title: '5. Limitation of Liability',
        content: 'EPSOL Dev shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services.'
      }
    ],
    status: 'active',
    createdBy: '507f1f77bcf86cd799439011'
  },
  // Cookie Policy Content
  {
    type: 'cookies',
    title: 'Cookie Policy',
    subtitle: 'How we use cookies and similar technologies',
    description: 'This Cookie Policy explains how EPSOL Dev uses cookies and similar technologies to enhance your browsing experience.',
    content: 'Our cookie policy explains how we use cookies to improve your experience on our website.',
    lastUpdated: new Date('2024-03-15'),
    sections: [
      {
        title: '1. What Are Cookies',
        content: 'Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.'
      },
      {
        title: '2. How We Use Cookies',
        content: 'We use cookies for the following purposes: to enable certain functions of the website, to provide analytics, to store your preferences, and to enable advertisements delivery, including behavioral advertising.'
      },
      {
        title: '3. Types of Cookies We Use',
        content: 'We use the following types of cookies: essential cookies that are required for operation; analytical/performance cookies that recognize and count visitors; functionality cookies that recognize you when you return; and targeting cookies that record your visit, pages visited, and links followed.'
      },
      {
        title: '4. How to Control Cookies',
        content: 'You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.'
      }
    ],
    status: 'active',
    createdBy: '507f1f77bcf86cd799439011'
  }
];

const seedContent = async () => {
  try {
    console.log('🚀 Starting Content seeder...');
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://khizarjamshaidiqbal:uJLam6FepeeYgpWL@cluster0.ygxxdws.mongodb.net/epsoldev?retryWrites=true&w=majority&appName=Cluster0';
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Content.deleteMany({});
    console.log('🗑️  Cleared existing content');

    const insertedContent = await Content.insertMany(sampleContent);
    console.log(`✅ Successfully seeded ${insertedContent.length} content items`);

    console.log('\n📋 Created content by type:');
    const typeCounts = {};
    insertedContent.forEach(content => {
      typeCounts[content.type] = (typeCounts[content.type] || 0) + 1;
    });
    
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count} items`);
    });

    console.log('\n🎉 Content seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding content:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

seedContent();

export default seedContent;
