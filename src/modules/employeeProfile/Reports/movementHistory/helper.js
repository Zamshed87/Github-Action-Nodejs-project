import axios from "axios";
import { toast } from "react-toastify";

export const getBuDetails = async (buId, setter, setLoading) => {
  try {
    const res = await axios.get(
      `/SaasMasterData/GetBusinessDetailsByBusinessUnitId?businessUnitId=${buId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
  }
};

export const getMovementHistory = async (
  buId,
  wgId,
  fromDate,
  toDate,
  search,
  setter,
  setLoading,
  pageNo,
  pageSize,
  setPages,
  isPaginated = true
) => {
  setLoading && setLoading(true);

  try {
    let apiUrl = `/Employee/EmployeeMovementReportAll?BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&FromDate=${fromDate}&ToDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&IsPaginated=${isPaginated}`;

    search = search && (apiUrl += `&SearchText=${search}`);

    const res = await axios.get(apiUrl);

    if (res?.data) {
      const modifiedData = res?.data?.data?.map((item, index) => ({
        ...item,
        initialSerialNumber: index + 1,
      }));

      setter && setter?.(modifiedData);

      setPages({
        current: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        total: res?.data?.totalCount,
      });

      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};
