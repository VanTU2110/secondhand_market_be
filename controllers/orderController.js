
// controllers/orderController.js
const Order = require('../Models/Order'); // Đường dẫn đến model Order
const Product = require('../Models/Product'); // Đường dẫn đến model Product

// controllers/orderController.js
exports.createOrder = async (req, res) => {
  const { buyer_id, shop_id, cart } = req.body;
  console.log('req.body', req.body)
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  console.log('COME HERE 1') 

  try {

    // {
    //   product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    //   title: String,
    //   quantity: { type: Number, default: 1 },
    //   price: { type: Number, required: true },
    //   img_url : String
    // }

    let newProductItem = []
   
    console.log('COME HERE 2')

    // Giảm số lượng sản phẩm
    for (const item of cart) {
      console.log('DEBUG 0: ITEM', item)

      const product = await Product.findById(item._id);
      console.log('DEBUG 1: ', product)
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item._id} not found.` });
      }
    
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Không đủ số lượng cho sản phẩm ${product.title}. Trong kho còn: ${product.quantity},Số lượng bạn đặt: ${item.quantity}`
        });
      }


      await Product.findByIdAndUpdate(item._id, {
        $inc: { quantity: -item.quantity }
      });

      newProductItem.push(
        {
          product_id: product._id,
          title: product.title,
          quantity: product.quantity,
          price: product.price,
          img_url: product.img_url
        }
      )
    }

     const order = new Order({
      buyer_id,
      shop_id,
      cart: newProductItem,
      total_price: totalPrice,
      status: 'pending', 
      payment_status: 'pending'
    });
    console.log('COME HERE 3')

    // Lưu đơn hàng vào cơ sở dữ liệu
    await order.save().then(value => {
      console.log(value)
    }).catch(err => {
      console.log('ERROR:', err)
    });
    console.log('COME HERE 4')

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Thay đổi trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status, payment_status } = req.body;

  try {
    // Cập nhật trạng thái đơn hàng
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { 
        status: status || 'pending', 
        payment_status: payment_status || 'pending',
        payment_date: payment_status === 'completed' ? Date.now() : null
      },
      { new: true } // trả về đơn hàng sau khi đã cập nhật
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
};

// Lấy danh sách đơn hàng của người mua
exports.getOrdersByBuyer = async (req, res) => {
  const { buyerId } = req.params;

  try {
    const orders = await Order.find({ buyer_id: buyerId }).populate('cart.product_id').exec();

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this buyer' });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders for buyer', error });
  }
};

// Lấy danh sách đơn hàng theo shop
exports.getOrdersByShop = async (req, res) => {
  const { shopId } = req.params;

  try {
    const orders = await Order.find({ shop_id: shopId }).populate('cart.product_id').exec();

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this shop' });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders for shop', error });
  }
};

// Get order details by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Tìm đơn hàng theo ID và populate các trường ref
    const order = await Order.findById(orderId)
      .populate('buyer_id', 'name email') // Thông tin người mua (tên và email)
      .populate('shop_id', 'shop_name shop_address') // Thông tin cửa hàng
      .populate('cart.product_id', 'title price'); // Thông tin sản phẩm trong giỏ hàng

    if (!order) {
      return res.status(404).json({ message: 'Order not found'});
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getShopRevenue = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { startDate, endDate } = req.query; // Tham số query (format: YYYY-MM-DD)

    const matchCondition = { 
      shop_id: shopId,
      status: 'paid',
      ...(startDate && endDate && {
        order_date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      })
    };

    const totalRevenue = await Order.aggregate([
      { $match: matchCondition },
      { $group: { _id: null, total: { $sum: "$total_price" } } }
    ]);

    res.json({ totalRevenue: totalRevenue[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.getOrderStatusStats = async (req, res) => {
  try {
    const { shopId } = req.params;

    const orderStatusStats = await Order.aggregate([
      { $match: { shop_id: (shopId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    console.log("Order Status Stats:", orderStatusStats);
    
    res.json(orderStatusStats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.getTopProducts = async (req, res) => {
  try {
    const { shopId } = req.params;

    const topProducts = await Order.aggregate([
      { $match: { shop_id: shopId } },
      { $unwind: "$cart" },
      { 
        $group: { 
          _id: "$cart.product_id",
          title: { $first: "$cart.title" },
          totalQuantity: { $sum: "$cart.quantity" },
          totalRevenue: { $sum: { $multiply: ["$cart.price", "$cart.quantity"] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 } // Lấy top 10 sản phẩm
    ]);
    console.log("Top product",topProducts);
    

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getOrderTimeline = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { startDate, endDate, interval = 'day' } = req.query;
    console.log("req.params:", req.params);
    console.log("req.query:", req.query);


    const timeUnit = interval === 'month' ? 
      { $dateToString: { format: "%Y-%m", date: "$order_date" } } :
      { $dateToString: { format: "%Y-%m-%d", date: "$order_date" } };

    const matchCondition = {
      shop_id: shopId,
      ...(startDate && endDate && {
        order_date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      })
    };

    const orderTimeline = await Order.aggregate([
      { $match: matchCondition },
      { $group: { _id: timeUnit, totalOrders: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    console.log("Ordertimeline", orderTimeline);
    

    res.json(orderTimeline);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getReviewedRatio = async (req, res) => {
  try {
    const { shopId } = req.params;

    const reviewedStats = await Order.aggregate([
      { $match: { shop_id: (shopId) } },
      { $group: { _id: "$reviewed", count: { $sum: 1 } } }
    ]);

    const reviewedCount = reviewedStats.find(stat => stat._id === true)?.count || 0;
    const totalCount = reviewedStats.reduce((acc, stat) => acc + stat.count, 0);

    res.json({ 
      reviewedCount, 
      totalCount, 
      reviewedRatio: totalCount ? (reviewedCount / totalCount) * 100 : 0 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


