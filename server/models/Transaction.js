import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: String,
    cost: String,//should be a number instead
    products: { //object of type + number
      type: [mongoose.Types.ObjectId],
      of: Number,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;