import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect("mongodb+srv://elvismurati15_db_user:ws53RZUIQ5Sc3rpe@cluster0.3lzrs57.mongodb.net/food-del");
    console.log("You successfully connected to MongoDB!");
    return mongoose;
  } catch (err) {
    console.dir(err);
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await mongoose.connection.close();
}