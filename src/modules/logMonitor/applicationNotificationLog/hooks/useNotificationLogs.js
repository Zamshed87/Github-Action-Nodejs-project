import { Form } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";

export const formatDate = (date) => {
  return moment(date).format("YYYY-MM-DD");
};

const useNotificationLogs = ({form}) => {
  const dispatch = useDispatch();
  const {
    profileData: { wId },
    permissionList,
    // workplaceDDL
  } = useSelector((store) => store?.auth, shallowEqual);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });

  const [data, getData, loading, setData] = useAxiosGet({});
  
  const fetchNotificationLogs = (pages) => {
    const formValues = form.getFieldsValue(true); // Get all current form values
  
    const formattedParams = {
      businessUnitId: formValues.businessUnit?.value,
      WorkplaceGroupIds: formValues.workplaceGroup?.value,
      WorkPlaceId: wId,
      WorkplaceIdList: formValues.workplaceList?.value,
      Search: formValues.search ?? "",
      NotificationType: formValues.notificationType?.value,
      applicationCategory: formValues.applicationCategory?.value,
      pushNotifyStatus: formValues.pushNotifyStatus?.value,
      employeeId: formValues.employee?.value,
      FromDate: formValues.fromDate ? formatDate(formValues.fromDate) : undefined,
      ToDate: formValues.toDate ? formatDate(formValues.toDate) : undefined,
      pageNo: pages?.current,
      pageSize: pages?.pageSize,
    };
  
    // Remove undefined or null values
    const filteredParams = Object.entries(formattedParams)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
  
    const url = `/LogMonitor/GetApplicationNotificationLog?${filteredParams}`;
    console.log("API URL:", url);
  
    getData(url, (res) => {
      setData(res?.Result);
    });
  };
  
  

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Log Monitor"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30573) {
      permission = item;
    }
  });

  return {
    pages,
    setPages,
    data,
    fetchNotificationLogs,
    loading,
    permission,
  };
};

export default useNotificationLogs;
