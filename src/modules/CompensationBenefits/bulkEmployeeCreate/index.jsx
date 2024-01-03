import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import BackButton from "../../../common/BackButton";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import ScrollableTable from "../../../common/ScrollableTable";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { downloadFile } from "../../../utility/downloadFile";
import { excelFileToArray } from "../../../utility/excelFileToJSON";
import { formatMoney } from "../../../utility/formatMoney";
import ErrorEmployeeModal from "./ErrorEmployeeModal";
import {
  processBulkUploadEmployeeAction,
  saveBulkUploadEmployeeAction,
} from "./helper";
import { isDevServer } from "App";

const initData = {
  files: "",
  businessUnit: "",
  workplaceGroup: "",
  workplace: "",
};

export default function BulkEmployeeTaxAssign() {
  // hooks
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // for create state
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const { orgId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = () => {
    const emptyCheck = data?.some((item) => item?.strEmployeeCode === "");

    const duplicateCheck = data.map((item) => item?.strEmployeeCode);

    const isDuplicate = duplicateCheck.some((item, idx) => {
      return duplicateCheck.indexOf(item) !== idx;
    });

    const modifyData = data?.map((itm) => {
      return {
        strEmployeeCode: itm?.strEmployeeCode,
        numTaxAmount: itm?.numTaxAmount,
      };
    });

    const callBack = () => {
      history.push("/compensationAndBenefits/incometaxmgmt/taxassign");
      setData([]);
    };

    if (modifyData?.length <= 0 || emptyCheck || isDuplicate) {
      toast.warn(
        "Invalid upload, please check your file or follow employee code which must be unique and not empty"
      );
    } else {
      saveBulkUploadEmployeeAction(setLoading, modifyData, callBack);
    }
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 8) {
      permission = item;
    }
  });

  const processData = async (file) => {
    try {
      const processData = await excelFileToArray(
        file,
        "Bulk Tax Assign Upload"
      );
      if (processData.length < 1) return toast.warn("No data found!");
      processBulkUploadEmployeeAction(
        processData,
        setData,
        setLoading,
        orgId,
        employeeId
      );
    } catch (error) {
      toast.warn("Failed to process!");
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div>
                {permission?.isCreate ? (
                  <div className="table-card">
                    <div className="table-card-heading">
                      <BackButton />
                      <PrimaryButton
                        className="btn btn-green btn-green-disable"
                        label="Save"
                        type="submit"
                      />
                    </div>

                    {/* tax form */}
                    <div className="row">
                      <div className="col-lg-6 d-flex align-items-center mb-2">
                        <PrimaryButton
                          className="btn btn-default mr-1"
                          label="Download Demo"
                          onClick={() => {
                            downloadFile(
                              `${
                                isDevServer
                                  ? "/document/downloadfile?id=18"
                                  : "/document/downloadfile?id=18"
                              }`,
                              "Bulk Tax Assign Upload",
                              "xlsx",
                              setLoading
                            );
                          }}
                          type="button"
                        />
                        <input
                          type="file"
                          accept=".xlsx"
                          onChange={(e) => {
                            !!e.target.files?.[0] && setLoading(true);
                            processData(e.target.files?.[0]);
                          }}
                          onClick={(e) => {
                            e.target.value = null;
                          }}
                        />
                      </div>
                    </div>

                    {/* tax landing */}
                    <div>
                      {data.length > 0 ? (
                        <div className="table-card-body mt-3">
                          <ScrollableTable
                            classes="salary-process-table"
                            secondClasses="table-card-styled tableOne scroll-table-height"
                          >
                            <thead>
                              <tr>
                                <th style={{ width: "30px" }}>
                                  <div>SL</div>
                                </th>
                                <th>
                                  <div>Employee Code</div>
                                </th>
                                <th>
                                  <div>Employee Name</div>
                                </th>
                                <th>
                                  <div>Designation</div>
                                </th>
                                <th>
                                  <div>Department</div>
                                </th>
                                <th>
                                  <div>Take-Home Pay</div>
                                </th>
                                <th>
                                  <div className="text-right">Gross Salary</div>
                                </th>
                                <th>
                                  <div
                                    className="text-right"
                                    style={{ width: "140px" }}
                                  >
                                    Tax Amount
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {data?.map((item, index) => (
                                <tr key={index}>
                                  <td className="text-center">{index + 1}</td>
                                  <td>
                                    <div>
                                      <span className="tableBody-title">
                                        {item?.strEmployeeCode}
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <span className="tableBody-title">
                                        {item?.employeeName}
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <span className="tableBody-title">
                                        {item?.strDesignation}
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <span className="tableBody-title">
                                        {item?.strDepartment}
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="tableBody-title">
                                      {item?.isTakeHomePay ? "Yes" : "No"}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="tableBody-title text-right">
                                      {formatMoney(item?.numGrossSalary)}
                                    </div>
                                  </td>
                                  <td className="tableBody-title text-right">
                                    {item?.numTaxAmount}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </ScrollableTable>
                        </div>
                      ) : (
                        <>
                          {!loading && (
                            <NoResult title="No Data Found" para="" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <NotPermittedPage />
                )}
              </div>
              {/* addEdit form Modal */}
              <ErrorEmployeeModal
                show={open}
                title={"Error Data List"}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                classes="default-modal"
                values={values}
                resetForm={resetForm}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
