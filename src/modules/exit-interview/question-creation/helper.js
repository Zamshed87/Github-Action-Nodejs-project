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
