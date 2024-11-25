import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";

export const createLetterType = async (
  qId,
  fieldsArr,
  values,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const payload = {
      id: qId,
      startDateTime: values?.startTime,
      endDateTime: moment().format("YYYY-MM-DDTHH:mm:ss"),
      questions: fieldsArr.map((field) => {
        const fieldId = `field-${field.id}`;
        const answer = values[fieldId];

        return {
          id: field.id,
          answer: field.typeName === "Checkbox" ? answer : [answer] || [],
        };
      }),
    };

    const res = await axios.post(`/Questionnaire/SendResponse`, payload);
    cb && cb();
    toast.success(res?.data?.Message, { toastId: 1 });
  } catch (error) {
    toast.warn(error?.response?.data?.Message || "Something went wrong", {
      toastId: 1,
    });
  } finally {
    setLoading(false);
  }
};
