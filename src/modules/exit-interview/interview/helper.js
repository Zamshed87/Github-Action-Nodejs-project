import axios from "axios";
import { toast } from "react-toastify";

export const getQuestionaireById = async (id, setData, setLoading, setOpen) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(`/Questionnaire/AssignedTo/${id}`);
    setData(res.data);
    setOpen && setOpen(true);
  } catch (error) {
    toast.warning("Something went wrong");
  } finally {
    setLoading && setLoading(false);
  }
};
