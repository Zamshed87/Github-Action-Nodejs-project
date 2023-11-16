/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import "../style.css";
import { TablePagination } from "@mui/material";
import { AddOutlined, ModeEditOutlineOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { yearDDLAction } from "../../../../utility/yearDDL";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { getYearlyPolicyLanding } from "./helper";
import ScrollableTable from "../../../../common/ScrollableTable";
import NoResult from "common/NoResult";

let date = new Date();
let currentYear = date.getFullYear();

const initData = {
  year: { value: currentYear, label: currentYear },
};

const YearlyLeavePolicy = () => {
  const [allPolicy, setAllPolicy] = useState([]);
  const [landingData, setLandingData] = useState([]);
  const [sortType, setSortType] = useState("desc");
  const history = useHistory();
  const [pages, setPages] = useState({
    currentPage: 1,
    pageSize: 25,
    totalCount: 0,
  });
  const [, setYear] = useState(null);

  const saveHandler = (values, cb) => {};
  const [loading, setLoading] = useState(false);

  const { orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const filterData = (year) => {
  //   let data = [];
  //   data = allData.filter((item) => item?.YearId == year);
  //   setLandingData(data);
  // };

  // eslint-disable-next-line no-unused-vars
  const sortData = (sortBy, isNumber) => {
    setSortType(sortType === "desc" ? "asc" : "desc");
    let newData = [...landingData];
    newData.sort((a, b) => {
      if (sortType === "desc") {
        return isNumber
          ? b?.[sortBy] - a?.[sortBy]
          : b?.[sortBy]?.localeCompare(a?.[sortBy]);
      } else {
        return isNumber
          ? a?.[sortBy] - b?.[sortBy]
          : a?.[sortBy]?.localeCompare(b?.[sortBy]);
      }
    });
    setLandingData(newData);
  };
  const getLanding = (page = pages, year = currentYear) => {
    getYearlyPolicyLanding(
      `/SaasMasterData/AllLeavePolicyLanding?businessUnitId=${buId}&PageNo=${page?.currentPage}&PageSize=${page?.pageSize}&IsForXl=false&intYear=${year}`,
      setAllPolicy,
      setPages,
      setLoading
    );
  };
  useEffect(() => {
    getLanding(pages, currentYear);
  }, [orgId, buId, wgId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 38) {
      permission = item;
    }
  });
  // handleChangePage
  const handleChangePage = (event, newPage) => {
    setPages((prev) => {
      return { ...prev, currentPage: newPage + 1 };
    });

    getLanding(
      {
        currentPage: newPage + 1,
        pageSize: pages?.pageSize,
        totalCount: pages?.totalCount,
      },
      currentYear
    );
  };

  const handleChangeRowsPerPage = (event) => {
    setPages((prev) => {
      return { ...prev, pageSize: +event.target.value };
    });
    getLanding(
      {
        currentPage: pages?.currentPage,
        pageSize: +event.target.value,
        totalCount: pages?.totalCount,
      },
      currentYear
    );
  };
  const formikRef = useRef();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
        innerRef={formikRef}
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
              {permission?.isView ? (
                <div className="table-card approval-pipeline">
                  <div className="table-card-heading">
                    <div></div>
                    <ul className="d-flex flex-wrap">
                      <li>
                        <FormikSelect
                          name="year"
                          options={yearDDLAction(5, 10)}
                          value={values?.year}
                          label=""
                          isClearable={false}
                          onChange={(valueOption) => {
                            if (valueOption?.value) {
                              getLanding(pages, valueOption?.value);
                              // filterData(valueOption?.value);
                            } else {
                              getLanding(pages);
                            }
                            setFieldValue("year", valueOption);
                            setYear(valueOption?.value);
                          }}
                          placeholder="Year"
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isDisabled={false}
                        />
                      </li>
                      <li>
                        <PrimaryButton
                          type="button"
                          className="btn btn-default flex-center"
                          label={"Leave policy"}
                          icon={
                            <AddOutlined
                              sx={{
                                marginRight: "0px",
                                fontSize: "15px",
                              }}
                            />
                          }
                          onClick={(e) => {
                            if (!permission?.isCreate)
                              return toast.warn("You don't have permission");
                            // setShow(true);
                            history.push(
                              "/administration/leaveandmovement/yearlyLeavePolicy/create"
                            );
                          }}
                          style={{ marginLeft: "16px" }}
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="table-card-body">
                    <div className="approval-table">
                      <h5
                        style={{
                          fontSize: "15px",
                          color: "rgba(0, 0, 0, 0.6)",
                          fontWeight: "600",
                        }}
                      >
                        Year {values?.year ? values?.year.label : currentYear}
                      </h5>
                      {Object.entries(allPolicy).length > 0 ? (
                        <div className="table-card-styled tableOne">
                          <ScrollableTable
                            classes="salary-process-table"
                            secondClasses="table-card-styled tableOne scroll-table-height"
                            customClass="salary-details-custom"
                          >
                            <thead>
                              <tr>
                                {/* <th rowSpan="2" className="text-center">
                                SL
                              </th> */}
                                <th
                                  rowSpan="2"
                                  style={{ minWidth: "100px" }}
                                  className="text-center"
                                >
                                  Policy Name
                                </th>
                                <th rowSpan="2" className="text-center">
                                  Leave Type
                                </th>
                                <th rowSpan="2" className="text-center">
                                  Employee Type
                                </th>
                                <th rowSpan="2" className="text-center">
                                  Gender{" "}
                                </th>
                                <th rowSpan="2" className="text-center">
                                  Hr Position
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(allPolicy).map(
                                ([workplaceName, policies]) => (
                                  <React.Fragment key={workplaceName}>
                                    {/* Row with workplace name */}
                                    <tr>
                                      <td colSpan="6">
                                        {" "}
                                        <span
                                          style={{
                                            fontWeight: "700",
                                            color: "black",
                                          }}
                                        >
                                          {workplaceName}
                                        </span>
                                      </td>
                                    </tr>
                                    {/* Rows with policy details */}
                                    {policies.map((policy, index) => (
                                      <tr key={index}>
                                        <td>{policy?.strPolicyName}</td>
                                        <td>{policy?.strLeaveTypeName}</td>
                                        <td>
                                          {policy?.employmentTypeList
                                            ?.map(
                                              (employmentType) =>
                                                employmentType?.strEmploymentTypeName
                                            )
                                            ?.join(", ")}
                                        </td>
                                        <td>
                                          {" "}
                                          {policy?.genderListDTO
                                            ?.map(
                                              (gender) =>
                                                gender?.strGenderName + " "
                                            )
                                            ?.join(", ")}
                                        </td>
                                        <td>
                                          {" "}
                                          {policy?.hrPositionListDTO
                                            ?.map(
                                              (pos) =>
                                                pos?.strHrPositionName + " "
                                            )
                                            ?.join(", ")}
                                        </td>
                                        {orgId !== 0 && (
                                          <td>
                                            <Tooltip title="Edit" arrow>
                                              <button
                                                className="iconButton"
                                                type="button"
                                              >
                                                <ModeEditOutlineOutlined
                                                  onClick={() =>
                                                    history.push(
                                                      `/administration/leaveandmovement/yearlyLeavePolicy/edit/${policy?.policyId}`
                                                    )
                                                  }
                                                  style={{ fontSize: "15px" }}
                                                />
                                              </button>
                                            </Tooltip>
                                          </td>
                                        )}
                                      </tr>
                                    ))}
                                  </React.Fragment>
                                )
                              )}
                            </tbody>
                          </ScrollableTable>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 15, 25, 100]}
                            component="div"
                            count={pages?.totalCount}
                            rowsPerPage={pages?.pageSize}
                            page={pages?.currentPage - 1}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </div>
                      ) : (
                        <NoResult />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}

              {/* Create Yearly Leave Policy Modal */}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default YearlyLeavePolicy;
