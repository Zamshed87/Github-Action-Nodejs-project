import axios from "axios";

// transfer and promotion common api
export const getAllTransferAndPromotionLanding = async (
  buId,
  wgId,
  landingType,
  fromDate,
  toDate,
  setter,
  setLoading,
  pageNo,
  pageSize,
  setPages,
  searchText = "",
  wId
) => {
  setLoading && setLoading(true);

  let apiUrl = `/Employee/GetAllEmpTransferNpromotion?businessUnitId=${buId}&workplaceGroupId=${wgId}&workplaceId=${wId}&PageNo=${pageNo}&PageSize=${pageSize}`;

  landingType && (apiUrl += `&landingType=${landingType}`);

  fromDate &&
    toDate &&
    (apiUrl += `dteFromDate=${fromDate}&dteToDate=${toDate}`);

  searchText && (apiUrl += `&SearchTxt=${searchText}`);

  try {
    const res = await axios.get(apiUrl);

    if (res?.data) {
      if (landingType === "all" || landingType === "transfer") {
        const modifiedData = res?.data?.data?.map((item, index) => ({
          ...item,
          initialSerialNumber: index + 1,
        }));

        setter?.(modifiedData);

        setPages({
          current: res?.data?.currentPage,
          pageSize: res?.data?.pageSize,
          total: res?.data?.totalCount,
        });
      }

      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
