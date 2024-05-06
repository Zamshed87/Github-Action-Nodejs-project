import React, { useEffect, useState } from "react";
import MasterFilter from "common/MasterFilter";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import PeopleDeskTable, { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import useDebounce from "utility/customHooks/useDebounce";
import NoResult from "common/NoResult";
import { assetReportColumn, getData } from "./utils";
import EmployeeHistoryView from "./modal/EmployeeHistoryView";
import ViewModal from "common/ViewModal";
import MaintenanceSummary from "./modal/MaintenanceSummary";
import TotalDepreciationView from "./modal/TotalDepreciationView";
import PrimaryButton from "common/PrimaryButton";
import { AddOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import CreateAttachmentUpload from "./modal/CreateAttachmentUpload";
import { Form, Formik } from "formik";
import Required from "common/Required";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
import ProfileView from "./modal/ProfileView";
import { PModal } from "Components/Modal";

const initData = {
  searchString: "",
  type: "",
  employeeName: "",
  status: "",
};

const AssetReport = () => {
  const debounce = useDebounce();
  const dispatch = useDispatch();
  const history = useHistory();
  const { orgId, buId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const [rowDto, getLandingData, loading, setRowDto] = useAxiosGet([]);
  const [historyModal, setHistoryModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [depreciationModal, setDepreciationModal] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [unassignLoading, setUnassignLoading] = useState(false);
  const [isAttachmentShow, setIsAttachmentShow] = useState(false);
  const [isProfileView, setIsProfileView] = useState(false);
  const [empDDL, getEmp, , setEmpDDL] = useAxiosGet([]);
  const [deptDDL, getDept, , setDeptDDL] = useAxiosGet([]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30406) {
      permission = item;
    }
  });

  const handleChangePage = (_, newPage, searchText, values) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      getLandingData,
      setRowDto,
      orgId,
      buId,
      wId,
      wgId,
      values?.employeeName?.value || 0,
      values?.type?.value || 0,
      values?.status?.value || 0,
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      setPages,
      searchText
    );
  };

  const handleChangeRowsPerPage = (event, searchText, values) => {
    setPages(() => {
      return {
        current: 1,
        total: pages?.total,
        pageSize: +event.target.value,
      };
    });

    getData(
      getLandingData,
      setRowDto,
      orgId,
      buId,
      wId,
      wgId,
      values?.employeeName?.value || 0,
      values?.type?.value || 0,
      values?.status?.value || 0,
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      setPages,
      searchText
    );
  };

  useEffect(() => {
    getEmp(`/Employee/AllEmployeeDDL?intAccountId=${orgId}`, (res) => {
      setEmpDDL(res);
    });
    getDept(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}&intId=0`,
      (res) => {
        const modifyData = res?.map((item) => ({
          ...item,
          value: item?.DepartmentId,
          label: item?.DepartmentName,
        }));
        setDeptDDL(modifyData);
      }
    );
    getData(
      getLandingData,
      setRowDto,
      orgId,
      buId,
      wId,
      wgId,
      0,
      0,
      0,
      pages,
      setPages,
      ""
    );
  }, [orgId, buId, wId, wgId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Asset Management"));
    document.title = "Asset Profile";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return permission?.isView ? (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            {(loading || unassignLoading) && <Loading />}
            <Form onSubmit={handleSubmit}>
              <div className="table-card">
                <div className="table-card-heading">
                  <div className="d-flex align-items-center">
                    <h6 className="count">Asset Profile</h6>
                  </div>
                  <ul className="d-flex flex-wrap">
                    <li>
                      <MasterFilter
                        inputWidth="250px"
                        width="250px"
                        isHiddenFilter
                        value={values?.searchString}
                        setValue={(value) => {
                          setFieldValue("searchString", value);
                          debounce(() => {
                            getData(
                              getLandingData,
                              setRowDto,
                              orgId,
                              buId,
                              wId,
                              wgId,
                              values?.employeeName?.value || 0,
                              values?.type?.value || 0,
                              values?.status?.value || 0,
                              {
                                current: 1,
                                pageSize: pages?.pageSize,
                              },
                              setPages,
                              value
                            );
                          }, 500);
                        }}
                        cancelHandler={() => {
                          setFieldValue("searchString", "");
                          getData(
                            getLandingData,
                            setRowDto,
                            orgId,
                            buId,
                            wId,
                            wgId,
                            values?.employeeName?.value || 0,
                            values?.type?.value || 0,
                            values?.status?.value || 0,
                            {
                              current: 1,
                              pageSize: pages?.pageSize,
                            },
                            setPages,
                            ""
                          );
                        }}
                      />
                    </li>
                    <li>
                      <PrimaryButton
                        type="button"
                        className="btn btn-default flex-center"
                        label="Registration"
                        icon={
                          <AddOutlined
                            sx={{
                              marginRight: "0px",
                              fontSize: "15px",
                            }}
                          />
                        }
                        onClick={() => {
                          if (!permission?.isEdit) {
                            return toast.warn("You don't have permission", {
                              toastId: "permission",
                            });
                          }
                          history.push(
                            "/assetManagement/assetControlPanel/registration/create"
                          );
                        }}
                      />
                    </li>
                  </ul>
                </div>
                <div className="table-card-body">
                  <div className="row">
                    <div className="col-lg-3">
                      <label>
                        Type <Required />
                      </label>
                      <FormikSelect
                        placeholder="Select a type"
                        classes="input-sm"
                        styles={customStyles}
                        name="type"
                        options={[
                          { value: 1, label: "Department" },
                          { value: 2, label: "Employee" },
                        ]}
                        value={values?.type}
                        onChange={(valueOption) => {
                          setFieldValue("type", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {values?.type?.value && (
                      <div className="col-lg-3">
                        <label>
                          {values?.type?.value === 1
                            ? "Department Name"
                            : "Employee Name"}{" "}
                          <Required />
                        </label>
                        <FormikSelect
                          placeholder={
                            values?.type?.value === 1
                              ? "Select Department Name"
                              : "Select Employee Name"
                          }
                          classes="input-sm"
                          styles={customStyles}
                          name="employeeName"
                          options={
                            values?.type?.value === 1 ? deptDDL : empDDL || []
                          }
                          value={values?.employeeName}
                          onChange={(valueOption) => {
                            setFieldValue("employeeName", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    )}
                    <div className="col-lg-3">
                      <label>
                        Status <Required />
                      </label>
                      <FormikSelect
                        placeholder="Select a status"
                        classes="input-sm"
                        styles={customStyles}
                        name="status"
                        options={[
                          { value: 0, label: "All" },
                          { value: 1, label: "Available" },
                          { value: 2, label: "Maintenance" },
                          { value: 3, label: "Assign" },
                        ]}
                        value={values?.status}
                        onChange={(valueOption) => {
                          setFieldValue("status", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mt-4">
                      <PrimaryButton
                        type="button"
                        className="btn btn-default flex-center"
                        label={"View"}
                        onClick={(e) => {
                          e.stopPropagation();
                          getData(
                            getLandingData,
                            setRowDto,
                            orgId,
                            buId,
                            wId,
                            wgId,
                            values?.employeeName?.value || 0,
                            values?.type?.value || 0,
                            values?.status?.value || 0,
                            pages,
                            setPages,
                            ""
                          );
                        }}
                      />
                    </div>
                  </div>
                  {rowDto?.length > 0 ? (
                    <PeopleDeskTable
                      columnData={assetReportColumn(
                        pages?.current,
                        pages?.pageSize,
                        setHistoryModal,
                        setItemId,
                        setIsModalOpen,
                        setDepreciationModal,
                        history,
                        setUnassignLoading,
                        setIsAttachmentShow,
                        setIsProfileView,
                        () => {
                          getData(
                            getLandingData,
                            setRowDto,
                            orgId,
                            buId,
                            wId,
                            wgId,
                            values?.employeeName?.value || 0,
                            values?.type?.value || 0,
                            values?.status?.value || 0,
                            pages,
                            setPages,
                            ""
                          );
                        }
                      )}
                      pages={pages}
                      rowDto={rowDto}
                      setRowDto={setRowDto}
                      handleChangePage={(e, newPage) =>
                        handleChangePage(
                          e,
                          newPage,
                          values?.searchString,
                          values
                        )
                      }
                      handleChangeRowsPerPage={(e) =>
                        handleChangeRowsPerPage(e, values?.searchString, values)
                      }
                      uniqueKey="itemId"
                    />
                  ) : (
                    <>
                      {!loading && (
                        <div className="col-12">
                          <NoResult title={"No Data Found"} para={""} />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
      <ViewModal
        size="lg"
        title="Employee Details"
        backdrop="static"
        classes="default-modal preview-modal"
        show={historyModal}
        onHide={() => setHistoryModal(false)}
      >
        <EmployeeHistoryView id={itemId} />
      </ViewModal>
      <ViewModal
        size="lg"
        title="Maintenance Summary"
        backdrop="static"
        classes="default-modal preview-modal"
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
      >
        <MaintenanceSummary id={itemId} />
      </ViewModal>
      <ViewModal
        size="lg"
        title="Depreciation Details"
        backdrop="static"
        classes="default-modal preview-modal"
        show={depreciationModal}
        onHide={() => setDepreciationModal(false)}
      >
        <TotalDepreciationView id={itemId} />
      </ViewModal>
      <ViewModal
        size="lg"
        title="Attachment Upload"
        backdrop="static"
        classes="default-modal preview-modal"
        show={isAttachmentShow}
        onHide={() => setIsAttachmentShow(false)}
      >
        <CreateAttachmentUpload
          assetId={itemId}
          setIsAttachmentShow={setIsAttachmentShow}
        />
      </ViewModal>
      <PModal
        title="Asset Profile"
        open={isProfileView}
        onCancel={() => {
          setIsProfileView(false);
        }}
        components={<ProfileView />}
        width={1000}
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default AssetReport;
