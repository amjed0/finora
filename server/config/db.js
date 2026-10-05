import mongoose from 'mongoose';

// Cache the connection promise so we don't reconnect on every serverless invocation
let cachedConnection = null;

export const connectDB = async () => {
  // If already connected, return immediately
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/finora';

    if (!connStr || connStr === 'mongodb://localhost:27017/finora') {
      console.warn('⚠️  Using default local MongoDB URI. Set MONGODB_URI env variable for production.');
    }

    cachedConnection = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000, // Fail fast instead of hanging for 30s
      socketTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected: ${cachedConnection.connection.host}`);
    return cachedConnection;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    cachedConnection = null;
    throw error; // Re-throw so callers know the connection failed
  }
};
