// controllers/orderController.js

const Order = require('../Models/Order');
const Organisation = require('../Models/Organisation');
// ✅ Accept an order (sets status = "accepted")




// ✅ Create a new order
// ✅ Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { organisationId, items, paymentMethod, transactionId, tags } = req.body;

    if (!organisationId || !items || !items.length || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Calculate totalAmount automatically
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const newOrder = new Order({
      organisationId,
      items,
      totalAmount,
      paymentMethod,
      transactionId,
      status: 'pending',
      tags: Array.isArray(tags) ? tags : undefined,
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

exports.acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'accepted' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order accepted successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting order', error });
  }
};

// Reject an order (sets status = "rejected")
exports.rejectOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'rejected' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order rejected successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting order', error });
  }
};
/*
    {uri : 'https://youtu.be' ,
    input : 'my question '
    
    }
*/
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "organisationId", // this will expand into organisation details
         // pick the fields you want
      })
      .populate({
        path: "items.productId", // expand product details too

      });

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};






// View all orders (optionally filter by status)
exports.viewOrders = async (req, res) => {
  try {
    const { status } = req.query; // e.g., ?status=pending

    const filter = status ? { status } : {};

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// ✅ Update order status (general update function)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // "pending", "accepted", "rejected", "completed"

    if (!['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
};

exports.deleteAllOrders = async(req, res)=>{
    try {
        const response = await Order.deleteMany();
        return res.status(200).json({message : "Deleted All orders ", response});
        
    } catch (error) {

        return res.status(404).json({message: 'Something went wrong' , error: error.message});
        
    }
}
