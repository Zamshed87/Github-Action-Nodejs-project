import { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Table } from "@material-ui/core";
import { useFormik } from "formik";
import { useEffect } from "react";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import Loading from "../../../../common/loading/Loading";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import "./growModel.css";
import GrowModelPdf from "./pdf";
import html2pdf from "html2pdf.js";
import {
  createGrowModel,
  getEmployeeProfileViewData,
  getGrowCoachingModelWorksheet,
} from "./helper";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { getFiscalYearForNowOnLoad } from "../../../../utility/getFiscalYearOnLoade";
import { quarterDDL } from "../../../../utility/quaterDDL";

const initialValues = {
  quarterDDLgroup: "",
  yearDDLgroup: "",
  goal: "",
  reality: "",
  obstacles: "",
  options: "",
  wayForward: "",
};
const validationSchema = Yup.object().shape({
  yearDDLgroup: Yup.object()
    .shape({
      value: Yup.string().required("Year is required"),
      label: Yup.string().required("Year is required"),
    })
    .typeError("Year is required"),

  quarterDDLgroup: Yup.object()
    .shape({
      value: Yup.string().required("Quarter is required"),
      label: Yup.string().required("Quarter is required"),
    })
    .typeError("Quarter is required"),
});
const GrowthModel = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState({});
  const [empInfo, setEmpInfo] = useState([]);
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  useEffect(() => {
    // getYearDDL(orgId, buId, setYearDDL, setLoading);
    getEmployeeProfileViewData(employeeId, setEmpInfo, setLoading);

    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      const theYear = getFiscalYearForNowOnLoad();
      const theYearData = data.find((item) => item?.label === theYear);
      initialValues.yearDDLgroup = theYearData;
      setFieldValue("yearDDLgroup", theYearData);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30420) {
      permission = item;
    }
  });

  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues,
    onSubmit: () => {},
  });
  const saveHandler = (values, rowDto) => {
    if (
      !rowDto.goal &&
      !rowDto.reality &&
      !rowDto.obstacles &&
      !rowDto.options &&
      !rowDto.wayForward
    ) {
      return toast.warn("Please add at least one Field.");
    }
    const payload = {
      growModelId: rowDto?.growModelId || 0,
      employeeId: employeeId,
      employeeName: empInfo?.employeeProfileLandingView?.strEmployeeName,
      designationId: empInfo?.employeeProfileLandingView?.intDesignationId,
      businessUnitId: buId,
      workplaceGroupId: rowDto?.workplaceGroupId || 0,
      yearId: rowDto?.yearId || values?.yearDDLgroup?.value,
      year: rowDto?.year || values?.yearDDLgroup?.label,
      quarterId: rowDto?.quarterId || values.quarterDDLgroup.value,
      quarter: rowDto?.quarter || values.quarterDDLgroup.label,
      goal: rowDto.goal,
      reality: rowDto.reality,
      obstacles: rowDto.obstacles,
      options: rowDto.options,
      wayForward: rowDto.wayForward,
      isActive: true,
      actionDate: new Date(),
      actionBy: employeeId,
    };
    createGrowModel(payload, setLoading);
  };

  useEffect(
    () => dispatch(setFirstLevelNameAction("Performance Management System")),
    [dispatch]
  );

  const pdfExport = (fileName) => {
    var element = document.getElementById("pdf-section");
    var clonedElement = element.cloneNode(true);
    clonedElement.classList.add("d-block");
    var opt = {
      margin: 20,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 5, dpi: 300, letterRendering: true },
      jsPDF: {
        unit: "px",
        hotfixes: ["px_scaling"],
        orientation: "portrait",
      },
    };
    html2pdf().set(opt).from(clonedElement).save();
  };

  const editData = (name, value) => {
    const data = { ...rowDto };
    data[name] = value;
    setRowDto(data);
  };
  return (
    <form onSubmit={handleSubmit}>
      {(loading || fiscalYearDDLloader) && <Loading />}
      {permission?.isView ? (
        <div className="table-card">
          <div className="table-card-heading">
            <div className="d-flex align-items-center">
              <h2>GROW Model</h2>
            </div>

            <div className="d-flex align-items-center">
              <PrimaryButton
                type="button"
                className="btn btn-default flex-center mr-2"
                label={" Export PDF"}
                onClick={(e) => pdfExport("Grow Model")}
              />

              <button
                className="btn btn-green btn-green-disabled"
                type="submit"
                style={{ cursor: "pointer" }}
                disabled={!values?.yearDDLgroup || !values?.quarterDDLgroup}
                onClick={() => {
                  saveHandler(values, rowDto);
                }}
              >
                Save
              </button>
            </div>
          </div>
          <div className="table-card-body" style={{ marginTop: "12px" }}>
            <div className="card-style" style={{ margin: "14px 0px 12px 0px" }}>
              <div className="row">
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Year</label>
                    <FormikSelect
                      name="yearDDLgroup"
                      options={fiscalYearDDL || []}
                      value={values?.yearDDLgroup}
                      onChange={(valueOption) => {
                        setFieldValue("yearDDLgroup", valueOption);
                        if (values?.quarterDDLgroup?.value) {
                          getGrowCoachingModelWorksheet(
                            employeeId,
                            valueOption?.value,
                            values?.quarterDDLgroup?.value || 0,
                            setLoading,
                            setRowDto
                          );
                        }
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Quarter</label>
                    <FormikSelect
                      name="quarterDDLgroup"
                      options={quarterDDL}
                      value={values?.quarterDDLgroup}
                      onChange={(valueOption) => {
                        if (valueOption) {
                          console.log(valueOption, rowDto);
                          setRowDto(null);
                          setFieldValue("quarterDDLgroup", valueOption);
                          getGrowCoachingModelWorksheet(
                            employeeId,
                            values?.yearDDLgroup?.value || 0,
                            valueOption?.value,
                            setLoading,
                            setRowDto
                          );
                        } else {
                          setRowDto(null);
                          setFieldValue("quarterDDLgroup", "");
                        }
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Table className="growModel">
              <tr>
                <td
                  className="table-row-width p-2 px-4"
                  style={{ fontSize: "14px" }}
                >
                  <strong>Goal</strong>
                  <br />
                  <span>
                    What do you want to accomplish?How will you know when it
                    isachieved?
                  </span>
                </td>
                <td>
                  <textarea
                    value={rowDto?.goal}
                    name="goal"
                    rows="4"
                    cols="100"
                    onChange={(e) => {
                      setFieldValue("goal", e.target.value);
                      editData("goal", e.target.value);
                    }}
                  ></textarea>
                </td>
              </tr>
              <tr>
                <td
                  className="table-row-width p-2 px-4"
                  style={{ fontSize: "14px" }}
                >
                  <strong>Reality</strong>
                  <br />
                  <span>
                    What’s happening now in terms of the goal?How far am I away
                    from the goal?
                  </span>
                </td>
                <td>
                  <textarea
                    value={rowDto?.reality}
                    name="reality"
                    rows="4"
                    cols="100"
                    onChange={(e) => {
                      setFieldValue("reality", e.target.value);
                      editData("reality", e.target.value);
                    }}
                  ></textarea>
                </td>
              </tr>
              <tr>
                <td
                  className="table-row-width p-2 px-4"
                  style={{ fontSize: "14px" }}
                >
                  <strong>Obstacles</strong>
                  <br />
                  <span>
                    What is standing in the way –Me? Other people?Lack of
                    skills, knowledge, expertise? Physical environment?
                  </span>
                </td>
                <td>
                  <textarea
                    value={rowDto?.obstacles}
                    name="obstacles"
                    rows="4"
                    cols="100"
                    onChange={(e) => {
                      setFieldValue("obstacles", e.target.value);
                      editData("obstacles", e.target.value);
                    }}
                  ></textarea>
                </td>
              </tr>
              <tr>
                <td
                  className="table-row-width p-2 px-4 "
                  style={{ fontSize: "14px" }}
                >
                  <strong>Options</strong>
                  <br />
                  <span>
                    What options do I have to resolve the issues or obstacles?",
                    field: "options
                  </span>
                </td>
                <td>
                  <textarea
                    value={rowDto?.options}
                    name="options"
                    rows="4"
                    cols="100"
                    onChange={(e) => {
                      setFieldValue("options", e.target.value);
                      editData("options", e.target.value);
                    }}
                  ></textarea>
                </td>
              </tr>
              <tr>
                <td
                  className="table-row-width  px-4"
                  style={{ fontSize: "14px" }}
                >
                  <strong>Way Forward/Will</strong>
                  <br />
                  <span>Which option will I commit to?</span>
                </td>
                <td>
                  <textarea
                    value={rowDto?.wayForward}
                    name="wayForward"
                    rows="3"
                    cols="100"
                    onChange={(e) => {
                      setFieldValue("wayForward", e.target.value);
                      editData("wayForward", e.target.value);
                    }}
                  ></textarea>
                </td>
              </tr>
            </Table>
            <div id="pdf-section" className="growModel mx-5 d-none">
              <GrowModelPdf singleData={rowDto} />
            </div>
          </div>
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </form>
  );
};

export default GrowthModel;
