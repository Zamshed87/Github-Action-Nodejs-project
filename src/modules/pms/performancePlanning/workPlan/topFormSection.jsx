import { Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DownloadOutlined } from "@mui/icons-material";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { workPlan_landing_api } from "./helper";
import PrimaryButton from "../../../../common/PrimaryButton";
import FormikInput from "../../../../common/FormikInput";

const TopFormSection = ({
  setIsShowRowItemModal,
  pdfExport,
  saveHandler,
  disabled,
  handleDisable,
  planList,
  setPlanList,
  userName,
  employeeId,
  strDesignation,
  values,
  setFieldValue,
  errors,
  touched,
  commonDDL,
  quaterDDL,
  setLoading,
  setActivityList,
  initData,
}) => {
  return (
    <div className="table-card">
      <div className="table-card-heading">
        <div></div>
        <ul className="d-flex flex-wrap">
          <li>
            <Button
              className="mr-2"
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();
                setIsShowRowItemModal(true);
              }}
              sx={{
                borderColor: "rgba(0, 0, 0, 0.6)",
                color: "rgba(0, 0, 0, 0.6)",
                fontSize: "10px",
                fontWeight: "bold",
                letterSpacing: "1.25px",
                "&:hover": {
                  borderColor: "rgba(0, 0, 0, 0.6)",
                },
                "&:focus": {
                  backgroundColor: "transparent",
                },
              }}
              startIcon={
                <VisibilityIcon
                  sx={{
                    color: "rgba(0, 0, 0, 0.6)",
                  }}
                  className="emp-print-icon"
                />
              }
            >
              View Work Plan
            </Button>
          </li>
          <li>
            <Button
              className="mr-2"
              variant="outlined"
              onClick={(e) => {
                e?.stopPropagation();
                pdfExport("Work plan");
              }}
              sx={{
                borderColor: "rgba(0, 0, 0, 0.6)",
                color: "rgba(0, 0, 0, 0.6)",
                fontSize: "10px",
                fontWeight: "bold",
                letterSpacing: "1.25px",
                "&:hover": {
                  borderColor: "rgba(0, 0, 0, 0.6)",
                },
                "&:focus": {
                  backgroundColor: "transparent",
                },
              }}
              startIcon={
                <DownloadOutlined
                  sx={{
                    color: "rgba(0, 0, 0, 0.6)",
                  }}
                  className="emp-print-icon"
                />
              }
            >
              DOWNLOAD PDF
            </Button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                saveHandler(values, () => {}, false);
              }}
              className="btn btn-green w-100"
              disabled={handleDisable() || disabled || planList?.isConfirm}
            >
              Save
            </button>
          </li>
        </ul>
      </div>
      <div className="table-card-body" style={{ marginTop: "8px" }}>
        <div className="card-style with-form-card pb-0 mb-3 ">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-4 mt-2">
                  <div>
                    <p>
                      <span className="font-weight-bold">Name :</span>{" "}
                      <span>{userName}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-weight-bold">Enroll :</span>{" "}
                      <span>{employeeId}</span>
                    </p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div>
                    <p>
                      <span className="font-weight-bold">Designation :</span>{" "}
                      <span>{strDesignation || ""}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-weight-bold">Workplace :</span>{" "}
                      <span>{""}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <br />
            <br />
            <div className="input-field-main col-lg-3">
              <FormikSelect
                classes="input-sm"
                label="Year"
                name="yearDDLgroup"
                options={commonDDL}
                value={values?.yearDDLgroup}
                onChange={(valueOption) => {
                  setFieldValue("yearDDLgroup", valueOption);
                  setFieldValue("quarterDDLgroup", "");
                  setPlanList([]);
                }}
                placeholder=" "
                styles={customStyles}
                errors={errors}
                touched={touched}
                menuPosition="fixed"
              />
            </div>
            <div className="input-field-main col-lg-3">
              <FormikSelect
                classes="input-sm"
                name="quarterDDLgroup"
                options={quaterDDL}
                value={values?.quarterDDLgroup}
                label="Quarter"
                onChange={(valueOption) => {
                  if (valueOption) {
                    setFieldValue("quarterDDLgroup", valueOption);
                    setPlanList([]);
                    workPlan_landing_api(
                      employeeId,
                      values?.yearDDLgroup?.value,
                      valueOption?.value,
                      setPlanList,
                      setLoading,
                      initData,
                      setFieldValue
                    );
                  } else {
                    setPlanList([]);
                    setFieldValue("quarterDDLgroup", "");
                  }
                }}
                placeholder=" "
                styles={customStyles}
                errors={errors}
                touched={touched}
                menuPosition="fixed"
              />
            </div>
            <div className="col-lg-3"></div>
            <div style={{ marginTop: "24px" }} className="col-lg-3 text-right d-flex justify-content-end ">
              <PrimaryButton
                type="button"
                className="btn btn-green flex-center"
                label={"Confirm"}
                disabled={handleDisable() || disabled || planList?.isConfirm}
                onClick={() => {
                  saveHandler(
                    values,
                    () => {
                      setPlanList([]);
                    },
                    true
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="table-card-body" style={{ marginTop: "40px" }}>
        <div className="card-style with-form-card pb-0 mb-3 ">
          <div className="row">
            <div className="input-field-main col-lg-2">
              <label>Activity Name</label>
              <FormikInput
                value={values?.activity}
                name="activity"
                classes="input-sm"
                onChange={(e) => {
                  setFieldValue("activity", e.target.value);
                }}
                type="text"
                className="form-control"
                errors={errors}
                touched={touched}
                disabled={planList?.isConfirm}
              />
            </div>
            <div style={{ marginTop: "24px" }} className="col-lg-2">
              <PrimaryButton
                type="button"
                className="btn btn-green flex-center"
                label={"Add"}
                disabled={!values?.activity || planList?.isConfirm}
                onClick={() => {
                  setActivityList((prev) => [
                    ...(Array.isArray(prev) ? prev : []),
                    {
                      rowId: Date.now().toString(),
                      activity: values?.activity,
                      priorityId: 0,
                      priority: null,
                    },
                  ]);
                  setFieldValue("activity", "");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopFormSection;
