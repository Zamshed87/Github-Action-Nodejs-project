import axios from "axios";

export const getApprovalDashboardLandingOld = async (
  accId,
  employeeId,
  isOfficeAdmin,
  setter,
  setIsLoading,
  wId,
  BusinessUnitId,
  WorkplaceGroupId
) => {
  setIsLoading && setIsLoading(true);
  try {
    const res = await axios.get(
      `/Dashboard/PendingApprovalDashboard?accountId=${accId}&businessUnitId=${BusinessUnitId}&workplaceGroupId=${WorkplaceGroupId}&employeeId=${employeeId}&isAdmin=${isOfficeAdmin}&iAmFromWeb=true&iAmFromApps=false&workplaceId=${wId}`
    );
    setIsLoading && setIsLoading(false);
    setter(res?.data);
  } catch (err) {
    setIsLoading && setIsLoading(false);
  }
};

export const getApprovalDashboardLanding = async (
  accId,
  employeeId,
  isOfficeAdmin,
  setter,
  setIsLoading,
  wId,
  BusinessUnitId,
  WorkplaceGroupId
) => {
  setIsLoading && setIsLoading(true);
  try {
    const res = await axios.get(
      `/Approval/GetPendingApprovalDashboard?accountId=${accId}&businessUnitId=${BusinessUnitId}&workplaceGroupId=${WorkplaceGroupId}&workplaceId=${wId}&employeeId=${employeeId}`
    );
    setIsLoading && setIsLoading(false);
    setter(res?.data || []); // Ensure the setter is passed an array
  } catch (err) {
    setIsLoading && setIsLoading(false);
    console.error("Error fetching pending approvals:", err);
  }
};
