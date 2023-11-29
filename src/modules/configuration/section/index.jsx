import {
  AddOutlined,
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import FormikInput from "common/FormikInput";
import ResetButton from "common/ResetButton";
import Loading from "common/loading/Loading";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { depertmentDtoCol, filterData, getAllEmpSection, sectionDtoCol } from "./helper";
import PrimaryButton from "common/PrimaryButton";
import PeopleDeskTable from "common/peopleDeskTable";
import NoResult from "common/NoResult";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import ViewFormComponent from "./viewForm";
import AddEditFormComponent from "./addEditForm";


const initData = {
  search: "",
  status: "",
};

const validationSchema = Yup.object({});

function Section() {
  // row Data
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);

  // filter
  const [status, setStatus] = useState("");
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
  const handleViewClose = () => setViewModal(false);
  const { orgId, buId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState("");
  const saveHandler = (values) => {};
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllEmpSection(orgId, buId, setRowDto, setAllData, setLoading, wId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30378) {
      permission = item;
    }
  });

  console.log("rowDto",rowDto)

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
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            {loading && <Loading />}
            <Form onSubmit={handleSubmit}>
              {permission?.isView ? (
                <div className="table-card businessUnit-wrapper">
                  <div className="table-card-heading">
                    <div></div>
                    <ul className="d-flex flex-wrap">
                      {(values?.search || status) && (
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
                              setRowDto(allData);
                              setFieldValue("search", "");
                              setStatus("");
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
                      <li>
                        <PrimaryButton
                          type="button"
                          className="btn btn-default flex-center"
                          label={"Section"}
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
                            e.stopPropagation();
                            setOpen(true);
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                  {/* table body */}
                  <div className="table-card-body">
                    {rowDto?.length > 0 ? (
                      <>
                        <div className="table-card-styled employee-table-card tableOne  table-responsive mt-3">
                          <PeopleDeskTable
                            columnData={sectionDtoCol()}
                            // pages={pages}
                            rowDto={rowDto}
                            setRowDto={setRowDto}
                            uniqueKey="sectionId"
                            isCheckBox={false}
                            isScrollAble={false}
                            isPagination={false}
                            onRowClick={(item) => {
                              if (!permission?.isEdit)
                                return toast.warn("You don't have permission");
                              setViewModal(true);
                              setSingleData(item);
                            }}
                          />
                        </div>
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
              ) : (
                <NotPermittedPage />
              )}

              {/* View Form Modal */}
              <ViewFormComponent
                show={viewModal}
                title={"Section Details"}
                onHide={handleViewClose}
                size="lg"
                backdrop="static"
                classes="default-modal"
                handleOpen={handleOpen}
                orgId={orgId}
                buId={buId}
                singleData={singleData}
                setSingleData={setSingleData}
              />

              {/* addEdit form Modal */}
              <AddEditFormComponent
                show={open}
                title={
                  singleData?.sectionId
                    ? "Edit Section"
                    : "Create Section"
                }
                onHide={handleClose}
                size="lg"
                backdrop="static"
                classes="default-modal"
                orgId={orgId}
                buId={buId}
                setRowDto={setRowDto}
                setAllData={setAllData}
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

export default Section;
