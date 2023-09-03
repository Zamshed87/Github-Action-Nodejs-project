/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getSearchEmployeeList } from "../../../../../common/api";
import DefaultInput from "../../../../../common/DefaultInput";
import AsyncFormikSelect from "../../../../../common/AsyncFormikSelect";

const AttendanceAdjustFilterModal = ({ propsObj, masterFilterHandler }) => {
  const { buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { getFilterValues, setFieldValue, values, errors, touched, getData } =
    propsObj;

  // const [allDDL, setAllDDL] = useState([]);
  useEffect(() => {
    // getFilterDDLNewAction(buId, wgId, "", "", "", "", setAllDDL);
    setFieldValue("employee", "");
    setFieldValue("monthYear", "");
  }, [buId, wgId]);

  useEffect(() => {
    getData(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.employee, values?.monthYear]);

  return (
    <>
      <div className="row w-100">
        <div className="col-md-6">
          <div className="input-field-main">
            {/* <FormikSelect
              menuPosition="fixed"
              name="employee"
              options={allDDL?.employeeList || []}
              value={values?.employee}
              onChange={(valueOption) => {
                setFieldValue("employee", valueOption);
                getFilterValues("employee", valueOption);
              }}
              styles={customStyles}
              errors={errors}
              placeholder="Select Employee"
              touched={touched}
            /> */}
            <AsyncFormikSelect
              selectedValue={values?.employee}
              isSearchIcon={true}
              handleChange={(valueOption) => {
                setFieldValue("employee", valueOption);
                getFilterValues("employee", valueOption);
              }}
              placeholder="Search (min 3 letter)"
              loadOptions={(v) => getSearchEmployeeList(buId, wgId, v)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <DefaultInput
            classes="input-sm"
            value={values?.monthYear}
            name="monthYear"
            type="month"
            className="form-control"
            onChange={(e) => {
              setFieldValue("monthYear", e.target.value);
              getFilterValues("monthYear", e.target.value);
            }}
            errors={errors}
            touched={touched}
          />
        </div>
      </div>
    </>
  );
};

export default AttendanceAdjustFilterModal;
