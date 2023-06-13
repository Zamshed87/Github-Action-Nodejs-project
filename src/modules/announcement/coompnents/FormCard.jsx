import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { shallowEqual, useSelector } from "react-redux";
import FormikInput from "../../../common/FormikInput";
import FormikSelect from "../../../common/FormikSelect";
import FormikError from "../../../common/login/FormikError";
import { gray600, success500 } from "../../../utility/customColor";
import { customStyles } from "../../../utility/selectCustomStyle";
import { todayDate } from "../../../utility/todayDate";
import {
  getAllWorkPlace,
  getDDLForAnnouncement,
  getPeopleDeskAllDDL,
} from "../helper";

const FormCard = ({ propsObj }) => {
  const {
    values,
    setFieldValue,
    errors,
    touched,
    isEdit,
    resetForm,
    initData,
    params,
  } = propsObj;
  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [designationDDL, setDesignationDDL] = useState([]);
  const [userGroupDDL, setUserGroupDDL] = useState([]);

  // const modules = {
  //   toolbar: [
  //     [{ header: [1, 2, 3, 4, 5, 6, false] }],
  //     ["bold", "italic", "underline", "strike"],

  //     [{ script: "sub" }, { script: "super" }],
  //     [{ list: "ordered" }, { list: "bullet" }],
  //     [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
  //     ["link", "image", "video"],
  //     ["code-block"],
  //   ],
  // };

  useEffect(() => {
    if (!params?.id) {
      setWorkplaceDDL([]);
      setFieldValue("workPlace", "");
      values?.workGroup.length > 0 &&
        values?.workGroup?.forEach((options) => {
          getAllWorkPlace(
            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${options?.value}&intId=${employeeId}`,
            "intWorkplaceId",
            "strWorkplace",
            setWorkplaceDDL
          );
        });
    } else {
      setWorkplaceDDL([]);
      // setFieldValue("workPlace", "");
      values?.workGroup?.forEach((options) => {
        getAllWorkPlace(
          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${options?.value}&intId=${employeeId}`,
          "intWorkplaceId",
          "strWorkplace",
          setWorkplaceDDL
        );
      });
    }

    // eslint-disable-next-line
  }, [values?.workGroup, orgId, buId, employeeId]);

  // all ddl load
  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=${employeeId}`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setWorkplaceGroupDDL
    );
    getDDLForAnnouncement(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
      "DepartmentId",
      "DepartmentName",
      setDepartmentDDL
    );
    getDDLForAnnouncement(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDesignation&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
      "DesignationId",
      "DesignationName",
      setDesignationDDL
    );
    getDDLForAnnouncement(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=UserGroup&WorkplaceGroupId=${wgId}`,
      "UserGroupId",
      "UserGroupName",
      setUserGroupDDL
    );
  }, [wgId, buId, employeeId]);

  return (
    <div className="card-style">
      <div className="row">
        <div className="col-lg-8">
          <div>
            <label>Announcement Title</label>
            <FormikInput
              classes="input-sm"
              value={values?.title}
              placeholder=""
              name="title"
              type="text"
              className="form-control"
              onChange={(e) => {
                setFieldValue("title", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div>
            <label>Expired Date</label>
            <FormikInput
              classes="input-sm"
              value={values?.date}
              name="date"
              min={todayDate()}
              type="date"
              className="form-control"
              onChange={(e) => {
                setFieldValue("date", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div>
            <label>Work Place Group</label>
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
              options={workplaceGroupDDL || []}
              value={values?.workGroup}
              onChange={(valueOption) => {
                setFieldValue("workGroup", valueOption);
                // valueOption?.forEach(options=>{
                //   getAllWorkPlace(
                //     `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=${options?.value}&intId=${employeeId}`,
                //     "intWorkplaceId",
                //     "strWorkplace",
                //     setWorkplaceDDL
                //   );
                // })
              }}
              isMulti
              errors={errors}
              touched={touched}
              isClearable={false}
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div>
            <label>Work Place</label>
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
              options={workplaceDDL || []}
              value={values?.workPlace}
              onChange={(valueOption) => {
                setFieldValue("workPlace", valueOption);
              }}
              isMulti
              errors={errors}
              touched={touched}
              isClearable={false}
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div>
            <label>Department</label>
            <FormikSelect
              placeholder=" "
              classes="input-sm"
              styles={{
                ...customStyles,
                control: (provided, state) => ({
                  ...provided,
                  minHeight: "auto",
                  height: values?.department?.length > 1 ? "auto" : "30px",
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
                  height: values?.department?.length > 1 ? "auto" : "30px",
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
              name="designation"
              options={departmentDDL || []}
              value={values?.department || { label: "All", value: 0 }}
              onChange={(valueOption) => {
                setFieldValue("department", valueOption);
              }}
              isMulti
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div>
            <label>Designation</label>
            <FormikSelect
              placeholder=" "
              classes="input-sm"
              styles={{
                ...customStyles,
                control: (provided, state) => ({
                  ...provided,
                  minHeight: "auto",
                  height: values?.designation?.length > 1 ? "auto" : "30px",
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
                  height: values?.designation?.length > 1 ? "auto" : "30px",
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
              name="designation"
              options={designationDDL || []}
              value={values?.designation || { label: "All", value: 0 }}
              onChange={(valueOption) => {
                setFieldValue("designation", valueOption);
              }}
              isMulti
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div>
            <label>User Group</label>
            <FormikSelect
              placeholder=" "
              classes="input-sm"
              styles={{
                ...customStyles,
                control: (provided, state) => ({
                  ...provided,
                  minHeight: "auto",
                  height: values?.userGroup?.length > 1 ? "auto" : "30px",
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
                  height: values?.userGroup?.length > 1 ? "auto" : "30px",
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
              name="userGroup"
              options={userGroupDDL || []}
              value={values?.userGroup || { label: "All", value: 0 }}
              onChange={(valueOption) => {
                setFieldValue("userGroup", valueOption);
              }}
              isMulti
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-lg-12">
          <div>
            <label>Announcement Body</label>
            <ReactQuill
              value={values?.body || " "}
              // modules={modules}
              onChange={(value) => setFieldValue("body", value)}
            />
          </div>
          <div style={{ marginTop: "-2px" }}>
            <FormikError errors={errors} name="body" touched={touched} />
          </div>
        </div>
        <div className="col-lg-12">
          <div className="d-flex">
            <button
              className="btn btn-green btn-green-disable mt-3"
              type="submit"
            >
              {params?.id ? "Update" : "Apply"}
            </button>
            {isEdit && (
              <button
                onClick={(e) => {
                  resetForm(initData);
                }}
                className="btn btn-green mt-3 ml-2"
                type="button"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCard;
