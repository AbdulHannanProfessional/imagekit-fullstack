import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI

if(!MONGO_URI){
    throw new Error("no database url found in env")
}
// let cached: MongooseCache = global.mongoose;
let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {conn: null, promise:  null}
}

export async function connectDatabase (){
    if(cached.conn){
        return cached.conn
    }
    if (!cached.promise) {
    

    await mongoose
    .connect(MONGO_URI)
    .then(() => mongoose.connection);
    try{
        cached.conn = await cached.promise
    }catch(err){

    }
  }
  return cached.conn
}