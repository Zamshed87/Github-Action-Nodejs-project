export const nameCutter = (start, end, name) => {
  if (!name) return false;
  let newName = name.slice(start, end);
  if (name.length > end) {
    return `${newName}...`;
  } else {
    return name;
  }
};


export const nameCutterTwo = (start, end, name) => {
  if (!name) return false;
  let newName = name.slice(start, end);
  if (name.length > end) {
    return `${newName}...`;
  } else {
    return `${newName}`;
  }
};