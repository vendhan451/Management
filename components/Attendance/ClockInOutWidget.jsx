import React, { useState } from 'react';
import { apiClockIn, apiClockOut } from '../../services/api';

const OFFICE_LAT = 37.7749;
const OFFICE_LNG = -122.4194;
const RADIUS_METERS = 500;

function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function ClockInOutWidget({ userId }) {
  const [status, setStatus] = useState('');
  const handleClockIn = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      const dist = getDistanceFromLatLonInM(latitude, longitude, OFFICE_LAT, OFFICE_LNG);
      if (dist > RADIUS_METERS) {
        setStatus('You are not at the office location.');
        return;
      }
      apiClockIn(userId).then(() => setStatus('Clocked in!'));
    }, () => setStatus('Location permission denied'));
  };
  const handleClockOut = () => {
    apiClockOut(userId).then(() => setStatus('Clocked out!'));
  };
  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <button onClick={handleClockIn} className="bg-green-700 text-white px-4 py-2 rounded mr-2">Clock In</button>
      <button onClick={handleClockOut} className="bg-gray-700 text-white px-4 py-2 rounded">Clock Out</button>
      {status && <div className="mt-2 text-sm text-blue-700">{status}</div>}
    </div>
  );
}
