/* eslint-disable no-unused-vars */
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton
} from "@mui/x-data-grid";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BackButton from "../../../../common/BackButton";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray900 } from "../../../../utility/customColor";
import { allEmployeeList } from "./helper";

const initData = {
  search: "",
};

const CustomReport = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const dispatch = useDispatch();
  const { orgId, buName, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getData = () => {
    allEmployeeList({ orgId, buId }, "", setLoading, setRowDto);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      field: "id",
      // hide: false,
      headerName: "Employee Id",
      width: 130,
    },
    {
      field: "EmployeeName",
      //   hideable: false,
      headerName: "Name",
      width: 200,
    },
    {
      field: "Designation",
      hideable: false,
      headerName: "Designation",
      width: 200,
    },
    {
      field: "Department",
      //   hideable: false,
      headerName: "Department",
      width: 200,
    },
    {
      field: "strWorkplaceGroup",
      hide: true,
      headerName: "Workplace Group",
      width: 200,
    },
    {
      field: "strWorkplace",
      hide: true,
      headerName: "Workplace",
      width: 200,
    },
    {
      field: "OfficeEmail",
      // hide: false,
      headerName: "Office Email",
      width: 200,
    },
    {
      field: "Email",
      // hide: false,
      headerName: "Personal Email",
      width: 200,
    },
    {
      field: "HouseRent",
      hide: true,
      headerName: "House Rent",
      width: 200,
    },
    {
      field: "Transport Bill",
      hide: true,
      headerName: "Transport Bill",
      width: 200,
    },
    {
      field: "Medical awareness",
      hide: true,
      headerName: "Medical awareness",
      width: 200,
    },
    {
      field: "Leave without pay",
      hide: true,
      headerName: "Leave without pay",
      width: 200,
    },
    {
      field: "Late Present",
      hide: true,
      headerName: "Late Present",
      width: 200,
    },
  ];

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let CustomToolbar = () => (
    <div className="pt-2">
      <GridToolbarContainer>
        <p style={{ color: "#637381", marginTop: "-10px" }}>
          Total Employee 83923
        </p>
        <div
          className="mx-0 ml-2 px-0"
          style={{
            margin: "0px !important",
            padding: "0px !important",
            marginTop: "-10px",
            color: gray900,
          }}
        >
          <GridToolbarColumnsButton />
        </div>
        <div className="" style={{ marginTop: "-10px" }}>
          <GridToolbarExport
            printOptions={{
              hideFooter: true,
              hideToolbar: true,
              disableToolbarButton: true,
            }}
            csvOptions={{
              fileName: `Custom_Report_${buName}`,
            }}
          />
          {/* <DownloadIcon /> */}
        </div>
        {/* <div className="mx-2" style={{ marginTop: "-10px" }}>
          <PrintIcon />
        </div> */}

        <GridToolbarFilterButton
          className="mx-0 ml-2 px-0"
          style={{ marginTop: "-10px" }}
        />
        <GridToolbarDensitySelector
          className="mx-0 ml-2 px-0"
          style={{ marginTop: "-10px" }}
        />
        {/* <GridToolbarExport
              className="mx-0 ml-2 px-0"
              style={{ marginTop: "-10px" }}
            /> */}
      </GridToolbarContainer>
    </div>
  );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        // saveHandler(values, () => {
        //   resetForm(initData);
        // });
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
                <div>
                  <BackButton title={"Custom Report Maker"} />
                </div>

                <ul>
                  <li>
                    <MasterFilter
                      inputWidth="200px"
                      width="200px"
                      value={values?.search}
                      setValue={(value) => {
                        setFieldValue("search", value);
                        // debounce(() => {
                        //   searchData(value);
                        // }, 500);
                      }}
                      cancelHandler={() => {
                        setFieldValue("searchString", "");
                        // getData();
                      }}
                    />
                  </li>
                </ul>
              </div>

              <div className="table-card-body">
                <div
                  style={{ height: 400, width: "100%" }}
                  className="data-grid-table"
                >
                  <DataGrid
                    checkboxSelection
                    density="compact"
                    localeText={{
                      toolbarColumns: "",
                      toolbarFilters: "",
                      toolbarDensity: "",
                      toolbarExport: "",
                    }}
                    onSelectionModelChange={(ids) => {
                      const selectedIDs = new Set(ids);
                      const selectedRows = rowDto.filter((row) =>
                        selectedIDs.has(row.id)
                      );
                      setSelectedRows(selectedRows);
                    }}
                    columns={columns}
                    rows={rowDto}
                    components={{
                      Toolbar: CustomToolbar,
                    }}
                  />
                </div>
              </div>
            </div>
            <div style={{ fontSize: 10 }}></div>
            <div style={{ fontSize: 10 }}></div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default CustomReport;
