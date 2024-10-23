import React, { useState, useEffect } from "react";
import axios from "../../services/axiosClient";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { toast } from "react-toastify";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import QuillToolbar from "../../components/QuillToolbar"; // Import the QuillToolbar

const Event = () => {
  const [events, setEvents] = useState([]);
  const [shelters, setShelters] = useState({});
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEvent, setNewEvent] = useState({
    shelterId: localStorage.getItem("nameid") || 0,
    name: "",
    date: null,
    description: "",
    location: "",
  });
  const [showDialog, setShowDialog] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
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

  const createEvent = async () => {
    try {
      await axios.post("/events", newEvent);
      toast.success("Event created successfully!");
      fetchEvents();
      setNewEvent({
        shelterId: localStorage.getItem("nameid") || 0,
        name: "",
        date: null,
        description: "",
        location: "",
      });
      setShowDialog(false);
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
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">Events</h1>
        <div className="mb-4">
          <InputText
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by event name, description, location, or shelter"
            className="w-full p-inputtext-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <Button
          label="Create New Event"
          onClick={() => setShowDialog(true)}
          className="mb-4 bg-blue-500 text-white hover:bg-blue-600"
        />

        <Dialog
          header="Create New Event"
          visible={showDialog}
          style={{ width: "50vw" }}
          onHide={() => setShowDialog(false)}
          className="p-dialog"
        >
          <InputText
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            placeholder="Event Name"
            className="w-full mb-2 border border-gray-300 rounded-lg shadow-sm"
          />
          <Calendar
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.value })}
            placeholder="Event Date"
            className="w-full mb-2"
            showIcon
          />
          <QuillToolbar />
          <ReactQuill
            value={newEvent.description}
            onChange={(value) =>
              setNewEvent({ ...newEvent, description: value })
            }
            placeholder="Description"
            className="mb-2 border border-gray-300 rounded-lg"
          />
          <InputText
            value={newEvent.location}
            onChange={(e) =>
              setNewEvent({ ...newEvent, location: e.target.value })
            }
            placeholder="Location"
            className="w-full mb-2 border border-gray-300 rounded-lg shadow-sm"
          />
          <Button
            label="Create Event"
            onClick={createEvent}
            className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
          />
        </Dialog>

        <div className="bg-white shadow-md rounded-lg p-6 mt-4">
          {filteredEvents.length === 0 ? (
            <p className="text-center">No events found.</p>
          ) : (
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
              <Column
                field="description"
                header="Description"
                sortable
                body={(rowData) => (
                  <div
                    dangerouslySetInnerHTML={{ __html: rowData.description }}
                  />
                )}
              />
              <Column field="location" header="Location" sortable />
              <Column field="shelterName" header="Shelter Name" sortable />
            </DataTable>
          )}
        </div>
      </div>
    </div>
  );
};

export default Event;
