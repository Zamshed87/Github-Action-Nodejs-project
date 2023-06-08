export const yearDDLAction = (prev = 0, next = 10) => {
  const year = new Date().getFullYear();

  const yearStart = year - prev;
  const yearEnd = year + next;
  let years = [];
  for (let i = yearStart; i <= yearEnd; i++) {
    years.push({ value: i, label: i });
  }
  return years;
};
