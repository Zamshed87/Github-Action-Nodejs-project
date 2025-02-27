import { PCard, PCardHeader, PForm, PSelect } from "Components";
import DownloadIcon from "@mui/icons-material/Download";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { useApiRequest } from "Hooks";
import { Col, Form, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { downloadFile, getPDFAction } from "utility/downloadFile";
import PFilter from "utility/filter/PFilter";
import { formatFilterValue } from "utility/filter/helper";
import { todayDate } from "utility/todayDate";
import { yearDDLAction } from "utility/yearDDL";

const EmLeaveHistory = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { orgId, buId },
    tokenData,
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 100),
    []
  );

  const decodedToken = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : null;
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  const [data, setData] = useState("");

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Leave History";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const landingApiCall = (searchText = "") => {
    const values = form.getFieldsValue(true);

    landingApi.action({
      urlKey: "GetLeaveHistoryReport",
      method: "GET",
      params: {
        strPartName: "htmlView",
        intAccountId: orgId,
        intYear: values?.yearDDL?.value,
        departments: formatFilterValue(values?.department),
        designations: formatFilterValue(values?.designation),
        strSearchTxt: searchText || "",
        BusinessUnitId: buId,
        WorkplaceGroupList:
          values?.workplaceGroup?.value == 0 ||
          values?.workplaceGroup?.value == undefined
            ? decodedToken.workplaceGroupList
            : values?.workplaceGroup?.value.toString(),
        WorkplaceList:
          values?.workplace?.value == 0 || values?.workplace?.value == undefined
            ? decodedToken.workplaceList
            : values?.workplace?.value.toString(),
      },
      onSuccess: (res) => {
        setData(res);
      },
    });
  };

  useEffect(() => {
    form.setFieldValue("yearDDL", { value: new Date().getFullYear() });
    landingApiCall();
  }, []);
  const searchFunc = debounce((value) => {
    landingApiCall(value);
  }, 500);

  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{}}
        onFinish={() => {
          landingApiCall();
        }}
      >
        <PCard>
          {(landingApi?.loading || loading) && <Loading />}
          <PCardHeader
            backButton
            // exportIcon={true}
            title={`Leave History`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
          />
          <PFilter
            form={form}
            ishideDate={true}
            landingApiCall={() => {
              landingApiCall();
            }}
            resetApiCall={() => {
              form.setFieldValue("yearDDL", {
                value: new Date().getFullYear(),
              });
            }}
          >
            <Col md={12} sm={12} xs={24}>
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
          </PFilter>
          <div>
            {data && (
              <ul className="d-flex flex-row-reverse mt-3 align-items-center justify-content-start">
                <li className="pr-2 ml-2">
                  <Tooltip title="Download as Excel">
                    <button
                      className="btn-save"
                      type="button"
                      onClick={(e) => {
                        const values = form.getFieldsValue(true);
                        e.stopPropagation();
                        const url = `/PdfAndExcelReport/GetLeaveHistoryReport?strPartName=excelView&intAccountId=${orgId}&intYear=${
                          values?.yearDDL?.value
                        }&departments=${formatFilterValue(
                          values?.department
                        )}&designations=${formatFilterValue(
                          values?.designation
                        )}&strSearchTxt=${
                          values?.search || ""
                        }&WorkplaceGroupList=${
                          values?.workplaceGroup?.value == 0 ||
                          values?.workplaceGroup?.value == undefined
                            ? decodedToken.workplaceGroupList
                            : values?.workplaceGroup?.value.toString()
                        }&WorkplaceList=${
                          values?.workplace?.value == 0 ||
                          values?.workplace?.value == undefined
                            ? decodedToken.workplaceList
                            : values?.workplace?.value.toString()
                        }`;

                        downloadFile(
                          url,
                          `Monthly Leave History- ${todayDate()}`,
                          "xlsx",
                          setLoading
                        );
                      }}
                      style={{
                        border: "transparent",
                        width: "30px",
                        height: "30px",
                        background: "#f2f2f7",
                        borderRadius: "100px",
                      }}
                    >
                      <DownloadIcon
                        sx={{
                          color: "#101828",
                          fontSize: "16px",
                        }}
                      />
                    </button>
                  </Tooltip>
                </li>
                <li>
                  <Tooltip title="Print as PDF">
                    <button
                      className="btn-save"
                      type="button"
                      onClick={(e) => {
                        const values = form.getFieldsValue(true);
                        e.stopPropagation();
                        const url = `/PdfAndExcelReport/GetLeaveHistoryReport?strPartName=pdfView&intAccountId=${orgId}&intYear=${
                          values?.yearDDL?.value
                        }&departments=${formatFilterValue(
                          values?.department
                        )}&designations=${formatFilterValue(
                          values?.designation
                        )}&strSearchTxt=${
                          values?.search || ""
                        }&WorkplaceGroupList=${
                          values?.workplaceGroup?.value == 0 ||
                          values?.workplaceGroup?.value == undefined
                            ? decodedToken.workplaceGroupList
                            : values?.workplaceGroup?.value.toString()
                        }&WorkplaceList=${
                          values?.workplace?.value == 0 ||
                          values?.workplace?.value == undefined
                            ? decodedToken.workplaceList
                            : values?.workplace?.value.toString()
                        }`;

                        getPDFAction(url, setLoading);
                      }}
                      // disabled={resDetailsReport?.length <= 0}
                      style={{
                        border: "transparent",
                        width: "30px",
                        height: "30px",
                        background: "#f2f2f7",
                        borderRadius: "100px",
                      }}
                    >
                      <LocalPrintshopIcon
                        sx={{
                          color: "#101828",
                          fontSize: "16px",
                        }}
                      />
                    </button>
                  </Tooltip>
                </li>
              </ul>
            )}
          </div>
          {data && (
            <div
              style={{ overflow: "scroll", marginTop: "-35px" }}
              className=" w-100"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: data,
                }}
              />
            </div>
          )}
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default EmLeaveHistory;
