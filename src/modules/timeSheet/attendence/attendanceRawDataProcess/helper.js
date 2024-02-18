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
export const onPostAttendanceResponse = async ({ setLoading, payload, cb }) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/Employee/AttendenceRawDataProcessLog`,
      payload
    );
    if (res?.data) {
      toast.success(res?.data?.message);
      setLoading && setLoading(false);
    }
    cb?.();
  } catch (error) {
    toast.warn("failed");
    setLoading && setLoading(false);
  }
};

export const onGetAttendanceResponse = async (
  wId,
  pageSize,
  pageNo,
  setRes,
  setLoading
) => {
  setLoading && setLoading(true);

  try {
    const res = await axios.get(
      `/Employee/GetAttendenceRawDataProcessLog?intWorkplaceId=${wId}&pageSize=${pageSize}&pageNo=${pageNo}`
    );

    if (res?.data) {
      setRes(res?.data)
    }
    setLoading(false)
  } catch (error) {
    console.log(error);
    setLoading && setLoading(false);
  }
};

export const calcDateDiff = (fDate, tDate) => {
  const difference = moment(tDate).diff(moment(fDate), "days");
  return difference;
};
