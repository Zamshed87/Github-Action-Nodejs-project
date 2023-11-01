// search
export const commonDtofilter = (keywords, setRowDto, key, rowDto, func) => {
  try {
    if (!keywords) {
      setRowDto(rowDto);
      func();
      return;
    }
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = rowDto?.filter((item) =>
      regex.test(item?.[key]?.toLowerCase())
    );
    setRowDto(newDta);
  } catch (error) {
    setRowDto([]);
  }
};
