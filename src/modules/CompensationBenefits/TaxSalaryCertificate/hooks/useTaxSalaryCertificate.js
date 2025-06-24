import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const useTaxSalaryCertificate = (form) => {
  const { wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [data, getData, loading, setData] = useAxiosGet({});

  const fetchTaxSalaryCertificates = () => {
    const formValues = form?.getFieldsValue(true);

    const formattedParams = {
      StrListOfFiscalYear: formValues.ListOfFiscalYear,
      StrListOfWorkplace: formValues.ListOfWorkplace,
      StrListOfDepartment: formValues.ListOfDepartment,
      StrListOfEmployee: formValues.ListOfEmployee,
    };

    const filteredParams = Object.entries(formattedParams)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const url = `/TaxReport/GetTaxInfo?${filteredParams}`;

    getData(url, (res) => {
      setData(res);
    });
  };

  useEffect(() => {
    fetchTaxSalaryCertificates();
  }, [wgId, wId]);

  return { data, setData, fetchTaxSalaryCertificates, loading, pages, setPages };
};

export default useTaxSalaryCertificate;
