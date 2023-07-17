export const isAlreadyPresent = (obj, listData, uniqueKey) => {
  for (let i = 0; i < listData.length; i++) {
    if (listData[i][uniqueKey] === obj[uniqueKey]) {
      return i;
    }
  }
  return -1;
};

export const sortDataList = (
  arrayOfObject,
  key,
  type = "string",
  order = "asce"
) => {
  if (order === "asce") {
    if (type === "number") arrayOfObject.sort((a, b) => a[key] - b[key]);
    else if (type === "string")
      arrayOfObject.sort((a, b) => a[key].length - b[key].length);
    else if (type === "date")
      arrayOfObject.sort((a, b) => new Date(a[key]) - new Date(b[key]));
  } else {
    if (type === "number") arrayOfObject.sort((a, b) => b[key] - a[key]);
    else if (type === "string")
      arrayOfObject.sort((a, b) => b[key].length - a[key].length);
    else if (type === "date")
      arrayOfObject.sort((a, b) => new Date(b[key]) - new Date(a[key]));
  }
};
