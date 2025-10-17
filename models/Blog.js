import mongoose from 'mongoose';

const ContentSectionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  text: { type: String },
  url: { type: String },
  caption: { type: String }
}, { _id: false });

const AuthorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, required: true }
}, { _id: false });

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Featured image URL is required']
  },
  category: {
    type: String,
    required: [true, 'Blog category is required'],
    trim: true
  },
  displayCategory: {
    type: String,
    required: false,
    trim: true,
    default: function() {
      return this.category || 'General';
    }
  },
  date: {
    type: Date,
    default: Date.now
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  slug: {
    type: String,
    required: [true, 'Blog slug is required'],
    unique: true,
    trim: true
  },
  content: {
    type: [ContentSectionSchema],
    required: [true, 'Blog content is required']
  },
  author: {
    type: AuthorSchema,
    required: [true, 'Blog author is required']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  tags: {
    type: [String],
    default: []
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create text index for search functionality
BlogSchema.index({ 
  title: 'text', 
  excerpt: 'text',
  'content.text': 'text'
});

// Middleware to update the updatedAt timestamp
BlogSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Blog = mongoose.model('Blog', BlogSchema);

export default Blog; 