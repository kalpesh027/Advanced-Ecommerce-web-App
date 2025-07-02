import React, { useEffect, useState } from "react";
import axiosInstance from './../../../axiosConfig';
import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

// Custom tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 p-2 rounded shadow-lg">
        <p className="text-sm font-semibold">{`Date: ${payload[0].payload.name}`}</p>
        <p className="text-sm">{`Revenue: ₹${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [timeFrame, setTimeFrame] = useState("weekly");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profit revenue data
        const revenueResponse = await axiosInstance.get('/profitrevenue/getNullproduct');
        const apiData = revenueResponse.data;

        const formatData = (data) => data.map(item => ({
          name: new Date(item.date).toLocaleDateString(),
          value: item.revenue,
        }));

        const weeklyData = formatData(apiData.weekly);
        const monthlyData = apiData.monthly.map(item => ({
          name: item.week,
          value: item.revenue,
        }));
        const yearlyData = apiData.yearly.map(item => ({
          name: item.month,
          value: item.revenue,
        }));

        // Fetch other dashboard data
        const response = await axiosInstance.get('/profitrevenue/Top10ProductselledbyOrder');
        const apiTopSellingData = response.data;

        const topSellingProducts = apiTopSellingData.top10Products.map(product => ({
          name: product.product.title,
          sales: product.totalSold,
          revenue: product.product.discountedPrice * product.totalSold,
        }));

        const productSelling = apiTopSellingData.top10Products.map(product => ({
          name: product.product.title,
          order: product.totalSold,
          price: product.product.discountedPrice,
          amount: product.product.discountedPrice * product.totalSold,
          stock: product.product.quantity,
        })).slice(0, 4);

        const recentOrdersResponse = await axiosInstance.get('/order/getAllOrdersAdmin');
        const recentOrdersData = recentOrdersResponse.data.data;
        const recentOrdersLimited = recentOrdersData.slice(-7).reverse().map(order => ({
          name: order.user.userName || "Unknown User",
          mobile: order.user.mobile,
          email: order.user.email || "No Email Provided",
          time: new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));

        // Extract payment method counts from the response
        const paymentMethods = apiData.paymentMethods;

        // Set dashboard data with Overall Revenue and Overall Earnings
        setDashboardData({
          kpis: {
            overallRevenue: { value: apiData.overall.revenue.toLocaleString(), percentageChange: 14 },  
            overallEarnings: { value: apiData.overall.profit.toLocaleString(), percentageChange: -8 }, 
          },
          earningRevenue: {
            weekly: weeklyData,
            monthly: monthlyData,
            yearly: yearlyData,
          },
          orderDistribution: {
            total: paymentMethods.onlinePaymentCount + paymentMethods.codOrderCount,
            online: paymentMethods.onlinePaymentCount,
            cod: paymentMethods.codOrderCount,
          },
          productSelling,
          recentOrders: recentOrdersLimited,
          topSellingProducts,
        });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4 bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(dashboardData.kpis).map(([key, { value, percentageChange }]) => (
          <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
            <div className="text-2xl font-bold">₹{value}</div>
            <div className={`text-xs ${percentageChange >= 0 ? "text-green-500" : "text-red-500"} flex items-center mt-1`}>
              {percentageChange >= 0 ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : <ArrowDownIcon className="w-3 h-3 mr-1" />}
              {Math.abs(percentageChange)}%
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Earning Revenue</h3>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-32 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}
                <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 w-32 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    {["weekly", "monthly", "yearly"].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setTimeFrame(option);
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.earningRevenue[timeFrame]}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Order Distribution</h3>
          <div className="flex justify-center items-center">
            <div className="relative h-48 w-48">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#E5E7EB"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#8B5CF6"
                  strokeWidth="10"
                  strokeDasharray={`${dashboardData.orderDistribution.online / dashboardData.orderDistribution.total * 283} 283`}
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="50" textAnchor="middle" dy=".3em" className="text-3xl font-bold fill-gray-800">
                  {dashboardData.orderDistribution.total}
                </text>
              </svg>
            </div>
          </div>
          <div className="mt-4 flex justify-center space-x-8">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm">Online ({dashboardData.orderDistribution.online})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
              <span className="text-sm">COD ({dashboardData.orderDistribution.cod})</span>
            </div>
          </div>
        </div>
      </div>

    

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Product Selling</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sold</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.productSelling.map((product, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.order}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recently Ordered</h3>
          <div className="space-y-4">
            {dashboardData.recentOrders.map((order, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-500 text-xs">{order.name.substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex flex-col">
                  <div className="font-medium text-sm">{order.name}</div>
                  <div className="text-xs text-gray-500">{order.mobile}</div>
                  <div className="text-xs text-gray-500">{order.email}</div>
                  <div className="text-xs text-gray-500">{order.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {dashboardData.topSellingProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-gray-500 text-xs">{product.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.sales} sales</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">₹{product.revenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
