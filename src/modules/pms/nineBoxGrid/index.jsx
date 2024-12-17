import { useFormik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import DefaultInput from "../../../common/DefaultInput";
import FormikSelect from "../../../common/FormikSelect";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import { monthFirstDate, monthLastDate } from "../../../utility/dateFormatter";
import { getFiscalYearForNowOnLoad } from "../../../utility/getFiscalYearOnLoade";
import { customStyles } from "../../../utility/selectCustomStyle";
import "./style.css";
import Loading from "../../../common/loading/Loading";
const initData = {
  employeeName: "",
  year: "",
  startDate: monthFirstDate(),
  endDate: monthLastDate(),
};
export default function NineBoxGrid() {
  // 30459
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const { employeeId, strDesignation, userName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { errors, touched, values, setFieldValue } = useFormik({
    initialValues: initData,
  });

  useEffect(() => {
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      const theYear = getFiscalYearForNowOnLoad();
      const theYearData = data?.find((item) => item?.label === theYear);
      initData.year = theYearData;
      setFieldValue("year", theYearData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="table-card userGroup-wrapper">
      {fiscalYearDDLloader && <Loading />}
      <div className="justify-content-between">
        <h2 style={{ color: "#344054" }}>Talent Identification Model</h2>
      </div>
      <div className="table-card-body about-info-card policy-details">
        <div className="row">
          <div className="col-lg-12">
            <label className="mr-3">
              <input
                type="radio"
                name="privacyType"
                className="mr-1 pointer"
                style={{ position: "relative", top: "2px" }}
              />
              Private
            </label>
            <label>
              <input
                type="radio"
                name="privacyType"
                className="mr-1 pointer"
                style={{ position: "relative", top: "2px" }}
              />
              Public
            </label>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-lg-3">
            <div className="input-field-main">
              <label>Employee Name</label>
              <FormikSelect
                name="employeeName"
                //  options={businessUnitDDL || []}
                value={"Miraz Hossain"}
                onChange={() => {}}
                styles={customStyles}
              />
            </div>
          </div>
          <div className="col-lg-3">
            <div className="input-field-main">
              <label>Year</label>
              <FormikSelect
                name="year"
                options={fiscalYearDDL || []}
                value={values?.year}
                onChange={(valueOption) => {
                  setFieldValue("year", valueOption);
                }}
                styles={customStyles}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
          <div className="input-field-main  col-md-3">
            <label>Start Date</label>
            <DefaultInput
              classes="input-sm"
              name="startDate"
              value={values?.startDate}
              type="date"
              className="form-control"
              onChange={(e) => {
                setFieldValue("startDate", e.target.value);
              }}
              errors={errors}
              touched={touched}
              disabled={!values?.year}
            />
          </div>
          <div className="input-field-main  col-md-3">
            <label>End Date</label>
            <DefaultInput
              classes="input-sm"
              value={values?.endDate}
              name="endDate"
              type="date"
              className="form-control"
              onChange={(e) => {
                setFieldValue("endDate", e.target.value);
              }}
              errors={errors}
              touched={touched}
              disabled={!values?.year}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 ">
            <p>
              <span className="font-weight-bold">Name :</span>{" "}
              <span>{userName}</span>
            </p>
          </div>
          <div className="col-lg-3 ">
            <p>
              <span className="font-weight-bold">Enroll :</span>{" "}
              <span>{employeeId}</span>
            </p>
          </div>

          <div className="col-lg-3">
            <p>
              <span className="font-weight-bold">Designation :</span>{" "}
              <span>{strDesignation}</span>
            </p>
          </div>
          <div className="col-lg-3">
            <p>
              <span className="font-weight-bold">Workplace :</span>{" "}
            </p>
          </div>
        </div>
      </div>
      <div style={{ gap: "20px" }} className="row justify-content-center ">
        <div className="d-flex flex-grow-2 flex-column align-items-center justify-content-around">
          <h1>High (A)</h1>
          <h1>Solid (B)</h1>
          <h1>Latent (C)</h1>
        </div>
        <div
          style={{ gap: "20px" }}
          className="flex-grow-3 mt-4 mb-4 row align-items-center justify-content-center"
        >
          <div
            className=""
            style={{
              transform: "rotate(180deg)",
              writingMode: "vertical-lr",
            }}
          >
            <h1 className="">Leadership Potential</h1>
          </div>
          {/* <div style={{width:"2px",height:"500px",backgroundColor:"red"}}></div> */}
          <div className="">
            <div className=" d-flex flex-column flex-md-row align-items-center justify-content-around ">
              <h1>Does not meets Expectation</h1>
              <h1>Meets Expectation</h1>
              <h1>Outstanding (3)</h1>
            </div>
            <div className="nineBox-container ">
              <div className="box-container border mt-2 bg-warning ">
                <div className="nineBox-headingBox text-center">
                  <h1 style={{ color: "white", padding: "3px" }}>A1</h1>
                </div>
                <div className="m-4 nineBox-innerBody">
                  <h3 className="text-center text-white">
                    Enigma (Inconsistences)
                  </h3>
                  <div className="nineBox-mark-container">
                    <div className="nineBox-totalMarks-Container">
                      <h1 className="nineBox-totalMarks">80</h1>
                      <p className="nineBox-totalMarksText">Total Marks</p>
                    </div>
                    <div
                      style={{ gap: "20px" }}
                      className="d-flex justify-content-center "
                    >
                      <div className="nineBox-Marks-container">
                        <h1 className="nineBox-mark">30</h1>
                        <p className="text-light">Skills Mark</p>
                      </div>
                      <div className="nineBox-Marks-container">
                        <h1 className="nineBox-mark">50</h1>
                        <p className="text-light">Other Mark</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border mt-2 bg-success ">
                <div className="nineBox-headingBox text-center">
                  <h1 style={{ color: "white", padding: "3px" }}>A2</h1>
                </div>
                <div className="m-4 nineBox-innerBody">
                  <h1 className="text-center text-white">
                    Growth <br /> Employee
                  </h1>
                </div>
              </div>
              <div className="border mt-2 bg-success ">
                <div className="nineBox-headingBox text-center">
                  <h1 style={{ color: "white", padding: "3px" }}>A3</h1>
                </div>
                <div className="m-4 nineBox-innerBody">
                  <h1 className="text-center text-white">
                    Future <br /> Leader
                  </h1>
                </div>
              </div>
              <div className="border mt-2 bg-warning ">
                <div className="nineBox-headingBox text-center">
                  <h1 style={{ color: "white", padding: "3px" }}>B1</h1>
                </div>
                <div className="m-4 nineBox-innerBody">
                  <h1 className="text-center text-white">Dilemma</h1>
                </div>
              </div>
              <div className="border mt-2 bg-warning ">
                <div className="nineBox-headingBox text-center">
                  <h1 style={{ color: "white", padding: "3px" }}>B2</h1>
                </div>
                <div className="m-4 nineBox-innerBody">
                  <h1 className="text-center text-white">Core Employee</h1>
                </div>
              </div>
              <div className="border mt-2  bg-success ">
                <div className="nineBox-headingBox text-center">
                  <h1 style={{ color: "white", padding: "3px" }}>B3</h1>
                </div>
                <div className="m-4 nineBox-innerBody">
                  <h1 className="text-center text-white">
                    High Impact Performer
                  </h1>
                </div>
              </div>
              <div className="border mt-2 bg-danger text-white">
                <div className="nineBox-headingBox text-center">
                  <h1 style={{ color: "white", padding: "3px" }}>C1</h1>
                </div>
                <div className="m-4 nineBox-innerBody">
                  <h1 className="text-center text-white">Under Performer</h1>
                </div>
              </div>
              <div className="border mt-2 bg-warning ">
                <div className="nineBox-headingBox text-center">
                  <h1 style={{ color: "white", padding: "3px" }}>C2</h1>
                </div>
                <div className="m-4 nineBox-innerBody">
                  <h1 className="text-center text-white">Effective</h1>
                </div>
              </div>
              <div className="border mt-2 bg-warning">
                <div className="nineBox-headingBox text-center">
                  <h1 style={{ color: "white", padding: "3px" }}>C3</h1>
                </div>
                <div className="m-4 nineBox-innerBody">
                  <h1 className="text-center text-white">
                    Trusted Professional
                  </h1>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-center mt-2 mb-2">Performance</h1>
            </div>
            <div className=" d-flex flex-column flex-md-row align-items-center justify-content-around">
              <h1>Poor (1)</h1>
              <h1>Good (2)</h1>
              <h1>Outstanding (3)</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
