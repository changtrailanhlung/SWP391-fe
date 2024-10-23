import React, { useState, useEffect } from "react";
import axios from "../../services/axiosClient";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { toast } from "react-toastify";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const Event = () => {
  const [events, setEvents] = useState([]);
  const [shelters, setShelters] = useState({});
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEvent, setNewEvent] = useState({
    shelterId: 0,
    name: "",
    date: "",
    description: "",
    location: "",
  });
  const [displayDialog, setDisplayDialog] = useState(false);

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
        acc[shelter.id] = shelter.name;
        return acc;
      }, {});
      setShelters(shelterData);
    } catch (error) {
      console.error("Error fetching shelters:", error);
      toast.error("Error fetching shelters. Please try again later.");
    }
  };

  const addEvent = async () => {
    try {
      const response = await axios.post("/events", newEvent);
      setEvents([...events, response.data]);
      setFilteredEvents([...filteredEvents, response.data]);
      toast.success("Event created successfully!");
      setDisplayDialog(false);
      setNewEvent({
        shelterId: 0,
        name: "",
        date: "",
        description: "",
        location: "",
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error creating event. Please try again later.");
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  useEffect(() => {
    if (Object.keys(shelters).length > 0) {
      fetchEvents();
    }
  }, [shelters]);

  useEffect(() => {
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
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Events</h1>
      <div className="mb-4 flex justify-between">
        <InputText
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by event name, description, location, or shelter"
          className="w-full p-inputtext-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <Button
          label="Add Event"
          icon="pi pi-plus"
          onClick={() => setDisplayDialog(true)}
          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
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

      <Dialog
        header="Create New Event"
        visible={displayDialog}
        onHide={() => setDisplayDialog(false)}
        className="p-dialog"
      >
        <div className="field mb-4">
          <label
            htmlFor="shelterId"
            className="block text-sm font-medium text-gray-700"
          >
            Shelter
          </label>
          <InputText
            id="shelterId"
            value={newEvent.shelterId}
            onChange={(e) =>
              setNewEvent({ ...newEvent, shelterId: parseInt(e.target.value) })
            }
            placeholder="Enter Shelter ID"
            className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="field mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Event Name
          </label>
          <InputText
            id="name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            placeholder="Event Name"
            className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="field mb-4">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <InputText
            id="date"
            type="datetime-local"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="field mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <ReactQuill
            id="description"
            value={newEvent.description}
            onChange={(value) =>
              setNewEvent({ ...newEvent, description: value })
            }
            placeholder="Write event description..."
            className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="field mb-4">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <InputText
            id="location"
            value={newEvent.location}
            onChange={(e) =>
              setNewEvent({ ...newEvent, location: e.target.value })
            }
            placeholder="Location"
            className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button
            label="Create"
            onClick={addEvent}
            className="bg-green-600 hover:bg-green-700 text-white"
          />
          <Button
            label="Cancel"
            onClick={() => setDisplayDialog(false)}
            className="ml-2 bg-gray-400 hover:bg-gray-500 text-white"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Event;
