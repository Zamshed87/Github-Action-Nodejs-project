/* eslint-disable react-hooks/exhaustive-deps */
import {
  AddOutlined,
  AttachmentOutlined,
  FileUpload,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import {
  attachment_delete_action,
  multiple_attachment_actions,
} from "../../../common/api";
import BackButton from "../../../common/BackButton";
import FormikInput from "../../../common/FormikInput";
import FormikSelect from "../../../common/FormikSelect";
import FormikTextArea from "../../../common/FormikTextArea";
import Loading from "../../../common/loading/Loading";
import ViewModal from "../../../common/ViewModal";
import { getDownlloadFileView_Action } from "../../../commonRedux/auth/actions";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { customStyles } from "../../../utility/selectCustomStyle";
import AddExpenseType from "./components/AddExpenseType";
import CloseIcon from "@mui/icons-material/Close";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../utility/customHooks/useAxiosPost";
import { todayDate } from "../../../utility/todayDate";
import { dateFormatterForInput } from "../../../utility/dateFormatter";

const initData = {
  date: todayDate(),
  expenseAmount: "",
  expenseType: "",
  reason: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.date().required("Date is required"),
  expenseAmount: Yup.number()
    .min(1, "Expense amount must be greater than zero")
    .required("Expense amount is required"),
  expenseType: Yup.object().shape({
    label: Yup.string().required("Expense type is required"),
    value: Yup.string().required("Expense type is required"),
  }),
});

