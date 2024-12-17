/* eslint-disable react-hooks/exhaustive-deps */
import FontDownloadOutlinedIcon from "@mui/icons-material/FontDownloadOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FormikSelect from "../../../../common/FormikSelect";
import PrimaryButton from "../../../../common/PrimaryButton";
import Loading from "../../../../common/loading/Loading";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { customStyles } from "../../../../utility/selectCustomStyle";
import "./style.css";

export default function MeasuringDetails({
  tabValue,
  detailsData,
  getValuesAndCompetencyNameDDL,
  getValuesReportData,
  values,
  setFieldValue,
  errors,
  touched,
}) {
  const [
    valuesMeasuringData,
    getValuesMeasuringData,
    measuringLoading,
    setValuesMeasuringData,
  ] = useAxiosGet();

  const [
    competenciesMeasuringData,
    getCompetenciesMeasuringData,
    competenciesLoading,
    setCompetenciesMeasuringData,
  ] = useAxiosGet();

  const [, createSelfAssessmentData, saveLoading] = useAxiosPost();

  const { buId, orgId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    if (tabValue === "2") {
      getValuesMeasuringData(
        `/PMS/GetScaleForValueDDL?accountId=${orgId}&businessUnitId=${buId}&dimensionTypeId=2`
      );
    }
    if (tabValue === "3") {
      getCompetenciesMeasuringData(
        `/PMS/GetScaleForValueDDL?accountId=${orgId}&businessUnitId=${buId}&dimensionTypeId=3`
      );
    }
  }, []);

  const createSelfAssessment = (values, setFieldValue) => {
    const objRow = [
      {
        typeId: +tabValue,
        valuesOrComId:
          tabValue === "2"
            ? values?.valuesName?.value
            : values?.competencyName?.value,
        valuesOrComName:
          tabValue === "2"
            ? values?.valuesName?.label
            : values?.competencyName?.label,
        numDesiredValue:
          tabValue === "2"
            ? values?.valuesName?.numDesiredValue
            : values?.competencyName?.numDesiredValue,
        measureIdByEmployee: values?.measure?.value || 0,
        measureNameByEmployee: values?.measure?.label || "",
        numMeasureValueByEmployee: values?.measure?.mesureValue || 0,
      },
    ];
    const Payload = {
      objHeader: {
        accountId: orgId,
        businessUnitId: buId,
        sbuid: 0,
        yearId: values?.yearDDLgroup?.value || 0,
        employeeId: employeeId,
        actionBy: employeeId,
        quarterId: values?.quarterDDLgroup?.value || 0,
        quarterName: values?.quarterDDLgroup?.label || "",
      },
      objRow: objRow,
    };
    createSelfAssessmentData(
      "/PMS/CreateValuesAndCompetency",
      Payload,
      () => {
        if (tabValue === "2") {
          getValuesAndCompetencyNameDDL(
            `/PMS/GetValueList?accountId=${orgId}&businessUnitId=${buId}&yearId=${values?.yearDDLgroup?.value}&employeeId=${employeeId}`,
            (res) => {
              if (res?.isPreviewEnable) {
                getValuesReportData(
                  `/PMS/GetCoreValuesAndCompetencyPreview?businessUnitId=${buId}&employeeId=${employeeId}&yearId=${values?.yearDDLgroup?.value}&typeId=2`
                );
              }
            }
          );
          setValuesMeasuringData([]);
          setFieldValue("valuesName", "");
        }
        if (tabValue === "3") {
          getValuesAndCompetencyNameDDL(
            `/PMS/GetCompetencyList?accountId=${orgId}&businessUnitId=${buId}&yearId=${values?.yearDDLgroup?.value}&employeeId=${employeeId}`,
            (res) => {
              if (res?.isPreviewEnable) {
                getValuesReportData(
                  `/PMS/GetCoreValuesAndCompetencyPreview?businessUnitId=${buId}&employeeId=${employeeId}&yearId=${values?.yearDDLgroup?.value}&typeId=2`
                );
              }
            }
          );
          setCompetenciesMeasuringData([]);
          setFieldValue("competencyName", "");
        }
      },
      true
    );
  };

  return (
    <>
      {(measuringLoading || competenciesLoading || saveLoading) && <Loading />}

      <div className="measuringDetails">
        <p>
          {/* <i className="fa fa-font"></i> */}
          <FontDownloadOutlinedIcon />
          <b style={{ marginLeft: "10px" }}>
            {tabValue === "2" ? "Value" : "Competency"} Name:{" "}
          </b>
          {tabValue === "2"
            ? detailsData?.[0]?.coreValueName || ""
            : detailsData?.[0]?.competencyName || ""}
        </p>
        <p>
          {/* <i className="fa fa-book"></i> */}
          <MenuBookOutlinedIcon />
          <b style={{ marginLeft: "10px" }}>Definition: </b>
          {tabValue === "2"
            ? detailsData?.[0]?.defination || ""
            : detailsData?.[0]?.defination || ""}
        </p>
        <p>
          {/* <i className="fa fa-list-ul"></i> */}
          <FormatListBulletedOutlinedIcon />
          <b style={{ marginLeft: "10px" }}>Demonstrated Behavior</b>
        </p>
        <ul>
          {tabValue === "2"
            ? detailsData?.length > 0 && (
                <div>
                  <div>
                    {detailsData?.filter((item) => item.isPositive).length >
                      0 && (
                      <h3
                        style={{
                          background: "#a9f2ab",
                          padding: "10px 12px",
                        }}
                      >
                        <b>Positive</b>
                      </h3>
                    )}
                    {detailsData?.map((itm, index) => {
                      return (
                        itm?.isPositive && (
                          <li key={index}>{itm?.demonstratedBehaviour}</li>
                        )
                      );
                    })}
                  </div>
                  <div>
                    {detailsData?.filter((item) => !item.isPositive).length >
                      0 && (
                      <h3
                        style={{
                          background: "#f49999",
                          padding: "10px 12px",
                        }}
                      >
                        <b>Negative</b>
                      </h3>
                    )}
                    {detailsData?.map((itm, index) => {
                      return (
                        !itm?.isPositive && (
                          <li key={index}>{itm?.demonstratedBehaviour}</li>
                        )
                      );
                    })}
                  </div>
                </div>
              )
            : detailsData?.length > 0 && (
                <div>
                  <div>
                    {detailsData?.filter((item) => item.isPositive).length >
                      0 && (
                      <h3
                        style={{
                          background: "#a9f2ab",
                          padding: "10px 12px",
                        }}
                      >
                        <b>Positive</b>
                      </h3>
                    )}
                    {detailsData?.map((itm, index) => {
                      return (
                        itm?.isPositive && (
                          <li key={index}>{itm?.demonstratedBehaviour}</li>
                        )
                      );
                    })}
                  </div>
                  <div>
                    {detailsData?.filter((item) => !item.isPositive).length >
                      0 && (
                      <h3
                        style={{
                          background: "#f49999",
                          padding: "10px 12px",
                        }}
                      >
                        <b>Negative</b>
                      </h3>
                    )}
                    {detailsData?.map((itm, index) => {
                      return (
                        !itm?.isPositive && (
                          <li key={index}>{itm?.demonstratedBehaviour}</li>
                        )
                      );
                    })}
                  </div>
                </div>
              )}
        </ul>
        <div className="row">
          <div className="input-field-main col-lg-3">
            <FormikSelect
              classes="input-sm"
              name="measure"
              options={
                tabValue === "2"
                  ? valuesMeasuringData
                  : competenciesMeasuringData
              }
              value={values?.measure}
              label="Measure"
              onChange={(valueOption) => {
                if (valueOption) {
                  setFieldValue("measure", valueOption);
                } else {
                  setFieldValue("measure", "");
                }
              }}
              placeholder=" "
              styles={customStyles}
              errors={errors}
              touched={touched}
              menuPosition="fixed"
            />
          </div>
          <div className="input-field-main col-lg-3 mt-4">
            <PrimaryButton
              type="button"
              className="btn btn-default flex-center"
              label={"Save"}
              //   icon={<AddOutlined sx={{ marginRight: "11px" }} />}
              onClick={(e) => {
                //  if (!permission?.isCreate)
                //    return toast.warn("You don't have permission");
                e.stopPropagation();
                createSelfAssessment(values, setFieldValue);
              }}
              disabled={!values?.measure}
            />
          </div>
        </div>

        <hr />

        {/* <div className="row">
               <div className="col-lg-12">
                  <ScrollableTable
                     classes="salary-process-table"
                     secondClasses="table-card-styled tableOne scroll-table-height"
                  >
                     <thead>
                        <tr>
                           <th className="text-center">
                              {tabValue === '2'
                                 ? 'Value Name'
                                 : 'Competency Name'}
                           </th>
                           <th className="text-center">Desired Values</th>
                           <th className="text-center">Measure by Employee </th>
                           <th className="text-center">Gap </th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td>
                              {tabValue === '2'
                                 ? values?.valuesName?.label
                                 : values?.competencyName?.label}
                           </td>
                           <td className="text-center">
                              {tabValue === '2'
                                 ? values?.valuesName?.numDesiredValue
                                 : values?.competencyName?.numDesiredValue}
                           </td>
                           <td>{values?.measure?.label || ''}</td>
                           <td className="text-center">
                              {values?.measure
                                 ? values?.measure?.mesureValue === 0
                                    ? 0
                                    : -values?.measure?.mesureValue
                                 : 0}
                           </td>
                        </tr>
                     </tbody>
                  </ScrollableTable>
               </div>
            </div> */}
      </div>
    </>
  );
}
