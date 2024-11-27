import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
// import { erpBaseUrl } from "../../../../common/ErpBaseUrl";

export const quaterDDL = [
  { value: 1, label: "Q1" },
  { value: 2, label: "Q2" },
  { value: 3, label: "Q3" },
  { value: 4, label: "Q4" },
];

export const initData = {
  activity: "",
  frequencyDDL: {
    label: "Daily",
    value: 1,
  },
  priorityDDL: {
    label: "Do First (1)",
    value: 1,
    name: "Do First",
  },
  quarterDDLgroup: "",
  yearDDLgroup: "",
  priorityActivityList: [],
  coreValuesComment: "",
  coreCompetencyComment: "",
};

export const validationSchema = Yup.object().shape({
  quarterDDLgroup: Yup.object()
    .shape({
      label: Yup.string().required("Quarter is required"),
      value: Yup.string().required("Quarter is required"),
    })
    .typeError("Quarter is required"),
  yearDDLgroup: Yup.object()
    .shape({
      label: Yup.string().required("Priority is required"),
      value: Yup.string().required("Priority is required"),
    })
    .typeError("Year is required"),
});

export const getEisenhowerMatrixValue = async (
  employeeId,
  yearId,
  quarterId,
  setLoading,
  setRowDto
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/pms/PerformanceMgmt/GetEisenhowerMatrix?EmployeeId=${employeeId}&YearId=${yearId}&QuarterId=${quarterId}`
    );
    setLoading && setLoading(false);
    if (res?.data) {
      setRowDto && setRowDto(res?.data);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getYearDDL = async (accId, setYearDDl) => {
  const res = await axios.get(
    `/PMS/YearDDL?AccountId=${accId}&BusinessUnitId=4`
  );

  if (res?.data) {
    setYearDDl && setYearDDl(res?.data);
  }
};

export const addWorkPlan = async (payload, cb, setDisabled) => {
  try {
    setDisabled && setDisabled(true);
    const res = await axios.post(`/PMS/PMSWorkPlanCreateAndEdit`, payload);
    setDisabled && setDisabled(false);
    if (res.status === 200) {
      toast.success("Created successfully");
      cb();
    }
  } catch (error) {
    setDisabled && setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

export const workPlan_landing_api = async (
  employeeId,
  yearId,
  quarterId,
  setter,
  setLoading,
  initData,
  setFieldValue,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/PMS/GetWorkPlanRowGrid?EmployeeId=${employeeId}&YearId=${yearId}&QuarterId=${quarterId}`
    );
    if (res.status === 200 && res.data) {
      const modifiedData = res?.data?.row?.map((item) => {
        return {
          ...item,
          isDisabled: true,
        };
      });
      const modifiedValuesCompetencies = res?.data?.valuesCompetencies?.map(
        (item) => {
          return {
            ...item,
            value: item?.intValueOrCompetencyId,
            label: item?.strValueOrCompetencyName,
          };
        }
      );
      const filteredCommentForCoreValues = modifiedValuesCompetencies?.filter(
        (item) => item?.isCompetency === false
      );
      const filteredCommentForCoreCompetency =
        modifiedValuesCompetencies?.filter(
          (item) => item?.isCompetency === true
        );
      initData = {
        ...initData,
        coreValuesComment: filteredCommentForCoreValues[0]?.comments || "",
        coreCompetencyComment:
          filteredCommentForCoreCompetency[0]?.comments || "",
      };
      setFieldValue &&
        setFieldValue("coreValuesComment", initData?.coreValuesComment);
      setFieldValue &&
        setFieldValue("coreCompetencyComment", initData?.coreCompetencyComment);
      setter({
        ...res.data,
        row: modifiedData || [],
        valuesCompetencies: modifiedValuesCompetencies || [],
      });
      setLoading(false);
      cb?.();
    }
  } catch (error) {
    setLoading(false);
  }
};

export const commonYearDDL = async (setLoading, setter, buId, orgId) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/PMS/YearDDL?AccountId=${orgId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getCoreValuesDDL = async (setLoading, setter, buId, orgId) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=CoreValues&AccountId=${orgId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getCoreCompetencyDDL = async (setLoading, setter, buId, orgId) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=CoreCompetency&AccountId=${orgId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};
