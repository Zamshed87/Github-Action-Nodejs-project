/* eslint-disable no-unused-vars */
import { AddOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import AvatarComponent from "../../../common/AvatarComponent";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import PrimaryButton from "../../../common/PrimaryButton";
import SortingIcon from "../../../common/SortingIcon";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";

const initData = {
  searchString: "",
};

const IndividualKpi = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const tableData = [
    {
      title: "Md. Mahmud",
      designation: "Software Engineer",
      department: "Development",
      numberOfKPI: "5",
      year: "2022",
    },
    {
      title: "Md. Anik",
      designation: "Software Engineer",
      department: "Development",
      numberOfKPI: "10",
      year: "2021",
    },
    {
      title: "Md. Rayhan",
      designation: "Business Analyst",
      department: "Analysis",
      numberOfKPI: "8",
      year: "2022",
    },
    {
      title: "Md. Sajib",
      designation: "Software Engineer",
      department: "Development",
      numberOfKPI: "13",
      year: "2022",
    },
  ];
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        // saveHandler(values, () => {
        //   resetForm(initData);
        // });
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
            <div className="overtime-entry">
              <div className="col-md-12">
                <div className="table-card">
                  <div className="table-card-heading">
                    <div></div>
                    <div className="table-card-head-right">
                      <ul>
                        <li>
                          <MasterFilter
                            inputWidth="200px"
                            width="200px"
                            value={values?.searchString}
                            setValue={(value) => {
                              setFieldValue("searchString", value);
                              // debounce(() => {
                              //   searchData(value);
                              // }, 500);
                            }}
                            cancelHandler={() => {
                              setFieldValue("searchString", "");
                              // getData();
                            }}
                            handleClick={(e) =>
                              setfilterAnchorEl(e.currentTarget)
                            }
                          />
                        </li>
                        <li>
                          <PrimaryButton
                            type="button"
                            className="btn btn-default flex-center"
                            label="Create New"
                            onClick={() =>
                              history.push(
                                "/performancemanagementsystem/pms/individualkpi/create"
                              )
                            }
                            icon={
                              <AddOutlined
                                sx={{
                                  marginRight: "0px",
                                  fontSize: "15px",
                                }}
                              />
                            }
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      <>
                        <table className="table">
                          <thead>
                            <tr>
                              <th style={{ width: "65px" }}>
                                <div className="sortable pl-3">
                                  <span>SL</span>
                                  <div></div>
                                </div>
                              </th>
                              <th style={{ width: "230px" }}>
                                <div className="sortable">
                                  <span>Employee</span>
                                  <div>
                                    <SortingIcon
                                    // viewOrder={employeeOrder}
                                    ></SortingIcon>
                                  </div>
                                </div>
                              </th>
                              <th>
                                <div className="sortable">
                                  <span>Department</span>
                                </div>
                              </th>
                              <th>
                                <div className="sortable justify-content-center">
                                  <span>Number of KPI</span>
                                  <div>
                                    <SortingIcon
                                    // viewOrder={employeeOrder}
                                    ></SortingIcon>
                                  </div>
                                </div>
                              </th>
                              <th>
                                <div className="sortable justify-content-center">
                                  <span>Year</span>
                                  <div>
                                    <SortingIcon
                                    // viewOrder={employeeOrder}
                                    ></SortingIcon>
                                  </div>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableData?.map((item, index) => (
                              <tr
                                key={index}
                                className="hasEvent"
                                onClick={() => {}}
                              >
                                <>
                                  <td>
                                    <div className="pl-3">{index + 1}</div>
                                  </td>
                                  <td>
                                    <div className="employeeInfo d-flex align-items-center justify-content-start">
                                      <AvatarComponent
                                        letterCount={1}
                                        label={item?.title}
                                      />
                                      <div className="ml-3">
                                        <b
                                          style={{
                                            color: "rgba(0, 0, 0, 0.6)",
                                          }}
                                        >
                                          {item?.title}
                                        </b>
                                        <p className="content tableBody-title">
                                          {item?.designation}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td width={"200px"}>
                                    <span className="tableBody-title">
                                      {item?.department}
                                    </span>
                                  </td>
                                  <td
                                    style={{ width: "200px" }}
                                    className="text-center"
                                  >
                                    <span className="tableBody-title ">
                                      {item?.numberOfKPI}
                                    </span>
                                  </td>
                                  <td style={{ width: "200px" }}>
                                    <div className="d-flex align-items-center justify-content-center">
                                      <span className="tableBody-title">
                                        {item?.year}
                                      </span>
                                    </div>
                                  </td>
                                </>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default IndividualKpi;
