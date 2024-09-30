/* eslint-disable react-hooks/exhaustive-deps */
import {
  AttachmentOutlined,
  DeleteOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AntTable from "../../common/AntTable";
import { getPeopleDeskAllDDL } from "../../common/api";
import IConfirmModal from "../../common/IConfirmModal";
import Loading from "../../common/loading/Loading";
import NoResult from "../../common/NoResult";
import NotPermittedPage from "../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../common/ResetButton";
import { getDownlloadFileView_Action } from "../../commonRedux/auth/actions";
import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../utility/customColor";
import FormCard from "./components/FormCard";
import {
  createPolicy,
  deletePolicy,
  getPolicyCategoryDDL,
  getPolicyLanding,
} from "./helper";
import MasterFilter from "common/MasterFilter";

const initData = {
  search: "",
  policyTitle: "",
  policyCategory: "",
  businessUnit: "",
  department: "",
};

const validationSchema = Yup.object().shape({
  policyTitle: Yup.string().required("Policy title is required"),
  policyCategory: Yup.object()
    .shape({
      label: Yup.string().required("Policy Category is required"),
      value: Yup.string().required("Policy Category is required"),
    })
    .typeError("Policy Category is required"),
});

export default function PolicyUpload() {
  const scrollRef = useRef();
  const [imageFile, setImageFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState("");
  const [rowDto, setRowDto] = useState([]);

  // DDL
  const [policyCategoryDDL, setPolicyCategoryDDL] = useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const { orgId, buId, buName, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Policy Upload";
  }, []);

  useEffect(() => {
    getPeopleDeskAllDDL(
      // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&intId=${employeeId}&WorkplaceGroupId=${wgId}`,
      `/PeopleDeskDdl/BusinessUnitIdAll?accountId=${orgId}`,
      "intBusinessUnitId",
      "strBusinessUnit",
      setBusinessUnitDDL
    );
    getPeopleDeskAllDDL(
      // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&BusinessUnitId=${buId}&intId=${employeeId}&WorkplaceGroupId=${wgId}`,
      `PeopleDeskDdl/DepartmentIdAll?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&workplaceId=${wId}`,
      "intDepartmentId",
      "strDepartment",
      setDepartmentDDL
    );
    getPolicyCategoryDDL(orgId, setPolicyCategoryDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  const getGridData = () => {
    getPolicyLanding(orgId, buId, 0, setRowDto);
  };
  useEffect(() => {
    getGridData();
  }, []);

  const saveHandler = (values, cb) => {
    const { businessUnit, department } = values;
    if (!businessUnit) {
      return toast.warn("Business Unit is required");
    }
    if (!department) {
      return toast.warn("Department is required");
    }
    if (!imageFile) {
      return toast.warn("Upload File is required");
    }

    const busisnessUnitList = businessUnit.map((itm) => {
      return {
        rowId: 0,
        policyId: 0,
        areaType: "BusinessUnit",
        areaAutoId: itm?.value || 0,
        areaName: itm?.label || "",
        isActive: true,
        intCreatedBy: employeeId,
      };
    });

    const departmentList = department.map((itm) => {
      return {
        rowId: 0,
        policyId: 0,
        areaType: "Department",
        areaAutoId: itm?.value || 0,
        areaName: itm?.label || "",
        isActive: true,
        intCreatedBy: employeeId,
      };
    });

    const payload = {
      objHeader: {
        policyId: 0,
        accountId: orgId,
        businessUnitId: buId,
        policyTitle: values?.policyTitle || "",
        policyCategoryId: values?.policyCategory?.value || 0,
        policyCategoryName: values?.policyCategory?.label || "",
        policyFileUrlId: imageFile?.globalFileUrlId
          ? imageFile?.globalFileUrlId
          : 0,
        policyFileName: imageFile?.fileName,
        intCreatedBy: employeeId,
        isActive: true,
      },
      objRow: [...busisnessUnitList, ...departmentList],
    };

    const callback = () => {
      cb();
      getPolicyLanding(orgId, buId, 0, setRowDto);
      setImageFile("");
    };
    createPolicy(payload, setLoading, callback);
  };

  const remover = (data) => {
    const confirmObject = {
      title: "Are you sure to delete this policy?",
      closeOnClickOutside: false,
      yesAlertFunc: () => {
        const callback = () => {
          getGridData();
        };
        deletePolicy(data?.policyId, callback);
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 132) {
      permission = item;
    }
  });

  const columns = (page, paginationSize) => {
    return [
      {
        title: "SL",
        render: (text, record, index) =>
          (page - 1) * paginationSize + index + 1,
        sorter: false,
        filter: false,
      },
      {
        title: "Policy Title",
        dataIndex: "policyTitle",
        sorter: false,
        filter: false,
      },
      {
        title: "Policy Category",
        dataIndex: "policyCategoryName",
        sorter: false,
        filter: false,
      },
      {
        title: "Business Unit",
        dataIndex: "businessUnitList",
        sorter: false,
        filter: false,
      },
      {
        title: "Department",
        dataIndex: "departmentList",
        sorter: false,
        filter: false,
      },
      {
        title: "Acknowledged",
        dataIndex: "acknowledgeCount",
        sorter: false,
        filter: false,
      },
      {
        title: "Attachment File",
        dataIndex: "AllocatedLeave",
        render: (_, record) => (
          <div>
            <div
              onClick={() => {
                dispatch(getDownlloadFileView_Action(record?.policyFileUrlId));
              }}
              className="d-flex"
            >
              <AttachmentOutlined
                sx={{ marginRight: "5px", color: "#0072E5" }}
              />
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#0072E5",
                  cursor: "pointer",
                }}
              >
                {record?.policyFileName}
              </p>
            </div>
          </div>
        ),
        sorter: false,
        filter: false,
      },
      {
        title: "",
        dataIndex: "",
        render: (_, item) => (
          <div className="d-flex align-items-center">
            <Tooltip title="Delete" arrow>
              <button
                type="button"
                className="iconButton mt-0 mt-md-2 mt-lg-0"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!permission?.isClose)
                    return toast.warn("You don't have permission");
                  remover(item);
                }}
              >
                <DeleteOutlined />
              </button>
            </Tooltip>
          </div>
        ),
        sorter: false,
        filter: false,
      },
    ];
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          businessUnit: buId ? [{ value: buId, label: buName }] : "",
          department: buId ? [{ value: 0, label: "All" }] : "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
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
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isCreate ? (
                <div className="table-card">
                  <div
                    className="table-card-heading justify-content-end"
                    ref={scrollRef}
                  >
                    <ul className="d-flex flex-wrap">
                      {values?.search && (
                        <li>
                          <ResetButton
                            classes="btn-filter-reset"
                            title="reset"
                            icon={
                              <SettingsBackupRestoreOutlined
                                sx={{
                                  marginRight: "10px",
                                  fontSize: "16px",
                                }}
                              />
                            }
                            styles={{
                              marginRight: "16px",
                            }}
                            onClick={() => {
                              getPolicyLanding(orgId, buId, 0, setRowDto);
                              setFieldValue("search", "");
                            }}
                          />
                        </li>
                      )}
                      <li>
                        <MasterFilter
                          isHiddenFilter
                          width="200px"
                          inputWidth="200px"
                          value={values?.search}
                          setValue={(value) => {
                            getPolicyLanding(orgId, buId, 0, setRowDto, value);
                            setFieldValue("search", value);
                          }}
                          cancelHandler={() => {
                            setFieldValue("search", "");
                            getPolicyLanding(orgId, buId, 0, setRowDto, "");
                          }}
                          placeholder={"Search"}
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="card-style" style={{ marginTop: "16px" }}>
                    <FormCard
                      propsObj={{
                        setFieldValue,
                        values,
                        errors,
                        touched,
                        resetForm,
                      }}
                      setSingleData={setSingleData}
                      singleData={singleData}
                      imageFile={imageFile}
                      setImageFile={setImageFile}
                      setLoading={setLoading}
                      policyCategoryDDL={policyCategoryDDL}
                      setPolicyCategoryDDL={setPolicyCategoryDDL}
                      businessUnitDDL={businessUnitDDL}
                      departmentDDL={departmentDDL}
                      orgId={orgId}
                      buId={buId}
                      employeeId={employeeId}
                    ></FormCard>
                  </div>

                  <div className="table-card-body">
                    <div
                      className="table-card-heading"
                      style={{
                        marginBottom: "3px",
                        marginTop: "12px",
                      }}
                    >
                      <h2
                        style={{
                          color: gray500,
                          fontSize: "14px",
                        }}
                      >
                        Policy List
                      </h2>
                    </div>

                    {rowDto?.length > 0 ? (
                      <div className="table-card-styled employee-table-card tableOne">
                        <AntTable
                          data={rowDto}
                          columnsData={columns(page, paginationSize)}
                          setPage={setPage}
                          setPaginationSize={setPaginationSize}
                        />
                      </div>
                    ) : (
                      <>{<NoResult title="No Result Found" para="" />}</>
                    )}
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
