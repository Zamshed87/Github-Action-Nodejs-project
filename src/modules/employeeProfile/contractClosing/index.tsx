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
import { Col, Form, Row } from "antd";
import { getWorkplaceDetails } from "common/api";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  dateFormatter,
  monthFirstDate,
  monthLastDate,
} from "utility/dateFormatter";
// import { downloadEmployeeCardFile } from "../employeeIDCard/helper";
import { debounce } from "lodash";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { todayDate } from "utility/todayDate";
import { column } from "./helper";
import { IconButton, Popover } from "@mui/material";
import { Clear } from "@mui/icons-material";
import { gray900 } from "utility/customColor";
import { getTableDataConfirmation } from "../jobConfirmation/helper";

const ContactClosingReport = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, employeeId, orgId, buName },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 91),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const extendContract = useApiRequest({});
  const landingApi = useApiRequest({});
  //   const debounce = useDebounce();

  const [, setFilterList] = useState({});
  const [buDetails, setBuDetails] = useState({});
  const [excelLoading, setExcelLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [singleData, setSingleData] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  //   const { id }: any = useParams();

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Form Instance
  const [form] = Form.useForm();
  //   api states
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  const designation = useApiRequest([]);
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Contract Closing";

    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // workplace wise
  const getWorkplaceGroup = () => {
    workplaceGroup?.action({
      urlKey: "WorkplaceGroupWithRoleExtension",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        empId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };
  // const getDesignation = () => {
  //   const { workplaceGroup, workplace } = form.getFieldsValue(true);
  //   designation?.action({
  //     urlKey: "PeopleDeskAllDDL",
  //     method: "GET",
  //     params: {
  //       DDLType: "EmpDesignation",
  //       AccountId: orgId,
  //       BusinessUnitId: buId,
  //       WorkplaceGroupId: workplaceGroup?.value,
  //       IntWorkplaceId: workplace?.value,
  //       intId: 0,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: any) => {
  //         res[i].label = item?.DesignationName;
  //         res[i].value = item?.DesignationId;
  //       });
  //     },
  //   });
  // };
  const getWorkplace = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    workplace?.action({
      urlKey: "WorkplaceWithRoleExtension",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value,
        empId: employeeId,
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
      urlKey: "ContractualClosing",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: values?.workplaceGroup?.value,
        IsPaginated: true,
        pageNo: pagination.current || pages?.current,
        pageSize: pagination.pageSize || pages?.pageSize,
        searchTxt: searchText,
      },
    });
  };

  useEffect(() => {
    getWorkplaceGroup();
    // getDesignation();
    landingApiCall();
  }, []);

  const confirmation = (values: any) => {
    const payload = {
      employeeId: singleData?.EmployeeId,
      contractFromDate: moment(values?.contractFromDate).format("YYYY-MM-DD"),
      contractToDate: moment(values?.contractToDate).format("YYYY-MM-DD"),
    };
    extendContract?.action({
      urlKey: "UpdateEmpBasicInfoByEmployeeId",
      method: "POST",
      payload,
      onSuccess: () => {
        setSingleData(null);
        setIsEdit(false);
        setAnchorEl(null);
        landingApiCall();
      },
    });
  };
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
      dataIndex: "EmployeeCode",
      width: 70,
      fixed: "left",
    },

    {
      title: "Employee Name",
      dataIndex: "EmployeeName",
      render: (_: any, rec: any) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.EmployeeName} />
            <span className="ml-2">{rec?.EmployeeName}</span>
          </div>
        );
      },
      fixed: "left",
      width: 120,
    },

    {
      title: "Designation",
      dataIndex: "DesignationName",

      width: 100,
    },
    {
      title: "Department",
      dataIndex: "DepartmentName",

      width: 100,
    },

    {
      title: "Employment Type",
      dataIndex: "strEmploymentType",

      width: 100,
    },
    {
      title: "Contractual From Date",
      dataIndex: "dteContactFromDate",
      render: (_: any, rec: any) => dateFormatter(rec?.dteContactFromDate),
      width: 120,
    },
    {
      title: "Contractual To Date",
      dataIndex: "dteContactToDate",
      render: (_: any, rec: any) => dateFormatter(rec?.dteContactToDate),
      width: 120,
    },

    {
      title: "Joining Date",
      dataIndex: "dteJoiningDate",
      render: (_: any, rec: any) => dateFormatter(rec?.dteJoiningDate),
      width: 70,
    },
    {
      title: "",
      dataIndex: "",
      width: 150,
      render: (_: any, item: any) => {
        return (
          <div className="d-flex justify-content-center">
            <button
              style={{
                height: "24px",
                fontSize: "12px",
                padding: "0px 12px 0px 12px",
              }}
              className="btn btn-default btn-assign"
              type="button"
              onClick={(e: any) => {
                if (!permission?.isCreate)
                  return toast.warn("You don't have permission");
                setAnchorEl(e.currentTarget);
                setSingleData(item);
              }}
            >
              Extend Contract
            </button>
          </div>
        );
      },
    },
  ];
  const searchFunc = debounce((value) => {
    landingApiCall({
      searchText: value,
    });
  }, 500);
  const disabledToDate: RangePickerProps["disabledDate"] = (current) => {
    const { contractFromDate } = form.getFieldsValue(true);
    console.log({ contractFromDate });
    const fromDateMoment = moment(singleData?.dteContactToDate, "MM/DD/YYYY");
    // Disable dates before fromDate and after next3daysForEmp
    // console.log({ singleData });
    console.log({ fromDateMoment });

    return (
      current && current < moment(singleData?.dteContactToDate).startOf("day")
    );
  };
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Disable dates before fromDate and after next3daysForEmp
    // console.log({ singleData });

    return (
      current && current < moment(singleData?.dteContactFromDate).startOf("day")
    );
  };
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
              current: pages?.current,
              pageSize: landingApi?.data[0]?.totalCount,
            },
          });
        }}
      >
        <PCard>
          {excelLoading && <Loading />}
          <PCardHeader
            exportIcon={true}
            title={`Total ${landingApi?.data[0]?.totalCount || 0} employees`}
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
                  if (landingApi?.data?.length <= 0) {
                    return toast.warning("Data is empty !!!!", {
                      toastId: 1,
                    });
                  }
                  const newData = landingApi?.data?.map(
                    (item: any, index: any) => {
                      return {
                        ...item,
                        sl: index + 1,
                        dteContactFromDate: dateFormatter(
                          item?.dteContactFromDate
                        ),
                        dteContactToDate: dateFormatter(item?.dteContactToDate),
                        dteJoiningDate: dateFormatter(item?.dteJoiningDate),
                      };
                    }
                  );
                  createCommonExcelFile({
                    titleWithDate: `Contract Closing Report ${dateFormatter(
                      todayDate()
                    )} `,
                    fromDate: "",
                    toDate: "",
                    buAddress: (buDetails as any)?.strAddress,
                    businessUnit: values?.workplaceGroup?.value
                      ? (buDetails as any)?.strWorkplace
                      : buName,
                    tableHeader: column,
                    getTableData: () =>
                      getTableDataConfirmation(newData, Object.keys(column)),
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    getSubTableData: () => {},
                    subHeaderInfoArr: [],
                    subHeaderColumn: [],
                    tableFooter: [],
                    extraInfo: {},
                    tableHeadFontSize: 10,
                    widthList: {
                      B: 30,
                      C: 30,
                      D: 15,
                      E: 25,
                      F: 20,
                      G: 25,
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
                  toast.error("Failed to download excel");
                  setExcelLoading(false);
                  // console.log(error?.message);
                }
              };
              excelLanding();
            }}
          />
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  options={workplaceGroup?.data || []}
                  name="workplaceGroup"
                  label="Workplace Group"
                  placeholder="Workplace Group"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplaceGroup: op,
                      workplace: undefined,
                    });
                    getWorkplace();
                    // getDesignation();
                  }}
                  rules={
                    [
                      //   { required: true, message: "Workplace Group is required" },
                    ]
                  }
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  options={workplace?.data || []}
                  name="workplace"
                  label="Workplace"
                  placeholder="Workplace"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplace: op,
                    });
                    getWorkplaceDetails(value, setBuDetails);
                    // getDesignation();
                  }}
                  // rules={[{ required: true, message: "Workplace is required" }]}
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
              landingApi?.data?.length > 0
                ? landingApi?.data
                : [
                    // {
                    //   AccountId: 1,
                    //   BusinessUnitId: 1,
                    //   ConfirmationDate: null,
                    //   ConfirmationDateRaw: null,
                    //   DateOfBirth: "1988-09-26T00:00:00",
                    //   DepartmentId: 24,
                    //   DepartmentName: "Treasury",
                    //   DesignationId: 37,
                    //   DesignationName: "Executive",
                    //   EmployeeCode: "10252",
                    //   EmployeeId: 5521,
                    //   EmployeeName: "Mohammad Nur-UZ-Zaman",
                    //   EmployeeStatus: "Active",
                    //   EmploymentStatus: "NotConfirm",
                    //   EmploymentStatusId: 1,
                    //   JoiningDate: "2024-03-16T00:00:00",
                    //   JoiningDateFormated: "16 Mar, 2024",
                    //   PayrollGroupId: 18,
                    //   PayrollGroupName: "H/O Payroll",
                    //   PayscaleGradeId: null,
                    //   PayscaleGradeName: null,
                    //   ProfilePicUrl: null,
                    //   ServiceLength: "1 Month 28 Days",
                    //   SupervisorId: 386,
                    //   SupervisorName: "Md. Ziaur Rahman",
                    //   TerritoryName: null,
                    //   dteContactFromDate: "2024-04-12T00:00:00",
                    //   dteContactToDate: "2024-05-12T00:00:00",
                    //   strEmploymentType: "Probationary",
                    //   totalCount: 2,
                    // },
                  ]
            }
            loading={landingApi?.loading}
            header={header}
            pagination={{
              pageSize: pages?.pageSize,
              total: landingApi?.data[0]?.totalCount,
            }}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              setFilterList(filters);
              setPages({
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
              });
              landingApiCall({
                pagination,
              });
            }}
          />
        </PCard>
        <Popover
          sx={{
            "& .MuiPaper-root": {
              width: "675px",
              minHeight: "200px",
              borderRadius: "4px",
            },
          }}
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={() => {
            setAnchorEl(null);
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <div
            className="master-filter-modal-container employeeProfile-src-filter-main"
            style={{ height: "auto" }}
          >
            <div className="master-filter-header employeeProfile-src-filter-header">
              <div></div>
              <IconButton
                onClick={() => {
                  setAnchorEl(null);
                  landingApiCall();
                  setSingleData(null);
                  setIsEdit(false);
                  form.setFieldsValue({
                    contractFromDate: undefined,
                    contractToDate: undefined,
                  });
                }}
              >
                <Clear sx={{ fontSize: "18px", color: gray900 }} />
              </IconButton>
            </div>
            <hr />
            <div
              className="body-employeeProfile-master-filter"
              style={{ height: "250px" }}
            >
              <div className="row content-input-field">
                <div className="col-4">
                  <PSelect
                    options={designation?.data || []}
                    name="designation"
                    label="Designation"
                    placeholder="Designation"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        workplaceGroup: op,
                        workplace: undefined,
                      });
                      getWorkplace();
                    }}
                    rules={[
                      { required: true, message: "Designation is required" },
                    ]}
                  />
                </div>
                <div className="col-4">
                  <PInput
                    type="date"
                    name="contractFromDate"
                    label="Contract From Date"
                    placeholder="Contract From Date"
                    rules={[
                      {
                        required: true,
                        message: "Contract From Date is required",
                      },
                    ]}
                    onChange={(value) => {
                      form.setFieldsValue({
                        fromDate: value,
                      });
                    }}
                    disabledDate={disabledDate}
                  />
                </div>
                <div className="col-4">
                  <PInput
                    type="date"
                    name="contractToDate"
                    label="Contract to Date"
                    placeholder="Contract to Date"
                    rules={[
                      {
                        required: true,
                        message: "Contract to Date is required",
                      },
                    ]}
                    onChange={(value) => {
                      form.setFieldsValue({
                        contractToDate: value,
                      });
                    }}
                    disabledDate={disabledToDate}
                  />
                </div>
              </div>
            </div>
            <div className="master-filter-bottom footer-employeeProfile-src-filter">
              <div className="master-filter-btn-group">
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(null);
                    landingApiCall();
                    setSingleData(null);
                    setIsEdit(false);
                    form.setFieldsValue({
                      contractFromDate: undefined,
                      contractToDate: undefined,
                    });
                  }}
                  style={{
                    marginRight: "10px",
                  }}
                >
                  cancel
                </button>
                <button
                  type="button"
                  className="btn btn-green btn-green-disable"
                  style={{ width: "auto" }}
                  onClick={() => {
                    confirmation(form.getFieldsValue(true));
                  }}
                >
                  {isEdit ? "Save" : "Extend"}
                </button>
              </div>
            </div>
          </div>
        </Popover>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default ContactClosingReport;
