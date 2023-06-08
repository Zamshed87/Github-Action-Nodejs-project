export const getDecimal = (value) => {
  return value % 1;
};

export const getIntegerNumber = (value) => {
  return value - getDecimal(value);
};

export const getDecimalIntegerNumber = (value) => {
  let result = Math.floor(getDecimal(value) * 100);

  if (result > 9) {
    return result;
  } else {
    return `0${result}`;
  }
};
