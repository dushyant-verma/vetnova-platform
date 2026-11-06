import mongoose from 'mongoose';

const sanitizeMongoUri = (uri?: string): string => {
  if (!uri) return 'undefined';
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
};

// Global connection state listeners
mongoose.connection.on('disconnected', () => {
  console.warn('[Database Warning] Mongoose disconnected from MongoDB.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] Mongoose reconnected to MongoDB.');
});

mongoose.connection.on('error', (err) => {
  console.error('[Database Error] Mongoose connection error:', err.message);
});

export const connectDB = async () => {
  // Support both MONGO_URI and MONGODB_URI across hosting providers
  const primaryUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/vetnova';

  if (primaryUri) {
    try {
      const conn = await mongoose.connect(primaryUri);
      console.log(`[Database] MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
      return conn;
    } catch (primaryError: any) {
      console.error(`[Database Warning] Primary MongoDB connection failed (${sanitizeMongoUri(primaryUri)}): ${primaryError.message}`);
      if (process.env.NODE_ENV === 'production') {
        console.error('[Database Fatal] Exiting production process due to primary database connection failure.');
        process.exit(1);
      }
      console.log('[Database] Falling back to local MongoDB (127.0.0.1:27017)...');
    }
  }

  try {
    const conn = await mongoose.connect(localUri);
    console.log(`[Database] MongoDB Connected locally: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return conn;
  } catch (error: any) {
    console.error(`[Database Fatal] Local database connection failed: ${error.message}`);
    process.exit(1);
  }
};
