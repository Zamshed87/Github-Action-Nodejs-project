import {
  Avatar,
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import type { RangePickerProps } from "antd/es/date-picker";

import { useApiRequest } from "Hooks";
import { Col, Form, Row, Tag } from "antd";
import { getWorkplaceDetails } from "common/api";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { dateFormatter, getDateOfYear } from "utility/dateFormatter";

import { debounce } from "lodash";

import { LightTooltip } from "common/LightTooltip";
import { InfoOutlined } from "@mui/icons-material";
import { getPDFAction } from "utility/downloadFile";

const EmLoanHistory = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, employeeId },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 99),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});

  const [, setFilterList] = useState({});
  const [, setBuDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [pages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const { id }: any = useParams();
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Loan History";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // workplace wise
  const getWorkplaceGroup = () => {
    workplaceGroup?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "WorkplaceGroup",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId, // This should be removed
        intId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };

  const getWorkplace = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    workplace?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        intId: employeeId,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };

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
      urlKey: "GetLoanApplicationByAdvanceFilter",
      method: "POST",
      payload: {
        businessUnitId: buId,
        loanTypeId: 0,
        departmentId: 0,
        designationId: 0,
        employeeId: 0,
        fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values?.todate).format("YYYY-MM-DD"),
        minimumAmount: 0,
        maximumAmount: 0,
        applicationStatus: "",
        installmentStatus: "",
        pageSize: pagination?.pageSize || 500,
        pageNo: pagination?.current || 1,
        ispaginated: true,
        searchText: searchText || "",
        workplaceGroupId: values?.workplaceGroup?.value,
        workplaceId: values?.workplace?.value,
      },
    });
  };

  useEffect(() => {
    getWorkplaceGroup();
    landingApiCall();
  }, []);

  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        (pages?.current - 1) * pages?.pageSize + index + 1,
      fixed: "left",
      width: 35,
      align: "center",
    },

    {
      title: "Employee Id",
      dataIndex: "strEmployeeCode",
      width: 35,
      fixed: "left",
    },

    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (_: any, rec: any) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.strEmployeeName} />
            <span className="ml-2">{rec?.strEmployeeName}</span>
          </div>
        );
      },
      fixed: "left",
      width: 60,
    },

    {
      title: "Designation",
      dataIndex: "strDesignation",

      width: 70,
    },

    {
      title: "Department",
      dataIndex: "strDepartment",

      width: 70,
    },

    {
      title: "Application Date",
      dataIndex: "applicationDate",
      render: (_: any, rec: any) => dateFormatter(rec?.applicationDate),
      width: 60,
    },
    {
      title: "Loan Type",
      dataIndex: "loanType",
      render: (_: any, record: any) => (
        <div>
          <LightTooltip
            title={
              <div className="application-tooltip">
                <h6>Reason</h6>
                <span className="tableBody-title">{record?.description}</span>
              </div>
            }
            arrow
          >
            <InfoOutlined sx={{ fontSize: "15px" }} className="mr-1" />
          </LightTooltip>
          <span>{record?.loanType}</span>
        </div>
      ),
    },
    {
      title: "Loan Amount",
      dataIndex: "loanAmount",
      render: (_: any, record: any) => (
        <>
          <span>BDT {record?.loanAmount}</span>
        </>
      ),
    },
    {
      title: "Installment",
      dataIndex: "numberOfInstallment",
      width: 30,
    },

    {
      title: "Approval",
      dataIndex: "applicationStatus",
      render: (_: any, rec: any) => (
        <div className="d-flex align-items-center justify-content-center">
          <div>
            {rec?.applicationStatus === "Approved" && (
              <Tag color="green">{rec?.applicationStatus}</Tag>
            )}
            {rec?.applicationStatus === "Pending" && (
              <Tag color="gold">{rec?.applicationStatus}</Tag>
            )}
            {rec?.applicationStatus === "Rejected" && (
              <Tag color="red">{rec?.applicationStatus}</Tag>
            )}
          </div>
        </div>
      ),
      width: 50,
    },
    {
      title: "Status",
      dataIndex: "installmentStatus",
      render: (_: any, rec: any) => (
        <div className="d-flex align-items-center justify-content-center">
          <div>
            {rec?.installmentStatus === "Completed" ? (
              <Tag color="green">{rec?.installmentStatus}</Tag>
            ) : rec?.installmentStatus === "Running" ? (
              <Tag color="gold">{rec?.installmentStatus}</Tag>
            ) : rec?.installmentStatus === "Not Started" ? (
              <Tag color="blue">{rec?.installmentStatus}</Tag>
            ) : rec?.installmentStatus === "deleted" ? (
              <Tag color="red">{rec?.installmentStatus}</Tag>
            ) : null}
            {/* {rec?.applicationStatus === "Running" && (
              <Tag color="gold">{rec?.applicationStatus}</Tag>
            )} */}
            {/* {rec?.applicationStatus === "Not Started" && (
              <Tag color="blue">{rec?.applicationStatus}</Tag>
            )} */}
            {/* {rec?.applicationStatus === "deleted" && (
              <Tag color="red">{rec?.applicationStatus}</Tag>
            )} */}
          </div>
        </div>
      ),
      width: 50,
    },
  ];
  const searchFunc = debounce((value) => {
    landingApiCall({
      searchText: value,
    });
  }, 500);
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    const { fromDate } = form.getFieldsValue(true);
    const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
    // Disable dates before fromDate and after next3daysForEmp
    return current && current < fromDateMoment.startOf("day");
  };
  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          fromDate: moment(getDateOfYear("first")),
          toDate: moment(getDateOfYear("last")),
        }}
        onFinish={() => {
          landingApiCall({
            pagination: {
              current: landingApi?.data?.currentPage,
              pageSize: landingApi?.data?.totalCount,
            },
          });
        }}
      >
        <PCard>
          {loading && <Loading />}
          <PCardHeader
            backButton
            exportIcon={true}
            title={`Total ${landingApi?.data?.totalCount || 0} employees`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
            onExport={() => {
              const values = form.getFieldsValue(true);
              getPDFAction(
                `/PdfAndExcelReport/LoanReportAll?&BusinessUnitId=${buId}&WorkplaceGroupId=${
                  values?.workplaceGroup?.value
                }&DepartmentId=${0}&DesignationId=${
                  values?.designation?.value || 0
                }&EmployeeId=${0}&LoanTypeId=${
                  values?.loanType?.value || 0
                }&FromDate=${moment(values?.fromDate).format(
                  "YYYY-MM-DD"
                )}&ToDate=${moment(values?.toDate).format(
                  "YYYY-MM-DD"
                )}&MinimumAmount=${
                  values?.minimumAmount || 0
                }&MaximumAmount=${0}&ApplicationStatus=${""}&InstallmentStatus=${""}`,
                setLoading
              );
            }}
          />
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="fromDate"
                  label="From Date"
                  placeholder="From Date"
                  onChange={(value) => {
                    form.setFieldsValue({
                      fromDate: value,
                    });
                  }}
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="toDate"
                  label="To Date"
                  placeholder="To Date"
                  disabledDate={disabledDate}
                  onChange={(value) => {
                    form.setFieldsValue({
                      toDate: value,
                    });
                  }}
                />
              </Col>

              <Col md={5} sm={12} xs={24}>
                <PSelect
                  options={workplaceGroup?.data || []}
                  name="workplaceGroup"
                  label="Workplace Group"
                  placeholder="Workplace Group"
                  disabled={+id ? true : false}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplaceGroup: op,
                      workplace: undefined,
                    });
                    getWorkplace();
                  }}
                  rules={[
                    { required: true, message: "Workplace Group is required" },
                  ]}
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  options={workplace?.data || []}
                  name="workplace"
                  label="Workplace"
                  placeholder="Workplace"
                  disabled={+id ? true : false}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplace: op,
                    });
                    getWorkplaceDetails(value, setBuDetails);
                  }}
                  rules={[{ required: true, message: "Workplace is required" }]}
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
            data={landingApi?.data?.data || []}
            loading={landingApi?.loading}
            header={header}
            pagination={{
              pageSize: landingApi?.data?.pageSize,
              total: landingApi?.data?.totalCount,
            }}
            onRow={(record: any) => ({
              onClick: () => {
                const values = form.getFieldsValue(true);
                getPDFAction(
                  `/PdfAndExcelReport/LoanReportDetails?LoanApplicationId=${
                    record?.loanApplicationId
                  }&BusinessUintId=${buId}&WorkplaceGroupId=${
                    values?.workplaceGroup?.value || wgId
                  }&EmployeeId=${record?.employeeId}`,
                  setLoading
                );
              },
              className: "pointer",
            })}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              setFilterList(filters);

              landingApiCall({
                pagination,
              });
            }}
            scroll={{ x: 2000 }}
          />
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default EmLoanHistory;
