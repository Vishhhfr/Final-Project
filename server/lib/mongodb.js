import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;  // Use the MongoDB URI from .env file

    if (!uri) {
      throw new Error('MongoDB URI is not defined in .env');
    }

    console.log('Attempting to connect to MongoDB at:', uri);
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully');

    // Add connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

export default connectDB;
