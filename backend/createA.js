// createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/travellll'; // change DB name if needed
const SALT_ROUNDS = 10;

// Define schema (matching your provided schema)
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    avatar: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/mern-travel-tourism.appspot.com/o/profile-photos%2F1706415975072defaultProfileImgttms125.png?alt=media&token=7f309b9e-7ccf-4a15-ba5c-829c9952a85c",
    },
    user_role: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const email = 'a@a';
    const plainPassword = 'a#';

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('User with this email already exists:', email);
      await mongoose.disconnect();
      return;
    }

    // Hash password
    const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);

    // Create admin user (user_role: 1 for admin)
    const adminUser = new User({
      username: 'admin',
      email,
      password: hashed,
      address: 'Admin Address',
      phone: '0000000000',
      user_role: 1,
    });

    await adminUser.save();
    console.log('Admin user created successfully:', { email: adminUser.email, id: adminUser._id });

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  }
}

createAdmin();
