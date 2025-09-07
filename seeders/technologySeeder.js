import Technology from '../models/Technology.js';
import { connectToDatabase } from '../config/database.js';

const technologies = [
  // Frontend Technologies
  {
    name: 'React.js',
    description: 'A JavaScript library for building user interfaces, particularly single-page applications',
    category: 'frontend',
    icon: 'react',
    color: '#61DAFB',
    website: 'https://reactjs.org',
    featured: true,
    order: 1,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Vue.js',
    description: 'A progressive JavaScript framework for building user interfaces',
    category: 'frontend',
    icon: 'vue',
    color: '#4FC08D',
    website: 'https://vuejs.org',
    featured: true,
    order: 2,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Angular',
    description: 'A platform for building mobile and desktop web applications',
    category: 'frontend',
    icon: 'angular',
    color: '#DD0031',
    website: 'https://angular.io',
    featured: true,
    order: 3,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Next.js',
    description: 'A React framework for production with server-side rendering',
    category: 'frontend',
    icon: 'nextjs',
    color: '#000000',
    website: 'https://nextjs.org',
    featured: true,
    order: 4,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'TypeScript',
    description: 'A strongly typed programming language that builds on JavaScript',
    category: 'frontend',
    icon: 'typescript',
    color: '#3178C6',
    website: 'https://www.typescriptlang.org',
    featured: true,
    order: 5,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Tailwind CSS',
    description: 'A utility-first CSS framework for rapidly building custom user interfaces',
    category: 'frontend',
    icon: 'tailwind',
    color: '#06B6D4',
    website: 'https://tailwindcss.com',
    featured: true,
    order: 6,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Bootstrap',
    description: 'A free and open-source CSS framework directed at responsive, mobile-first front-end web development',
    category: 'frontend',
    icon: 'bootstrap',
    color: '#7952B3',
    website: 'https://getbootstrap.com',
    featured: false,
    order: 7,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Sass',
    description: 'A CSS preprocessor that helps you write more maintainable and structured CSS',
    category: 'frontend',
    icon: 'sass',
    color: '#CC6699',
    website: 'https://sass-lang.com',
    featured: false,
    order: 8,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Vite',
    description: 'A build tool that aims to provide a faster and leaner development experience',
    category: 'frontend',
    icon: 'vite',
    color: '#646CFF',
    website: 'https://vitejs.dev',
    featured: true,
    order: 9,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Webpack',
    description: 'A static module bundler for modern JavaScript applications',
    category: 'frontend',
    icon: 'webpack',
    color: '#8DD6F9',
    website: 'https://webpack.js.org',
    featured: false,
    order: 10,
    status: 'active',
    usageCount: 0
  },

  // Backend Technologies
  {
    name: 'Node.js',
    description: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine',
    category: 'backend',
    icon: 'nodejs',
    color: '#339933',
    website: 'https://nodejs.org',
    featured: true,
    order: 1,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Express.js',
    description: 'A minimal and flexible Node.js web application framework',
    category: 'backend',
    icon: 'express',
    color: '#000000',
    website: 'https://expressjs.com',
    featured: true,
    order: 2,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Python',
    description: 'A high-level, interpreted programming language known for its simplicity and readability',
    category: 'backend',
    icon: 'python',
    color: '#3776AB',
    website: 'https://www.python.org',
    featured: true,
    order: 3,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Django',
    description: 'A high-level Python web framework that encourages rapid development',
    category: 'backend',
    icon: 'django',
    color: '#092E20',
    website: 'https://www.djangoproject.com',
    featured: true,
    order: 4,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Flask',
    description: 'A lightweight WSGI web application framework for Python',
    category: 'backend',
    icon: 'flask',
    color: '#000000',
    website: 'https://flask.palletsprojects.com',
    featured: false,
    order: 5,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'PHP',
    description: 'A server-side scripting language designed for web development',
    category: 'backend',
    icon: 'php',
    color: '#777BB4',
    website: 'https://www.php.net',
    featured: false,
    order: 6,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Laravel',
    description: 'A web application framework with expressive, elegant syntax',
    category: 'backend',
    icon: 'laravel',
    color: '#FF2D20',
    website: 'https://laravel.com',
    featured: false,
    order: 7,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Java',
    description: 'A high-level, class-based, object-oriented programming language',
    category: 'backend',
    icon: 'java',
    color: '#ED8B00',
    website: 'https://www.java.com',
    featured: false,
    order: 8,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Spring Boot',
    description: 'An open-source Java-based framework used to create microservices',
    category: 'backend',
    icon: 'spring',
    color: '#6DB33F',
    website: 'https://spring.io/projects/spring-boot',
    featured: false,
    order: 9,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'GraphQL',
    description: 'A query language for APIs and a runtime for executing those queries',
    category: 'backend',
    icon: 'graphql',
    color: '#E10098',
    website: 'https://graphql.org',
    featured: true,
    order: 10,
    status: 'active',
    usageCount: 0
  },

  // Database Technologies
  {
    name: 'MongoDB',
    description: 'A source-available cross-platform document-oriented database program',
    category: 'database',
    icon: 'mongodb',
    color: '#47A248',
    website: 'https://www.mongodb.com',
    featured: true,
    order: 1,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'PostgreSQL',
    description: 'A powerful, open source object-relational database system',
    category: 'database',
    icon: 'postgresql',
    color: '#336791',
    website: 'https://www.postgresql.org',
    featured: true,
    order: 2,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'MySQL',
    description: 'An open-source relational database management system',
    category: 'database',
    icon: 'mysql',
    color: '#4479A1',
    website: 'https://www.mysql.com',
    featured: true,
    order: 3,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Redis',
    description: 'An in-memory data structure store, used as a database, cache, and message broker',
    category: 'database',
    icon: 'redis',
    color: '#DC382D',
    website: 'https://redis.io',
    featured: false,
    order: 4,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'SQLite',
    description: 'A lightweight, disk-based database that doesn\'t require a separate server process',
    category: 'database',
    icon: 'sqlite',
    color: '#003B57',
    website: 'https://www.sqlite.org',
    featured: false,
    order: 5,
    status: 'active',
    usageCount: 0
  },

  // DevOps Technologies
  {
    name: 'Docker',
    description: 'A platform for developing, shipping, and running applications in containers',
    category: 'devops',
    icon: 'docker',
    color: '#2496ED',
    website: 'https://www.docker.com',
    featured: true,
    order: 1,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Kubernetes',
    description: 'An open-source container orchestration platform for automating deployment',
    category: 'devops',
    icon: 'kubernetes',
    color: '#326CE5',
    website: 'https://kubernetes.io',
    featured: true,
    order: 2,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'AWS',
    description: 'Amazon Web Services - a comprehensive cloud computing platform',
    category: 'devops',
    icon: 'aws',
    color: '#FF9900',
    website: 'https://aws.amazon.com',
    featured: true,
    order: 3,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Git',
    description: 'A distributed version control system for tracking changes in source code',
    category: 'devops',
    icon: 'git',
    color: '#F05032',
    website: 'https://git-scm.com',
    featured: true,
    order: 4,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'GitHub',
    description: 'A web-based hosting service for version control using Git',
    category: 'devops',
    icon: 'github',
    color: '#181717',
    website: 'https://github.com',
    featured: true,
    order: 5,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Jenkins',
    description: 'An open-source automation server for building, testing, and deploying software',
    category: 'devops',
    icon: 'jenkins',
    color: '#D24939',
    website: 'https://www.jenkins.io',
    featured: false,
    order: 6,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Nginx',
    description: 'A web server that can also be used as a reverse proxy, load balancer',
    category: 'devops',
    icon: 'nginx',
    color: '#009639',
    website: 'https://nginx.org',
    featured: false,
    order: 7,
    status: 'active',
    usageCount: 0
  },

  // Mobile Technologies
  {
    name: 'React Native',
    description: 'A framework for building native applications using React',
    category: 'mobile',
    icon: 'react',
    color: '#61DAFB',
    website: 'https://reactnative.dev',
    featured: true,
    order: 1,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Flutter',
    description: 'Google\'s UI toolkit for building natively compiled applications',
    category: 'mobile',
    icon: 'flutter',
    color: '#02569B',
    website: 'https://flutter.dev',
    featured: true,
    order: 2,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Ionic',
    description: 'A complete open-source SDK for hybrid mobile app development',
    category: 'mobile',
    icon: 'ionic',
    color: '#3880FF',
    website: 'https://ionicframework.com',
    featured: false,
    order: 3,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Swift',
    description: 'A powerful and intuitive programming language for iOS development',
    category: 'mobile',
    icon: 'swift',
    color: '#FA7343',
    website: 'https://swift.org',
    featured: false,
    order: 4,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Kotlin',
    description: 'A modern programming language for Android development',
    category: 'mobile',
    icon: 'kotlin',
    color: '#7F52FF',
    website: 'https://kotlinlang.org',
    featured: false,
    order: 5,
    status: 'active',
    usageCount: 0
  },

  // Design Technologies
  {
    name: 'Figma',
    description: 'A collaborative interface design tool for creating user interfaces',
    category: 'design',
    icon: 'figma',
    color: '#F24E1E',
    website: 'https://www.figma.com',
    featured: true,
    order: 1,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Adobe XD',
    description: 'A vector-based user experience design tool for web and mobile apps',
    category: 'design',
    icon: 'adobe-xd',
    color: '#FF61F6',
    website: 'https://www.adobe.com/products/xd.html',
    featured: false,
    order: 2,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Sketch',
    description: 'A digital design app for macOS for creating user interfaces',
    category: 'design',
    icon: 'sketch',
    color: '#FDB300',
    website: 'https://www.sketch.com',
    featured: false,
    order: 3,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'InVision',
    description: 'A digital product design platform for prototyping and collaboration',
    category: 'design',
    icon: 'invision',
    color: '#FF3366',
    website: 'https://www.invisionapp.com',
    featured: false,
    order: 4,
    status: 'active',
    usageCount: 0
  },

  // Other Technologies
  {
    name: 'REST API',
    description: 'Representational State Transfer - an architectural style for distributed systems',
    category: 'other',
    icon: 'api',
    color: '#FF6B6B',
    website: 'https://restfulapi.net',
    featured: true,
    order: 1,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Jest',
    description: 'A JavaScript testing framework with a focus on simplicity',
    category: 'other',
    icon: 'jest',
    color: '#C21325',
    website: 'https://jestjs.io',
    featured: false,
    order: 2,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Cypress',
    description: 'A JavaScript end-to-end testing framework for web applications',
    category: 'other',
    icon: 'cypress',
    color: '#17202C',
    website: 'https://www.cypress.io',
    featured: false,
    order: 3,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'Storybook',
    description: 'An open-source tool for developing UI components in isolation',
    category: 'other',
    icon: 'storybook',
    color: '#FF4785',
    website: 'https://storybook.js.org',
    featured: false,
    order: 4,
    status: 'active',
    usageCount: 0
  },
  {
    name: 'ESLint',
    description: 'A static code analysis tool for identifying problematic patterns in JavaScript',
    category: 'other',
    icon: 'eslint',
    color: '#4B32C3',
    website: 'https://eslint.org',
    featured: false,
    order: 5,
    status: 'active',
    usageCount: 0
  }
];

