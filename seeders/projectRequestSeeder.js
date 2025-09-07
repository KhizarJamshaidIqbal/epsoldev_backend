import mongoose from 'mongoose';
import ProjectRequest from '../models/ProjectRequest.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleProjectRequests = [
  {
    clientName: 'Sarah Johnson',
    companyName: 'Innovate Solutions',
    email: 'sarah@innovatesolutions.com',
    phone: '+1 (555) 123-4567',
    projectType: 'Mobile App',
    budget: '$15,000 - $25,000',
    timeline: '3-4 months',
    description: 'We need a cross-platform mobile app for our service business that allows customers to book appointments, view service history, and receive notifications.',
    status: 'new_request',
    priority: 'high',
    source: 'website',
    notes: 'Client is very interested in getting started quickly. Has budget approved.',
    assignedTo: 'John Smith'
  },
  {
    clientName: 'Michael Brown',
    companyName: 'Global Retail Inc.',
    email: 'michael@globalretail.com',
    phone: '+1 (555) 234-5678',
    projectType: 'E-commerce Website',
    budget: '$30,000 - $50,000',
    timeline: '4-6 months',
    description: 'Looking to build a modern e-commerce platform with inventory management, payment processing, and customer analytics.',
    status: 'contacted',
    priority: 'medium',
    source: 'referral',
    notes: 'Follow up scheduled for next week. Client wants to see portfolio examples.',
    assignedTo: 'Emily Johnson'
  },
  {
    clientName: 'Emily Wilson',
    companyName: 'HealthTech Solutions',
    email: 'emily@healthtech.com',
    phone: '+1 (555) 345-6789',
    projectType: 'Web Application',
    budget: '$50,000 - $75,000',
    timeline: '6-8 months',
    description: 'Need a comprehensive healthcare management system with patient records, appointment scheduling, and billing integration.',
    status: 'proposal_sent',
    priority: 'high',
    source: 'social_media',
    notes: 'Proposal sent. Waiting for client feedback. High-value project.',
    assignedTo: 'David Chen'
  },
  {
    clientName: 'David Chen',
    companyName: 'TechStart',
    email: 'david@techstart.com',
    phone: '+1 (555) 456-7890',
    projectType: 'Mobile App',
    budget: '$20,000 - $35,000',
    timeline: '3-5 months',
    description: 'Startup looking for a mobile app to connect local service providers with customers. Need real-time messaging and payment features.',
    status: 'in_negotiation',
    priority: 'medium',
    source: 'email',
    notes: 'Negotiating terms and timeline. Client is flexible with budget.',
    assignedTo: 'Michael Lee'
  },
  {
    clientName: 'Robert Martinez',
    companyName: 'FinServe Corp',
    email: 'robert@finserve.com',
    phone: '+1 (555) 567-8901',
    projectType: 'Web Application',
    budget: '$100,000 - $150,000',
    timeline: '8-12 months',
    description: 'Large-scale financial services platform with advanced security, compliance features, and integration with banking APIs.',
    status: 'accepted',
    priority: 'urgent',
    source: 'referral',
    notes: 'Project accepted! Starting development phase next month.',
    assignedTo: 'Lisa Rodriguez'
  },
  {
    clientName: 'Jennifer Davis',
    companyName: 'EduTech Innovations',
    email: 'jennifer@edutech.com',
    phone: '+1 (555) 678-9012',
    projectType: 'Web Application',
    budget: '$40,000 - $60,000',
    timeline: '5-7 months',
    description: 'Educational platform for online learning with video streaming, interactive quizzes, and progress tracking.',
    status: 'declined',
    priority: 'low',
    source: 'website',
    notes: 'Client decided to go with another vendor due to timeline constraints.',
    assignedTo: 'Alex Thompson'
  },
  {
    clientName: 'Thomas Anderson',
    companyName: 'Green Energy Co.',
    email: 'thomas@greenenergy.com',
    phone: '+1 (555) 789-0123',
    projectType: 'Mobile App',
    budget: '$25,000 - $40,000',
    timeline: '4-6 months',
    description: 'Mobile app for monitoring renewable energy systems with real-time data visualization and alert notifications.',
    status: 'completed',
    priority: 'medium',
    source: 'referral',
    notes: 'Project completed successfully. Client is very satisfied with the results.',
    assignedTo: 'Sarah Williams'
  },
  {
    clientName: 'Lisa Garcia',
    companyName: 'FoodTech Solutions',
    email: 'lisa@foodtech.com',
    phone: '+1 (555) 890-1234',
    projectType: 'E-commerce Website',
    budget: '$35,000 - $55,000',
    timeline: '4-5 months',
    description: 'Online food delivery platform with restaurant management, order tracking, and customer reviews.',
    status: 'new_request',
    priority: 'high',
    source: 'social_media',
    notes: 'New request from social media campaign. High potential for long-term partnership.',
    assignedTo: 'John Smith'
  },
  {
    clientName: 'James Wilson',
    companyName: 'Real Estate Pro',
    email: 'james@realestatepro.com',
    phone: '+1 (555) 901-2345',
    projectType: 'Web Application',
    budget: '$45,000 - $70,000',
    timeline: '5-8 months',
    description: 'Real estate management system with property listings, client management, and transaction tracking.',
    status: 'contacted',
    priority: 'medium',
    source: 'website',
    notes: 'Initial contact made. Client wants to discuss requirements in detail.',
    assignedTo: 'Emily Johnson'
  },
  {
    clientName: 'Maria Rodriguez',
    companyName: 'Fitness Studio',
    email: 'maria@fitnessstudio.com',
    phone: '+1 (555) 012-3456',
    projectType: 'Mobile App',
    budget: '$18,000 - $28,000',
    timeline: '3-4 months',
    description: 'Fitness tracking app with workout plans, progress monitoring, and social features for gym members.',
    status: 'proposal_sent',
    priority: 'medium',
    source: 'email',
    notes: 'Proposal sent. Client is reviewing the details and timeline.',
    assignedTo: 'Michael Lee'
  }
];

const seedProjectRequests = async () => {
  try {
    console.log('🚀 Starting project request seeder...');
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://khizarjamshaidiqbal:uJLam6FepeeYgpWL@cluster0.ygxxdws.mongodb.net/epsoldev?retryWrites=true&w=majority&appName=Cluster0';
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await ProjectRequest.deleteMany({});
    console.log('🗑️  Cleared existing project requests');

    const insertedProjectRequests = await ProjectRequest.insertMany(sampleProjectRequests);
    console.log(`✅ Successfully seeded ${insertedProjectRequests.length} project requests`);

    console.log('\n📋 Created project requests:');
    insertedProjectRequests.forEach(request => {
      console.log(`  - ${request.clientName} (${request.companyName}) - ${request.projectType} - ${request.status} - $${request.budget}`);
    });

    console.log('\n🎉 Project request seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding project requests:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

seedProjectRequests();

export default seedProjectRequests;
