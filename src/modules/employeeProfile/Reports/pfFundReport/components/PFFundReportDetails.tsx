import { DataTable } from "Components";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import { formatFilterValueList } from "utility/filter/helper";
import { getHeader } from "../helper";
import React, { useEffect } from "react";

type TPFFundReport = { form: any, data: any };
const PFFundReportDetails: React.FC<TPFFundReport> = ({ form, data }) => {
  console.log(data);
  // Data From Store
  const { orgId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const { tokenData } = useSelector((state: any) => state?.auth, shallowEqual);

  const decodedToken = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : null;

  // Api Actions
  const pfFundReportApi = useApiRequest([]);

  // Landing Api
  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any[];
    searchText?: string;
    isCurrentFund?: boolean;
  };
  const landingApi = async ({
    pagination = {},
    filerList = [],
    searchText = "",
    isCurrentFund = false,
  }: TLandingApi = {}) => {
    await form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        pfFundReportApi.action({
          urlKey: "RefundOrEarningReport",
          method: "post",
          payload: {
            intAccountId: orgId,
            intEmployeeId: data?.employeeId ?? 0,
            isCurrentFund: isCurrentFund,
            status: values?.status?.value,
            pageNo: pagination?.current || 1,
            pageSize: pagination?.pageSize || 25,
            departmentIdList: formatFilterValueList(values?.department) || [0],
            designationIdList: formatFilterValueList(values?.designation) || [
              0,
            ],
            WorkplaceGroupList:
              values?.workplaceGroup?.value == 0 ||
              values?.workplaceGroup?.value == undefined
                ? decodedToken.workplaceGroupList
                : values?.workplaceGroup?.value.toString(),
            WorkplaceList:
              values?.workplace?.value == 0 ||
              values?.workplace?.value == undefined
                ? decodedToken.workplaceList
                : values?.workplace?.value.toString(),
          },
        });
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  useEffect(() => {
    landingApi();
  }, []);

  return (
    <DataTable
      header={getHeader(pfFundReportApi, false)}
      bordered
      data={pfFundReportApi?.data?.data || []}
      pagination={{
        current: pfFundReportApi?.data?.currentPage, // Current Page From Api Response
        pageSize: pfFundReportApi?.data?.pageSize, // Page Size From Api Response
        total: pfFundReportApi?.data?.totalCount, // Total Count From Api Response
      }}
      loading={pfFundReportApi?.loading}
      scroll={{ x: 1500 }}
      onChange={(pagination, filters, sorter, extra) => {
        if (extra.action === "sort") return;
        landingApi({
          pagination,
          filerList: filters,
        });
      }}
    />
  );
};

export default PFFundReportDetails;
