import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { downloadFile } from "../../../../utility/downloadFile";
import { excelFileToArray } from "../../../../utility/excelFileToJSON";
import {
  processBulkUploadIncrementAction,
  saveBulkUploadIncrementAction,
} from "./helper";
import { isDevServer } from "App";

const initData = {
  files: "",
};

export default function BulkIncrementEntry() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [data, setData] = useState([]);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const { buId, orgId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = () => {
    const callBack = () => {
      history.push("/compensationAndBenefits/increment");
      setData([]);
    };
    data?.length > 0
      ? saveBulkUploadIncrementAction(setIsLoading, data, callBack)
      : toast.warn("Please Upload Excel File");
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30304) {
      permission = item;
    }
  });

  const processData = async (file) => {
    try {
      const processData = await excelFileToArray(file, 1);
      if (processData.length < 1) return toast.warn("No data found!");
      processBulkUploadIncrementAction(
        processData,
        setData,
        setIsLoading,
        buId,
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
          handleSubmit
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {isLoading && <Loading />}
              <div>
                {permission?.isCreate ? (
                  <div className="table-card">
                    <div className="table-card-heading justify-content-end">
                      <PrimaryButton
                        className="btn btn-green btn-green-disable"
                        label="Save"
                        type="submit"
                      />
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-6 d-flex align-items-center">
                        <PrimaryButton
                          className="btn btn-default mr-1"
                          label="Download Demo"
                          onClick={() => {
                            downloadFile(
                              `${
                                isDevServer
                                  ? "/document/downloadfile?id=19"
                                  : "/document/downloadfile?id=19"
                              }`,
                              "Increment Bulk Upload",
                              "xlsx",
                              setIsLoading
                            );
                          }}
                          type="button"
                        />
                        <input
                          type="file"
                          accept=".xlsx"
                          onChange={(e) => {
                            processData(e.target.files?.[0]);
                          }}
                          onClick={(e) => {
                            e.target.value = null;
                          }}
                        />
                      </div>
                    </div>

                    {data.length > 0 && (
                      <div className="table-card-body mt-3">
                        <div className="table-card-styled tableOne">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>
                                  <div>SL</div>
                                </th>
                                <th>
                                  <div>Employee Id</div>
                                </th>
                                <th>
                                  <div>Name</div>
                                </th>
                                <th>
                                  <div>Designation</div>
                                </th>
                                <th>
                                  <div>Depend On</div>
                                </th>
                                <th>
                                  <div>Increment Percentage/Amount</div>
                                </th>
                                <th>
                                  <div>Effective Date</div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.map((item, index) => (
                                <tr key={item?.intEmployeeId}>
                                  <td>
                                    <div className="content tableBody-title">
                                      {index + 1}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      {item?.intEmployeeId}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      {item?.strEmployeeName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      {item?.strDesignation}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      {item?.strIncrementDependOn}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      {item?.numIncrementPercentageOrAmount}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="content tableBody-title">
                                      {dateFormatter(item?.dteEffectiveDate)}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <NotPermittedPage />
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
