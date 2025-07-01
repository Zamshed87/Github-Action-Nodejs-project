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
import { pfLandingColData, statusDDL } from "./helper";
import ViewModal from "common/ViewModal";
import { customStyles } from "utility/selectCustomStyle";
import FormikSelect from "common/FormikSelect";
import EarlySettled from "./components/EarlySettled";
import LoanDetailsView from "./common/loanDetailsView";

const PfLoanLanding = ({ onlyViewDetails = null }) => {
  console.log("PfLoanLanding Rendered", onlyViewDetails);
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
      status: { value: 0, label: "All" },
      monthId: new Date().getMonth() + 1,
      yearId: new Date().getFullYear(),
    },
  });

  const getData = (srcTxt = values?.search, page, isPaginated = true) => {
    const url = `/PfLoan/GetAll?BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&FromDate=${
      values?.fDate
    }&ToDate=${values?.tDate}&PageNo=${
      page?.current || pages?.current
    }&PageSize=${
      page?.pageSize || pages?.pageSize
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
    if (!onlyViewDetails) {
      getData("", pages);
    } else {
      getLoanById(
        `/PfLoan/GetById?BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&LoanHeaderId=${onlyViewDetails?.intEmployeeLoanHeaderId}
                  `,
        (data) => {
          setSingleData(data);
          setViewDetails(true);
        }
      );
    }
  }, [wId, wgId, onlyViewDetails]);

  return permission?.isView ? (
    <>
      {(loanLandingLoading || loanByIdLoading || loading) && <Loading />}
      {!onlyViewDetails && (
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
                      options={statusDDL}
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
                header={pfLandingColData(history, setLoading, getData)}
                scroll={{ x: 1500 }}
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
      )}

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
      <LoanDetailsView
        loanByIdLoading={loanByIdLoading}
        viewDetails={viewDetails}
        setViewDetails={setViewDetails}
        loanByIdDto={loanByIdDto}
        setViewEarlySettled={setViewEarlySettled}
        setLoading={setLoading}
        buId={buId}
        wgId={wgId}
        values={values}
        setFieldValue={setFieldValue}
        employeeId={employeeId}
        getData={getData}
        pages={pages}
        singleData={singleData}
        onlyViewDetails={onlyViewDetails}
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default PfLoanLanding;
