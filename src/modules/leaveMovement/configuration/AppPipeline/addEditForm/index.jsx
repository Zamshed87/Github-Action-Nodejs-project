/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import {
  Close,
  RadioButtonUnchecked,
  RadioButtonChecked,
  AddSharp,
  DeleteOutlined,
} from "@mui/icons-material";
import Loading from "../../../../../common/loading/Loading";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import FormikSelect from "../../../../../common/FormikSelect";
import { getPeopleDeskAllDDL } from "../../../../../common/api";
import { toast } from "react-toastify";
import { saveApprovalPipeline } from "../helper";

const initData = {
  leaveType: "",
  approver: "",
  userGroup: "",
};
const validationSchema = Yup.object().shape({});

export default function AddEditFormComponent({
  id,
  show,
  onHide,
  size,
  backdrop,
  classes,
  isVisibleHeading = true,
  fullscreen,
  title,
  getData
}) {
  const [loading, setLoading] = useState(false);
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );

  const [leaveTypeDDL, setLeaveTypeDDL] = useState([]);
  const [userGroupDDL, setUserGroupDDL] = useState([]);
  const [modifySingleData, setModifySingleData] = useState("");
  const [rowDto, setRowDto] = useState([]);

  const { userId, orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [tabClickLeave, setTabClickLeave] = useState(true);
  const [tabClickMovement, setTabClickMovement] = useState(false);

  const addHandler = (values) => {
    if (!values?.approver?.label) return toast.warn("Please select approver");

    if (tabClickLeave && !values?.leaveType?.label)
      return toast.warn("Please select leave type");

    if (
      values?.approver?.label?.toLowerCase() === "user group" &&
      !values?.userGroup?.label
    )
      return toast.warn("Please select user group");

    const leaveTypeIndex = rowDto.findIndex(
      (item) =>
        item?.leaveMovementTypeName === (values?.leaveType?.label || "Movement")
    );

    const data = [...rowDto];
    const flowListPayload = {
      sequenceId:
        rowDto?.[leaveTypeIndex]?.flowList?.length > 0
          ? rowDto?.[leaveTypeIndex]?.flowList?.length + 1
          : 1,
      sequenceName: values?.approver?.label,
      userGroupId: values?.userGroup?.value || 0,
      userGroupName: values?.userGroup?.label || "",
    };

    const payload = {
      isLeave: values?.leaveType?.label ? true : false,
      leaveMovementTypeId: values?.leaveType?.value || 0,
      leaveMovementTypeName: values?.leaveType?.label || "Movement",
      flowList: [flowListPayload],
      insertUserId: userId,
    };

    if (leaveTypeIndex >= 0) {
      if (data?.[leaveTypeIndex]?.flowList?.length === 3)
        return toast.warn("Max three for this type");
      const isExistFlowList = data?.[leaveTypeIndex]?.flowList?.filter(
        (item) => item?.sequenceName === flowListPayload?.sequenceName
      );
      if (isExistFlowList?.length > 0) return toast.warn("Already exists");
      data?.[leaveTypeIndex]?.flowList?.push(flowListPayload);
    } else if (!tabClickLeave && rowDto.length < 1) {
      data.push(payload);
    } else if (tabClickLeave) {
      data.push(payload);
    }

    setRowDto(data);
  };

  const deleteHandler = (index) => {
    const newData = rowDto.filter((item, ind) => ind !== index);
    setRowDto(newData);
  };

  const tabClickHandler = (setValues, values) => {
    setTabClickLeave(!tabClickLeave);
    setTabClickMovement(!tabClickMovement);
    setValues({
      ...values,
      leaveType: "",
      approver: "",
      userGroup: "",
    });
    setRowDto([]);
  };

  useEffect(() => {
    getPeopleDeskAllDDL(
      "LeaveType",
      orgId,
      buId,
      setLeaveTypeDDL,
      "LeaveTypeId",
      "LeaveType"
    );
    getPeopleDeskAllDDL(
      "UserGroup",
      orgId,
      buId,
      setUserGroupDDL,
      "UserGroupId",
      "UserGroupName"
    );
  }, [orgId, buId]);

  const saveHandler = (values, cb) => {
    if (rowDto.length < 1) return toast.warn("Please add row");
    saveApprovalPipeline(rowDto, cb, setLoading);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={id ? modifySingleData : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            getData()
            resetForm(initData);
            setRowDto([])
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
          setValues,
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
                      <div className="d-flex w-100 justify-content-between">
                        <Modal.Title className="text-center">
                          {title}
                        </Modal.Title>
                        <div>
                          <div
                            className="crossIcon"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              if (id) {
                                resetForm(modifySingleData);
                              } else {
                                resetForm(initData);
                              }
                              onHide();
                            }}
                          >
                            <Close />
                          </div>
                        </div>
                      </div>
                    </Modal.Header>
                  )}

                  <Modal.Body id="example-modal-sizes-title-xl">
                    <div className="pipeLineModal">
                      <div className="modalBody">
                        <div className="row">
                          <div className="col-md-5 d-flex justify-content-between">
                            <div
                              className="d-flex align-items-center tab-name "
                              onClick={() => {
                                tabClickHandler(setValues, values);
                              }}
                            >
                              {tabClickLeave ? (
                                <RadioButtonChecked sx={{ color: "#34A853" }} />
                              ) : (
                                <RadioButtonUnchecked />
                              )}

                              <span className="tab-title">Leave</span>
                            </div>
                            <div
                              className="d-flex align-items-center tab-name"
                              onClick={() => {
                                tabClickHandler(setValues, values);
                              }}
                            >
                              {tabClickMovement ? (
                                <RadioButtonChecked sx={{ color: "#34A853" }} />
                              ) : (
                                <RadioButtonUnchecked />
                              )}
                              <span className="tab-title">Movement</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          {tabClickLeave && (
                            <div className="">
                              <label>Leave Type</label>
                              <FormikSelect
                                name="leaveType"
                                options={leaveTypeDDL}
                                value={values?.leaveType}
                                onChange={(valueOption) => {
                                  setFieldValue("leaveType", valueOption);
                                }}
                                menuPosition="fixed"
                                placeholder=""
                                styles={customStyles}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          )}
                          <div className="">
                            <label>Approver</label>
                            <FormikSelect
                              name="approver"
                              options={[
                                { value: 1, label: supervisor || "Supervisor" },
                                { value: 2, label: "Line manager" },
                                { value: 3, label: "User group" },
                              ]}
                              value={values?.approver}
                              onChange={(valueOption) => {
                                setFieldValue("userGroup", "");
                                setFieldValue("approver", valueOption);
                              }}
                              placeholder=""
                              menuPosition="fixed"
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          {values?.approver?.label?.toLowerCase() ===
                            "user group" && (
                            <div className="">
                              <label>User Group</label>
                              <FormikSelect
                                name="userGroup"
                                options={userGroupDDL}
                                value={values?.userGroup}
                                onChange={(valueOption) => {
                                  setFieldValue("userGroup", valueOption);
                                }}
                                menuPosition="fixed"
                                placeholder=""
                                styles={customStyles}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          )}

                          <div>
                            <button
                              className="btn btn-green btn-green-less row align-items-center"
                              type="button"
                              onClick={(e) => {
                                addHandler(values);
                              }}
                            >
                              <AddSharp
                                sx={{
                                  fontSize: "16px",
                                  marginRight: "8px",
                                  width: "24px",
                                  height: "24px",
                                }}
                              />
                              ADD
                            </button>
                          </div>
                          <div className="mt-3">
                            {rowDto?.map((item, index) => (
                              <div
                                key={index}
                                className="row align-items-center"
                              >
                                <div className="col-md-3">
                                  <span>{item?.leaveMovementTypeName}</span>
                                </div>
                                <div className="col-md-8 modal-inside">
                                  <div className="pipeline-stepper">
                                    <ul className="stepper">
                                      {item?.flowList?.map((item, inx) => (
                                        <li
                                          key={inx}
                                          className="stepper__item mt-1"
                                        >
                                          <div>{item?.sequenceName}</div>
                                        </li>
                                      ))}

                                      {/* <li className="stepper__item">
                                        <div>Line Manager</div>
                                      </li>
                                      <li className="stepper__item">
                                        <div>HR Group</div>
                                      </li> */}
                                    </ul>
                                  </div>
                                </div>
                                <div className="col-md-1">
                                  <button
                                    // type="button"
                                    className=""
                                    style={{ border: "none" }}
                                    onClick={() => {
                                      deleteHandler(index);
                                    }}
                                  >
                                    <DeleteOutlined
                                      sx={{
                                        color: "rgba(0, 0, 0, 0.6)",
                                        backgroundColor: "#fff",
                                        borderTop: "0px solid red",
                                      }}
                                    />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="form-modal-footer">
                   
                      <button
                        type="button"
                        className="modal-btn modal-btn-cancel"
                        onClick={() => {
                          if (id) {
                            resetForm(modifySingleData);
                          } else {
                            resetForm(initData);
                          }
                          onHide();
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="modal-btn modal-btn-save"
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
}
