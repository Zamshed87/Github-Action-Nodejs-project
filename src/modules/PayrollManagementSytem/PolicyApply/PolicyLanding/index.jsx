/* eslint-disable react-hooks/exhaustive-deps */
import {
  AddCircle,
  AddOutlined,
  Autorenew,
  PlaylistAddCircle
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AvatarComponent from "../../../../common/AvatarComponent";
import BtnActionMenu from "../../../../common/BtnActionMenu";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import SortingIcon from "../../../../common/SortingIcon";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../../utility/customColor";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import { AllEmployeeListWithFilterForPolicyReAssign } from "./helper";
const initData = {
  searchString: "",
};

const PolicyAppliedLanding = () => {
  const [loading, setLoading] = useState(false);
  const debounce = useDebounce();
  const history = useHistory();
  const [rowDto, setRowDto] = useState("");
  const [allData, setAllData] = useState("");
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const dispatch = useDispatch();

  // ascending and descending order states
  const [employeeOrder, setEmployeeOrder] = useState("desc");
  const [businessUnitOrder, setBusinessUnitOrder] = useState("desc");
  const [workplaceGroupOrder, setWorkplaceGroupOrder] = useState("desc");
  const [workplaceOrder, setWorkplaceOrder] = useState("desc");
  const [departmentOrder, setDepartmentOrder] = useState("desc");
  const [designationOrder, setDesignationOrder] = useState("desc");
  const [salaryPolicyOrder, setSalaryPolicyOrder] = useState("desc");
  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...rowDto];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a[property] > b[property]) return -1;
        return 1;
      });
    } else {
      // eslint-disable-next-line no-unused-vars
      modifyRowData = newRowData?.sort((a, b) => {
        if (b[property] > a[property]) return -1;
        return 1;
      });
    }
    setRowDto(modifyRowData);
  };
  //
  // search data
  const searchData = (keywords, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter(
        (item) =>
          regex.test(item?.EmployeeName?.toLowerCase()) ||
          regex.test(item?.EmploymentType?.toLowerCase()) ||
          regex.test(item?.Designation?.toLowerCase()) ||
          regex.test(item?.Department?.toLowerCase()) ||
          regex.test(item?.strWorkplace?.toLowerCase()) ||
          regex.test(item?.strWorkplaceGroup?.toLowerCase()) ||
          regex.test(item?.strBusinessUnit?.toLowerCase()) ||
          regex.test(item?.strPolicyName?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };
  //
  // getting employee for re-assign
  useEffect(() => {
    AllEmployeeListWithFilterForPolicyReAssign(
      orgId,
      buId,
      employeeId,
      setRowDto,
      setAllData,
      setLoading
    );
    dispatch(setFirstLevelNameAction("Administration"));
  }, [orgId, buId, employeeId]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values) => {}}
    >
      {({ setFieldValue, values, errors, touched, handleSubmit }) => (
        <>
          {loading && <Loading />}
          <Form onSubmit={handleSubmit}>
            <div className="table-card userInfo-wrapper">
              <div className="table-card-heading justify-content-end">
                <ul className="d-flex flex-wrap">
                  <li>
                    <MasterFilter
                      inputWidth="250px"
                      width="250px"
                      isHiddenFilter
                      value={values?.searchString}
                      setValue={(value) => {
                        setFieldValue("searchString", value);
                        debounce(() => {
                          // getEmployeeProfileLanding(
                          //   orgId,
                          //   buId,
                          //   pageNo,
                          //   pageSize,
                          //   setRowDto,
                          //   setLoading,
                          //   value
                          // );
                          searchData(value, setRowDto);
                        }, 500);
                      }}
                      cancelHandler={() => {
                        setFieldValue("searchString", "");
                        // getEmployeeProfileLanding(
                        //   orgId,
                        //   buId,
                        //   pageNo,
                        //   pageSize,
                        //   setRowDto,
                        //   setLoading
                        // );
                        AllEmployeeListWithFilterForPolicyReAssign(
                          orgId,
                          buId,
                          employeeId,
                          setRowDto,
                          setAllData,
                          setLoading
                        );
                      }}
                      handleClick={(e) => {}}
                    />
                  </li>
                  <li>
                    <BtnActionMenu
                      className="btn btn-default flex-center btn-deafult-create-job"
                      icon={
                        <AddOutlined
                          sx={{
                            marginRight: "0px",
                            fontSize: "15px",
                          }}
                        />
                      }
                      label="Assign"
                      options={[
                        {
                          value: 1,
                          label: "Single Assign",
                          icon: (
                            <AddCircle
                              sx={{
                                marginRight: "10px",
                                color: gray500,
                                fontSize: "16px",
                              }}
                            />
                          ),
                          onClick: () => {
                            history.push(
                              "/administration/payrollConfiguration/policyApply/single"
                            );
                          },
                        },
                        {
                          value: 2,
                          label: "Bulk Assign",
                          icon: (
                            <PlaylistAddCircle
                              sx={{
                                marginRight: "10px",
                                color: gray500,
                                fontSize: "16px",
                              }}
                            />
                          ),
                          onClick: () => {
                            history.push(
                              "/administration/payrollConfiguration/policyApply/bulk"
                            );
                          },
                        },
                        {
                          value: 2,
                          label: "Re-Assign",
                          icon: (
                            <Autorenew
                              sx={{
                                marginRight: "10px",
                                color: gray500,
                                fontSize: "16px",
                              }}
                            />
                          ),
                          onClick: () => {
                            history.push(
                              "/administration/payrollConfiguration/policyApply/reassign"
                            );
                          },
                        },
                      ]}
                    />
                  </li>
                </ul>
              </div>
              <div className="table-card-body ">
                {rowDto?.length < 1 ? (
                  <NoResult />
                ) : (
                  <div className="table-card-styled tableOne">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>
                            <div
                              onClick={(e) => {
                                setEmployeeOrder(
                                  employeeOrder === "desc" ? "asc" : "desc"
                                );
                                commonSortByFilter(
                                  employeeOrder,
                                  "EmployeeName"
                                );
                              }}
                              className="sortable"
                            >
                              <span>Employee</span>
                              <SortingIcon viewOrder={employeeOrder} />
                            </div>
                          </th>
                          <th>
                            <div
                              onClick={(e) => {
                                setDesignationOrder(
                                  designationOrder === "desc" ? "asc" : "desc"
                                );
                                commonSortByFilter(
                                  designationOrder,
                                  "Designation"
                                );
                              }}
                              className="sortable"
                            >
                              <span>Designation</span>
                              <SortingIcon viewOrder={designationOrder} />
                            </div>
                          </th>
                          <th>
                            <div
                              onClick={(e) => {
                                setDepartmentOrder(
                                  departmentOrder === "desc" ? "asc" : "desc"
                                );
                                commonSortByFilter(
                                  departmentOrder,
                                  "Department"
                                );
                              }}
                              className="sortable"
                            >
                              <span>Department</span>
                              <SortingIcon viewOrder={departmentOrder} />
                            </div>
                          </th>

                          <th>
                            <div
                              onClick={(e) => {
                                setWorkplaceOrder(
                                  workplaceOrder === "desc" ? "asc" : "desc"
                                );
                                commonSortByFilter(
                                  workplaceOrder,
                                  "strWorkplace"
                                );
                              }}
                              className="sortable"
                            >
                              <span>Workplace</span>
                              <SortingIcon viewOrder={workplaceOrder} />
                            </div>
                          </th>
                          <th>
                            <div
                              onClick={(e) => {
                                setWorkplaceGroupOrder(
                                  workplaceGroupOrder === "desc"
                                    ? "asc"
                                    : "desc"
                                );
                                commonSortByFilter(
                                  workplaceGroupOrder,
                                  "strWorkplaceGroup"
                                );
                              }}
                              className="sortable"
                            >
                              <span>Workplace Group</span>
                              <SortingIcon viewOrder={workplaceGroupOrder} />
                            </div>
                          </th>
                          <th>
                            <div
                              onClick={(e) => {
                                setBusinessUnitOrder(
                                  businessUnitOrder === "desc" ? "asc" : "desc"
                                );
                                commonSortByFilter(
                                  businessUnitOrder,
                                  "strBusinessUnit"
                                );
                              }}
                              className="sortable"
                            >
                              <span>Business Unit</span>
                              <SortingIcon viewOrder={businessUnitOrder} />
                            </div>
                          </th>
                          <th>
                            <div
                              onClick={(e) => {
                                setSalaryPolicyOrder(
                                  salaryPolicyOrder === "desc" ? "asc" : "desc"
                                );
                                commonSortByFilter(
                                  salaryPolicyOrder,
                                  "strPolicyName"
                                );
                              }}
                              className="sortable"
                            >
                              <span>Salary Policy</span>
                              <SortingIcon viewOrder={salaryPolicyOrder} />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.map((item, index) => (
                          <tr
                            key={index + 1}
                            className="hasEvent"
                            onClick={() =>
                              history.push(
                                `/administration/payrollConfiguration/policyApply/employeePolicyDetails/${item?.intEmployeeBasicInfoId}/${item?.intPolicyId}`
                              )
                            }
                          >
                            <td>
                              <p className="tableBody-title pl-1">
                                {index + 1}
                              </p>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="emp-avatar">
                                  <AvatarComponent
                                    classess=""
                                    letterCount={1}
                                    label={item?.EmployeeName}
                                  />
                                </div>
                                <div className="ml-2">
                                  <span className="tableBody-title">
                                    {item?.EmployeeName}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <p className="tableBody-title">
                                {item?.Designation}
                              </p>
                            </td>
                            <td>
                              <p className="tableBody-title">
                                {item?.Department}
                              </p>
                            </td>

                            <td>
                              <p className="tableBody-title">
                                {item?.strWorkplace}
                              </p>
                            </td>
                            <td>
                              <p className="tableBody-title">
                                {item?.strWorkplaceGroup}
                              </p>
                            </td>
                            <td>
                              <p className="tableBody-title">
                                {item?.strBusinessUnit}
                              </p>
                            </td>
                            <td>
                              <p className="tableBody-title">
                                {item?.strPolicyName}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default PolicyAppliedLanding;
