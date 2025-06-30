/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Tab, Tabs } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { getPeopleDeskAllDDL } from "../../../common/api";
import FormikSelect from "../../../common/FormikSelect";
import IConfirmModal from "../../../common/IConfirmModal";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../utility/customHooks/useAxiosPost";
import { customStyles } from "../../../utility/selectCustomStyle";
import { todayDate } from "../../../utility/todayDate";
import PfAccountCard from "./components/pfAccountCard";
import PFWithdraw from "./components/pfWithdraw";
import ProvidentNFund from "./components/providentNFund";
import TabPanel, { a11yProps } from "./components/tabPanel";

const validationSchema = Yup.object({
  withdrawAmount: Yup.string().required("Withdraw amount is required"),
  applicationDate: Yup.string().required("Application Date is required"),
  employee: Yup.object()
    .shape({
      label: Yup.string().required("Employee is required"),
      value: Yup.string().required("Employee is required"),
    })
    .typeError("Employee is required"),
});

function PFCompLanding() {
  const dispatch = useDispatch();
  const [singleData, setSingleData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [employeeDDL, setEmployeeDDL] = useState([]);
  const [viewPFWithYear, getViewPFWithYear, loading1] = useAxiosGet();
  const [, postData] = useAxiosPost();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { orgId, buId, employeeId, userName, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const initialValues = {
    withdrawAmount: "",
    applicationDate: "",
    reason: "",
    employee: {
      value: employeeId,
      label: userName,
    },
  };

  const {
    setFieldValue,
    setValues,
    values,
    errors,
    touched,
    handleSubmit,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues,
    onSubmit: (values) => saveHandler(values),
  });

  const getData = () => {
    getViewPFWithYear(
      `/Employee/PfNGratuityLanding?IntAccountId=${orgId}&IntEmployeeId=${
        values?.employee?.value || employeeId
      }`
    );
  };

  const saveHandler = (values) => {
    postData(
      `/Employee/CRUDPfWithdraw`,
      {
        intPFWithdrawId: !singleData?.intPFWithdrawId
          ? 0
          : singleData?.intPFWithdrawId,
        intEmployeeId: values?.employee?.value || employeeId,
        strEmployee: values?.employee?.label || userName,
        intAccountId: orgId,
        dteApplicationDate: values?.applicationDate,
        numWithdrawAmount: +values?.withdrawAmount,
        strReason: values?.reason,
        isActive: true,
        intCreatedBy: employeeId,
        dteCreatedAt: todayDate(),
        strStatus: "",
      },
      () => {
        setSingleData("");
        setIsEdit(false);
        getData();
        resetForm(initialValues);
        setValues({
          employee: {
            value: values?.employee?.value || employeeId,
            label: values?.employee?.label || userName,
          },
        });
      },
      true
    );
  };

  const demoPopup = (item) => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: "Are you want to sure you delete your withdrawal?",
      yesAlertFunc: () => {
        postData(
          `/Employee/CRUDPfWithdraw`,
          {
            intPFWithdrawId: item?.intPFWithdrawId,
            intEmployeeId: item?.intEmployeeId,
            strEmployee: item?.strEmployee,
            intAccountId: item?.intAccountId,
            dteApplicationDate: item?.dteApplicationDate,
            numWithdrawAmount: item?.numWithdrawAmount,
            strReason: item?.strReason,
            isActive: false,
            intCreatedBy: item?.intCreatedBy,
            dteCreatedAt: item?.dteCreatedAt,
            strStatus: "",
          },
          () => {
            setSingleData("");
            setIsEdit(false);
            getData();
            resetForm(initialValues);
            setValues({
              employee: {
                value: item?.intEmployeeId || employeeId,
                label: item?.strEmployee || userName,
              },
            });
          },
          true
        );
      },
      noAlertFunc: () => {
        //   history.push("/components/dialogs")
      },
    };
    IConfirmModal(confirmObject);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, employeeId, values?.employee]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/Employee/EmployeeListBySupervisorORLineManagerNOfficeadmin?EmployeeId=${employeeId}&WorkplaceGroupId=${wgId}`,
      "intEmployeeBasicInfoId",
      "strEmployeeName",
      setEmployeeDDL
    );
  }, [employeeId, wgId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 204) {
      permission = item;
    }
  });
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading1 && <Loading />}
      <form onSubmit={handleSubmit}>
        <div>
          {permission?.isView ? (
            <div className="table-card">
              <div className="table-card-heading">
                <div className="input-field-main">
                  <FormikSelect
                    menuPosition="fixed"
                    name="employee"
                    isClearable={false}
                    options={employeeDDL || []}
                    value={values?.employee}
                    onChange={(valueOption) => {
                      setFieldValue("employee", valueOption);
                    }}
                    styles={{
                      ...customStyles,
                      valueContainer: (provided, state) => ({
                        ...provided,
                        height: "30px",
                        padding: "0 6px",
                        width: "200px",
                      }),
                    }}
                    errors={errors}
                    placeholder=""
                    touched={touched}
                  />
                </div>
                <ul className="d-flex flex-wrap">
                  <li></li>
                  <li></li>
                </ul>
              </div>
              <div className="table-card-body" style={{ marginTop: "-30px" }}>
                <div className="mb-3">
                  <PfAccountCard
                    rowDto={viewPFWithYear?.pfAccountViewModel}
                    loading={loading1}
                  />
                </div>
              </div>
              <div className="tab-panel">
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                      TabIndicatorProps={{
                        style: { background: "#299647", height: 3 },
                      }}
                      sx={{
                        "& .MuiTabs-indicator": { backgroundColor: "#299647" },
                        "& .MuiTab-root": { color: "#667085" },
                        "& .Mui-selected": { color: "#299647" },
                      }}
                    >
                      <Tab label="Provident & Fund" {...a11yProps(0)} />
                      <Tab label="PF Withdraw" {...a11yProps(1)} />
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0}>
                    <ProvidentNFund
                      rowDto={viewPFWithYear?.fiscalYearWisePFInfoViewModel}
                      loading={loading1}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <PFWithdraw
                      propsObj={{
                        setFieldValue,
                        setValues,
                        values,
                        errors,
                        touched,
                        handleSubmit,
                        resetForm,
                        rowDto: viewPFWithYear?.pfWithdrawViewModel,
                        setSingleData,
                        isEdit,
                        setIsEdit,
                        demoPopup,
                        initialValues,
                      }}
                    />
                  </TabPanel>
                </Box>
              </div>
            </div>
          ) : (
            <NotPermittedPage />
          )}
        </div>
      </form>
    </>
  );
}

export default PFCompLanding;
