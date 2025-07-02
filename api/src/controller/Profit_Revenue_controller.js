import Order from "../models/order.model.js";

export const Profit_Revenue = async (req, res) => {
    // const userId = req.user.id; 

    try {
        const orders = await Order.find().populate({
            path: "orderItems",
            populate: {
                path: "product",
                model: "products",
            },
        });

        let dailyRevenue = {};
        let dailyProfit = {};
        let overallRevenue = 0;
        let overallProfit = 0;

        orders.forEach(order => {
            const orderDate = new Date(order.orderDate);
            const dateString = orderDate.toISOString().split('T')[0]; // Get YYYY-MM-DD

            const revenue = order.totalDiscountedPrice; // Total revenue
            overallRevenue += revenue; // Update overall revenue

            // Calculate total cost and profit
            let totalCost = 0;
            order.orderItems.forEach(item => {
                // Check if product exists
                if (item.product) {
                    const cost = item.product.purchaseRate * item.quantity; // Calculate cost for this item
                    totalCost += cost; // Accumulate total cost
                } else {
                    console.warn(`Product not found for order item: ${item._id}`);
                }
            });

            const profit = revenue - totalCost; // Calculate profit
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

        // For weekly and monthly calculations, you can aggregate the daily data
        const weeklyRevenue = {};
        const weeklyProfit = {};
        const monthlyRevenue = {};
        const monthlyProfit = {};

        Object.keys(dailyRevenue).forEach(date => {
            const dateObj = new Date(date);
            const week = `${dateObj.getFullYear()}-W${getWeekNumber(dateObj)}`;
            const month = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`;

            // Weekly aggregation
            if (!weeklyRevenue[week]) {
                weeklyRevenue[week] = 0;
                weeklyProfit[week] = 0;
            }
            weeklyRevenue[week] += dailyRevenue[date];
            weeklyProfit[week] += dailyProfit[date];

            // Monthly aggregation
            if (!monthlyRevenue[month]) {
                monthlyRevenue[month] = 0;
                monthlyProfit[month] = 0;
            }
            monthlyRevenue[month] += dailyRevenue[date];
            monthlyProfit[month] += dailyProfit[date];
        });

        // Function to extract week number (ISO 8601 format)
        function getWeekNumber(date) {
            const firstDay = new Date(date.getFullYear(), 0, 1);
            const days = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000));
            return Math.ceil((days + firstDay.getDay() + 1) / 7);
        }

        // Output Results
        return res.status(200).json({

            overallRevenue,
            overallProfit,
            dailyRevenue,
            dailyProfit,
            weeklyRevenue,
            weeklyProfit,
            monthlyRevenue,
            monthlyProfit,
        });

    } catch (error) {
        console.log(error)
    }
};


export const Profit_Revenue_aggregate = async (req, res) => {
    try {
        const orders = await Order.find().populate({
            path: "orderItems",
            populate: {
                path: "product",
                model: "products",
            },
        });

        let dailyRevenue = {};
        let dailyProfit = {};
        let overallRevenue = 0;
        let overallProfit = 0;

        orders.forEach(order => {
            const orderDate = new Date(order.orderDate);
            const dateString = orderDate.toISOString().split('T')[0]; // Get YYYY-MM-DD

            const revenue = order.totalPrice; // Total revenue
            overallRevenue += revenue; // Update overall revenue

            // Calculate total cost and profit
            let totalCost = 0;
            order.orderItems.forEach(item => {
                // Check if product exists
                if (item.product) {
                    const cost = item.product.purchaseRate * item.quantity; // Calculate cost for this item
                    totalCost += cost; // Accumulate total cost
                } else {
                    console.warn(`Product not found for order item: ${item._id}`);
                    // Optionally, log or handle missing products more explicitly.
                    // For instance, you can decide to ignore this item or use a default cost.
                }
            });

            const profit = revenue - totalCost; // Calculate profit
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

        // For weekly and monthly calculations, you can aggregate the daily data
        const weeklyRevenue = {};
        const weeklyProfit = {};
        const monthlyRevenue = {};
        const monthlyProfit = {};

        Object.keys(dailyRevenue).forEach(date => {
            const dateObj = new Date(date);
            const week = `${dateObj.getFullYear()}-W${getWeekNumber(dateObj)}`;
            const month = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`;

            // Weekly aggregation
            if (!weeklyRevenue[week]) {
                weeklyRevenue[week] = 0;
                weeklyProfit[week] = 0;
            }
            weeklyRevenue[week] += dailyRevenue[date];
            weeklyProfit[week] += dailyProfit[date];

            // Monthly aggregation
            if (!monthlyRevenue[month]) {
                monthlyRevenue[month] = 0;
                monthlyProfit[month] = 0;
            }
            monthlyRevenue[month] += dailyRevenue[date];
            monthlyProfit[month] += dailyProfit[date];
        });

        // Function to extract week number (ISO 8601 format)
        function getWeekNumber(date) {
            const firstDay = new Date(date.getFullYear(), 0, 1);
            const days = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000));
            return Math.ceil((days + firstDay.getDay() + 1) / 7);
        }

        // Output Results
        return res.status(200).json({
            overallRevenue,
            overallProfit,
            dailyRevenue,
            dailyProfit,
            weeklyRevenue,
            weeklyProfit,
            monthlyRevenue,
            monthlyProfit,
        });

    } catch (error) {
        console.error("Error in Profit_Revenue controller:", error);
        return res.status(500).json({ error: "Server error" });
    }
};


