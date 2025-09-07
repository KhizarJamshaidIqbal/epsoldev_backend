import mongoose from 'mongoose';
import Portfolio from '../models/Portfolio.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const sampleProjects = [
  {
    title: 'E-commerce Website Redesign',
    client: 'Fashion Boutique',
    category: 'Web Development',
    description: 'Complete redesign of an e-commerce platform with improved user experience and mobile responsiveness. The project involved modernizing the entire shopping experience with advanced filtering, real-time inventory updates, and seamless checkout process.',
    shortDescription: 'Complete redesign of an e-commerce platform with improved user experience and mobile responsiveness.',
    image: '/images/projects/project1.jpg',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
    tags: ['E-commerce', 'Full-stack', 'Payment Integration', 'Responsive Design'],
    demoUrl: 'https://fashion-boutique-demo.com',
    githubUrl: 'https://github.com/epsoldev/fashion-boutique',
    status: 'published',
    featured: true,
    completedAt: new Date('2023-11-15')
  },
  {
    title: 'Food Delivery Mobile App',
    client: 'Quick Bites',
    category: 'Mobile App',
    description: 'A feature-rich food delivery application for iOS and Android with real-time order tracking, payment integration, and restaurant management system. The app includes GPS tracking, push notifications, and a comprehensive admin dashboard.',
    shortDescription: 'A feature-rich food delivery application for iOS and Android with real-time order tracking.',
    image: '/images/projects/project2.jpg',
    technologies: ['React Native', 'Firebase', 'Google Maps API', 'Stripe'],
    tags: ['Mobile App', 'Food Delivery', 'Real-time Tracking', 'Payment Integration'],
    demoUrl: 'https://quickbites-app.com',
    githubUrl: 'https://github.com/epsoldev/quickbites-app',
    status: 'published',
    featured: true,
    completedAt: new Date('2023-10-22')
  },
  {
    title: 'Corporate Website',
    client: 'InvestCorp',
    category: 'Web Development',
    description: 'Modern corporate website with custom CMS integration and multilingual support. The website features investor relations portal, news section, and interactive financial dashboards with real-time data integration.',
    shortDescription: 'Modern corporate website with custom CMS integration and multilingual support.',
    image: '/images/projects/project3.jpg',
    technologies: ['Next.js', 'TypeScript', 'Strapi CMS', 'PostgreSQL'],
    tags: ['Corporate Website', 'CMS', 'Multilingual', 'Investor Relations'],
    demoUrl: 'https://investcorp.com',
    githubUrl: 'https://github.com/epsoldev/investcorp-website',
    status: 'published',
    featured: false,
    completedAt: new Date('2023-09-10')
  },
  {
    title: 'Inventory Management System',
    client: 'Global Logistics',
    category: 'Software Development',
    description: 'Custom inventory tracking system with barcode scanning and analytics dashboard. The system includes warehouse management, supplier integration, and advanced reporting capabilities with predictive analytics.',
    shortDescription: 'Custom inventory tracking system with barcode scanning and analytics dashboard.',
    image: '/images/projects/project4.jpg',
    technologies: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'],
    tags: ['Inventory Management', 'Barcode Scanning', 'Analytics', 'Warehouse Management'],
    demoUrl: 'https://inventory.globallogistics.com',
    githubUrl: 'https://github.com/epsoldev/inventory-system',
    status: 'published',
    featured: false,
    completedAt: new Date('2023-08-05')
  },
  {
    title: 'Healthcare Patient Portal',
    client: 'MediCare Clinic',
    category: 'Web Application',
    description: 'Secure patient portal allowing appointment scheduling and medical record access. The portal includes HIPAA compliance, telemedicine integration, and automated appointment reminders with SMS/email notifications.',
    shortDescription: 'Secure patient portal allowing appointment scheduling and medical record access.',
    image: '/images/projects/project5.jpg',
    technologies: ['Vue.js', 'Laravel', 'MySQL', 'Twilio', 'AWS'],
    tags: ['Healthcare', 'Patient Portal', 'HIPAA Compliant', 'Telemedicine'],
    demoUrl: 'https://patient.medicareclinic.com',
    githubUrl: 'https://github.com/epsoldev/patient-portal',
    status: 'published',
    featured: true,
    completedAt: new Date('2023-07-20')
  },
  {
    title: 'Fitness Tracking App',
    client: 'FitLife',
    category: 'Mobile App',
    description: 'Comprehensive fitness tracking application with workout plans and nutrition logging. The app includes social features, progress tracking, and integration with wearable devices for real-time health monitoring.',
    shortDescription: 'Comprehensive fitness tracking application with workout plans and nutrition logging.',
    image: '/images/projects/project6.jpg',
    technologies: ['Flutter', 'Firebase', 'HealthKit', 'Google Fit API'],
    tags: ['Fitness App', 'Health Tracking', 'Wearable Integration', 'Social Features'],
    demoUrl: 'https://fitlife-app.com',
    githubUrl: 'https://github.com/epsoldev/fitlife-app',
    status: 'published',
    featured: false,
    completedAt: new Date('2023-06-15')
  },
  {
    title: 'Real Estate Platform',
    client: 'HomeFinderPro',
    category: 'Web Development',
    description: 'Property listing platform with advanced search features and virtual tours. The platform includes mortgage calculator, property comparison tools, and integration with MLS databases for real-time listings.',
    shortDescription: 'Property listing platform with advanced search features and virtual tours.',
    image: '/images/projects/project7.jpg',
    technologies: ['React', 'Node.js', 'MongoDB', 'Google Maps API', 'Stripe'],
    tags: ['Real Estate', 'Property Listing', 'Virtual Tours', 'MLS Integration'],
    demoUrl: 'https://homefinderpro.com',
    githubUrl: 'https://github.com/epsoldev/real-estate-platform',
    status: 'published',
    featured: true,
    completedAt: new Date('2023-05-10')
  },
  {
    title: 'Travel Booking System',
    client: 'ExploreWorld',
    category: 'Web Application',
    description: 'Comprehensive travel booking system with flight, hotel, and experience packages. The system includes dynamic pricing, loyalty program integration, and multi-currency support with real-time availability checking.',
    shortDescription: 'Comprehensive travel booking system with flight, hotel, and experience packages.',
    image: '/images/projects/project8.jpg',
    technologies: ['Angular', 'Spring Boot', 'MySQL', 'Redis', 'Payment Gateway APIs'],
    demoUrl: 'https://exploreworld.com',
    githubUrl: 'https://github.com/epsoldev/travel-booking',
    status: 'published',
    featured: false,
    completedAt: new Date('2023-04-05')
  },
  {
    title: 'Educational Learning Platform',
    client: 'EduTech Inc.',
    category: 'Web Development',
    description: 'Interactive learning management system with course creation tools and student progress tracking. The platform includes video streaming, interactive quizzes, and AI-powered personalized learning recommendations.',
    shortDescription: 'Interactive learning management system with course creation tools and student progress tracking.',
    image: '/images/projects/project9.jpg',
    technologies: ['React', 'Django', 'PostgreSQL', 'AWS S3', 'WebRTC'],
    demoUrl: 'https://edutech-platform.com',
    githubUrl: 'https://github.com/epsoldev/learning-platform',
    status: 'published',
    featured: true,
    completedAt: new Date('2023-03-20')
  },
  {
    title: 'Restaurant Management App',
    client: 'Fine Dining Group',
    category: 'Software Development',
    description: 'Integrated solution for table reservations, order management, and inventory control. The system includes POS integration, customer relationship management, and analytics dashboard for business insights.',
    shortDescription: 'Integrated solution for table reservations, order management, and inventory control.',
    image: '/images/projects/project10.jpg',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Socket.io', 'Stripe'],
    demoUrl: 'https://restaurant.finedininggroup.com',
    githubUrl: 'https://github.com/epsoldev/restaurant-management',
    status: 'published',
    featured: false,
    completedAt: new Date('2023-02-15')
  },
  {
    title: 'Event Management Platform',
    client: 'EventPro',
    category: 'Web Application',
    description: 'Comprehensive event planning and ticketing system with attendee management. The platform includes event promotion tools, ticket sales, and real-time analytics for event organizers.',
    shortDescription: 'Comprehensive event planning and ticketing system with attendee management.',
    image: '/images/projects/project11.jpg',
    technologies: ['Vue.js', 'Laravel', 'MySQL', 'Stripe', 'SendGrid'],
    demoUrl: 'https://eventpro.com',
    githubUrl: 'https://github.com/epsoldev/event-management',
    status: 'published',
    featured: true,
    completedAt: new Date('2023-01-10')
  },
  {
    title: 'Financial Dashboard',
    client: 'InvestSmart',
    category: 'Software Development',
    description: 'Real-time financial analytics dashboard with customizable widgets and reports. The dashboard includes portfolio tracking, market data integration, and automated trading signals with risk management tools.',
    shortDescription: 'Real-time financial analytics dashboard with customizable widgets and reports.',
    image: '/images/projects/project12.jpg',
    technologies: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'Redis'],
    demoUrl: 'https://dashboard.investsmart.com',
    githubUrl: 'https://github.com/epsoldev/financial-dashboard',
    status: 'published',
    featured: false,
    completedAt: new Date('2022-12-05')
  },
  {
    title: 'Social Media App',
    client: 'ConnectMe',
    category: 'Mobile App',
    description: 'Feature-rich social networking application with multimedia sharing and live streaming. The app includes content moderation, recommendation algorithms, and monetization features for content creators.',
    shortDescription: 'Feature-rich social networking application with multimedia sharing and live streaming.',
    image: '/images/projects/project13.jpg',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'WebRTC', 'AWS'],
    demoUrl: 'https://connectme-app.com',
    githubUrl: 'https://github.com/epsoldev/social-media-app',
    status: 'published',
    featured: true,
    completedAt: new Date('2022-11-20')
  },
  {
    title: 'HR Management System',
    client: 'Corporate Solutions',
    category: 'Software Development',
    description: 'Comprehensive HR platform for employee management, payroll, and performance tracking. The system includes recruitment tools, employee self-service portal, and compliance reporting with automated workflows.',
    shortDescription: 'Comprehensive HR platform for employee management, payroll, and performance tracking.',
    image: '/images/projects/project14.jpg',
    technologies: ['Angular', 'Spring Boot', 'PostgreSQL', 'Redis', 'Docker'],
    demoUrl: 'https://hr.corporatesolutions.com',
    githubUrl: 'https://github.com/epsoldev/hr-management',
    status: 'published',
    featured: false,
    completedAt: new Date('2022-10-15')
  },
  {
    title: 'News Portal',
    client: 'Global News Network',
    category: 'Web Development',
    description: 'High-traffic news website with content management system and subscription features. The portal includes real-time news updates, multimedia content, and personalized news recommendations with AI.',
    shortDescription: 'High-traffic news website with content management system and subscription features.',
    image: '/images/projects/project15.jpg',
    technologies: ['Next.js', 'Strapi CMS', 'PostgreSQL', 'Redis', 'CDN'],
    demoUrl: 'https://globalnews.com',
    githubUrl: 'https://github.com/epsoldev/news-portal',
    status: 'published',
    featured: true,
    completedAt: new Date('2022-09-10')
  }
];

const seedPortfolio = async () => {
  try {
    console.log('🚀 Starting portfolio seeder...');
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://khizarjamshaidiqbal:uJLam6FepeeYgpWL@cluster0.ygxxdws.mongodb.net/epsoldev?retryWrites=true&w=majority&appName=Cluster0';
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing portfolio items
    await Portfolio.deleteMany({});
    console.log('🗑️  Cleared existing portfolio items');

    // Insert sample projects one by one to ensure slug generation works properly
    const insertedProjects = [];
    for (const projectData of sampleProjects) {
      const project = new Portfolio(projectData);
      const savedProject = await project.save();
      insertedProjects.push(savedProject);
    }
    console.log(`✅ Successfully seeded ${insertedProjects.length} portfolio projects`);

    // Display created projects
    console.log('\n📋 Created projects:');
    insertedProjects.forEach(project => {
      console.log(`  - ${project.title} (${project.category}) - ${project.featured ? 'Featured' : 'Regular'}`);
    });

    console.log('\n🎉 Portfolio seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding portfolio:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seeder if this file is executed directly
seedPortfolio();

export default seedPortfolio;
