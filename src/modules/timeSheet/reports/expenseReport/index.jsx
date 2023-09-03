/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { NavigateNext } from "@mui/icons-material";
import { Breadcrumbs, Stack, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import CardTable from "./components/CardTable";
import FilterModal from "./components/FilterModal";

const customStyleObj = {
  root: {
    minWidth: "750px",
  },
};

const initData = {
  search: "",
};

function handleClicks(event) {
  event.preventDefault();
}

const tableData = [
  {
    employeeName: "Mridul",
    employeeCode: "29108",
    employmentType: "Full Time",
    designation: "Business Analyst",
    department: "Engineering",
    expenseType: "Raw Materials",
    date: "01-01-2021",
    expenseAmount: "100",
    lineManager: "Md. Jahed",
    reason: "Purchase file for documents",
  },
  {
    employeeName: "Wahed",
    employeeCode: "29108",
    employmentType: "Full Time",
    designation: "Business Analyst",
    department: "Engineering",
    expenseType: "Raw Materials",
    date: "01-01-2021",
    expenseAmount: "100",
    lineManager: "Md. Jahed",
    reason: "Purchase file for documents",
  },
  {
    employeeName: "Taposhi",
    employeeCode: "29108",
    employmentType: "Full Time",
    designation: "Business Analyst",
    department: "Engineering",
    expenseType: "Raw Materials",
    date: "01-01-2021",
    expenseAmount: "100",
    lineManager: "Md. Jahed",
    reason: "Purchase file for documents",
  },
  {
    employeeName: "Anjuman",
    employeeCode: "29108",
    employmentType: "Full Time",
    designation: "Business Analyst",
    department: "Engineering",
    expenseType: "Raw Materials",
    date: "01-01-2021",
    expenseAmount: "100",
    lineManager: "Md. Jahed",
    reason: "Purchase file for documents",
  },
];

export default function ExpenseReport() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, []);

  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};

  const [rowDto, setRowDto] = useState([...tableData]);
  const [loading, setLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href="/"
      onClick={handleClicks}
    >
      Report
    </Link>,
    <Typography key="2" color="text.primary">
      Expense Report
    </Typography>,
  ];

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
                  <div className="breadcumb-content">
                    <Stack spacing={2}>
                      <Breadcrumbs
                        separator={
                          <NavigateNext
                            sx={{
                              fontSize: "16px",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                          />
                        }
                        aria-label="breadcrumb"
                      >
                        {breadcrumbs}
                      </Breadcrumbs>
                    </Stack>
                  </div>
                  <div className="table-card-head-right">
                    <MasterFilter
                      width="200px"
                      inputWidth="200px"
                      value={values?.search}
                      setValue={(value) => {
                        setFieldValue("search", value);
                      }}
                      cancelHandler={() => {
                        setFieldValue("search", "");
                      }}
                      handleClick={handleClick}
                    />
                  </div>
                </div>
                <div className="table-card-body">
                  {rowDto?.length > 0 && (
                    <div className="table-card-body">
                      <CardTable
                        propsObj={{
                          rowDto,
                          setRowDto,
                        }}
                      ></CardTable>
                    </div>
                  )}
                </div>
              </div>
              <FilterModal
                propsObj={{
                  id,
                  open,
                  anchorEl,
                  handleClose,
                  customStyleObj,
                }}
              ></FilterModal>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
