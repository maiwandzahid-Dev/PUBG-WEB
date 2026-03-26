import mongoose from "mongoose";

// ✅ د چاپیریال متغیر
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    "مهرباني وکړئ MONGODB_URI په .env.local یا Vercel dashboard کې تعریف کړئ"
  );
}

// ✅ د cached اړیکې لپاره انترفیس
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// ✅ ګلوبل cached جوړول، څو په dev کې څو ځلې DB نه خلاص شي
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };
if (!global.mongoose) global.mongoose = cached;

// ✅ DB ته د نښلیدو فنکشن
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;