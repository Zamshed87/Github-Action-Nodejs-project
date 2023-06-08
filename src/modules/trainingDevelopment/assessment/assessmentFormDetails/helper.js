import axios from "axios";

export const getSingleSchedule = async (
  setter,
  setLoading,
  orgId,
  buId,
  id,
  cb
) => {
  setLoading?.(true);
  try {
    const res = await axios.get(
      `/Training/GetTrainingAssessmentLanding?intTrainingId=${id}&intAccountId=${orgId}&intBusinessUnitId=${buId}`
    );

    setter?.(res?.data[0]);
    cb?.(res?.data[0]);
    setLoading?.(false);
  } catch (error) {
    setLoading?.(false);
  }
};
