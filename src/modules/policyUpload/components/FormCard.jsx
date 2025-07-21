import React, { useEffect, useRef, useState } from "react";
import FormikInput from "../../../common/FormikInput";
import { useDispatch } from "react-redux";
import { attachment_action } from "../helper";
import { getDownlloadFileView_Action } from "../../../commonRedux/auth/actions";
import { AttachmentOutlined, FileUpload } from "@mui/icons-material";
import "../style.css";
import FormikSelect from "../../../common/FormikSelect";
import { customStyles } from "../../../utility/selectCustomStyle";
import { AddOutlined } from "@mui/icons-material";
import ViewModal from "../../../common/ViewModal";
import AddPolicyCategory from "./AddPolicyCategory";
import { gray600, success500 } from "../../../utility/customColor";
import { getAllWorkPlace } from "modules/announcement/helper";

const FormCard = ({
  propsObj,
  imageFile,
  setImageFile,
  setLoading,
  businessUnitDDL,
  departmentDDL,
  policyCategoryDDL,
  setPolicyCategoryDDL,
  orgId,
  buId,
  workplaceGroupDDL,
  workplaceDDL,
  employeeId,
  setWorkplaceDDL,
}) => {
  const dispatch = useDispatch();
  const { values, setFieldValue, errors, touched, setValues } = propsObj;
  const [show, setShow] = useState(false);
  // image
  const inputFile = useRef(null);

  const onButtonClick = () => {
    inputFile.current.click();
  };
  useEffect(() => {
    if (true) {
      console.log({ values });
      setWorkplaceDDL([]);
      // setFieldValue("workPlace", "");
      values?.workGroup.length > 0 &&
        values?.workGroup?.forEach((options) => {
          getAllWorkPlace(
            `PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${options?.value}&intId=${employeeId}`,
            "intWorkplaceId",
            "strWorkplace",
            setWorkplaceDDL
          );
        });
    }

    //  else {
    //   setWorkplaceDDL([]);
    //   // setFieldValue("workPlace", "");
    //   values?.workGroup?.forEach((options) => {
    //     getAllWorkPlace(
    //       // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${options?.value}&intId=${employeeId}`,
    //       `/PeopleDeskDdl/WorkplaceIdAll?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${options?.value}`,
    //       "intWorkplaceId",
    //       "strWorkplace",
    //       setWorkplaceDDL
    //     );
    //   });
    // }

    // eslint-disable-next-line
  }, [values?.workGroup, orgId, buId, employeeId]);

  return (
    <>
      <div className="row">
        <div className="col-lg-3">
          <label>Policy Category</label>
          <div className="policy-category-ddl-wrapper">
            <FormikSelect
              placeholder=" "
              classes="input-sm"
              styles={customStyles}
              name="policyCategory"
              options={policyCategoryDDL || []}
              value={values?.policyCategory}
              onChange={(valueOption) => {
                setFieldValue("policyCategory", valueOption);
              }}
              errors={errors}
              touched={touched}
            />
            <div className="category-add">
              <button
                type="button"
                className="btn add-ddl-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShow(true);
                }}
              >
                <AddOutlined sx={{ fontSize: "16px" }} />
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="input-field-main">
            <label>Policy Title</label>
            <FormikInput
              classes="input-sm"
              value={values?.policyTitle}
              placeholder=" "
              name="policyTitle"
              type="text"
              className="form-control"
              onChange={(e) => {
                setFieldValue("policyTitle", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div>
            <label>WorkPlace Group</label>
            <FormikSelect
              placeholder=" "
              classes="input-sm"
              styles={{
                ...customStyles,
                control: (provided, state) => ({
                  ...provided,
                  minHeight: "auto",
                  height: values?.workGroup?.length > 1 ? "auto" : "30px",
                  borderRadius: "4px",
                  boxShadow: `${success500}!important`,
                  ":hover": {
                    borderColor: `${gray600}!important`,
                  },
                  ":focus": {
                    borderColor: `${gray600}!important`,
                  },
                }),
                valueContainer: (provided, state) => ({
                  ...provided,
                  height: values?.workGroup?.length > 1 ? "auto" : "30px",
                  padding: "0 6px",
                }),
                multiValue: (styles) => {
                  return {
                    ...styles,
                    position: "relative",
                    top: "-1px",
                  };
                },
                multiValueLabel: (styles) => ({
                  ...styles,
                  padding: "0",
                }),
              }}
              name="workGroup"
              options={
                [
                  // { value: 0, label: "All" },
                  ...workplaceGroupDDL,
                ] || []
              }
              value={values?.workGroup}
              onChange={(selectedOptions) => {
                // let newValue = selectedOptions || [];

                // // Check if "All" was selected
                // const isAllSelected = newValue.some((opt) => opt.value === 0);
                // const hasOtherSelections = newValue.some(
                //   (opt) => opt.value !== 0
                // );

                // if (isAllSelected && hasOtherSelections) {
                //   // Only keep "All"
                //   newValue = [{ value: 0, label: "All" }];
                // } else if (isAllSelected && newValue.length > 1) {
                //   // User selected "All" when others were selected
                //   newValue = [{ value: 0, label: "All" }];
                // } else if (
                //   hasOtherSelections &&
                //   values?.workGroup?.length > 0 &&
                //   values?.workGroup?.some((opt) => opt.value === 0)
                // ) {
                //   // "All" is already selected, remove it if user selects something else
                //   newValue = newValue.filter((opt) => opt.value !== 0);
                // }

                setFieldValue("workGroup", selectedOptions);
              }}
              isMulti
              errors={errors}
              touched={touched}
              isClearable={false}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <div>
            <label>WorkPlace</label>
            <FormikSelect
              placeholder=" "
              classes="input-sm"
              styles={{
                ...customStyles,
                control: (provided, state) => ({
                  ...provided,
                  minHeight: "auto",
                  height: values?.workPlace?.length > 1 ? "auto" : "30px",
                  borderRadius: "4px",
                  boxShadow: `${success500}!important`,
                  ":hover": {
                    borderColor: `${gray600}!important`,
                  },
                  ":focus": {
                    borderColor: `${gray600}!important`,
                  },
                }),
                valueContainer: (provided, state) => ({
                  ...provided,
                  height: values?.workPlace?.length > 1 ? "auto" : "30px",
                  padding: "0 6px",
                }),
                multiValue: (styles) => {
                  return {
                    ...styles,
                    position: "relative",
                    top: "-1px",
                  };
                },
                multiValueLabel: (styles) => ({
                  ...styles,
                  padding: "0",
                }),
              }}
              name="workPlace"
              options={
                [
                  // { value: 0, label: "All" },
                  ...workplaceDDL,
                ] || []
              }
              value={values?.workPlace}
              onChange={(selectedOptions) => {
                // let newValue = selectedOptions || [];

                // // Check if "All" was selected
                // const isAllSelected = newValue.some((opt) => opt.value === 0);
                // const hasOtherSelections = newValue.some(
                //   (opt) => opt.value !== 0
                // );
                // if (isAllSelected && hasOtherSelections) {
                //   // Only keep "All"
                //   newValue = [{ value: 0, label: "All" }];
                // } else if (isAllSelected && newValue.length > 1) {
                //   // User selected "All" when others were selected
                //   newValue = [{ value: 0, label: "All" }];
                // } else if (
                //   hasOtherSelections &&
                //   values?.workPlace?.length > 0 &&
                //   values?.workPlace?.some((opt) => opt.value === 0)
                // ) {
                //   // "All" is already selected, remove it if user selects something else
                //   newValue = newValue.filter((opt) => opt.value !== 0);
                // }

                setFieldValue("workPlace", selectedOptions);
              }}
              isMulti
              errors={errors}
              touched={touched}
              isClearable={false}
            />
          </div>
        </div>

        <div className="col-lg-3">
          <label>Department</label>
          <FormikSelect
            placeholder=" "
            classes="input-sm"
            styles={{
              ...customStyles,
              control: (provided, state) => ({
                ...provided,
                minHeight: "auto",
                height: values?.businessUnit?.length > 3 ? "auto" : "30px",
                borderRadius: "4px",
                boxShadow: `${success500}!important`,
                ":hover": {
                  borderColor: `${gray600}!important`,
                },
                ":focus": {
                  borderColor: `${gray600}!important`,
                },
              }),
              valueContainer: (provided, state) => ({
                ...provided,
                height: values?.businessUnit?.length > 3 ? "auto" : "30px",
                padding: "0 6px",
              }),
              multiValue: (styles) => {
                return {
                  ...styles,
                  position: "relative",
                  top: "-1px",
                };
              },
              multiValueLabel: (styles) => ({
                ...styles,
                padding: "0",
                position: "relative",
                top: "-1px",
              }),
            }}
            name="department"
            options={
              [
                {
                  value: 0,
                  label: "All",
                },
                ...departmentDDL,
              ] || []
            }
            value={values?.department}
            onChange={(selectedOptions) => {
              let newValue = selectedOptions || [];

              // Check if "All" was selected
              const isAllSelected = newValue.some((opt) => opt.value === 0);
              const hasOtherSelections = newValue.some(
                (opt) => opt.value !== 0
              );
              if (isAllSelected && hasOtherSelections) {
                // Only keep "All"
                newValue = [{ value: 0, label: "All" }];
              } else if (isAllSelected && newValue.length > 1) {
                // User selected "All" when others were selected
                newValue = [{ value: 0, label: "All" }];
              } else if (
                hasOtherSelections &&
                values?.department?.length > 0 &&
                values?.department?.some((opt) => opt.value === 0)
              ) {
                // "All" is already selected, remove it if user selects something else
                newValue = newValue.filter((opt) => opt.value !== 0);
              }

              setFieldValue("department", newValue);
            }}
            isMulti
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3 mt-3">
          <p
            onClick={onButtonClick}
            className="d-inline-block mt-2 pointer uplaod-para"
          >
            <input
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  attachment_action(
                    orgId,
                    "PolicyUpload",
                    13,
                    buId,
                    employeeId,
                    e.target.files,
                    setLoading
                  )
                    .then((data) => {
                      setImageFile(data?.[0]);
                    })
                    .catch((error) => {
                      setImageFile("");
                    });
                }
              }}
              type="file"
              id="file"
              accept="image/png, image/jpeg, image/jpg, .pdf"
              ref={inputFile}
              style={{ display: "none" }}
            />
            <span style={{ fontSize: "14px" }}>
              <FileUpload
                sx={{
                  marginRight: "5px",
                  fontSize: "18px",
                }}
              />{" "}
              Upload files
            </span>
            <sub className="text-danger"> (Max file size: 1MB)</sub>
          </p>{" "}
          <br />
          {imageFile?.globalFileUrlId ? (
            <div
              className="d-inline-block"
              onClick={() => {
                dispatch(
                  getDownlloadFileView_Action(imageFile?.globalFileUrlId)
                );
              }}
            >
              <div
                className="d-flex align-items-center"
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#0072E5",
                  cursor: "pointer",
                }}
              >
                <AttachmentOutlined
                  sx={{ marginRight: "5px", color: "#0072E5" }}
                />
                {imageFile?.fileName || "Attachment"}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        {/* <div className="col-12"></div> */}
        <div className="col-lg-1 mt-3">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-green btn-green-disable"
              type="submit"
              style={{ marginTop: "12px" }}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <ViewModal
        size="lg"
        title="Create Policy Category"
        backdrop="static"
        classes="default-modal preview-modal"
        show={show}
        onHide={() => setShow(false)}
      >
        <AddPolicyCategory
          orgId={orgId}
          employeeId={employeeId}
          setPolicyCategoryDDL={setPolicyCategoryDDL}
          setShow={setShow}
        />
      </ViewModal>
    </>
  );
};

export default FormCard;
