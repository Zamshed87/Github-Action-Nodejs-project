import axios from "axios";
import { toast } from "react-toastify";

export const getSingleQuestionnaire = async (
  id,
  setData,
  setLoading,
  setOpen
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(`/Questionnaire/${id}`);
    setData(res.data);
    setOpen && setOpen(true);
  } catch (error) {
    toast.warning("Something went wrong");
  } finally {
    setLoading && setLoading(false);
  }
};

export const assignToEmployee = async (id, empId, setData, setLoading) => {
  setLoading && setLoading(true);
  const payload = {
    questionnaireId: id,
    employeeBasicInfoId: empId,
  };
  try {
    const res = await axios.post(`/Questionnaire/Assign`, payload);
    setData(null);
    toast.success(res?.data?.Message || "Successfully Assigned");
  } catch (res) {
    toast.warning(res?.data?.Message || "Something went wrong");
  } finally {
    setLoading && setLoading(false);
  }
};
