export const antFilterData = (data) => (formatter) => {
  const result = data.map((item) => ({
    text: formatter(item),
    value: formatter(item),
  }));
  return result?.filter(item => item.text);
}

