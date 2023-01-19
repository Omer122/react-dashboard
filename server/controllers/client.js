import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import getCountryIso3 from "country-iso-2-to-3";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find(); // give us all the products
    //api call for each product to the DB
    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return { //return array of objects with the prod info & stat info
          ...product._doc, //mongoDB requierment
          stat,
        };
      })
    );

    res.status(200).json(productsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// user, admin, superAdmin
export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password"); //-password so it won't send to the FE
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => { //server side pagination
  try {
    // sort should look like this: { "field": "userId", "sort": "desc"}
    //grab from the FE the values:
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);//parse the string "sort" from the FE
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1), //if ascending -> 1
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};//if exist -> generateSort

    const transactions = await Transaction.find({//setup transaction sort, make sure to import Transaction
      $or: [//search in multiple fields
        { cost: { $regex: new RegExp(search, "i") } },//search the cost field for the value "search"
        { userId: { $regex: new RegExp(search, "i") } },//_id can't do the search here only userId
      ],
    })
      .sort(sortFormatted)     //provide the query of sorting
      .skip(page * pageSize)   //allow us to skip to the proper page
      .limit(pageSize);

    const total = await Transaction.countDocuments({//show the number of docs exist in mongoDB
      name: { $regex: search, $options: "i" },//gives us the total count
    });

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGeography = async (req, res) => {
  try {
    const users = await User.find();

    //converts from 2 country symbol to 3 and counts the users in each country
    const mappedLocations = users.reduce((acc, { country }) => {//starts with empty objects and adds to it
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]) {// if there isn't any value in country
        acc[countryISO3] = 0; //set to zero
      }
      acc[countryISO3]++;
      return acc; //the value represent # of users in that country
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count }; // return format for nivo charts to formattedLocations
      }
    );

    res.status(200).json(formattedLocations);//return the right format to the FE for nivo
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};