import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import * as Yup from "yup";

export const initialValues = {
  fromDate: "",
  toDate: "",
  employee: "",
};

export const ErrorLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: "16px",
  width: "50%",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#b42318",
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: "#b42318",
  },
}));

export const validationSchema = Yup.object().shape({
  fromDate: Yup.string().required("From date is required"),
  toDate: Yup.string().required("To date is required"),
});

// export const onGetAttendanceResponse = async ({
//   setRes,
//   orgId,
//   employeeId,
//   fromDate,
//   toDate,
//   setLoading,
// }) => {
//   setLoading && setLoading(true);
//   try {
//     const res = await axios.get(
//       `/Employee/GetAttendanceProcessData?accountId=${orgId}&employeeId=${employeeId}&fromDate=${fromDate}&toDate=${toDate}`
//     );
//     if (res?.data) {
//       setRes(res?.data?.message);
//       setLoading && setLoading(false);
//     }
//   } catch (error) {
//     // to track error linear progress, the value should not be blank in res state
//     setRes("failed");
//     setLoading && setLoading(false);
//   }
// };

// new from business requirement
export const onPostBridgeResponse = async ({
  setRes,
  setLoading,
  values,
  wId,
}) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/Employee/BridgeLeaveProcess?fromDate=${values?.fromDate}&toDate=${
        values?.toDate
      }&EmployeeId=${values?.employee?.value || 0}&workplaceId=${wId || 0}`
    );
    console.log("response", res);
    if (res?.data) {
      toast.success(res?.data?.Message);
      setLoading && setLoading(false);
    }
  } catch (error) {
    toast.warn("failed");
    setLoading && setLoading(false);
  }
};

export const onGetAttendanceResponse = async (
  wId,
  wgId,
  pageSize,
  pageNo,
  setRes,
  setLoading,
  setPages
) => {
  setLoading && setLoading(true);

  try {
    const res = await axios.get(
      `/Employee/GetAttendenceRawDataProcessLog?intWorkplaceId=${wId}&intWorkplaceGroupId=${wgId}&pageSize=${pageSize}&pageNo=${pageNo}`
    );
    if (res?.data) {
      setRes(res?.data);
      setPages?.({
        current: res?.data?.currentPage,
        pageSize: res?.data?.pageSize, // Page Size From Api Response
        total: res?.data?.totalCount,
      });
    }
    setLoading(false);
  } catch (error) {
    console.log(error);
    setLoading && setLoading(false);
  }
};

export const calcDateDiff = (fDate, tDate) => {
  const difference = moment(tDate).diff(moment(fDate), "days");
  return difference;
};
