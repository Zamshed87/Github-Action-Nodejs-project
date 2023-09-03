import axios from "axios";
import { toast } from "react-toastify";

export const getAllLoanApplicatonListDataForApproval = async (
    payload,
    setter,
    setAllData,
    setFilterData,
    setLoading,
  ) => {
    setLoading && setLoading(true);
    try {
      const res = await axios.post(
        `/ApprovalPipeline/LoanApplicationLanding`,
        payload
      );
      if (res?.data) {
        setAllData && setAllData(res?.data);
        setter(res?.data);
        setFilterData && setFilterData(res?.data)
      }
      // cb && cb();
      setLoading && setLoading(false);
    } catch (error) {
      setter([]);
      setFilterData([])
      setLoading && setLoading(false);
    }
  };
  
  export const loanApproveReject = async (payload, cb) => {
    try {
      const res = await axios.post(
        `/ApprovalPipeline/LoanApplicationApproval`,
        payload
      );
      cb && cb();
      toast.success(res?.data || "Submitted Successfully");
    } catch (error) {
      toast.warn(error?.response?.data?.message || "Something went wrong");
    }
  };