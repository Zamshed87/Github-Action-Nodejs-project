export const currentYear = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  return currentYear;
}
// get previous year
export const prevYear = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  return currentYear-1;
}