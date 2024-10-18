import React, { useEffect, useState, useRef } from "react";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown"; // Import Dropdown for year selection
import axios from "../../services/axiosClient";

const Dashboard = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalPets, setTotalPets] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalAvailablePets, setTotalAvailablePets] = useState(0);
  const toast = useRef(null);
  const shelterID = localStorage.getItem("shelterID");
  const [year, setYear] = useState(new Date().getFullYear()); // Set initial year to current year
  const [years, setYears] = useState([]); // State to store available years

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donateResponse = await axios.get("/donate");
        const petResponse = await axios.get("/pet");
        const eventResponse = await axios.get("/events");
        const donations = donateResponse.data.filter(
          (donation) => donation.shelterId === parseInt(shelterID)
        );
        const pets = petResponse.data.filter(
          (pets) => petResponse.shelterId === parseInt(shelterID)
        );
        const events = eventResponse.data.filter(
          (event) => event.shelterId === parseInt(shelterID)
        );

        // Tính tổng số lượng sự kiện cho shelter này
        const totalEventCount = events.length;
        setTotalEvents(totalEventCount);
        // Extract years from donations and set available years
        const availableYears = [
          ...new Set(
            donations.map((donation) => new Date(donation.date).getFullYear())
          ),
        ];
        setYears(availableYears);

        // Tính tổng số tiền donate cho shelter này theo năm đã chọn
        const filteredDonations = donations.filter(
          (donation) => new Date(donation.date).getFullYear() === year
        );
        const total = filteredDonations.reduce(
          (sum, donation) => sum + donation.amount,
          0
        );
        setTotalRevenue(total);

        // Tính tổng số lượng pet cho shelter này
        const totalPetCount = pets.length;
        setTotalPets(totalPetCount);

        // Đếm số thú cưng Available
        const availablePetCount = pets.filter(
          (pet) => pet.adoptionStatus === "Available"
        ).length;
        setTotalAvailablePets(availablePetCount);

        // Tạo biểu đồ hiển thị donation theo tháng
        const groupedDonations = filteredDonations.reduce((acc, donation) => {
          const month = new Date(donation.date).getMonth();
          acc[month] = (acc[month] || 0) + donation.amount;
          return acc;
        }, {});

        const labels = Array.from({ length: 12 }, (_, i) =>
          new Date(0, i).toLocaleString("en", { month: "long" })
        );
        const data = labels.map((_, i) => groupedDonations[i] || 0);

        const getRandomColor = () => {
          const r = Math.floor(Math.random() * 256);
          const g = Math.floor(Math.random() * 256);
          const b = Math.floor(Math.random() * 256);
          return `rgb(${r}, ${g}, ${b})`;
        };

        const backgroundColors = data.map(() => getRandomColor());
        const borderColors = backgroundColors;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue(
          "--text-color-secondary"
        );
        const surfaceBorder =
          documentStyle.getPropertyValue("--surface-border");

        setChartData({
          labels,
          datasets: [
            {
              label: "Donation Amount",
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderRadius: 10,
              data,
            },
          ],
        });

        setChartOptions({
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: {
            legend: {
              display: true,
              labels: {
                fontColor: textColor,
                boxWidth: 0,
                font: {
                  size: 16,
                  weight: "bold",
                },
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: textColorSecondary,
                font: {
                  weight: 500,
                },
              },
              grid: {
                display: false,
                drawBorder: false,
              },
            },
            y: {
              ticks: {
                color: textColorSecondary,
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false,
              },
            },
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to fetch data",
          life: 3000,
        });
      }
    };
    fetchData();
  }, [shelterID, year]);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <div className="flex flex-wrap gap-2 mb-4">
        <Card className="flex-1">
          <div className="flex items-center gap-2">
            <span className="w-12 h-12 border-circle flex justify-center items-center text-center bg-green-500 text-white text-2xl rounded-full">
              <i className="pi pi-dollar" />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-sm font-bold">
                Total Revenue
              </span>
              <span className="font-bold text-lg">
                {totalRevenue.toLocaleString()} VND
              </span>
            </div>
          </div>
        </Card>
        <Card className="flex-1">
          <div className="flex items-center gap-2">
            <span className="w-12 h-12 border-circle flex justify-center items-center text-center bg-yellow-500 text-white text-2xl rounded-full">
              <i className="pi pi-heart-fill" />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-sm font-bold">
                Total Pets
              </span>
              <span className="font-bold text-lg">{totalAvailablePets}</span>
            </div>
          </div>
        </Card>
        <Card className="flex-1">
          <div className="flex items-center gap-2">
            <span className="w-12 h-12 border-circle flex justify-center items-center text-center bg-red-500 text-white text-2xl rounded-full">
              <i className="pi pi-calendar" />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-sm font-bold">
                Total Events
              </span>
              <span className="font-bold text-lg">{totalEvents}</span>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex justify-end mb-4">
  <Dropdown
    value={year}
    options={years.map((yr) => ({ label: yr, value: yr }))} // Adjust options to ensure they have label and value
    onChange={(e) => setYear(e.value)}
    placeholder="Select Year"
    className="w-40 bg-white border border-gray-300 text-black font-bold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    itemTemplate={(option) => (
      <div className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white cursor-pointer rounded-md">
        {option.label}
      </div>
    )}
  />
</div>

      <div className="card">
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
