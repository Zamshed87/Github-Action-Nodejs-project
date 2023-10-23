export const timeFormatter = (time) => {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
      time,
    ];
  
    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  };
  
  export const convertTo12HourFormat =(time24) => {
    // Split the input time into hours and minutes
    const [hours, minutes, seconds] = time24?.split(':');
  
    // Convert the hours to a number
    const hour = parseInt(hours, 10);
  
    // Determine whether it's AM or PM
    const period = hour >= 12 ? 'PM' : 'AM';
  
    // Convert 24-hour format to 12-hour format
    const hour12 = hour % 12 || 12; // Ensure 12:00 AM is shown as 12:00
  
    // Create the formatted time string
    const time12 = `${hour12}:${minutes}:${seconds} ${period}`;
  
    return time12;
  }
  