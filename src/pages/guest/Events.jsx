import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../services/axiosClient";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const Events = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  // Filter available events (if needed)
  const availableEvents = events; // Modify this line if you need to filter events

  const totalPages = Math.ceil(availableEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = availableEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

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
          {currentEvents.map((event) => {
            const truncatedDescription =
              event.description.length > 20
                ? event.description.substring(0, 20) + "..."
                : event.description;

            return (
              <Link
                to={`/event/${event.id}`}
                key={event.id}
                className="border border-gray-300 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
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
                    dangerouslySetInnerHTML={{ __html: truncatedDescription }}
                  ></p>
                </div>
              </Link>
            );
          })}
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
            className={`px-4 py-2 bg-gray-300 rounded ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {t("previous")}
          </button>
          <p>
            {t("page")} {currentPage} {t("of")} {totalPages}
          </p>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 bg-gray-300 rounded ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {t("next")}
          </button>
        </div>
      )}
    </div>
  );
};

// Utility function to format date
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default Events;
