import { mongoose } from 'mongoose'
import * as dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO)
        console.log('DB Connected');
    } catch(error) {
        console.log('There was an error')
        console.error(error)
        process.exit(1)
    }
}

export default connectDB
