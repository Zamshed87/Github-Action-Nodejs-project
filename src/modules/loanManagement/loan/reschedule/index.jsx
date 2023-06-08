/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getPeopleDeskAllLanding } from "../../../../common/api";
import Loading from "../../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import CreateModal from "../common/CreateModal";
import Cardtable from "./component/Cardtable";
import { getLoanRescheduleFilter } from "./helper";
import "./index.css";
import ViewModal from "./ViewModal";

const initData = {
  search: "",
  employee: "",
  loanType: "",
  loanAmount: "",
  installmentNumber: "",
  amountPerInstallment: "",
  description: "",
};

const Reschedule = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, []);

  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [show, setShow] = useState(false);
  const [view, setView] = useState(false);

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [singleData, setSingleData] = useState(null);
  const [isFilter, setIsFilter] = useState(false);
  const [allData, setAllData] = useState([]);
  const masterFilterHandler = ({
    loanType,
    fromDate,
    minimumAmount,
    toDate,
    maximumAmount,
  }) => {
    setAnchorEl(null);
    const payload = {
      loanTypeId: loanType.value || 0,
      fromDate,
      minimumAmount: minimumAmount || 0,
      toDate,
      maximumAmount: maximumAmount || 0,
      depId: 0,
      desId: 0,
      empId: 0,
    };
    getLoanRescheduleFilter(
      "LoanApplicationReScheduleList",
      orgId,
      buId,
      0,
      0,
      payload,
      setTableData,
      setRowData,
      setLoading
    );
  };
  const getData = () => {
    getPeopleDeskAllLanding(
      "LoanApplicationReScheduleList",
      orgId,
      buId,
      0,
      setTableData,
      setRowData,
      setLoading
    );
  };
  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = rowData?.filter((item) =>
        regex.test(item?.employeeName?.toLowerCase())
      );
      setRowDto({ Result: newDta });
    } catch {
      setRowDto([]);
    }
  };
  useEffect(() => {
    getData();
  }, [orgId, buId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="table-card">
                <div className="table-card-heading">
                  <div></div>
                  <div className="table-card-head-right">
                    {/* <ul className="d-flex flex-wrap">
                                {isFilter && (
                                  <li>
                                    <ResetButton
                                      title="reset"
                                      icon={
                                        <SettingsBackupRestoreOutlined
                                          sx={{ marginRight: "10px" }}
                                        />
                                      }
                                      onClick={() => {
                                        setIsFilter(false);
                                        setFieldValue("search", "");
                                        getData();
                                      }}
                                    />
                                  </li>
                                )}
                                <li>
                                  <MasterFilter
                                    width="200px"
                                    inputWidth="200px"
                                    value={values?.search}
                                    setValue={(value) => {
                                      searchData(
                                        value,
                                        rowData,
                                        setTableData
                                      );
                                      setFieldValue("search", value);
                                      
                                    }}
                                    cancelHandler={() => {
                                      // setIsFilter(false);
                                      setFieldValue("search", "");
                                      getData();
                                    }}
                                    handleClick={handleClick}
                                  />
                                </li>
                              </ul> */}
                  </div>
                </div>
                <div className="table-card-body">
                  <div>
                    <Cardtable
                      tableData={tableData}
                      rowData={rowData}
                      setView={setView}
                      setShow={setShow}
                      setSingleData={setSingleData}
                      loading={loading}
                    ></Cardtable>
                  </div>
                </div>
              </div>
              {/* <FilterModal
                  propsObj={{
                    id,
                    open,
                    anchorEl,
                    handleClose,
                    masterFilterHandler,
                    setIsFilter
                  }}
                ></FilterModal> */}
            </Form>
          </>
        )}
      </Formik>

      <CreateModal
        show={show}
        title="Reschedule Loan"
        onHide={setShow}
        size="lg"
        backdrop="static"
        classes="default-modal"
        getData={getData}
        singleData={singleData}
      />
      <ViewModal
        show={view}
        title="Reschedule Details"
        onHide={setView}
        size="lg"
        backdrop="static"
        classes="default-modal"
        singleData={singleData}
        setShow={setShow}
      />
    </>
  );
};

export default Reschedule;
