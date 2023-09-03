import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
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
  const history = useHistory();
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
  const [allData, setAllData] = useState([]);

  // filter
  // eslint-disable-next-line no-unused-vars
  const [viewOrder, setViewOrder] = useState("desc");

  // modal
  // eslint-disable-next-line no-unused-vars
  const [isHolidayGroup, setIsHolidayGroup] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // eslint-disable-next-line no-unused-vars
  const handleClose = () => {
    setIsHolidayGroup(false);
  };

  // eslint-disable-next-line no-unused-vars
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // useEffect(() => {
  //   getPeopleDeskAllLanding("HolidayGroup", orgId, buId, "", setRowDto, setAllData, setLoading);
  // }, [orgId, buId]);

  // search
  // eslint-disable-next-line no-unused-vars
  const filterData = (keywords, allData, setRowDto) => {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter((item) =>
      regex.test(item?.HolidayGroupName?.toLowerCase())
    );
    setRowDto({ Result: newDta });
  };

  // ascending & descending
  // eslint-disable-next-line no-unused-vars
  const commonSortByFilter = (filterType, property) => {
    const newRowData = [...allData];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a[property] > b[property]) return -1;
        return 1;
      });
    } else {
      modifyRowData = newRowData?.sort((a, b) => {
        if (b[property] > a[property]) return -1;
        return 1;
      });
    }
    setRowDto({ Result: modifyRowData });
  };

  const saveHandler = (values) => {};

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
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
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
