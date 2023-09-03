/* eslint-disable react-hooks/exhaustive-deps */
import { Clear } from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getPeopleDeskAllDDL } from "../../../common/api";
import BorderlessSelect from "../../../common/BorderlessSelect";
import Loading from "../../../common/loading/Loading";
import { borderlessSelectStyle } from "../../../utility/BorderlessStyle";
import { organogramSaveUpdate } from "../helper";
const initData = {
  position: "",
  employee: "",
};
const EditCom = ({
  setAnchorEl,
  setAnchorElForAction,
  editData,
  parentId,
  childList,
  getData,
  autoId,
  sequence,
}) => {
  const { buId, orgId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [position, setPosition] = useState([]);
  const [emp, setEmp] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPositionDDL = () => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Position&BusinessUnitId=${buId}&intId=0&WorkplaceGroupId=${wgId}`,
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
  }, [buId, orgId]);

  const saveHandler = (values) => { };
  return (
    <div className="organugram_form_main">
      {loading && <Loading />}
      <div className="organugram_form_header pt-2">
        <h3>Edit Info</h3>
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
        initialValues={editData?.position?.value ? editData : initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
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
          <Form className="addChild_form_container p-3">
            <div className="container-addChild">
              <div>
                <div className="row align-items-end">
                  <div className="col-4">
                    <p>Position</p>
                  </div>
                  <div className="col-8 ml-0">
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
                    />
                  </div>

                  <div className="col-4">
                    <p>Employee</p>
                  </div>
                  <div className="col-8 ml-0">
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
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-3 mr-2">
                  <button
                    onClick={(e) => {
                      organogramSaveUpdate({
                        ...values,
                        autoId: autoId,
                        parentId: parentId,
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
                        sequence,
                      });
                    }}
                    type="button"
                    className="form-btn form-btn-save"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditCom;
