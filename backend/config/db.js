import mongoose from 'mongoose';

global.dbFallback = false;

const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || 'mongodb://localhost:27017/flavornest';
    console.log(`Connecting to MongoDB at: ${connUri}...`);
    
    // Set a short timeout (3 seconds) for quick fallback detection
    mongoose.set('strictQuery', true);
    await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 3000,
    });
    
    console.log('MongoDB Connected Successfully.');
  } catch (error) {
    console.warn('------------------------------------------------------------');
    console.warn('WARNING: Failed to connect to MongoDB.');
    console.warn(`Reason: ${error.message}`);
    console.warn('FlavorNest will automatically fall back to a Local JSON Database.');
    console.warn('This allows the application to run fully without dependencies!');
    console.warn('------------------------------------------------------------');
    global.dbFallback = true;
  }
};

export default connectDB;
