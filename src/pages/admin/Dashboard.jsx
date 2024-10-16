import React, { useEffect, useState, useRef } from "react";
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card'; // Import Card for styling
import axios from '../../services/axiosClient'; // Import dịch vụ API của bạn

const Dashboard = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalPets, setTotalPets] = useState(0);
  const [totalAvailablePets, setTotalAvailablePets] = useState(0); // New state for available pets
  const [totalShelters, setTotalShelters] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const toast = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donateResponse = await axios.get('/donate');
        const shelterResponse = await axios.get('/shelter/get_all_shelter');
        const accountResponse = await axios.get('/users');
        const petResponse = await axios.get('/pet');

        const donations = donateResponse.data;
        const shelters = shelterResponse.data;
        const accounts = accountResponse.data;
        const pets = petResponse.data;

        // Tính tổng số tiền donate
        const total = donations.reduce((sum, donation) => sum + donation.amount, 0);
        setTotalRevenue(total);

        // Tính tổng số lượng shelter
        const totalShelterCount = shelters.length;
        setTotalShelters(totalShelterCount);

        // Tính tổng số lượng account
        const totalAccountCount = accounts.length;
        setTotalAccounts(totalAccountCount);

        // Tính tổng số lượng pet
        const totalPetCount = pets.length;
        setTotalPets(totalPetCount);

        // Đếm số thú cưng Available
        const availablePetCount = pets.filter(pet => pet.adoptionStatus === 'Available').length;
        setTotalAvailablePets(availablePetCount);

        // Xử lý dữ liệu donate và shelter để tạo biểu đồ
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
            borderRadius: 10,
            data
          }]
        });

        setChartOptions({
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: {
            legend: {
              display: true,
              labels: {
                fontColor: textColor,
                boxWidth: 0, // Set width of color box to 0 to hide it
                font: {
                  size: 16, // Phóng to chữ
                  weight: 'bold' // In đậm chữ
                }
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
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data', life: 3000 });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <div className="flex flex-wrap gap-2 mb-4">
        <Card className="flex-1">
          <div className="flex items-center gap-2">
            <span className="w-12 h-12 border-circle flex justify-center items-center text-center bg-green-500 text-white text-2xl rounded-full">
              <i className="pi pi-dollar" />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-sm font-bold">Total Revenue</span>
              <span className="font-bold text-lg">{totalRevenue.toLocaleString()} VND</span>
            </div>
          </div>
        </Card>
        <Card className="flex-1">
          <div className="flex items-center gap-2">
            <span className="w-12 h-12 border-circle flex justify-center items-center text-center bg-yellow-500 text-white text-2xl rounded-full">
              <i className="pi pi-heart-fill" />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-sm font-bold">Total Pets</span>
              <span className="font-bold text-lg">{totalAvailablePets}</span>
            </div>
          </div>
        </Card>
        <Card className="flex-1">
          <div className="flex items-center gap-2">
            <span className="w-12 h-12 border-circle flex justify-center items-center text-center bg-blue-500 text-white text-2xl rounded-full">
              <i className="pi pi-home" />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-sm font-bold">Total Shelters</span>
              <span className="font-bold text-lg">{totalShelters}</span>
            </div>
          </div>
        </Card>
        <Card className="flex-1">
          <div className="flex items-center gap-2">
            <span className="w-12 h-12 border-circle flex justify-center items-center text-center bg-purple-500 text-white text-2xl rounded-full">
              <i className="pi pi-users" />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-sm font-bold">Total Accounts</span>
              <span className="font-bold text-lg">{totalAccounts}</span>
            </div>
          </div>
        </Card>
      </div>
      <div className="card">
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
