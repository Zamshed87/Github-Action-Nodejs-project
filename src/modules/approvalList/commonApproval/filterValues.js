import moment from "moment";

export const getFilteredValues = (values, wId, wgId) => {
  const storedFilters = localStorage.getItem("commonFilterData");
  console.log("storedFilters", storedFilters);
  let parsedFilters = {};

  try {
    parsedFilters = storedFilters ? JSON.parse(storedFilters) : {};
  } catch (error) {
    console.error("Failed to parse stored filters:", error);
  }

  return {
    workplaceGroup:
      values?.workplaceGroup?.value ||
      parsedFilters?.workplaceGroup?.value ||
      wgId,
    workplace:
      values?.workplace?.value || parsedFilters?.workplace?.value || wId,
    fromDate: parsedFilters?.fromDate
      ? moment(parsedFilters.fromDate).format("YYYY-MM-DD")
      : null,
    toDate: parsedFilters?.toDate
      ? moment(parsedFilters.toDate).format("YYYY-MM-DD")
      : null,
  };
};
