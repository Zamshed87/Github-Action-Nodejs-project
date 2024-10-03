import { Col, Form, Row, Tag } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useApiRequest } from "Hooks";
import { debounce } from "lodash";
import moment from "moment";
import React, { useEffect } from "react";
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
// import { stripHtml } from "utility/stripHTML";
export const AdjustmentIOUReportLanding = () => {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();
  //   const [id, setId] = useState("");
  //   const [open, setOpen] = useState(false);

  // redux
  const { buId, wgId, wId } = useSelector(
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
    if (item?.menuReferenceId === 30275) {
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
      urlKey: "IOULandingForAccounts",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values?.toDate).format("YYYY-MM-DD"),
        pageNo: pagination.current || 1,
        pageSize: pagination.pageSize || 100,
        intIOUId: 0,
        searchTxt: searchText,
        workplaceId: wId,
      },
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "IOU-Adjustment Report";
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
      title: "IOU Code",
      dataIndex: "iouCode",
      filter: false,
    },
    {
      title: "Application Date",
      dataIndex: "applicationDate",
      render: (_: any, rec: any) => dateFormatter(rec?.applicationDate),
    },
    {
      title: "From Date",
      dataIndex: "dteFromDate",
      render: (_: any, rec: any) => dateFormatter(rec?.dteFromDate),
    },

    {
      title: "To Date",
      dataIndex: "dteToDate",
      render: (_: any, rec: any) => dateFormatter(rec?.dteToDate),
    },

    {
      title: "IOU",
      dataIndex: "numIouAmount",
      className: "text-right",
      width: 45,

      filter: false,
    },
    {
      title: "Adjusted",
      dataIndex: "numAdjustedAmount",
      className: "text-right",
      filter: false,
    },
    {
      title: "Adjusted by Accounts",
      dataIndex: "numReceivableAmount",
      className: "text-right",

      sort: true,
      render: (_: any, rec: any) => numberWithCommas(rec?.numReceivableAmount),
      filter: false,
    },
    {
      title: "Pay to Accounts",
      dataIndex: "pendingAdjAmount",
      className: "text-right",

      sort: true,
      render: (_: any, rec: any) =>
        numberWithCommas(rec?.pendingAdjAmount) || 0,
      filter: false,
    },
    {
      title: "Receive from Accounts",
      dataIndex: "numPayableAmount",
      className: "text-right",

      sort: true,
      render: (_: any, rec: any) => numberWithCommas(rec?.numPayableAmount),
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
                            Rejected by {rec?.RejectedBy}
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
      title: "Adjustment Status",
      width: 45,

      dataIndex: "adjustmentStatus",
      render: (_: any, rec: any) => (
        <div>
          {" "}
          {rec?.adjustmentStatus === "Adjusted" && (
            //   <Chips label="Adjusted" classess="success p-2" />
            <Tag color="green">Adjusted</Tag>
          )}
          {rec?.adjustmentStatus === "Pending" && (
            //   <Chips label="Pending" classess="warning p-2" />
            <Tag color="warning">Pending</Tag>
          )}
          {rec?.adjustmentStatus === "Process" && (
            <Tag color="processing">Process</Tag>

            // <Chips label="Process" classess="primary p-2" />
          )}
          {rec?.adjustmentStatus === "Completed" && (
            // <Chips label="Completed" classess="indigo p-2" />
            <Tag color="cyan">Completed</Tag>
          )}
          {rec?.adjustmentStatus === "Rejected" && (
            <>
              <Tag color="red">Rejected</Tag>

              {/* <Chips label="Rejected" classess="danger p-2 mr-2" /> */}
            </>
          )}
        </div>
      ),
    },
    // {
    //   title: "Reject Reason",
    //   dataIndex: "strRemarks",
    //   sort: true,
    //   render: (_: any, rec: any) => (
    //     <>
    //       {rec?.strRemarks && (
    //         <LightTooltip title={stripHtml(rec?.strRemarks)} arrow>
    //           <div className="pointer">
    //             {stripHtml(rec?.strRemarks?.slice(0, 10))}
    //             {stripHtml(rec?.strRemarks?.length > 10 ? "..." : "")}
    //           </div>
    //         </LightTooltip>
    //       )}
    //     </>
    //   ),
    // },

    {
      title: "Action",
      align: "center",
      render: (_: any, rec: any) =>
        rec?.status === "Pending" && (
          <TableButton
            buttonsList={[
              {
                type: "edit",
                onClick: () => {
                  history?.push(`/profile/iOU/adjustmentReport/${rec?.iouId}`);
                  //   setOpen(true);
                  //   setId(rec);
                },
              },
            ]}
          />
        ),
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
          {landingApi?.loading && <Loading />}
          <PCardHeader
            title={`Total ${landingApi?.data?.totalCount || 0} employees`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
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
              landingApi?.data?.iouApplicationLandings?.length > 0
                ? landingApi?.data?.iouApplicationLandings
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
                history.push(`/profile/iOU/adjustmentReport/${record?.iouId}`);
              },

              className: "pointer",
            })}
            scroll={{ x: 2000 }}
          />
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};
