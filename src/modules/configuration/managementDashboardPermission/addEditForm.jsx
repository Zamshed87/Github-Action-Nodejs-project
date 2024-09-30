/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PeopleDeskSaasDDL } from "../../../common/api";
import BackButton from "../../../common/BackButton";
import FormikCheckBox from "../../../common/FormikCheckbox";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray600, greenColor } from "../../../utility/customColor";
import useDebounce from "../../../utility/customHooks/useDebounce";
import {
  createManagementDashPermission,
  getManagementDashPermissionById,
} from "./helper";

const initData = {
  searchString: "",
  account: "",
  allSelected: "",
  isChecked: "",
  notifyType: "",
};

export default function ManagementDashboardPermissionCreate() {
  const dispatch = useDispatch();
  const params = useParams();
  const { state } = useLocation();
  const debounce = useDebounce();

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [accountDDL, setAccountDDL] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [allData, setAllData] = useState();

  const { employeeId, buId, buName, orgId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLandingData = () => {
    getManagementDashPermissionById(
      orgId,
      params?.id ? params?.id : buId,
      setRowDto,
      setAllData,
      setLoading
    );
  };

  useEffect(() => {
    getLandingData();
  }, [buId, orgId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30278) {
      permission = item;
    }
  });

  const saveHandler = (values, cb) => {
    if (rowDto?.length <= 0) {
      return toast.warning("Notify category list empty!!!");
    }

    const callback = () => {
      cb();
      getLandingData();
    };

    const modifyArr = rowDto?.map((item) => {
      return {
        intEmployeeId: item?.intEmployeeId,
        employeeName: item?.employeeName,
        employeeType: item?.employeeType,
        department: item?.department,
        designation: item?.designation,
        isChecked: item?.isChecked,
      };
    });

    const payload = {
      intAccountId: orgId,
      accountName: state?.accountName,
      intBusinessUnitId: buId,
      businessUnitName: buName,
      intCreateBy: employeeId,
      employeeManagementPermissionList: modifyArr,
    };

    createManagementDashPermission(payload, setLoading, callback);
  };

  // useEffect(() => {
  //   PeopleDeskSaasDDL(
  //     "Account",
  //     wgId,
  //     buId,
  //     setAccountDDL,
  //     "intAccountId",
  //     "strAccountName"
  //   );
  // }, [buId, wgId]);

  const singleSelectHandler = (e, index) => {
    let data = [...rowDto];
    data[index].isChecked = e.target.checked;
    setRowDto([...data]);
    // setAllData([...data])
  };

  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter(
        (item) =>
          regex.test(item?.employeeName?.toLowerCase()) ||
          regex.test(item?.designation?.toLowerCase()) ||
          regex.test(item?.department?.toLowerCase()) ||
          regex.test(item?.employeeType?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          account: {
            value: state?.intAccountid,
            label: state?.accountName,
          },
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (params?.id) {
            } else {
              // resetForm(initData);
            }
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
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isCreate ? (
                <>
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div className="table-card-head-left d-flex align-items-center">
                        <BackButton />
                        <h2>
                          {params?.id
                            ? "Edit Management Dashboard Permission"
                            : "Create Management Dashboard Permission"}
                        </h2>
                      </div>
                      <div className="table-card-head-right">
                        <ul className="d-flex flex-wrap">
                          {/* {isFilter && (
                                  <li>
                                    <ResetButton
                                      title="reset"
                                      icon={
                                        <SettingsBackupRestoreOutlined
                                          sx={{ marginRight: "10px" }}
                                        />
                                      }
                                      onClick={() => {
                                        setIsFilter(false);
                                        setAppliedStatus({
                                          value: 1,
                                          label: "Pending",
                                        });
                                        setFieldValue("searchString", "");
                                        getLandingData();
                                      }}
                                    />
                                  </li>
                                )} */}
                          {permission?.isCreate && (
                            <li>
                              <MasterFilter
                                styles={{
                                  marginRight: "0px",
                                }}
                                width="250px"
                                inputWidth="250px"
                                value={values?.searchString}
                                setValue={(value) => {
                                  debounce(() => {
                                    searchData(value, allData, setRowDto);
                                  }, 500);
                                  setFieldValue("searchString", value);
                                }}
                                cancelHandler={() => {
                                  setFieldValue("searchString", "");
                                  getLandingData();
                                }}
                                isHiddenFilter
                              />
                            </li>
                          )}
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
                    {/* <div
                      className="card-style"
                      style={{ margin: "12px 0px", paddingBottom: "0px" }}
                    >
                      <div className="row align-items-center">
                        <div className="col-3">
                          <label>Account</label>
                          <FormikSelect
                            name="account"
                            options={accountDDL}
                            value={values?.account}
                            onChange={(valueOption) => {
                              // getManagementDashPermissionById(
                              //   valueOption?.value,
                              //   setRowDto,
                              //   setLoading
                              // );
                              setFieldValue("account", valueOption);
                            }}
                            isClearable={false}
                            placeholder=" "
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                            isDisabled={params?.id}
                          />
                        </div>
                      </div>
                    </div> */}
                    <div className="table-card-body pt-1">
                      <div className="tableOne table-card-styled noOverflowTable">
                        {rowDto?.length > 0 ? (
                          <table className="table">
                            <thead>
                              <tr>
                                <th
                                  style={{ width: "30px", textAlign: "center" }}
                                >
                                  SL
                                </th>
                                <th>Employee Name</th>
                                <th>Designation</th>
                                <th>Department</th>
                                <th>Employment Type</th>
                                <th style={{ width: "100px" }}>
                                  <div className="d-flex align-items-center">
                                    <FormikCheckBox
                                      label="Permission"
                                      styleobj={{
                                        margin: "0 0 0 0px",
                                        padding: "0",
                                        color: gray600,
                                        checkedColor: greenColor,
                                      }}
                                      name="allSelected"
                                      color={greenColor}
                                      checked={
                                        rowDto?.length > 0 &&
                                        rowDto?.every((item) => item?.isChecked)
                                      }
                                      onChange={(e) => {
                                        let newData = rowDto?.map((item) => ({
                                          ...item,
                                          isChecked: e.target.checked,
                                        }));
                                        setRowDto(newData);
                                        setFieldValue(
                                          "allSelected",
                                          e.target.checked
                                        );
                                      }}
                                    />
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((item, index) => (
                                <tr key={index}>
                                  <td className="text-center">{index + 1}</td>
                                  <td>{item?.employeeName}</td>
                                  <td>{item?.designation}</td>
                                  <td>{item?.department}</td>
                                  <td>{item?.employeeType}</td>
                                  <td
                                    className="m-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    <FormikCheckBox
                                      styleObj={{
                                        margin: "0 0 0 2px",
                                        padding: "0",
                                        color: gray600,
                                        checkedColor: greenColor,
                                      }}
                                      name="isChecked"
                                      color={greenColor}
                                      checked={rowDto[index]?.isChecked}
                                      onChange={(e) => {
                                        singleSelectHandler(e, index);
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <NoResult title="No Employee Found" />
                        )}
                      </div>
                    </div>
                  </div>
                </>
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
