// this function returns if an input is valid positive number or not
// it should take the whole event variable as parameter.

export const isNumber = (e) => {
  return e.nativeEvent.data === "-" || e.target.value.includes("-");
};
