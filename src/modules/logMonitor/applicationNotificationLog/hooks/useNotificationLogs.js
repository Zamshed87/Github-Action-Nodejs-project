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

  // form fields
  const businessUnit = Form.useWatch("businessUnit", form);
  const workplaceGroup = Form.useWatch("workplaceGroup", form);
  const workplaceList = Form.useWatch("workplaceList", form);
  const notificationType = Form.useWatch("notificationType", form);
  const fromDate = Form.useWatch("fromDate", form);
  const toDate = Form.useWatch("toDate", form);
  const search = Form.useWatch("search", form);
  
  const fetchNotificationLogs = (pages) => {
    // we will need this
    // const WorkplaceIdList = workplaceList?.map((w) => w.value)?.join(",");
    // const notificationCategory = null;
    // &NotificationCategory=${notificationCategory}
    const FormattedFromDate = fromDate ? formatDate(fromDate) : undefined;
    const FormattedToDate = toDate ? formatDate(toDate) : undefined;
    getData(
      `/LogMonitor/GetApplicationNotificationLog?businessUnitId=${
        businessUnit?.value
      }&WorkplaceGroupId=${
        workplaceGroup?.value
      }&WorkPlaceId=${wId}&WorkplaceIdList=${workplaceList?.value}&Search=${
        search ?? ""
      }&NotificationType=${
        notificationType?.value
      }&FromDate=${FormattedFromDate ?? ""}&ToDate=${
        FormattedToDate ?? ""
      }&pageNo=${pages?.current}&pageSize=${pages?.pageSize}`,
      (res) => {
        setData(res?.Result);
      }
    );
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
