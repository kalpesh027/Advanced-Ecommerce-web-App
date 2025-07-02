import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axiosInstance from '../../../axiosConfig';

const cardClasses = 'bg-white p-4 rounded-lg shadow-lg flex-1';
const textClasses = 'text-muted-foreground';
const valueClasses = 'text-2xl font-bold text-card-foreground';

const Analytics3 = () => {
  const [orders, setOrders] = useState([]);
  const [comments, setComments] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState('day');
  const [overallRevenue, setOverallRevenue] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState({});
  const [weeklyRevenue, setWeeklyRevenue] = useState({});
  const [monthlyRevenue, setMonthlyRevenue] = useState({});

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/profitrevenue/getNullproduct');
      const { dailyRevenue, dailyProfit, weeklyRevenue, weeklyProfit, monthlyRevenue, monthlyProfit, overallRevenue } = response.data;

      setDailyRevenue(dailyRevenue);
      setWeeklyRevenue(weeklyRevenue);
      setMonthlyRevenue(monthlyRevenue);
      setOverallRevenue(overallRevenue);

      const chartDataMap = {
        day: {
          labels: Object.keys(dailyRevenue),
          datasets: [
            {
              label: 'Revenue',
              data: Object.values(dailyRevenue),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
              label: 'Profit',
              data: Object.values(dailyProfit),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        },
        week: {
          labels: Object.keys(weeklyRevenue),
          datasets: [
            {
              label: 'Revenue',
              data: Object.values(weeklyRevenue),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
              label: 'Profit',
              data: Object.values(weeklyProfit),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        },
        month: {
          labels: Object.keys(monthlyRevenue),
          datasets: [
            {
              label: 'Revenue',
              data: Object.values(monthlyRevenue),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
              label: 'Profit',
              data: Object.values(monthlyProfit),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        },
      };

      setChartData(chartDataMap);
    } catch (error) {
      console.error('Error fetching chart data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  useEffect(() => {
    // Set dummy data for orders and comments
    setOrders([
      { product: 'Prodotti per il tuo cane...', price: '20 Nov 2023', deliveryDate: '20 Nov 2023', imageSrc: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSMgDfLC7IUaSpSahcTId7yQxQ0eL7sC17bvgUiG8vlYfmQ22VU' },
      { product: 'Wholesome Pride...', price: '20 Nov 2023', deliveryDate: '20 Nov 2023', imageSrc: 'https://cdn.dmart.in/images/products/JUN140000803xx26JUN23_5_P.jpg' },
      { product: 'Beneful Baked Delights...', price: '20 Nov 2023', deliveryDate: '20 Nov 2023', imageSrc: 'https://cdn.dmart.in/images/products/AUG120004098xx25AUG21_5_B.jpg' },
      { product: 'Taste of the Wild...', price: '20 Nov 2023', deliveryDate: '20 Nov 2023', imageSrc: 'https://cdn.dmart.in/images/products/APR150003266xx13APR23_5_P.jpg' },
      { product: "Canagan - Britain's...", price: '20 Nov 2023', deliveryDate: '20 Nov 2023', imageSrc: 'https://www.itcstore.in/_next/image?url=https%3A%2F%2Fadmin.itcstore.in%2Fmedia%2Fcatalog%2Fproduct%2F1%2F_%2F1_28.png%3Foptimize%3Dmedium%26fit%3Dbounds%26height%3D%26width%3D%26height%3D200%26width%3D200&w=1920&q=75' },
    ]);

    setComments([
      { name: 'Kathryn Murphy', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nec dolor vel est interdum', rating: 4, avatarSrc: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { name: 'Leslie Alexander', text: 'Cras nec viverra justo, a mattis lacus. Vestibulum eleifend, leo sit amet aliquam laoreet, turpis leo vulputate orci', rating: 4, avatarSrc: 'https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { name: 'Devon Lane', text: 'Morbi eget commodo diam. Praesent dignissim purus ac turpis porta', rating: 4, avatarSrc: 'https://images.unsplash.com/photo-1522307837370-cc113a36b784?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { name: 'Eleanor Pena', text: 'Praesent dignissim purus ac turpis porta', rating: 4, avatarSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    ]);
  }, []);

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <div className={cardClasses}>
        <h2 className="text-lg font-semibold">Earnings</h2>
        <div className="mb-4">
          <div className="flex items-center">
            <h3 className={valueClasses}>₹{overallRevenue.toFixed(2)}</h3>
          </div>
          <p className={textClasses}>Revenue</p>
        </div>
        <div className="w-full md:w-[90%]">
          <div>
            <div className="flex mb-4">
              <button onClick={() => setTimeRange('day')} className={`mr-2 ${timeRange === 'day' ? 'bg-blue-500' : 'bg-gray-200'}`}>
                Daily
              </button>
              <button onClick={() => setTimeRange('week')} className={`mr-2 ${timeRange === 'week' ? 'bg-blue-500' : 'bg-gray-200'}`}>
                Weekly
              </button>
              <button onClick={() => setTimeRange('month')} className={`${timeRange === 'month' ? 'bg-blue-500' : 'bg-gray-200'}`}>
                Monthly
              </button>
            </div>
            {chartData && (
              <Bar
                data={chartData[timeRange]}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { position: 'top' },
                  },
                  scales: {
                    x: {
                      title: { display: true, text: timeRange === 'day' ? 'Date' : timeRange === 'week' ? 'Week' : 'Month' },
                      ticks: {
                        autoSkip: true,
                        maxTicksLimit: timeRange === 'day' ? 10 : 5,
                      },
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      title: { display: true, text: 'Amount (₹)' },
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => '₹' + value.toLocaleString(),
                        stepSize: 1000,
                      },
                      grid: {
                        display: true,
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics3;
