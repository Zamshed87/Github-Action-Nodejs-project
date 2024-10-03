import { Col, Form, Row, Tag } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useApiRequest } from "Hooks";
import { debounce } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import type { RangePickerProps } from "antd/es/date-picker";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { getSerial } from "Utils";
import {
  Avatar,
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  TableButton,
} from "Components";
import {
  dateFormatter,
  monthFirstDate,
  monthLastDate,
} from "utility/dateFormatter";
import Loading from "common/loading/Loading";
import { numberWithCommas } from "utility/numberWithCommas";
import { LightTooltip } from "common/LightTooltip";
import { InfoOutlined } from "@ant-design/icons";
import { PModal } from "Components/Modal";
import { getPDFAction } from "utility/downloadFile";
import { toast } from "react-toastify";
import AddEditForm from "./AddEditForm/index.jsx";
export const MgtExpenseApplicationLanding = () => {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // redux
  const { orgId, buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  // menu permission
  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30322) {
      employeeFeature = item;
    }
  });

  // Form Instance
  const [form] = Form.useForm();

  const landingApi = useApiRequest({});
  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any;
    searchText?: string;
    excelDownload?: boolean;
  };
  const landingApiCall = ({
    pagination = {},
    searchText = "",
  }: TLandingApi = {}) => {
    const values = form.getFieldsValue(true);

    landingApi.action({
      urlKey: "ExpenseApplicationLandingDataPaginetion",
      method: "GET",
      params: {
        intBusinessUnitId: buId,
        intWorkplaceGroupId: wgId,
        dteFromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        dteToDate: moment(values?.toDate).format("YYYY-MM-DD"),
        pageNo: pagination.current || 1,
        pageSize: pagination.pageSize || 100,

        strSearchTxt: searchText,
        workplaceId: wId,
      },
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Expense Application";
    return () => {
      document.title = "Peopledesk";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    landingApiCall();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wId, wgId]);

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

  // Header
  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApi?.data?.currentPage,
          pageSize: landingApi?.data?.pageSize,
          index,
        }),
      width: 25,
      fixed: "left",
      align: "center",
    },
    {
      title: "Employee ID",
      dataIndex: "employeeCode",
      filter: false,
      fixed: "left",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      render: (_: any, rec: any) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.employeeName} />
            <span className="ml-2">{rec?.employeeName}</span>
          </div>
        );
      },
      filter: false,
      fixed: "left",
    },
    {
      title: "Expense Type",
      dataIndex: "strExpenseType",
      filter: false,
    },
    // {
    //   title: "Application Date",
    //   dataIndex: "applicationDate",
    //   render: (_: any, rec: any) => dateFormatter(rec?.applicationDate),
    // },
    {
      title: "From Date",
      dataIndex: "dteExpenseFromDate",
      render: (_: any, rec: any) => dateFormatter(rec?.dteExpenseFromDate),
    },

    {
      title: "To Date",
      dataIndex: "dteExpenseToDate",
      render: (_: any, rec: any) => dateFormatter(rec?.dteExpenseToDate),
    },

    {
      title: "Expense Amount",
      dataIndex: "numExpenseAmount",
      //   className: "text-right",

      sort: true,
      render: (_: any, rec: any) => numberWithCommas(rec?.numExpenseAmount),
      filter: false,
    },
    {
      title: "Reason",
      dataIndex: "strDiscription",
    },

    {
      title: "Status",
      width: 45,

      dataIndex: "status",
      render: (_: any, rec: any) => {
        return (
          <div>
            {rec?.status === "Approved" && (
              // <Chips label="Approved" classess="success p-2" />
              <Tag color="green">Approved</Tag>
            )}
            {rec?.status === "Pending" && (
              // <Chips label="Pending" classess="warning p-2" />
              <Tag color="warning">Pending</Tag>
            )}
            {rec?.status === "Process" && (
              //   <Chips label="Process" classess="primary p-2" />
              <Tag color="processing">Process</Tag>
            )}
            {rec?.status === "Rejected" && (
              <>
                {/* <Chips label="Rejected" classess="danger p-2 mr-2" /> */}
                <Tag color="red">Rejected</Tag>

                {rec?.RejectedBy && (
                  <LightTooltip
                    title={
                      <div className="p-1">
                        <div className="mb-1">
                          <p
                            className="tooltip-title"
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                            }}
                          >
                            Rejected by {rec?.rejectedBy}
                          </p>
                        </div>
                      </div>
                    }
                    arrow
                  >
                    <InfoOutlined />
                  </LightTooltip>
                )}
              </>
            )}
          </div>
        );
      },
    },

    {
      title: "Action",
      align: "center",
      render: (_: any, rec: any) => {
        const buttons = [
          rec?.status === "Pending" && {
            type: "edit",
            onClick: () => {
              history.push(
                `/profile/expense/expenseApplication/edit/${rec?.expenseId}`
              );
              //   setOpen(true);
              //   setId(rec);
            },
          },
          (orgId == 5 || orgId === 6) && {
            type: "print",
            onClick: () => {
              getPDFAction(
                `/PdfAndExcelReport/EmpExpenseReportPdf?intExpenseId=${rec?.expenseId}&businessUnitId=${buId}`,
                setLoading
              );
            },
          },
        ].filter(Boolean) as any;

        return <TableButton buttonsList={buttons} />;
      },
    },
  ];
  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          fromDate: moment(monthFirstDate()),
          toDate: moment(monthLastDate()),
        }}
        onFinish={() => {
          landingApiCall({
            pagination: {
              current: 1,
              pageSize: 100,
            },
          });
        }}
      >
        <PCard>
          {landingApi?.loading || (loading && <Loading />)}
          <PCardHeader
            title={`Total ${landingApi?.data?.totalCount || 0} employees`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
            buttonList={[
              {
                type: "primary",
                content: `Request Expense`,
                icon: "plus",

                onClick: () => {
                  if (!employeeFeature?.isCreate) {
                    return toast.warning("Your are not allowed to access");
                  }
                  history.push(`/profile/expense/expenseApplication/create`);
                  //   setOpen(true);
                },
              },
            ]}
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
              landingApi?.data?.expenseApplicationLandings?.length > 0
                ? landingApi?.data?.expenseApplicationLandings
                : []
            }
            loading={landingApi?.loading}
            header={header}
            pagination={{
              pageSize: landingApi?.data?.pageSize,
              total: landingApi?.data?.totalCount,
            }}
            onRow={(record) => ({
              onClick: () => {
                history.push(
                  `/profile/expense/expenseApplication/view/${record?.expenseId}`
                );
              },

              className: "pointer",
            })}
            scroll={{ x: 2000 }}
          />
        </PCard>
      </PForm>
      <PModal
        open={open}
        title={id ? "Edit Expense Application" : "Create Expense Application"}
        width=""
        onCancel={() => {
          setId("");
          setOpen(false);
        }}
        maskClosable={false}
        components={
          <>
            <AddEditForm
              getData={landingApiCall}
              setIsAddEditForm={setOpen}
              isEdit={id ? true : false}
              singleData={id}
              setId={setId}
            />
          </>
        }
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};
