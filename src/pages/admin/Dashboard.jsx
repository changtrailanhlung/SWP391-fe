import React, { useEffect, useState } from "react";
import { Chart } from 'primereact/chart';
import axios from '../../services/axiosClient'; // Import dịch vụ API của bạn

const Dashboard = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donateResponse = await axios.get('/donate');
        const shelterResponse = await axios.get('/shelter');
        const donations = donateResponse.data;
        const shelters = shelterResponse.data;

        // Xử lý dữ liệu donate và shelter
        const shelterNames = shelters.reduce((acc, shelter) => {
          acc[shelter.id] = shelter.name;
          return acc;
        }, {});

        const groupedDonations = donations.reduce((acc, donation) => {
          const shelterName = shelterNames[donation.shelterId];
          acc[shelterName] = acc[shelterName] || 0;
          acc[shelterName] += donation.amount;
          return acc;
        }, {});

        const labels = Object.keys(groupedDonations);
        const data = Object.values(groupedDonations);

        // Hàm tạo màu RGB ngẫu nhiên
        const getRandomColor = () => {
          const r = Math.floor(Math.random() * 256);
          const g = Math.floor(Math.random() * 256);
          const b = Math.floor(Math.random() * 256);
          return `rgb(${r}, ${g}, ${b})`;
        };

        // Tạo danh sách các màu ngẫu nhiên
        const backgroundColors = data.map(() => getRandomColor());
        const borderColors = backgroundColors;

        // Tạo dữ liệu và tùy chọn biểu đồ
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        setChartData({
          labels,
          datasets: [{
            label: 'Donation Amount',
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            data
          }]
        });

        setChartOptions({
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: {
            legend: {
              labels: {
                fontColor: textColor
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: textColorSecondary,
                font: {
                  weight: 500
                }
              },
              grid: {
                display: false,
                drawBorder: false
              }
            },
            y: {
              ticks: {
                color: textColorSecondary
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false
              }
            }
          }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to the admin dashboard! Here, you can manage and view statistics.</p>
      <div className="card">
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
