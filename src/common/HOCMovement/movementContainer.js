import { PeopleDeskSaasDDL, getPeopleDeskAllLanding } from "common/api";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { monthFirstDate, monthLastDate } from "utility/dateFormatter";
import { todayDate } from "utility/todayDate";
import {
  createMovementApplication,
  empMgmtMoveApplicationDto,
  getApprovalLogHistoriesById,
  getMovementApplicationLanding,
} from "./helper";

const withMovementContainer = (WrappedComponent) => {
  const HOCMovement = () => {
    const {
      profileData: {
        userName,
        intProfileImageUrl,
        orgId,
        buId,
        employeeId,
        wgId,
        isOfficeAdmin,
      },
      permissionList,
    } = useSelector((state) => state?.auth, shallowEqual);
    const [loading, setLoading] = useState(false);
    const [employeeDDL, setEmployeeDDL] = useState([]);
    const [loadingForInfo, setLoadingForInfo] = useState(false);
    const [moveHistoryData, setMoveHistoryData] = useState([]);
    const [singleData, setSingleData] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [employeeInfo, setEmployeeInfo] = useState([]);
    const [isFilter, setIsFilter] = useState(false);
    const [allData, setAllData] = useState([]);
    const [movementTypeDDL, setMovementTypeDDL] = useState([]);
    const [showTooltip, setShowTooltip] = useState([]);

    // save
    const saveHandler = (values, cb) => {
      const employee = employeeInfo?.[0];
      console.log(singleData)
      const payload = {
        partId: singleData ? 2 : 1,
        movementId: singleData ? singleData?.MovementId : 0,
        intEmployeeId: employee
          ? employee?.EmployeeId
          : values?.employee
          ? values?.employee?.value
          : employeeId,
        movementTypeId: values?.movementType?.value,
        fromDate: values.fromDate
          ? moment(values?.fromDate).format("YYYY-MM-DD")
          : todayDate(),
        toDate: values.toDate
          ? moment(values?.toDate).format("YYYY-MM-DD")
          : todayDate(),
        fromTime: moment(values?.startTime, "HH:mm:ss").format("HH:mm:ss"),
        toTime: moment(values?.endTime, "HH:mm:ss").format("HH:mm:ss"),
        reason: values?.reason,
        location: values?.location,
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        isActive: true,
        insertBy: employeeId,
      };

      const callback = () => {
        getData(payload?.intEmployeeId);
        cb();
      };
      console.log("employeeInfo", employee);
      console.log("values", values);
      console.log("payload", payload);
      if (employee?.EmployeeId) {
        createMovementApplication(payload, setLoading, callback);
      } else {
        createMovementApplication(payload, setLoading, callback);
      }
    };
    // delete
    const demoPopupForDelete = (data, values) => {
      const callback = () => {
        getData(values);
        setSingleData("");
      };
      const payload = {
        partId: 3,
        movementId: data?.MovementId,
        intEmployeeId: data?.EmployeeId,
        movementTypeId: data?.MovementTypeId || 0,
        fromDate: data?.FromDate,
        toDate: data?.ToDate,
        fromTime: moment(data?.FromTime, "HH:mm:ss").format("HH:mm"),
        toTime: moment(data?.ToTime, "HH:mm:ss").format("HH:mm"),
        reason: data?.Reason,
        location: data?.Location,
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        isActive: true,
        insertBy: employeeId,
      };
      createMovementApplication(payload, setLoading, callback);
      setSingleData(data);
    };

    // search
    const searchData = (keywords, allData, setRowDto) => {
      try {
        const regex = new RegExp(keywords?.toLowerCase());
        const newDta = allData?.filter((item) =>
          regex.test(item?.MovementType?.toLowerCase())
        );
        setRowDto(newDta);
      } catch {
        setRowDto([]);
      }
    };
    // info get
    const getEmpInfoDetails = (empId) => {
      getPeopleDeskAllLanding(
        "EmployeeBasicById",
        orgId,
        buId,
        empId ? empId : employeeId,
        setEmployeeInfo,
        null,
        setLoadingForInfo,
        null,
        null,
        wgId
      );
    };
    const getData = (empId) => {
      PeopleDeskSaasDDL(
        "MovementType",
        wgId,
        buId,
        setMovementTypeDDL,
        "MovementTypeId",
        "MovementType",
        empId ? empId : employeeId
      );
    };
    const getMovementHistortyForTable = (values) => {
      const employee = employeeInfo?.[0] || {};

      const payload = {
        movementTypeId: "",
        applicationDate: "",
        fromDate: values?.movementFromDate
          ? moment(values?.movementFromDate).format("YYYY-MM-DD")
          : monthFirstDate(),
        toDate: values?.movementToDate
          ? moment(values?.movementToDate).format("YYYY-MM-DD")
          : monthLastDate(),
        statusId: "",
        empId: values?.employee
          ? values?.employee?.value
          : employee
          ? employee?.EmployeeId
          : employeeId,
      };
      getMovementApplicationLanding(
        "MovementApplication",
        orgId,
        buId,
        payload,
        setMoveHistoryData,
        setAllData,
        setLoading
      );
    };

    useEffect(() => {
      getData();
      getMovementHistortyForTable();
    }, [wgId]);

    useEffect(() => {
      getEmpInfoDetails();
    }, []);

    const handleIconHover = (data, setShowTooltip, setLoading) => {
      const employee = employeeInfo?.[0] || {};

      getApprovalLogHistoriesById(
        data,
        buId,
        employee?.EmployeeId || employeeId,
        setShowTooltip,
        setLoading
      );
    };

    const permission = useMemo(
      () => permissionList?.find((menu) => menu?.menuReferenceId === 88),
      [permissionList]
    );
    return (
      <WrappedComponent
        propjObj={{
          allData,
          singleData,
          moveHistoryData,
          employeeInfo,
          isEdit,
          isFilter,
          employeeDDL,
          movementTypeDDL,
          loading,
          loadingForInfo,
          open,
          getEmpInfoDetails,
          demoPopupForDelete,
          handleIconHover,
          saveHandler,
          searchData,
          getData,
          setSingleData,
          setIsEdit,
          setIsFilter,
          setEmployeeDDL,
          setMovementTypeDDL,
          setLoading,
          setLoadingForInfo,
          setMoveHistoryData,
          userName,
          intProfileImageUrl,
          employeeId,
          setEmployeeInfo,
          orgId,
          buId,
          setAllData,
          wgId,
          permission,
          isOfficeAdmin,
          empMgmtMoveApplicationDto,
          showTooltip,
          setShowTooltip,
          getMovementHistortyForTable,
        }}
      />
    );
  };

  return HOCMovement;
};

export default withMovementContainer;
