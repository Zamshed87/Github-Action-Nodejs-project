import { Col, Form, Popover, Row, Tag, Tooltip } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useApiRequest } from "Hooks";
import { debounce } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import type { RangePickerProps } from "antd/es/date-picker";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import {
  Avatar,
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
} from "Components";
import {
  dateFormatter,
  monthFirstDate,
  monthLastDate,
} from "utility/dateFormatter";
import Loading from "common/loading/Loading";
import { toast } from "react-toastify";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import {
  columns,
  confirmationEmpAction,
  getEmployeeSalaryInfo,
} from "./helper";
import { getTableDataDailyAttendance } from "modules/timeSheet/reports/lateReport/helper";
import { getWorkplaceDetails } from "common/api";
import { getSerial } from "Utils";
import { todayDate } from "utility/todayDate";
import { getPDFAction } from "utility/downloadFile";
import { MdPrint } from "react-icons/md";
import ViewModal from "common/ViewModal";
import ViewForm from "./ViewForm";

export const Confirmation = () => {
  // hook
  const dispatch = useDispatch();

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
    if (item?.menuReferenceId === 9) {
      employeeFeature = item;
    }
  });

  // Form Instance
  const [form] = Form.useForm();

  const landingApi = useApiRequest({});
  const [excelLoading, setExcelLoading] = useState(false);
  const [buDetails, setBuDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [openRow, setOpenRow] = useState<string | null>(null); // Use state to track open popover for each row
  const [isAddEditForm, setIsAddEditForm] = useState(false);
  const [singleSalaryData, setSingleSalaryData] = useState([]);

  const hide = () => {
    setOpenRow(null);
  };

  const handleOpenChange = (newOpen: boolean, employeeId: string) => {
    setOpenRow(newOpen ? employeeId : null);
  };

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
    filerList,
    searchText = "",
  }: TLandingApi = {}) => {
    const values = form.getFieldsValue(true);

    landingApi.action({
      urlKey: "EmployeeBasicForConfirmation",
      method: "GET",
      params: {
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        FromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        ToDate: moment(values?.toDate).format("YYYY-MM-DD"),
        PageNo: pagination.current || 1,
        PageSize: pagination.pageSize || 100,

        SearchTxt: searchText,
        WorkplaceId: wId,
      },
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Confirmation";
    return () => {
      document.title = "Peopledesk";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    landingApiCall();
    getWorkplaceDetails(wId, setBuDetails);

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
      fixed: "left",
      //   width: 15,
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
      title: "Designation",
      dataIndex: "designationName",
      filter: false,
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      filter: false,
    },
    {
      title: "Employment Type",
      dataIndex: "employmentType",
      filter: false,
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      render: (_: any, rec: any) => dateFormatter(rec?.joiningDate),
    },
    {
      title: orgId === 10015 ? "Reporting Line" : "Supervisor",
      dataIndex: "supervisorName",
      filter: false,
    },
    {
      title: "Confirmation Date",
      dataIndex: "confirmationDate",
      render: (_: any, rec: any) => {
        return <p>{rec?.confirmationDate ? rec?.confirmationDate : "-"}</p>;
      },
    },
    {
      title: "Status",
      dataIndex: "confirmationStatus",
      render: (_: any, rec: any, index: any) => {
        return (
          <div className="d-flex">
            {rec?.confirmationStatus === "Confirm" ? (
              <>
                {/* <Chips label="Confirmed" classess="success" /> */}
                <Tag color="green">Confirmed</Tag>
                {/* confirmation by fosu 🔥🔥 */}
                {/* <button
                  type="button"
                  className="iconButton mt-0 mt-md-2 mt-lg-0 ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(e.currentTarget);
                    setSingleData(record);
                    setIsEdit(true);
                    setValues((prev) => {
                      return {
                        ...prev,
                        designation: {
                          value: record?.designationId,
                          label: record?.designationName,
                        },
                        confirmDate: record?.confirmationDateRaw
                          ? dateFormatterForInput(record?.confirmationDateRaw)
                          : "",
                        pinNo: record?.pinNo,
                      };
                    });
                  }}
                >
                  <CreateOutlined />
                </button> */}
              </>
            ) : (
              <>
                <Popover
                  title={`${rec?.employeeName}[${rec?.employeeCode}]`}
                  placement="leftTop"
                  content={
                    <div style={{ minWidth: "300px", minHeight: "150px" }}>
                      <Row gutter={[10, 2]}>
                        <Col md={24} xs={24}>
                          <PInput
                            type="date"
                            name="confirmDate"
                            label="Confirmation Date"
                            placeholder="Confirmation Date"
                            onChange={(value) => {
                              form.setFieldsValue({
                                confirmDate: value,
                              });
                            }}
                          />
                        </Col>
                      </Row>
                      <hr style={{ position: "relative", top: 60 }} />
                      <div
                        style={{ position: "relative", top: 55 }}
                        className="d-flex justify-content-end"
                      >
                        <PButton
                          type="secondary"
                          action="button"
                          content="Cancel"
                          onClick={() => hide()}
                        />
                        <PButton
                          type="primary"
                          action="button"
                          content="Save"
                          className="ml-2"
                          onClick={() => {
                            confirmationEmpAction(
                              form.getFieldsValue(true),
                              rec,
                              setLoading,
                              () => {
                                hide();
                                landingApiCall();
                              }
                            );
                          }}
                        />
                      </div>
                    </div>
                  }
                  trigger="click"
                  open={openRow === rec.employeeId}
                  onOpenChange={(newOpen) => {
                    handleOpenChange(newOpen, rec.employeeId);

                    if (!employeeFeature?.isCreate)
                      return toast.warn("You don't have permission");

                    form.setFieldsValue({
                      designation: {
                        value: rec?.designationId,
                        label: rec?.designationName,
                      },
                      confirmDate: rec?.confirmationDate
                        ? moment(rec?.confirmationDate)
                        : moment(todayDate()),
                    });
                  }}
                >
                  <PButton
                    parentClassName="btn-assign"
                    type="primary"
                    action="button"
                    content="Confirm"
                  />
                </Popover>
              </>
            )}
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "confirmationDate",
      render: (_: any, rec: any) => {
        return (
          rec?.confirmationStatus === "Confirm" && (
            <Tooltip title="Download Letter">
              <div
                className="export_icon"
                style={{
                  background: "var(--gray200)",
                  borderRadius: "50%",
                  width: "25px",
                  padding: "0px 6px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  getPDFAction(
                    `/PdfAndExcelReport/EmployeeConfirmationPDF?AccountId=${orgId}&EmployeeId=${rec?.employeeId}&JoiningDate=${rec?.confirmationDateRaw}`,
                    setLoading
                  );
                }}
              >
                <MdPrint />
              </div>
            </Tooltip>
          )
        );
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
          {(excelLoading || landingApi?.loading || loading) && <Loading />}
          <PCardHeader
            exportIcon={true}
            title={`Total ${landingApi?.data?.totalCount || 0} employees`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
            onExport={() => {
              const excelLanding = async () => {
                setExcelLoading(true);
                try {
                  const values = form.getFieldsValue(true);

                  if (landingApi?.data?.data?.length < 1) {
                    return toast.error("No Data Found");
                  }

                  const newData = landingApi?.data?.data?.map(
                    (item: any, idx: any) => ({
                      ...item,
                      sl: idx + 1,
                      confirmationDate: dateFormatter(item?.confirmationDate),
                      joiningDate: dateFormatter(item?.joiningDate),
                    })
                  );
                  createCommonExcelFile({
                    titleWithDate: `Confirmation - ${dateFormatter(
                      values?.fromDate
                    )} to ${dateFormatter(values?.toDate)}`,
                    fromDate: "",
                    toDate: "",
                    buAddress: (buDetails as any)?.strAddress,
                    businessUnit: (buDetails as any)?.strWorkplace,
                    tableHeader: columns,
                    getTableData: () =>
                      getTableDataDailyAttendance(
                        newData,
                        Object.keys(columns)
                      ),
                    getSubTableData: () => {},
                    subHeaderInfoArr: [],
                    subHeaderColumn: [],
                    tableFooter: [],
                    extraInfo: {},
                    tableHeadFontSize: 10,
                    widthList: {
                      C: 14,
                      B: 30,
                      D: 30,
                      E: 25,
                      F: 20,
                      G: 20,
                      H: 15,
                      I: 15,
                      J: 20,
                      K: 20,
                    },
                    commonCellRange: "A1:J1",
                    CellAlignment: "left",
                  });
                  setExcelLoading(false);
                } catch (error: any) {
                  console.log({ error });
                  toast.error("Failed to download excel");
                  setExcelLoading(false);
                }
              };
              excelLanding();
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
              landingApi?.data?.data?.length > 0 ? landingApi?.data?.data : []
            }
            loading={landingApi?.loading}
            header={header}
            pagination={{
              pageSize: landingApi?.data?.pageSize,
              total: landingApi?.data?.totalCount,
            }}
            // 🔥🔥feature existence not sure
            // onRow={(record) => ({
            //   onClick: () => {
            //     console.log(record);
            //     if (record?.employmentTypeId === 2) {
            //       setIsAddEditForm(true);
            //       const obj = {
            //         partType: "EmployeeSalaryInfoByEmployeeId",
            //         businessUnitId: buId,
            //         workplaceGroupId: 0,
            //         departmentId: 0,
            //         designationId: 0,
            //         supervisorId: 0,
            //         employeeId: record?.employeeId || 0,
            //       };
            //       getEmployeeSalaryInfo(setSingleSalaryData, setLoading, obj);
            //     }
            //   },

            //   className: "pointer",
            // })}
            scroll={{ x: 2000 }}
          />
        </PCard>

        {/*feature existence not sure 🔥🔥  */}
        {/* <ViewModal
          id=""
          history={""}
          isShow={""}
          btnText=""
          saveBtnText=""
          handleSubmit={""}
          saveBtnRef={""}
          fullscreen={""}
          email={""}
          body={""}
          subject={""}
          show={isAddEditForm}
          title="View Employee"
          onHide={() => setIsAddEditForm(false)}
          size="lg"
          backdrop="static"
          classes="default-modal form-modal"
        >
          <ViewForm
            setIsAddEditForm={setIsAddEditForm}
            singleSalaryData={singleSalaryData}
          />
        </ViewModal> */}
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};
