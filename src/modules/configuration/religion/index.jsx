/* eslint-disable no-unused-vars */
import {
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import FormikInput from "./../../../common/FormikInput";
import Loading from "./../../../common/loading/Loading";
import NoResult from "./../../../common/NoResult";
import ResetButton from "./../../../common/ResetButton";
import ReligionBox from "./components/religionBox/ReligionBox";
import { filterData, getAllReligion } from "./helper";
import ViewFormComponent from "./viewForm/index";

const initData = {
  string: "",
};

const validationSchema = Yup.object({});
const saveHandler = (values) => {};

function Religion() {
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [id, setId] = useState("");

  // for create state
  const [open, setOpen] = useState(false);

  // for view state
  const [viewModal, setViewModal] = useState(false);

  // for create Modal
  const handleOpen = () => {
    setViewModal(false);
    setOpen(true);
  };
  const handleClose = () => {
    setViewModal(false);
    setOpen(false);
  };

  // for view Modal
  const handleViewOpen = () => setViewModal(true);
  const handleViewClose = () => setViewModal(false);

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Religion";
  }, []);

  useEffect(() => {
    getAllReligion(setRowDto, setAllData, setLoading);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 55) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
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
            {loading && <Loading />}
            <Form onSubmit={handleSubmit}>
              {permission?.isView ? (
                <div className="table-card">
                  <div
                    className="table-card-heading"
                    style={{ marginBottom: "12px" }}
                  >
                    <div></div>
                    <ul className="d-flex flex-wrap">
                      {values?.search && (
                        <li>
                          <ResetButton
                            classes="btn-filter-reset"
                            title="reset"
                            icon={
                              <SettingsBackupRestoreOutlined
                                sx={{ marginRight: "10px", fontSize: "16px" }}
                              />
                            }
                            onClick={() => {
                              setRowDto(allData);
                              setFieldValue("search", "");
                            }}
                          />
                        </li>
                      )}
                      <li>
                        <FormikInput
                          classes="search-input fixed-width mt-2 mt-md-0 mb-2 mb-md-0 tableCardHeaderSeach"
                          inputClasses="search-inner-input"
                          placeholder="Search"
                          value={values?.search}
                          name="search"
                          type="text"
                          trailicon={
                            <SearchOutlined sx={{ color: "#323232" }} />
                          }
                          onChange={(e) => {
                            filterData(e.target.value, allData, setRowDto);
                            setFieldValue("search", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      {rowDto?.length > 0 ? (
                        <>
                          <table className="table">
                            <thead>
                              <tr>
                                <th style={{ width: "30px" }}>SL</th>
                                <th>
                                  <div className="sortable">
                                    <span>Religion Name</span>
                                  </div>
                                </th>
                                <th style={{ width: "80px" }}>
                                  <div className="sortable justify-content-center">
                                    <span>Status</span>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((item, index) => (
                                <ReligionBox
                                  {...item}
                                  handleOpen={handleOpen}
                                  handleClose={handleClose}
                                  setOpen={setOpen}
                                  setViewModal={setViewModal}
                                  setId={setId}
                                  setAllData={setAllData}
                                  allData={allData}
                                  orgId={orgId}
                                  buId={buId}
                                  setLoading={setLoading}
                                  setSingleData={setSingleData}
                                  key={index}
                                  index={index}
                                />
                              ))}
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

              {/* View Form Modal */}
              <ViewFormComponent
                show={viewModal}
                title={"Religion Details"}
                onHide={handleViewClose}
                size="lg"
                backdrop="static"
                classes="default-modal"
                handleOpen={handleOpen}
                id={id}
                orgId={orgId}
                buId={buId}
                allData={allData}
                singleData={singleData}
                setSingleData={setSingleData}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default Religion;
