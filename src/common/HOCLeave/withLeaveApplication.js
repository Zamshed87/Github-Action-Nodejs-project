/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import IConfirmModal from "../IConfirmModal";
import { PeopleDeskSaasDDL, getPeopleDeskAllLanding } from "../api";
import {
  approveEditLeaveApplication,
  createLeaveApplication,
  deleteLeaveApplication,
  getEmployeeLeaveBalanceAndHistory,
} from "./helperAPI";
import {
  empMgmtLeaveApplicationDtoColumn,
  initDataForLeaveApplication,
  validationSchemaForLeaveApplication,
} from "./utils";

const withLeaveApplication = (WrappedComponent) => {
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
        partId: 3,
        yearId: item?.yearId,
        leavePolicyId: item?.intPolicyId,
        leaveApplicationId: item?.intApplicationId,
        leaveTypeId: item?.LeaveTypeId,
        employeeId: values?.employee ? values?.employee?.value : employeeId,
        accountId: orgId,
        businessUnitId: buId,
        applicationDate: item?.ApplicationDate,
        appliedFromDate: item?.AppliedFromDate,
        appliedToDate: item?.AppliedToDate,
        documentFile: item?.DocumentFileUrl ? item?.DocumentFileUrl : 0,
        leaveReason: item?.Reason,
        addressDuetoLeave: item?.AddressDuetoLeave,
        insertBy: employeeId,
        workplaceGroupId: wgId,
      };

      const callback = () => {
        getData(values?.employee?.value, values?.year?.value);
      };

      let confirmObject = {
        closeOnClickOutside: false,
        message: "Are you want to sure you delete your leave?",
        yesAlertFunc: () => {
          createLeaveApplication(payload, setLoading, callback);
        },
        noAlertFunc: () => {
          //   history.push("/components/dialogs")
        },
      };
      IConfirmModal(confirmObject);
    };
    const demoPopupForDeleteAdmin = (item, values) => {
      const callback = () => {
        getData(values?.employee?.value, values?.year?.value);
      };

      const confirmObject = {
        closeOnClickOutside: false,
        message: "Are you want to sure you delete this leave?",
        yesAlertFunc: () => {
          deleteLeaveApplication(values, item, setLoading, callback);
        },
        noAlertFunc: () => {
          //   history.push("/components/dialogs")
        },
      };
      IConfirmModal(confirmObject);
    };

    const demoPopup = (action, values, cb) => {
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
      if (singleData?.ApprovalStatus === "Approved" && isOfficeAdmin) {
        payload = {
          intEmployeeId: values?.employee
            ? values?.employee?.value
            : employeeId,
          intApplicationId: singleData?.intApplicationId,
          intLeaveTypeId: values?.leaveType?.value,
          fromDate: values?.fromDate,
          toDate: values?.toDate,
          intActionBy: employeeId,
          strApprovalRemarks: "By office Admin",
        };
      } else {
        payload = {
          isActive: true,
          yearId: values?.year?.value,
          leavePolicyId: values?.leaveType?.intPolicyId,
          partId: singleData?.intApplicationId ? 2 : 1,
          leaveApplicationId: singleData ? singleData?.intApplicationId : 0,
          leaveTypeId: values?.leaveType?.value,
          employeeId: values?.employee ? values?.employee?.value : employeeId,
          accountId: orgId,
          businessUnitId: buId,
          applicationDate: new Date(),
          appliedFromDate: values?.fromDate,
          appliedToDate: values?.toDate,
          documentFile: imageFile ? imageFile?.globalFileUrlId : 0,
          leaveReason: values?.reason,
          addressDuetoLeave: values?.location,
          insertBy: employeeId,
          isHalfDay: values?.isHalfDay?.label === "Half Day" ? true : false,
          strHalDayRange: values?.halfTime?.label
            ? values?.halfTime?.label
            : " ",
          workplaceGroupId: singleData?.intWorkplaceGroupId || wgId,
        };
      }

      const confirmObject = {
        closeOnClickOutside: false,
        message: `Do you want to ${action} ?`,
        yesAlertFunc: () => {
          if (singleData?.ApprovalStatus === "Approved" && isOfficeAdmin) {
            approveEditLeaveApplication(payload, setLoading, callback);
          } else {
            createLeaveApplication(payload, setLoading, callback);
          }
        },
        noAlertFunc: () => null,
      };
      IConfirmModal(confirmObject);
    };

    const saveHandler = (values, cb) => {
      demoPopup("Apply", values, cb);
    };

    const searchData = (keywords, allData, setLeaveHistoryData) => {
      try {
        const regex = new RegExp(keywords?.toLowerCase());
        let newDta = allData?.filter(
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
      PeopleDeskSaasDDL(
        "EmployeeLeaveType",
        wgId,
        buId,
        setLeaveTypeDDL,
        "LeaveTypeId",
        "LeaveType",
        empId ? empId : employeeId,
        0,
        year
      );
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
      getEmployeeLeaveBalanceAndHistory(
        empId ? empId : employeeId,
        "LeaveBalance",
        setLeaveBalanceData,
        setLoading,
        "",
        year,
        buId,
        wgId
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
          empMgmtLeaveApplicationDtoColumn,
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
          demoPopupForDeleteAdmin,
        }}
      />
    );
  };
  return HocLeaveApplication;
};
export default withLeaveApplication;
