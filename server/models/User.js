import mongoose from "mongoose";
// format / structure for each user in the DB

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 100
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true
    },
    password: {
      type: String,
      required: true,
      min: 5
    },
    city: String,
    state: String,
    country: String,
    occupation: String,
    phoneNumber: String,
    transactions: Array,
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],//one of 3 values
      default: "admin"
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;