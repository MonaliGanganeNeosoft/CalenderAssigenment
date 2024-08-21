import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import "./CalendarView.css"; // Import the CSS file

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    startTime: "",
    endTime: "",
    description: "",
    participants: "",
    duration: "",
    sessionNotes: "",
  });
  const [selectedEventId, setSelectedEventId] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/events");

      const eventArray = response.data.map((event) => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime,
        end: event.end.dateTime,
        description: event.description,
        participants: event.attendees
          ? event.attendees.map((att) => att.email).join(", ")
          : "",
      }));

      setEvents(eventArray);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setShowModal(true);
    setIsEditing(false); // New event creation mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const formatDateForApi = (date) => {
    return new Date(date).toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmails(eventDetails.participants)) {
      toast.error("Please enter valid email addresses, separated by commas.");
      return;
    }

    // Convert dates to the correct format
    const formattedStartTime = formatDateForApi(eventDetails.startTime);
    const formattedEndTime = formatDateForApi(eventDetails.endTime);

    const payload = {
      ...eventDetails,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };

    try {
      if (isEditing && selectedEventId) {
        await axios.put(
          `http://localhost:8000/api/events/${selectedEventId}`,
          payload
        );
        toast.success("Event updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/events", payload);
        toast.success("Event added successfully!");
      }
      setShowModal(false);
      setEventDetails({});
      fetchEvents(); // Re-fetch events after submitting
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Error saving event.");
    }
  };

  const handleDelete = async (eventId, e) => {
    e.stopPropagation(); // Prevents the event from bubbling up and triggering other handlers

    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:8000/events/${eventId}`);
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );
        toast.success("Event deleted successfully!");
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Error deleting event.");
      }
    }
  };

  const formatDateForForm = (dateTime) => {
    if (!dateTime) return "";
    const [date, time] = dateTime.split("T");
    const formattedTime = time.slice(0, 5); // Remove seconds
    return `${date}T${formattedTime}`;
  };

  // Function to handle editing an event
  const handleEdit = (event) => {
    setSelectedEventId(event.id);
    setEventDetails({
      title: event.title,
      startTime: formatDateForForm(event.start),
      endTime: formatDateForForm(event.end),
      description: event.description,
      participants: event.participants, // Adjust if you have a different format
      // Add any additional fields here
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const validateEmails = (emails) => {
    const emailArray = emails.split(",").map((email) => email.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailArray.every((email) => emailRegex.test(email));
  };

  const handleEventClick = (info) => {
    setSelectedEventId(info.event.id);
    setEventDetails({
      title: info.event.title,
      startTime: info.event.startStr, // Make sure this is in the correct format
      endTime: info.event.endStr, // Make sure this is in the correct format
      description: info.event.extendedProps.description,
      participants: info.event.extendedProps.participants,
      duration: info.event.extendedProps.duration,
      sessionNotes: info.event.extendedProps.sessionNotes,
    });
    setIsEditing(true); // Set to editing mode
    setShowModal(true);
  };

  const renderEventContent = (eventInfo) => (
    <div className="event-content">
      <span className="event-title">{eventInfo.event.title}</span>
      <div className="event-actions">
        <Button
          variant="link"
          onClick={(e) => handleEdit(eventInfo.event.id, e)}
          className="edit-btn"
        >
          <FaEdit className="edit-btn" />
        </Button>
        <Button
          variant="link"
          onClick={(e) => handleDelete(eventInfo.event.id, e)}
          className="delete-btn"
        >
          <FaTrash className="delete-btn" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer />

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={events}
        eventContent={renderEventContent} // Use custom rendering
        eventClick={handleEventClick} // Handle event clicks
      />

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="calendar-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">
            {isEditing ? "Edit Event" : "Add Event"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event title"
                name="title"
                value={eventDetails.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStartTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="startTime"
                value={eventDetails.startTime}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEndTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="endTime"
                value={eventDetails.endTime}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                name="description"
                value={eventDetails.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formParticipants">
              <Form.Label>Participants</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter participants (comma separated)"
                name="participants"
                value={eventDetails.participants}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDuration">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter duration"
                name="duration"
                value={eventDetails.duration}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formSessionNotes">
              <Form.Label>Session Notes</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter session notes"
                name="sessionNotes"
                value={eventDetails.sessionNotes}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isEditing ? "Update Event" : "Add Event"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CalendarView;
