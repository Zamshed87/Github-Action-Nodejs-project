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
import { Col, Form, Row, Input, InputNumber } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { toast } from "react-toastify";
import { useApiRequest } from "Hooks";
import { fetchWorkforceTypeWiseData } from "./helper";
import { useLocation } from "react-router-dom";
import axios from "axios";

const WorkForceCreate = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();

  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const { orgId, buId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [selectedYearType, setSelectedYearType] = useState(null);
  const [selectedPlanningType, setSelectedPlanningType] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showData, setShowData] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for form data and loading
  const hideSubmitBtn = false;


  const fetchWorkforceData = async () => {
    const { yearType, selectYear, workplace, planningType } =
      form.getFieldsValue();

    const yearTypeId =
      yearType?.intId || (yearType?.value === "calendar" ? 1 : 2);
    const [fromDate, toDate] = selectYear?.label?.includes("-")
      ? selectYear.label.split("-")
      : [selectYear?.value, null]; // If it's a single year, set toDate as null

    if (!yearTypeId || !fromDate || !workplace?.value || !planningType?.intId) {
      toast.error("Please fill all required fields before viewing data");
      return;
    }

    setShowData(false);
    setTableData([]);
    setLoading(true); // <-- start loading

    try {
      const result = await fetchWorkforceTypeWiseData({
        yearType: yearTypeId,
        fromDate,
        toDate,
        workplaceId: workplace?.value,
        planningTypeId: planningType?.intId,
      });

      if (result.statusCode === 200 && Array.isArray(result.data)) {
        setTableData(
          result.data.map((item, idx) => ({
            id: item.id,
            sl: idx + 1,
            department: item.type === "Department" ? item.name : "",
            section: item.type === "Section" ? item.name : "",
            hrPosition: item.type === "HrPosition" ? item.name : "",
            designation: item.type === "Designation" ? item.name : "",
            currentManpower: item.value,
            budgetedManpower: item.value,
            comments: "",
          }))
        );
        setShowData(true);
        toast.success("Workforce data loaded successfully!");
      } else {
        toast.error("Failed to load workforce data");
      }
    } catch {
      toast.error("Error fetching workforce data");
    } finally {
      setLoading(false); // <-- stop loading
    }
  };

  const getHeader = () => {
    const baseColumns = [
      {
        title: "SL",
        dataIndex: "sl",
        key: "sl",
        width: 50,
        align: "center",
      },
    ];

    if (selectedPlanningType === "department") {
      baseColumns.push({
        title: "Department",
        dataIndex: "department",
        key: "department",
        width: 200,
      });
    } else if (selectedPlanningType === "section") {
      baseColumns.push({
        title: "Section",
        dataIndex: "section",
        key: "section",
        width: 200,
      });
    } else if (selectedPlanningType === "hrPosition") {
      baseColumns.push({
        title: "HR Position",
        dataIndex: "hrPosition",
        key: "hrPosition",
        width: 200,
      });
    } else if (selectedPlanningType === "designation") {
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
        title: "Budgeted Manpower",
        dataIndex: "budgetedManpower",
        key: "budgetedManpower",
        width: 150,
        align: "center",
        render: (value, record, index) => (
          <InputNumber
            min={0}
            max={999}
            value={value}
            onChange={(newValue) => {
              const newData = [...tableData];
              newData[index].budgetedManpower = newValue;
              setTableData(newData);
            }}
            style={{ width: "100%" }}
          />
        ),
      },
      {
        title: "Comments",
        dataIndex: "comments",
        key: "comments",
        width: 250,
        render: (value, record, index) => (
          <Input.TextArea
            value={value}
            onChange={(e) => {
              const newData = [...tableData];
              newData[index].comments = e.target.value;
              setTableData(newData);
            }}
            rows={1}
            placeholder="Enter comments..."
          />
        ),
      }
    );

    return baseColumns;
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Workforce Planning Create/Edit | PeopleDesk";

    // Cleanup function to reset the title when the component unmounts
    return () => {
      document.title = "PeopleDesk";
    };
  }, [dispatch]);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30623) {
      permission = item;
    }
  }); // API requests for dropdowns
  const workplaceDDL = useApiRequest([]);
  const getFiscalDDL = useApiRequest([]);
  const saveWorkforceData = useApiRequest({});

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

  // Handle save functionality
  const handleSave = () => {
    const formValues = form.getFieldsValue();

    // Validate required fields
    if (
      !formValues.workplace ||
      !formValues.yearType ||
      !formValues.selectYear ||
      !formValues.planningType
    ) {
      toast.error("Please fill all required fields before saving");
      return;
    }

    if (!tableData || tableData.length === 0) {
      toast.error("No data to save. Please view data first.");
      return;
    }

    const [fromDate, toDate] = formValues?.selectYear?.label?.includes("-")
      ? formValues.selectYear.label.split("-")
      : [formValues.selectYear?.value, null];

    // Prepare payload according to the specified structure
    const payload = {
      workplaceId: formValues.workplace?.value || formValues.workplace,
      yearTypeId:
        formValues.yearType?.intId ||
        (formValues.yearType?.value === "calendar" ? 1 : 2),
      fromDate: fromDate,
      toDate: toDate,
      planningTypeId: formValues.planningType?.intId,
      rowData: tableData.map((item) => ({
        headerId: item.headerId || 0,
        typeId: item.id,
        currentValue: item.currentManpower,
        targetValue: item.budgetedManpower,
        remark: item.comments || "",
      })),
    };

    setLoading(true);

    // Make API call to save data
    saveWorkforceData.action({
      urlKey: `${
        location.state ? "WorkforcePlanningUpdate" : "WorkforcePlanningCreate"
      }`,
      method: location.state ? "PUT" : "POST",
      payload: payload,
      onSuccess: () => {
        toast.success("Workforce planning data saved successfully!");
        setLoading(false); // <-- stop loading
      },
      onError: (error) => {
        // Show API error message if present
        if (
          error?.response?.data?.message &&
          Array.isArray(error.response.data.message)
        ) {
          error.response.data.message.forEach((msg) => toast.error(msg));
        } else if (error?.message) {
          toast.error(error.message);
        } else {
          toast.error("Failed to save workforce planning data");
        }
        setLoading(false);
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


  useEffect(() => {
    // If coming from edit, set initial values from location.state and fetch data
    const fetchEditData = async (workplaceId, yearTypeId, fromYear, toYear) => {
      try {
        setLoading(true);
        let url = `/WorkforcePlanning/GetById?WorkplaceId=${workplaceId}&YearTypeId=${yearTypeId}&FromDate=${fromYear}`;
        if (toYear) {
          url += `&ToDate=${toYear}`;
        }
        const res = await axios.get(url);
        if (res.data?.statusCode === 200 && res.data?.data) {
          const d = res.data.data;

          // --- Fiscal year merge logic ---
          let mergedRowData = d.rowData;
          if (d.yearTypeId === 2 && d.fromDate === d.toDate) {
            // Merge by typeId
            const map = {};
            d.rowData.forEach(item => {
              if (!map[item.typeId]) {
                map[item.typeId] = { ...item };
              } else {
                map[item.typeId].currentValue += item.currentValue;
                map[item.typeId].targetValue += item.targetValue;
                map[item.typeId].remark = [map[item.typeId].remark, item.remark].filter(Boolean).join(" | ");
              }
            });
            mergedRowData = Object.values(map);
          }

          form.setFieldsValue({
            workplace: { value: d.workplaceId, label: d.workplaceName },
            yearType: {
              value: d.yearTypeId === 1 ? "calendar" : "fiscal",
              intId: d.yearTypeId,
              label: d.yearTypeName,
            },
            selectYear:
              d.yearTypeId === 2
                ? { value: d.calenderYearId, label: `${d.fromDate}-${d.toDate}` }
                : { value: d.fromDate, label: d.fromDate?.toString() },
            planningType: {
              value: getPlanningTypeValue(d.planningTypeId),
              intId: d.planningTypeId,
            },
          });
          setSelectedYearType(d.yearTypeId === 1 ? "calendar" : "fiscal");
          setSelectedPlanningType(getPlanningTypeValue(d.planningTypeId));
          setTableData(
            (mergedRowData || []).map((item, idx) => ({
              id: item.typeId,
              headerId: item.headerId,
              sl: idx + 1,
              department: d.planningTypeId === 1 ? item.name : "",
              section: d.planningTypeId === 2 ? item.name : "",
              hrPosition: d.planningTypeId === 3 ? item.name : "",
              designation: d.planningTypeId === 4 ? item.name : "",
              currentManpower: item.currentValue,
              budgetedManpower: item.targetValue,
              comments: item.remark || "",
            }))
          );
          setShowData(true);
        }
      } catch {
        toast.error("Failed to load workforce planning data for edit.");
      } finally {
        setLoading(false);
      }
    };

    // Helper to map planningTypeId to value
    function getPlanningTypeValue(id) {
      if (id === 1) return "department";
      if (id === 2) return "section";
      if (id === 3) return "hrPosition";
      if (id === 4) return "designation";
      return undefined;
    }

    if (location.state) {
      const { workplaceId, yearTypeId, fromYear, toYear } = location.state;
      if (workplaceId && yearTypeId && fromYear) {
        fetchEditData(workplaceId, yearTypeId, fromYear, toYear);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, form, location.state]);

  return permission?.isView ? (
    <PForm
      form={form}
      initialValues={{}}
      onFinish={() => {
        fetchWorkforceData();
      }}
    >
      {loading && <Loading />} {/* <-- loading effect */}
      <PCard>
        {" "}
        <PCardHeader
          backButton={true}
          title={`Workforce Planning`}
          buttonList={[
            ...(showData
              ? [
                  {
                    type: "primary",
                    content: `${location.state ? "Update" : "Save"}`,
                    onClick: handleSave,
                  },
                ]
              : []),
          ]}
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
                name="planningType"
                label="Planning Type"
                placeholder="Select Planning Type"
                disabled={location.state}
                onChange={(value, option) => {
                  form.setFieldsValue({ planningType: option });
                  setSelectedPlanningType(value);
                  form.setFieldsValue({ departmentSection: null });
                  setTableData([]);
                }}
                rules={[
                  { required: true, message: "Planning Type is required" },
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
          />
        )}
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};
export default WorkForceCreate;
