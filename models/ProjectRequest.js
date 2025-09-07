import mongoose from 'mongoose';

const ProjectRequestSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  projectType: {
    type: String,
    required: [true, 'Project type is required'],
    trim: true
  },
  budget: {
    type: String,
    required: [true, 'Budget is required'],
    trim: true
  },
  timeline: {
    type: String,
    required: [true, 'Timeline is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['new_request', 'contacted', 'proposal_sent', 'in_negotiation', 'accepted', 'declined', 'completed'],
    default: 'new_request'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social_media', 'email', 'phone', 'other'],
    default: 'website'
  },
  notes: {
    type: String,
    trim: true
  },
  assignedTo: {
    type: String,
    trim: true
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
ProjectRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ProjectRequest = mongoose.model('ProjectRequest', ProjectRequestSchema);

export default ProjectRequest;
