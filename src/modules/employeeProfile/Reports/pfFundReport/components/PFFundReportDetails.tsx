import { DataTable, PButton } from "Components";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import { formatFilterValueList } from "utility/filter/helper";
import { getHeader } from "../helper";
import React, { useEffect } from "react";
import { FileExcelOutlined } from "@ant-design/icons";
import { downloadFile } from "utility/downloadFile";
import Loading from "common/loading/Loading";

type TPFFundReport = { form: any, data: any };
const PFFundReportDetails: React.FC<TPFFundReport> = ({ form, data }) => {
  // Data From Store
  const { orgId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const { tokenData } = useSelector((state: any) => state?.auth, shallowEqual);

  const decodedToken = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : null;
  const [loading, setLoading] = React.useState(false);
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
    <>
      {loading && <Loading />}
      <div className="d-flex justify-content-end">
        <PButton
          icon={<FileExcelOutlined />}
          type="primary"
          onClick={() => {
            const values = form.getFieldsValue();

            downloadFile(
              "/PdfAndExcelReport/DownloadEmployeeWisePfFundDetails",
              "EmployeeWisePfFundDetails",
              "xlsx",
              setLoading,
              "POST",
              {
                intAccountId: orgId,
                intEmployeeId: data?.employeeId ?? 0,
                isCurrentFund: false,
                status: values?.status?.value,
                pageNo: 1,
                pageSize: 1000000,
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
              }
            )
          }}
          className="mb-2"
          content="Download"
        />
      </div>
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
        scroll={{ x: 1800 }}
        onChange={(pagination, filters, sorter, extra) => {
          if (extra.action === "sort") return;
          landingApi({
            pagination,
            filerList: filters,
          });
        }}
      />
    </>
  );
};

export default PFFundReportDetails;
