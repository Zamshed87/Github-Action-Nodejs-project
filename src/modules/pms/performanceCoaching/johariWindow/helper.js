import { todayDate } from "../../../../utility/todayDate";
import React from "react";
import html2pdf from "html2pdf.js";
export const onExportPDFJohariWindow = (fileName) => {
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

export const onGetJohariWindow = ({
  setValues,
  valueOption,
  getJohariWindows,
  values,
}) => {
  setValues?.((prev) => ({
    ...prev,
    year: valueOption,
    open: [],
    blind: [],
    unknown: [],
    hidden: [],
  }));
  if (valueOption?.value) {
    getJohariWindows?.(
      // `${erpBaseUrl}/pms/PerformanceMgmt/GetJohariWindow?EmployeeId=${values?.employee?.value}&YearId=${valueOption?.value}`,
      `/PMS/GetJohariWindow?EmployeeId=${values?.employee?.value}&YearId=${valueOption?.value}`,
      (res) => {
        if (res) {
          const modifiedOpenList = res?.open?.map((item) => ({
            ...item,
            value: item?.label,
          }));

          const modifiedBlindList = res?.blind?.map((item) => ({
            ...item,
            value: item?.label,
          }));
          const modifiedHiddenList = res?.hidden?.map((item) => ({
            ...item,
            value: item?.label,
          }));
          const modifiedUnknownList = res?.unknown?.map((item) => ({
            ...item,
            value: item?.label,
          }));
          setValues?.((prev) => ({
            ...prev,
            open: modifiedOpenList,
            blind: modifiedBlindList,
            unknown: modifiedUnknownList,
            hidden: modifiedHiddenList,
          }));
        }
      }
    );
  }
};

export const onCreateJohariWindow = ({
  formValues,
  resetForm,
  setEmployeeBasicInfo,
  setJohariWindow,
  johariWindow,
  employeeId,
  employeeInfo,
  createJohariWindow,
  getJohariWindows,
  values,
  setValues,
}) => {
  const openList = formValues?.open?.map((item) => ({
    intRowId: item?.intRowId || 0,
    intJohariWindowHeaderId:
      item?.intJohariWindowHeaderId || johariWindow?.johariWindowHeaderId || 0,
    strChipsType: "Open",
    strChipsLabel: item?.strChipsLabel || item?.label || "",
    isActive: true,
    dteActionDate: todayDate(),
    intActionBy: employeeId,
  }));
  const hiddenList = formValues?.hidden?.map((item) => ({
    intRowId: item?.intRowId || 0,
    intJohariWindowHeaderId:
      item?.intJohariWindowHeaderId || johariWindow?.johariWindowHeaderId || 0,
    strChipsType: "Hidden",
    strChipsLabel: item?.strChipsLabel || item?.label || "",
    isActive: true,
    dteActionDate: todayDate(),
    intActionBy: employeeId,
  }));
  const payload = {
    johariWindowHeaderId: johariWindow?.johariWindowHeaderId || 0,
    employeeId: formValues?.employee?.value || 0,
    employeeName: formValues?.employee?.label,
    designationId: 0,
    businessUnitId:
      johariWindow?.businessUnitId || employeeInfo?.[0]?.businessUnitId || 0,
    workplaceGroupId:
      johariWindow?.workplaceGroupId ||
      employeeInfo?.[0]?.workplaceGroupId ||
      0,
    yearId: formValues?.year?.value,
    year: formValues?.year?.label,
    quarterId: 0,
    quarter: "",
    isActive: true,
    actionDate: todayDate(),
    actionBy: employeeId,
    open: openList,
    blind: johariWindow?.blind || [],
    hidden: hiddenList || [],
    unknown: johariWindow?.unknown || [],
  };
  createJohariWindow?.(
    // `${erpBaseUrl}/pms/PerformanceMgmt/CreateJohariWindow`,
    `/PMS/CreateJohariWindow`,
    payload,
    () => {
      onGetJohariWindow({
        setValues,
        valueOption: formValues?.year,
        getJohariWindows,
        values,
      });
    },
    true
  );
};

export const JohariWindowPDFView = ({
  employeeFullName,
  employeeId,
  designation,
  workplace,
  year,
  chipList,
}) => {
  return (
    <div className="johari-window-wrapper">
      <div className="mb-5">
        <p
          className="texr-secondary text-center mb-5 mt-5"
          style={{ fontSize: "20px" }}
        >
          <strong>Johari Window</strong>
        </p>
        <div className="mt-2 mb-2">
          <p style={{ fontSize: "14px", margin: "4px 0" }}>
            <strong>Name</strong>: <span>{employeeFullName || "N/A"}</span>
          </p>

          <p style={{ fontSize: "14px", margin: "4px 0" }}>
            <strong>Designation</strong>: <span>{designation || "N/A"}</span>
          </p>

          <p style={{ fontSize: "14px", margin: "4px 0" }}>
            <strong>Enroll</strong>: <span>{employeeId || "N/A"}</span>
          </p>

          <p style={{ fontSize: "14px", margin: "4px 0" }}>
            <strong>Workplace</strong>: <span>{workplace || "N/A"}</span>
          </p>

          <p style={{ fontSize: "14px", margin: "4px 0" }}>
            <strong>Year</strong>: <span>{year || "N/A"}</span>
          </p>
        </div>
      </div>
      <div className="mt-3 mb-5">
        <div
          className="row justify-content-between mx-0 mb-0"
          style={{ border: "4px solid gray", borderCollapse: "collapse" }}
        >
          <div
            style={{
              width: "50%",
              borderRight: "2px solid gray",
              borderCollapse: "collapse",
              minHeight: "150px",
              padding: "4px",
            }}
          >
            <div className="row my-2 align-item-center">
              <div className="col-md-2">
                <h4>Open</h4>
              </div>
            </div>
            <div>
              <ul className="d-flex flex-wrap">
                {chipList?.open?.map((item, index) => (
                  <li
                    key={index}
                    style={{ backgroundColor: "#EEEEEE", border: 0 }}
                    className="chips success relative chips-two mr-1 mb-2"
                  >
                    {item?.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div
            style={{
              padding: "4px",
              minHeight: "150px",
              width: "50%",
              borderLeft: "2px solid gray",
              borderCollapse: "collapse",
            }}
          >
            <div className="row my-2 align-item-center">
              <div className="col-md-2">
                <h4>Blind</h4>
              </div>
            </div>
            <div>
              <ul className="d-flex flex-wrap">
                {chipList?.blind?.map((item, index) => (
                  <li
                    key={index}
                    style={{ backgroundColor: "#EEEEEE", border: 0 }}
                    className="chips success relative chips-two mr-1 mb-2"
                  >
                    {item?.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div
          className="row justify-content-between mx-0 mt-0 border-top-0"
          style={{ border: "4px solid gray", borderCollapse: "collapse" }}
        >
          <div
            style={{
              width: "50%",
              borderRight: "2px solid gray",
              borderCollapse: "collapse",
              minHeight: "150px",
              padding: "4px",
            }}
          >
            <div className="row my-2 align-item-center">
              <div className="col-md-2">
                <h4>Hidden</h4>
              </div>
            </div>
            <div>
              <ul className="d-flex flex-wrap">
                {chipList?.hidden?.map((item, index) => (
                  <li
                    key={index}
                    style={{ backgroundColor: "#EEEEEE", border: 0 }}
                    className="chips success relative chips-two mr-1 mb-2"
                  >
                    {item?.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div
            style={{
              padding: "4px",
              minHeight: "150px",
              width: "50%",
              borderLeft: "2px solid gray",
              borderCollapse: "collapse",
            }}
          >
            <div className="row my-2 align-item-center">
              <div className="col-md-2">
                <h4>Unknown</h4>
              </div>
            </div>
            <div>
              <ul className="d-flex flex-wrap">
                {chipList?.unknown?.map((item, index) => (
                  <li
                    key={index}
                    style={{ backgroundColor: "#EEEEEE", border: 0 }}
                    className="chips success relative chips-two mr-1 mb-2"
                  >
                    {item?.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// export const demResponse = {
//   johariWindowHeaderId: 2,
//   employeeId: 509689,
//   employeeName: "Md Miraj Hossain",
//   designationId: 2044,
//   businessUnitId: 184,
//   workplaceGroupId: 5,
//   yearId: 13,
//   year: "2022-2023",
//   quarterId: 0,
//   quarter: "",
//   isActive: true,
//   actionDate: "2022-12-08T05:11:01.863",
//   actionBy: 509697,
//   open: [
//     {
//       intRowId: 7,
//       intJohariWindowHeaderId: 2,
//       strChipsType: "Open",
//       strChipsLabel: "Honest",
//       label: "Honest",
//     },
//     {
//       intRowId: 8,
//       intJohariWindowHeaderId: 2,
//       strChipsType: "Open",
//       strChipsLabel: "Positive",
//       label: "Positive",
//     },
//     {
//       intRowId: 9,
//       intJohariWindowHeaderId: 2,
//       strChipsType: "Open",
//       strChipsLabel: "Helping",
//       label: "Helping",
//     },
//   ],
//   blind: [],
//   hidden: [
//     {
//       intRowId: 10,
//       intJohariWindowHeaderId: 2,
//       strChipsType: "Hidden",
//       strChipsLabel: "Leadership",
//       label: "Leadership",
//     },
//     {
//       intRowId: 11,
//       intJohariWindowHeaderId: 2,
//       strChipsType: "Hidden",
//       strChipsLabel: "Punctual",
//       label: "Punctual",
//     },
//   ],
//   unknown: [],
//   designation: "Business Analyst",
//   workplaceGroup: "Corporate",
// };
