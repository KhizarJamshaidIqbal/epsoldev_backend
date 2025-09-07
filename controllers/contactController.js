import Contact from '../models/Contact.js';

// Get all contacts with pagination and filtering
export const getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, search } = req.query;
    
    // Build query
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get contacts with pagination
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count
    const totalItems = await Contact.countDocuments(query);
    const totalPages = Math.ceil(totalItems / parseInt(limit));
    
    // Get unread count
    const unreadCount = await Contact.countDocuments({ status: 'new' });

    return res.status(200).json({
      contacts,
      totalItems,
      totalPages,
      currentPage: parseInt(page),
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return res.status(500).json({ message: 'Failed to fetch contacts', error: error.message });
  }
};

// Get single contact by ID
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    return res.status(200).json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    return res.status(500).json({ message: 'Failed to fetch contact', error: error.message });
  }
};

// Create new contact (public endpoint)
export const createContact = async (req, res) => {
  try {
    console.log('Creating contact with data:', req.body);
    const newContact = new Contact(req.body);
    console.log('New contact object before save:', newContact);
    const savedContact = await newContact.save();
    console.log('Saved contact:', savedContact);
    return res.status(201).json(savedContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to create contact', error: error.message });
  }
};

// Update contact
export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // If status is being updated to 'replied', set repliedAt
    if (updateData.status === 'replied' && !updateData.repliedAt) {
      updateData.repliedAt = new Date();
    }
    
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    return res.status(200).json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return res.status(500).json({ message: 'Failed to update contact', error: error.message });
  }
};

// Delete contact
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);
    
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    return res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return res.status(500).json({ message: 'Failed to delete contact', error: error.message });
  }
};

// Update contact status
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updateData = { status };
    
    // If status is being updated to 'replied', set repliedAt
    if (status === 'replied') {
      updateData.repliedAt = new Date();
    }
    
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    return res.status(200).json(updatedContact);
  } catch (error) {
    console.error('Error updating contact status:', error);
    return res.status(500).json({ message: 'Failed to update contact status', error: error.message });
  }
};

// Get contacts by status
export const getContactsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const contacts = await Contact.find({ status }).sort({ createdAt: -1 });
    return res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contacts by status:', error);
    return res.status(500).json({ message: 'Failed to fetch contacts by status', error: error.message });
  }
};

// Get contact statistics
export const getContactStats = async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalContacts = await Contact.countDocuments();
    const unreadCount = await Contact.countDocuments({ status: 'new' });
    const recentContacts = await Contact.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    
    return res.status(200).json({
      statusBreakdown: stats,
      totalContacts,
      unreadCount,
      recentContacts
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    return res.status(500).json({ message: 'Failed to fetch contact stats', error: error.message });
  }
};
