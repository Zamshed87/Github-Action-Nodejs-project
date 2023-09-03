import { useDispatch } from "react-redux";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import SortingIcon from "../../../common/SortingIcon";
import PrimaryButton from "../../../common/PrimaryButton";
import { useHistory } from "react-router-dom";
import { AddOutlined, SearchOutlined } from "@mui/icons-material";
import GrievanceTableBodySelf from "./component/GrievanceTableBody";
import FormikInput from "../../../common/FormikInput";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";

const GrievanceManagementSelf = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // eslint-disable-next-line no-unused-vars
  const [employeeOrder, setEmployeeOrder] = useState("desc");
  // eslint-disable-next-line no-unused-vars
  const [category, setCategory] = useState("desc");
  const [rowData, setRowData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [view, setView] = useState(false);

  let history = useHistory();

  const tableData = [
    {
      subject: "Misbehave",
      title: "Anonymous",
      des: "Misbehave",
      document: "complaints.pdf",
      date: "05 May 2022",
      status: "In Review",
    },
    {
      subject: "Complaints Againts Stuffs",
      title: "Self",
      des: "Complaints Againts Stuffs",
      document: "screenshot.jpg",
      date: "18 April 2022",
      status: "Closed",
      position: "Business Analyst",
      section: "Engineering",
    },
    {
      subject: "Dirty Washroom",
      title: "Self",
      des: "Dirty Washroom",
      document: "photo.png",
      date: "21 August 2022",
      status: "Pending",
      position: "Backend Developer",
      section: "Engineering",
    },
  ];

  const setSingleDataAction = (item) => {
    setRowData({
      name: item?.name,
      trainingType: {
        label: item?.name,
        value: item?.trainer,
      },
    });
  };

  return (
    <>
      <Formik>
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
              {/* {loading && <Loading />} */}
              <div className="all-candidate">
                <div className="table-card">
                  <div className="table-card-heading">
                    <div></div>
                    <div className="table-card-head-right">
                      <ul>
                        <li style={{ marginRight: "24px" }}>
                          <FormikInput
                            classes="search-input fixed-width mt-2 mt-md-0 mb-2 mb-md-0 tableCardHeaderSeach"
                            inputClasses="search-inner-input"
                            placeholder="Search"
                            value={values?.search}
                            name="search"
                            type="text"
                            trailicon={
                              <SearchOutlined
                                sx={{
                                  color: "#323232",
                                  fontSize: "18px",
                                }}
                              />
                            }
                            onChange={(e) => {
                              setFieldValue("search", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </li>
                        <li>
                          <PrimaryButton
                            type="button"
                            className="btn btn-default flex-center"
                            label={"Add grievance"}
                            onClick={() =>
                              history.push(
                                "/SelfService/rewardanddisciplinary/Grievance/create"
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
                              <th>
                                <div className="sortable pl-3">
                                  <span>SL</span>
                                  <div></div>
                                </div>
                              </th>
                              <th>
                                <div className="sortable">
                                  <span>Title</span>
                                  <div>
                                    <SortingIcon
                                      viewOrder={employeeOrder}
                                    ></SortingIcon>
                                  </div>
                                </div>
                              </th>
                              <th>
                                <div className="sortable">
                                  <span>Subject</span>
                                </div>
                              </th>
                              <th>
                                <div className="sortable">
                                  <span>Description</span>
                                </div>
                              </th>
                              <th>
                                <div className="sortable justify-content-left">
                                  <span>Document</span>
                                </div>
                              </th>

                              <th>
                                <div className="sortable justify-content-left">
                                  <span>Date</span>
                                </div>
                              </th>
                              <th>
                                <div
                                  className="sortable justify-content-center"
                                >
                                  <span>Status</span>
                                  <div>
                                    <SortingIcon
                                      viewOrder={category}
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
                                onClick={() => {
                                  setSingleDataAction(item);
                                  setView(true);
                                  history.push(
                                    "/SelfService/rewardanddisciplinary/Grievance/details/2"
                                  );
                                }}
                              >
                                <GrievanceTableBodySelf
                                  item={item}
                                  index={index}
                                  rowData={rowData}
                                  setRowData={setRowData}
                                />
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default GrievanceManagementSelf;
