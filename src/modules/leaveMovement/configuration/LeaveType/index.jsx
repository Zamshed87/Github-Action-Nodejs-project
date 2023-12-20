import {
  AddOutlined,
  ModeEditOutlineOutlined,
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AntTable from "../../../../common/AntTable";
import { getAllGlobalLeaveType } from "../../../../common/api";
import Chips from "../../../../common/Chips";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import AddEditFormComponent from "./addEditForm";
import { filterData } from "./helper";

const initData = {
  string: "",
  status: "",
};

const validationSchema = Yup.object({});
const saveHandler = (values) => {};

function LeaveTypeCreate() {
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");

  // for create state
  const [open, setOpen] = useState(false);

  // for create Modal
  // const handleOpen = () => {
  //   setOpen(true);
  // };
  const handleClose = () => {
    setOpen(false);
  };

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Leave Type";
  }, []);

  useEffect(() => {
    getAllGlobalLeaveType(setRowDto, setAllData, setLoading, orgId);
  }, [orgId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 35) {
      permission = item;
    }
  });

  // active & inactive filter
  // const statusTypeFilter = (statusType) => {
  //   const newRowData = [...allData];
  //   let modifyRowData = [];
  //   if (statusType === "Active") {
  //     modifyRowData = newRowData?.filter((item) => item?.isActive === true);
  //   } else {
  //     modifyRowData = newRowData?.filter((item) => item?.isActive === false);
  //   }
  //   setRowDto(modifyRowData);
  // };

  const columns = [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      sorter: false,
      filter: false,
    },
    {
      title: "Leave Type Name",
      dataIndex: "strLeaveType",
      sorter: false,
      filter: false,
    },
    {
      title: "Code",
      dataIndex: "strLeaveTypeCode",
      sorter: false,
      filter: false,
    },
    {
      title: "Status",
      dataIndex: "statusValue",
      render: (data, record) => (
        <div>
          <Chips
            label={record?.isActive ? "Active" : "Inactive"}
            classess={`${record?.isActive ? "success" : "danger"}`}
          />
        </div>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Status",
      dataIndex: "intLeaveTypeId",
      render: (data) => (
        <Tooltip title="Edit" arrow>
          <button
            className="iconButton"
            onClick={(e) => {
              if (!permission?.isEdit)
                return toast.warn("You don't have permission");
              e.stopPropagation();
              setOpen(true);
              setId(data);
            }}
          >
            <ModeEditOutlineOutlined sx={{ fontSize: "20px" }} />
          </button>
        </Tooltip>
      ),
      sorter: false,
      filter: false,
    },
  ];

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
                          label={"Leave Type"}
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
                            setId("");
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      {rowDto?.length > 0 ? (
                        <AntTable data={rowDto} columnsData={columns} />
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

              {/* addEdit form Modal */}
              <AddEditFormComponent
                show={open}
                title={id ? "Edit Leave Type" : "Create Leave Type"}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                classes="default-modal"
                id={id}
                setId={setId}
                orgId={orgId}
                buId={buId}
                allData={allData}
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

export default LeaveTypeCreate;
