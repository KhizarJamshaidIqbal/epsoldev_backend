import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    trim: true,
    unique: true,
    sparse: true // Allow multiple null values
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true
  },
  shortDescription: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    default: 'database'
  },
  features: [{
    type: String,
    trim: true
  }],
  price: {
    type: Number
  },
  priceType: {
    type: String,
    enum: ['fixed', 'hourly', 'custom'],
    default: 'fixed'
  },
  priceDisplay: {
    type: String,
    default: '$0'
  },
  showPrice: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    default: 'general'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
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

// Middleware to update the updatedAt timestamp
ServiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate slug from title if not provided
ServiceSchema.pre('save', function(next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Generate slug from title if not provided (for insertMany)
ServiceSchema.pre('insertMany', function(next, docs) {
  if (Array.isArray(docs)) {
    docs.forEach(doc => {
      if (doc.title && !doc.slug) {
        doc.slug = doc.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
    });
  }
  next();
});

const Service = mongoose.model('Service', ServiceSchema);

export default Service;
