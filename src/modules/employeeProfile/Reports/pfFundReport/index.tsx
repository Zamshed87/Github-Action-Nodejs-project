import React, { useEffect } from "react";
import { Col, Form, Row } from "antd";
import {
  DataTable,
  PButton,
  PCard,
  PCardHeader,
  PForm,
  PSelect,
} from "Components";
import PBadge from "Components/Badge";
import { useApiRequest } from "Hooks";
import { getSerial } from "Utils";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";

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

  const [form] = Form.useForm();

  // Api Actions
  const pfFundReportApi = useApiRequest({});
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
    },
    {
      title: "Employee Amount",
      dataIndex: "employeeContributionAmount",
      align: "right",
    },
    {
      title: "Employer Amount",
      dataIndex: "companyContributionAmount",
      align: "right",
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
          <PBadge type="warning" text="Inactive" />
        ) : (
          "N/A"
        ),
      width: "50px",
    },
  ];

  return pfFundReportFeature?.isView ? (
    <>
      <PForm form={form}>
        <PCard>
          <PCardHeader title="PF Fund Report" />
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
                }}
                label="Status"
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
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default PFFundReport;
