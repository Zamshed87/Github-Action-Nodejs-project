import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const useTdsChallanFormFields = () => {
  const {
    profileData: { orgId, buId, wgId, wId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const [bankOrMfsOptions, fetchBankOrMfs, loadingBankOrMfs, setBankOrMfs] =
    useAxiosGet([]);
  const fetchBankMfs = (type = "Bank") => {
    fetchBankOrMfs(`TaxChallan/GetBankOrMFS?type=${type}`, (res) => {
      setBankOrMfs(res?.data);
    });
  };
  useEffect(() => {}, [orgId, buId, wgId, wId]);
  return {
    fetchBankMfs,
    bankOrMfsOptions,
    loadingBankOrMfs,
  };
};

export default useTdsChallanFormFields;
