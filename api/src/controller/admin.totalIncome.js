import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// Helper function to calculate percentage change
const calculatePercentageChange = (current, previous) => {
  return previous ? ((current - previous) / previous) * 100 : 0;
};

const getTotalEarning = async () => {
  let overallRevenue = 0;
  let overallProfit = 0;

  let dailyRevenue = {};
  let dailyProfit = {};


  const orders = await Order.find().populate({
        path: "orderItems",
        populate: {
            path: "product",
            model: "products",
        },
    });

  orders.forEach(order => {
    // Skip cancelled orders
    if (order.orderStatus === "CANCELLED") {
      return; // Skip this iteration
    }

    const orderDate = new Date(order.orderDate);
    const dateString = orderDate.toISOString().split('T')[0]; // Get YYYY-MM-DD

    const revenue = order.totalDiscountedPrice; // Total revenue
    overallRevenue += revenue; // Update overall revenue

    let totalCost = 0; // Initialize totalCost
    let validProductCount = 0; // Track the number of valid products

    order.orderItems.forEach(item => {
      if (item.product) {
        const cost = item.product.purchaseRate * item.quantity; // Calculate cost for this item
        totalCost += cost; // Accumulate total cost
        validProductCount++; // Increment valid product count
      } else {
        console.warn(`Product not found for order item: ${item._id}`); // Log missing product
      }
    });

    // Calculate profit based only on valid products
    const profit = validProductCount > 0 ? (revenue - totalCost) : 0; // Set profit to 0 if no valid products
   console.log(profit);
    overallProfit += profit; // Update overall profit

    // Initialize daily records if they don't exist
    if (!dailyRevenue[dateString]) {
      dailyRevenue[dateString] = 0;
      dailyProfit[dateString] = 0;
    }

    // Update daily totals
    dailyRevenue[dateString] += revenue;
    dailyProfit[dateString] += profit;
  });
  return overallProfit;
};

// Controller to fetch dashboard data
export const getDashboardData = async (req, res) => {
  try {
    // 1. KPIs: Total Orders, Total Sales, Total Earnings
    const totalOrderCount = await Order.countDocuments();

    const totalSalesResult = await Order.aggregate([
      { $match: { orderStatus: "DELIVERED" } },
      { $group: { _id: null, totalSales: { $sum: "$totalDiscountedPrice" } } }
    ]);

    const totalEarningResult = await getTotalEarning();
    
    const kpis = {
      totalOrder: { value: `${totalOrderCount}`, percentageChange: 14 },
      totalSales: { value: totalSalesResult[0]?.totalSales || 0, percentageChange: -8 },
      totalEarning: {
        value: totalEarningResult ,
        percentageChange: 12
      }
    };

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to the start of the current week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0); // Reset to midnight
    
    const weeklyEarningsResult = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfWeek }, orderStatus: "DELIVERED" } },
      { $group: { _id: { $dayOfWeek: "$createdAt" }, total: { $sum: "$totalDiscountedPrice" } } },
      { $sort: { "_id": 1 } }
    ]);
    
    const monthlyEarnings = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(new Date().setDate(1)) }, orderStatus: "DELIVERED" } },
      { $group: { _id: { $week: "$createdAt" }, total: { $sum: "$totalDiscountedPrice" } } },
      { $sort: { "_id": 1 } }
    ]);

    const yearlyEarnings = await Order.aggregate([
      { $match: { orderStatus: "DELIVERED" } },
      { $group: { _id: { $month: "$createdAt" }, total: { $sum: "$totalDiscountedPrice" } } },
      { $sort: { "_id": 1 } }
    ]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyEarnings = daysOfWeek.map((day, index) => {
  const dayData = weeklyEarningsResult.find(entry => entry._id === index + 1); 
  return { name: day, value: dayData ? dayData.total : 0 }; 
  });

    const earningRevenue = {
      weekly: weeklyEarnings,
      monthly: monthlyEarnings.map((week, index) => ({ name: `Week ${index + 1}`, value: week.total })),
      yearly: yearlyEarnings.map((month, index) => ({ name: new Date(0, index).toLocaleString('default', { month: 'short' }), value: month.total }))
    };

    // 3. Order Distribution
    const onlineOrdersCount = await Order.countDocuments({ "paymentDetails.paymentMethod": "Online Payment" });
    const CODOrdersCount = totalOrderCount - onlineOrdersCount;

    const orderDistribution = {
      total: totalOrderCount,
      online: onlineOrdersCount,
      store: CODOrdersCount
    };

    // 4. Product Selling
    const productSelling = await Order.aggregate([
      { $unwind: "$orderItems" },
      { $group: {
          _id: "$orderItems.product._id",
          orderCount: { $sum: "$orderItems.quantity" }
        }
      },
      { $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      { $project: {
          title: "$productDetails.title",
          order: "$orderCount",
          price: "$productDetails.discountedPrice",
          stocks: "$productDetails.quantity",
          amount: { $multiply: ["$productDetails.discountedPrice", "$orderCount"] }
        }
      },
      { $sort: { amount: -1 } },
      { $limit: 5 }
    ]);
    
    // 5. Recent Orders
    const recentOrders = await Order.find()
      .sort({ orderDate: -1 })
      .limit(3)
      .select("orderItems.product.title createdAt")
      .lean();


    // 6. Top Selling Products
    const topSellingProducts = await Order.aggregate([
      { $unwind: "$orderItems" },
      { $unwind: "$orderItems.product" },
      { $group: {
          _id: "$orderItems.product._id",
          totalSales: { $sum: "$orderItems.quantity" },
          totalRevenue: { $sum: { $multiply: ["$orderItems.quantity", "$orderItems.product.discountedPrice"] } }
        }
      },
      { $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      { $project: {
          name: "$productDetails.title",
          sales: "$totalSales",
          revenue: "$totalRevenue"
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        kpis,
        earningRevenue,
        orderDistribution,
        productSelling,
        // recentOrders: recentOrders.map(order => ({
        //   name: order.orderItems[0].product.title,  // Changed to access product title
        //   time: order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : "Just Now"
        // })),
        topSellingProducts
      }
    });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
