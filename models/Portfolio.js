import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  slug: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  client: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true
  },
  shortDescription: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  demoUrl: {
    type: String,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  featured: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    required: [true, 'Completion date is required']
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

// Middleware to update the updatedAt timestamp
PortfolioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate slug from title if not provided
PortfolioSchema.pre('save', async function(next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Ensure slug is unique
    let slug = baseSlug;
    let counter = 1;
    
    while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  next();
});

const Portfolio = mongoose.model('Portfolio', PortfolioSchema);

export default Portfolio;
