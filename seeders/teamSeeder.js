import mongoose from 'mongoose';
import Team from '../models/Team.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleTeamMembers = [
  {
    name: 'Jane Doe',
    position: 'Founder & CEO',
    email: 'jane@epsoldev.com',
    bio: 'Jane has over 15 years of experience in software development and business leadership. She specializes in **strategic planning** and **team building**, with a passion for creating innovative solutions that drive business growth.',
    avatar: '/images/team/jane.jpg',
    order: 1,
    status: 'active',
    department: 'Leadership',
    skills: ['Strategic Planning', 'Team Leadership', 'Business Development', 'Product Strategy'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/janedoe',
      twitter: 'https://twitter.com/janedoe',
      github: 'https://github.com/janedoe',
      website: 'https://janedoe.dev'
    }
  },
  {
    name: 'John Smith',
    position: 'Lead Developer',
    email: 'john@epsoldev.com',
    bio: 'John specializes in **full-stack development** with expertise in React, Node.js, and cloud infrastructure. He has led numerous successful projects and is passionate about clean code and best practices.',
    avatar: '/images/team/john.jpg',
    order: 2,
    status: 'active',
    department: 'Engineering',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'MongoDB'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/johnsmith',
      twitter: 'https://twitter.com/johnsmith',
      github: 'https://github.com/johnsmith',
      website: 'https://johnsmith.dev'
    }
  },
  {
    name: 'Emily Johnson',
    position: 'UI/UX Designer',
    email: 'emily@epsoldev.com',
    bio: 'Emily creates beautiful, intuitive interfaces that elevate the user experience across all our projects. She has a keen eye for **design systems** and **user-centered design** principles.',
    avatar: '/images/team/emily.jpg',
    order: 3,
    status: 'active',
    department: 'Design',
    skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/emilyjohnson',
      twitter: 'https://twitter.com/emilyjohnson',
      github: 'https://github.com/emilyjohnson',
      website: 'https://emilyjohnson.design'
    }
  },
  {
    name: 'Michael Lee',
    position: 'Mobile Developer',
    email: 'michael@epsoldev.com',
    bio: 'Michael specializes in **native iOS and Android development**, creating seamless mobile experiences. He has published over 20 apps and is an expert in mobile performance optimization.',
    avatar: '/images/team/michael.jpg',
    order: 4,
    status: 'active',
    department: 'Engineering',
    skills: ['iOS Development', 'Android Development', 'Swift', 'Kotlin', 'React Native', 'Flutter'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/michaellee',
      twitter: 'https://twitter.com/michaellee',
      github: 'https://github.com/michaellee',
      website: 'https://michaellee.dev'
    }
  },
  {
    name: 'Sarah Williams',
    position: 'Project Manager',
    email: 'sarah@epsoldev.com',
    bio: 'Sarah ensures all our projects run smoothly and are delivered on time with exceptional quality. She excels in **agile methodologies** and **stakeholder communication**.',
    avatar: '/images/team/sarah.jpg',
    order: 5,
    status: 'active',
    department: 'Project Management',
    skills: ['Agile/Scrum', 'Project Planning', 'Risk Management', 'Team Coordination', 'Client Relations'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahwilliams',
      twitter: 'https://twitter.com/sarahwilliams',
      github: 'https://github.com/sarahwilliams',
      website: 'https://sarahwilliams.pm'
    }
  },
  {
    name: 'David Chen',
    position: 'Backend Developer',
    email: 'david@epsoldev.com',
    bio: 'David focuses on building **robust, scalable backend systems** and database architecture. He has extensive experience with microservices and cloud-native applications.',
    avatar: '/images/team/david.jpg',
    order: 6,
    status: 'active',
    department: 'Engineering',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/davidchen',
      twitter: 'https://twitter.com/davidchen',
      github: 'https://github.com/davidchen',
      website: 'https://davidchen.dev'
    }
  },
  {
    name: 'Lisa Rodriguez',
    position: 'DevOps Engineer',
    email: 'lisa@epsoldev.com',
    bio: 'Lisa manages our **infrastructure and deployment pipelines**, ensuring reliable and secure operations. She specializes in CI/CD and cloud infrastructure automation.',
    avatar: '/images/team/lisa.jpg',
    order: 7,
    status: 'active',
    department: 'Engineering',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Monitoring'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/lisarodriguez',
      twitter: 'https://twitter.com/lisarodriguez',
      github: 'https://github.com/lisarodriguez',
      website: 'https://lisarodriguez.dev'
    }
  },
  {
    name: 'Alex Thompson',
    position: 'QA Engineer',
    email: 'alex@epsoldev.com',
    bio: 'Alex ensures **quality and reliability** across all our products through comprehensive testing strategies. He has a passion for automation and continuous improvement.',
    avatar: '/images/team/alex.jpg',
    order: 8,
    status: 'active',
    department: 'Quality Assurance',
    skills: ['Test Automation', 'Selenium', 'Jest', 'Cypress', 'Performance Testing', 'Security Testing'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/alexthompson',
      twitter: 'https://twitter.com/alexthompson',
      github: 'https://github.com/alexthompson',
      website: 'https://alexthompson.qa'
    }
  }
];

const seedTeamMembers = async () => {
  try {
    console.log('🚀 Starting team member seeder...');
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://khizarjamshaidiqbal:uJLam6FepeeYgpWL@cluster0.ygxxdws.mongodb.net/epsoldev?retryWrites=true&w=majority&appName=Cluster0';
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Team.deleteMany({});
    console.log('🗑️  Cleared existing team members');

    const insertedTeamMembers = await Team.insertMany(sampleTeamMembers);
    console.log(`✅ Successfully seeded ${insertedTeamMembers.length} team members`);

    console.log('\n📋 Created team members:');
    insertedTeamMembers.forEach(member => {
      console.log(`  - ${member.name} (${member.position}) - ${member.department} - Order: ${member.order}`);
    });

    console.log('\n🎉 Team member seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding team members:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

seedTeamMembers();

export default seedTeamMembers;
