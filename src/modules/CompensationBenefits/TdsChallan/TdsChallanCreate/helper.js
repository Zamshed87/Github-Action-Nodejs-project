import axios from "axios";
import { toast } from "react-toastify";

export const createUpdateTdsChallan = async (payload, setLoading, resetData, update=false) => {
  setLoading?.(true);
  try {
    const res = await axios.post(
      `/TaxChallan/${update? 'Update':'Save'}
`,
      payload
    );
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading?.(false);
    resetData?.();
  } catch (error) {
    toast.error(error?.response?.data?.data?.[0]?.errorMessage || "Something went wrong");
    setLoading?.(false);
  }
};
export const getTaxChallan = async (id, setLoading, setData, form) => {
  setLoading?.(true);
  try {
    const res = await axios.get(`/TaxChallan/GetById?headerId=${id}
`);
    let details = res?.data?.data;
    setLoading?.(false);
    form.setFieldsValue({
      ListOfFiscalYear: {
        label: details?.header?.strFiscalYear,
        value: details?.header?.intFiscalYearId,
      },
      ListOfWorkplace: {
        label: details?.header?.strWorkplace,
        value: details?.header?.intWorkplaceId,
      },
    });
    setData?.(res?.data?.data?.rows);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    setLoading?.(false);
  }
};
