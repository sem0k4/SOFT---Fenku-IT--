import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Utility function to format timestamps
export function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleTimeString();
}

// Utility function to format temperature
export function formatTemperature(temp) {
  return `${temp.toFixed(1)}°C`;
}

// Utility function to get status color based on connection state
export function getConnectionStatusColor(isConnected) {
  return isConnected ? 'success' : 'destructive';
}

// Utility function to validate sensor data
export function validateSensorData(data) {
  if (!data || typeof data !== 'object') return false;
  
  const requiredFields = ['object_temp', 'ambient_temp', 'timestamp'];
  return requiredFields.every(field => data.hasOwnProperty(field));
}