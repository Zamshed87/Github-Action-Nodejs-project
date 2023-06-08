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

const initData = {
  search: "",
};

const customStyleObj = {
  root: {
    minWidth: "750px",
  },
};

const tableData = [
  {
    assetName: "Laptop",
    assetCode: "002",
    assignTo: "Taposhi Robeya",
    designation: "Business Analyst",
    department: "Development",
    uom: "1 Piece",
    assignedDate: "12/20/2021",
    accquisitionDate: "12/19/2021",
    warrantyDate: "12/19/2023",
  },
  {
    assetName: "Printer",
    assetCode: "009",
    assignTo: "Jahed Bin Rashed",
    designation: "CEO",
    department: "Development",
    uom: "1 Piece",
    assignedDate: "12/20/2021",
    accquisitionDate: "12/19/2021",
    warrantyDate: "12/19/2023",
  },
  {
    assetName: "Mazda Axello",
    assetCode: "101",
    assignTo: "Mridul",
    designation: "Business Analyst",
    department: "Development",
    uom: "1 Piece",
    assignedDate: "12/20/2021",
    accquisitionDate: "12/19/2021",
    warrantyDate: "12/19/2023",
  },
];

function handleClicks(event) {
  event.preventDefault();
}

export default function AssetDetails() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, []);

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([...tableData]);

  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};
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
      Asset Details
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
                    <div className="mr-2">
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
