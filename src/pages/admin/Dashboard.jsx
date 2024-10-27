import React, { useEffect, useState, useRef } from "react";
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import axios from '../../services/axiosClient';

const Dashboard = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalPets, setTotalPets] = useState(0);
  const [totalAvailablePets, setTotalAvailablePets] = useState(0);
  const [totalShelters, setTotalShelters] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const toast = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donateResponse = await axios.get('/donate');
        const shelterResponse = await axios.get('/shelter');
        const accountResponse = await axios.get('/users');
        const petResponse = await axios.get('/pet');

        // Lọc donations có status là true
        const validDonations = donateResponse.data.filter(donation => donation.status === true);
        const shelters = shelterResponse.data;
        const accounts = accountResponse.data;
        const pets = petResponse.data;

        // Tính tổng số tiền donate (chỉ từ các donation có status true)
        const total = validDonations.reduce((sum, donation) => sum + donation.amount, 0);
        setTotalRevenue(total);

        setTotalShelters(shelters.length);
        setTotalAccounts(accounts.length);
        setTotalPets(pets.length);
        
        // Đếm số thú cưng Available
        const availablePetCount = pets.filter(pet => pet.adoptionStatus === 'Available').length;
        setTotalAvailablePets(availablePetCount);

        // Tạo map của shelter để lưu trữ thông tin
        const shelterMap = shelters.reduce((acc, shelter) => {
          acc[shelter.id] = {
            id: shelter.id,
            name: shelter.name,
            local: shelter.location,
            totalDonation: 0
          };
          return acc;
        }, {});

        // Tính tổng donation cho mỗi shelter
        validDonations.forEach(donation => {
          if (shelterMap[donation.shelterId]) {
            shelterMap[donation.shelterId].totalDonation += donation.amount;
          }
        });

        // Chuyển đổi dữ liệu cho biểu đồ
        const shelterData = Object.values(shelterMap);
        const labels = shelterData.map(shelter => `${shelter.name}`);
        const data = shelterData.map(shelter => shelter.totalDonation);

        // Tạo màu ngẫu nhiên
        const getRandomColor = () => {
          const r = Math.floor(Math.random() * 256);
          const g = Math.floor(Math.random() * 256);
          const b = Math.floor(Math.random() * 256);
          return `rgb(${r}, ${g}, ${b})`;
        };

        const backgroundColors = data.map(() => getRandomColor());
        const borderColors = backgroundColors;

        // Cập nhật dữ liệu biểu đồ
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
                color: textColor,
                boxWidth: 0,
                font: {
                  size: 16,
                  weight: 'bold'
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `ID: ${shelterData[context.dataIndex].id} - ${context.formattedValue} VND`;
                  }
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
                },
                callback: function(value) {
                  // Rút gọn label nếu quá dài
                  const label = this.getLabelForValue(value);
                  const maxLength = 20;
                  return label.length > maxLength ? label.substr(0, maxLength) + '...' : label;
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