// controllers/userMarketController.js

const UserMarket = require('../Models/UserMarket');
const Order = require('../Models/Order');
// const Job = require('../Models/Job');

// Accept job or order


exports.acceptJobOrOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, payload } = req.body; 
    console.log('UserID:', userId);
    console.log('Payload:', payload);

    if (type === 'order') {
      // Create a new Order document in the Orders collection
      const newOrder = new Order(payload);
      await newOrder.save();

      // Add the order ID to the user's UserMarket
      const updatedUserMarket = await UserMarket.findOneAndUpdate(
        { userId },
        { $push: { orders: newOrder._id } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      console.log('Updated UserMarket:', updatedUserMarket);

      return res.status(201).json({
        message: 'Order added successfully to UserMarket',
        data: updatedUserMarket,
      });
    } 
    // else if (type === 'job') { ... } // similar logic for jobs
    else {
      return res.status(400).json({ message: 'Invalid type. Use "order" or "job".' });
    }

  } catch (error) {
    console.error('Error in acceptJobOrOrder:', error);
    res.status(500).json({ message: 'Error adding job/order', error });
  }
};



exports.getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;


    const userMarket = await UserMarket.findOne({ userId }).populate({
      path: 'orders',
      populate: {
        path: 'items.productId', 
      },
    });

    console.log(userMarket);

    if (!userMarket) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    res.status(200).json({
      message: 'Orders fetched successfully',
      orders: userMarket.orders,
    });
  } catch (error) {
    console.error('Error in getMyOrders:', error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};
