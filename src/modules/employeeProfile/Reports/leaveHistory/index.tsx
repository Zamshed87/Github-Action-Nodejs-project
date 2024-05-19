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
import { debounce } from "lodash";

import { getPDFAction } from "utility/downloadFile";
import { column, hasLeave } from "./helper";
import { yearDDLAction } from "utility/yearDDL";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { getCurrentMonthName } from "utility/monthIdToMonthName";
import { currentYear } from "modules/CompensationBenefits/reports/salaryReport/helper";
import { getTableDataInactiveEmployees } from "modules/employeeProfile/inactiveEmployees/helper";
import { toast } from "react-toastify";

const EmLeaveHistory = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, employeeId, buName },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 100),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  const [, getExcelData, apiLoading] = useAxiosGet();

  const [, setFilterList] = useState({});
  const [buDetails, setBuDetails] = useState({});
  const [excelLoading, setExcelLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  // Form Instance
  const [form] = Form.useForm();
  //   api states
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Leave History";
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
      urlKey: "LeaveBalanceHistoryForAllEmployee",
      method: "GET",
      params: {
        BusinessUnitId: buId,
        yearId: values?.yearDDL?.value,
        PageSize: pagination?.pageSize || 500,
        PageNo: pagination?.current || 1,
        IsPaginated: true,
        SearchText: searchText || "",
        WorkplaceGroupId: values?.workplaceGroup?.value,
        WorkplaceId: values?.workplace?.value,
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
      title: "Work. Group/Location",
      dataIndex: "workplaceGroup",
      width: 55,
      fixed: "left",
    },
    {
      title: "Workplace/Concern",
      dataIndex: "workplace",
      width: 55,
      fixed: "left",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      width: 35,
      fixed: "left",
    },

    {
      title: "Employee Name",
      dataIndex: "employee",
      render: (_: any, rec: any) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.employee} />
            <span className="ml-2">{rec?.employee}</span>
          </div>
        );
      },
      fixed: "left",
      width: 60,
    },

    {
      title: "Designation",
      dataIndex: "designation",

      width: 70,
    },

    {
      title: "Department",
      dataIndex: "department",

      width: 70,
    },
    {
      title: "Section",
      dataIndex: "section",

      width: 70,
    },

    {
      title: "CL",
      dataIndex: "clTaken",
      render: (_: any, rec: any) => (
        <span>
          {rec?.clTaken || 0}/{rec?.clBalance || 0}
        </span>
      ),
      width: 30,
    },
    {
      title: "SL",
      dataIndex: "slTaken",
      render: (_: any, rec: any) => (
        <span>
          {rec?.slTaken || 0}/{rec?.slBalance || 0}
        </span>
      ),
      width: 30,
    },
    {
      title: "EL",
      dataIndex: "elTaken",
      render: (_: any, rec: any) => (
        <span>
          {rec?.elTaken || 0}/{rec?.elBalance || 0}
        </span>
      ),
      width: 30,
    },
    {
      title: "LWP",
      dataIndex: "lwpTaken",
      render: (_: any, rec: any) => (
        <span>
          {rec?.lwpTaken || 0}/{rec?.lwpBalance || 0}
        </span>
      ),
      width: 30,
    },
    {
      title: "ML",
      dataIndex: "CL",
      render: (_: any, rec: any) => (
        <span>
          {rec?.mlTaken || 0}/{rec?.mlBalance || 0}
        </span>
      ),
      width: 30,
    },
  ];
  const searchFunc = debounce((value) => {
    landingApiCall({
      searchText: value,
    });
  }, 500);

  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{}}
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
              const excelLanding = async () => {
                setExcelLoading(true);
                try {
                  const values = form.getFieldsValue(true);
                  getExcelData(
                    `/Employee/LeaveBalanceHistoryForAllEmployee?BusinessUnitId=${buId}&yearId=${values.yearDDL?.value}&WorkplaceGroupId=${values?.workplaceGroup?.value}&WorkplaceId=${values?.workplace?.value}&IsPaginated=false&PageNo=0&PageSize=0`,
                    (res: any) => {
                      const newData = res?.data?.map(
                        (item: any, index: any) => {
                          return {
                            ...item,
                            sl: index + 1,
                            clTaken: `${item?.clTaken || 0}/${
                              item?.clBalance || 0
                            }`,
                            slTaken: `${item?.slTaken || 0}/${
                              item?.slBalance || 0
                            }`,
                            elTaken: `${item?.elTaken || 0}/${
                              item?.elBalance || 0
                            }`,
                            LWP: `${item?.lwpTaken || 0}/${
                              item?.lwpBalance || 0
                            }`,
                            ML: `${item?.mlTaken || 0}/${item?.mlBalance || 0}`,
                          };
                        }
                      );
                      createCommonExcelFile({
                        titleWithDate: `Leave History Report for the month of ${getCurrentMonthName()}-${currentYear()}`,
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
                          D: 15,
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
                <PSelect
                  options={yearDDLAction(2, 0) || []}
                  name="yearDDL"
                  label="Year"
                  placeholder="Year"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      yearDDL: op,
                    });
                  }}
                  rules={[{ required: true, message: "Year is required" }]}
                />
              </Col>

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
                hasLeave(record) &&
                  getPDFAction(
                    `/PdfAndExcelReport/LeaveHistoryReport?EmployeeId=${record?.employeeId}&fromDate=${values?.yearDDL?.value}-01-01&toDate=${values?.yearDDL?.value}-12-31`,
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

export default EmLeaveHistory;
