import mongoose from 'mongoose';
import { MONGODB_NAME } from '../constants.js'

const MONGODB_CONNECTION = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${MONGODB_NAME}`)
        console.log(`MongoDB Connected !!!`);
    }
    catch(err){
        console.log(" Error ",err);
        process.exit(1)
    }
}

export default MONGODB_CONNECTION;