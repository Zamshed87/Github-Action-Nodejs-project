import { Avatar, Form } from "antd";
import PReport from "common/CommonReport/PReport";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useApiRequest } from "Hooks";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { formatFilterValue } from "utility/filter/helper";
import PFilter from "utility/filter/PFilter";

const PayrollSummaryReport = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { orgId, buId },
    tokenData,
  } = useSelector((state) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item) => item?.menuReferenceId === 100),
    []
  );
  const decodedToken = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : null;
  // menu permission

  const landingApi = useApiRequest({});
  const [data, setData] = useState("");

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Payroll Summary";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const landingApiCall = (searchText = "") => {
    const values = form.getFieldsValue(true);
    setLoading(true);
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
        setLoading(false);
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
  const header = [
    {
      title: "SL",
      // render: (_, rec, index) =>
      //   (pages?.current - 1) * pages?.pageSize + index + 1,
      fixed: "left",
      width: 35,
      align: "center",
    },

    {
      title: "Work. Group/Location",
      dataIndex: "workplaceGroupName",
      width: 100,
      fixed: "left",
    },
    {
      title: "Workplace/Concern",
      dataIndex: "workplaceName",
      width: 120,
      fixed: "left",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      width: 50,
      fixed: "left",
    },

    {
      title: "Employee Name",
      dataIndex: "employeeName",
      render: (_, rec) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.employeeName} />
            <span className="ml-2">{rec?.employeeName}</span>
          </div>
        );
      },
      fixed: "left",
      width: 70,
    },

    {
      title: "Designation",
      dataIndex: "designationName",

      width: 70,
    },

    {
      title: "Department",
      dataIndex: "departmentName",

      width: 70,
    },
    {
      title: "Section",
      dataIndex: "sectionName",

      width: 70,
    },
    {
      title: "Duration (Day)",
      dataIndex: "rawDuration",
      //   render: (_: any, rec: any) => dateFormatter(rec?.JoiningDate),
      width: 100,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      width: 50,
    },
  ];
  return permission?.isView ? (
    <div>
      <PReport
        reportType="RDLC"
        reportName={"Payroll Summary Report"}
        pdfUrl="bbbb"
        excelUrl="aaa"
        form={form}
        data={data}
        loading={loading}
        setLoading={setLoading}
        // header={header}
        landingApiCall={landingApiCall}
        pageSize={landingApi?.data?.pageSize}
        totalCount={landingApi?.data?.totalCount}
        filter={
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
          />
        }
      />
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default PayrollSummaryReport;
