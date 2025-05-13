import { useState } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const useAbsentPunishment = (form) => {
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [data, getData, loading, setData] = useAxiosGet({});

  const fetchAbsentPunishment = () => {
    const formValues = form?.getFieldsValue(true);

    const formattedParams = {
      IntWorkPlaceGroupId: formValues.workplaceGroup?.value,
      IntWorkPlaceId: formValues.workplace?.value,
      IntEmploymentTypeId: formValues.employmentType?.value,
      StrStatus: formValues.status,
    };

    const filteredParams = Object.entries(formattedParams)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const url = `/BenefitPolicy/GetPolicies?${filteredParams}`;

    getData(url, (res) => {
      setData(res);
    });
  };

  return { data, fetchAbsentPunishment, loading, pages, setPages };
};

export default useAbsentPunishment;
