
export const getFilteredValues = (values, wId, wgId) => {
  const storedFilters = localStorage.getItem("commonFilterData");
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
  };
};
