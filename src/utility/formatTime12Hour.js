export const formatTime12Hour = (time) => {
    if (!time) return "N/A"; // Handle empty/null values
  
    const dateObj = new Date(`1970-01-01T${time}Z`); // Parse as UTC time
    return dateObj.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };