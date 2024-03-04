/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { toast } from "react-toastify";
import { todayDate } from "../../../utility/todayDate";

export const getOffDayAssignLanding = async (
  partType,
  buId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/emp/EmployeeTimeSheet/TimeSheetAllLanding?PartType=${partType}&BuninessUnitId=${buId}`
    );
    if (res?.data) {
      setter(res?.data?.Result);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const offdayAssignCrud = async (obj) => {
  const {
    values,
    orgId,
    buId,
    employeeId,
    offDaylanding,
    isMulti,
    singleData,
    setLoading,
    cb,
  } = obj;

  try {
    if (!values?.effectiveDate) return toast.warn("Effective date is required");

    const commonObj = {
      accountId: orgId,
      businessUnitId: buId,
      workplaceGroupId: 0, // question
      isActive: true,
      IntCreatedBy: employeeId,
      insertDateTime: todayDate(),
      updateByUserId: "",
      updateDateTime: todayDate(),
    };

    let payload = [];

    if (isMulti) {
      offDaylanding?.forEach((item) => {
        if (item?.selectCheckbox) {
          payload.push({
            ...values,
            employeeId: item?.EmployeeId,
            ...commonObj,
            employeeOffdayAssignId: item?.intEmployeeOffdayAssignId,
          });
        }
      });
    } else {
      payload = [
        {
          ...values,
          employeeId: singleData?.EmployeeId,
          ...commonObj,
          employeeOffdayAssignId: singleData?.intEmployeeOffdayAssignId || 0,
        },
      ];
    }
    setLoading(true);
    setLoading(false);
    cb();
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success("Submitted Successfully");
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};

export const getOffDayLanding = async (
  depId,
  desId,
  supId,
  emTypId,
  empId,
  workId,
  buId,
  orgId,
  setter,
  setLoading,
  setAllData,
  isAssigned = false
) => {
  const printDays = (item) => {
    const data = [];
    item?.isFriday && data.push("Friday");
    item?.isSaturday && data.push("Saturday");
    item?.isSunday && data.push("Sunday");
    item?.isMonday && data.push("Monday");
    item?.isTuesday && data.push("Tuesday");
    item?.isWednesday && data.push("Wednesday");
    item?.isThursday && data.push("Thursday");

    let str = "";
    data.forEach((item, index) => {
      str = str + `${index > 0 ? ", " : ""}` + item;
    });
    return str;
  };

  try {
    setLoading(true);
    const payload = {
      departmentId: depId || 0,
      designationId: desId || 0,
      supervisorId: supId || 0,
      employmentTypeId: emTypId || 0,
      employeeId: empId || 0,
      workplaceGroupId: workId || 0,
      isAssigned: isAssigned,
      businessUnitId: buId,
      accountId: orgId,
    };
    const res = await axios.post("/Employee/OffdayLandingFilter", payload);
    if (res?.data) {
      const newData = res?.data?.map((item) => {
        return {
          ...item,
          offDayList:
            !item?.isFriday &&
            !item?.isSaturday &&
            !item?.isSunday &&
            !item?.isMonday &&
            !item?.isThursday &&
            !item?.isTuesday &&
            !item?.isWednesday
              ? "N/A"
              : printDays(item),
          offDay:
            item?.isFriday ||
            item?.isSaturday ||
            item?.isSunday ||
            item?.isMonday ||
            item?.isThursday ||
            item?.isTuesday ||
            item?.isWednesday,
        };
      });
      setAllData && setAllData(newData);
      setter(newData);
      setLoading(false);
    }
    // toast.success(res?.data?.message || "Submitted Successfully");
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};
