/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import FilterModal from "./components/FilterModal";
import CardTable from "./components/CardTable";
import ViewModal from "../../../../common/ViewModal";
import EditLeaveEncashmentModal from "./components/EditLeaveEncashmentModal";
import { getLeaveAndEncashmentListByEmployeeId } from "../helper";
import PrimaryButton from "../../../../common/PrimaryButton";
import { AddOutlined, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import "./styles.css";

const initData = {
  search: "",
  employee: "",
  leaveType: "",
};

const validationSchema = Yup.object().shape({
  leaveType: Yup.object()
    .shape({
      value: Yup.string().required("Leave days is required"),
      label: Yup.string().required("Leave days is required"),
    })
    .typeError("Leave days is required"),
});

export default function LeaveEncashment() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, []);

  //Create Leave  Encashment Modal
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState(null);
  const [isFilter, setIsFilter] = useState(false);
  const [modifyInitData, setModifyInitData] = useState("");

  const { orgId, buId, employeeId } = useSelector((state) => state?.auth?.profileData, shallowEqual);

  useEffect(() => {
    const modifyInitData = {
      search: "",
      employee: {
        value: singleData?.employeeBasicInfo?.intEmployeeId,
        label: singleData?.employeeBasicInfo?.strEmployeeName,
      },
      leaveType: {
        value: singleData?.leaveNencashmentApplication?.intRequestDays,
        label: singleData?.leaveNencashmentApplication?.intRequestDays,
      },
    };
    setModifyInitData(modifyInitData);
  }, [singleData]);

  const saveHandler = (values) => {};

  const [anchorEl, setAnchorEl] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getData = () => {
    getLeaveAndEncashmentListByEmployeeId(employeeId, setRowDto, setAllData, setLoading, "");
  };

  useEffect(() => {
    getData();
  }, [orgId, buId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={singleData ? modifyInitData : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, resetForm, values, errors, touched, setFieldValue, isValid }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="table-card">
                <div className="table-card-heading mt-3">
                  <span></span>
                  <div className="table-card-head-right">
                    <ul className="d-flex flex-wrap">
                      {isFilter && (
                        <li>
                          <ResetButton
                            title="reset"
                            icon={<SettingsBackupRestoreOutlined sx={{ marginRight: "10px" }} />}
                            onClick={() => {
                              setIsFilter(false);
                            }}
                          />
                        </li>
                      )}
                      <li>
                        <MasterFilter
                          inputWidth="200px"
                          width="200px"
                          value={values?.search}
                          setValue={(value) => {
                            setFieldValue("search", value);
                          }}
                          cancelHandler={() => {
                            setFieldValue("search", "");
                          }}
                          handleClick={(e) => setAnchorEl(e.currentTarget)}
                        />
                      </li>
                    </ul>
                    <PrimaryButton
                      type="button"
                      className="btn btn-default flex-center"
                      label={"Request Encashment"}
                      icon={<AddOutlined sx={{ marginRight: "0px", fontSize: "15px" }} />}
                      onClick={() => setShow(true)}
                    />
                  </div>
                </div>
                <div className="table-card-body">
                  <div>
                    <CardTable
                      rowDto={rowDto}
                      show={show}
                      setShow={setShow}
                      allData={allData}
                      setRowDto={setRowDto}
                      singleData={singleData}
                      setSingleData={setSingleData}
                      setAllData={setAllData}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
              <FilterModal
                propsObj={{
                  id,
                  open,
                  anchorEl,
                  handleClose,
                  setIsFilter,
                }}
              ></FilterModal>
              <ViewModal
                size="lg"
                title={singleData?.employeeBasicInfo?.intEmployeeId ? "Edit Leave Encashment" : "Create Leave Encashment"}
                backdrop="static"
                classes="default-modal preview-modal"
                show={show}
                onHide={() => {
                  setShow(false);
                  resetForm(initData);
                  setSingleData("");
                }}
              >
                <EditLeaveEncashmentModal
                  objProps={{
                    setFieldValue,
                    touched,
                    errors,
                    values,
                    resetForm,
                    setShow,
                    rowDto,
                    setRowDto,
                    allData,
                    setAllData,
                    setLoading,
                    getData,
                    singleData,
                    setSingleData,
                    initData,
                  }}
                />
              </ViewModal>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
