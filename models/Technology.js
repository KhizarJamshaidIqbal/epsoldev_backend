import mongoose from 'mongoose';

const TechnologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Technology name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['frontend', 'backend', 'database', 'devops', 'mobile', 'design', 'other'],
      message: 'Category must be one of: frontend, backend, database, devops, mobile, design, other'
    }
  },
  icon: {
    type: String,
    trim: true,
    default: 'code'
  },
  color: {
    type: String,
    trim: true,
    default: '#3B82F6'
  },
  website: {
    type: String,
    trim: true
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
  usageCount: {
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
TechnologySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate slug from name if not provided
TechnologySchema.pre('save', function(next) {
  if (!this.isModified('name')) return next();
  
  // Keep the original name as is, don't modify it
  next();
});

const Technology = mongoose.model('Technology', TechnologySchema);

export default Technology;
