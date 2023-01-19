import mongoose from "mongoose";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getAdmins = async (req, res) => {
  try {
    //get all the admin users, without the password
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserPerformance = async (req, res) => {
  try {
    const { id } = req.params; //grab the id

    const userWithStats = await User.aggregate([
      //aggregate calls, from the pipeline in the info docs
      { $match: { _id: new mongoose.Types.ObjectId(id) } }, //convert the id to the mongoDB format and match to the current user
      {
        $lookup: {
          //grab from the affiliatestat and compare it to the userId
          from: "affiliatestats",
          localField: "_id",
          foreignField: "userId",
          as: "affiliateStats",
        },
      },
      { $unwind: "$affiliateStats" },
    ]);

    const saleTransactions = await Promise.all(
      userWithStats[0].affiliateStats.affiliateSales.map((id) => {
        //console log to learn it
        return Transaction.findById(id);
      })
    );
    const filteredSaleTransactions = saleTransactions.filter(
      (transaction) => transaction !== null // get rid of the null
    );

    res
      .status(200)
      .json({ user: userWithStats[0], sales: filteredSaleTransactions });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
