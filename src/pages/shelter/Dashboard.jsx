import React, { useEffect, useState, useRef } from "react";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { useTranslation } from "react-i18next";
import axios from "../../services/axiosClient";

const Dashboard = () => {
  // Khởi tạo các state cần thiết
  const { t, i18n } = useTranslation();
  const [chartData, setChartData] = useState({}); // Dữ liệu biểu đồ
  const [chartOptions, setChartOptions] = useState({}); // Tùy chọn biểu đồ
  const [totalRevenue, setTotalRevenue] = useState(0); // Tổng doanh thu
  const [totalPets, setTotalPets] = useState(0); // Tổng số thú cưng
  const [totalAdoptedPets, setTotalAdoptedPets] = useState(0); // Số thú cưng đã được nhận nuôi
  const [totalEvents, setTotalEvents] = useState(0); // Tổng số sự kiện
  const [totalAvailablePets, setTotalAvailablePets] = useState(0); // Số thú cưng có sẵn
  const [shelterInfo, setShelterInfo] = useState(null); // Thông tin shelter
  const toast = useRef(null);
  const shelterID = localStorage.getItem("shelterID"); // Lấy ID shelter từ localStorage
  const [year, setYear] = useState(new Date().getFullYear()); // Năm hiện tại
  const [years, setYears] = useState([]); // Danh sách các năm có dữ liệu

  useEffect(() => {
    const fetchShelterInfo = async () => {
      try {
        const response = await axios.get(`/shelter/${shelterID}`);
        setShelterInfo(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin shelter:", error);
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Lỗi",
            detail: t('errors.shelterInfo'),
            life: 3000,
          });
        }
      }
    };

    // Hàm lấy tất cả dữ liệu cần thiết cho dashboard
    const fetchData = async () => {
      try {
        // Gọi đồng thời các API để lấy dữ liệu
        const [donateResponse, petResponse, eventResponse] = await Promise.all([
          axios.get("/donate"),
          axios.get(`/pet?shelterId=${shelterID}`),
          axios.get("/events"),
          fetchShelterInfo()
        ]);

        // Lọc donations theo shelterID
        const donations = donateResponse.data.filter(
          (donation) => donation.shelterId === parseInt(shelterID)&& 
          donation.status === true
        );

        // Lọc pets theo shelterID
        const pets = petResponse.data.filter(
          (pet) => pet.shelterID === parseInt(shelterID)
        );

        // Lọc events theo shelterID
        const events = eventResponse.data.filter(
          (event) => event.shelterId === parseInt(shelterID)
        );

        // Tính tổng số sự kiện
        setTotalEvents(events.length);

        // Lấy danh sách các năm có donation
        const availableYears = [
          ...new Set(
            donations.map((donation) => new Date(donation.date).getFullYear())
          ),
        ];
        setYears(availableYears);

        // Lọc donations theo năm đã chọn và tính tổng
        const filteredDonations = donations.filter(
          (donation) => new Date(donation.date).getFullYear() === year
        );
        const total = filteredDonations.reduce(
          (sum, donation) => sum + donation.amount,
          0
        );
        setTotalRevenue(total);

        // Cập nhật các thống kê về pets
        setTotalPets(pets.length);
        setTotalAvailablePets(
          pets.filter((pet) => pet.adoptionStatus === "Available").length
        );
        setTotalAdoptedPets(
          pets.filter((pet) => pet.adoptionStatus === "Adopted").length
        );

        // Tạo dữ liệu cho biểu đồ
        const groupedDonations = filteredDonations.reduce((acc, donation) => {
          const month = new Date(donation.date).getMonth();
          acc[month] = (acc[month] || 0) + donation.amount;
          return acc;
        }, {});

        // Tạo labels cho các tháng
        const labels = Array.from({ length: 12 }, (_, i) =>
          new Date(0, i).toLocaleString("en", { month: "long" })
        );
        const data = labels.map((_, i) => groupedDonations[i] || 0);

        // Hàm tạo màu ngẫu nhiên cho biểu đồ
        const getRandomColor = () => {
          const r = Math.floor(Math.random() * 256);
          const g = Math.floor(Math.random() * 256);
          const b = Math.floor(Math.random() * 256);
          return `rgb(${r}, ${g}, ${b})`;
        };

        const backgroundColors = data.map(() => getRandomColor());
        const borderColors = backgroundColors;

        // Lấy style từ document
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue(
          "--text-color-secondary"
        );
        const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

        // Cấu hình dữ liệu biểu đồ
        setChartData({
          labels,
          datasets: [
            {
              label: t('chart.donationAmount'),
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderRadius: 10,
              data,
            },
          ],
        });

        // Cấu hình tùy chọn biểu đồ
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
        console.error("Lỗi khi lấy dữ liệu:", error);
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Lỗi",
            detail: t('errors.getData'),
            life: 3000,
          });
        }
      }
    };

    fetchData();
  }, [shelterID, year]);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      {shelterInfo && (
        <Card className="mb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm font-bold">{t('shelter.name')}</span>
              <span className="font-bold text-lg">{shelterInfo.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm font-bold">{t('shelter.address')}</span>
              <span className="font-bold text-lg">{shelterInfo.location}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm font-bold">{t('shelter.phone')}</span>
              <span className="font-bold text-lg">{shelterInfo.phoneNumber}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm font-bold">{t('shelter.email')}</span>
              <span className="font-bold text-lg">{shelterInfo.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm font-bold">{t('shelter.capacity')}</span>
              <span className="font-bold text-lg">{shelterInfo.capacity}</span>
            </div>
          </div>
        </Card>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <Card className="flex-1">
          <div className="flex items-center gap-2">
            <span className="w-12 h-12 border-circle flex justify-center items-center text-center bg-green-500 text-white text-2xl rounded-full">
              <i className="pi pi-dollar" />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-sm font-bold">{t('stats.totalRevenue')}</span>
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
              <span className="text-gray-500 text-sm font-bold">{t('stats.availablePets')}</span>
              <span className="font-bold text-lg">{totalAvailablePets}</span>
            </div>
          </div>
        </Card>
        <Card className="flex-1">
          <div className="flex items-center gap-2">
            <span className="w-12 h-12 border-circle flex justify-center items-center text-center bg-green-500 text-white text-2xl rounded-full">
              <i className="pi pi-check-circle" />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-sm font-bold">{t('stats.adoptedPets')}</span>
              <span className="font-bold text-lg">{totalAdoptedPets}</span>
            </div>
          </div>
        </Card>
        <Card className="flex-1">
          <div className="flex items-center gap-2">
            <span className="w-12 h-12 border-circle flex justify-center items-center text-center bg-red-500 text-white text-2xl rounded-full">
              <i className="pi pi-calendar" />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-sm font-bold">{t('stats.totalEvents')}</span>
              <span className="font-bold text-lg">{totalEvents}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end mb-4">
        <Dropdown
          value={year}
          options={years.map((yr) => ({ label: yr, value: yr }))}
          onChange={(e) => setYear(e.value)}
          placeholder={t('chart.selectYear')}
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