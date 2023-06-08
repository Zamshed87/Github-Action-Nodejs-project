/* eslint-disable react-hooks/exhaustive-deps */
import {
  SearchOutlined,
  SettingsBackupRestoreOutlined
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import AddEditFormComponent from "./addEditForm";
import CardTable from "./component/CardTable";
import { getPayrollGroupAllLanding } from "./helper";
import "./index.css";

const initData = {
  search: "",
  status: "",
};

export default function PayrollGroup() {
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [allData, setAllData] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [status, setStatus] = useState("");

  const getData = () => {
    getPayrollGroupAllLanding(
      "PayrollGroup",
      orgId,
      buId,
      "",
      setRowDto,
      setAllData,
      setLoading
    );
  };
  // const obj = {tableName:"PayrollGroup",buId, orgId, empId, setRowDto,setAllData, setLoading };
  useEffect(() => {
    getData();
  }, [buId]);


  // search
  const filterData = (keywords) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter((item) =>
        regex.test(item?.PayrollGroupName?.toLowerCase())
      );
      setRowDto(newDta);
    } catch (error) {
      setRowDto([]);
    }
  };

  const filterActiveInactive = (type) => {
    const newData = allData.filter((item) =>
      type === "Active" ? item?.IsActive : !item?.IsActive
    );
    setRowDto(newData);
  };

  // const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // let permission = null;
  // permissionList.forEach((item) => {
  //   if (item?.menuReferenceId === 73) {
  //     permission = item;
  //   }
  // });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
  }, []);

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
              <div className="all-candidate">
                {/* {permission?.isView ? ( */}
                <div className="col-md-12">
                  <div className="table-card">
                    <div className="table-card-heading">
                      <span></span>
                      <ul className="d-flex flex-wrap">
                        {(values?.search || status) && (
                          <li>
                            <ResetButton
                              title="reset"
                              icon={
                                <SettingsBackupRestoreOutlined
                                  sx={{ marginRight: "10px" }}
                                />
                              }
                              onClick={() => {
                                getData();
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
                        {/* <li>
                              <PrimaryButton
                                type="button"
                                className="btn btn-default flex-center"
                                label={"Payroll Group"}
                                icon={
                                  <AddOutlined sx={{ marginRight: "11px" }} />
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenModal(true);
                                  // setId("");
                                }}
                              />
                            </li> */}
                      </ul>
                      {/* </div> */}
                    </div>
                    <div className="table-card-body">
                      <CardTable
                        propsObj={{
                          rowDto,
                          setOpenModal,
                          setRowDto,
                          setFieldValue,
                          allData,
                          values,
                          filterActiveInactive,
                          status,
                          setStatus,
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/* ) : (
                <NotPermittedPage />
              )} */}
              </div>
            </Form>
          </>
        )}
      </Formik>
      <AddEditFormComponent
        show={openModal}
        title="Create Payroll Group"
        onHide={setOpenModal}
        size="lg"
        backdrop="static"
        classes="default-modal"
        // id={id}
        // orgId={orgId}
        // setRowDto={setRowDto}
      />
    </>
  );
}
