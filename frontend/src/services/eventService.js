import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const getEvents = () => axios.get(`${API_URL}/events`);
export const addEvent = (event) => axios.post(`${API_URL}/events`, event);
export const updateEvent = (id, event) =>
  axios.put(`${API_URL}/events/${id}`, event);
export const deleteEvent = (id) => axios.delete(`${API_URL}/events/${id}`);
