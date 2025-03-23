export const formatTime12Hour = (time) => {
  if (!time) return "N/A"; // Handle empty/null values
  
  const [hours, minutes] = time.split(":");
  const dateObj = new Date();  // Get the current date
  dateObj.setHours(hours, minutes, 0, 0);  // Set the time

  return dateObj.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
