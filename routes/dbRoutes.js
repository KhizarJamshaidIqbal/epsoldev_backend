import express from 'express';
import mongoose from 'mongoose';
import dbConnectionCheck from '../middleware/dbConnectionCheck.js';

const router = express.Router();

// Apply middleware to all routes
router.use(dbConnectionCheck);

// Get all collections
router.get('/collections', async (req, res) => {
  try {
    if (!mongoose.connection.readyState) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({ collections: collections.map(col => col.name) });
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

// Get documents from a collection
router.get('/collections/:collectionName', async (req, res) => {
  try {
    if (!mongoose.connection.readyState) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { collectionName } = req.params;
    const { limit = 20, skip = 0 } = req.query;
    
    const collection = mongoose.connection.db.collection(collectionName);
    
    // Add projection option to limit large nested objects in list view
    const documents = await collection.find({})
      .limit(Number(limit))
      .skip(Number(skip))
      .toArray();
    
    const total = await collection.countDocuments();
    
    // Process documents to truncate large nested objects/arrays in the list view
    const processedDocuments = documents.map(doc => {
      const processed = { ...doc };
      
      // Process each field to truncate large objects/arrays
      Object.keys(processed).forEach(key => {
        const value = processed[key];
        // Check for arrays or objects that are large
        if (Array.isArray(value) && value.length > 5) {
          // For large arrays, we'll indicate size but not expand full content in list view
          processed[key] = `Array(${value.length} items)`;
        } 
        else if (typeof value === 'object' && value !== null && 
                !Array.isArray(value) && 
                Object.keys(value).length > 5) {
          // For large objects, show just the structure
          processed[key] = `Object(${Object.keys(value).length} properties)`;
        }
      });
      
      return processed;
    });
    
    res.json({ 
      documents: processedDocuments,
      total,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error(`Error fetching documents from ${req.params.collectionName}:`, error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Get a single document with full details
router.get('/collections/:collectionName/documents/:documentId', async (req, res) => {
  try {
    if (!mongoose.connection.readyState) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { collectionName, documentId } = req.params;
    
    const collection = mongoose.connection.db.collection(collectionName);
    
    // Try to convert to ObjectId if possible
    let docId;
    try {
      docId = new mongoose.Types.ObjectId(documentId);
    } catch (err) {
      // If conversion fails, use the string ID
      docId = documentId;
    }
    
    // Fetch the complete document with all nested data
    const document = await collection.findOne({ _id: docId });
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json({ document });
  } catch (error) {
    console.error(`Error fetching document from ${req.params.collectionName}:`, error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// Delete documents from a collection
router.delete('/collections/:collectionName/documents', async (req, res) => {
  try {
    if (!mongoose.connection.readyState) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { collectionName } = req.params;
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No document IDs provided' });
    }
    
    const collection = mongoose.connection.db.collection(collectionName);
    
    // Convert string IDs to ObjectId if the collection uses ObjectId
    let objectIds = [];
    try {
      objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
    } catch (err) {
      // If conversion fails, use the string IDs
      objectIds = ids;
    }
    
    // Try to delete with ObjectId first
    let result = await collection.deleteMany({ _id: { $in: objectIds } });
    
    // If no documents were deleted and we converted to ObjectId, try with string IDs
    if (result.deletedCount === 0 && objectIds !== ids) {
      result = await collection.deleteMany({ _id: { $in: ids } });
    }
    
    res.json({ 
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error(`Error deleting documents from ${req.params.collectionName}:`, error);
    res.status(500).json({ error: 'Failed to delete documents' });
  }
});

// Update a document in a collection
router.patch('/collections/:collectionName/documents/:documentId', async (req, res) => {
  try {
    if (!mongoose.connection.readyState) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { collectionName, documentId } = req.params;
    const updates = req.body;
    
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }
    
    const collection = mongoose.connection.db.collection(collectionName);
    
    // Try to convert to ObjectId if possible
    let docId;
    try {
      docId = new mongoose.Types.ObjectId(documentId);
    } catch (err) {
      // If conversion fails, use the string ID
      docId = documentId;
    }
    
    // Don't allow updating the _id field
    if (updates._id) {
      delete updates._id;
    }
    
    // Process nested updates if needed
    const updatePayload = { ...updates };
    
    // Update the document
    const result = await collection.findOneAndUpdate(
      { _id: docId }, 
      { $set: updatePayload },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json({ 
      success: true,
      document: result.value
    });
  } catch (error) {
    console.error(`Error updating document in ${req.params.collectionName}:`, error);
    res.status(500).json({ error: 'Failed to update document', details: error.message });
  }
});

// Delete a collection
router.delete('/collections/:collectionName', async (req, res) => {
  try {
    if (!mongoose.connection.readyState) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const { collectionName } = req.params;
    
    await mongoose.connection.db.dropCollection(collectionName);
    
    res.json({ 
      success: true,
      message: `Collection '${collectionName}' deleted successfully`
    });
  } catch (error) {
    console.error(`Error deleting collection ${req.params.collectionName}:`, error);
    res.status(500).json({ error: 'Failed to delete collection' });
  }
});

export default router; 