/**
 * Validate technology data before insertion
 * @param {Object} technology - Technology object to validate
 * @returns {Object} - Validation result with isValid and errors
 */
const validateTechnology = (technology) => {
  const errors = [];
  
  // Required fields validation
  if (!technology.name || technology.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!technology.category) {
    errors.push('Category is required');
  } else {
    const validCategories = ['frontend', 'backend', 'database', 'devops', 'mobile', 'design', 'other'];
    if (!validCategories.includes(technology.category)) {
      errors.push(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
    }
  }
  
  // Description length validation
  if (technology.description && technology.description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }
  
  // Color format validation
  if (technology.color && !/^#[0-9A-F]{6}$/i.test(technology.color)) {
    errors.push('Color must be a valid hex color (e.g., #FF0000)');
  }
  
  // Website URL validation
  if (technology.website && !isValidUrl(technology.website)) {
    errors.push('Website must be a valid URL');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Simple URL validation
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether URL is valid
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Seed technologies into the database
 * @param {boolean} force - Whether to force reseed (clear existing data)
 * @returns {Promise<Object>} - Seeding result
 */
const seedTechnologies = async (force = false) => {
  const startTime = Date.now();
  
  try {
    console.log('🌱 Starting technology seeding process...');
    
    // Connect to database
    await connectToDatabase();
    console.log('✅ Database connected successfully');
    
    // Validate all technologies before insertion
    console.log('🔍 Validating technology data...');
    const validationResults = technologies.map((tech, index) => {
      const validation = validateTechnology(tech);
      if (!validation.isValid) {
        console.error(`❌ Validation failed for technology ${index + 1} (${tech.name}):`, validation.errors);
      }
      return { technology: tech, validation };
    });
    
    const invalidTechnologies = validationResults.filter(result => !result.validation.isValid);
    if (invalidTechnologies.length > 0) {
      throw new Error(`Found ${invalidTechnologies.length} invalid technologies. Please fix validation errors before seeding.`);
    }
    
    console.log('✅ All technologies validated successfully');
    
    // Check if technologies already exist
    const existingCount = await Technology.countDocuments();
    
    if (existingCount > 0 && !force) {
      console.log(`⚠️  Found ${existingCount} existing technologies. Use force=true to reseed.`);
      return {
        success: false,
        message: 'Technologies already exist. Use force=true to reseed.',
        existingCount
      };
    }
    
    // Clear existing technologies if force is true
    if (force && existingCount > 0) {
      console.log('🗑️  Clearing existing technologies...');
      await Technology.deleteMany();
      console.log('✅ Existing technologies cleared');
    }
    
    // Insert technologies
    console.log('📝 Inserting technologies...');
    const createdTechnologies = await Technology.insertMany(technologies, { 
      ordered: false // Continue insertion even if some documents fail
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Successfully seeded ${createdTechnologies.length} technologies in ${duration}ms`);
    
    // Log summary by category
    const categorySummary = {};
    createdTechnologies.forEach(tech => {
      categorySummary[tech.category] = (categorySummary[tech.category] || 0) + 1;
    });
    
    console.log('📊 Seeding summary by category:');
    Object.entries(categorySummary).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} technologies`);
    });
    
    // Log featured technologies
    const featuredCount = createdTechnologies.filter(tech => tech.featured).length;
    console.log(`⭐ Featured technologies: ${featuredCount}`);
    
    return {
      success: true,
      count: createdTechnologies.length,
      duration,
      categorySummary,
      featuredCount,
      message: `Successfully seeded ${createdTechnologies.length} technologies`
    };
    
  } catch (error) {
    console.error('❌ Error seeding technologies:', error.message);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      console.error('💡 Duplicate key error. Some technologies may already exist.');
    }
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to seed technologies'
    };
  }
};

