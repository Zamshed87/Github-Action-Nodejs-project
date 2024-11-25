/* eslint-disable no-unused-vars */
import { AddOutlined } from "@mui/icons-material";
import { Box, Tab, Tabs } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import BtnActionMenu from "../../../../common/BtnActionMenu";
// import MasterFilter from "../../../../common/MasterFilter";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
// import useDebounce from "../../../../utility/customHooks/useDebounce";
import LandingTable from "./LandingTable";
import TabPanel, { a11yProps } from "./tabpanel";

const KpiMapping = () => {
  // const debounce = useDebounce();
  const history = useHistory();

  const [rowDto, setRowDto] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [allData, setAllData] = useState([]);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // permission

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const permission = useMemo(
    () => permissionList?.find((item) => item?.menuReferenceId === 30357),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { values, setFieldValue } = useFormik({
    initialValues: {},
    onSubmit: () => {},
  });

  return (
    <>
      <form>
        {permission?.isView ? (
          <div className="table-card">
            <div className="table-card-heading heading pt-0">
              <div className="d-flex justify-content-between align-items-center"></div>
              <div className="table-card-head-right">
                <ul>
                  {/* <li>
                    <MasterFilter
                      isHiddenFilter
                      styles={{
                        marginRight: "0px",
                      }}
                      width="200px"
                      inputWidth="200px"
                      value={values?.search}
                      setValue={(value) => {
                        debounce(() => {
                          searchData(value, allData, setRowDto);
                        }, 500);
                        setFieldValue("search", value);
                      }}
                      cancelHandler={() => {
                        setFieldValue("search", "");
                        setRowDto(allData);
                      }}
                    />
                  </li> */}
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
                      label="New KPI Mapping"
                      options={[
                        {
                          value: 1,
                          label: "Employee Wise",
                          onClick: () => {
                            if (!permission?.isCreate)
                              return toast.warn("You don't have permission");
                            history.push(
                              `/pms/configuration/kpimapping/employeeWise/create`
                            );
                          },
                        },
                        {
                          value: 2,
                          label: "Department Wise",
                          onClick: () => {
                            if (permission?.isCreate) {
                              history.push(
                                "/pms/configuration/kpimapping/departmentWise/create"
                              );
                            } else {
                              toast.warn("You don't have permission");
                            }
                          },
                        },
                        {
                          value: 3,
                          label: "Designation Wise",
                          onClick: () => {
                            if (permission?.isCreate) {
                              history.push(
                                "/pms/configuration/kpimapping/designationWise/create"
                              );
                            } else {
                              toast.warn("You don't have permission");
                            }
                          },
                        },
                      ]}
                    />
                  </li>
                </ul>
              </div>
            </div>
            <div className="tab-panel">
              <Box sx={{ width: "100%" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  TabIndicatorProps={{
                    style: { background: "#299647", height: 3 },
                  }}
                  sx={{
                    "& .MuiTabs-indicator": { backgroundColor: "#299647" },
                    "& .MuiTab-root": { color: "#667085" },
                    "& .Mui-selected": { color: "#299647" },
                  }}
                >
                  <Tab label="Employees Wise" {...a11yProps(0)} />
                  <Tab label="Department Wise" {...a11yProps(1)} />
                  <Tab label="Designation Wise" {...a11yProps(2)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                  {/* table for employee wise mapping */}
                  <LandingTable
                    component="employee"
                    rowDto={rowDto}
                    setRowDto={setRowDto}
                    setAllData={setAllData}
                  />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  {/* table for department wise mapping */}
                  <LandingTable
                    component="dept"
                    rowDto={rowDto}
                    setRowDto={setRowDto}
                    setAllData={setAllData}
                  />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  {/* table for designation wise mapping */}
                  <LandingTable
                    component="designation"
                    rowDto={rowDto}
                    setRowDto={setRowDto}
                    setAllData={setAllData}
                  />
                </TabPanel>
              </Box>
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
};

export default KpiMapping;
