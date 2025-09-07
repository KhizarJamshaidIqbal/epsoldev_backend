import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
  // General Settings
  siteName: {
    type: String,
    default: 'EpsolDev',
    trim: true
  },
  siteDescription: {
    type: String,
    default: 'Professional web development services',
    trim: true
  },
  siteUrl: {
    type: String,
    default: 'https://epsoldev.com',
    trim: true
  },
  
  // Contact Settings
  contactEmail: {
    type: String,
    default: 'contact@epsoldev.com',
    trim: true
  },
  supportEmail: {
    type: String,
    default: 'support@epsoldev.com',
    trim: true
  },
  
  // Social Media Settings
  socialMedia: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    github: { type: String, default: '' }
  },
  
  // Service Settings
  services: {
    showPrices: {
      type: Boolean,
      default: true
    },
    defaultPriceDisplay: {
      type: String,
      default: 'Contact for Quote'
    },
    maxServicesDisplay: {
      type: Number,
      default: 6
    }
  },
  
  // Comment Settings
  commentsEnabled: {
    type: Boolean,
    default: true
  },
  commentsModerationEnabled: {
    type: Boolean,
    default: true
  },
  commentsAutoApprove: {
    type: Boolean,
    default: false
  },
  
  // Blog Settings
  postsPerPage: {
    type: Number,
    default: 10,
    min: 1,
    max: 100
  },
  
  // SEO Settings
  metaTitle: {
    type: String,
    default: 'EpsolDev - Professional Web Development',
    trim: true
  },
  metaDescription: {
    type: String,
    default: 'Professional web development services specializing in modern technologies',
    trim: true
  },
  metaKeywords: {
    type: String,
    default: 'web development, react, node.js, mongodb, typescript',
    trim: true
  },
  
  // Maintenance Settings
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  maintenanceMessage: {
    type: String,
    default: 'Site is under maintenance. Please check back later.',
    trim: true
  },
  
  // Email Settings
  emailSettings: {
    smtpHost: { type: String, default: '' },
    smtpPort: { type: Number, default: 587 },
    smtpUser: { type: String, default: '' },
    smtpPass: { type: String, default: '' },
    fromEmail: { type: String, default: 'noreply@epsoldev.com' },
    fromName: { type: String, default: 'EpsolDev' }
  },
  
  // Analytics Settings
  analytics: {
    googleAnalyticsId: { type: String, default: '' },
    facebookPixelId: { type: String, default: '' }
  },
  
  // File Upload Settings
  uploads: {
    maxFileSize: { type: Number, default: 10485760 }, // 10MB in bytes
    allowedFileTypes: {
      type: [String],
      default: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    }
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
SiteSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// Update settings (create if doesn't exist)
SiteSettingsSchema.statics.updateSettings = async function(updateData) {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create(updateData);
  } else {
    Object.assign(settings, updateData);
    await settings.save();
  }
  return settings;
};

const SiteSettings = mongoose.model('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