/**
 * Get seeding statistics
 * @returns {Promise<Object>} - Statistics about seeded data
 */
const getSeedingStats = async () => {
  try {
    await connectToDatabase();
    
    const totalCount = await Technology.countDocuments();
    const featuredCount = await Technology.countDocuments({ featured: true });
    const activeCount = await Technology.countDocuments({ status: 'active' });
    
    const categoryStats = await Technology.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          featured: { $sum: { $cond: ['$featured', 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    return {
      total: totalCount,
      featured: featuredCount,
      active: activeCount,
      categories: categoryStats
    };
  } catch (error) {
    console.error('Error getting seeding stats:', error);
    throw error;
  }
};

/**
 * Clear all technologies
 * @returns {Promise<Object>} - Clear result
 */
const clearTechnologies = async () => {
  try {
    await connectToDatabase();
    const result = await Technology.deleteMany();
    console.log(`🗑️  Cleared ${result.deletedCount} technologies`);
    return {
      success: true,
      deletedCount: result.deletedCount
    };
  } catch (error) {
    console.error('Error clearing technologies:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Run seeder if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const force = process.argv.includes('--force');
  console.log(`🚀 Running technology seeder${force ? ' (force mode)' : ''}...`);
  
  seedTechnologies(force)
    .then(result => {
      if (result.success) {
        console.log('🎉 Technology seeding completed successfully!');
        process.exit(0);
      } else {
        console.log('⚠️  Technology seeding completed with warnings');
        process.exit(0);
      }
    })
    .catch(error => {
      console.error('💥 Technology seeding failed:', error);
      process.exit(1);
    });
}

export default seedTechnologies;
export { getSeedingStats, clearTechnologies, validateTechnology };
