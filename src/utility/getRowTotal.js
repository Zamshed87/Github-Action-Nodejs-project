export const getRowTotal = (arr, property) => {
  return arr.reduce((sum, item) => sum + (item?.[property]||0), 0);
};
