export const formatFilterValue = (
  value: number | string | (number | string)[] | null | undefined
): string | number => {
  console.log(value);
  if (value === null || value === undefined) {
    return 0;
  } else if (Array.isArray(value)) {
    return value.length > 0 ? value.join(",") : 0;
  } else if (
    (typeof value === "number" || typeof value === "string") &&
    value !== 0
  ) {
    return value;
  } else {
    return 0;
  }
};
