import mongoose from 'mongoose';
import crypto from 'crypto';

const apiTokenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Token name is required'],
      trim: true,
      maxlength: [100, 'Token name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    prefix: {
      type: String,
      required: true,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      default: ['read'],
      enum: ['read', 'write', 'delete', 'admin'],
    },
    rateLimit: {
      requestsPerMinute: {
        type: Number,
        default: 60,
      },
      requestsPerDay: {
        type: Number,
        default: 1000,
      },
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastUsedIp: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Generate secure API token
apiTokenSchema.statics.generateToken = function () {
  const randomBytes = crypto.randomBytes(32).toString('hex');
  const prefix = 'epd_' + crypto.randomBytes(4).toString('hex');
  const token = prefix + '_' + randomBytes;
  return { token, prefix };
};

// Hash token before saving
apiTokenSchema.pre('save', async function (next) {
  if (this.isNew && this.token && !this.token.startsWith('$2')) {
    // Store hash for security, but we'll return the plain token once on creation
    this.tokenHash = crypto.createHash('sha256').update(this.token).digest('hex');
  }
  next();
});

// Method to check if token is expired
apiTokenSchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Method to check if token is valid
apiTokenSchema.methods.isValid = function () {
  return this.isActive && !this.isExpired();
};

// Method to update last used
apiTokenSchema.methods.updateLastUsed = async function (ip = null) {
  this.lastUsedAt = new Date();
  this.usageCount += 1;
  if (ip) this.lastUsedIp = ip;
  await this.save();
};

// Virtual for masked token (show only prefix and last 4 chars)
apiTokenSchema.virtual('maskedToken').get(function () {
  if (!this.token) return null;
  const tokenStr = this.token.toString();
  if (tokenStr.length < 20) return tokenStr;
  return tokenStr.slice(0, 12) + '...' + tokenStr.slice(-4);
});

// Ensure virtuals are included in JSON
apiTokenSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.token; // Never send full token in responses (except on creation)
    delete ret.tokenHash;
    return ret;
  },
});

const ApiToken = mongoose.model('ApiToken', apiTokenSchema);

export default ApiToken;