// export const Profit_RevenueNullproduct = async (req, res) => {
//     try {
//         const orders = await Order.find().populate({
//             path: "orderItems",
//             populate: {
//                 path: "product",
//                 model: "products",
//             },
//         });

//         let dailyRevenue = {};
//         let dailyProfit = {};
//         let overallRevenue = 0;
//         let overallProfit = 0;

//         let cancelledOrders = []; // Array to store cancelled orders

//         // Separate payment method orders
//         const onlinePaymentOrders = [];
//         const codOrders = [];

//         const productSales = {};
//         orders.forEach(order => {

//             // Skip cancelled orders
//             if (order.orderStatus === "CANCELLED") {

//                 return; // Skip this iteration
//             }

//             const orderDate = new Date(order.orderDate);
//             const dateString = orderDate.toISOString().split('T')[0]; // Get YYYY-MM-DD

//             const revenue = order.totalDiscountedPrice; // Total revenue
//             overallRevenue += revenue; // Update overall revenue

//             let totalCost = 0; // Initialize totalCost
//             let validProductCount = 0; // Track the number of valid products

        

//             order.orderItems.forEach(item => {
//                 if (item.product) {
//                     const cost = item.product.purchaseRate * item.quantity; // Calculate cost for this item
//                     totalCost += cost; // Accumulate total cost
//                     validProductCount++; // Increment valid product count

//                      // Track product sales
//                      if (!productSales[item.product._id]) {
//                         productSales[item.product._id] = { name: item.product.name, quantity: 0 };
//                     }
//                     productSales[item.product._id].quantity += item.quantity; // Update sold quantity
//                 } else {
//                     console.warn(`Product not found for order item: ${item._id}`); // Log missing product
//                 }
//             });

//             // Calculate profit based only on valid products
//             const profit = validProductCount > 0 ? (revenue - totalCost) : 0; // Set profit to 0 if no valid products

//             overallProfit += profit; // Update overall profit

//             // Initialize daily records if they don't exist
//             if (!dailyRevenue[dateString]) {
//                 dailyRevenue[dateString] = 0;
//                 dailyProfit[dateString] = 0;
//             }

//             // Update daily totals
//             dailyRevenue[dateString] += revenue;
//             dailyProfit[dateString] += profit;

//             // Store orders based on payment method
//             if (order.paymentDetails.paymentMethod === 'Online Payment') {
//                 onlinePaymentOrders.push(order);
//             } else if (order.paymentDetails.paymentMethod === 'COD') {
//                 codOrders.push(order);
//             }
//         });

//         // (Weekly and Monthly calculations would follow the same pattern as before)
//         // For weekly and monthly calculations, you can aggregate the daily data
//         const weeklyRevenue = {};
//         const weeklyProfit = {};
//         const monthlyRevenue = {};
//         const monthlyProfit = {};

