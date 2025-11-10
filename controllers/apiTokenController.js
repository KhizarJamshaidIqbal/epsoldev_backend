import ApiToken from '../models/ApiToken.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// @desc    Get all API tokens for the authenticated user
// @route   GET /api/tokens
// @access  Private (Admin)
export const getApiTokens = asyncHandler(async (req, res) => {
  const tokens = await ApiToken.find({ createdBy: req.user.id })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name email');

  res.status(200).json({
    success: true,
    count: tokens.length,
    data: tokens,
  });
});

// @desc    Get single API token
// @route   GET /api/tokens/:id
// @access  Private (Admin)
export const getApiToken = asyncHandler(async (req, res) => {
  const token = await ApiToken.findOne({
    _id: req.params.id,
    createdBy: req.user.id,
  }).populate('createdBy', 'name email');

  if (!token) {
    res.status(404);
    throw new Error('API token not found');
  }

  res.status(200).json({
    success: true,
    data: token,
  });
});

// @desc    Create new API token
// @route   POST /api/tokens
// @access  Private (Admin)
export const createApiToken = asyncHandler(async (req, res) => {
  const { name, description, expiresAt, permissions, rateLimit } = req.body;

  // Validate required fields
  if (!name) {
    res.status(400);
    throw new Error('Token name is required');
  }

  // Generate secure token
  const { token, prefix } = ApiToken.generateToken();

  // Create token document
  const apiToken = await ApiToken.create({
    name,
    description,
    token,
    prefix,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    permissions: permissions || ['read'],
    rateLimit: rateLimit || {
      requestsPerMinute: 60,
      requestsPerDay: 1000,
    },
    createdBy: req.user.id,
  });

  // Populate creator info
  await apiToken.populate('createdBy', 'name email');

  // Return the plain token ONLY on creation (won't be shown again)
  const responseToken = apiToken.toJSON();
  responseToken.token = token; // Override to send plain token

  res.status(201).json({
    success: true,
    message: 'API token created successfully. Save this token securely - it will not be shown again!',
    data: responseToken,
  });
});

// @desc    Update API token (name, description, permissions, etc.)
// @route   PUT /api/tokens/:id
// @access  Private (Admin)
export const updateApiToken = asyncHandler(async (req, res) => {
  const { name, description, isActive, permissions, expiresAt, rateLimit } = req.body;

  const token = await ApiToken.findOne({
    _id: req.params.id,
    createdBy: req.user.id,
  });

  if (!token) {
    res.status(404);
    throw new Error('API token not found');
  }

  // Update allowed fields
  if (name !== undefined) token.name = name;
  if (description !== undefined) token.description = description;
  if (isActive !== undefined) token.isActive = isActive;
  if (permissions !== undefined) token.permissions = permissions;
  if (expiresAt !== undefined) token.expiresAt = expiresAt ? new Date(expiresAt) : null;
  if (rateLimit !== undefined) {
    token.rateLimit = {
      requestsPerMinute: rateLimit.requestsPerMinute || token.rateLimit.requestsPerMinute,
      requestsPerDay: rateLimit.requestsPerDay || token.rateLimit.requestsPerDay,
    };
  }

  await token.save();
  await token.populate('createdBy', 'name email');

  res.status(200).json({
    success: true,
    message: 'API token updated successfully',
    data: token,
  });
});

// @desc    Delete API token
// @route   DELETE /api/tokens/:id
// @access  Private (Admin)
export const deleteApiToken = asyncHandler(async (req, res) => {
  const token = await ApiToken.findOne({
    _id: req.params.id,
    createdBy: req.user.id,
  });

  if (!token) {
    res.status(404);
    throw new Error('API token not found');
  }

  await token.deleteOne();

  res.status(200).json({
    success: true,
    message: 'API token deleted successfully',
    data: {},
  });
});

// @desc    Revoke API token (set isActive to false)
// @route   PUT /api/tokens/:id/revoke
// @access  Private (Admin)
export const revokeApiToken = asyncHandler(async (req, res) => {
  const token = await ApiToken.findOne({
    _id: req.params.id,
    createdBy: req.user.id,
  });

  if (!token) {
    res.status(404);
    throw new Error('API token not found');
  }

  token.isActive = false;
  await token.save();
  await token.populate('createdBy', 'name email');

  res.status(200).json({
    success: true,
    message: 'API token revoked successfully',
    data: token,
  });
});

// @desc    Activate API token (set isActive to true)
// @route   PUT /api/tokens/:id/activate
// @access  Private (Admin)
export const activateApiToken = asyncHandler(async (req, res) => {
  const token = await ApiToken.findOne({
    _id: req.params.id,
    createdBy: req.user.id,
  });

  if (!token) {
    res.status(404);
    throw new Error('API token not found');
  }

  token.isActive = true;
  await token.save();
  await token.populate('createdBy', 'name email');

  res.status(200).json({
    success: true,
    message: 'API token activated successfully',
    data: token,
  });
});

// @desc    Get API token statistics
// @route   GET /api/tokens/stats
// @access  Private (Admin)
export const getApiTokenStats = asyncHandler(async (req, res) => {
  const tokens = await ApiToken.find({ createdBy: req.user.id });

  const stats = {
    total: tokens.length,
    active: tokens.filter((t) => t.isActive).length,
    inactive: tokens.filter((t) => !t.isActive).length,
    expired: tokens.filter((t) => t.isExpired()).length,
    totalUsage: tokens.reduce((sum, t) => sum + t.usageCount, 0),
    recentlyUsed: tokens
      .filter((t) => t.lastUsedAt)
      .sort((a, b) => b.lastUsedAt - a.lastUsedAt)
      .slice(0, 5)
      .map((t) => ({
        id: t._id,
        name: t.name,
        lastUsedAt: t.lastUsedAt,
        usageCount: t.usageCount,
      })),
  };

  res.status(200).json({
    success: true,
    data: stats,
  });
});
