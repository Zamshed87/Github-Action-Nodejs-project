/* eslint-disable array-callback-return */
import { Close, DeleteOutline } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import { Form, Formik } from "formik";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import { todayDate } from "../../../../utility/todayDate";
import { isUniq } from "../../../../utility/uniqChecker";
import { createRoleGroup } from "../helper";

const initData = {
  userGroupName: "",
  userGroupCode: "",
  userName: "",
};

const validationSchema = Yup.object({
  userGroupName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("User group name is required"),
  userGroupCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("User group code is required"),
  userName: Yup.object().shape({
    label: Yup.string().required("User name is required"),
    value: Yup.string().required("User name is required"),
  }),
});

const AddEditFormComponent = ({
  show,
  onHide,
  size,
  backdrop,
  classes,
  isVisibleHeading = true,
  fullscreen,
  title,
  setRowDto,
  id,
  singleData,
  setSingleData,
  tableData,
  setTableData,
  setId,
  getData,
  pages,
}) => {
  const [loading, setLoading] = useState(false);
  const [deleteRowData, setDeleteRowData] = useState([]);

  const { orgId, employeeId, buId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/Auth/GetUserList?businessUnitId=${buId}&workplaceGroupId=${wgId}&workplaceId=${wId}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  const setter = (payload) => {
    if (isUniq("intEmployeeId", payload?.intEmployeeId, tableData)) {
      setTableData([...tableData, payload]);
    }
  };

  const remover = (payload) => {
    const filterArr = tableData.filter((itm) => itm.intEmployeeId !== payload);
    setTableData(filterArr);
  };

  const deleteRow = (payload) => {
    let deleteRow = [];
    if (payload > 0) {
      const filterArr = tableData.filter(
        (itm) => itm.intEmployeeId === payload
      );
      deleteRow.push(filterArr[0]);
    }

    setDeleteRowData([...deleteRow, ...deleteRowData]);
  };

  const saveHandler = (values, cb) => {
    const userList = tableData?.map((itm) => {
      return {
        intUserGroupRowId: itm?.intUserGroupRowId || 0,
        intUserGroupHeaderId: itm?.intUserGroupHeaderId || 0,
        intEmployeeId: itm?.intEmployeeId,
        strEmployeeName: itm?.strEmployeeName,
        isCreate: true,
        isDelete: false,
      };
    });

    const deleteList = deleteRowData?.map((itm) => {
      return {
        intUserGroupRowId: itm?.intUserGroupRowId || 0,
        intUserGroupHeaderId: itm?.intUserGroupHeaderId || 0,
        intEmployeeId: itm?.intEmployeeId,
        strEmployeeName: itm?.strEmployeeName,
        isCreate: false,
        isDelete: true,
      };
    });

    const editList = [];

    userList.map((itm) => {
      if (itm?.intUserGroupRowId <= 0) {
        editList.push(itm);
      }
    });

    const payload = {
      isActive: true,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: id ? employeeId : 0,
      intUserGroupHeaderId: id ? id : 0,
      strUserGroup: values?.userGroupName,
      strCode: values?.userGroupCode,
      strRemarks: "",
      intAccountId: orgId,
      userGroupRowViewModelList: id ? [...deleteList, ...editList] : userList,
    };

    const callback = () => {
      cb();
      setDeleteRowData([]);
      onHide();
      getData(pages);
      setTableData([]);
    };

    createRoleGroup(payload, setLoading, callback);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={id ? singleData : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setId("");
            setSingleData("");
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
            <div className="viewModal">
              <Modal
                show={show}
                onHide={onHide}
                size={size}
                backdrop={backdrop}
                aria-labelledby="example-modal-sizes-title-xl"
                className={classes}
                fullscreen={fullscreen && fullscreen}
              >
                <Form>
                  {isVisibleHeading && (
                    <Modal.Header className="bg-custom">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <Modal.Title className="text-center">
                          {title}
                        </Modal.Title>
                        <div>
                          <IconButton
                            onClick={() => {
                              onHide();
                              resetForm(initData);
                              setTableData([]);
                            }}
                          >
                            <Close />
                          </IconButton>
                        </div>
                      </div>
                    </Modal.Header>
                  )}

                  <Modal.Body
                    id="example-modal-sizes-title-xl"
                    className="userGroupModal"
                  >
                    <div
                      className="modalBody pt-0"
                      style={{ padding: "8px 15px" }}
                    >
                      <div className="row">
                        <div className="col-6">
                          <label>User Group Name</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.userGroupName}
                            name="userGroupName"
                            type="text"
                            className="form-control"
                            placeholder=""
                            onChange={(e) => {
                              setFieldValue("userGroupName", e.target.value);
                            }}
                            disabled={id}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-6">
                          <label>User Group Code</label>
                          <FormikInput
                            classes="input-sm"
                            value={values?.userGroupCode}
                            name="userGroupCode"
                            type="text"
                            className="form-control"
                            placeholder=""
                            onChange={(e) => {
                              setFieldValue("userGroupCode", e.target.value);
                            }}
                            disabled={id}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-6">
                          <label>User Name</label>
                          <AsyncFormikSelect
                            selectedValue={values?.userName}
                            isSearchIcon={true}
                            handleChange={(valueOption) => {
                              setFieldValue("userName", valueOption);
                            }}
                            loadOptions={loadUserList}
                            placeholder=""
                          />
                        </div>
                        <div className="col-4 d-flex align-items-end mb-1 ml-1 row">
                          <button
                            type="button"
                            className="btn btn-green btn-green-disable"
                            onClick={() => {
                              const obj = {
                                intEmployeeId: values?.userName?.value,
                                strEmployeeName: values?.userName?.label,
                              };
                              setter(obj);
                            }}
                            disabled={
                              !values?.userGroupName ||
                              !values?.userGroupCode ||
                              !values?.userName
                            }
                          >
                            Add
                          </button>
                        </div>
                        <div className="table-card-body  pt-3">
                          <div
                            className=" table-card-styled tableOne"
                            style={{ padding: "0px 12px" }}
                          >
                            <table className="table align-middle">
                              <thead style={{ color: "#212529" }}>
                                <tr>
                                  <th>
                                    <div className="d-flex align-items-center">
                                      User name
                                    </div>
                                  </th>
                                  <th>
                                    <div className="d-flex align-items-center justify-content-end">
                                      Action
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {tableData?.length > 0 && (
                                  <>
                                    {tableData.map((item, index) => {
                                      const { strEmployeeName } = item;
                                      return (
                                        <tr key={index}>
                                          <td>{strEmployeeName}</td>
                                          <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                              <IconButton
                                                type="button"
                                                style={{
                                                  height: "25px",
                                                  width: "25px",
                                                }}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  remover(item?.intEmployeeId);
                                                  deleteRow(
                                                    item?.intEmployeeId
                                                  );
                                                }}
                                              >
                                                <Tooltip title="Delete">
                                                  <DeleteOutline
                                                    sx={{
                                                      height: "25px",
                                                      width: "25px",
                                                    }}
                                                  />
                                                </Tooltip>
                                              </IconButton>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <button
                      type="button"
                      className="btn btn-cancel"
                      sx={{
                        marginRight: "10px",
                      }}
                      onClick={() => {
                        onHide();
                        resetForm(initData);
                        setTableData([]);
                        setId("");
                        setSingleData("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-green btn-green-disable"
                      type="submit"
                      onSubmit={() => handleSubmit()}
                    >
                      Save
                    </button>
                  </Modal.Footer>
                </Form>
              </Modal>
            </div>
          </>
        )}
      </Formik>
    </>
  );
};

export default AddEditFormComponent;
