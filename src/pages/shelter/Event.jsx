import React, { useState, useEffect } from "react";
import axios from "../../services/axiosClient";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { toast } from "react-toastify";
import { InputText } from "primereact/inputtext";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [shelters, setShelters] = useState({});
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/events");
      const eventData = response.data.map((event) => ({
        ...event,
        shelterName: shelters[event.shelterId] || "Unknown", // Gán tên shelter nếu có
      }));
      setEvents(eventData);
      setFilteredEvents(eventData); // Khởi tạo filteredEvents
      toast.success("Events loaded successfully!"); // Hiển thị thông báo thành công
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Error fetching events. Please try again later."); // Hiển thị thông báo lỗi
    } finally {
      setLoading(false);
    }
  };

  const fetchShelters = async () => {
    try {
      const response = await axios.get("/shelter");
      const shelterData = response.data.reduce((acc, shelter) => {
        acc[shelter.id] = shelter.name; // Lưu tên shelter theo ID
        return acc;
      }, {});
      setShelters(shelterData);
    } catch (error) {
      console.error("Error fetching shelters:", error);
      toast.error("Error fetching shelters. Please try again later."); // Hiển thị thông báo lỗi
    }
  };

  useEffect(() => {
    fetchShelters(); // Lấy danh sách shelters trước
  }, []);

  useEffect(() => {
    if (Object.keys(shelters).length > 0) {
      fetchEvents(); // Chỉ gọi fetchEvents khi đã có shelters
    }
  }, [shelters]);

  useEffect(() => {
    // Lọc sự kiện khi searchTerm thay đổi
    const filtered = events.filter(
      (event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.shelterName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Events</h1>
      <div className="mb-4">
        <InputText
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by event name, description, location, or shelter"
          className="w-full p-inputtext-sm"
        />
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <DataTable
          value={filteredEvents}
          paginator
          rows={10}
          className="p-mt-3"
        >
          <Column
            body={(rowData, options) => options.rowIndex + 1}
            header="No."
            sortable
          />
          <Column field="name" header="Event Name" sortable />
          <Column
            field="date"
            header="Date"
            sortable
            body={(rowData) => new Date(rowData.date).toLocaleString()}
          />
          <Column field="description" header="Description" sortable />
          <Column field="location" header="Location" sortable />
          <Column field="shelterName" header="Shelter Name" sortable />
        </DataTable>
      </div>
    </div>
  );
};

export default Event;
