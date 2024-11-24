import { Form, Formik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import DefaultInput from "../../../../../common/DefaultInput";
import { getDailyTargetData } from "./helper";
import FormikTextArea from "../../../../../common/FormikTextArea";
import { getDownlloadFileView_Action } from "../../../../../commonRedux/auth/actions";
import { AttachmentOutlined, FileUpload } from "@mui/icons-material";
import { useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// import { erpBaseUrl } from "../../../../../common/ErpBaseUrl";
import Loading from "../../../../../common/loading/Loading";
const validationSchema = Yup.object().shape({});

export default function _Form({
  btnRef,
  resetBtnRef,
  initData,
  saveHandler,
  target,
  rowDto,
  rowDtoHandler,
  selectedBusinessUnit,
  enroll,
  getTarget,
  setRowDto,
  selectedYear,
  objective,
  kpi,
  setReport,
  setIsShowModal,
}) {
  const dispatch = useDispatch();

  const [clickedMonth, setClickedMonth] = useState("");
  const [dailyEntryRow, setDailyEntryRow] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [fileObjects, setFileObjects] = useState([]);

  // daily entry row handler
  // const dailyEntryHandler = (value, index) => {
  //   const xData = [...dailyEntryRow];
  //   xData[index].amount = value;
  //   setDailyEntryRow([...xData]);
  // };

  let date = new Date();
  let year = date.getFullYear();
  // image
  const inputFile = useRef(null);
  const onButtonClick = () => {
    inputFile.current.click();
  };
  const attachment_action = async (attachment, setLoading = false) => {
    setLoading && setLoading(true);
    let formData = new FormData();
    formData.append("files", attachment[0]);
    try {
      let { data } = await axios.post(`domain/Document/UploadFile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading && setLoading(false);
      toast.success("Upload  successfully");
      return data;
    } catch (error) {
      setLoading && setLoading(false);
      toast.error("File Size is too large or inValid File!");
      return error;
    }
  };

  //   const empAttachment_action = async (file, cb) => {
  //     try {
  //       let { data } = await axios.post(
  //         `${erpBaseUrl}/domain/Document/UploadFile`,
  //         file,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //       return data;
  //     } catch (error) {
  //       toast.error("Document not upload");
  //     }
  //   };
  const [loading, setLoading] = useState(false);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          setIsShowModal(false);
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
          <Form className="form form-label-right">
            <div className="row">
              <div className="col-lg">
                <p style={{ fontSize: "14px", marginTop: "5px" }}>
                  {" "}
                  <b>Objective</b> : {objective}{" "}
                </p>
                <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                  {" "}
                  <b>KPI</b> : {kpi}{" "}
                </p>
              </div>
            </div>
            <div className="mt-5">
              {target?.objRow?.length ? (
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th></th>

                      {target?.objRow &&
                        Object.values(target?.objRow)?.map((th, index) => {
                          return <th key={index}>{th?.monthName}</th>;
                        })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="align-middle">Target</td>
                      {target?.objRow &&
                        target?.objRow.map((itm, index) => (
                          <td
                            key={index}
                            className="disabled-feedback disable-border target-input"
                          >
                            <DefaultInput
                              value={itm?.target}
                              onClick={() => alert("H")}
                              name=""
                              type="number"
                              disabled={true}
                              min="0"
                              classes="input-sm"
                            />
                          </td>
                        ))}
                    </tr>
                    <tr>
                      <td className="align-middle">Actual</td>
                      {target?.objRow &&
                        target?.objRow.map((itm, index) => (
                          <td
                            key={index}
                            className="disabled-feedback disable-border str-achievement"
                            onClick={() => {
                              setClickedMonth(
                                Object.keys(target?.objRow)[index]
                              );
                            }}
                          >
                            <DefaultInput
                              value={rowDto[index]?.numAchivment}
                              placeholder={itm?.achivment}
                              type="number"
                              name="numAchivment"
                              step="any"
                              onClick={() => {
                                getDailyTargetData(
                                  target?.kpiid,
                                  target?.objRow[index]?.monthId,
                                  setDailyEntryRow
                                );
                              }}
                              onChange={(e) =>
                                rowDtoHandler(
                                  "numAchivment",
                                  e.target.value,
                                  index,
                                  itm.rowId
                                )
                              }
                              disabled={
                                itm?.isApproved === itm?.isReject ? false : true
                              }
                              classes="input-sm"
                            />
                          </td>
                        ))}
                    </tr>
                    <tr>
                      <td className="align-middle">Remarks</td>
                      {target?.objRow &&
                        target.objRow.map((itm, index) => (
                          <td
                            key={index}
                            className="disabled-feedback disable-border str-achievement"
                          >
                            <FormikTextArea
                              classes="textarea-with-label common-textarea"
                              value={rowDto[index]?.remarks}
                              name="reason"
                              type="text"
                              placeholder={itm?.remarks}
                              onChange={(e) => {
                                rowDtoHandler(
                                  "remarks",
                                  e.target.value,
                                  index,
                                  itm.rowId
                                );
                              }}
                              errors={errors}
                              touched={touched}
                              max={1000}
                            />
                          </td>
                        ))}
                    </tr>
                  </tbody>
                </table>
              ) : (
                <h3>No data found!</h3>
              )}
            </div>
            {/* Upload Attachment */}
            {clickedMonth >= 0 && clickedMonth !== "" && (
              <div className="mt-3">
                <span>
                  <b>
                    {target?.objRow?.[clickedMonth]?.monthName
                      ? `Month : ${target?.objRow?.[clickedMonth]?.monthName}`
                      : Object.values(target?.objHeader)[clickedMonth] ===
                        "Yearly"
                      ? "Year " + year
                      : Object.values(target?.objHeader)[clickedMonth] +
                        " Quarter"}
                  </b>{" "}
                </span>
                {/* {(target?.objRow?.[clickedMonth]?.documentString ||
                  rowDto[clickedMonth]?.documentString) && (
                  <IView
                    clickHandler={() => {
                    //   dispatch();
                      //   getDownlloadFileView_Action(
                      //     rowDto[clickedMonth]?.documentString ||
                      //       target?.objRow?.[clickedMonth]?.documentString
                      //   )
                    }}
                  />
                )} */}
                {target?.objRow?.[clickedMonth]?.documentString ||
                rowDto[clickedMonth]?.documentString ? (
                  <div
                    className="d-flex align-items-center"
                    onClick={() => {
                      dispatch(
                        // change 644 to rowDto[clickedMonth]?.documentString || target?.objRow?.[clickedMonth]?.documentString before launch
                        getDownlloadFileView_Action(644)
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
                      Attachment
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {!target?.objRow?.[clickedMonth]?.isApproved && (
                  <div
                    onClick={onButtonClick}
                    className="d-inline-block mt-2 pointer uplaod-para"
                  >
                    <input
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          attachment_action(e.target.files, setLoading)
                            .then((data) => {
                              rowDtoHandler(
                                "documentString",
                                data?.[0]?.id,
                                clickedMonth,
                                target?.objRow?.[clickedMonth]?.rowId
                              );
                            })
                            .catch((error) => {
                              setFileObjects([]);
                            });
                        }
                      }}
                      type="file"
                      id="file"
                      ref={inputFile}
                      style={{ display: "none" }}
                    />
                    <div style={{ fontSize: "14px" }}>
                      <FileUpload
                        sx={{ marginRight: "5px", fontSize: "18px" }}
                      />{" "}
                      Click to upload
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Daily Entry Field, if isDaily entry true, only then this will be visible */}
            {target?.objRow &&
              target?.objRow[0]?.isDailyEntry === true &&
              clickedMonth && (
                <div className="indKpiDailyEntry">
                  <div className="d-flex align-items-center mb-2">
                    <b className="text-capitalize">
                      Month Name : {clickedMonth}{" "}
                    </b>
                    <button
                      className="btn btn-primary btn-sm ml-2"
                      type="button"
                      onClick={() => {
                        //   saveDailyTargetRow(dailyEntryRow, getTarget);
                      }}
                    >
                      Save
                    </button>
                  </div>
                  <table style={{ width: "50%" }} className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount</th>
                      </tr>
                    </thead>

                    {!dailyEntryRow?.length > 0 ? (
                      <tbody>
                        {dailyEntryRow?.map((item, index) => (
                          <tr>
                            <td>{dateFormatter(item?.date)}</td>
                            <td>
                              {/* <IInput
                                  value={item?.amount}
                                  placeholder="Amount"
                                  type="number"
                                  name="amount"
                                  step="any"
                                  onChange={(e) =>
                                    dailyEntryHandler(e.target.value, index)
                                  }
                                /> */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      "...loading"
                    )}
                  </table>
                </div>
              )}

            <div className="modal-footer form-modal-footer">
              <button
                type="button"
                className="btn btn-cancel"
                style={{
                  marginRight: "15px",
                }}
                onClick={(e) => {
                  setIsShowModal(false);
                  // setShow(false);
                  // resetForm(initData);
                  // setFileId("");
                  // setSingleData(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-green btn-green-disable"
                style={{ width: "auto" }}
                type="submit"
              >
                Save
              </button>
            </div>

            {/* <button
              type="submit"
              style={{ display: "none" }}
              ref={btnRef}
              onSubmit={() => handleSubmit()}
            ></button>

            <button
              type="reset"
              style={{ display: "none" }}
              ref={resetBtnRef}
              onSubmit={() => resetForm(initData)}
            ></button> */}
          </Form>
        </>
      )}
    </Formik>
  );
}
