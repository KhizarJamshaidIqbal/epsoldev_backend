import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#10B981'
  },
  type: {
    type: String,
    enum: ['blog', 'portfolio', 'general'],
    default: 'blog'
  },
  count: {
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
TagSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate slug from name if not provided
TagSchema.pre('save', function(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Tag = mongoose.model('Tag', TagSchema);

export default Tag;
