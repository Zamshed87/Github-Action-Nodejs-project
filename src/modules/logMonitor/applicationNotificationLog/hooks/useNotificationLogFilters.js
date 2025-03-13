import { useEffect, useState } from "react";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import { getEnumData } from "common/api/commonApi";
import moment from "moment";
  const defaultFromDate = moment();
  const defaultToDate = moment().endOf("month");
const useNotificationLogFilters = ({ form }) => {
  const {
    profileData: { orgId, buId, buName, wgId, wId, employeeId },
    businessUnitDDL,
    // workplaceDDL,
  } = useSelector((store) => store?.auth, shallowEqual);

  const [notificationType, setNotificationType] = useState([]);
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  const employeeDDL = useApiRequest([]);

  const getEmployeeDDL = (value = "") => {
    // if (value?.length < 2) return CommonEmployeeDDL?.reset();
    employeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };
  const getWorkplaceGroupDDL = () => {
    const { businessUnit } = form.getFieldsValue(true);
    workplaceGroup?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "WorkplaceGroup",
        BusinessUnitId: businessUnit?.value || buId,
        WorkplaceGroupId: wgId,
        intId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };
  const getWorkplaceDDL = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    workplace?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value || wgId,
        intId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };

  useEffect(() => {
    getWorkplaceGroupDDL();
    getWorkplaceDDL();
    getEnumData("NotificationType", setNotificationType);
  }, [orgId, buId, wgId, wId]);

  return {
    initialValues: {
      businessUnit: { label: buName, value: buId },
      workplaceGroup: {
        label: "All",
        value: workplaceGroup?.data
          ?.map((w) => w?.intWorkplaceGroupId)
          ?.join(","),
      },
      workplaceList: {
        label: "All",
        value: workplace?.data?.map((w) => w?.intWorkplaceId)?.join(","),
      },
      fromDate: defaultFromDate,
      toDate: defaultToDate,
    },
    businessUnitDDL: businessUnitDDL?.map((bu) => ({
      label: bu.BusinessUnitName,
      value: bu.BusinessUnitId,
    })),
    workplaceGroupDDL: workplaceGroup?.data,
    getWorkplaceGroupDDL,
    workplaceDDL: [
      {
        label: "All",
        value: workplace?.data?.map((w) => w?.intWorkplaceId)?.join(","),
      },
      ...workplace.data,
    ],
    getWorkplaceDDL,
    notificationType,
    employeeDDL: employeeDDL?.data,
    getEmployeeDDL,
  };
};

export default useNotificationLogFilters;
