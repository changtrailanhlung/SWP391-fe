import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/axiosClient";
import { toast } from "react-toastify";

const EventDetail = () => {
  const { id } = useParams(); // Get event ID from URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("nameid")); // Retrieve user ID from localStorage
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`/events/${id}`); // Fetch event details
        setEvent(response.data); // Store the event details
        checkUserRegistration(); // Check if the user is registered
      } catch (error) {
        // console.error("Error fetching event details:", error);
        // toast.error("Failed to fetch event details.");
      }
    };

    fetchEventDetails();
  }, [id]);

  const checkUserRegistration = async () => {
    if (!userId) return; // Exit if userId is not available

  };

  const handleJoinEvent = async () => {
    if (!userId) {
      toast.error("You need to log in to join the event.");
      navigate("/admin/login");
      return;
    }

    if (isRegistered) {
      toast.info("You are already registered for this event.");
      setTimeout(() => {
        navigate("/event"); // Navigate to events page
      }, 2000); // Navigate after 2 seconds
      return;
    }

    try {
      await axios.post("/events/adduser", {
        eventId: parseInt(id, 10),
        userId: parseInt(userId, 10),
      });
      setIsRegistered(true); // Update state to reflect registration
      toast.success("Successfully joined the event!");
      setTimeout(() => {
        navigate("/event"); // Navigate to events page
      }, 2000); // Navigate after 2 seconds
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        console.error("Error joining event:", error);
        toast.error("Error joining the event. Please try again later.");
      }
    }
  };

  if (!event) {
    return <div className="text-center text-lg">Loading...</div>; // Show a loading message while fetching
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full p-6 backdrop-blur-md bg-black bg-opacity-50 rounded-md">
        <h1 className="text-3xl font-bold mb-2 text-center text-white">
          {event.name}
        </h1>
        <div className="flex justify-center mb-4 text-lg text-gray-300">
          <p className="mr-4">
            Date: {new Date(event.date).toLocaleDateString()}
          </p>
          <p>Location: {event.location}</p>
        </div>
        <div
          className="mb-4 p-4 bg-white bg-opacity-10 rounded-md"
          dangerouslySetInnerHTML={{ __html: event.description }} // Render HTML description
        />
        <button
          onClick={handleJoinEvent}
          className={`px-6 py-3 rounded-md text-white transition-colors duration-200 ${
            isRegistered
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isRegistered} // Disable button if already registered
        >
          {isRegistered ? "Registered" : "Join Event"}
        </button>
      </div>
    </div>
  );
};

export default EventDetail;
