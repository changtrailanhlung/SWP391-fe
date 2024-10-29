import React, { useEffect, useState } from "react";
import axios from "../../services/axiosClient";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const Events = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const eventsPerPage = 9;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Error fetching events");
      }
    };

    fetchEvents();
  }, []);

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

  const totalPages = Math.ceil(events.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{t("events")}</h1>

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
                <p className="text-gray-500 mt-1">
                  {event.description.length > 20
                    ? event.description.substring(0, 20) + "..."
                    : event.description}
                </p>
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
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            {t("previous")}
          </button>
          <p>
            {t("page")} {currentPage} {t("of")} {totalPages}
          </p>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            {t("next")}
          </button>
        </div>
      )}

      {isDialogOpen && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full">
            <h2 className="text-2xl font-semibold">{selectedEvent.name}</h2>
            <p>
              {t("event.date")}: {formatDateTime(selectedEvent.date)}
            </p>
            <p>
              {t("event.location")}: {selectedEvent.location}
            </p>
            <p
              className="mt-2"
              dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
            />
            <button
              onClick={() => setIsDialogOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Utility function to format date
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString(); // Simplified for readability
};

export default Events;
