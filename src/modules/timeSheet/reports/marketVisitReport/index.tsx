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
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getDateOfYear } from "utility/dateFormatter";
import {} from "react-icons/md";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { downloadFile, getPDFAction } from "utility/downloadFile";

const MarketVisitReport = () => {
  const dispatch = useDispatch();
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
  const CommonEmployeeDDL = useApiRequest([]);
  //   const debounce = useDebounce();

  const [excelLoading, setExcelLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Instance
  const [form] = Form.useForm();

  const getEmployee = (value: any) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        // workplaceId: wId,
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

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Market Visit Report";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

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

    landingApi.action({
      urlKey: "MarketVisitReport",
      method: "GET",
      params: {
        format: "html",
        intAccountId: orgId,
        intWorkplaceId: wId,
        employeeId: values?.employee?.value || 0,
        fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values?.toDate).format("YYYY-MM-DD"),
        strSearch: searchText || "",
      },
    });
  };

  // useEffect(() => {
  //   landingApiCall();
  // }, [wId]);

  const searchFunc = debounce((value) => {
    landingApiCall({
      searchText: value,
    });
  }, 500);

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
              current: landingApi?.data?.currentPage || 0,
              pageSize: landingApi?.data?.totalCount || 0,
            },
          });
        }}
      >
        <PCard>
          {(excelLoading || landingApi?.loading || loading) && <Loading />}
          <PCardHeader
            exportIcon={true}
            printIcon={true}
            title={`Market Visit Report`}
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
                  downloadFile(
                    `/MarketVisitReport/MarketVisitReport?format=excel&intAccountId=${orgId}&intWorkplaceId=${wId}&fromDate=${moment(
                      values?.fromDate
                    ).format("YYYY-MM-DD")}&toDate=${moment(
                      values?.toDate
                    ).format("YYYY-MM-DD")}&strSearch=${values?.search || ""}`,
                    "Movement Details History",
                    "xlsx",
                    setLoading
                  );
                  setExcelLoading(false);
                } catch (error: any) {
                  toast.error("Failed to download excel");
                  setExcelLoading(false);
                }
              };
              excelLanding();
            }}
            pdfExport={() => {
              const values = form.getFieldsValue(true);
              getPDFAction(
                `/MarketVisitReport/MarketVisitReport?format=pdf&intAccountId=${orgId}&intWorkplaceId=${wId}&fromDate=${moment(
                  values?.fromDate
                ).format("YYYY-MM-DD")}&toDate=${moment(values?.toDate).format(
                  "YYYY-MM-DD"
                )}&strSearch=${values?.search || ""}`,
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
                  onChange={(value) => {
                    form.setFieldsValue({
                      toDate: value,
                    });
                  }}
                />
              </Col>

              <Col md={5} sm={12} xs={24}>
                <PSelect
                  name="employee"
                  label="Select a Employee"
                  placeholder="Search Min 2 char"
                  options={CommonEmployeeDDL?.data || []}
                  loading={CommonEmployeeDDL?.loading}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      employee: op,
                    });
                  }}
                  onSearch={(value) => {
                    getEmployee(value);
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
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default MarketVisitReport;
