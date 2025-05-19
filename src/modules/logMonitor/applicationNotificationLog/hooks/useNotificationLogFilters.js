import { useEffect, useState } from "react";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import { getEnumData } from "common/api/commonApi";
import moment from "moment";
const defaultFromDate = moment().startOf("month");
const defaultToDate = moment().endOf("month");
const useNotificationLogFilters = ({ form }) => {
  const {
    profileData: { orgId, buId, buName, wgId, wId, employeeId },
    businessUnitDDL,
    workplaceGroupDDL,
    workplaceDDL,
  } = useSelector((store) => store?.auth, shallowEqual);
  const [notificationType, setNotificationType] = useState([]);
  const [pushNotifyStatus, setPushNotifyStatus] = useState([]);
  const [applicationCategory, setApplicationCategory] = useState([]);
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
    const { businessUnit } = form?.getFieldsValue(true);
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
    const { workplaceGroup } = form?.getFieldsValue(true);
    workplace?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.label == "All" ? wgId : workplaceGroup?.value || wgId,
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
  const getPushNotificationStatus = (type) => {
    getEnumData(type, setPushNotifyStatus);
  }
  const values = {
    businessUnit: { label: buName, value: buId },
    workplaceGroup: {
      label: "All",
      value: workplaceGroupDDL?.map((w) => w?.WorkplaceGroupId)?.join(","),
    },
    workplaceList: {
      label: "All",
      value: workplaceDDL?.map((w) => w?.WorkplaceId)?.join(","),
    },
    fromDate: defaultFromDate,
    toDate: defaultToDate,
  };
  useEffect(() => {
    if (!form) return; // Ensure form is ready
  
    const values = {
      businessUnit: { label: buName, value: buId },
      workplaceGroup: {
        label: "All",
        value: workplaceGroupDDL?.map((w) => w?.WorkplaceGroupId)?.join(","),
      },
      workplaceList: {
        label: "All",
        value: workplaceDDL?.map((w) => w?.WorkplaceId)?.join(","),
      },
      fromDate: defaultFromDate,
      toDate: defaultToDate,
    };
  
    form.setFieldsValue(values);
  }, [form, orgId, buId, wgId, wId]);

  useEffect(() => {
    getWorkplaceGroupDDL();
    getWorkplaceDDL();
    getEnumData("NotificationType", setNotificationType);
    getEnumData("ApplicationCategory", setApplicationCategory);
  }, [orgId, buId, wgId, wId]);
  return {
    initialValues: values,
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
    applicationCategory,
    pushNotifyStatus,
    getPushNotificationStatus,
    employeeDDL,
    getEmployeeDDL,
  };
};

export default useNotificationLogFilters;
