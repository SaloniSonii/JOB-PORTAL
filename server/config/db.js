import mongoose from "mongoose";

//function to connect to the mongodb databse
const connectDB = async()=>{
    mongoose.connection.on('connected',() => console.log('Databse Connected'))

    await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`)
}

export default connectDB 