import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { initialValues, viewHandler } from "./helper";
import PrimaryButton from "common/PrimaryButton";
import { toast } from "react-toastify";
import AsyncFormikSelect from "common/AsyncFormikSelect";
import {
  PeopleDeskSaasDDL,
  attachment_action,
  getSearchEmployeeList,
} from "common/api";
import DefaultInput from "common/DefaultInput";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
import "./pfloan.css";
import {
  AttachmentOutlined,
  FileUpload,
  VisibilityOutlined,
} from "@mui/icons-material";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import moment from "moment";
import Loading from "common/loading/Loading";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import BackButton from "common/BackButton";
import PfLoanTable from "./components/pfLoanTable";
import { useHistory, useParams } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { useApiRequest } from "Hooks";

const PfLoanAddEdit = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Loan Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "PF Loan";
    return () => {
      document.title = "PeopleDesk";
    };
  }, []);

  const { buId, wgId, wId, intAccountId, employeeId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  const history = useHistory();
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30620) {
      permission = item;
    }
  });
  const pfInfoApi = useApiRequest({});

  const [generatedData, setGeneratedData] = useState([]);
  const [loanTypeDDL, setLoanTypeDDL] = useState([]);
  const [fileId, setFileId] = useState("");
  const [loading, setLoading] = useState(false);
  const inputFile = useRef(null);
  const [, saveData, dataLoading] = useAxiosPost({});
  const [loanByIdDto, getLoanById, loanByIdLoading] = useAxiosGet([]);
  const onButtonClick = () => {
    inputFile.current.click();
  };

  useEffect(() => {
    PeopleDeskSaasDDL(
      "PFLoanIdbyWorkplace",
      wgId,
      buId,
      setLoanTypeDDL,
      "value",
      "label",
      0,
      wId
    );
    if (id) {
      getLoanById(
        `/PfLoan/GetById?BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&LoanHeaderId=${id}
      `,
        (data) => {
          setFileId(data?.objHeader?.intFileUrlId);
          // getEmployeePfAmount(data?.objHeader);
        }
      );
    }
  }, [wgId, buId]);

  const { values, setFieldValue, errors, touched, handleSubmit, resetForm } =
    useFormik({
      enableReinitialize: true,
      initialValues: loanByIdDto?.objHeader
        ? {
            employee: {
              label: loanByIdDto?.objHeader?.strEmployeeName,
              value: loanByIdDto?.objHeader?.intEmployeeId,
            },
            loanType: {
              label: loanByIdDto?.objHeader?.strLoanType,
              value: loanByIdDto?.objHeader?.intLoanTypeId,
            },
            loanId: loanByIdDto?.objHeader?.strLoanId,
            loanAmount: loanByIdDto?.objHeader?.numLoanAmount,
            interest: loanByIdDto?.objHeader?.numInterest,
            installmentNum: loanByIdDto?.objHeader?.intNumberOfInstallment,
            effeciveDate: moment(
              loanByIdDto?.objHeader?.dteEffectiveDate
            ).format("YYYY-MM-DD"),
            description: loanByIdDto?.objHeader?.strDescription,
          }
        : {
            ...initialValues,
            loanType:
              loanTypeDDL && loanTypeDDL.length > 0 ? loanTypeDDL[0] : null,
          },
      onSubmit: (values) => {
        viewHandler(values, setGeneratedData);
      },
    });

  const getEmployeePfAmount = (valueOption) => {
    pfInfoApi.action({
      urlKey: "GetEmployeePfAmount",
      method: "GET",
      params: {
        employeeId: !id ? valueOption?.value : valueOption?.intEmployeeId,
        AccountId: orgId,
      },
      onSuccess: (res) => {
        if (orgId === 14) {
          setFieldValue("loanAmount", res?.data?.employeeContribution * 0.7);
          return;
        }
        if (
          orgId === 15 &&
          ((!id && valueOption?.employmentType === "Permanent") ||
            (id && valueOption?.strEmploymentType === "Permanent"))
        ) {
          setFieldValue("loanAmount", res?.data?.totalPfAmount * 0.85 || 0);
        } else {
          setFieldValue("employee", "");
          setFieldValue("loanAmount", 0);
          return toast.warning("Employee is not eligible for PF Loan");
        }
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message);
      },
    });
  };

  const saveHandler = (values) => {
    viewHandler(values, setGeneratedData);
    const rowData = generatedData?.map((dto) => {
      return {
        intRowId: 0,
        IntPfLoanHeaderId: id ? id : 0,
        intSerialNumber: dto?.sl,
        intMonthId: parseInt(moment(dto?.month).format("MM")),
        intYearId: parseInt(moment(dto?.month).format("YYYY")),
        numPrincipalBeginingOfMonth: parseFloat(
          (dto?.beginningBalance).toFixed(2)
        ),
        numInterest: parseFloat((dto?.interest).toFixed(2)),
        numPrincipal: parseFloat((dto?.principal).toFixed(2)),
        numInstallment: parseFloat((dto?.installment).toFixed(2)),
        numPrincipalEndOfMonth: parseFloat((dto?.endingBalance).toFixed(2)),
      };
    });

    const payload = {
      objHeader: {
        intEmployeeLoanHeaderId: id ? id : 0,
        intAccountId: intAccountId,
        intBusinessUnitId: buId,
        intWorkplaceGroupId: wgId,
        intEmployeeId: values?.employee?.value,
        strLoanId: values?.loanId,
        intLoanTypeId: values?.loanType?.value,
        numLoanAmount: +values?.loanAmount,
        numInterest: +values?.interest,
        intNumberOfInstallment: +values?.installmentNum,
        dteEffectiveDate: values?.effeciveDate,
        strDescription: values?.description,
        intFileUrlId: fileId?.globalFileUrlId || 0,
        intCreatedBy: employeeId,
        intUpdatedBy: employeeId,
        numTotalInterest: parseFloat(
          generatedData.reduce((sum, item) => sum + item.interest, 0).toFixed(2)
        ),
        numTotalPrincipal: parseFloat(
          generatedData
            .reduce((sum, item) => sum + item.principal, 0)
            .toFixed(2)
        ),
        numTotalInstallment: parseFloat(
          generatedData
            .reduce((sum, item) => sum + item.installment, 0)
            .toFixed(2)
        ),
        intPipelineHeaderId: 0,
        intCurrentStage: 0,
        intNextStage: 0,
        strStatus: "",
        isPipelineClosed: true,
        isReject: true,
      },
      objRow: rowData,
    };
    const cb = (res) => {
      if (res?.statusCode > 299) {
        return toast.error(res?.message);
      } else {
        resetForm();
        setFileId("");
        setGeneratedData([]);
        id && history.push("/profile/pfLoan");
        toast.success(res?.message || "Submitted Successfully");
      }
    };
    saveData("/PfLoan/Create", payload, cb, false);
  };
  useEffect(() => {
    if (values?.loanId && id) {
      viewHandler(values, setGeneratedData);
    }
  }, [values?.loanId]);

  return (
    <form onSubmit={handleSubmit}>
      {(loading || dataLoading || loanByIdLoading) && <Loading />}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <div>
            <BackButton title={"PF Loan Generate"} />{" "}
          </div>
          <div className="table-card-head-right">
            <PrimaryButton
              type="button"
              className="btn btn-green flex-center"
              label={"Save"}
              disabled={generatedData?.length > 0 ? false : true}
              onClick={() => {
                if (!permission?.isCreate)
                  return toast.warn("You don't have permission");

                saveHandler(values);
              }}
            />
          </div>
        </div>
        <div className="card-style pb-0 mb-2">
          <div className="row">
            <div className="input-field-main col-lg-3">
              <label>Employee</label>
              <AsyncFormikSelect
                selectedValue={values?.employee}
                isSearchIcon={true}
                handleChange={(valueOption) => {
                  setFieldValue("employee", valueOption);
                  [14, 15].includes(orgId) &&
                    valueOption?.value &&
                    getEmployeePfAmount(valueOption);
                }}
                placeholder="Search (min 3 letter)"
                loadOptions={(v) => getSearchEmployeeList(buId, wgId, v, 4)}
                isDisabled={id && true}
              />
            </div>
            <div className="col-lg-3">
              <div className="input-field-main">
                <label>Loan ID</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.loanId}
                  placeholder="Loan ID"
                  name="loanId"
                  type="text"
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue("loanId", e.target.value);
                  }}
                  isDisabled={id && true}
                />
              </div>
            </div>
            <div className="col-lg-3">
              <div className="input-field-main">
                <label>Loan Type</label>
                <FormikSelect
                  name="loanType"
                  options={loanTypeDDL}
                  value={values?.loanType}
                  onChange={(valueOption) => {
                    setFieldValue("loanType", valueOption);
                  }}
                  placeholder=""
                  styles={customStyles}
                  errors={errors}
                  touched={touched}
                  isDisabled={id && true}
                />
              </div>
            </div>
            <div className="col-lg-3">
              <div className="input-field-main">
                <label>
                  Loan Amount{" "}
                  {[14, 15].includes(orgId) ? (
                    <span>
                      <b>Pf Own:</b>
                      {(loanByIdDto?.objHeader
                        ? loanByIdDto?.objHeader?.ownPFAmount
                        : pfInfoApi?.data?.data?.employeeContribution) ||
                        0}{" "}
                      <b>Pf Total:</b>
                      {(loanByIdDto?.objHeader
                        ? loanByIdDto?.objHeader?.totalPFAmount
                        : pfInfoApi?.data?.data?.totalPfAmount) || 0}
                    </span>
                  ) : (
                    ""
                  )}
                </label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.loanAmount}
                  placeholder="Loan Amount"
                  name="loanAmount"
                  type="number"
                  step="any"
                  min={0}
                  className="form-control"
                  onChange={(e) => {
                    const ownPFAmount = loanByIdDto?.objHeader
                      ? loanByIdDto?.objHeader?.ownPFAmount
                      : pfInfoApi?.data?.data?.employeeContribution;
                    const totalPfAmount = loanByIdDto?.objHeader
                      ? loanByIdDto?.objHeader?.totalPFAmount
                      : pfInfoApi?.data?.data?.totalPfAmount;

                    if (orgId === 14 && e.target.value > ownPFAmount * 0.7) {
                      return toast.warning(
                        "Loan amount should be less than 70% of Own PF amount"
                      );
                    }
                    // off by sabbir bhai
                    // if (orgId === 15 && e.target.value > totalPfAmount * 0.85) {
                    //   return toast.warning(
                    //     "Loan amount should be less than 85% of total PF amount"
                    //   );
                    // }
                    setFieldValue("loanAmount", e.target.value);
                    setGeneratedData([]);
                  }}
                  onKeyDown={(event) => {
                    ["e", "E", "+", "-"].includes(event.key) &&
                      event.preventDefault();
                  }}
                />
              </div>
            </div>
            <div className="col-lg-3">
              <div className="input-field-main">
                <label>Interest(%)</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.interest}
                  placeholder="Interest(%)"
                  name="interest"
                  type="number"
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue("interest", e.target.value);
                    setGeneratedData([]);
                  }}
                  onKeyDown={(event) => {
                    ["e", "E", "+", "-"].includes(event.key) &&
                      event.preventDefault();
                  }}
                />
              </div>
            </div>
            <div className="col-lg-3">
              <div className="input-field-main">
                <label>Installment Number</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.installmentNum}
                  placeholder="Installment Number"
                  name="installmentNum"
                  type="number"
                  className="form-control"
                  onChange={(e) => {
                    if (+e.target.value <= 60) {
                      setFieldValue("installmentNum", e.target.value);
                      setGeneratedData([]);
                    } else {
                      return toast.warning("Maximum installment will be 60");
                    }
                  }}
                  onKeyDown={(event) => {
                    ["e", "E", "+", "-"].includes(event.key) &&
                      event.preventDefault();
                  }}
                />
              </div>
            </div>
            <div className="col-lg-3">
              <div className="input-field-main">
                <label>Effective Date</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.effeciveDate}
                  placeholder="Month"
                  name="effeciveDate"
                  type="date"
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue("effeciveDate", e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-lg-3">
              <div className="input-field-main">
                <label>Description</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.description}
                  placeholder="Description"
                  name="description"
                  type="text"
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue("description", e.target.value);
                  }}
                />
              </div>
            </div>
            {id && (
              <div className="col-3">
                <div className="input-main position-group-select">
                  {fileId ? (
                    <>
                      <label className="lebel-bold mr-2">Upload File</label>
                      <VisibilityOutlined
                        sx={{
                          color: "rgba(0, 0, 0, 0.6)",
                          fontSize: "16px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(
                              fileId?.globalFileUrlId || fileId
                            )
                          );
                        }}
                      />
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  onClick={onButtonClick}
                  style={{ cursor: "pointer" }}
                  // style={{ cursor: "pointer", position: "relative" }}
                >
                  <input
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        attachment_action(
                          orgId,
                          "LoanType",
                          14,
                          buId,
                          values?.employee?.value || employeeId,
                          e.target.files,
                          setLoading
                        )
                          .then((data) => {
                            setFileId(data?.[0]);
                          })
                          .catch(() => {
                            setFileId("");
                          });
                      }
                    }}
                    type="file"
                    id="file"
                    ref={inputFile}
                    style={{ display: "none" }}
                  />
                  <div style={{ fontSize: "14px" }}>
                    {!fileId ? (
                      <>
                        <FileUpload
                          sx={{
                            marginRight: "5px",
                            fontSize: "18px",
                          }}
                        />{" "}
                        Click to upload
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                  {fileId ? (
                    <div
                      className="d-flex align-items-center"
                      onClick={() => {
                        // dispatch(getDownlloadFileView_Action(imageFile?.globalFileUrlId));
                      }}
                    >
                      <AttachmentOutlined
                        sx={{
                          marginRight: "5px",
                          color: "#0072E5",
                        }}
                      />
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                          color: "#0072E5",
                          cursor: "pointer",
                        }}
                      >
                        {fileId?.fileName || "Attachment"}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}

            <div style={{ marginTop: 0 }} className="col-lg-3">
              <button
                className="btn btn-green btn-green-disable mb-2"
                type="submit"
                disabled={
                  !values?.employee?.value ||
                  !values?.loanType?.value ||
                  !values?.loanId ||
                  !values?.loanAmount ||
                  !values?.interest ||
                  !values?.installmentNum ||
                  !values?.effeciveDate
                    ? true
                    : false
                }
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="pfLoan">
        {generatedData?.length > 0 && (
          <PfLoanTable generatedData={generatedData} />
        )}
      </div>
    </form>
  );
};

export default PfLoanAddEdit;
