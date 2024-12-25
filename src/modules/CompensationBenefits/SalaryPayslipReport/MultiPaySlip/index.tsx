import {
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { paginationSize } from "common/AntTable";
import { getPeopleDeskAllDDL } from "common/api";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { debounce } from "lodash";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";

const MarketVisitReport = () => {
  const dispatch = useDispatch();
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
  });
  const {
    permissionList,
    profileData: { buId, wgId, orgId, wId },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30510),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  const [payrollPeiodDDL, setPayrollPeiodDDL] = useState([]);
  const [employeeDDL, setEmployeeDDL] = useState([]);
  const [excelLoading, setExcelLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Form Instance
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Multiple Payslip";
  }, [dispatch]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

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

    const employeeIdList = values?.employee?.map((item: any) => item?.value).join(",");

    landingApi.action({
      urlKey: "GetBanglaPaysilp",
      method: "GET",
      params: {
        format: "HTML",
        intAccountId: orgId,
        intWorkplaceId: wId,
        employeeId: employeeIdList || "",
        month: moment(values?.date).format("MM"),
        year: moment(values?.date).format("YYYY"),
        salaryGenerateRequestId: values?.salaryCode || 0,
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong",
          {
            toastId: "marketvisitreport_error",
          }
        );
      },
    });
  };

  const searchFunc = debounce((value: any) => {
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
              current: landingApi?.data?.currentPage || 0,
              pageSize: landingApi?.data?.totalCount || 0,
            },
          });
        }}
      >
        <PCard>
          {(excelLoading || landingApi?.loading || loading) && <Loading />}
          <PCardHeader
            printIcon={true}
            title={`Multiple Pay Slip`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
            pdfExport={() => {
              try {
                reactToPrintFn();
                // getPDFAction(
                //   `/SalaryReport/GetBanglaPaysilp?format=pdf&intAccountId=${orgId}&intWorkplaceId=${wId}&month=${month || 0}&year=${year || 0}&employeeId=${
                //     values?.employee?.value || 0
                //   }&salaryGenerateRequestId=${values?.salaryCode || 0}`,
                //   setLoading
                // );
              } catch (error: any) {
                toast.error(
                  error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong",
                  {
                    toastId: "marketvisitreport_error",
                  }
                );
              }
            }}
          />
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="date"
                  label="Date"
                  picker="month"
                  placeholder="Date"
                  onChange={(value) => {
                    const values = form.getFieldsValue(true);
                    form.setFieldsValue({
                      date: value,
                      salaryCode: undefined,
                      employee: undefined
                    });
                    const month = moment(value).format("MM");
                    const year = moment(value).format("YYYY");
                    setMonth(month);
                    setYear(year);

                    getPeopleDeskAllDDL(
                      `/PeopleDeskDdl/GetSalaryCodes?AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${
                        values?.employee?.value || 0
                      }&month=${month || 0}&year=${year || 0}`,
                      "value",
                      "label",
                      setPayrollPeiodDDL
                    );
                  }}
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  name="salaryCode"
                  label="Salary Code"
                  placeholder="Salary Code"
                  allowClear={true}
                  options={payrollPeiodDDL || []}
                  onChange={(value) => {
                    form.setFieldsValue({
                      salaryCode: value,
                      employee: undefined
                    });
                    
                    getPeopleDeskAllDDL(
                      `/PeopleDeskDdl/GetEmployeesBySalaryCode?salaryId=${
                        value || 0
                      }&month=${month || 0}&year=${year || 0}`,
                      "value",
                      "label",
                      setEmployeeDDL
                    );
                  }}
                />
              </Col>

              <Col md={5} sm={12} xs={24}>
                <PSelect
                  mode="multiple"
                  name="employee"
                  label="Select a Employee"
                  placeholder="Search Min 2 char"
                  allowClear={true}
                  options={employeeDDL || []}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      employee: op,
                    });
                  }}
                  showSearch
                  filterOption={false}
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
        </PCard>
        {landingApi?.data?.length > 0 ? (
          <div className="table-card-body mt-3" style={{ overflow: "hidden" }}>
            <div>
              <>
                <div className="sme-scrollable-table">
                  <div
                    className="scroll-table scroll-table-height"
                    dangerouslySetInnerHTML={{ __html: landingApi?.data }}
                  ></div>
                </div>
              </>
            </div>
          </div>
        ) : null}
      </PForm>
      <div style={{ overflow: "scroll" }} className="mt-3 w-100">
        <div style={{ display: "none" }}>
          <div ref={contentRef}>
            <div className="invoice-header"></div>
            <table>
              <thead>
                <tr>
                  <td
                    style={{
                      border: "none",
                    }}
                  >
                    <div
                      style={{
                        height: "150px",
                      }}
                    ></div>
                  </td>
                </tr>
              </thead>

              <tbody>
                {/* CONTENT GOES HERE */}
                <div
                  style={{ marginTop: "70px", marginLeft: "70px" }}
                  dangerouslySetInnerHTML={{
                    __html: landingApi?.data,
                  }}
                />
              </tbody>

              <tfoot>
                <tr>
                  <td
                    style={{
                      border: "none",
                    }}
                  >
                    <div
                      style={{
                        height: "100px",
                      }}
                    ></div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default MarketVisitReport;
