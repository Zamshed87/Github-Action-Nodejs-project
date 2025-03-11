import { Form } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const useNotificationLogs = () => {
  const dispatch = useDispatch();
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  
  const [form] = Form.useForm();
  const [data, getData, loading, setData] = useAxiosGet({});

  const fetchNotificationLogs = ({
    buId,
    wgId,
    wId,
    WorkplaceIdList = "",
    notificationCategory,
    notificationType,
    fromDate,
    toDate,
    pages,
    search = "",
  }) => {
    getData(
      `/LogMonitor/GetApplicationNotificationLog?businessUnitId=${buId}&WorkplaceGroupId=${wgId}&WorkPlaceId=${wId}&WorkplaceIdList=${WorkplaceIdList}&Search=${search}&NotificationCategory=${notificationCategory}&NotificationType=${notificationType}&FromDate=${fromDate}&ToDate=${toDate}&pageNo=${pages?.current}&pageSize=${pages?.pageSize}`,
      (res) => {
        setData(res);
      }
    );
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30543) {
      permission = item;
    }
  });

  return {
    form,
    pages,
    setPages,
    data,
    fetchNotificationLogs,
    loading,
    permission,
  };
};

export default useNotificationLogs;
