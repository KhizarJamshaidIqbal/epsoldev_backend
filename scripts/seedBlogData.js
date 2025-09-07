import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import BlogCategory from '../models/BlogCategory.js';
import connectDB from '../config/db.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Sample categories
const categories = [
  {
    name: 'web-development',
    slug: 'web-development',
    displayName: 'Web Development',
    description: 'Articles about modern web development technologies and best practices',
    featured: true,
    status: 'active',
    order: 1
  },
  {
    name: 'react',
    slug: 'react',
    displayName: 'React',
    description: 'React.js tutorials, tips, and best practices',
    featured: true,
    status: 'active',
    order: 2
  },
  {
    name: 'javascript',
    slug: 'javascript',
    displayName: 'JavaScript',
    description: 'JavaScript programming language tutorials and guides',
    featured: true,
    status: 'active',
    order: 3
  },
  {
    name: 'nodejs',
    slug: 'nodejs',
    displayName: 'Node.js',
    description: 'Server-side JavaScript with Node.js',
    featured: false,
    status: 'active',
    order: 4
  },
  {
    name: 'tutorials',
    slug: 'tutorials',
    displayName: 'Tutorials',
    description: 'Step-by-step programming tutorials',
    featured: false,
    status: 'inactive',
    order: 5
  }
];

// Sample blog posts
const blogPosts = [
  {
    title: 'Getting Started with React in 2024',
    excerpt: 'A comprehensive guide to learning React.js for beginners. Learn the fundamentals, hooks, and modern React patterns.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    category: 'react',
    displayCategory: 'React',
    slug: 'getting-started-with-react-2024',
    readTime: '8 min read',
    content: [
      {
        type: 'text',
        text: 'React has evolved significantly since its initial release, and 2024 brings even more exciting features and improvements. In this comprehensive guide, we\'ll explore everything you need to know to get started with React development.',
        url: '',
        caption: ''
      },
      {
        type: 'text',
        text: 'React is a JavaScript library for building user interfaces, particularly web applications. It allows you to create reusable UI components and manage the state of your application efficiently.',
        url: '',
        caption: ''
      },
      {
        type: 'text',
        text: 'Key concepts you\'ll learn in this tutorial include: Components, JSX, Props, State, Hooks, and Event Handling. We\'ll build a practical example to demonstrate these concepts in action.',
        url: '',
        caption: ''
      }
    ],
    author: {
      name: 'John Developer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
    },
    status: 'published',
    tags: ['react', 'javascript', 'frontend', 'tutorial'],
    views: 1250
  },
  {
    title: 'Modern JavaScript ES6+ Features You Should Know',
    excerpt: 'Discover the most important ES6+ features that every JavaScript developer should master, including arrow functions, destructuring, and async/await.',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=800&q=80',
    category: 'javascript',
    displayCategory: 'JavaScript',
    slug: 'modern-javascript-es6-features',
    readTime: '10 min read',
    content: [
      {
        type: 'text',
        text: 'JavaScript has come a long way since ES6 (ECMAScript 2015) was released. The language continues to evolve with new features that make code more readable, efficient, and maintainable.',
        url: '',
        caption: ''
      },
      {
        type: 'text',
        text: 'In this article, we\'ll explore the most important modern JavaScript features including: Arrow Functions, Template Literals, Destructuring Assignment, Spread Operator, Promise and Async/Await, Classes, and Modules.',
        url: '',
        caption: ''
      },
      {
        type: 'text',
        text: 'These features are not just syntactic sugar - they provide real benefits in terms of code clarity, performance, and developer experience. Let\'s dive into each one with practical examples.',
        url: '',
        caption: ''
      }
    ],
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?auto=format&fit=crop&w=150&q=80'
    },
    status: 'published',
    tags: ['javascript', 'es6', 'programming', 'modern-js'],
    views: 2100
  },
  {
    title: 'Building RESTful APIs with Node.js and Express',
    excerpt: 'Learn how to create robust and scalable REST APIs using Node.js and Express.js. Includes authentication, validation, and best practices.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    category: 'nodejs',
    displayCategory: 'Node.js',
    slug: 'building-restful-apis-nodejs-express',
    readTime: '12 min read',
    content: [
      {
        type: 'text',
        text: 'RESTful APIs are the backbone of modern web applications. They provide a standardized way for different applications to communicate with each other over HTTP.',
        url: '',
        caption: ''
      },
      {
        type: 'text',
        text: 'Node.js and Express.js provide an excellent foundation for building APIs. Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.',
        url: '',
        caption: ''
      },
      {
        type: 'text',
        text: 'In this tutorial, we\'ll cover: Setting up Express server, Routing and middleware, Data validation, Authentication with JWT, Error handling, and Testing your API.',
        url: '',
        caption: ''
      }
    ],
    author: {
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    status: 'published',
    tags: ['nodejs', 'express', 'api', 'backend'],
    views: 1800
  },
  {
    title: 'CSS Grid vs Flexbox: When to Use Each',
    excerpt: 'Understanding the differences between CSS Grid and Flexbox, and knowing when to use each layout method for optimal web design.',
    image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&w=800&q=80',
    category: 'web-development',
    displayCategory: 'Web Development',
    slug: 'css-grid-vs-flexbox-guide',
    readTime: '7 min read',
    content: [
      {
        type: 'text',
        text: 'CSS Grid and Flexbox are two powerful layout systems in CSS that have revolutionized how we create web layouts. While they can sometimes be used interchangeably, each has specific strengths.',
        url: '',
        caption: ''
      },
      {
        type: 'text',
        text: 'Flexbox is designed for one-dimensional layouts (either row or column), making it perfect for navigation bars, card layouts, and centering content. Grid is designed for two-dimensional layouts, making it ideal for complex page layouts.',
        url: '',
        caption: ''
      },
      {
        type: 'text',
        text: 'We\'ll explore practical examples of when to use each, common patterns, and how they can work together to create responsive, maintainable layouts.',
        url: '',
        caption: ''
      }
    ],
    author: {
      name: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80'
    },
    status: 'published',
    tags: ['css', 'layout', 'flexbox', 'grid'],
    views: 950
  },
  {
    title: 'TypeScript Best Practices for React Projects',
    excerpt: 'Improve your React applications with TypeScript. Learn typing patterns, best practices, and how to avoid common pitfalls.',
    image: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=800&q=80',
    category: 'react',
    displayCategory: 'React',
    slug: 'typescript-best-practices-react',
    readTime: '9 min read',
    content: [
      {
        type: 'text',
        text: 'TypeScript adds static type checking to JavaScript, which can help catch errors early and make your React code more maintainable and self-documenting.',
        url: '',
        caption: ''
      },
      {
        type: 'text',
        text: 'When working with React and TypeScript, there are specific patterns and best practices that can help you write better code. We\'ll cover component typing, props interfaces, hooks typing, and more.',
        url: '',
        caption: ''
      },
      {
        type: 'text',
        text: 'Topics covered include: Setting up TypeScript with React, Typing components and props, Working with hooks, Event handlers, and Advanced patterns like generic components.',
        url: '',
        caption: ''
      }
    ],
    author: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    },
    status: 'published',
    tags: ['typescript', 'react', 'javascript', 'types'],
    views: 1650
  },
  {
    title: 'Introduction to MongoDB and Mongoose',
    excerpt: 'Learn the fundamentals of MongoDB database and how to use Mongoose ODM for Node.js applications. Perfect for beginners.',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    category: 'nodejs',
    displayCategory: 'Node.js',
    slug: 'introduction-mongodb-mongoose',
    readTime: '11 min read',
    content: [
      {
        type: 'text',
        text: 'MongoDB is a popular NoSQL database that stores data in flexible, JSON-like documents. It\'s particularly well-suited for Node.js applications due to its JavaScript-friendly nature.',
        url: '',
        caption: ''
      },
      {
        type: 'text',
        text: 'Mongoose is an Object Document Mapping (ODM) library for MongoDB and Node.js. It provides a straightforward, schema-based solution to model your application data.',
        url: '',
        caption: ''
      },
      {
        type: 'text',
        text: 'In this comprehensive guide, we\'ll cover: MongoDB basics, Installing and connecting to MongoDB, Creating schemas and models, CRUD operations, Data validation, and Advanced features.',
        url: '',
        caption: ''
      }
    ],
    author: {
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
    },
    status: 'draft',
    tags: ['mongodb', 'mongoose', 'database', 'nodejs'],
    views: 0
  }
];

