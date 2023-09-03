import axios from "axios";
import { toast } from "react-toastify";

export const getAllRequisitionListDataForApproval = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/TrainingRequisitionLandingEngine`,
      payload
    );
    if (res?.data) {
      const modifyData={
        ...res?.data,
        listData:res?.data?.listData?.map(item=>{
          return{
          ...item,
          strTraining:item?.application?.strTrainingName
        }
        })
      }
      setAllData && setAllData(modifyData);
      setter(modifyData);
    }
    // cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const RequisitionApproveReject = async (payload, cb) => {
  
  try {
    const res = await axios.post(
      `/ApprovalPipeline/TrainingRequisitionApprovalEngine`,
      payload
    );
    cb && cb();
    toast.success(res?.data || "Submitted Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};
