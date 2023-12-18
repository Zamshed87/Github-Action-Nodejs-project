import axios from "axios";
import { APIUrl, domainUrl, prodUrl } from "./../../App";

export function loginApiCall(email, password) {
  return axios.post(`/Auth/Login`, {
    strLoginId: email,
    strPassword: password,
    intUrlId: 0,
    intAccountId: 1,
    // strUrl: "https://pentex.peopledesk.io",
    strUrl: domainUrl === prodUrl ? domainUrl : origin,

    // strUrl:
    //   domainUrl === "https://devmatador.peopledesk.io"
    //     ? domainUrl
    //     : "https://matador.peopledesk.io",
  });
}

// otp api
export function getLoginOTP(email) {
  return axios.get(`/Auth/GetLoginOTP?mailAddress=${email}`);
}

// Api for getDownlloadFileView
export function getDownlloadFileView(id, tokenData = "") {
  let config = {
    headers: {
      Authorization: `Bearer ${tokenData}`,
    },
  };
  return axios.get(`${APIUrl}/Document/DownloadFile?id=${id}`, config);
}

export function geBuDDL(accId, buId, employeeId) {
  return axios.get(
    `/MasterData/PeopleDeskAllLanding?TableName=${"BusinessUnit"}&AccountId=${accId}&BusinessUnitId=${buId}&intId=${
      employeeId || 0
    }`
  );
}

export function getWGDDL(buId, wgId, employeeId) {
  return axios.get(
    `PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=${
      employeeId || 0
    }`
  );
}
export function getWDDL(buId, wgId, employeeId) {
  return axios.get(
    `PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${
      employeeId || 0
    }`
  );
}

export function getMenuList(employeeId) {
  return axios.get(`/Auth/GetMenuListPermissionWise?EmployeeId=${employeeId}`);
}

export function getKeywords(orgId, lang) {
  return axios.get(
    `/QueryData/GetGlobalCultures?AccountId=${orgId}&Language=${lang}`
  );
}

export function getPermissionList(userId) {
  return axios.get(
    `/Auth/GetMenuUserPermissionForActivityCheck?employeeId=${userId}`
  );
}
