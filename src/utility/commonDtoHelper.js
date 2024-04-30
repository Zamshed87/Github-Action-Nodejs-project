/**
 * Filters the rowDto array based on the provided keywords and updates the setRowDto state.
 * @param {string} keywords - The keywords to filter the rowDto array.
 * @param {function} setRowDto - The state setter function to update the rowDto array.
 * @param {string} key - The key to access the property in each item of the rowDto array.
 * @param {Array} rowDto - The array to be filtered.
 * @param {function} func - An optional function to be called after updating the rowDto array.
 */
export const commonDtofilter = (keywords = "", setRowDto, key, rowDto, func) => {
  try {
    if (!keywords) {
      // setRowDto(rowDto);
      func?.();
      return;
    }
    const regex = new RegExp(keywords?.toLowerCase());
    const newDta = rowDto?.filter((item) =>
      regex.test(item?.[key]?.toLowerCase())
    );
    setRowDto?.(newDta);
  } catch (error) {
    setRowDto?.([]);
  }
};
