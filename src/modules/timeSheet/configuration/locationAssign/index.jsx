import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import SortingIcon from "../../../../common/SortingIcon";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import Loading from "./../../../../common/loading/Loading";
import NoResult from "./../../../../common/NoResult";
import LocationAssignDrawerBody from "./components/DrawerBody";
import LocationAssignDrawer from "./components/DrawerWrapper";
import "./styles.css";

const initData = {
  search: "",
  selectAll: "",
};

export default function LocationAssign() {
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  // row Data
  const tableData = [
    {
      location: "Mohammadpur, Lalmatia, Dhaka-1207.",
      longitude: "48456.2°",
      latitude: "986546.2°",
    },
    {
      location: "Dhanmondi 2/A, Dhaka-1203",
      longitude: "48456.2°",
      latitude: "986546.2°",
    },
  ];
  const [rowDto, setRowDto] = useState(tableData);
  const [, setAllData] = useState([]);

  // filter
  // eslint-disable-next-line no-unused-vars
  const [viewOrder] = useState("desc");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [sideDrawer, setSideDrawer] = useState(false);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 46) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          resetForm(initData);
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="table-card loacationAssign">
                  <div className="table-card-heading"></div>
                  <div className="table-card-body">
                    <div className="table-card-styled">
                      {/* {rowDto?.Result?.length > 0 ? ( */}
                      {rowDto?.length > 0 ? (
                        <>
                          <table>
                            <thead>
                              <tr style={{ fontWeight: 600 }}>
                                <th>
                                  <div
                                    className="sortable"
                                    // onClick={() => {
                                    //   setViewOrder(viewOrder === "desc" ? "asc" : "desc");
                                    //   commonSortByFilter(viewOrder, "HolidayGroupName");
                                    // }}
                                  >
                                    Location
                                    <div>
                                      <SortingIcon
                                        viewOrder={viewOrder}
                                      ></SortingIcon>
                                    </div>
                                  </div>
                                </th>
                                <th>
                                  <div
                                    className="sortable"
                                    // onClick={() => {
                                    //   setYearOrder(yearOrder === "desc" ? "asc" : "desc");
                                    //   commonSortByFilter(yearOrder, "Year");
                                    // }}
                                  >
                                    Longitude/Lattitude
                                    <div>
                                      <SortingIcon viewOrder=""></SortingIcon>
                                    </div>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* {rowDto?.Result?.map((item, index) => { */}
                              {rowDto?.map((item, index) => {
                                return (
                                  <tr
                                    key={index}
                                    onClick={() => {
                                      if (!permission?.isCreate)
                                        return toast.warn(
                                          "You don't have permission"
                                        );
                                      setSideDrawer(true);
                                    }}
                                    className="hasEvent"
                                  >
                                    <td>
                                      <div
                                        style={{ color: "rgba(0, 0, 0, 0.6" }}
                                      >
                                        {item?.location}
                                      </div>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                      <div
                                        style={{ color: "rgba(0, 0, 0, 0.6" }}
                                      >
                                        {item?.latitude}/{item.longitude}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </>
                      ) : (
                        <>
                          {!loading && (
                            <NoResult title="No Result Found" para="" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}

              {/* salary info */}
              <LocationAssignDrawer
                styles={{
                  width: "50%",
                }}
                setIsOpen={setSideDrawer}
                isOpen={sideDrawer}
                setRowDto={setRowDto}
                setAllData={setAllData}
                setLoading={setLoading}
              >
                <LocationAssignDrawerBody
                  setIsOpen={setSideDrawer}
                  setFieldValue={setFieldValue}
                  values={values}
                />
              </LocationAssignDrawer>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
