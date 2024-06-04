import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "antd";
import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PRadio,
  PSelect,
} from "Components";
import PBadge from "Components/Badge";
import { useApiRequest } from "Hooks";
import { getSerial } from "Utils";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { formatMoney } from "utility/formatMoney";

type TPFFundReport = {};
const PFFundReport: React.FC<TPFFundReport> = () => {
  const dispatch = useDispatch();
  // Data From Store
  const { buId, wgId, wId, intEmployeeId, orgId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  let pfFundReportFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30414) {
      pfFundReportFeature = item;
    }
  });

  //State
  const [elementType, setElementType] = useState<any>("");

  const [form] = Form.useForm();

  // Api Actions
  const pfFundReportApi = useApiRequest([]);
  const employeeDDLApi = useApiRequest([]);

  // Landing Api
  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any[];
    searchText?: string;
  };
  const landingApi = async ({
    pagination = {},
    filerList = [],
    searchText = "",
  }: TLandingApi = {}) => {
    await form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        pfFundReportApi.action({
          urlKey: "RefundOrEarningReport",
          method: "get",
          params: {
            intAccountId: orgId,
            intEmployeeId: values?.employeeName?.value,
            isCurrentFund:
              values?.elementType === "currentTotalFund" ? true : false,
            status: values?.status?.value,
            pageNo: pagination?.current || 1,
            pageSize: pagination?.pageSize || 25,
          },
        });
      })
      .catch((err) => {});
  };

  const employeeDDL = () => {
    employeeDDLApi.action({
      method: "get",
      urlKey: "EmployeeDDLWithCode",
      params: {
        EmployeeId: intEmployeeId,
        businessUnitId: buId,
        WorkplaceGroupId: wgId,
      },
      onSuccess: (res: any) => {
        const employeeList = res.map((item: any) => ({
          ...item,
          label: `${item?.strEmployeeName} - ${item?.strEmployeeCode}`,
          value: item?.intEmployeeBasicInfoId,
        }));

        // Add the "All" value
        employeeList.unshift({ value: 0, label: "All" });

        // Assuming you need to set the modified result back to the response
        res.splice(0, res.length, ...employeeList);
      },
    });
  };

  // Life Cycle Hooks
  useEffect(() => {
    employeeDDL();
    document.title = "PF Fund Report";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Table Header
  const header: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) =>
        getSerial({
          currentPage: pfFundReportApi?.data?.currentPage,
          pageSize: pfFundReportApi?.data?.pageSize,
          index,
        }),

      align: "center",
      width: 20,
    },
    {
      title: "Enroll ID",
      dataIndex: "employeeId",
      sorter: true,
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      sorter: true,
    },
    {
      title: "Code",
      dataIndex: "employeeCode",
      sorter: true,
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      sorter: true,
    },
    {
      title: "Designation",
      dataIndex: "designationName",
      sorter: true,
    },
    {
      title: "Type",
      dataIndex: "types",
      width: 100,
      isHidden: elementType === "currentTotalFund",
    },
    {
      title: "Employee Amount",
      dataIndex: "employeeContributionAmount",
      align: "right",
      render: (data: any, record: any) =>
        formatMoney(record?.employeeContributionAmount),
    },
    {
      title: "Employer Amount",
      dataIndex: "companyContributionAmount",
      align: "right",
      render: (data: any, record: any) =>
        formatMoney(record?.companyContributionAmount),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (data: any, record: any) =>
        // Write condition to check status
        record?.status ? (
          <PBadge type="success" text="Active" />
        ) : record?.status === false ? (
          <PBadge type="danger" text="Inactive" />
        ) : (
          "N/A"
        ),
      width: "50px",
    },
  ].filter((item) => !item?.isHidden);

  return pfFundReportFeature?.isView ? (
    <PForm form={form}>
      <PCard>
        <PCardHeader title="PF Fund Report" />
        <PCardBody className="my-3">
          <Row gutter={[10, 2]} className="pb-2">
            <Col md={6} sm={24}>
              <PSelect
                name="employeeName"
                placeholder="Employee Name"
                allowClear={true}
                showSearch={true}
                rules={[
                  { required: true, message: "Employee Name Is Required" },
                ]}
                onChange={(value: any, option: any) => {
                  form.setFieldsValue({
                    employeeName: option,
                  });
                  pfFundReportApi.reset();
                }}
                options={employeeDDLApi?.data || []}
                label="Employee Name"
              />
            </Col>
            <Col md={6} sm={24}>
              <PSelect
                name="status"
                placeholder="Status"
                allowClear={true}
                showSearch={true}
                rules={[{ required: true, message: "Status Is Required" }]}
                options={[
                  { label: "All", value: 0 },
                  { label: "Active", value: 1 },
                  { label: "Inactive", value: 2 },
                ]}
                onChange={(value: any, option: any) => {
                  form.setFieldsValue({
                    status: option,
                  });
                  pfFundReportApi.reset();
                }}
                label="Status"
              />
            </Col>
            <Col className="mt-3 pt-1">
              <PRadio
                name="elementType"
                type="group"
                rules={[
                  { required: true, message: "Please Select Element Type" },
                ]}
                options={[
                  {
                    label: "Current Total Fund",
                    value: "currentTotalFund",
                  },
                  {
                    label: "Fund Details",
                    value: "fundDetails",
                  },
                ]}
                onChange={(e: any) => {
                  const value = e.target.value;
                  setElementType(value);
                  form.setFieldsValue({
                    elementType: value,
                  });
                  pfFundReportApi.reset();
                }}
              />
            </Col>
            <Col style={{ marginTop: "23px" }}>
              <PButton
                type="primary"
                content="View"
                onClick={() => {
                  landingApi();
                }}
              ></PButton>
            </Col>
          </Row>
        </PCardBody>
        <DataTable
          header={header}
          bordered
          data={pfFundReportApi?.data?.data || []}
          pagination={{
            current: pfFundReportApi?.data?.currentPage, // Current Page From Api Response
            pageSize: pfFundReportApi?.data?.pageSize, // Page Size From Api Response
            total: pfFundReportApi?.data?.totalCount, // Total Count From Api Response
          }}
          loading={pfFundReportApi?.loading}
          scroll={{ x: 1000 }}
          onChange={(pagination, filters, sorter, extra) => {
            if (extra.action === "sort") return;
            landingApi({
              pagination,
              filerList: filters,
            });
          }}
        />
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default PFFundReport;
