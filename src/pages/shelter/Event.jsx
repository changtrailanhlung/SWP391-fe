import React, { useState, useEffect, useRef } from "react";
import axios from "../../services/axiosClient";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { toast } from "react-toastify";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [shelters, setShelters] = useState({});
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    shelterId: localStorage.getItem("shelterId") || 0,
    name: "",
    date: "",
    description: "",
    location: "",
  });

  const quillRef = useRef(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/events");
      const eventData = response.data.map((event) => ({
        ...event,
        shelterName: shelters[event.shelterId] || "Unknown",
      }));
      setEvents(eventData);
      setFilteredEvents(eventData);
      toast.success("Events loaded successfully!");
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Error fetching events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchShelters = async () => {
    try {
      const response = await axios.get("/shelter");
      const shelterData = response.data.reduce((acc, shelter) => {
        acc[shelter.id] = shelter.name; // Store shelter name by ID
        return acc;
      }, {});
      setShelters(shelterData);
    } catch (error) {
      console.error("Error fetching shelters:", error);
      toast.error("Error fetching shelters. Please try again later.");
    }
  };

  const createEvent = async () => {
    try {
      await axios.post("/events", newEvent);
      toast.success("Event created successfully!");
      setShowDialog(false);
      fetchEvents(); // Re-fetch events after creating a new one
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error creating event. Please try again later.");
    }
  };

  useEffect(() => {
    fetchShelters(); // Fetch shelters on initial load
  }, []);

  useEffect(() => {
    if (Object.keys(shelters).length > 0) {
      fetchEvents(); // Fetch events only when shelters are available
    }
  }, [shelters]);

  useEffect(() => {
    // Filter events when searchTerm changes
    const filtered = events.filter(
      (event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.shelterName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      ["clean"], // Remove formatting button
    ],
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Events</h1>
      <div className="mb-4">
        <InputText
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by event name, description, location, or shelter"
          className="w-full p-inputtext-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <Button
        label="Create Event"
        icon="pi pi-plus"
        onClick={() => setShowDialog(true)}
        className="mb-4 bg-blue-600 text-white hover:bg-blue-700"
      />
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

      <Dialog
        header="Create Event"
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: "50vw" }}
      >
        <div className="p-field mb-4">
          <label htmlFor="name" className="font-semibold">
            Event Name
          </label>
          <InputText
            id="name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="p-field mb-4">
          <label htmlFor="date" className="font-semibold">
            Date
          </label>
          <InputText
            id="date"
            type="datetime-local"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="p-field mb-4">
          <label htmlFor="description" className="font-semibold">
            Description
          </label>
          <ReactQuill
            ref={quillRef}
            id="description"
            value={newEvent.description}
            onChange={(content) =>
              setNewEvent({ ...newEvent, description: content })
            }
            modules={modules}
            required
            className="border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="p-field mb-4">
          <label htmlFor="location" className="font-semibold">
            Location
          </label>
          <InputText
            id="location"
            value={newEvent.location}
            onChange={(e) =>
              setNewEvent({ ...newEvent, location: e.target.value })
            }
            required
            className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <Button
          label="Submit"
          onClick={createEvent}
          className="bg-blue-600 text-white hover:bg-blue-700"
        />
      </Dialog>
    </div>
  );
};

export default Event;
