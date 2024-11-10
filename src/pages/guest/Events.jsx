import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axiosClient";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const Events = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [joinedEventIds, setJoinedEventIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [disableJoinButton, setDisableJoinButton] = useState(false);
  const todayString = new Date().toISOString().split("T")[0];
  const [dateFilter, setDateFilter] = useState(todayString);
  const eventsPerPage = 9;

  const formatDateTime = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("nameid");
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
      fetchJoinedEvents(parseInt(storedUserId, 10));
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.get("/events");
        setEvents(
          response.data.sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Error fetching events");
      }
    };

    fetchEvents();
  }, []);

  const fetchJoinedEvents = async (userId) => {
    try {
      const response = await axios.get(`/events/user/${userId}`);
      setJoinedEventIds(new Set(response.data.map((event) => event.id)));
    } catch (error) {
      console.error("Error fetching joined events:", error);
      toast.error("Error fetching joined events");
    }
  };

  const handleEventClick = async (id) => {
    try {
      const response = await axios.get(`/events/${id}`);
      setSelectedEvent(response.data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching event details:", error);
      toast.error("Error fetching event details");
    }
  };

  const getUserRole = () => localStorage.getItem("role") || "";
  const isLoggedIn = () => !!localStorage.getItem("nameid");

  const handleJoinEvent = async () => {
    if (!selectedEvent) return;

    if (!isLoggedIn()) {
      toast.error("Bạn phải login để sử dụng tính năng này");
      setTimeout(() => navigate("/admin/login"), 500);
      return;
    }

    if (!getUserRole().split(",").includes("Volunteer")) {
      toast.error("Bạn không có quyền để tham gia sự kiện này.");
      return;
    }

    try {
      await axios.post("/events/adduser", {
        eventId: selectedEvent.id,
        userId,
      });
      toast.success("Tham gia sự kiện thành công!", {
        onClose: () => {
          setJoinedEventIds((prev) => new Set(prev).add(selectedEvent.id));
          setIsDialogOpen(false);
          setDisableJoinButton(false);
        },
      });
    } catch (error) {
      console.error("Error joining event:", error);
      toast.error("Đã xảy ra lỗi khi tham gia sự kiện.");
      setDisableJoinButton(true);
    }
  };

  const uniqueLocations = [...new Set(events.map((event) => event.location))];
  const filteredEvents = events.filter((event) => {
    const matchesSearchQuery = event.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDateFilter =
      dateFilter === "" ||
      new Date(event.date).toLocaleDateString() ===
        new Date(dateFilter).toLocaleDateString();
    const matchesLocationFilter =
      selectedLocation === "" || event.location === selectedLocation;
    return matchesSearchQuery && matchesDateFilter && matchesLocationFilter;
  });

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{t("events")}</h1>

      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder={t("search.event")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="p-2 border rounded w-40"
          min={todayString}
        />
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="p-2 border rounded w-40"
        >
          <option value="">{t("allLocations")}</option>
          {uniqueLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {currentEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentEvents.map((event) => (
            <div
              key={event.id}
              className="border border-gray-300 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer"
              onClick={() => handleEventClick(event.id)}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
                <p className="text-gray-700">
                  {t("event.location")}: {event.location}
                </p>
                <p className="text-gray-500 mt-2">
                  {t("event.date")}: {formatDateTime(event.date)}
                </p>
                <p
                  className="text-gray-500 mt-1"
                  dangerouslySetInnerHTML={{
                    __html: event.description.slice(0, 20) + "...",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-500">
          {t("noEventsAvailable")}
        </p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            {t("previous")}
          </button>
          <p>
            {t("page")} {currentPage} {t("of")} {totalPages}
          </p>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            {t("next")}
          </button>
        </div>
      )}

      {isDialogOpen && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full relative">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedEvent.name}</h2>
            <p className="text-gray-700 mb-4">
              {t("event.location")}: {selectedEvent.location}
            </p>
            <p className="text-gray-500 mb-4">
              {t("event.date")}: {formatDateTime(selectedEvent.date)}
            </p>
            <p
              className="text-gray-500 mb-4"
              dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
            />
            <button
              onClick={handleJoinEvent}
              disabled={
                joinedEventIds.has(selectedEvent.id) || disableJoinButton
              }
              className={`${
                joinedEventIds.has(selectedEvent.id) || disableJoinButton
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              } px-4 py-2 rounded mt-4`}
            >
              {joinedEventIds.has(selectedEvent.id) ? t("joined") : t("join")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