const seedBlogData = async () => {
  try {
    console.log('🌱 Starting blog data seeding process...');
    
    // Connect to database
    const isConnected = await connectDB();
    if (!isConnected) {
      console.error('❌ Database connection failed');
      process.exit(1);
    }

    // Clear existing data
    console.log('🧹 Clearing existing blog data...');
    await Blog.deleteMany({});
    await BlogCategory.deleteMany({});

    // Seed categories
    console.log('📂 Seeding blog categories...');
    const createdCategories = await BlogCategory.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Seed blog posts
    console.log('📝 Seeding blog posts...');
    const createdPosts = await Blog.insertMany(blogPosts);
    console.log(`✅ Created ${createdPosts.length} blog posts`);

    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Blog Posts: ${createdPosts.length}`);
    console.log(`   Published Posts: ${createdPosts.filter(post => post.status === 'published').length}`);
    console.log(`   Draft Posts: ${createdPosts.filter(post => post.status === 'draft').length}`);

    console.log('\n✨ Blog data seeding completed successfully!');
    console.log('🔗 You can now view the blog posts in your application');
    
  } catch (error) {
    console.error('❌ Error seeding blog data:', error);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:');
      Object.values(error.errors).forEach(err => {
        console.error(`  - ${err.message}`);
      });
    }
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('📚 Database connection closed');
    process.exit(0);
  }
};

// Run the seeding function
seedBlogData();