//         Object.keys(dailyRevenue).forEach(date => {
//             const dateObj = new Date(date);
//             const week = `${dateObj.getFullYear()}-W${getWeekNumber(dateObj)}`;
//             const month = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`;

//             // Weekly aggregation
//             if (!weeklyRevenue[week]) {
//                 weeklyRevenue[week] = 0;
//                 weeklyProfit[week] = 0;
//             }
//             weeklyRevenue[week] += dailyRevenue[date];
//             weeklyProfit[week] += dailyProfit[date];

//             // Monthly aggregation
//             if (!monthlyRevenue[month]) {
//                 monthlyRevenue[month] = 0;
//                 monthlyProfit[month] = 0;
//             }
//             monthlyRevenue[month] += dailyRevenue[date];
//             monthlyProfit[month] += dailyProfit[date];
//         });

//         // Function to extract week number (ISO 8601 format)
//         function getWeekNumber(date) {
//             const firstDay = new Date(date.getFullYear(), 0, 1);
//             const days = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000));
//             return Math.ceil((days + firstDay.getDay() + 1) / 7);
//         }


//          // Calculate top 10 products sold
//          const top10Products = Object.values(productSales)
//         //  .map(([productId, { name, quantity }]) => ({ productId, name, quantity }))
//          .sort((a, b) => b.quantity - a.quantity) // Sort by quantity sold
//          .slice(0, 10); // Get top 10

        
//         return res.status(200).json({
//             overallRevenue,
//             overallProfit,
//             dailyRevenue,
//             dailyProfit,
//             weeklyRevenue,
//             weeklyProfit,
//             monthlyRevenue,
//             monthlyProfit,
//             onlinePaymentCount: onlinePaymentOrders.length, // Count of online payment orders
//             codOrderCount: codOrders.length,
//             top10Products

//             // would be included here as well
//         });

//     } catch (error) {
//         console.error("Error in Profit_Revenue controller:", error);
//         return res.status(500).json({ error: "Server error" });
//     }
// };


