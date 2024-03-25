import {
  AddOutlined,
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AntTable from "../../../common/AntTable";
import FormikInput from "../../../common/FormikInput";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import ResetButton from "../../../common/ResetButton";
// import SortingIcon from '../../../common/SortingIcon';
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { getControlPanelAllLanding } from "../helper";
import AddEditFormComponent from "./addEditForm";
import { adminPayScaleCol, filterData } from "./helper";
// import PayScaleGradeView from './viewForm';

const initData = {
  search: "",
};

const validationSchema = Yup.object({});

const PayScaleGrade = () => {
  // row Data
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [paysaleGradeId, setPayscaleGradeId] = useState(null);

  // filter

  // for create state
  const [open, setOpen] = useState(false);

  // for view state
  const [, setViewModal] = useState(false);
  // for create Modal
  // const handleOpen = () => {
  //   setViewModal(false);
  //   setOpen(true);
  // };
  const handleClose = () => {
    setViewModal(false);
    setOpen(false);
  };

  // for view Modal
  // const handleViewClose = () => {
  //   setViewModal(false);
  // };

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  const saveHandler = (values) => {};

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
  }, [dispatch]);

  const getData = () => {
    getControlPanelAllLanding({
      apiUrl: `/Payroll/GetAllScaleGrade?IntAccountId=${orgId}&IntPayscaleGradeId=0`,
      setLoading,
      setter: setRowDto,
      setAllData,
    });
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  // ascending & descending
  /*   const sortByFilter = (filterType) => {
    const newRowData = [...allData];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a?.strBusinessUnit.toLowerCase() > b.strBusinessUnit.toLowerCase())
          return -1;
        return 1;
      });
    } else {
      modifyRowData = newRowData?.sort((a, b) => {
        if (b?.strBusinessUnit.toLowerCase() > a.strBusinessUnit.toLowerCase())
          return -1;
        return 1;
      });
    }
    setRowDto(modifyRowData);
  }; */

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30317) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
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
                <div className="table-card">
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
                              setRowDto(allData);
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
                          label={"PayScale Grade"}
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
                          <AntTable
                            data={rowDto || []}
                            removePagination
                            columnsData={adminPayScaleCol(
                              permission,
                              setOpen,
                              setPayscaleGradeId,
                              orgId,
                              setSingleData,
                              setLoading
                            )}
                            rowClassName="pointer"
                            onRowClick={(item) => {
                              if (!permission?.isEdit)
                                return toast.warn("You don't have permission");
                              setPayscaleGradeId(item?.intPayscaleGradeId);
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
              {/* <PayScaleGradeView
                show={viewModal}
                title={"View Payscale Grade"}
                onHide={handleViewClose}
                size="lg"
                backdrop="static"
                classes="default-modal"
                handleOpen={handleOpen}
                orgId={orgId}
                buId={buId}
                paysaleGradeId={paysaleGradeId}
                setPayscaleGradeId={setPayscaleGradeId}
              /> */}

              {/* addEdit form Modal */}
              <AddEditFormComponent
                isVisibleHeading
                propsObj={{
                  show: open,
                  title: paysaleGradeId
                    ? "Edit PayScale Grade"
                    : "Create PayScale Grade",
                  onHide: handleClose,
                  size: "lg",
                  backdrop: "static",
                  classes: "default-modal",
                  orgId,
                  buId,
                  setRowDto,
                  setAllData,
                  paysaleGradeId,
                  setPayscaleGradeId,
                  setSingleData,
                  singleData,
                }}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default PayScaleGrade;

/* 
  <table className="table">
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>SL</th>
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
                                  <span>PayScale Grade Name</span>
                                  <div>
                                  
                                      </div>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="sortable">
                                        <span>PayScale Grade Code</span>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="sortable">
                                        <span>Max Salary</span>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="sortable">
                                        <span>Min Salary</span>
                                      </div>
                                    </th>
                                    <th>
                                      <div className="sortable">
                                        <span>Depend On</span>
                                      </div>
                                    </th>
                                    <th></th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {rowDto?.map((item, index) => {
                                    return (
                                      <BusinessUnitTableItem
                                        key={index}
                                        propsObj={{
                                          item,
                                          handleOpen,
                                          handleClose,
                                          setOpen,
                                          setViewModal,
                                          orgId,
                                          buId,
                                          setLoading,
                                          permission,
                                          setPayscaleGradeId,
                                          getData,
                                          setSingleData,
                                          singleData,
                                        }}
                                        id={item?.intPayscaleGradeId}
                                        index={index}
                                      />
                                    );
                                  })}
                                </tbody>
                              </table>


*/
