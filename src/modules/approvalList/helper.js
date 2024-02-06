import axios from "axios";

export const getApprovalDashboardLanding = async (
  accId,
  employeeId,
  isOfficeAdmin,
  setter,
  setIsLoading,
  wId
) => {
  setIsLoading && setIsLoading(true);
  try {
    let res = await axios.get(
      `/Dashboard/PendingApprovalDashboard?accountId=${accId}&employeeId=${employeeId}&isAdmin=${isOfficeAdmin}&iAmFromWeb=true&iAmFromApps=false&workplaceId=${wId}`
    );
    setIsLoading && setIsLoading(false);
    setter(res?.data);
  } catch (err) {
    setIsLoading && setIsLoading(false);
  }
};
