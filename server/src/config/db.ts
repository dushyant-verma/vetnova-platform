import mongoose from 'mongoose';

export const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const localUri = 'mongodb://127.0.0.1:27017/vetnova';

  if (primaryUri) {
    try {
      const conn = await mongoose.connect(primaryUri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (primaryError: any) {
      console.error(`[Database Warning] Primary MONGO_URI failed (${primaryError.message}).`);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
      console.log('[Database] Falling back to local MongoDB (127.0.0.1:27017)...');
    }
  }

  try {
    const conn = await mongoose.connect(localUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
