import {
  AddOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { DataTable, PButton } from "Components";
import { paginationSize } from "common/AntTable";
import DefaultInput from "common/DefaultInput";
import MasterFilter from "common/MasterFilter";
import PrimaryButton from "common/PrimaryButton";
import ResetButton from "common/ResetButton";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { getDateOfYear } from "utility/dateFormatter";
import { todayDate } from "utility/todayDate";
import { pfLandingColData } from "./helper";
import ViewModal from "common/ViewModal";
import SingleInfo from "common/SingleInfo";
import moment from "moment";
import PfLoanTable from "./components/pfLoanTable";
import { getPDFAction } from "utility/downloadFile";
import { customStyles } from "utility/selectCustomStyle";
import FormikSelect from "common/FormikSelect";
import { AppstoreAddOutlined } from "@ant-design/icons";
import HeaderView from "./components/HeaderView";
import EarlySettled from "./components/EarlySettled";

const PfLoanLanding = () => {
  const { buId, wgId, wId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Loan Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "PF Loan";
    return () => {
      document.title = "PeopleDesk";
    };
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30620) {
      permission = item;
    }
  });

  const history = useHistory();
  const [, getLoanLanding, loanLandingLoading] = useAxiosGet([]);
  const [loanByIdDto, getLoanById, loanByIdLoading] = useAxiosGet([]);
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [viewDetails, setViewDetails] = useState(false);
  const [viewEarlySettled, setViewEarlySettled] = useState(false);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    totalCount: 0,
  });

  const { values, setFieldValue } = useFormik({
    initialValues: {
      fDate: getDateOfYear("first"),
      tDate: todayDate(),
      search: "",
      monthYear: moment().format("YYYY-MM"),
      monthId: new Date().getMonth() + 1,
      yearId: new Date().getFullYear(),
    },
  });

  const getData = (srcTxt = values?.search, pages, isPaginated = true) => {
    const url = `/PfLoan/GetAll?BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&FromDate=${
      values?.fDate
    }&ToDate=${values?.tDate}&PageNo=${pages?.current}&PageSize=${
      pages?.pageSize
    }&SearchText=${srcTxt}&IsPaginated=${isPaginated}&status=${
      values?.status?.value || 0
    }`;

    getLoanLanding(url, (data) => {
      setRowDto(data?.objHeader);
      setPages({
        current: data?.currentPage,
        pageSize: data?.pageSize,
        totalCount: data?.totalCount,
      });
    });
  };

  useEffect(() => {
    getData("", pages);
  }, [wId, wgId]);

  return permission?.isView ? (
    <>
      {(loanLandingLoading || loanByIdLoading || loading) && <Loading />}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <div>
            <h6>PF Loan</h6>
          </div>
          <div className="table-card-head-right">
            <ul>
              {values?.search && (
                <li>
                  <ResetButton
                    title="reset"
                    icon={
                      <SettingsBackupRestoreOutlined
                        sx={{ marginRight: "10px" }}
                      />
                    }
                    onClick={() => {
                      setFieldValue("search", "");
                      getData("", pages);
                    }}
                  />
                </li>
              )}
              <li>
                <MasterFilter
                  isHiddenFilter
                  width="200px"
                  inputWidth="200px"
                  value={values?.search}
                  setValue={(value) => {
                    setFieldValue("search", value);
                    getData(value, pages);
                  }}
                  cancelHandler={() => {
                    setFieldValue("search", "");
                    getData("", pages);
                  }}
                />
              </li>
            </ul>

            <PrimaryButton
              type="button"
              className="btn btn-default flex-center"
              label={"PF Loan Create"}
              icon={
                <AddOutlined sx={{ marginRight: "0px", fontSize: "15px" }} />
              }
              onClick={() => {
                if (!permission?.isCreate)
                  return toast.warn("You don't have permission");

                history.push("/loanManagement/PfLoan/create");
              }}
            />
          </div>
        </div>
        <div className="table-card-body">
          <div className="card-style my-2">
            <div className="row">
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>From Date</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.fDate}
                    placeholder="From Date"
                    name="fDate"
                    type="date"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("fDate", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>To Date</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.tDate}
                    placeholder="From Date"
                    name="tDate"
                    type="date"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("tDate", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>Status</label>
                  <FormikSelect
                    name="status"
                    options={[
                      { value: 0, label: "All" },
                      { value: 1, label: "Pending" },
                      { value: 2, label: "Inactive" },
                      { value: 3, label: "Approved" },
                      { value: 4, label: "Running" },
                      { value: 5, label: "Early Settled" },
                      { value: 6, label: "Completed" },
                    ]}
                    value={values?.status}
                    onChange={(valueOption) => {
                      setFieldValue("status", valueOption);
                    }}
                    placeholder=""
                    styles={customStyles}
                  />
                </div>
              </div>
              <div className="col-lg-3" style={{ marginTop: "21px" }}>
                <button
                  className="btn btn-green btn-green-disable"
                  type="button"
                  disabled={!values?.fDate || !values?.tDate}
                  onClick={() => {
                    getData(values?.search, pages);
                  }}
                >
                  View
                </button>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <DataTable
              bordered
              data={rowDto?.length > 0 ? rowDto : []}
              loading={loanLandingLoading}
              header={pfLandingColData(history)}
              pagination={{
                pageSize: pages?.pageSize,
                total: pages?.totalCount,
              }}
              onChange={(pagination, filters, sorter, extra) => {
                if (extra.action === "sort") return;
                getData(values?.search, pagination);
              }}
              onRow={(rec) => ({
                onClick: () => {
                  getLoanById(`/PfLoan/GetById?BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&LoanHeaderId=${rec?.intEmployeeLoanHeaderId}
                  `);
                  setViewDetails(true);
                  setSingleData(rec);
                },

                className: "pointer",
              })}
            />
          </div>
        </div>
      </div>
      <ViewModal
        size="xl"
        title="Early Settled Loan Details"
        backdrop="static"
        classes="default-modal preview-modal"
        show={viewEarlySettled}
        onHide={() => setViewEarlySettled(false)}
      >
        <EarlySettled
          loanByIdDto={loanByIdDto}
          headerId={loanByIdDto?.objHeader?.intEmployeeLoanHeaderId}
          setViewEarlySettled={setViewEarlySettled}
        />
      </ViewModal>
      <ViewModal
        size="xl"
        title="View Loan Details"
        backdrop="static"
        classes="default-modal preview-modal"
        show={!loanByIdLoading && viewDetails}
        onHide={() => setViewDetails(false)}
      >
        <div className="mx-3">
          <div className="d-flex justify-content-between">
            <HeaderView loanByIdDto={loanByIdDto} />
            <div className="" style={{ marginTop: "0" }}>
              <PButton
                type="primary"
                content={"Early Settled"}
                icon={<AppstoreAddOutlined />}
                onClick={() => {
                  setViewDetails(false);
                  setViewEarlySettled(true);
                }}
              />
            </div>
            <div className="" style={{ marginTop: "0" }}>
              <PButton
                type="primary"
                content={"Print"}
                icon={<i className="fa fa-print mr-2" />}
                onClick={() => {
                  getPDFAction(
                    `/PdfAndExcelReport/EmployeeLoanPdf?BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&LoanHeaderId=${loanByIdDto?.objHeader?.intEmployeeLoanHeaderId}`,
                    setLoading
                  );
                }}
              />
            </div>
          </div>

          <div
            style={{ maxHeight: "300px", overflowY: "scroll" }}
            className="pfLoan mt-2 mb-3"
          >
            {loanByIdDto?.objRow?.length > 0 && (
              <PfLoanTable
                header={loanByIdDto?.objHeader}
                generatedData={loanByIdDto?.objRow}
                isModal={true}
                totalInterest={loanByIdDto?.objHeader?.numTotalInterest}
                totalPrinciple={loanByIdDto?.objHeader?.numTotalPrincipal}
                totalInstallment={loanByIdDto?.objHeader?.numTotalInstallment}
                values={values}
                setFieldValue={setFieldValue}
                employeeId={employeeId}
                close={() => setViewDetails(false)}
                landing={() => getData("", pages)}
                singleData={singleData}
              />
            )}
          </div>
        </div>
      </ViewModal>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default PfLoanLanding;
