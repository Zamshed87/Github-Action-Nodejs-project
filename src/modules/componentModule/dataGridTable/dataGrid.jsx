/* eslint-disable no-unused-vars */
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer
} from "@mui/x-data-grid";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import FormikSelect from "../../../common/FormikSelect";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray900 } from "../../../utility/customColor";
import { customStyles } from "../../../utility/selectCustomStyle";

const initData = {
  allSelected: false,
  selectCheckbox: "",
  ratings: "",
};

const initDataForDataGridTable = {
  salaryType: "",
};

const columns = [
  {
    field: "id",
    hide: true,
    headerName: "Identificador",
    width: 200,
  },
  {
    field: "name",
    hideable: false,
    headerName: "Name",
    width: 200,
  },
  {
    field: "address",
    headerName: "Address",
    flex: 1,
  },
];

const rows = [
  {
    id: "9831bih2b3139",
    name: "Adrian",
    address: "Dhaka",
  },
  {
    id: "6861bah211a11",
    name: "Hideki",
    address: "Dhaka1",
  },
  {
    id: "31z1baa33a22a",
    name: "Teste",
    address: "Dhaka2",
  },
];

const validationSchema = Yup.object().shape({});

export default function DataGridLanding() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const dispatch = useDispatch();

  // save handlers
  const saveHandler = (values, cb) => {};

  const saveHandlerForDataGridTable = (values, cb) => {};

  const handleChangePage = (page) => {};
  const handleChangeRowsPerPage = (size) => {};

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let CustomToolbar = () => (
    <Formik
      enableReinitialize={true}
      initialValues={initDataForDataGridTable}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandlerForDataGridTable(values, () => {
          resetForm(initDataForDataGridTable);
        });
      }}
    >
      {({
        handleSubmit,
        handleChange,
        resetForm,
        values,
        errors,
        touched,
        setFieldValue,
        isValid,
      }) => (
        <>
          <Form>
            <GridToolbarContainer>
              <div className="col-lg-3">
                <FormikSelect
                  classes="input-sm"
                  styles={customStyles}
                  placeholder={" "}
                  name="salaryType"
                  options={
                    [
                      {
                        value: 1,
                        label: "Addition",
                      },
                      {
                        value: 2,
                        label: "Deduction",
                      },
                    ] || []
                  }
                  value={values?.salaryType}
                  onChange={(valueOption) => {
                    setFieldValue("salaryType", valueOption);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
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
              <div className="mr-2" style={{ marginTop: "-10px" }}>
                <DownloadIcon />
              </div>
              <div className="mx-2" style={{ marginTop: "-10px" }}>
                <PrintIcon />
              </div>

              {/* <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport /> */}
            </GridToolbarContainer>
          </Form>
        </>
      )}
    </Formik>
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          handleChange,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form>
              <div className="container-fluids">
                <div className="mt-5 mb-2">
                  <h6 style={{ fontSize: "14px" }}>Data Grid Table</h6>
                </div>

                <div>
                  <div
                    style={{ height: 400, width: "100%" }}
                    className="data-grid-table"
                  >
                    <DataGrid
                      checkboxSelection
                      density="compact"
                      localeText={{
                        toolbarColumns: "",
                        // toolbarFilters: "my filters",
                        // toolbarDensity: "my density",
                        // toolbarExport: "my export"
                      }}
                      onSelectionModelChange={(ids) => {
                        const selectedIDs = new Set(ids);
                        const selectedRowData = rows.filter((row) =>
                          selectedIDs.has(row.id.toString())
                        );
                      }}
                      initialState={{
                        pinnedColumns: {
                          left: ["name"],
                          right: ["address"],
                        },
                      }}
                      columns={columns}
                      rows={rows}
                      components={{
                        Toolbar: CustomToolbar,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
