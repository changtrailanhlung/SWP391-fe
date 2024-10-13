import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import axios from "../../services/axiosClient"; // Assuming you have the axiosClient setup

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/events"); // Fetch events from the API
        setEvents(response.data); // Set the fetched events into state
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Events</h1>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map((event) => (
            <Link
              to={`/event/${event.id}`}
              key={event.id}
              className="border p-4 rounded-lg shadow"
            >
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <p>Location: {event.location}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center">No Events Available</p>
      )}
    </div>
  );
};

export default Events;
