import ContactDetails from '../models/ContactDetails.js';

// Get contact details (there should only be one record)
export const getContactDetails = async (req, res) => {
  try {
    let contactDetails = await ContactDetails.findOne();
    
    if (!contactDetails) {
      // Create default contact details if none exist
      contactDetails = new ContactDetails({
        email: 'info@epsoldev.com',
        phone: '+92 3107923290',
        address: 'Lahore, Pakistan',
        googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217896.956993587712d74.17610033203123!3d31.483115999999994!2m3!1f0!2f0!3f0!3m2',
        socialMedia: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: ''
        }
      });
      await contactDetails.save();
    }
    
    return res.status(200).json(contactDetails);
  } catch (error) {
    console.error('Error fetching contact details:', error);
    return res.status(500).json({ message: 'Failed to fetch contact details', error: error.message });
  }
};

// Update contact details
export const updateContactDetails = async (req, res) => {
  try {
    const updateData = req.body;
    
    let contactDetails = await ContactDetails.findOne();
    
    if (!contactDetails) {
      // Create new contact details if none exist
      contactDetails = new ContactDetails(updateData);
    } else {
      // Update existing contact details
      Object.assign(contactDetails, updateData);
    }
    
    const savedContactDetails = await contactDetails.save();
    return res.status(200).json(savedContactDetails);
  } catch (error) {
    console.error('Error updating contact details:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to update contact details', error: error.message });
  }
};

// Create contact details (if needed)
export const createContactDetails = async (req, res) => {
  try {
    console.log('Creating contact details with data:', req.body);
    const newContactDetails = new ContactDetails(req.body);
    console.log('New contact details object before save:', newContactDetails);
    const savedContactDetails = await newContactDetails.save();
    console.log('Saved contact details:', savedContactDetails);
    return res.status(201).json(savedContactDetails);
  } catch (error) {
    console.error('Error creating contact details:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to create contact details', error: error.message });
  }
};

// Delete contact details (admin only)
export const deleteContactDetails = async (req, res) => {
  try {
    const deletedContactDetails = await ContactDetails.findOneAndDelete();
    
    if (!deletedContactDetails) {
      return res.status(404).json({ message: 'Contact details not found' });
    }
    
    return res.status(200).json({ message: 'Contact details deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact details:', error);
    return res.status(500).json({ message: 'Failed to delete contact details', error: error.message });
  }
};
