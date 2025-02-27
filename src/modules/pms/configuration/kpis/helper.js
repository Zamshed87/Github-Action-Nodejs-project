import { CreateOutlined, DeleteOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import IConfirmModal from "../../../../common/IConfirmModal";
import { Switch } from "antd";

export const kpiMeasurementDDL = [
  {
    label: "Min",
    value: "Min",
  },
  {
    label: "Max",
    value: "Max",
  },
];

export const aggregationDDL = [
  {
    label: "Sum",
    value: "Sum",
  },
  {
    label: "Average",
    value: "Average",
  },
];

export const kpiFormatDDL = [
  { label: "% of", value: "% of" },
  { label: "# of", value: "# of" },
  { label: "Amount", value: "BDT" },
  { label: "Amount ($)", value: "$" },
];

export const validationSchema = Yup.object().shape({
  // pmType: Yup.object()
  //   .shape({
  //     label: Yup.string().required("PM Type is required"),
  //     value: Yup.string().required("PM Type is required"),
  //   })
  //   .typeError("PM Type is required"),
  objectiveType: Yup.object()
    .shape({
      label: Yup.string().required("Objective Type is required"),
      value: Yup.string().required("Objective Type is required"),
    })
    .typeError("Objective Type is required"),
  objective: Yup.object()
    .shape({
      label: Yup.string().required("Objective is required"),
      value: Yup.string().required("Objective is required"),
    })
    .typeError("Objective is required"),
  kpiName: Yup.string().required("Kpi Name is required"),
  aggregationType: Yup.object()
    .shape({
      label: Yup.string().required("Aggregation Type is required"),
      value: Yup.string().required("Aggregation Type is required"),
    })
    .typeError("AggregationType is required"),
  kpiMeasurement: Yup.object()
    .shape({
      label: Yup.string().required("KPI Measurement is required"),
      value: Yup.string().required("KPI Measurement is required"),
    })
    .typeError("KPI Measurement is required"),
  kpiFormat: Yup.object()
    .shape({
      label: Yup.string().required("KPI Format is required"),
      value: Yup.string().required("KPI Format is required"),
    })
    .typeError("KPI Format is required"),
});

export const createNEditKPIs = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/PMS/CreateKPIS`, payload);
    cb && cb();
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getKPIsLanding = async (
  buId,
  orgId,
  setter,
  setRowDto,
  setLoading,
  pages,
  setPages,
  formValues
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/PMS/GetKPISPagination?AccountId=${orgId}&BusinessUnitId=${buId}&pageNo=${
        pages?.current
      }&pageSize=${pages?.pageSize}&objectiveType=${
        formValues?.objectiveType?.value ? formValues?.objectiveType?.value : ""
      }&objective=${
        formValues?.objective?.value ? formValues?.objective?.value : ""
      }&status=${formValues?.status?.value ? formValues?.status?.value : ""}`
    );
    if (res?.data) {
      setPages((prev) => ({
        ...prev,
        total: res?.data?.totalCount,
      }));
      setter && setter(res?.data?.data);
      setRowDto && setRowDto(res?.data?.data);
      setLoading && setLoading(false);
      console.log("res?.data?.data", res?.data?.data);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter && setter([]);
    setRowDto && setRowDto([]);
  }
};

