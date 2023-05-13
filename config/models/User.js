import { mongoose } from 'mongoose'

const UserSchema = mongoose.UserSchema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
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
  created: {
    type: Date,
    default: Date.now()
  },
});

export default mongoose.model('User', UserSchema)