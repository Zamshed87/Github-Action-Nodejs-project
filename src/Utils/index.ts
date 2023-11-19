type TGetSerial = {
  currentPage: number;
  pageSize: number;
  index: number;
};
export const getSerial = ({ currentPage, pageSize, index }: TGetSerial) => {
  return (currentPage - 1) * pageSize + index + 1;
};
