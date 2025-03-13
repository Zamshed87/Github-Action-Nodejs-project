/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { dateFormatterForInput } from "utility/dateFormatter";
import IConfirmModal from "../IConfirmModal";
import { PeopleDeskSaasDDL, getPeopleDeskAllLanding } from "../api";
import {
  createLeaveApplication,
  getEmployeeLeaveBalanceAndHistory,
} from "./helperAPI";
import {
  empMgmtLeaveApplicationDto,
  getLvePunishmentData,
  initDataForLeaveApplication,
  validationSchemaForLeaveApplication,
} from "./utils";
import { useApiRequest } from "Hooks";
import { todayDate } from "utility/todayDate";

const withLeaveApplication = (WrappedComponent, isAdmin) => {
  const HocLeaveApplication = () => {
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
    // states
    const [allData, setAllData] = useState([]);
    const [singleData, setSingleData] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [imageFile, setImageFile] = useState("");
    const [leaveHistoryData, setLeaveHistoryData] = useState([]);
    const [viewModal, setViewModal] = useState(false);
    const [employeeInfo, setEmployeeInfo] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [isFilter, setIsFilter] = useState(false);
    const [employeeDDL, setEmployeeDDL] = useState([]);
    const [leaveTypeDDL, setLeaveTypeDDL] = useState([]);
    const [leaveBalanceData, setLeaveBalanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadingForInfo, setLoadingForInfo] = useState(false);
    const [casualLvePunishment, setCasualLvePunishment] = useState([]);
    const [medicalLvePunishment, setMedicalLvePunishment] = useState([]);
    const leaveDDLApi = useApiRequest({});
    const balanceApi = useApiRequest({});
    const getLeaveDDL = (id) => {
      leaveDDLApi?.action({
        urlKey: "EmployeeLeaveTypeDDL",
        method: "GET",
        params: {
          employeeId: id,
          date: todayDate(),
          isAdmin: isAdmin,
        },
        onSuccess: (res) => {
          res.forEach((item, idx) => {
            res[idx].value = item?.id;
            res[idx].label = item?.name;
            res[idx].assingendConsumeTypeList?.forEach((it, i) => {
              res[idx].assingendConsumeTypeList[i].value = it?.id;
              res[idx].assingendConsumeTypeList[i].label = it?.name;
            });
          });
          setLeaveTypeDDL(res);
        },
      });
    };
    const balanceInfo = (id) => {
      balanceApi?.action({
        urlKey: "EmployeeLeaveBalanceList",
        method: "GET",
        params: {
          employeeId: id,
          date: todayDate(),
          isAdmin: isAdmin,
        },
        onSuccess: (res) => {
          setLeaveBalanceData(res);
        },
      });
    };
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const handleOpen = () => {
      setViewModal(false);
    };
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    // for view Modal
    const handleViewClose = () => setViewModal(false);

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

    const demoPopupForDelete = (item, values) => {
      const payload = {
        isHalfDay: item?.HalfDay,
        strHalDayRange: item?.HalfDayRange,
        isActive: false,
        // partId: 3,
        yearId: item?.yearId,
        // leavePolicyId: item?.intPolicyId,
        businessUnitId: buId,

        leaveApplicationId: item?.intApplicationId,
        leaveTypeId: item?.LeaveTypeId,
        employeeId: values?.employee ? values?.employee?.value : employeeId,
        // accountId: orgId,
        // applicationDate: item?.ApplicationDate,
        appliedFromDate: item?.AppliedFromDate,
        appliedToDate: item?.AppliedToDate,
        documentFile: item?.DocumentFileUrl ? item?.DocumentFileUrl : 0,
        leaveReason: item?.Reason,
        addressDuetoLeave: item?.AddressDuetoLeave,
        // insertBy: employeeId,
        workplaceGroupId: singleData?.intWorkplaceGroupId || wgId,
        isSelfService: values?.isSelfService,
      };

      const callback = () => {
        getData(values?.employee?.value, values?.year?.value);
      };

      createLeaveApplication(payload, setLoading, callback);
    };

    const demoPopup = (action, values, cb, setLoad) => {
      let payload = {};
      const callback = () => {
        getData(values?.employee?.value, values?.year?.value);
        setSingleData("");
        setIsEdit(false);
        cb();
        setImageFile("");
      };

      if (
        values?.leaveType?.isHalfDayLeave &&
        values?.fromDate === values?.toDate &&
        values?.isHalfDay === ""
      ) {
        toast.error("Please Select Half Day");
        return;
      }
      if (
        values?.leaveType?.isHalfDayLeave &&
        values?.fromDate === values?.toDate &&
        values?.isHalfDay?.label === "Half Day" &&
        values?.halfTime === ""
      ) {
        toast.error("Please Select half Time");
        return;
      }
      payload = {
        isActive: true,
        yearId: values?.year?.value,
        leaveApplicationId: singleData ? singleData?.intApplicationId : 0,
        leaveTypeId: values?.leaveType?.value,
        employeeId: values?.employee ? values?.employee?.value : employeeId,
        businessUnitId: buId,
        appliedFromDate: dateFormatterForInput(values?.fromDate),
        appliedToDate: dateFormatterForInput(values?.toDate),
        documentFile: values?.imageFile?.globalFileUrlId
          ? values?.imageFile?.globalFileUrlId
          : 0,
        leaveReason: values?.reason,
        addressDuetoLeave: values?.location,
        isHalfDay: values?.isHalfDay ? true : false,
        strHalDayRange: values?.isHalfDay ? values?.halfTime : " ",
        workplaceGroupId: singleData?.intWorkplaceGroupId || wgId,
        isSelfService: values?.isSelfService,
      };

      const confirmObject = {
        closeOnClickOutside: false,
        message: `Ready to submit a leave application?`,
        yesAlertFunc: () => {
          if (values?.employee) {
            createLeaveApplication(payload, setLoading, callback, setLoad);
          } else {
            createLeaveApplication(payload, setLoading, callback, setLoad);
          }
        },
        noAlertFunc: () => null,
      };
      IConfirmModal(confirmObject);
    };

    const saveHandler = (values, cb, setLoad) => {
      demoPopup("Apply", values, cb, setLoad);
    };

    const searchData = (keywords, allData, setLeaveHistoryData) => {
      try {
        const regex = new RegExp(keywords?.toLowerCase());
        const newDta = allData?.filter(
          (item) =>
            regex.test(item?.LeaveType?.toLowerCase()) ||
            regex.test(item?.AddressDuetoLeave?.toLowerCase())
        );
        setLeaveHistoryData(newDta);
      } catch {
        setLeaveHistoryData([]);
      }
    };

    const getData = (empId, year) => {
      getLeaveDDL(empId ? empId : employeeId);
      balanceInfo(empId ? empId : employeeId);
      // PeopleDeskSaasDDL(
      //   "EmployeeLeaveType",
      //   wgId,
      //   buId,
      //   setLeaveTypeDDL,
      //   "LeaveTypeId",
      //   "LeaveType",
      //   empId ? empId : employeeId,
      //   0,
      //   year
      // );
      getEmployeeLeaveBalanceAndHistory(
        empId ? empId : employeeId,
        "LeaveHistory",
        setLeaveHistoryData,
        setLoading,
        setAllData,
        year,
        buId,
        wgId
      );

      // This api and leave balance is also used in supervisor dashboard and employee booklet. for any kind of change please consider that.
      // getEmployeeLeaveBalanceAndHistory(
      //   empId ? empId : employeeId,
      //   "LeaveBalance",
      //   setLeaveBalanceData,
      //   setLoading,
      //   "",
      //   year,
      //   buId,
      //   wgId
      // );
      getLvePunishmentData(
        "EmployeeCasualLeavePunishmentData",
        buId,
        empId ? empId : employeeId,
        year || moment().format("YYYY"),
        setLoading,
        setCasualLvePunishment
      );
      getLvePunishmentData(
        "EmployeeMedicalLeavePunishmentData",
        buId,
        empId ? empId : employeeId,
        year || moment().format("YYYY"),
        setLoading,
        setMedicalLvePunishment
      );
    };

    useEffect(() => {
      getData();
      // getPeopleDeskAllDDL(
      //   `/Employee/EmployeeListBySupervisorORLineManagerNOfficeadmin?EmployeeId=${employeeId}&WorkplaceGroupId=${wgId}`,
      //   "intEmployeeBasicInfoId",
      //   "strEmployeeName",
      //   setEmployeeDDL
      // );
    }, [wgId]);

    useEffect(() => {
      getEmpInfoDetails();
    }, []);

    const permission = useMemo(
      () => permissionList?.find((menu) => menu?.menuReferenceId === 87),
      [permissionList]
    );

    return (
      <WrappedComponent
        propjObj={{
          allData,
          singleData,
          anchorEl,
          imageFile,
          leaveHistoryData,
          viewModal,
          employeeInfo,
          isEdit,
          isFilter,
          employeeDDL,
          leaveTypeDDL,
          leaveBalanceData,
          loading,
          progress,
          loadingForInfo,
          open,
          id,
          handleOpen,
          handleClick,
          handleViewClose,
          getEmpInfoDetails,
          demoPopupForDelete,
          demoPopup,
          saveHandler,
          searchData,
          getData,
          setAnchorEl,
          setSingleData,
          setImageFile,
          setViewModal,
          setIsEdit,
          setIsFilter,
          setEmployeeDDL,
          setLeaveTypeDDL,
          setLeaveBalanceData,
          setLoading,
          setProgress,
          setLoadingForInfo,
          setLeaveHistoryData,
          userName,
          intProfileImageUrl,
          initDataForLeaveApplication,
          validationSchemaForLeaveApplication,
          employeeId,
          setEmployeeInfo,
          orgId,
          buId,
          setAllData,
          wgId,
          permission,
          isOfficeAdmin,
          // demoPopupForDeleteAdmin,
          empMgmtLeaveApplicationDto,
          casualLvePunishment,
          medicalLvePunishment,
        }}
      />
    );
  };
  return HocLeaveApplication;
};
export default withLeaveApplication;
