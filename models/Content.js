import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Content type is required'],
    enum: {
      values: ['about', 'privacy', 'terms', 'cookies'],
      message: 'Content type must be one of: about, privacy, terms, cookies'
    },
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [300, 'Subtitle cannot exceed 300 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  content: {
    type: String,
    trim: true,
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  // For About Us specific fields
  mission: {
    type: String,
    trim: true,
    maxlength: [1000, 'Mission cannot exceed 1000 characters']
  },
  vision: {
    type: String,
    trim: true,
    maxlength: [1000, 'Vision cannot exceed 1000 characters']
  },
  values: [{
    type: String,
    trim: true,
    maxlength: [500, 'Each value cannot exceed 500 characters']
  }],
  // For Policy specific fields
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  sections: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Section title cannot exceed 200 characters']
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'Section content cannot exceed 2000 characters']
    }
  }],
  status: {
    type: String,
    enum: {
      values: ['active', 'draft', 'archived'],
      message: 'Status must be one of: active, draft, archived'
    },
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

// Indexes for better query performance
ContentSchema.index({ status: 1 });
ContentSchema.index({ type: 1, status: 1 });

// Middleware to update the updatedAt timestamp
ContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure virtual fields are serialized
ContentSchema.set('toJSON', { virtuals: true });
ContentSchema.set('toObject', { virtuals: true });

const Content = mongoose.model('Content', ContentSchema);

export default Content;
