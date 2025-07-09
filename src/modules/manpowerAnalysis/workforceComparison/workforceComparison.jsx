import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "common/loading/Loading";
import {
  DataTable,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PSelect,
  PButton,
} from "Components";
import { Col, Form, Row } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { toast } from "react-toastify";
import { useApiRequest } from "Hooks";
import { fetchWorkforceTypeWiseData } from "./helper";
import { useLocation } from "react-router-dom";
import { downloadFile } from "utility/downloadFile";

const WorkForceComparison = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();

  

  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const { orgId, buId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [selectedYearType, setSelectedYearType] = useState(null);
  const [selectedComparisonType, setSelectedComparisonType] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showData, setShowData] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });

  // State for form data and loading
  const hideSubmitBtn = false;
  useEffect(() => {
    // Data will be loaded when user clicks "View" button
    console.log("Component initialized - no data loaded yet");
  }, []);

  const fetchWorkforceData = async (page = 1, pageSize = 25) => {
    const { yearType, selectYear, workplace, ComparisonType } =
      form.getFieldsValue();

    const yearTypeId =
      yearType?.intId || (yearType?.value === "calendar" ? 1 : 2);
    const [fromDate, toDate] = selectYear?.label?.includes("-")
      ? selectYear.label.split("-")
      : [selectYear?.value, null]; // If it's a single year, set toDate as null

    if (
      !yearTypeId ||
      !fromDate ||
      !workplace?.value ||
      !ComparisonType?.intId
    ) {
      toast.error("Please fill all required fields before viewing data");
      return;
    }

    setShowData(false);
    setTableData([]);
    setLoading(true);

    try {
      const result = await fetchWorkforceTypeWiseData({
        yearType: yearTypeId,
        fromDate,
        toDate,
        workplaceId: workplace?.value,
        planningTypeId: ComparisonType?.intId,
        pageNo: page,
        pageSize: pageSize,
        setTableData,
        setPagination,
        setShowData,
      });

      setShowData(true);
      toast.success("Workforce data loaded successfully!");
    } catch {
      setPagination({
        current: page,
        pageSize: pageSize,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const getHeader = () => {
    const baseColumns = [
      {
        title: "SL",
        dataIndex: "sl",
        key: "sl",
        width: 60,
        align: "center",
      },
      {
        title: "Workplace Group",
        dataIndex: "workplaceGroup",
        key: "workplaceGroup",
        width: 180,
      },
      {
        title: "Workplace",
        dataIndex: "workplace",
        key: "workplace",
        width: 220,
      },
    ];

    if (selectedComparisonType === "department") {
      baseColumns.push({
        title: "Department",
        dataIndex: "department",
        key: "department",
        width: 200,
      });
    } else if (selectedComparisonType === "section") {
      baseColumns.push({
        title: "Section",
        dataIndex: "section",
        key: "section",
        width: 200,
      });
    } else if (selectedComparisonType === "hrPosition") {
      baseColumns.push({
        title: "HR Position",
        dataIndex: "hrPosition",
        key: "hrPosition",
        width: 200,
      });
    } else if (selectedComparisonType === "designation") {
      baseColumns.push({
        title: "Designation",
        dataIndex: "designation",
        key: "designation",
        width: 200,
      });
    } else {
      // Default: show all columns
      baseColumns.push(
        {
          title: "Department",
          dataIndex: "department",
          key: "department",
          width: 150,
        },
        {
          title: "Section",
          dataIndex: "section",
          key: "section",
          width: 150,
        },
        {
          title: "HR Position",
          dataIndex: "hrPosition",
          key: "hrPosition",
          width: 150,
        },
        {
          title: "Designation",
          dataIndex: "designation",
          key: "designation",
          width: 150,
        }
      );
    }

    // Add common columns
    baseColumns.push(
      {
        title: "Budgeted Manpower",
        dataIndex: "budgetedManpower",
        key: "budgetedManpower",
      },
      {
        title: "Current Manpower",
        dataIndex: "currentManpower",
        key: "currentManpower",
        width: 120,
        align: "center",
        render: (value) => (
          <span style={{ color: "#1890ff", fontWeight: "bold" }}>{value}</span>
        ),
      },

      {
        title: "Difference",
        dataIndex: "difference",
        render: (value) => (
          <span
            style={{ color: value > 0 ? "green" : value < 0 ? "red" : "black" }}
          >
            {value > 0 ? `+${value}` : value}
          </span>
        ),
        width: 120,
      },
      {
        title: "Comments",
        dataIndex: "comments",
        key: "comments",
        width: 100,
      }
    );

    return baseColumns;
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Workforce Comparison Create/Edit | PeopleDesk";

    // Cleanup function to reset the title when the component unmounts
    return () => {
      document.title = "PeopleDesk";
    };
  }, [dispatch]);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30624) {
      permission = item;
    }
  }); // API requests for dropdowns
  const workplaceDDL = useApiRequest([]);
  const getFiscalDDL = useApiRequest([]);

  const getWorkplace = () => {
    workplaceDDL?.action({
      urlKey: "WorkplaceIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };

  // Get year options based on selected year type
  const getYearOptions = () => {
    if (selectedYearType === "calendar") {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        years.push({ label: i.toString(), value: i });
      }
      return years;
    } else if (selectedYearType === "fiscal") {
      // Return fiscal years from API
      return getFiscalDDL.data || [];
    }
    return [];
  };

  // Load year data when year type changes
  const loadYearData = (yearType) => {
    if (yearType === "fiscal") {
      getFiscalYearDDL();
    }
  };
  const getFiscalYearDDL = () => {
    getFiscalDDL.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "fiscalYearDDL",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.label;
          res[i].value = item?.value;
        });
      },
    });
  };

  // Dynamic label for Year field - based on year type
  const getYearLabel = () => {
    if (selectedYearType === "calendar") {
      return "Calendar Year";
    } else if (selectedYearType === "fiscal") {
      return "Fiscal Year";
    }
    return "Select Year";
  };

  useEffect(() => {
    getWorkplace();
  }, [orgId, buId, wgId, wId]);


  return permission?.isView ? (
    <PForm
      form={form}
      initialValues={{}}
      onFinish={() => {
        fetchWorkforceData(1, pagination.pageSize);
      }}
    >
      {loading && <Loading />}
      <PCard>
        <PCardHeader
          title={`Workforce Comparison`}
          exportIcon
          onExport={() => {
            const excelLanding = async () => {
              if (tableData?.length === 0) return null;
              try {
                const { yearType, selectYear, workplace, ComparisonType } =
                  form.getFieldsValue();
                const yearTypeId =
                  yearType?.intId || (yearType?.value === "calendar" ? 1 : 2);
                const [fromDate, toDate] = selectYear?.label?.includes("-")
                  ? selectYear.label.split("-")
                  : [selectYear?.value, null];
                const workplaceId = workplace?.value;
                const planningTypeId = ComparisonType?.intId;
                // Use current pagination or export all (set pageSize to a large number if needed)
                const pageNo = 1;
                const pageSize = pagination.total || 1000;

                let url = `/WorkforcePlanning/WorkforceComparisonExcelReport?pageSize=${pageSize}&YearTypeId=${yearTypeId}&FromDate=${fromDate}&WorkplaceId=${workplaceId}&PlanningTypeId=${planningTypeId}&pageNo=${pageNo}`;
                if (toDate) url += `&ToDate=${toDate}`;

                downloadFile(
                  url,
                  "Workforce Comparison",
                  "xlsx",
                  setLoading
                );
              } catch (error) {
                console.log("error", error);
              }
            };
            excelLanding();
          }}
        />
        <PCardBody className="mb-3">
          <Row gutter={[10, 2]}>
            {" "}
            <Col md={4} sm={12} xs={24}>
              <PSelect
                options={[
                  { label: "Calendar Year", value: "calendar", intId: 1 },
                  { label: "Fiscal Year", value: "fiscal", intId: 2 },
                ]}
                name="yearType"
                disabled={location.state}
                showSearch
                filterOption={true}
                label="Year Type"
                placeholder="Select Year Type"
                onChange={(value, option) => {
                  form.setFieldsValue({ yearType: option });
                  setSelectedYearType(value);
                  form.setFieldsValue({ selectYear: null });
                  loadYearData(value);
                }}
                rules={[{ required: true, message: "Year Type is required" }]}
              />
            </Col>{" "}
            <Col md={4} sm={12} xs={24}>
              <PSelect
                options={getYearOptions()}
                name="selectYear"
                showSearch
                filterOption={true}
                label={`${getYearLabel()}`}
                placeholder={`Select ${getYearLabel()}`}
                onChange={(value, option) => {
                  form.setFieldsValue({ selectYear: option });
                }}
                disabled={!selectedYearType || location.state}
                loading={
                  selectedYearType === "fiscal" ? getFiscalDDL.loading : false
                }
                rules={[
                  {
                    required: true,
                    message: `${getYearLabel()} selection is required`,
                  },
                ]}
              />
            </Col>
            <Col md={4} sm={12} xs={24}>
              <PSelect
                options={workplaceDDL.data || []}
                name="workplace"
                label="Workplace"
                placeholder="Select Workplace"
                disabled={location.state}
                onChange={(value, option) => {
                  form.setFieldsValue({ workplace: option });
                }}
                loading={workplaceDDL.loading}
                rules={[{ required: true, message: "Workplace is required" }]}
              />{" "}
            </Col>
            <Col md={4} sm={12} xs={24}>
              <PSelect
                options={[
                  { label: "Department", value: "department", intId: 1 },
                  { label: "Section", value: "section", intId: 2 },
                  { label: "HR Position", value: "hrPosition", intId: 3 },
                  { label: "Designation", value: "designation", intId: 4 },
                ]}
                name="ComparisonType"
                label="Comparison Type"
                placeholder="Select Comparison Type"
                disabled={location.state}
                onChange={(value, option) => {
                  form.setFieldsValue({ ComparisonType: option });
                  setSelectedComparisonType(value);
                  form.setFieldsValue({ departmentSection: null });
                  setTableData([]);
                }}
                rules={[
                  { required: true, message: "Comparison Type is required" },
                ]}
              />
            </Col>
            {!hideSubmitBtn && (
              <Col style={{ marginTop: "23px" }}>
                <PButton
                  type="primary"
                  action="submit"
                  content="View"
                  disabled={location.state}
                />
              </Col>
            )}
          </Row>
        </PCardBody>
        {/* Only show DataTable when showData is true */}
        {showData && (
          <DataTable
            header={getHeader()}
            bordered
            data={tableData || []}
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                setPagination((prev) => ({
                  ...prev,
                  current: page,
                  pageSize: pageSize,
                }));
                fetchWorkforceData(page, pageSize);
              },
            }}
          />
        )}
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};
export default WorkForceComparison;
