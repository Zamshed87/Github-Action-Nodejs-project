/* eslint-disable @typescript-eslint/no-empty-function */
import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PSelect,
  TableButton,
} from "Components";

import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { todayDate } from "utility/todayDate";
import moment from "moment";
import { PModal } from "Components/Modal";
import CommonEmpInfo from "common/CommonEmpInfo";
import { orgIdsForBn } from "utility/orgForBanglaField";

export const SecurityMoneyReportLanding = () => {
  const dispatch = useDispatch();

  const {
    permissionList,
    profileData: { buId, orgId, wgId, wId, intAccountId },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30555),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  const empDepartmentDDL = useApiRequest({});
  const detailsApi = useApiRequest({});
  const empSectionDDL = useApiRequest([]);

  const CommonEmployeeDDL = useApiRequest([]);

  const getEmployee = (value: any = "") => {
    // if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };

  // section wise ddl
  const getEmployeeSection = () => {
    const { department } = form.getFieldsValue(true);
    empSectionDDL?.action({
      urlKey: "SectionIdAll",
      method: "GET",
      params: {
        accountId: intAccountId,
        businessUnitId: buId,
        departmentId: department?.value || 0,
        workplaceGroupId: wgId,
        workplaceId: wId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label =
            orgIdsForBn.includes(orgId) && item?.strSectionNameBn
              ? `${item?.strSectionName} (${item?.strSectionNameBn})`
              : item?.strSectionName;
          res[i].value = item?.intSectionId;
        });
      },
    });
  };
  const getEmployeDepartment = () => {
    // const { workplaceGroup, workplace } = form.getFieldsValue(true);

    empDepartmentDDL?.action({
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,

        accountId: orgId,
      },
      onSuccess: (res) => {
        res?.forEach((item: any, i: any) => {
          res[i].label = item?.strDepartment;
          res[i].value = item?.intDepartmentId;
        });
      },
    });
  };
  //   const debounce = useDebounce();

  const options: any = [
    { value: "", label: "All" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
  ];
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  // const workplaceGroup = useApiRequest([]);
  // const workplace = useApiRequest([]);
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Security Money ";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // workplace wise
  // const getWorkplaceGroup = () => {
  //   workplaceGroup?.action({
  //     urlKey: "WorkplaceGroupWithRoleExtension",
  //     method: "GET",
  //     params: {
  //       accountId: orgId,
  //       businessUnitId: buId,
  //       workplaceGroupId: wgId,
  //       empId: employeeId,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.strWorkplaceGroup;
  //         res[i].value = item?.intWorkplaceGroupId;
  //       });
  //     },
  //   });
  // };

  // const getWorkplace = () => {
  //   const { workplaceGroup } = form.getFieldsValue(true);
  //   workplace?.action({
  //     urlKey: "WorkplaceWithRoleExtension",
  //     method: "GET",
  //     params: {
  //       accountId: orgId,
  //       businessUnitId: buId,
  //       workplaceGroupId: workplaceGroup?.value,
  //       empId: employeeId,
  //     },
  //     onSuccess: (res: any) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.strWorkplace;
  //         res[i].value = item?.intWorkplaceId;
  //       });
  //     },
  //   });
  // };

  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any;
    searchText?: string;
    excelDownload?: boolean;
    IsForXl?: boolean;
    date?: string;
  };
  const landingApiCall = ({
    pagination = { current: 1, pageSize: paginationSize },
    searchText = "",
  }: TLandingApi = {}) => {
    const values = form.getFieldsValue(true);

    landingApi.action({
      urlKey: "DepositMasterReport",
      method: "GET",
      params: {
        departmentId: values?.department?.value || 0,
        strSearch: values?.employee?.employeeCode || "",
        status: values?.status || "",
        sectionId: values?.section?.value || 0,
      },
    });
  };

  const header: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Employee Code",
      dataIndex: "employeeCode",
      width: 100,
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      width: 100,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      width: 100,
    },
    {
      title: "Department",
      dataIndex: "department",
      width: 100,
    },
    {
      title: "Section",
      dataIndex: "SectionName",
      width: 100,
    },
    // {
    //   title: "Deposits Month Year",
    //   dataIndex: "joiningDate",
    //   render: (data: any) => (data ? dateFormatter(data) : "-"),
    //   width: 100,
    // },

    {
      title: "Total Deposits Money",
      dataIndex: "totalDepositsMoney",
      width: 100,
    },
    {
      title: "Disbursement Amount",
      dataIndex: "disbursementAmount",
      width: 100,
    },

    {
      title: "",
      width: 30,

      align: "center",
      render: (_: any, item: any) => (
        <TableButton
          buttonsList={[
            {
              type: "view",
              onClick: () => {
                detailsApi?.action({
                  urlKey: "DepositDetailReportByEmployee",
                  method: "GET",
                  params: {
                    employeeId: item?.employeeId,
                  },
                  onSuccess: () => {
                    setModalData([item]);
                    setOpen(true);
                  },
                });
              },
            },
          ]}
        />
      ),
    },
  ];
  const detailsHeader: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },

    {
      title: "Type",
      dataIndex: "type",
      width: 100,
    },
    {
      title: "Deposits Type",
      dataIndex: "depositsType",
      // render: (_: any, data: any) =>
      //   data?.type === "Disbursement" ? "-" : data?.depositType,
      width: 100,
    },

    {
      title: "Deposits Time",
      render: (_: any, data: any) =>
        data?.type === "Deposit"
          ? moment(data?.executionTime).format("MMM-YYYY")
          : moment(data?.executionTime).format("ll"),
      width: 100,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 100,
    },
    {
      title: "Comments",
      dataIndex: "comments",
      width: 100,
    },

    // {
    //   title: "",
    //   width: 30,

    //   align: "center",
    //   render: (_: any, item: any) => (
    //     <TableButton
    //       buttonsList={
    //         [
    //           // {
    //           //   type: "delete",
    //           //   onClick: () => {
    //           //     deleteProposalById(item);
    //           //   },
    //           // },
    //         ]
    //       }
    //     />
    //   ),
    // },
  ];

  const onFinish = () => {
    landingApiCall();
  };
  useEffect(() => {
    getEmployee();
    getEmployeDepartment();
  }, [wId, wgId]);

  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          // employee: { value: employeeId, label: userName },
          fromDate: moment(todayDate()),
          toDate: moment(todayDate()),
        }}
        onFinish={onFinish}
      >
        <PCard>
          <PCardHeader
            title={`Total ${landingApi?.data?.data?.length || 0} employees`}
          />
          {loading && <Loading />}
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={6} sm={24}>
                <PSelect
                  allowClear
                  showSearch
                  options={
                    empDepartmentDDL?.data?.length > 0
                      ? empDepartmentDDL?.data
                      : []
                  }
                  name="department"
                  label="Department"
                  placeholder=""
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      department: op,
                    });
                    getEmployeeSection();
                  }}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Year is required",
                  //   },
                  // ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PSelect
                  allowClear
                  showSearch
                  options={
                    empSectionDDL?.data?.length > 0 ? empSectionDDL?.data : []
                  }
                  name="section"
                  label="Section"
                  placeholder=""
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      section: op,
                    });
                  }}
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  allowClear
                  showSearch
                  name="employee"
                  label="Employee"
                  placeholder="Search Min 2 char"
                  options={CommonEmployeeDDL?.data || []}
                  loading={CommonEmployeeDDL?.loading}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      employee: op,
                    });
                    // empBasicInfo(buId, orgId, value, setEmpInfo);
                  }}
                />
              </Col>
              <Col md={6} sm={24}>
                <PSelect
                  options={options}
                  name="status"
                  label="Status"
                  placeholder="status"
                  onChange={(value) => {
                    form.setFieldsValue({
                      status: value,
                    });
                  }}
                />
              </Col>

              <Col
                style={{
                  marginTop: "23px",
                }}
              >
                <PButton type="primary" action="submit" content="View" />
              </Col>
            </Row>
          </PCardBody>

          <DataTable
            bordered
            data={
              landingApi?.data?.data?.length > 0 ? landingApi?.data?.data : []
            }
            loading={landingApi?.loading}
            header={header}
          />
        </PCard>
        <PModal
          width={900}
          open={open}
          onCancel={() => setOpen(false)}
          title={`Security Money Report (Details)`}
          components={
            <>
              <PCardBody className="my-2">
                <CommonEmpInfo
                  employeeName={
                    modalData[0]?.employeeName +
                    `[` +
                    modalData[0]?.employeeCode +
                    `]`
                  }
                  designationName={modalData[0]?.designation}
                  departmentName={modalData[0]?.department}
                >
                  <>
                    <div>
                      Deposits Money :{" "}
                      <span style={{ fontWeight: "500" }}>
                        {modalData[0]?.totalDepositsMoney}
                      </span>
                    </div>
                    <div>
                      Disbursement Amount :{" "}
                      <span style={{ fontWeight: "500" }}>
                        {modalData[0]?.disbursementAmount}
                      </span>
                    </div>
                    <div>
                      Balance Amount :{" "}
                      <span style={{ fontWeight: "500" }}>
                        {modalData[0]?.totalBalance}
                      </span>
                    </div>
                  </>
                </CommonEmpInfo>
              </PCardBody>
              <DataTable
                header={detailsHeader}
                bordered
                data={
                  detailsApi?.data?.data?.length > 0
                    ? detailsApi?.data?.data
                    : []
                }
              />
            </>
          }
        />
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};
