/* eslint-disable @typescript-eslint/no-empty-function */
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
import { Col, Form, Row, Tag, Tooltip } from "antd";
import { getWorkplaceDetails } from "common/api";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getDateOfYear } from "utility/dateFormatter";
import { MdOutlineGroupAdd } from "react-icons/md";

// import { downloadEmployeeCardFile } from "../employeeIDCard/helper";
import { debounce } from "lodash";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import {
  column,
  getTableDataInactiveEmployees,
  activeEmployeeHandler,
} from "./helper";
import IConfirmModal from "common/IConfirmModal";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { getCurrentMonthName } from "utility/monthIdToMonthName";
import { currentYear } from "modules/CompensationBenefits/reports/salaryReport/helper";
import { getSerial } from "Utils";

const ActiveInactiveEmployeeReport = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, employeeId, wId, orgId, buName },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 95),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  //   const debounce = useDebounce();

  const [, setFilterList] = useState({});
  const [buDetails, setBuDetails] = useState({});
  const [excelLoading, setExcelLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, getExcelData, apiLoading] = useAxiosGet();

  const { id }: any = useParams();
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Inactive Employees";
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
      urlKey: "GetInactiveEmployeeList",
      method: "GET",
      params: {
        AccountId: orgId,
        BusinessUnitId: buId,
        IsXls: false,
        WorkplaceGroupId: values?.workplaceGroup?.value,
        PageNo: pagination.current || 1,
        PageSize: pagination.pageSize || 25,
        FromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        ToDate: moment(values?.todate).format("YYYY-MM-DD"),
        WorkplaceId: values?.workplace?.value,
        searchTxt: searchText,
      },
    });
  };

  useEffect(() => {
    getWorkplaceGroup();
    landingApiCall();
  }, []);
  const activeUserHandler = (item: any) => {
    const paylaod = {
      intEmployeeId: item?.intEmployeeId,
    };

    const callback = () => {
      landingApiCall({});
    };

    const confirmObject = {
      closeOnClickOutside: false,
      message: "Are you want to sure you active this employee?",
      yesAlertFunc: () => {
        activeEmployeeHandler(paylaod, setLoading, callback);
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };
  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApi?.data?.currentPage,
          pageSize: landingApi?.data?.pageSize,
          index,
        }),
      fixed: "left",
      width: 35,
      align: "center",
    },

    {
      title: "Work. Group/Location",
      dataIndex: "strWorkplaceGroup",
      width: 120,
      fixed: "left",
    },
    {
      title: "Workplace/Concern",
      dataIndex: "strWorkplace",
      width: 150,
      fixed: "left",
    },
    {
      title: "Employee Id",
      dataIndex: "strEmployeeCode",
      width: 80,
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
      width: 120,
    },

    {
      title: "Designation",
      dataIndex: "strDesignation",

      width: 100,
    },

    {
      title: "Department",
      dataIndex: "strDepartment",

      width: 100,
    },
    {
      title: "Section",
      dataIndex: "strSection",

      width: 100,
    },

    {
      title: "Date of Joining",
      dataIndex: "dteJoiningDate",
      //   render: (_: any, rec: any) => dateFormatter(rec?.JoiningDate),
      width: 120,
    },
    {
      title: "Inactive Date",
      dataIndex: "dteLastInactivateDate",

      width: 100,
    },
    {
      title: "Last Present date      ",
      dataIndex: "dteLastPresentDate",
      width: 120,
    },
    {
      title: "Reason      ",
      dataIndex: "reason",
      width: 80,
    },
    {
      title: "Mobile Number            ",
      dataIndex: "strPersonalNumber",
      width: 100,
    },

    {
      title: "Status",
      dataIndex: "strStatus",
      render: (_: any, rec: any) => (
        <div className="d-flex align-items-center justify-content-center">
          <div>
            {rec?.strStatus === "Inactive" && (
              <Tag color="red">{rec?.strStatus}</Tag>
            )}
          </div>

          <Tooltip title="Active">
            <button
              type="button"
              className="iconButton mt-0 mt-md-2 mt-lg-0 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                activeUserHandler(rec);
              }}
            >
              <MdOutlineGroupAdd />
            </button>
          </Tooltip>
        </div>
      ),
      width: 80,
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
          landingApiCall();
        }}
      >
        <PCard>
          {(excelLoading || apiLoading || loading) && <Loading />}
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
                  getExcelData(
                    `/Employee/GetInactiveEmployeeList?BusinessUnitId=${buId}&WorkplaceGroupId=${
                      values?.workplaceGroup?.value || wgId
                    }&WorkplaceId=${
                      values?.workplace?.value || wId
                    }&IsXls=true&PageNo=1&PageSize=10000&FromDate=${moment(
                      values?.fromDate
                    ).format("YYYY-MM-DD")}&ToDate=${moment(
                      values?.toDate
                    ).format("YYYY-MM-DD")}`,
                    (res: any) => {
                      const newData = res?.data?.map(
                        (item: any, index: any) => {
                          return {
                            ...item,
                            sl: index + 1,
                          };
                        }
                      );
                      createCommonExcelFile({
                        titleWithDate: `Inactive Employee list for the month of ${getCurrentMonthName()}-${currentYear()}`,
                        fromDate: "",
                        toDate: "",
                        buAddress: (buDetails as any)?.strAddress,
                        businessUnit: values?.workplaceGroup?.value
                          ? (buDetails as any)?.strWorkplace
                          : buName,
                        tableHeader: column,
                        getTableData: () =>
                          getTableDataInactiveEmployees(
                            newData,
                            Object.keys(column)
                          ),
                        getSubTableData: () => {},
                        subHeaderInfoArr: [],
                        subHeaderColumn: [],
                        tableFooter: [],
                        extraInfo: {},
                        tableHeadFontSize: 10,
                        widthList: {
                          C: 30,
                          D: 30,
                          E: 25,
                          F: 20,
                          G: 25,
                          H: 25,
                          I: 25,
                          K: 20,
                        },
                        commonCellRange: "A1:J1",
                        CellAlignment: "left",
                      });
                    }
                  );

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
                  disabled={+id ? true : false}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplace: op,
                    });
                    getWorkplaceDetails(value, setBuDetails);
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
            data={landingApi?.data?.data || []}
            loading={landingApi?.loading}
            header={header}
            pagination={{
              pageSize: landingApi?.data?.pageSize,
              total: landingApi?.data?.totalCount,
            }}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              setFilterList(filters);

              landingApiCall({
                pagination,
              });
            }}
            // scroll={{ x: 2000 }}
          />
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default ActiveInactiveEmployeeReport;
