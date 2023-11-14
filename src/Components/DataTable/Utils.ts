export const compareValues = (valueA: any, valueB: any, dataType: string) => {
  // Add custom sorting logic based on data type
  if (dataType === "date") {
    const dateA = new Date(valueA);
    const dateB = new Date(valueB);

    // Check if parsing was successful before comparison
    if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
      return dateA.getTime() - dateB.getTime();
    }

    // If parsing fails, return 0
    return 0;
  }
  // Handle other data types
  if (typeof valueA === "string")
    return String(valueA).localeCompare(String(valueB));
  else if (typeof valueA === "number") return valueA - valueB;

  // Add additional data types as needed
  return 0;
};

// Dynamically generate filters based on the unique values in the 'dataIndex'
export const generateFilters = (dataIndex: string, dataSource: any[]) => {
  const uniqueValues = Array.from(
    new Set(dataSource.map((record) => record[dataIndex]))
  );
  return uniqueValues.map((value) => ({
    text: value,
    value: value,
  }));
};
// Dynamically generate onFilter function based on 'dataIndex'
export const generateOnFilter =
  (dataIndex: string) => (value: string, record: any) =>
    record[dataIndex].toString().toLowerCase().indexOf(value.toLowerCase()) ===
    0;
// Dynamically generate width based on Title
export const generateColumnWidth = (
  title: string,
  isSort: boolean,
  isFilter: boolean
) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const extraWidth = 70; // Add extra width for sort and filter icons
  if (context) {
    let width = context.measureText(title).width;
    if (isSort) width += extraWidth;
    if (isFilter) width += extraWidth;
    // Clean up resources
    canvas.remove();
    return `${width}px`;
  }
};

export const calculatePercentage = (
  value: number,
  percentage: number
): number => {
  return (percentage / 100) * value;
};
