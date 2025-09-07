import mongoose from 'mongoose';
import Portfolio from './models/Portfolio.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use the same connection string as your main app
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/epsoldev';

console.log('Connecting to MongoDB...');
console.log('URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    try {
      // Find all projects
      const projects = await Portfolio.find({});
      console.log(`Found ${projects.length} projects`);
      
      // Update each project to remove old technologies
      for (const project of projects) {
        console.log(`\nProject: ${project.title}`);
        console.log(`Current technologies: ${JSON.stringify(project.technologies)}`);
        
        // Keep only technologies that are valid MongoDB ObjectIds (24 character hex strings)
        const validTechnologies = project.technologies.filter(tech => 
          typeof tech === 'string' && tech.match(/^[0-9a-fA-F]{24}$/)
        );
        
        console.log(`Valid technologies (IDs only): ${JSON.stringify(validTechnologies)}`);
        
        // Update the project
        await Portfolio.findByIdAndUpdate(project._id, {
          technologies: validTechnologies
        });
        
        console.log(`✅ Updated project: ${project.title}`);
      }
      
      console.log('\n🎉 Database cleanup completed!');
      
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed');
    }
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
