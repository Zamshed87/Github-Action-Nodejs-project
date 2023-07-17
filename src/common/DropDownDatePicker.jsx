import React, { useState } from "react";
import { customStylesLarge } from "../utility/selectCustomStyle";
import FormikSelect from "./FormikSelect";

const DropDownDatePicker = ({ values, setFieldValue, errors, touched, label, yearType, monthType, dayType }) => {
  const year = new Date().getFullYear();
  const yearStart = year - 10;
  const yearEnd = year + 10;
  let years = [];
  for (let i = yearStart; i <= yearEnd; i++) {
    years.push(i);
  }
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };
  let days = [];
  const [dateClick, setDateClick] = useState({
    year: "",
    month: "",
  });
  const dayPicker = daysInMonth(dateClick.month, dateClick.year);
  for (let j = 1; j <= dayPicker; j++) {
    days.push(j);
  }

  return (
    <>
      <p>{label}</p>
      <div className="dropDownDatePicker row">
        <div className="col-md-4">
          <FormikSelect
            name={yearType}
            options={years.map((year, i) => {
              return { value: i + 1, label: year };
            })}
            value={values[yearType]}
            onChange={(valueOption) => {
              setFieldValue(`${yearType}`, valueOption);
              setDateClick({
                ...dateClick,
                year: valueOption?.label,
              });
            }}
            placeholder="Year"
            styles={customStylesLarge}
            errors={errors}
            touched={touched}
          />
        </div>

        <div className="col-md-4">
          <FormikSelect
            name={monthType}
            options={months.map((month, i) => {
              return { value: i + 1, label: month };
            })}
            value={values[monthType]}
            // label="Field Type"
            onChange={(valueOption) => {
              setFieldValue(`${monthType}`, valueOption);
              setDateClick({
                ...dateClick,
                month: valueOption?.value,
              });
            }}
            placeholder="Month"
            styles={customStylesLarge}
            errors={errors}
            touched={touched}
            isDisabled={values[yearType] ? false : true}
          />
        </div>
        <div className="col-md-4">
          <FormikSelect
            name={dayType}
            options={days.map((day, i) => {
              return { value: i + 1, label: day };
            })}
            value={values[dayType]}
            // label="Field Type"
            onChange={(valueOption) => {
              setFieldValue(`${dayType}`, valueOption);
            }}
            placeholder="Day"
            styles={customStylesLarge}
            errors={errors}
            touched={touched}
            isDisabled={values[yearType] && values[monthType] ? false : true}
            menuPosition="fixed"
          />
        </div>
      </div>
    </>
  );
};

export default DropDownDatePicker;
