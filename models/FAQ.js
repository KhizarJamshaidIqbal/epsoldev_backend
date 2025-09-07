import mongoose from 'mongoose';

const FAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [500, 'Question cannot exceed 500 characters']
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true,
    maxlength: [2000, 'Answer cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: {
      values: ['general', 'technical', 'billing', 'account', 'services', 'support', 'other'],
      message: 'Category must be one of: general, technical, billing, account, services, support, other'
    },
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'draft'],
      message: 'Status must be one of: active, inactive, draft'
    },
    default: 'active'
  },
  order: {
    type: Number,
    default: 0,
    min: [0, 'Order cannot be negative']
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  helpful: {
    type: Number,
    default: 0,
    min: [0, 'Helpful count cannot be negative']
  },
  notHelpful: {
    type: Number,
    default: 0,
    min: [0, 'Not helpful count cannot be negative']
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
FAQSchema.index({ category: 1, status: 1 });
FAQSchema.index({ tags: 1 });
FAQSchema.index({ featured: 1, status: 1 });
FAQSchema.index({ order: 1, status: 1 });

// Middleware to update the updatedAt timestamp
FAQSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for total votes
FAQSchema.virtual('totalVotes').get(function() {
  return this.helpful + this.notHelpful;
});

// Virtual for helpful percentage
FAQSchema.virtual('helpfulPercentage').get(function() {
  if (this.totalVotes === 0) return 0;
  return Math.round((this.helpful / this.totalVotes) * 100);
});

// Ensure virtual fields are serialized
FAQSchema.set('toJSON', { virtuals: true });
FAQSchema.set('toObject', { virtuals: true });

const FAQ = mongoose.model('FAQ', FAQSchema);

export default FAQ;
