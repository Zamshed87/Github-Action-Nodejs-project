/* eslint-disable react-hooks/exhaustive-deps */
import { Clear } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getPeopleDeskAllDDL } from "../../../common/api";
import BorderlessSelect from "../../../common/BorderlessSelect";
import FormikInput from "../../../common/FormikInput";
import Loading from "../../../common/loading/Loading";
import { borderlessSelectStyle } from "../../../utility/BorderlessStyle";
import { createPosition, organogramSaveUpdate } from "../helper";
const initData = {
  position: "",
  employee: "",
  positionInput: "",
  positionGroup: "",
  positionGroupInput: "",
  code: "",
};
const AddChild = ({
  setAnchorEl,
  childList,
  parentId,
  autoId,
  getData,
  setAnchorElForAction,
}) => {
  const { buId, orgId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [isPosition, setIsPosition] = useState(false);
  // const [isPositionGroup, setIsPositionGroup] = useState(false);

  const [position, setPosition] = useState([]);
  const [emp, setEmp] = useState([]);
  // const [positionGrp, setPositionGrp] = useState([]);

  // const getPositionGroup = () => {
  //   getPeopleDeskAllDDL(
  //     "PositionGroup",
  //     orgId,
  //     buId,
  //     setPositionGrp,
  //     "PositionGroupId",
  //     "PositionGroupName"
  //   );
  // };
  const getPositionDDL = () => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Position&intAccountId=${orgId}&BusinessUnitId=${buId}&intId=0&WorkplaceGroupId=${wgId}&intWorkplaceId=${wId}`,
      "PositionId",
      "PositionName",
      setPosition
    );
  };

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfo&BusinessUnitId=${buId}&intId=${employeeId}&WorkplaceGroupId=${wgId}`,
      "EmployeeId",
      "EmployeeName",
      setEmp
    );
    getPositionDDL();
    // getPositionGroup();
  }, [buId, orgId]);

  const [loading, setLoading] = useState(false);

  return (
    <div className="organugram_form_main">
      {loading && <Loading />}
      <div className="organugram_form_header pt-2">
        <h3>{autoId ? "Add Child" : "Create Root"}</h3>
        <button
          onClick={() => {
            setAnchorElForAction(null);
            setAnchorEl(null);
          }}
          className="btn btn-cross"
        >
          <Clear sx={{ fontSize: "18px" }} />
        </button>
      </div>
      <hr className="m-0" />
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
          <Form className="addChild_form_container p-3">
            {/* <h1 className="text-center">Add Child Component</h1> */}
            <div className="container-addChild">
              <div>
                <div className="row align-items-end">
                  <div className="col-4">
                    <p>Position</p>
                  </div>
                  <div className="col-7 ml-0">
                    <BorderlessSelect
                      classes="input-sm"
                      name="position"
                      menuPosition="fixed"
                      options={position}
                      value={values?.position}
                      onChange={(valueOption) => {
                        setFieldValue("position", valueOption);
                      }}
                      placeholder=" "
                      styles={borderlessSelectStyle}
                      errors={errors}
                      touched={touched}
                      isDisabled={false}
                    />
                  </div>
                  {!isPosition && (
                    <button
                      type="button"
                      className="add_field_btn"
                      onClick={() => setIsPosition(true)}
                    >
                      <AddIcon />
                    </button>
                  )}

                  <div className="col-4">
                    <p>Employee</p>
                  </div>
                  <div className="col-7 ml-0">
                    <BorderlessSelect
                      classes="input-sm"
                      name="employee"
                      menuPosition="fixed"
                      options={emp}
                      value={values?.employee}
                      onChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                      }}
                      placeholder=" "
                      styles={borderlessSelectStyle}
                      errors={errors}
                      touched={touched}
                      isDisabled={false}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-3 mr-2">
                  <button
                    onClick={(e) => {
                      organogramSaveUpdate({
                        ...values,
                        autoId: 0,
                        parentId: autoId,
                        childList,
                        employeeId,
                        isActive: true,
                        buId,
                        setLoading,
                        cb: () => {
                          setAnchorEl(null);
                          setAnchorElForAction(null);
                          getData();
                        },
                      });
                    }}
                    type="button"
                    className="form-btn form-btn-save"
                  >
                    Save
                  </button>
                </div>
              </div>
              {isPosition && (
                <div>
                  <div className="row align-items-end">
                    <div className="col-4">
                      <p>Position </p>
                    </div>
                    <div className="col-7 ml-0">
                      <FormikInput
                        classes="input-borderless input-sm"
                        label=" "
                        value={values?.positionInput}
                        onChange={(e) => {
                          setFieldValue("positionInput", e.target.value);
                        }}
                        name="positionInput"
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-4">
                      <p>Code </p>
                    </div>
                    <div className="col-7 ml-0">
                      <FormikInput
                        classes="input-borderless input-sm"
                        label=" "
                        value={values?.code}
                        onChange={(e) => {
                          setFieldValue("code", e.target.value);
                        }}
                        name="code"
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {/* <div className="col-4">
                      <p>Position Group</p>
                    </div>
                    <div className="col-7 ml-0">
                      <BorderlessSelect
                        classes="input-sm"
                        name="positionGroup"
                        options={positionGrp}
                        value={values?.positionGroup}
                        onChange={(valueOption) => {
                          setFieldValue("positionGroup", valueOption);
                        }}
                        menuPosition="fixed"
                        placeholder=" "
                        styles={borderlessSelectStyle}
                        errors={errors}
                        touched={touched}
                        isDisabled={false}
                      />
                    </div> */}
                    {/* {!isPositionGroup && (
                      <div className="col-1 p-0">
                      <button
                        type="button"
                        className="add_field_btn"
                        onClick={() => setIsPositionGroup(true)}
                      >
                        <AddIcon />
                      </button>
                      </div>
                    )} */}
                  </div>
                  <div className=" d-flex justify-content-end align-items-center mt-3 mr-2">
                    <button
                      className="form-btn form-btn-cancel"
                      onClick={() => setIsPosition(false)}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => {
                        createPosition({
                          orgId,
                          employeeId,
                          buId,
                          intWorkplaceId: wId,
                          positionName: values?.positionInput,
                          positionCode: values?.code,
                          setLoading,
                          cb: () => {
                            setFieldValue("positionInput", "");
                            setFieldValue("positionGroup", "");
                            setIsPosition(false);
                            getPositionDDL();
                          },
                        });
                      }}
                      className="form-btn form-btn-save"
                      type="button"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
              {/* {isPositionGroup && (
                <div>
                  <div className="row align-items-end">
                    <div className="col-4">
                      <p>Position Group </p>
                    </div>
                    <div className="col-7 ml-0">
                      <FormikInput
                        classes="input-borderless input-sm"
                        label=" "
                        options={positionGrp}
                        value={values?.positionGroupInput}
                        name="positionGroupInput"
                        onChange={(e) => {
                          setFieldValue("positionGroupInput", e.target.value);
                        }}
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className=" d-flex justify-content-end align-items-center mt-3 mr-2">
                    <button
                      className="form-btn form-btn-cancel"
                      onClick={() => setIsPositionGroup(false)}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => {
                        createPositionGroup(
                          orgId,
                          employeeId,
                          values?.positionGroupInput,
                          setLoading,
                          () => {
                            setFieldValue("positionGroupInput", "")
                            // getPositionGroup();
                            setIsPositionGroup(false);
                          }
                        );
                      }}
                      type="button"
                      className="form-btn form-btn-save"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )} */}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddChild;