// latest
export const Profit_RevenueNullproduct = async (req, res) => {
    try {
        const orders = await Order.find().populate({
            path: "orderItems",
            populate: {
                path: "product",
                model: "products",
            },
        });

        let dailyRevenue = {};
        let dailyProfit = {};
        let overallRevenue = 0;
        let overallProfit = 0;

        const productSales = {};

        // Process each order
        orders.forEach(order => {
            // Only consider delivered orders
            if (order.orderStatus !== "DELIVERED") return;

            const orderDate = new Date(order.orderDate);
            const dateString = orderDate.toISOString().split('T')[0];
            const revenue = order.totalDiscountedPrice;
            overallRevenue += revenue;

            let totalCost = 0;
            let validProductCount = 0;

            order.orderItems.forEach(item => {
                if (item.product) {
                    const cost = item.product.purchaseRate * item.quantity;
                    totalCost += cost;
                    validProductCount++;

                    if (!productSales[item.product._id]) {
                        productSales[item.product._id] = { name: item.product.name, quantity: 0 };
                    }
                    productSales[item.product._id].quantity += item.quantity;
                }
            });

            const profit = validProductCount > 0 ? (revenue - totalCost) : 0;
            overallProfit += profit;

            if (!dailyRevenue[dateString]) {
                dailyRevenue[dateString] = 0;
                dailyProfit[dateString] = 0;
            }

            dailyRevenue[dateString] += revenue;
            dailyProfit[dateString] += profit;
        });

        const top10Products = Object.values(productSales)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10);

        // Weekly and Monthly Calculations
        const weeklyRevenue = {};
        const weeklyProfit = {};
        const monthlyRevenue = {};
        const monthlyProfit = {};

        Object.keys(dailyRevenue).forEach(date => {
            const dateObj = new Date(date);
            const week = `${dateObj.getFullYear()}-W${getWeekNumber(dateObj)}`;
            const month = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`;

            // Weekly aggregation
            if (!weeklyRevenue[week]) {
                weeklyRevenue[week] = 0;
                weeklyProfit[week] = 0;
            }
            weeklyRevenue[week] += dailyRevenue[date];
            weeklyProfit[week] += dailyProfit[date];

            // Monthly aggregation
            if (!monthlyRevenue[month]) {
                monthlyRevenue[month] = 0;
                monthlyProfit[month] = 0;
            }
            monthlyRevenue[month] += dailyRevenue[date];
            monthlyProfit[month] += dailyProfit[date];
        });

        function getWeekNumber(date) {
            const firstDay = new Date(date.getFullYear(), 0, 1);
            const days = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000));
            return Math.ceil((days + firstDay.getDay() + 1) / 7);
        }

        const formattedResponse = {
            overall: {
                revenue: overallRevenue,
                profit: overallProfit,
            },
            weekly: Object.entries(dailyRevenue).map(([date, revenue]) => ({
                date,
                revenue,
                profit: dailyProfit[date],
            })),
            monthly: Object.entries(weeklyRevenue).map(([week, revenue]) => ({
                week,
                revenue,
                profit: weeklyProfit[week],
            })),
            yearly: Object.entries(monthlyRevenue).map(([month, revenue]) => ({
                month,
                revenue,
                profit: monthlyProfit[month],
            })),
            topProducts: top10Products.map(product => ({
                id: product._id,
                name: product.name,
                quantity: product.quantity,
            })),
            paymentMethods: {
                onlinePaymentCount: orders.filter(order => order.paymentDetails.paymentMethod === 'Online Payment' && order.orderStatus === 'DELIVERED').length,
                codOrderCount: orders.filter(order => order.paymentDetails.paymentMethod === 'COD' && order.orderStatus === 'DELIVERED').length,
            },
        };

        return res.status(200).json(formattedResponse);

    } catch (error) {
        console.error("Error in Profit_Revenue controller:", error);
        return res.status(500).json({ error: "Server error" });
    }
};





export const Profit_Revenuegraph = async (req, res) => {
    try {
        const orders = await Order.find().populate({
            path: "orderItems",
            populate: {
                path: "product",
                model: "products",
            },
        });

        let dailyData = {};
        let weeklyData = {};
        let monthlyData = {};



        orders.forEach(order => {
            // Skip cancelled orders
            if (order.orderStatus === "CANCELLED") {
                return; // Skip this iteration
            }

            const orderDate = new Date(order.orderDate);
            const dateString = orderDate.toISOString().split('T')[0]; // Get YYYY-MM-DD

            const revenue = order.totalDiscountedPrice;
            const sales = order.orderItems.reduce((total, item) => total + (item.quantity || 0), 0); // Total sales quantity

            // Daily Data
            if (!dailyData[dateString]) {
                dailyData[dateString] = { sales: 0, revenue: 0 };
            }
            dailyData[dateString].sales += sales;
            dailyData[dateString].revenue += revenue;

            // Weekly Data
            const week = `${orderDate.getFullYear()}-W${getWeekNumber(orderDate)}`;
            if (!weeklyData[week]) {
                weeklyData[week] = { sales: 0, revenue: 0 };
            }
            weeklyData[week].sales += sales;
            weeklyData[week].revenue += revenue;

            // Monthly Data
            const month = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;
            if (!monthlyData[month]) {
                monthlyData[month] = { sales: 0, revenue: 0 };
            }
            monthlyData[month].sales += sales;
            monthlyData[month].revenue += revenue;
        });

        // Transform daily data
        const dataDay = Object.keys(dailyData).map(date => ({
            name: date,
            sales: dailyData[date].sales,
            revenue: dailyData[date].revenue,
        }));

        // Transform weekly data
        const dataWeek = Object.keys(weeklyData).map(week => ({
            name: week,
            sales: weeklyData[week].sales,
            revenue: weeklyData[week].revenue,
        }));

        // Transform monthly data
        const dataYear = Object.keys(monthlyData).map(month => {
            const monthName = new Date(`${month}-01`).toLocaleString('default', { month: 'short' });
            return {
                name: monthName,
                sales: monthlyData[month].sales,
                revenue: monthlyData[month].revenue,
            };
        });

        // Output Results
        return res.status(200).json({
            dataDay,
            dataWeek,
            dataYear,
        });

    } catch (error) {
        console.error("Error in Profit_Revenue controller:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

// Function to extract week number (ISO 8601 format)
function getWeekNumber(date) {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + firstDay.getDay() + 1) / 7);
}

import moment from "moment"

export const Top10ProductselledbyOrder = async (req, res) => {
    try {
        const { filter } = req.query; // Get the filter from query parameters
        let startDate;
        let endDate = new Date(); // Current date

        // Set the startDate based on the filter
        switch (filter) {
            case 'today':
                startDate = moment().startOf('day').toDate();
                break;
            case 'week':
                startDate = moment().startOf('week').toDate();
                break;
            case 'month':
                startDate = moment().startOf('month').toDate();
                break;
            case 'year':
                startDate = moment().startOf('year').toDate();
                break;
            default:
                startDate = new Date(0); // Default to a very old date (e.g., epoch) to fetch all
                break;
        }

        const allOrders = await Order.find().populate({
            path: "orderItems",
            populate: {
                path: "product",
                model: "products",
            },
        });

        // Step 1: Aggregate quantities of each product
        const productSales = {};

        allOrders.forEach(order => {
            // Skip cancelled orders
            if (order.orderStatus === "CANCELLED") {

                return; // Skip this iteration
            }
            order.orderItems.forEach(item => {
                // Check if item.product is valid
                if (item.product) {
                    const productId = item.product._id; // Assuming product has an _id
                    const quantity = item.quantity;

                    if (!productSales[productId]) {
                        productSales[productId] = {
                            product: item.product,
                            totalSold: 0,
                        };
                    }
                    productSales[productId].totalSold += quantity;
                }
            });
        });

        // Step 2: Convert the aggregated data into an array and sort it
        const sortedProducts = Object.values(productSales).sort((a, b) => b.totalSold - a.totalSold);

        // Step 3: Get the top 10 sold products
        const top10Products = sortedProducts.slice(0, 10);

        // console.log("Top 10 Products:", top10Products);

        res.json({
            top10Products
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'An error occurred while retrieving top products.' });
    }
};


// export const Profit_Revenue_aggregate = async (req, res) => {

//     try {
//         // Aggregate data directly in MongoDB
//         const results = await Order.aggregate([
//             {
//                 $unwind: "$orderItems"
//             },
//             {
//                 $lookup: {
//                     from: "products",
//                     localField: "orderItems.product",
//                     foreignField: "_id",
//                     as: "productDetails"
//                 }
//             },
//             {
//                 $unwind: "$productDetails"
//             },
//             {
//                 $group: {
//                     _id: {
//                         day: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
//                         week: { $isoWeek: "$orderDate" },
//                         month: { $dateToString: { format: "%Y-%m", date: "$orderDate" } }
//                     },
//                     dailyRevenue: { $sum: "$totalPrice" },
//                     dailyCost: { $sum: { $multiply: ["$productDetails.purchaseRate", "$orderItems.quantity"] } }
//                 }
//             },
//             {
//                 $project: {
//                     day: "$_id.day",
//                     week: "$_id.week",
//                     month: "$_id.month",
//                     dailyRevenue: 1,
//                     dailyProfit: { $subtract: ["$dailyRevenue", "$dailyCost"] }
//                 }
//             }
//         ]);

//         // Initialize containers for daily, weekly, and monthly data
//         const dailyRevenue = {};
//         const dailyProfit = {};
//         const weeklyRevenue = {};
//         const weeklyProfit = {};
//         const monthlyRevenue = {};
//         const monthlyProfit = {};

//         let overallRevenue = 0;
//         let overallProfit = 0;

//         results.forEach(record => {
//             const { day, week, month, dailyRevenue: revenue, dailyProfit: profit } = record;

//             // Update overall totals
//             overallRevenue += revenue;
//             overallProfit += profit;

//             // Daily data
//             dailyRevenue[day] = revenue;
//             dailyProfit[day] = profit;

//             // Weekly data
//             if (!weeklyRevenue[week]) {
//                 weeklyRevenue[week] = 0;
//                 weeklyProfit[week] = 0;
//             }
//             weeklyRevenue[week] += revenue;
//             weeklyProfit[week] += profit;

//             // Monthly data
//             if (!monthlyRevenue[month]) {
//                 monthlyRevenue[month] = 0;
//                 monthlyProfit[month] = 0;
//             }
//             monthlyRevenue[month] += revenue;
//             monthlyProfit[month] += profit;
//         });

//         // Return aggregated data
//         return res.status(200).json({
//             overallRevenue,
//             overallProfit,
//             dailyRevenue,
//             dailyProfit,
//             weeklyRevenue,
//             weeklyProfit,
//             monthlyRevenue,
//             monthlyProfit
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: "Server Error" });
//     }
// };

// export const Profit_Revenue_aggregate = async (req, res) => {
//     try {
//         const orders = await Order.find().populate({
//             path: "orderItems",
//             populate: {
//                 path: "product",
//                 model: "products",
//             },
//         });

//         console.log("Orders retrieved:", orders.length); // Log number of orders

//         let dailyRevenue = {};
//         let dailyProfit = {};
//         let overallRevenue = 0;
//         let overallProfit = 0;

//         orders.forEach(order => {
//             console.log("Processing order:", order._id); // Debug log for each order

//             const orderDate = new Date(order.orderDate);
//             const dateString = orderDate.toISOString().split('T')[0]; // Get YYYY-MM-DD

//             const revenue = order.totalPrice; // Total revenue
//             console.log("Revenue for order:", revenue); // Log revenue
//             overallRevenue += revenue; // Update overall revenue

//             // Calculate total cost and profit
//             let totalCost = 0;
//             order.orderItems.forEach(item => {
//                 // Check if product exists
//                 if (item.product) {
//                     const cost = item.product.purchaseRate * item.quantity; // Calculate cost for this item
//                     totalCost += cost; // Accumulate total cost
//                 } else {
//                     console.warn(`Product not found for order item: ${item._id}`); // Log missing product
//                 }
//             });

//             const profit = revenue - totalCost; // Calculate profit
//             console.log("Profit for order:", profit); // Log profit
//             overallProfit += profit; // Update overall profit

//             // Initialize daily records if they don't exist
//             if (!dailyRevenue[dateString]) {
//                 dailyRevenue[dateString] = 0;
//                 dailyProfit[dateString] = 0;
//             }

//             // Update daily totals
//             dailyRevenue[dateString] += revenue;
//             dailyProfit[dateString] += profit;
//         });

//         // Debugging the aggregation process
//         console.log("Daily Revenue:", dailyRevenue);
//         console.log("Daily Profit:", dailyProfit);

//         // For weekly and monthly calculations, you can aggregate the daily data
//         const weeklyRevenue = {};
//         const weeklyProfit = {};
//         const monthlyRevenue = {};
//         const monthlyProfit = {};

//         Object.keys(dailyRevenue).forEach(date => {
//             const dateObj = new Date(date);
//             const week = `${dateObj.getFullYear()}-W${getWeekNumber(dateObj)}`;
//             const month = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`;

//             // Weekly aggregation
//             if (!weeklyRevenue[week]) {
//                 weeklyRevenue[week] = 0;
//                 weeklyProfit[week] = 0;
//             }
//             weeklyRevenue[week] += dailyRevenue[date];
//             weeklyProfit[week] += dailyProfit[date];

//             // Monthly aggregation
//             if (!monthlyRevenue[month]) {
//                 monthlyRevenue[month] = 0;
//                 monthlyProfit[month] = 0;
//             }
//             monthlyRevenue[month] += dailyRevenue[date];
//             monthlyProfit[month] += dailyProfit[date];
//         });

//         console.log("Weekly Revenue:", weeklyRevenue);
//         console.log("Monthly Revenue:", monthlyRevenue);

//         // Function to extract week number (ISO 8601 format)
//         function getWeekNumber(date) {
//             const firstDay = new Date(date.getFullYear(), 0, 1);
//             const days = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000));
//             return Math.ceil((days + firstDay.getDay() + 1) / 7);
//         }

//         // Output Results
//         return res.status(200).json({
//             overallRevenue,
//             overallProfit,
//             dailyRevenue,
//             dailyProfit,
//             weeklyRevenue,
//             weeklyProfit,
//             monthlyRevenue,
//             monthlyProfit,
//         });

//     } catch (error) {
//         console.error("Error in Profit_Revenue controller:", error);
//         return res.status(500).json({ error: "Server error" });
//     }
// };