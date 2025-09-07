import mongoose from 'mongoose';
import Tag from '../models/Tag.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const sampleTags = [
  {
    name: 'JavaScript',
    slug: 'javascript',
    description: 'JavaScript programming language and frameworks',
    color: '#F7DF1E',
    type: 'blog',
    count: 0
  },
  {
    name: 'React',
    slug: 'react',
    description: 'React.js library and ecosystem',
    color: '#61DAFB',
    type: 'blog',
    count: 0
  },
  {
    name: 'Node.js',
    slug: 'nodejs',
    description: 'Node.js runtime and server-side development',
    color: '#339933',
    type: 'blog',
    count: 0
  },
  {
    name: 'TypeScript',
    slug: 'typescript',
    description: 'TypeScript programming language',
    color: '#3178C6',
    type: 'blog',
    count: 0
  },
  {
    name: 'Web Development',
    slug: 'web-development',
    description: 'General web development topics',
    color: '#FF6B6B',
    type: 'blog',
    count: 0
  },
  {
    name: 'CSS',
    slug: 'css',
    description: 'CSS styling and design',
    color: '#1572B6',
    type: 'blog',
    count: 0
  },
  {
    name: 'HTML',
    slug: 'html',
    description: 'HTML markup language',
    color: '#E34F26',
    type: 'blog',
    count: 0
  },
  {
    name: 'MongoDB',
    slug: 'mongodb',
    description: 'MongoDB database and NoSQL',
    color: '#47A248',
    type: 'blog',
    count: 0
  },
  {
    name: 'API Development',
    slug: 'api-development',
    description: 'REST APIs and API design',
    color: '#FF6B35',
    type: 'blog',
    count: 0
  },
  {
    name: 'Frontend',
    slug: 'frontend',
    description: 'Frontend development and UI/UX',
    color: '#4ECDC4',
    type: 'portfolio',
    count: 0
  },
  {
    name: 'Backend',
    slug: 'backend',
    description: 'Backend development and server-side',
    color: '#45B7D1',
    type: 'portfolio',
    count: 0
  },
  {
    name: 'Full Stack',
    slug: 'full-stack',
    description: 'Full stack development projects',
    color: '#96CEB4',
    type: 'portfolio',
    count: 0
  },
  {
    name: 'Mobile App',
    slug: 'mobile-app',
    description: 'Mobile application development',
    color: '#FFEAA7',
    type: 'portfolio',
    count: 0
  },
  {
    name: 'E-commerce',
    slug: 'e-commerce',
    description: 'E-commerce and online shopping',
    color: '#DDA0DD',
    type: 'portfolio',
    count: 0
  },
  {
    name: 'UI/UX Design',
    slug: 'ui-ux-design',
    description: 'User interface and user experience design',
    color: '#FFB6C1',
    type: 'general',
    count: 0
  },
  {
    name: 'Database Design',
    slug: 'database-design',
    description: 'Database design and optimization',
    color: '#98D8C8',
    type: 'general',
    count: 0
  },
  {
    name: 'DevOps',
    slug: 'devops',
    description: 'DevOps practices and tools',
    color: '#F39C12',
    type: 'general',
    count: 0
  },
  {
    name: 'Testing',
    slug: 'testing',
    description: 'Software testing and quality assurance',
    color: '#E74C3C',
    type: 'general',
    count: 0
  }
];

const seedTags = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://khizarjamshaidiqbal:uJLam6FepeeYgpWL@cluster0.ygxxdws.mongodb.net/epsoldev?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing tags
    await Tag.deleteMany({});
    console.log('🗑️  Cleared existing tags');

    // Insert sample tags
    const insertedTags = await Tag.insertMany(sampleTags);
    console.log(`✅ Successfully seeded ${insertedTags.length} tags`);

    // Display created tags
    console.log('\n📋 Created tags:');
    insertedTags.forEach(tag => {
      console.log(`  - ${tag.name} (${tag.type}) - ${tag.color}`);
    });

    console.log('\n🎉 Tag seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding tags:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seeder if this file is executed directly
seedTags();

export default seedTags;
