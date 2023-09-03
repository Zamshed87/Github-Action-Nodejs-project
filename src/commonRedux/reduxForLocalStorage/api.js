import axios from "axios";

// getPyrGrossWiseBasicLS
export function getPyrGrossWiseBasicLS(accId, buId) {
  return axios.get(
    `/Payroll/GetAllGrossWiseBasic?IntAccountId=${accId}&IntBusinessUnitId=${buId}`
  );
}
