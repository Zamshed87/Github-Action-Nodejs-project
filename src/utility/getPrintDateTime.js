export function printDateTime() {
  // Get current date and time
  var now = new Date();

  // Extract date components
  var year = now.getFullYear();
  var month = String(now.getMonth() + 1).padStart(2, "0");
  var day = String(now.getDate()).padStart(2, "0");

  // Extract time components
  var hours = String(now.getHours()).padStart(2, "0");
  var minutes = String(now.getMinutes()).padStart(2, "0");

  // Format AM/PM
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  // Construct formatted string
  var formattedDateTime = `${day}-${month}-${year} : ${hours}:${minutes} ${ampm}`;

  // Return formatted date and time
  return formattedDateTime;
}

// Example usage
// Output: 09-04-2024 : 10: 36 AM
