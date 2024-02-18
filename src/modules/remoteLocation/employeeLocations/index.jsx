import {
  AddOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import BtnActionMenu from "../../../common/BtnActionMenu";
import FormikSelect from "../../../common/FormikSelect";
import MasterFilter from "../../../common/MasterFilter";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useDebounce from "../../../utility/customHooks/useDebounce";
import { customStylesSmall } from "../../../utility/selectCustomStyle";
import { useHistory } from "react-router-dom";
import AntTable from "../../../common/AntTable";
import NoResult from "../../../common/NoResult";
import { getPeopleDeskAllDDL } from "../../../common/api";
import AllLocationList from "./AllLocationList";
import { getAllLocationAssignLanding, remoteLocationColumn } from "./helper";
import Loading from "../../../common/loading/Loading";

const initialValues = {
  location: "",
  search: "",
};

const validationSchema = Yup.object().shape({});

export default function EmployeeLocations() {
  // hooks
  const dispatch = useDispatch();
  const history = useHistory();

  const debounce = useDebounce();
  const [rowDto, setRowDto] = useState([]);
  const [empLocationLanding, setEmpLocationLanding] = useState([]);
  const [locationDDL, setLocationDDL] = useState([]);

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [openModal, setOpenModal] = useState(false);

  const [loading, setLoading] = useState(false);

  // redux state
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30361) {
      permission = item;
    }
  });

  // useFormik hooks
  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: initialValues,
    onSubmit: (values) => saveHandler(values),
  });

  // for search
  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter(
        (item) =>
          regex.test(item?.strEmployeeName?.toLowerCase()) ||
          regex.test(item?.strDesignation?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  const getData = () => {
    getAllLocationAssignLanding(
      orgId,
      buId,
      setEmpLocationLanding,
      setRowDto,
      setLoading
    );
  };

  // on form submit
  const saveHandler = (values) => {};

  // useEffect
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Employee Locations";
  }, []);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/TimeSheet/GetMasterLocationRegistrationDdlById?AccountId=${orgId}&BussinessUnit=${buId}`,
      "value",
      "label",
      setLocationDDL
    );
  }, [employeeId, buId, orgId]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit}>
        {permission?.isView ? (
          <div className="table-card">
            <div
              className="table-card-heading"
              style={{ marginBottom: "10px" }}
            >
              <div className="d-flex justify-content-center align-items-center">
                <FormikSelect
                  name="location"
                  options={locationDDL || []}
                  value={values?.location}
                  onChange={(valueOption) => {
                    setFieldValue("location", valueOption);
                    history.push(
                      "/profile/remoteLocation/locationWiseEmployee",
                      {
                        locationInfo: valueOption,
                      }
                    );
                  }}
                  placeholder="Select Location"
                  styles={customStylesSmall}
                  errors={errors}
                  touched={touched}
                  isClearable={false}
                />

                <div>
                  <button
                    type="button"
                    className="btn btn-cancel ml-3"
                    style={{ width: "150px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenModal(true);
                    }}
                  >
                    View Locations
                  </button>
                </div>
              </div>

              <div className="table-card-head-right">
                <ul className="d-flex">
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
                          setRowDto(empLocationLanding);
                          setFieldValue("search", "");
                        }}
                      />
                    </li>
                  )}
                  <li>
                    <MasterFilter
                      styles={{
                        marginRight: "0px",
                      }}
                      isHiddenFilter
                      width="200px"
                      inputWidth="200px"
                      value={values?.search}
                      setValue={(value) => {
                        debounce(() => {
                          searchData(value, empLocationLanding, setRowDto);
                        }, 500);
                        setFieldValue("search", value);
                      }}
                      cancelHandler={() => {
                        setFieldValue("search", "");
                        getData();
                      }}
                    />
                  </li>
                  <li>
                    <BtnActionMenu
                      className="btn btn-default flex-center btn-deafult-create-job"
                      icon={
                        <AddOutlined
                          sx={{
                            marginRight: "0px",
                            fontSize: "15px",
                          }}
                        />
                      }
                      label="Assign / Unassign"
                      options={[
                        {
                          value: 1,
                          label: "Employee Wise Location",
                          onClick: () => {
                            if (!permission?.isCreate)
                              return toast.warn("You don't have permission");
                            history.push(
                              `/profile/remoteLocation/employeeWiseLocation`
                            );
                          },
                        },
                        {
                          value: 2,
                          label: "Location Wise Employee",
                          onClick: () => {
                            if (permission?.isCreate) {
                              history.push(
                                `/profile/remoteLocation/locationWiseEmployee`
                              );
                            } else {
                              toast.warn("You don't have permission");
                            }
                          },
                        },
                      ]}
                    />
                  </li>
                </ul>
              </div>
            </div>

            <div className="table-card-body">
              {rowDto?.length > 0 ? (
                <div className="table-card-styled employee-table-card tableOne">
                  <AntTable
                    data={rowDto}
                    columnsData={remoteLocationColumn(page, paginationSize)}
                    setPage={setPage}
                    setPaginationSize={setPaginationSize}
                    rowKey={(record) => record?.intEmployeeBasicInfoId}
                  />
                </div>
              ) : (
                <>
                  {
                    <div className="col-12">
                      <NoResult title={"No Data Found"} para={""} />
                    </div>
                  }
                </>
              )}
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
      <AllLocationList
        show={openModal}
        title="Create Approval Pipeline"
        setOpenModal={setOpenModal}
        size="lg"
        backdrop="static"
        classes="default-modal approval-pipeline-modal"
      />
    </>
  );
}
