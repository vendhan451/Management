import React, { useState } from 'react';
import { THEME } from '../../constants';
import { PlusIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface CompanyEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<CompanyEvent[]>([
    { id: '1', title: 'Quarterly All-Hands Meeting', date: '2024-08-15', location: 'Main Auditorium', description: 'Join us for a review of Q2 and a look ahead at Q3.' },
    { id: '2', title: 'Summer Picnic', date: '2024-08-25', location: 'City Park, Area 4', description: 'Family-friendly event with food, games, and fun!' },
  ]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<CompanyEvent, 'id'>>({
    title: '',
    date: '',
    location: '',
    description: '',
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = (events.length + 1).toString();
    setEvents(prev => [...prev, { ...newEvent, id: newId }]);
    setNewEvent({ title: '', date: '', location: '', description: '' });
    setIsAddingEvent(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-semibold text-${THEME.primary}`}>Company Events & Announcements</h1>
        <button
          onClick={() => setIsAddingEvent(true)}
          className={`inline-flex items-center px-4 py-2 bg-${THEME.primary} text-${THEME.primaryText} text-sm font-medium rounded-md hover:bg-opacity-85 transition`}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Event
        </button>
      </div>

      {isAddingEvent && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h2 className={`text-xl font-semibold text-${THEME.accentText} mb-4`}>Add New Event</h2>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  id="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                rows={3}
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={() => setIsAddingEvent(false)} className="px-4 py-2 border rounded-md">Cancel</button>
              <button type="submit" className={`px-4 py-2 bg-${THEME.primary} text-${THEME.primaryText} rounded-md`}>Save Event</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {events.map(event => (
          <div key={event.id} className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className={`text-xl font-semibold text-${THEME.secondary} mb-2`}>{event.title}</h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <MapPinIcon className="h-4 w-4 mr-2" />
              <span>{event.location}</span>
            </div>
            <p className="text-gray-700">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
