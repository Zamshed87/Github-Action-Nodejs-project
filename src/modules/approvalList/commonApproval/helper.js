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
  departmentId,
  designationId,
  searchText,
}) => {
  setLoading(true);
  try {
    const response = await axios.get(
      `/Approval/GetAllPendingApplicationsForApproval`,
      {
        params: {
          accountId: orgId,
          businessUnitId: buId,
          workplaceGroupId: wgId,
          workplaceId: wId,
          applicationTypeId: id,
          employeeId: employeeId,
        },
      }
    );
    setData(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    toast.error("Failed to fetch approvals.");
    setData([]);
  } finally {
    setLoading(false);
  }
};
