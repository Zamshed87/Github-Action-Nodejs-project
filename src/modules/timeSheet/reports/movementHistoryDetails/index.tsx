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
import { downloadFile } from "utility/downloadFile";

const MovementHistoryDetails = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, orgId, wId },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30438),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  //   const debounce = useDebounce();

  const [excelLoading, setExcelLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Instance
  const [form] = Form.useForm();
  //   api states
  // const CommonEmployeeDDL = useApiRequest([]);

  // const getEmployee = (value: any) => {
  //   if (value?.length < 2) return CommonEmployeeDDL?.reset();

  //   CommonEmployeeDDL?.action({
  //     urlKey: "CommonEmployeeDDL",
  //     method: "GET",
  //     params: {
  //       businessUnitId: buId,
  //       workplaceGroupId: wgId,
  //       searchText: value,
  //     },
  //     onSuccess: (res) => {
  //       res.forEach((item: any, i: number) => {
  //         res[i].label = item?.employeeName;
  //         res[i].value = item?.employeeId;
  //       });
  //     },
  //   });
  // };

  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Movement Details History";
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
      urlKey: "MovementDetailsHistory",
      method: "GET",
      params: {
        strPartName: "htmlView",
        intAccountId: orgId,
        intBusinessUnitId: buId,
        IsXls: false,
        intWorkplaceId: wId,
        IntWorkplaceGroupId: wgId,
        PageNo: pagination.current || 1,
        PageSize: pagination.pageSize || 25,
        dteFromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        dteToDate: moment(values?.toDate).format("YYYY-MM-DD"),
        StrStatus: values?.status?.value || 1,
        StrSearch: searchText,
      },
    });
  };

  useEffect(() => {
    landingApiCall();
  }, [wId]);

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
              current: landingApi?.data?.currentPage,
              pageSize: landingApi?.data?.totalCount,
            },
          });
        }}
      >
        <PCard>
          {(excelLoading || landingApi?.loading || loading) && <Loading />}
          <PCardHeader
            exportIcon={true}
            title={`Movement Details History`}
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
                    `/PdfAndExcelReport/MovementDetailsHistory?strPartName=excelView&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceId=${wId}&IntWorkplaceGroupId=${wgId}&DteFromDate=${moment(
                      values?.fromDate
                    ).format("YYYY-MM-DD")}&DteToDate=${moment(
                      values?.toDate
                    ).format("YYYY-MM-DD")}&StrStatus=${
                      values?.status?.value || 1
                    }&StrSearch=${values?.search || ""}`,
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
                  name="status"
                  label="Status"
                  allowClear
                  placeholder="Status"
                  options={[
                    { label: "All", value: 1 },
                    { label: "Approved", value: 2 },
                    { label: "Pending", value: 3 },
                    { label: "Rejected", value: 4 },
                  ]}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      status: op,
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

export default MovementHistoryDetails;
