/* eslint-disable no-unused-vars */
import { AddOutlined, SearchOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import FormikInput from "../../../common/FormikInput";
import PrimaryButton from "../../../common/PrimaryButton";
import SortingIcon from "../../../common/SortingIcon";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import GrievanceTableBody from "./component/GrievanceTableBody";

const GrievanceManagement = () => {
  const [loading, setLoading] = useState(false);
  const [employeeOrder, setEmployeeOrder] = useState("desc");
  const [category, setCategory] = useState("desc");
  const [rowData, setRowData] = useState([]);
  const [view, setView] = useState(false);

  let history = useHistory();

  const tableData = [
    {
      subject: "Bullying and harassment",
      title: "Self",
      des: "Bullying and harassment",
      document: "photo.png",
      date: "25 April 2022",
      status: "Pending",
    },
    {
      subject: "Complaints Againts Stuffs",
      title: "Md. Taufiqur Rahman",
      des: "Complaints Againts Stuffs",
      document: "screenshot.jpg",
      date: "25 April 2022",
      status: "Closed",
      position: "Business Analyst",
      section: "Engineering",
    },
    {
      subject: "Misbehave",
      title: "Anonymous",
      des: "Misbehave",
      document: "complaints.pdf",
      date: "25 April 2022",
      status: "In Review",
    },
    {
      subject: "Dirty Washroom",
      title: "MD. Mridul Hasan",
      des: "Dirty Washroom",
      document: "photo.png",
      date: "25 April 2022",
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

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                              "/profile/rewardsanddisciplinary/grievance/create"
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
                              <div className="sortable justify-content-end mr-4">
                                <span>Date</span>
                              </div>
                            </th>
                            <th>
                              <div
                                className="sortable ju
                                stify-content-left"
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
                                  "/profile/rewardsanddisciplinary/grievance/details/2"
                                );
                              }}
                            >
                              <GrievanceTableBody
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
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default GrievanceManagement;