const SelfExpanseApplicationAddForm = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  //  Expense type DDL
  const [expenseTypeDDL, getExpenseType, , setExpenseTypeDDL] = useAxiosGet([]);
  const [, getExpenseDetail, expenseDetailsLoading] = useAxiosGet([]);
  const [, saveExpenseType, expenseLoading] = useAxiosPost({});

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState("");
  const [show, setShow] = useState(false);
  const [editImageRow, setEditImageRow] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [imgRow, setImgRow] = useState([]);
  const inputFile = useRef(null);
  const onButtonClick = () => {
    inputFile.current.click();
  };

  const deleteImageHandler = (id) => {
    attachment_delete_action(id, () => {
      getData();
    });
  };

  const saveHandler = (values, cb) => {
    const modifyImageArray = imageFile
      ? imageFile.map((image) => {
          return {
            intDocURLId: image?.globalFileUrlId,
          };
        })
      : [];

    const payload = {
      intExpenseId: params?.id ? params?.id : 0,
      intAccontId: orgId,
      intEmployeeId: employeeId,
      intExpenseTypeId: values?.expenseType?.value,
      strEntryType: params?.id ? "Update" : "Create",
      dteExpenseDate: values?.date,
      strDiscription: values?.reason,
      numExpenseAmount: +values?.expenseAmount,
      isActive: true,
      intCreatedBy: employeeId,
      dteCreatedBy: todayDate(),
      urlIdViewModelList: modifyImageArray,
    };

    saveExpenseType(
      `/Employee/ExpenseApplicationCreateEdit`,
      payload,
      cb,
      true
    );
  };

  const getExpenseTypeDDL = (orgId) => {
    getExpenseType(
      `/SaasMasterData/GetAllEmpExpenseType?IntAccountId=${orgId}`,
      (data) => {
        const modifyData =
          data?.length > 0 &&
          data.map((item) => ({
            ...item,
            value: item?.intExpenseTypeId,
            label: item?.strExpenseType,
          }));
        setExpenseTypeDDL(modifyData.filter((item) => item.isActive));
      }
    );
  };

  const getData = () => {
    params?.id &&
      getExpenseDetail(
        `/Employee/ExpenseApplicationLanding?strPartName=ExpenseById&intAccountId=${orgId}&intBusinessUnitId=${buId}&intExpenseId=${params?.id}`,
        (data) => {
          setSingleData([...data]);
        }
      );
    params?.id &&
      getExpenseDetail(
        `/Employee/ExpenseApplicationLanding?strPartName=ExpenseDocList&intAccountId=${orgId}&intBusinessUnitId=${buId}&intExpenseId=${params?.id}`,
        (data) => {
          setImgRow([...data]);
          setEditImageRow([...data]);
        }
      );
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    params?.id &&
      getExpenseDetail(
        `/Employee/ExpenseApplicationLanding?strPartName=ExpenseById&intAccountId=${orgId}&intBusinessUnitId=${buId}&intExpenseId=${params?.id}`,
        (data) => {
          setSingleData([...data]);
        }
      );
    params?.id &&
      getExpenseDetail(
        `/Employee/ExpenseApplicationLanding?strPartName=ExpenseDocList&intAccountId=${orgId}&intBusinessUnitId=${buId}&intExpenseId=${params?.id}`,
        (data) => {
          setImgRow([...data]);
          setEditImageRow([...data]);
        }
      );
  }, [orgId, buId, params?.id]);

  useEffect(() => {
    getExpenseType(
      `/SaasMasterData/GetAllEmpExpenseType?IntAccountId=${orgId}`,
      (data) => {
        const modifyData =
          data?.length > 0 &&
          data.map((item) => ({
            ...item,
            value: item?.intExpenseTypeId,
            label: item?.strExpenseType,
          }));
        setExpenseTypeDDL(modifyData.filter((item) => item.isActive));
      }
    );
  }, [orgId]);

  useEffect(() => {
    if (params?.id && imgRow?.length) {
      const modifyImageArray = imgRow.map((image) => {
        return {
          globalFileUrlId: image?.intDocURLId,
        };
      });
      setEditImageRow(modifyImageArray);
    }
  }, [imgRow, params?.id]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={
          params?.id
            ? {
                date: dateFormatterForInput(singleData[0]?.dteExpenseDate),
                expenseAmount: singleData[0]?.numExpenseAmount,
                expenseType: {
                  value: singleData[0]?.intExpenseTypeId,
                  label: singleData[0]?.strExpenseType,
                },
                reason: singleData[0]?.strDiscription,
              }
            : {
                ...initData,
              }
        }
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (params?.id) {
              getData();
              resetForm({
                date: dateFormatterForInput(singleData[0]?.dteExpenseDate),
                expenseAmount: singleData[0]?.numExpenseAmount,
                expenseType: {
                  value: singleData[0]?.intExpenseTypeId,
                  label: singleData[0]?.strExpenseType,
                },
                reason: singleData[0]?.strDiscription,
              });
              setImageFile("");
            } else {
              setSubmitting(false);
              setImageFile("");
              resetForm();
            }
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
            <Form onSubmit={handleSubmit}>
              {(loading || expenseLoading || expenseDetailsLoading) && (
                <Loading />
              )}
              <div className="table-card">
                <div className="table-card-heading mb12">
                  <div className="d-flex align-items-center">
                    <BackButton />
                    <h2>
                      {params?.id
                        ? `Edit Expense Application`
                        : `Create Expense Application`}
                    </h2>
                  </div>
                  <ul className="d-flex flex-wrap">
                    <li>
                      <button
                        type="button"
                        className="btn btn-cancel mr-2"
                        onClick={() => {
                          resetForm(initData);
                          setImageFile("");
                        }}
                      >
                        Reset
                      </button>
                    </li>
                    <li>
                      <button
                        type="submit"
                        className="btn btn-default flex-center"
                      >
                        Save
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="card-style">
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Date</label>
                        <FormikInput
                          placeholder=" "
                          classes="input-sm"
                          name="date"
                          value={values?.date}
                          type="date"
                          onChange={(e) => {
                            setFieldValue("date", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Expense Amount</label>
                        <FormikInput
                          placeholder=""
                          classes="input-sm"
                          name="expenseAmount"
                          value={values?.expenseAmount}
                          type="number"
                          onChange={(e) => {
                            setFieldValue("expenseAmount", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <label>Expense Type</label>
                      <div className="policy-category-ddl-wrapper">
                        <FormikSelect
                          placeholder=" "
                          classes="input-sm"
                          styles={customStyles}
                          name="expenseType"
                          options={expenseTypeDDL || []}
                          value={values?.expenseType}
                          onChange={(valueOption) => {
                            setFieldValue("expenseType", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                        <div className="category-add">
                          <button
                            type="button"
                            className="btn add-ddl-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShow(true);
                            }}
                          >
                            <AddOutlined sx={{ fontSize: "16px" }} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-9">
                      <label>Reason</label>
                      <FormikTextArea
                        classes="textarea-with-label"
                        value={values?.reason}
                        name="reason"
                        type="text"
                        placeholder=" "
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <p
                    onClick={onButtonClick}
                    className="d-inline-block mt-2 pointer uplaod-para"
                  >
                    <input
                      onChange={(e) => {
                        if (e.target.files) {
                          multiple_attachment_actions(
                            orgId,
                            "Expense",
                            33,
                            buId,
                            employeeId,
                            e.target.files,
                            setLoading
                          )
                            .then((data) => {
                              setImageFile(data);
                            })
                            .catch((error) => {
                              setImageFile("");
                            });
                        }
                      }}
                      type="file"
                      id="file"
                      accept="image/png, image/jpeg, image/jpg, .pdf"
                      ref={inputFile}
                      style={{ display: "none" }}
                      multiple
                    />
                    <span style={{ fontSize: "14px" }}>
                      <FileUpload
                        sx={{
                          marginRight: "5px",
                          fontSize: "18px",
                        }}
                      />{" "}
                      Upload files
                    </span>
                  </p>
                  {imageFile?.length
                    ? imageFile.map((image, i) => (
                        <div
                          key={i}
                          className="d-flex align-items-center"
                          style={{ width: "160px" }}
                          onClick={() => {
                            dispatch(
                              getDownlloadFileView_Action(
                                image?.globalFileUrlId || image?.intDocURLId
                              )
                            );
                          }}
                        >
                          <AttachmentOutlined
                            sx={{ marginRight: "5px", color: "#0072E5" }}
                          />
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: "500",
                              color: "#0072E5",
                              cursor: "pointer",
                            }}
                          >
                            {image?.fileName ||
                              `Attachment_${
                                i <= 8 ? `0${i + 1}` : `${i + 1}`
                              }`}{" "}
                          </div>
                        </div>
                      ))
                    : ""}
                  {editImageRow?.length
                    ? editImageRow.map((image, i) => (
                        <div
                          key={i}
                          className="d-flex align-items-center"
                          style={{ width: "160px" }}
                          onClick={() => {
                            dispatch(
                              getDownlloadFileView_Action(
                                image?.globalFileUrlId || image?.intDocURLId
                              )
                            );
                          }}
                        >
                          <AttachmentOutlined
                            sx={{ marginRight: "5px", color: "#0072E5" }}
                          />
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: "500",
                              color: "#0072E5",
                              cursor: "pointer",
                            }}
                          >
                            {image?.fileName ||
                              `Attachment_${
                                i <= 8 ? `0${i + 1}` : `${i + 1}`
                              }`}{" "}
                            {editImageRow?.length && (
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteImageHandler(image?.globalFileUrlId);
                                }}
                                size="small"
                                style={{
                                  fontSize: "18px",
                                  padding: "0px 5px",
                                  color: "#175CD3",
                                }}
                              >
                                <CloseIcon fontSize="inherit"> </CloseIcon>
                              </IconButton>
                            )}
                          </div>
                        </div>
                      ))
                    : ""}
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>

      <ViewModal
        size="lg"
        title="Create Expense Type"
        backdrop="static"
        classes="default-modal preview-modal"
        show={show}
        onHide={() => setShow(false)}
      >
        <AddExpenseType
          setShow={setShow}
          getExpenseTypeDDL={getExpenseTypeDDL}
        />
      </ViewModal>
    </>
  );
};

export default SelfExpanseApplicationAddForm;
