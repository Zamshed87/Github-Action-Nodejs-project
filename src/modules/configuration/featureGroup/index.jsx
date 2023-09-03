import {
  AddOutlined,
  SearchOutlined,
  SettingsBackupRestoreOutlined
} from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FormikInput from "../../../common/FormikInput";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import ResetButton from "../../../common/ResetButton";
import SortingIcon from "../../../common/SortingIcon";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import AddEditFormComponent from "./AddEditForm";
import {
  filterData,
  getFeatureGroupLanding,
  getMenuFeatureGroup
} from "./helper";
import "./styles.css";

const initData = {
  search: "",
};

export default function FeatureGroup() {
  const [loading, setLoading] = useState(false);
  const [landingData, setLandingData] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [featureName, setFeatureName] = useState("");

  // filter
  const [viewOrder, setViewOrder] = useState("desc");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ascending & descending
  const sortByFilter = (filterType) => {
    const newRowData = [...allData];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a?.strFeatureGroupName > b.strFeatureGroupName) return -1;
        return 1;
      });
    } else {
      modifyRowData = newRowData?.sort((a, b) => {
        if (b?.strFeatureGroupName > a.strFeatureGroupName) return -1;
        return 1;
      });
    }
    setLandingData(modifyRowData);
  };

  // modal state
  const [isFormModal, setIsFormModal] = useState(false);

  const { buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};

  useEffect(() => {
    getFeatureGroupLanding(buId, setLandingData, setAllData, setLoading);
  }, [buId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 32) {
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
                <div className="table-card featureGroup-wrapper">
                  <div className="table-card-heading justify-content-end">
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
                            styles={{
                              marginRight: "16px",
                            }}
                            onClick={() => {
                              getFeatureGroupLanding(
                                buId,
                                setLandingData,
                                setAllData,
                                setLoading
                              );
                              setFieldValue("search", "");
                            }}
                          />
                        </li>
                      )}
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
                            filterData(e.target.value, allData, setLandingData);
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
                          label={"Feature Group"}
                          icon={
                            <AddOutlined
                              sx={{
                                marginRight: "0px",
                                fontSize: "15px",
                              }}
                            />
                          }
                          onClick={() => {
                            if (!permission?.isCreate)
                              return toast.warn("You don't have permission");
                            setIsFormModal(true);
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="table-card-body">
                    <div className="table-card-styled tableOne pr-1">
                      {landingData?.length > 0 ? (
                        <>
                          <table className="table">
                            <thead>
                              <tr>
                                <th>
                                  <div
                                    className="sortable"
                                    onClick={() => {
                                      setViewOrder(
                                        viewOrder === "desc" ? "asc" : "desc"
                                      );
                                      sortByFilter(viewOrder);
                                    }}
                                  >
                                    Feature Group Name
                                    <div>
                                      <SortingIcon viewOrder={viewOrder} />
                                    </div>
                                  </div>
                                </th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {landingData?.map((data, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{data?.strFeatureGroupName}</td>
                                    <td>
                                      <Tooltip title="Edit" arrow>
                                        <button
                                          onClick={() => {
                                            if (!permission?.isEdit)
                                              return toast.warn(
                                                "You don't have permission"
                                              );
                                            setIsFormModal(true);
                                            setFeatureName(
                                              data?.strFeatureGroupName
                                            );
                                            getMenuFeatureGroup(
                                              buId,
                                              data?.strFeatureGroupName,
                                              setSingleData,
                                              setRowDto,
                                              setLoading
                                            );
                                          }}
                                          className="iconButton"
                                        >
                                          <EditOutlinedIcon
                                            sx={{ fontSize: "20px" }}
                                          />
                                        </button>
                                      </Tooltip>
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
            </Form>
          </>
        )}
      </Formik>
      {/* addEdit form Modal */}
      <AddEditFormComponent
        show={isFormModal}
        title={featureName ? "Edit Feature Group" : "Create Feature Group"}
        onHide={() => setIsFormModal(false)}
        size="lg"
        backdrop="static"
        classes="default-modal"
        rowDto={rowDto}
        setRowDto={setRowDto}
        singleData={singleData}
        setSingleData={setSingleData}
        setLandingData={setLandingData}
        featureName={featureName}
        setFeatureName={setFeatureName}
        setAllData={setAllData}
      />
    </>
  );
}