export const deleteKPIs = async (orgId, kpisId, employeeId, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/PMS/DeleteKPIS?AccountId=${orgId}&KpisId=${kpisId}&UserId=${employeeId}`
    );
    cb && cb();
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const updateKPIs = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(`/PMS/UpdateKPIS`, payload);
    cb && cb();
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const kpisCreateColumn = (
  page,
  paginationSize,
  setToEdit,
  setIsEdit,
  scrollRef,
  setValues,
  rowDto,
  setRowDto
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      className: "text-center",
    },
    {
      title: "KPI Name",
      dataIndex: "kpiName",
      render: (data) => <div>{data}</div>,
      sorter: true,
    },
    {
      title: "Agg. Type",
      dataIndex: "aggregationType",
      render: (data) => <div>{data?.label}</div>,
      sorter: true,
    },
    {
      title: "Measurement",
      dataIndex: "kpiMeasurement",
      render: (data) => <div>{data?.label}</div>,
      sorter: true,
    },
    {
      title: "Format",
      dataIndex: "kpiFormat",
      render: (data) => <div>{data?.label}</div>,
      sorter: true,
    },
    // {
    //   title: "PM Type",
    //   dataIndex: "pmType",
    //   render: (data) => <div>{data?.label}</div>,
    //   sorter: true,
    // },
    {
      title: "Objective Type",
      dataIndex: "objectiveType",
      render: (data) => <div>{data?.label}</div>,
      sorter: true,
    },
    {
      title: "Objective",
      dataIndex: "objective",
      render: (data) => <div>{data?.label}</div>,
      sorter: true,
    },
    {
      title: "Chart Type",
      dataIndex: "chartType",
      render: (data) => <div>{data?.label}</div>,
      sorter: true,
    },
    {
      title: "Action",
      dataIndex: "",
      render: (data, record, index) => (
        <>
          <div className="d-flex align-items-center">
            <Tooltip title="Edit" arrow>
              <button
                type="button"
                className="iconButton"
                onClick={(e) => {
                  e.stopPropagation();
                  setToEdit(index);
                  setIsEdit(true);
                  scrollRef.current.scrollIntoView({
                    behavior: "smooth",
                  });
                  setValues({
                    pmType: {
                      label: record.pmType.label,
                      value: record.pmType.value,
                    },
                    objectiveType: {
                      label: record.objectiveType.label,
                      value: record.objectiveType.value,
                    },
                    objective: {
                      label: record.objective.label,
                      value: record.objective.value,
                    },
                    chartType: {
                      label: record.chartType.label,
                      value: record.chartType.value,
                    },
                    kpiName: record.kpiName,
                    aggregationType: {
                      label: record.aggregationType.label,
                      value: record.aggregationType.value,
                    },
                    kpiMeasurement: {
                      label: record.kpiMeasurement.label,
                      value: record.kpiMeasurement.value,
                    },
                    kpiFormat: {
                      label: record.kpiFormat.label,
                      value: record.kpiFormat.value,
                    },
                    benchmark: record.benchmark,
                  });
                }}
              >
                <CreateOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <button
                type="button"
                className="iconButton mt-0 mt-md-2 mt-lg-0"
                onClick={() => {
                  const modifiedData = rowDto.filter(
                    (item, filteredindex) => filteredindex !== index
                  );
                  setRowDto(modifiedData);
                }}
              >
                <DeleteOutlined />
              </button>
            </Tooltip>
          </div>
        </>
      ),
    },
  ];
};

export const kpisLandingColumn = (
  page,
  paginationSize,
  history,
  orgId,
  employeeId,
  setLoading,
  getData
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      className: "text-center",
    },
    {
      title: "KPI Name (Code)",
      dataIndex: "strKpis",
      render: (data, record) => (
        <div>
          {data} ({record.strCode})
        </div>
      ),
      sorter: true,
    },
    // {
    //   title: "PM Type",
    //   dataIndex: "strPmtype",
    //   render: (data) => <div>{data}</div>,
    //   filter: true,
    //   sorter: true,
    // },
    {
      title: "Objective Type",
      dataIndex: "strObjectiveType",
      render: (data) => <div>{data}</div>,
      sorter: true,
      filter: true,
    },
    {
      title: "Objective",
      dataIndex: "strObjective",
      render: (data) => <div>{data}</div>,
      sorter: true,
    },
    {
      title: "Agg. Type",
      dataIndex: "strAggregationType",
      render: (data) => <div>{data}</div>,
      sorter: true,
    },
    {
      title: "Measurement",
      dataIndex: "strMinMax",
      render: (data) => <div>{data}</div>,
      sorter: true,
    },
    {
      title: "Format",
      dataIndex: "kpiformat",
      render: (data) => <div>{data}</div>,
      sorter: true,
    },
    // {
    //   title: "Chart Type",
    //   dataIndex: "chartName",
    //   render: (data) => <div>{data}</div>,
    //   sorter: true,
    // },
    {
      title: "Action",
      dataIndex: "",
      render: (data, record, index) => (
        <>
          <div className="d-flex align-items-center">
            <Tooltip title="Edit" arrow>
              <button
                type="button"
                className="iconButton"
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(
                    `/pms/configuration/kpis/edit/${record.intKpisId}`,
                    { toEditData: record }
                  );
                }}
              >
                <CreateOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <Switch
                size="small"
                checked={record?.isActive}
                onChange={() => {
                  deleteKPIs(
                    orgId,
                    record.intKpisId,
                    employeeId,
                    setLoading,
                    getData
                  );
                }}
              />
              {/* <button
                type="button"
                className="iconButton mt-0 mt-md-2 mt-lg-0"
                onClick={() => {
                  let confirmObject = {
                    closeOnClickOutside: false,
                    message: "Are you want to sure you delete your leave?",
                    yesAlertFunc: () => {
                      deleteKPIs(
                        orgId,
                        record.intKpisId,
                        employeeId,
                        setLoading,
                        getData
                      );
                    },
                    noAlertFunc: () => {
                      //   history.push("/components/dialogs")
                    },
                  };
                  IConfirmModal(confirmObject);
                }}
              >
                <DeleteOutlined />
              </button> */}
            </Tooltip>
          </div>
        </>
      ),
    },
  ];
};

export const excelHeaderForKpi = ({ businessUnit, title }) => {
  return [
    {
      text: businessUnit,
      fontSize: 18,
      bold: true,
      cellRange: "A1:E1",
      merge: true,
      alignment: "center:middle",
    },
    {
      text: title,
      fontSize: 18,
      bold: true,
      cellRange: "A1:E1",
      merge: true,
      alignment: "center:middle",
    },
    {
      text: "",
      fontSize: 18,
      bold: true,
      cellRange: "A1:E1",
      merge: true,
      alignment: "center:middle",
    },
  ];
};

export const excelTableHeaderForKpi = () => {
  return [
    {
      text: "SL",
      fontSize: 8.5,
      bold: true,
      border: "all 000000 thin",
    },
    {
      text: "KPI Code",
      fontSize: 9,
      bold: true,
      border: "all 000000 thin",
    },
    {
      text: "KPI Name",
      fontSize: 9,
      bold: true,
      border: "all 000000 thin",
    },
    {
      text: "PM Type",
      fontSize: 9,
      bold: true,
      border: "all 000000 thin",
    },
    {
      text: "Objective",
      fontSize: 9,
      bold: true,
      border: "all 000000 thin",
    },
    {
      text: "Agg. Type",
      fontSize: 9,
      bold: true,
      border: "all 000000 thin",
    },
    {
      text: "Measurement",
      fontSize: 9,
      bold: true,
      border: "all 000000 thin",
    },
    {
      text: "Format",
      fontSize: 9,
      bold: true,
      border: "all 000000 thin",
    },
    {
      text: "Chart Type",
      fontSize: 9,
      bold: true,
      border: "all 000000 thin",
    },
  ];
};

class Cell {
  constructor(label, align, format) {
    this.text = label;
    this.alignment = `${align}:middle`;
    this.format = format;
  }
  getCell() {
    return {
      text: this.text,
      fontSize: 9,
      border: "all 000000 thin",
      alignment: this.alignment || "",
      textFormat: this.format,
    };
  }
}

export const excelTableRowForKpi = ({ rowData }) => {
  const data = rowData?.map((item, index) => {
    return [
      new Cell(String(index + 1) || "", "center", "text").getCell(),
      new Cell(item?.strCode || "N/A", "center", "text").getCell(),
      new Cell(item?.strKpis || "N/A", "center", "text").getCell(),
      new Cell(item?.strPmtype || "N/A", "center", "text").getCell(),
      new Cell(item?.strObjective || "N/A", "center", "text").getCell(),
      new Cell(item?.strAggregationType || "N/A", "center", "text").getCell(),
      new Cell(item?.strMinMax || "N/A", "center", "text").getCell(),
      new Cell(item?.kpiformat || "N/A", "center", "text").getCell(),
      new Cell(item?.chartName || "N/A", "center", "text").getCell(),
    ];
  });
  return data;
};
