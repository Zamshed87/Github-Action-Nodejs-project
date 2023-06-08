import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { PeopleDeskSaasDDL } from "../../../../common/api";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
import BackButton from "../../../../common/BackButton";
import FormikSelect from "../../../../common/FormikSelect";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import { gray600, success500 } from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/selectCustomStyle";
import Loading from "./../../../../common/loading/Loading";
import { createRoleAssignToUser, getAssignedDataById } from "./helper";

const initData = {
  userName: "",
  userRole: "",
};

const validationSchema = Yup.object().shape({});

export default function RoleAssignToUser() {
  const [loading, setLoading] = useState(false);
  const [userRoleDDL, setUserRoleDDL] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [userNameForEdit, setUserNameForEdit] = useState([]);

  const { employeeId, orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { setFieldValue, values, errors, touched, handleSubmit, resetForm } =
    useFormik({
      enableReinitialize: true,
      validationSchema: validationSchema,
      initialValues: singleData
        ? { userName: userNameForEdit, userRole: singleData }
        : initData,
      onSubmit: (values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      },
    });

  useEffect(() => {
    PeopleDeskSaasDDL(
      "UserRoleDDLWithoutDefault",
      wgId,
      buId,
      setUserRoleDDL,
      "value",
      "label",
      0
    );
  }, [wgId, buId]);

  const saveHandler = (values, cb) => {
    // if (!values?.userName) {
    //   return toast.warn("User name is required!!!");
    // }
    // if (values?.userRole?.length <= 0) {
    //   return toast.warn("User role is required!!!");
    // }

    let userRoleListId = values?.userRole?.map((itm) => itm?.value);
    let payload = {
      accountId: orgId,
      employeeId: values?.userName?.value,
      roleIdList: userRoleListId,
      UpdatedBy: employeeId,
      BusinessUnitId: buId,
      WorkplaceGroupId: wgId,
    };

    const callback = () => {
      cb();
      // For landing page data
      getAssignedDataById(
        buId,
        wgId,
        values?.userName?.value,
        setSingleData,
        setLoading
      );
    };

    createRoleAssignToUser(payload, setLoading, callback);
  };

  const loadUserList = async (v) => {
    if (v?.length < 3) return [];
    return await axios
      .get(
        `/Auth/GetUserList?businessUnitId=${buId}&workplaceGroupId=${wgId}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 34) {
      permission = item;
    }
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        {loading && <Loading />}
        {permission?.isCreate ? (
          <div className="uNameFName-wrapper">
            <div className="table-card">
              <div className="table-card-heading">
                <div className="table-card-head-left d-flex align-items-center">
                  <BackButton />
                  <h6>Role Assign To User</h6>
                </div>
                <div className="table-card-head-right">
                  <ul className="d-flex flex-wrap">
                    <li style={{ marginRight: "10px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUserNameForEdit("");
                          setSingleData("");
                          resetForm(initData);
                        }}
                        type="button"
                        className="btn btn-cancel"
                      >
                        RESET
                      </button>
                    </li>
                    <li>
                      <PrimaryButton
                        type="submit"
                        className="btn btn-green btn-green-disable"
                        label="Save"
                      />
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="card-style col-12"
                style={{ margin: "12px 0px", paddingBottom: "0px" }}
              >
                <div className="row mx-0">
                  <div className="col-6">
                    <label>User Name</label>
                    <AsyncFormikSelect
                      selectedValue={values?.userName}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("userRole", "");
                        setSingleData([]);
                        setFieldValue("userName", valueOption);
                        setUserNameForEdit(valueOption);
                        if (valueOption) {
                          getAssignedDataById(
                            buId,
                            wgId,
                            valueOption?.value,
                            setSingleData,
                            setLoading
                          );
                        }
                      }}
                      loadOptions={loadUserList}
                    />
                  </div>
                  <div className="col-6">
                    <label>User Role</label>
                    <FormikSelect
                      placeholder=" "
                      classes="input-sm"
                      styles={{
                        ...customStyles,
                        control: (provided, state) => ({
                          ...provided,
                          minHeight: "auto",
                          height:
                            values?.userRole?.length > 2 ? "auto" : "30px",
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
                          height:
                            values?.userRole?.length > 2 ? "auto" : "30px",
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
                      options={userRoleDDL || []}
                      value={values?.userRole}
                      name="userRole"
                      onChange={(valueOption) => {
                        setFieldValue("userRole", valueOption);
                      }}
                      menuPosition="fixed"
                      errors={errors}
                      isDisabled={!values?.userName?.value}
                      touched={touched}
                      isMulti
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
}
