import { mongoose } from 'mongoose'

const { Schema } = mongoose

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  rol: {
    type: String,
    required: true,
  }
});

const User = mongoose.model("User", UserSchema);
export default User