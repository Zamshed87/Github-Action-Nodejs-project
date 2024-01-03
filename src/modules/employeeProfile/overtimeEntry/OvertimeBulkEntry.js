import { isDevServer } from "App";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import BackButton from "../../../common/BackButton";
import PrimaryButton from "../../../common/PrimaryButton";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatter } from "../../../utility/dateFormatter";
import { downloadFile } from "../../../utility/downloadFile";
import { excelFileToArray } from "../../../utility/excelFileToJSON";
import {
  processBulkUploadOvertimeAction,
  saveBulkUploadOvertimeAction,
} from "./helper";

const initialValues = {
  files: "",
  date: "",
};

const validationSchema = Yup.object().shape({
  // date: Yup.string().required("Date is required"),
});

const OvertimeBulkEntry = () => {
  const { buId, employeeId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30333) {
      permission = item;
    }
  });

  const { handleSubmit } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      saveHandler(values);
    },
  });

  const processData = async (file) => {
    try {
      const processData = await excelFileToArray(file, 1);

      if (processData.length < 1) return toast.warn("No data found!");
      processBulkUploadOvertimeAction(
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

  const saveHandler = () => {
    const callBack = () => {
      setData([]);
    };
    data?.length > 0
      ? saveBulkUploadOvertimeAction(setIsLoading, data, callBack)
      : toast.warn("Please Upload Excel File");
  };

  return (
    <>
      {isLoading && <Loading />}
      {permission?.isCreate ? (
        <form onSubmit={handleSubmit}>
          <div className="table-card-heading justify-content-between mt-5">
            <BackButton />
            <PrimaryButton
              className="btn btn-green btn-green-disable"
              label="Save"
              type="submit"
            />
          </div>

          <div className="card-style pb-0 mt-3 mb-2">
            <div className="row">
              {/* <div className="col-3">
                <div className="input-field-main">
                  <label>Date</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.date}
                    onChange={(val) => {
                      setFieldValue("date", val.target.value);
                    }}
                    name="date"
                    type="month"
                    className="form-control"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div> */}
              <div className="col-6 d-flex align-items-center my-2">
                <PrimaryButton
                  className="btn btn-default mr-1"
                  label="Download Demo"
                  onClick={() => {
                    downloadFile(
                      `${
                        isDevServer
                          ? "/document/downloadfile?id=20"
                          : "/document/downloadfile?id=20"
                      }`,
                      "Overtime Bulk Upload",
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
                        <div>Daily/Monthly</div>
                      </th>
                      <th>
                        <div>Date</div>
                      </th>
                      <th>
                        <div>Overtime Hour</div>
                      </th>
                      <th>
                        <div>Reason</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={item?.employeeCode}>
                        <td>
                          <div className="content tableBody-title">
                            {index + 1}
                          </div>
                        </td>
                        <td>
                          <div className="content tableBody-title">
                            {item?.employeeCode}
                          </div>
                        </td>
                        <td>
                          <div className="content tableBody-title">
                            {item?.strDailyOrMonthly}
                          </div>
                        </td>
                        <td>
                          <div className="content tableBody-title">
                            {dateFormatter(item?.dteOverTimeDate)}
                          </div>
                        </td>
                        <td>
                          <div className="content tableBody-title">
                            {item?.numOverTimeHour}
                          </div>
                        </td>
                        <td>
                          <div className="content tableBody-title">
                            {item?.strReason}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </form>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default OvertimeBulkEntry;
