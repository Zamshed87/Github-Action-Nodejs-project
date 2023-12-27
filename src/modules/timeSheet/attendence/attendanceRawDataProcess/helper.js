import axios from "axios";
import moment from "moment";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

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

export const onGetAttendanceResponse = async ({
  setRes,
  orgId,
  employeeId,
  fromDate,
  toDate,
  setLoading,
}) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/GetAttendanceProcessData?accountId=${orgId}&employeeId=${employeeId}&fromDate=${fromDate}&toDate=${toDate}`
    );
    if (res?.data) {
      setRes(res?.data?.message);
      setLoading && setLoading(false);
    }
  } catch (error) {
    // to track error linear progress, the value should not be blank in res state
    setRes("failed");
    setLoading && setLoading(false);
  }
};

export const calcDateDiff = (fDate, tDate) => {
  const difference = moment(tDate).diff(moment(fDate), "days");
  return difference;
};
