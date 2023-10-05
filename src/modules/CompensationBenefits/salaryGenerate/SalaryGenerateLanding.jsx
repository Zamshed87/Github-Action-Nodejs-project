import {
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import axios from "axios";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Chips from "../../../common/Chips";
import DefaultInput from "../../../common/DefaultInput";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../common/ResetButton";
import {
  compensationBenefitsLSAction,
  setFirstLevelNameAction,
} from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../utility/customColor";
import {
  dateFormatter,
  monthFirstDate,
  monthLastDate,
} from "../../../utility/dateFormatter";
import { getMonthName } from "../../../utility/monthUtility";
import { numberWithCommas } from "../../../utility/numberWithCommas";
import TaxAssignCheckerModal from "./components/taxAssignChekerModal";
import {
  createSalaryGenerateRequest,
  getSalaryGenerateRequestLanding,
} from "./helper";
import "./salaryGenerate.css";
import AntScrollTable from "../../../common/AntScrollTable";

const initialValues = {
  salaryTpe: {
    value: "Salary",
    label: "Full Salary",
  },
  businessUnit: "",
  workplaceGroup: "",
  workplace: "",
  description: "",
  monthYear: moment().format("YYYY-MM"),
  payrollGroup: "",
  monthId: new Date().getMonth() + 1,
  yearId: new Date().getFullYear(),
  fromDate: "",
  toDate: "",
  search: "",
  filterFromDate: monthFirstDate(),
  filterToDate: monthLastDate(),
};

const validationSchema = Yup.object().shape({
  businessUnit: Yup.object().shape({
    value: Yup.string().required("Business Unit is required"),
    label: Yup.string().required("Business Unit is required"),
  }),
  workplaceGroup: Yup.object().shape({
    value: Yup.string().required("Workplace Group is required"),
    label: Yup.string().required("Workplace Group is required"),
  }),
  workplace: Yup.object().shape({
    value: Yup.string().required("Workplace is required"),
    label: Yup.string().required("Workplace is required"),
  }),
  payrollGroup: Yup.object().shape({
    value: Yup.string().required("Payroll Group is required"),
    label: Yup.string().required("Payroll Group is required"),
  }),
  monthYear: Yup.date().required("Payroll month is required"),
});

const SalaryGenerateLanding = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [singleData] = useState(null);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [takeHomePayTax, setTakeHomePayTax] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  // for create state
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const { orgId, buId, buName, employeeId, wgId, wId, wName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // LS data compensationBenefits
  const { compensationBenefits } = useSelector((state) => {
    return state?.localStorage;
  }, shallowEqual);

  //get landing data
  const getLandingData = () => {
    getSalaryGenerateRequestLanding(
      "SalaryGenerateRequestLanding",
      orgId,
      buId,
      wgId,
      "",
      "",
      values?.filterFromDate,
      values?.filterToDate,
      setRowDto,
      setAllData,
      setLoading
    );
  };

  useEffect(() => {
    getSalaryGenerateRequestLanding(
      "SalaryGenerateRequestLanding",
      orgId,
      buId,
      wgId,
      "",
      "",
      values?.filterFromDate,
      values?.filterToDate,
      setRowDto,
      setAllData,
      setLoading
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, employeeId, wgId]);

  // filter data
  const filterData = (keywords) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter(
        (item) =>
          regex.test(item?.strBusinessUnit?.toLowerCase()) ||
          regex.test(item?.strSalaryCode?.toLowerCase()) ||
          regex.test(item?.ProcessionStatus?.toLowerCase()) ||
          regex.test(item?.ApprovalStatus?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  // useFormik hooks
  const {
    setFieldValue,
    values,
    errors,
    touched,
    handleSubmit,
    resetForm,
    // setValues,
    // setFieldValues,
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initialValues,
      filterFromDate:
        compensationBenefits?.salaryGenerate?.fromDate || monthFirstDate(),
      filterToDate:
        compensationBenefits?.salaryGenerate?.toDate || monthLastDate(),
    },
    onSubmit: (values) => saveHandler(values),
  });

  // on form submit
  const saveHandler = async (values) => {
    const payload = {
      strPartName: "SalaryGenerateNReGenerateRequest",
      intSalaryGenerateRequestId: isEdit
        ? singleData?.intSalaryGenerateRequestId
        : 0,
      strSalaryCode: " ",
      intAccountId: orgId,
      intBusinessUnitId: buId,
      strBusinessUnit: buName,
      intWorkplaceId: wId,
      strWorkplace: wName,
      intWorkplaceGroupId: values?.workplaceGroup?.value,
      strWorkplaceGroup: values?.workplaceGroup?.label,
      intPayrollGroupId: values?.payrollGroup?.value,
      strPayrollGroup: values?.payrollGroup?.label,
      intMonthId: values?.monthId,
      intYearId: values?.yearId,
      strDescription: values?.description,
      intCreatedBy: employeeId,
      strSalryType: values?.salaryTpe?.value,
      dteFromDate: values.fromDate || null,
      dteToDate: values.toDate || null,
    };
    const callback = () => {
      resetForm(initialValues);
      setIsEdit(false);
      getLandingData();
    };
    const res = await axios.get(
      `/Payroll/EmployeeTakeHomePayNotAssignForTax?partName=EmployeeTaxNotAssignListForTakeHomePay&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplacegroupId=${values?.workplaceGroup?.value}&intWorkPlaceId=${values?.workplace?.value}&intPayrollGroupId=${values?.payrollGroup?.value}`
    );
    if (res?.data) {
      setTakeHomePayTax(res?.data);
      res?.data?.length > 0
        ? setOpen(true)
        : createSalaryGenerateRequest(payload, setLoading, callback);
    }
  };

  // send for approval
  const sendForApprovalHandler = (data) => {
    const payload = {
      strPartName: "GeneratedSalarySendForApproval",
      intSalaryGenerateRequestId: data?.intSalaryGenerateRequestId,
      strSalaryCode: data?.strSalaryCode,
      intAccountId: data?.intAccountId,
      intBusinessUnitId: data?.intBusinessUnitId,
      strBusinessUnit: data?.strBusinessUnit,
      intWorkplaceGroupId: wgId,
      intMonthId: data?.intMonth,
      intYearId: data?.intYear,
      strDescription: data?.strDescription,
      intCreatedBy: employeeId,
    };
    const callback = () => {
      getLandingData();
    };
    createSalaryGenerateRequest(payload, setLoading, callback);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 77) {
      permission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
  }, [dispatch]);

  const salaryGenerateColumn = (page, paginationSize) => {
    return [
      {
        title: "SL",
        render: (text, record, index) =>
          (page - 1) * paginationSize + index + 1,
        sorter: false,
        filter: false,
        width: 30,
      },
      {
        title: "Salary Code",
        dataIndex: "strSalaryCode",
        sorter: true,
        filter: true,
        width: 120,
      },
      {
        title: "Salary Type",
        dataIndex: "strSalaryTypeLabel",
        sorter: true,
        filter: true,
        width: 120,
      },
      {
        title: "Business Unit",
        dataIndex: "strBusinessUnit",
        sorter: true,
        filter: true,
        width: 150,
      },
      {
        title: "Workplace Group",
        dataIndex: "strWorkplaceGroupName",
        sorter: true,
        filter: true,
        width: 120,
      },
  /*     {
        title: "Wing",
        dataIndex: "wingName",
        sorter: true,
        filter: true,
        width: 100,
      },
      {
        title: "Sole Depo",
        dataIndex: "soleDepoName",
        sorter: true,
        filter: true,
        width: 100,
      },
      {
        title: "Region",
        dataIndex: "regionName",
        sorter: true,
        filter: true,
        width: 100,
      },
      {
        title: "Area",
        dataIndex: "areaName",
        sorter: true,
        filter: true,
        width: 100,
      },
      {
        title: "Territory",
        dataIndex: "territoryName",
        sorter: true,
        filter: true,
        width: 100,
      }, */
      {
        title: "Payroll Month",
        dataIndex: "intMonth",
        sorter: false,
        filter: false,
        render: (_, item) => (
          <>{`${getMonthName(item?.intMonth)}, ${item?.intYear}`}</>
        ),
        width: 100,
      },
      {
        title: "Payroll Period",
        dataIndex: "strDepartment",
        sorter: false,
        filter: false,
        render: (_, item) => {
          return (
            <>
              {item?.dteSalaryGenerateFrom
                ? dateFormatter(item?.dteSalaryGenerateFrom)
                : "-"}{" "}
              -{" "}
              {item?.dteSalaryGenerateTo
                ? dateFormatter(item?.dteSalaryGenerateTo)
                : "-"}
            </>
          );
        },
        width: 200,
      },
      {
        title: "Net Amount",
        dataIndex: "numNetPayableSalary",
        sorter: true,
        filter: true,
        render: (_, record) => (
          <>
            {record?.numNetPayableSalary
              ? numberWithCommas(record?.numNetPayableSalary)
              : "0"}
          </>
        ),
        width: 120,
        className: "text-center",
      },
      {
        title: "Processing Status",
        dataIndex: "ProcessionStatus",
        sorter: true,
        filter: true,
        className: "text-center",
        render: (_, item) => {
          return (
            <>
              {item?.ProcessionStatus === "Success" && (
                <Chips label={item?.ProcessionStatus} classess="success" />
              )}
              {item?.ProcessionStatus === "Processing" && (
                <Chips label={item?.ProcessionStatus} classess="warning" />
              )}
            </>
          );
        },
        width: 130,
      },
      {
        title: "Approval Status",
        dataIndex: "ApprovalStatus",
        sorter: true,
        filter: false,
        width: 140,
        render: (_, item) => {
          return (
            <>
              {item?.ApprovalStatus === "Approved" && (
                <p
                  style={{
                    fontSize: "12px",
                    color: gray500,
                    fontWeight: "400",
                  }}
                >
                  {item?.ApprovalStatus}
                </p>
              )}
              {item?.ApprovalStatus === "Send for Approval" && (
                <button
                  style={{
                    height: "24px",
                    fontSize: "10px",
                    padding: "0px 12px 0px 12px",
                    backgroundColor: "#0BA5EC",
                  }}
                  className="btn btn-default"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sendForApprovalHandler(item);
                  }}
                >
                  Send for Approval
                </button>
              )}
              {item?.ApprovalStatus === "Waiting for Approval" && (
                <p
                  style={{
                    fontSize: "12px",
                    color: gray500,
                    fontWeight: "400",
                  }}
                >
                  {item?.ApprovalStatus}
                </p>
              )}
              {item?.ApprovalStatus === "Rejected" && (
                <p
                  style={{
                    fontSize: "12px",
                    color: gray500,
                    fontWeight: "400",
                  }}
                >
                  {item?.ApprovalStatus}
                </p>
              )}
            </>
          );
        },
      },
      {
        title: "",
        dataIndex: "",
        sorter: false,
        filter: false,
        width: 125,
        render: (data, item) => (
          <>
            {!!item?.isReGenerate && (
              <div>
                <button
                  style={{
                    height: "24px",
                    fontSize: "12px",
                    padding: "0px 12px 0px 12px",
                  }}
                  className="btn btn-default"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push({
                      pathname: `/compensationAndBenefits/payrollProcess/generateSalary/edit/${item?.intSalaryGenerateRequestId}`,
                      state: item,
                    });
                  }}
                >
                  Re-Generate
                </button>
              </div>
            )}
          </>
        ),
      },
    ];
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {loading && <Loading />}
        {permission?.isView ? (
          <div className="table-card">
            <div className="table-card-heading justify-content-between align-items-center">
              <h2> Generate List</h2>
              <ul className="d-flex flex-wrap">
                {values?.search && (
                  <li>
                    <ResetButton
                      classes="btn-filter-reset"
                      title="reset"
                      icon={
                        <SettingsBackupRestoreOutlined
                          sx={{
                            marginRight: "10px",
                            fontSize: "16px",
                          }}
                        />
                      }
                      styles={{
                        marginRight: "16px",
                      }}
                      onClick={() => {
                        setRowDto(allData);
                        setFieldValue("search", "");
                      }}
                    />
                  </li>
                )}
                <li>
                  <DefaultInput
                    classes="search-input"
                    inputClasses="search-inner-input"
                    placeholder="Search"
                    value={values?.search}
                    name="search"
                    type="text"
                    trailicon={
                      <SearchOutlined
                        sx={{
                          color: "#323232",
                          fontSize: "18px",
                        }}
                      />
                    }
                    onChange={(e) => {
                      filterData(e.target.value);
                      setFieldValue("search", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </li>
                <li>
                  <button
                    type="button"
                    style={{
                      padding: "0px 10px",
                      marginLeft: "16px",
                    }}
                    className="btn btn-default"
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push(
                        "/compensationAndBenefits/payrollProcess/generateSalary/create"
                      );
                    }}
                  >
                    Create
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-style pb-0 mt-3 mb-2">
              <div className="row">
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>From Date</label>
                    <DefaultInput
                      classes="input-sm"
                      value={values?.filterFromDate}
                      placeholder="Month"
                      name="toDate"
                      max={values?.filterToDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("filterFromDate", e.target.value);
                        dispatch(
                          compensationBenefitsLSAction({
                            ...compensationBenefits,
                            salaryGenerate: {
                              ...compensationBenefits?.salaryGenerate,
                              fromDate: e.target.value,
                            },
                          })
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>To Date</label>
                    <DefaultInput
                      classes="input-sm"
                      value={values?.filterToDate}
                      placeholder="Month"
                      name="toDate"
                      min={values?.filterFromDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("filterToDate", e.target.value);
                        dispatch(
                          compensationBenefitsLSAction({
                            ...compensationBenefits,
                            salaryGenerate: {
                              ...compensationBenefits?.salaryGenerate,
                              toDate: e.target.value,
                            },
                          })
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <button
                    className="btn btn-green btn-green-disable mt-4"
                    type="button"
                    disabled={!values?.filterFromDate || !values?.filterToDate}
                    onClick={(e) => {
                      e.stopPropagation();
                      getSalaryGenerateRequestLanding(
                        "SalaryGenerateRequestLanding",
                        orgId,
                        buId,
                        wgId,
                        "",
                        "",
                        values?.filterFromDate,
                        values?.filterToDate,
                        setRowDto,
                        setAllData,
                        setLoading
                      );
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
            <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
              {rowDto?.length > 0 ? (
                <AntScrollTable
                  data={rowDto?.length > 0 ? rowDto : []}
                  columnsData={
                    wgId < 3
                      ? salaryGenerateColumn(page, paginationSize).filter(
                          (item) =>
                            item.title !== "Wing" &&
                            item.title !== "Sole Depo" &&
                            item.title !== "Region" &&
                            item.title !== "Area" &&
                            item.title !== "Territory"
                        )
                      : salaryGenerateColumn(page, paginationSize)
                  }
                  rowClassName="pointer"
                  onRowClick={(item) => {
                    if (item?.isGenerated === true) {
                      history.push({
                        pathname: `/compensationAndBenefits/payrollProcess/generateSalaryView/${item?.intSalaryGenerateRequestId}`,
                        state: item,
                      });
                    } else {
                      return toast.warning(
                        "Salary Generate on processing. Please wait...",
                        {
                          toastId: 1,
                        }
                      );
                    }
                  }}
                  setPage={setPage}
                  setPaginationSize={setPaginationSize}
                  rowKey={(record) => record?.strSalaryCode}
                />
              ) : (
                <NoResult title="No result found" />
              )}
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
        {/* addEdit form Modal */}
        <TaxAssignCheckerModal
          show={open}
          title={"UnAssigned Employee List For Tax"}
          onHide={handleClose}
          size="lg"
          backdrop="static"
          classes="default-modal"
          takeHomePayTax={takeHomePayTax}
          values={values}
          singleData={singleData}
          isEdit={isEdit}
          resetForm={resetForm}
          initialValues={initialValues}
          setIsEdit={setIsEdit}
          getLandingData={getLandingData}
          setLoading={setLoading}
          loading={loading}
        />
      </form>
    </>
  );
};

export default SalaryGenerateLanding;

// <ScrollableTable
//   classes="salary-process-table salary-generate-table"
//   secondClasses="table-card-styled tableOne scroll-table-height"
// >
//   <thead>
//     <tr>
//       <th style={{ width: "30px" }}>
//         <div>SL</div>
//       </th>
//       <th style={{ width: "120px" }}>
//         <div>Salary Code</div>
//       </th>
//       <th>
//         <div>Salary Type</div>
//       </th>
//       <th>
//         <div>Business Unit</div>
//       </th>
//       <th>
//         <div>Payroll Month</div>
//       </th>
//       <th>
//         <div>Payroll Period</div>
//       </th>
//       <th
//         className="fixed-column"
//         style={{ textAlign: "right", right: "394px" }}
//       >
//         <div>Net Amount</div>
//       </th>
//       <th className="fixed-column" style={{ right: "260px" }}>
//         <div>Processing Status</div>
//       </th>
//       <th className="fixed-column" style={{ right: "115px" }}>
//         <div>Approval Status</div>
//       </th>
//       <th
//         className="fixed-column"
//         style={{ width: "115px" }}
//       ></th>
//     </tr>
//   </thead>
//   <tbody>
//     <CardTable
//       rowDto={rowDto}
//       setRowDto={setRowDto}
//       setValues={setValues}
//       values={values}
//       setFieldValues={setFieldValues}
//       setIsEdit={setIsEdit}
//       scrollRef={scrollRef}
//       setSingleData={setSingleData}
//       sendForApprovalHandler={sendForApprovalHandler}
//     />
//   </tbody>
// </ScrollableTable>
