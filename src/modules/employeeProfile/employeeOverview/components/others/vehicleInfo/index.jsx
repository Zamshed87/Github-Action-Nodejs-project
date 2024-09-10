import { Avatar } from "@material-ui/core";
import {
  AirportShuttleOutlined,
  ControlPoint,
  EditOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ActionMenu from "../../../../../../common/ActionMenu";
import FormikInput from "../../../../../../common/FormikInput";
import Loading from "../../../../../../common/loading/Loading";
import { gray900, success500 } from "../../../../../../utility/customColor";
import { getEmployeeProfileViewData } from "../../../../employeeFeature/helper";
import { updateEmployeeProfile } from "../../helper";

const initData = {
  vehicleNo: "",
  autoId: 0,
};

export default function VehicleInfo({ empId, buId, wgId }) {
  const [isForm, setIsForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehicleNo, setVehicleNo] = useState({});

  const { employeeId, intAccountId, isOfficeAdmin } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getData = () => {
    getEmployeeProfileViewData(empId, setVehicleNo, setLoading, buId, wgId);
  };

  const saveHandler = (values, cb, isDelete = false, autoId) => {
    const payload = {
      partType: "VehicleNo",
      employeeId: empId,
      autoId: autoId || 0,
      value: isDelete ? "" : values?.vehicleNo,
      insertByEmpId: employeeId,
      isActive: isDelete ? false : true,
    };
    updateEmployeeProfile(payload, setLoading, cb);
  };

  useEffect(() => {
    getEmployeeProfileViewData(empId, setVehicleNo, setLoading, buId, wgId);
  }, [empId, buId, wgId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          saveHandler(
            values,
            () => {
              resetForm(initData);
              setIsForm(false);
              getData();
            },
            false,
            values?.autoId
          );
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
            <Form>
              {loading && <Loading />}
              <div className="others">
                {isForm ? (
                  <>
                    <h5>Vehicle No.</h5>
                    <div style={{ marginBottom: "25px", cursor: "pointer" }}>
                      <FormikInput
                        value={values?.vehicleNo}
                        name="vehicleNo"
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                        onChange={(e) => {
                          setFieldValue("vehicleNo", e.target.value);
                        }}
                        placeholder=" "
                        classes="input-sm"
                      />
                      <div
                        className="d-flex align-items-center justify-content-end"
                        style={{ marginTop: "24px" }}
                      >
                        <button
                          className="btn btn-cancel"
                          style={{ marginRight: "16px" }}
                          type="button"
                          onClick={() => {
                            setIsForm(false);
                            resetForm(initData);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-green btn-green-disable"
                          type="submit"
                          disabled={!values?.vehicleNo}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {vehicleNo?.employeeProfileLandingView?.vehicleNo === "" ||
                    vehicleNo?.employeeProfileLandingView?.vehicleNo ===
                      null ? (
                      <div className={isForm ? "d-none" : "d-block"}>
                        <h5>Vehicle No.</h5>
                        <div
                          className="d-flex align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => setIsForm(true)}
                        >
                          <div
                            className="item"
                            style={{ position: "relative" }}
                          >
                            <ControlPoint
                              sx={{ color: success500, fontSize: "16px" }}
                            />
                          </div>
                          <div className="item">
                            <p>Add your vehicle no.</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="item">
                        <div className="d-flex align-items-center">
                          <Avatar className="overviewAvatar">
                            <AirportShuttleOutlined
                              sx={{
                                color: gray900,
                                fontSize: "18px",
                              }}
                            />
                          </Avatar>
                          <div className="item-info">
                            <h6>
                              {vehicleNo?.employeeProfileLandingView?.vehicleNo}
                            </h6>
                            <p>Vehicle No.</p>
                          </div>
                        </div>
                        <ActionMenu
                          color={gray900}
                          fontSize={"18px"}
                          options={[
                            ...(isOfficeAdmin || (intAccountId === 5 && !vehicleNo.isMarkCompleted) ? [
                              {
                                value: 1,
                                label: "Edit",
                                icon: (
                                  <EditOutlined
                                    sx={{ marginRight: "10px", fontSize: "16px" }}
                                  />
                                ),
                                onClick: () => {
                                  setIsForm(true);
                                  setFieldValue(
                                    "vehicleNo",
                                    vehicleNo?.employeeProfileLandingView?.vehicleNo
                                  );
                                  setFieldValue(
                                    "autoId",
                                    vehicleNo?.employeeProfileLandingView?.intEmployeeBasicInfoId
                                  );
                                },
                              },
                            ] : []),
                          ]}
                          
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
