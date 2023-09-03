import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PeopleDeskSaasDDL } from "../../../../common/api";
import BackButton from "../../../../common/BackButton";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import FormikSelect from "../../../../common/FormikSelect";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray900, greenColor } from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/selectCustomStyle";
import {
  getAlreadyAddedFeature,
  getFeatureListAction,
  getFirstLabelMenuListAction,
  saveFeatureAssignToRole,
} from "../helper";
import Loading from "./../../../../common/loading/Loading";
import StyledTable from "./components/StyledTable";
import "./styles.css";

const initData = {
  userRoleName: "",
  moduleName: "",
  featureName: "",
  allFeature: false,
};

export default function FeatureAssignToRole() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [moduleNameDDL, setModuleNameDDL] = useState([]);
  const [featureDDL, setFeatureDDL] = useState([]);
  const [userRoleDDL, setUserRoleDDL] = useState([]);

  const { employeeId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getFirstLabelMenuListAction(employeeId, setModuleNameDDL);
    PeopleDeskSaasDDL(
      "UserRoleDDL",
      wgId,
      buId,
      setUserRoleDDL,
      "value",
      "label",
      0
    );
  }, [employeeId, buId, wgId]);

  const saveHandler = (values, cb) => {
    saveFeatureAssignToRole(
      buId,
      wgId,
      employeeId,
      values?.userRoleName?.value,
      values?.userRoleName?.label,
      rowDto,
      setLoading,
      cb
    );
  };

  const setter = (values) => {
    if (
      (!values?.userRoleName || !values?.moduleName || !values?.featureName) &&
      !values?.allFeature
    )
      return toast.warn("All fields are required");

    if ((!values?.userRoleName || !values?.moduleName) && values?.allFeature)
      return toast.warn("User Role Name and module are required");

    if (values?.allFeature) {
      const payload = (item) => {
        return {
          intMenuId: item?.value,
          strMenuName: item?.label,
          moduleId: values?.moduleName?.value,
          moduleName: values?.moduleName?.label,
          isCreate: false,
          isEdit: false,
          isView: false,
          isDelete: false,
          isForWeb: item?.isForWeb,
          isForApps: item?.isForApps,
        };
      };

      const checkFound = (id) => {
        let found = rowDto.find((item) => item?.intMenuId === id);
        if (found) {
          return true;
        } else {
          return false;
        }
      };

      let data = [];

      featureDDL.forEach((item) => {
        if (!checkFound(item.value)) {
          data.push(payload(item));
        }
      });

      setRowDto([...data, ...rowDto]);
    } else {
      // check if exits
      const exitsData = rowDto?.filter(
        (item) => values?.featureName?.value === item?.intMenuId
      );

      if (exitsData?.length > 0) return toast.warn("Already exits");

      const data = [...rowDto];
      data.unshift({
        intMenuId: values?.featureName?.value,
        strMenuName: values?.featureName?.label,
        moduleId: values?.moduleName?.value,
        moduleName: values?.moduleName?.label,
        isCreate: false,
        isEdit: false,
        isView: false,
        isDelete: false,
        isForWeb: values?.featureName?.isForWeb,
        isForApps: values?.featureName?.isForApps,
      });
      setRowDto(data);
    }
  };

  const headerCheckBoxHandler = (name, value) => {
    const newData = rowDto?.map((item) => ({
      ...item,
      [name]: value,
    }));
    setRowDto(newData);
  };

  const singleCheckBoxHandler = (name, value, index) => {
    let data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
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
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => { });
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
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isCreate ? (
                <div className="uNameFName-wrapper">
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div className="table-card-head-left d-flex align-items-center">
                        <BackButton />
                        <h6>Feature Assign To Role</h6>
                      </div>
                      <div className="table-card-head-right">
                        <ul className="d-flex flex-wrap">
                          <li style={{ marginRight: "10px" }}>
                            <button
                              onClick={(e) => {
                                resetForm(initData);
                                setRowDto([]);
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
                      <div className="row  align-items-center">
                        <div className="col-3">
                          <label>Module Name</label>
                          <FormikSelect
                            name="moduleName"
                            options={moduleNameDDL}
                            value={values?.moduleName}
                            onChange={(valueOption) => {
                              getFeatureListAction(
                                valueOption?.value,
                                employeeId,
                                setFeatureDDL
                              );
                              setFieldValue("featureName", "");
                              setFieldValue("moduleName", valueOption);
                            }}
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-3">
                          <label>Feature</label>
                          <FormikSelect
                            name="featureName"
                            options={featureDDL}
                            value={values?.featureName}
                            onChange={(valueOption) => {
                              setFieldValue("featureName", valueOption);
                            }}
                            isDisabled={values?.allFeature}
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-3">
                          <label>User Role Name</label>
                          <FormikSelect
                            name="userRoleName"
                            options={userRoleDDL}
                            value={values?.userRoleName}
                            onChange={(valueOption) => {
                              getAlreadyAddedFeature(
                                buId,
                                wgId,
                                valueOption?.value,
                                "Role",
                                setRowDto
                              );
                              setFieldValue("userRoleName", valueOption);
                            }}
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="d-flex align-items-center pt-2 justify-content-around col-3">
                          <FormikCheckBox
                            styleObj={{
                              color: gray900,
                              checkedColor: greenColor,
                            }}
                            label="All Feature"
                            checked={values?.allFeature}
                            onChange={(e) => {
                              setFieldValue("featureName", "");
                              setFieldValue("allFeature", e.target.checked);
                            }}
                          />
                          <PrimaryButton
                            type="button"
                            className="btn btn-green flex-center px-3"
                            label="Add"
                            onClick={(e) => setter(values)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="table-user-feature-group">
                      <StyledTable
                        tableData={rowDto}
                        values={values}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                        rowDto={rowDto}
                        setRowDto={setRowDto}
                        headerCheckBoxHandler={headerCheckBoxHandler}
                        singleCheckBoxHandler={singleCheckBoxHandler}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
