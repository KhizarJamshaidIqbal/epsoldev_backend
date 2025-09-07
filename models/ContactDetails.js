import mongoose from 'mongoose';

const ContactDetailsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  googleMapsUrl: {
    type: String,
    trim: true
  },
  socialMedia: {
    facebook: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    },
    youtube: {
      type: String,
      trim: true
    },
    twitch: {
      type: String,
      trim: true
    },
    discord: {
      type: String,
      trim: true
    },
    slack: {
      type: String,
      trim: true
    },
    reddit: {
      type: String,
      trim: true
    },
    stackoverflow: {
      type: String,
      trim: true
    },
    medium: {
      type: String,
      trim: true
    },
    behance: {
      type: String,
      trim: true
    },
    dribbble: {
      type: String,
      trim: true
    },
    pinterest: {
      type: String,
      trim: true
    },
    threads: {
      type: String,
      trim: true
    },
    tiktok: {
      type: String,
      trim: true
    },
    snapchat: {
      type: String,
      trim: true
    },
    telegram: {
      type: String,
      trim: true
    },
    whatsapp: {
      type: String,
      trim: true
    },
    mastodon: {
      type: String,
      trim: true
    }
  },
  businessHours: {
    monday: {
      type: String,
      trim: true,
      default: '9:00 AM - 6:00 PM'
    },
    tuesday: {
      type: String,
      trim: true,
      default: '9:00 AM - 6:00 PM'
    },
    wednesday: {
      type: String,
      trim: true,
      default: '9:00 AM - 6:00 PM'
    },
    thursday: {
      type: String,
      trim: true,
      default: '9:00 AM - 6:00 PM'
    },
    friday: {
      type: String,
      trim: true,
      default: '9:00 AM - 6:00 PM'
    },
    saturday: {
      type: String,
      trim: true,
      default: '10:00 AM - 4:00 PM'
    },
    sunday: {
      type: String,
      trim: true,
      default: 'Closed'
    }
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
ContactDetailsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ContactDetails = mongoose.model('ContactDetails', ContactDetailsSchema);

export default ContactDetails;
