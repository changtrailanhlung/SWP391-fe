import React, { useState, useEffect } from "react";
import axios from "../../services/axiosClient";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { toast } from "react-toastify";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTranslation } from "react-i18next";
import QuillToolbar from "../../components/QuillToolbar";

const Event = () => {
  const { t, i18n } = useTranslation();
  const currentShelterId = localStorage.getItem("shelterID") || 0;
  const [events, setEvents] = useState([]);
  const [shelters, setShelters] = useState({});
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEvent, setNewEvent] = useState({
    shelterId: currentShelterId,
    name: "",
    date: null,
    description: "",
    location: "",
  });
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showParticipantsDialog, setShowParticipantsDialog] = useState(false);
  const [selectedEventParticipants, setSelectedEventParticipants] = useState(
    []
  );
  const [selectedEventName, setSelectedEventName] = useState("");

  // Function to validate date
  const validateEventDate = (date) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time part for fair comparison

    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);

    return eventDate >= currentDate;
  };

  // Function to handle viewing participants
  const handleViewParticipants = async (event) => {
    try {
      const response = await axios.get(`/events/events`);
      const eventData = response.data.find((e) => e.id === event.id);
      if (eventData) {
        setSelectedEventParticipants(eventData.users || []);
        setSelectedEventName(event.name);
        setShowParticipantsDialog(true);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
      toast.error(t("Event.messages.errors.fetchParticipants"));
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/events?shelterId=${currentShelterId}`);
      const eventData = response.data
        .filter((event) => event.shelterId === parseInt(currentShelterId))
        .map((event) => ({
          ...event,
          shelterName: shelters[event.shelterId] || "Unknown",
        }));
      setEvents(eventData);
      setFilteredEvents(eventData);
      toast.success(t("Event.messages.success.eventsLoaded"));
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error(t("Event.messages.errors.fetchEvents"));
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

  const validateEventForm = () => {
    if (!newEvent.name.trim()) {
      toast.error(t("Event.messages.errors.nameRequired"));
      return false;
    }
    if (!newEvent.date) {
      toast.error(t("Event.messages.errors.dateRequired"));
      return false;
    }
    if (!validateEventDate(newEvent.date)) {
      toast.error(t("Event.messages.errors.futureDateRequired"));
      return false;
    }
    if (!newEvent.location.trim()) {
      toast.error(t("Event.messages.errors.locationRequired"));
      return false;
    }
    if (!newEvent.description.trim()) {
      toast.error(t("Event.messages.errors.descriptionRequired"));
      return false;
    }
    return true;
  };
  const createEvent = async () => {
    try {
      if (!validateEventForm()) return;

      const eventData = {
        ...newEvent,
        shelterId: currentShelterId,
      };

      await axios.post("/events", eventData);
      toast.success(t("Event.messages.success.eventCreated"));
      fetchEvents();
      resetNewEvent();
      setShowDialog(false);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(t("Event.messages.errors.createEvent"));
    }
  };


  const updateEvent = async () => {
    try {
      if (parseInt(newEvent.shelterId) !== parseInt(currentShelterId)) {
        toast.error(t("Event.messages.errors.editOwnShelter"));
        return;
      }

      if (!validateEventForm()) return;

      await axios.put(`/events/${selectedEventId}`, newEvent);
      toast.success(t("Event.messages.success.eventUpdated"));
      fetchEvents();
      resetNewEvent();
      setShowDialog(false);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error(t("Event.messages.errors.updateEvent"));
    }
  };

  const deleteEvent = async (id) => {
    try {
      const eventToDelete = events.find((event) => event.id === id);
      if (parseInt(eventToDelete.shelterId) !== parseInt(currentShelterId)) {
        toast.error(t("Event.messages.errors.deleteOwnShelter"));
        return;
      }

      await axios.delete(`/events/${id}`);
      toast.success(t("Event.messages.success.eventDeleted"));
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(t("Event.messages.errors.deleteEvent"));
    }
  };

  const resetNewEvent = () => {
    setNewEvent({
      shelterId: currentShelterId,
      name: "",
      date: null,
      description: "",
      location: "",
    });
    setIsEditing(false);
    setSelectedEventId(null);
  };

  const handleEditClick = (event) => {
    if (parseInt(event.shelterId) !== parseInt(currentShelterId)) {
      toast.error("You can only edit events from your shelter!");
      return;
    }

    if (!validateEventDate(event.date)) {
      toast.error("Cannot edit past events!");
      return;
    }

    setNewEvent({
      shelterId: event.shelterId,
      name: event.name,
      date: new Date(event.date),
      description: event.description,
      location: event.location,
    });
    setSelectedEventId(event.id);
    setIsEditing(true);
    setShowDialog(true);
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

  // Participants Dialog Component
  const ParticipantsDialog = () => (
    <Dialog
      header={`${t("Event.dialog.participants")} - ${selectedEventName}`}
      visible={showParticipantsDialog}
      onHide={() => setShowParticipantsDialog(false)}
      className="w-full max-w-4xl mx-auto"
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
    >
      <div className="p-4">
        {selectedEventParticipants.length === 0 ? (
          <div className="text-center py-8">
            <i className="pi pi-users text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-500">
            {t("Event.dialog.noParticipants")}
            </p>
          </div>
        ) : (
          <DataTable
            value={selectedEventParticipants}
            className="p-datatable-rounded"
          >
            <Column
              body={(rowData, options) => options.rowIndex + 1}
              header="No."
              style={{ width: "5%" }}
            />
            <Column
              header="Avatar"
              body={(rowData) => (
                <div className="flex justify-center">
                  {rowData.image ? (
                    <img
                      src={rowData.image}
                      alt={rowData.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <i className="pi pi-user text-gray-500"></i>
                    </div>
                  )}
                </div>
              )}
              style={{ width: "10%" }}
            />
            <Column field="username" header="Name" style={{ width: "20%" }} />
            <Column field="email" header="Email" style={{ width: "25%" }} />
            <Column field="phone" header="Phone" style={{ width: "15%" }} />
            <Column
              field="location"
              header="Location"
              style={{ width: "25%" }}
            />
          </DataTable>
        )}
      </div>
    </Dialog>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold text-gray-600">
          {t("Event.messages.loading")}
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            {t("Event.title")}
          </h1>

          {/* Search Bar */}
          <div className="relative mb-6">
            <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("Event.search.placeholder")}
              className="w-full h-14 pl-10 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Create Button */}
          <Button
            label={t("Event.buttons.create")}
            icon="pi pi-plus"
            onClick={() => {
              resetNewEvent();
              setShowDialog(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300"
          />
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <DataTable
            value={filteredEvents}
            paginator
            rows={10}
            emptyMessage={t("Event.table.noEvents")}
            className="p-datatable-rounded"
          >
            <Column
              body={(rowData, options) => options.rowIndex + 1}
              header={t("Event.table.no")}
              style={{ width: "5%" }}
            />
            <Column
              field="name"
              header={t("Event.table.eventName")}
              style={{ width: "20%" }}
            />
            <Column
              field="date"
              header={t("Event.table.date")}
              body={(rowData) => new Date(rowData.date).toLocaleString()}
              style={{ width: "15%" }}
            />
            <Column
              field="description"
              header={t("Event.table.description")}
              body={(rowData) => (
                <div
                  dangerouslySetInnerHTML={{ __html: rowData.description }}
                  className="max-h-20 overflow-y-auto"
                />
              )}
              style={{ width: "25%" }}
            />
            <Column
              field="location"
              header={t("Event.table.location")}
              style={{ width: "15%" }}
            />
            <Column
              header={t("Event.table.actions")}
              body={(rowData) => (
                <div className="flex gap-2">
                  <Button
                    icon="pi pi-users"
                    onClick={() => handleViewParticipants(rowData)}
                    className="p-button-rounded p-button-success p-button-outlined"
                    tooltip={t("Event.dialog.participants")}
                  />
                  <Button
                    icon="pi pi-pencil"
                    onClick={() => handleEditClick(rowData)}
                    className="p-button-rounded p-button-info p-button-outlined"
                  />
                  <Button
                    icon="pi pi-trash"
                    onClick={() => {
                      if (window.confirm(t("Event.messages.deleteConfirm"))) {
                        deleteEvent(rowData.id);
                      }
                    }}
                    className="p-button-rounded p-button-danger p-button-outlined"
                  />
                </div>
              )}
              style={{ width: "20%" }}
            />
          </DataTable>
        </div>

        {/* Create/Edit Event Dialog */}
        <Dialog
          header={isEditing ? t("Event.dialog.edit") : t("Event.dialog.create")}
          visible={showDialog}
          onHide={() => setShowDialog(false)}
          className="w-full max-w-4xl mx-auto"
          breakpoints={{ "960px": "75vw", "641px": "100vw" }}
          contentStyle={{ padding: "2rem" }}
        >
          <div className="flex flex-col gap-8">
            {/* Event Name */}
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                <i className="pi pi-calendar text-blue-500 mr-2"></i>
                {t("Event.form.eventName.label")}
              </label>
              <InputText
                value={newEvent.name}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, name: e.target.value })
                }
                placeholder={t("Event.form.eventName.placeholder")}
                className="w-full h-12 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4"
              />
            </div>

            {/* Event Date */}
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                <i className="pi pi-calendar text-blue-500 mr-2"></i>
                {t("Event.form.eventDate.label")}
              </label>
              <Calendar
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.value })}
                showIcon
                className="w-full"
                minDate={new Date()}
                placeholder={t("Event.form.eventDate.placeholder")}
                inputClassName="h-12 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                <i className="pi pi-align-left text-blue-500 mr-2"></i>
                {t("Event.form.description.label")}
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <QuillToolbar />
                <ReactQuill
                  value={newEvent.description}
                  onChange={(value) =>
                    setNewEvent({ ...newEvent, description: value })
                  }
                  className="h-48"
                  theme="snow"
                  placeholder={t("Event.form.description.placeholder")}
                />
              </div>
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                <i className="pi pi-map-marker text-blue-500 mr-2"></i>
                {t("Event.form.location.label")}
              </label>
              <InputText
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
                placeholder={t("Event.form.location.placeholder")}
                className="w-full h-12 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-4">
              <Button
                label={t("Event.buttons.cancel")}
                icon="pi pi-times"
                onClick={() => setShowDialog(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              />
              <Button
                label={isEditing ? t("Event.buttons.update") : t("Event.buttons.createEvent")}
                icon={isEditing ? "pi pi-check" : "pi pi-plus"}
                onClick={isEditing ? updateEvent : createEvent}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              />
            </div>
          </div>
        </Dialog>

        {/* Participants Dialog */}
        <ParticipantsDialog />
      </div>
    </div>
  );
};

export default Event;
