import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../services/axiosClient";

const EventDetail = () => {
  const { id } = useParams(); // Get event ID from URL
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`/events/${id}`); // Fetch event details
        setEvent(response.data); // Store the event details
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (!event) {
    return <div>Loading...</div>; // Show a loading message while fetching
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">{event.name}</h1>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Location: {event.location}</p>
      <p>Description: {event.description}</p>
    </div>
  );
};

export default EventDetail;
