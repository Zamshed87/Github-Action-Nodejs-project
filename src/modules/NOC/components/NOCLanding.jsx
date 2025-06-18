import React, { useRef, useState, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { monthFirstDate, monthLastDate } from "utility/dateFormatter";
import Loading from "common/loading/Loading";
import MasterFilter from "common/MasterFilter";
import PrimaryButton from "common/PrimaryButton";
import DefaultInput from "common/DefaultInput";
import AntScrollTable from "common/AntScrollTable";
import { NocLandingColumn } from "./utils";
import NoResult from "common/NoResult";
import NOCPrintDocument from "./NOCPrintDocument";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Modal, Form } from "antd";
import { useApiRequest } from "Hooks";
import { PSelect } from "Components";

const NOCLanding = ({ isManagement, pathurl }) => {
  const {
    profileData: { orgId, buId, employeeId, wgId, wId },
  } = useSelector((state) => state?.auth, shallowEqual);
  const history = useHistory();
  const [rowDto, getRowDataApi, loadingData] = useAxiosGet([]);
  const [printData, getPrintData, loadingPrint] = useAxiosGet();
  const [loading, setLoading] = React.useState(false);
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [signatureInfo, setSignatureInfo] = useState({
    name: "",
    designation: "",
    department: "",
    workplace: "",
    email: "",
    phone: "",
  });
  const [form] = Form.useForm();

  const employeeDDLApi = useApiRequest([]);

  const dispatch = useDispatch();

  // Add state for pagination
  const [pageNo, setPageNo] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const { values, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: {
      searchString: "",
      filterFromDate: monthFirstDate(),
      filterToDate: monthLastDate(),
    },
    onSubmit: (values, { setSubmitting, resetForm }) => {
      saveHandler(values);
    },
  });
  const saveHandler = (values) => {};

  const getLanding = (values) => {
    // &EmployeeId=${employeeId}
    let api = `/NocApplication?Accountid=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&WorkplaceId=${wId}&EmployeeId=${isManagement ? 0 : employeeId}&FromDate=${values?.filterFromDate}&ToDate=${values?.filterToDate}&PageNo=${pageNo}&PageSize=${pageSize}&IsDescending=false`;
    getRowDataApi(api);
  };

  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({
    contentRef,
  });

  // Simplified getById function that opens signature modal instead of immediate print
  const getById = (id) => {
    let api = `/NocApplication/${id}`;
    console.log("Getting NOC data for ID:", id);

    getPrintData(api, () => {
      // Open signature modal instead of printing directly
      setSignatureModalVisible(true);
    });
  };

  // Handle printing after signature is selected
  const handlePrintWithSignature = () => {
    setSignatureModalVisible(false);

    // Use a small timeout to ensure the component updates with signature info
    setTimeout(() => {
      reactToPrintFn();
    }, 300);
  };

  useEffect(() => {
    getLanding(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, employeeId, pageNo, pageSize]);

  const getEmployee = (value) => {
    if (value?.length < 2) return employeeDDLApi?.reset();

    employeeDDLApi?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };

  // Function to handle page change
  const handlePageChange = (page, size) => {
    setPageNo(page);
    setPageSize(size);
  };

  // Reset pagination when applying filters
  const applyFilters = () => {
    setPageNo(1); // Reset to first page when applying new filters
    getLanding(values);
  };

  return (
    <form>
      {(loadingData || loading) && <Loading />}
      <div className="table-card">
        <div style={{ display: "none" }}>
          <div ref={contentRef}>
            {
              <NOCPrintDocument
                nocData={printData}
                signatureInfo={signatureInfo}
              />
            }
          </div>
        </div>
        {/* header-employee-profile  */}
        <div className="table-card-heading">
          <div className="d-flex justify-content-center align-items-center">
            <div className="ml-2">
              <>
                <h6 className="count">NOC Application</h6>
              </>
            </div>
          </div>
          <ul className="d-flex flex-wrap">
            <li className="d-none">
              <MasterFilter
                inputWidth="250px"
                width="250px"
                isHiddenFilter
                value={values?.searchString}
                setValue={(value) => {
                  setFieldValue("searchString", value);
                }}
                cancelHandler={() => {
                  setFieldValue("searchString", "");
                }}
              />
            </li>
            <li>
              <PrimaryButton
                type="button"
                className="btn btn-default flex-center"
                label="Create NOC Request"
                onClick={() => {
                  history.push({
                    pathname: `${pathurl}/create`,
                    state: { isManagement },
                  });
                }}
              />
            </li>
          </ul>
        </div>
        <div className="card-style pb-0 mb-2" style={{ marginTop: "12px" }}>
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
                  }}
                />
              </div>
            </div>
            <div className="col-lg-3">
              <button
                className="btn btn-green btn-green-disable mt-4"
                type="button"
                disabled={!values?.filterFromDate || !values?.filterToDate}
                onClick={applyFilters}
              >
                View
              </button>
            </div>
          </div>
        </div>
        {console.log("rowDto", rowDto?.data)}
        <div className="table-card-body">
          <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
            {rowDto?.data?.length > 0 ? (
              <>
                <AntScrollTable
                  data={rowDto?.data || []}
                  columnsData={NocLandingColumn(
                    history,
                    pathurl,
                    isManagement,
                    setLoading,
                    dispatch,
                    getById
                  )}
                  currentPage={pageNo}
                  pageSize={pageSize}
                  setPage={setPageNo}
                  setPaginationSize={setPageSize}
                  onChange={handlePageChange}
                  rowKey={(record) => record?.intNocApplicationId}
                />
              </>
            ) : (
              <>
                {!loadingData && <NoResult title="No Result Found" para="" />}
              </>
            )}
          </div>
        </div>

        {/* Signature Modal */}
        <Modal
          title="Select Signatory"
          open={signatureModalVisible}
          onCancel={() => setSignatureModalVisible(false)}
          footer={[
            <div
              key="footer-container"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <button
                key="print"
                className="btn btn-green"
                onClick={handlePrintWithSignature}
                style={{ width: "180px", minWidth: "280px" }}
              >
                <LocalPrintshopIcon
                  style={{ fontSize: "18px", marginRight: "5px" }}
                />
                Print with Signature
              </button>
            </div>,
          ]}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item label="Select Employee">
              <PSelect
                options={employeeDDLApi?.data || []}
                name="employee"
                placeholder="Search minimum 2 character"
                onChange={(value, op) => {
                  const employeeNameWithCodeModify =
                    op?.employeeNameWithCode?.replace(/\(\d+\)/, "");
                  setSignatureInfo({
                    name: employeeNameWithCodeModify || "",
                    designation: op?.designationName || "",
                    department: op?.strDepartment || "",
                    workplace: op?.workplace || "",
                    email: op?.email || "",
                    phone: op?.phoneNumber || "",
                  });
                  form.setFieldsValue({
                    employee: op,
                  });
                }}
                showSearch
                filterOption={false}
                loading={employeeDDLApi?.loading}
                onSearch={(value) => {
                  getEmployee(value);
                }}
              />
            </Form.Item>
          </Form>

          <div style={{ marginTop: "20px" }}>
            <h4>Preview:</h4>
            <div
              style={{
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            >
              <p style={{ margin: "3px 0" }}>Sincerely,</p>
              <p style={{ margin: "3px 0", fontWeight: "bold" }}>
                {signatureInfo.name || ""}
              </p>
              <p style={{ margin: "3px 0" }}>
                {signatureInfo.designation || ""}
              </p>
              <p style={{ margin: "3px 0" }}>
                {signatureInfo.department || ""}
              </p>
              <p style={{ margin: "3px 0" }}>
                Email: {signatureInfo.email || ""}
              </p>
              <p style={{ margin: "3px 0" }}>
                Cell: {signatureInfo.phone || ""}
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </form>
  );
};

export default NOCLanding;
