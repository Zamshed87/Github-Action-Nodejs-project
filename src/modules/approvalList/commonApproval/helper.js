import axios from "axios";
import { toast } from "react-toastify";

export const fetchPendingApprovals = async ({
  id,
  setLoading,
  orgId,
  buId,
  wgId,
  wId,
  employeeId,
  setData,
  setTotalRecords,
  departmentId,
  designationId,
  searchText,
  page,
}) => {
  setLoading(true);
  try {
    const params = {
      accountId: orgId,
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      applicationTypeId: id,
      employeeId: employeeId,
      pageNo: page?.pageNo || 1,
      pageSize: page?.pageSize || 25,
    };

    if (searchText) params.search = searchText;
    if (designationId) params.designationId = designationId;
    if (departmentId) params.departmentId = departmentId;

    const response = await axios.get(
      `/Approval/GetAllPendingApplicationsForApproval`,
      { params }
    );

    setData(Array.isArray(response.data?.data) ? response.data?.data : []);
    setTotalRecords(response.data?.totalCount || 0);
  } catch (error) {
    toast.error("Failed to fetch approvals.");
    setData([]);
  } finally {
    setLoading(false);
  }
};
