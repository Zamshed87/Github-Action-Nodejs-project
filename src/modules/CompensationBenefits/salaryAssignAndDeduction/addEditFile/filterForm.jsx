import { gray700, gray900 } from "../../../../utility/customColor";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { getCombineAllDDL } from "../../../../common/api";

const FilterForm = ({
  orgId,
  errors,
  touched,
  isAccordion,
  setIsAccordion,
  businessUnitDDL,
  values,
  setAllDDL,
  setFieldValue,
  getFilterValues,
  setIsFormOpen,
  setRowDto,
  workplaceGroupDDL,
  workplaceDDL,
  departmentDDL,
  designationDDL,
  addHandler,
  handleSearch,
  setfilterAnchorEl,
}) => {
  return (
    <div className="card-about-info-main about-info-card">
      <div
        className="d-flex align-items-between justify-content-between"
        onClick={() => setIsAccordion(!isAccordion)}
      >
        <button className="btn-see-more">
          <p
            style={{
              color: gray700,
              fontWeight: 600,
              fontSize: "14px",
              margin: "0px 10px",
            }}
          >
            Filter
          </p>
        </button>

        <div>
          {isAccordion ? (
            <KeyboardArrowUpIcon
              sx={{
                fontSize: "25px",
                color: gray900,
                position: "relative",
              }}
            />
          ) : (
            <KeyboardArrowDownIcon
              sx={{
                fontSize: "25px",
                color: gray900,
                position: "relative",
              }}
            />
          )}
        </div>
      </div>

      {isAccordion && (
        <>
          <hr style={{ marginTop: "0px", paddingTop: "0px" }} />
          <div className="px-2">
            <div className="row">
              <div className="col-lg-3">
                <label>Business Unit</label>
                <FormikSelect
                  styles={customStyles}
                  placeholder={" "}
                  name="businessUnit"
                  options={
                    [
                      {
                        value: 0,
                        label: "All",
                      },
                      ...businessUnitDDL,
                    ] || []
                  }
                  value={values?.businessUnit}
                  onChange={(valueOption) => {
                    getCombineAllDDL(
                      orgId,
                      valueOption?.value || 0,
                      values?.workplaceGroup?.value || 0,
                      values?.workplace?.value || 0,
                      values?.department?.value || 0,
                      values?.designation?.value || 0,
                      values?.employeeType?.value || 0,
                      setAllDDL
                    );
                    setFieldValue("workplaceGroup", "");
                    setFieldValue("workplace", "");
                    setFieldValue("department", "");
                    setFieldValue("designation", "");
                    setFieldValue("businessUnit", valueOption);
                    getFilterValues("businessUnit", valueOption);
                    setIsFormOpen(false);
                    setRowDto([]);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <label>Workplace Group</label>
                <FormikSelect
                  styles={customStyles}
                  placeholder={" "}
                  name="workplaceGroup"
                  options={
                    [
                      {
                        value: 0,
                        label: "All",
                      },
                      ...workplaceGroupDDL,
                    ] || []
                  }
                  value={values?.workplaceGroup}
                  onChange={(valueOption) => {
                    getCombineAllDDL(
                      orgId,
                      values?.businessUnit?.value || 0,
                      valueOption?.value || 0,
                      values?.workplace?.value || 0,
                      values?.department?.value || 0,
                      values?.designation?.value || 0,
                      values?.employeeType?.value || 0,
                      setAllDDL
                    );
                    setFieldValue("workplace", "");
                    setFieldValue("department", "");
                    setFieldValue("designation", "");
                    setFieldValue("workplaceGroup", valueOption);
                    getFilterValues("workplaceGroup", valueOption);
                    setIsFormOpen(false);
                    setRowDto([]);
                  }}
                  isDisabled={!values?.businessUnit}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <label>Workplace</label>
                <FormikSelect
                  styles={customStyles}
                  placeholder={" "}
                  name="workplace"
                  options={
                    [
                      {
                        value: 0,
                        label: "All",
                      },
                      ...workplaceDDL,
                    ] || []
                  }
                  value={values?.workplace}
                  onChange={(valueOption) => {
                    getCombineAllDDL(
                      orgId,
                      values?.businessUnit?.value || 0,
                      values?.workplaceGroup?.value || 0,
                      valueOption?.value || 0,
                      values?.department?.value || 0,
                      values?.designation?.value || 0,
                      values?.employeeType?.value || 0,
                      setAllDDL
                    );
                    setFieldValue("department", "");
                    setFieldValue("designation", "");
                    setFieldValue("workplace", valueOption);
                    getFilterValues("workplace", valueOption);
                    setIsFormOpen(false);
                    setRowDto([]);
                  }}
                  isDisabled={!values?.workplaceGroup}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <label>Department</label>
                <FormikSelect
                  styles={customStyles}
                  placeholder={" "}
                  name="department"
                  options={
                    [
                      {
                        value: 0,
                        label: "All",
                      },
                      ...departmentDDL,
                    ] || []
                  }
                  value={values?.department}
                  onChange={(valueOption) => {
                    getCombineAllDDL(
                      orgId,
                      values?.businessUnit?.value || 0,
                      values?.workplaceGroup?.value || 0,
                      values?.workplace?.value || 0,
                      valueOption?.value || 0,
                      values?.designation?.value || 0,
                      values?.employeeType?.value || 0,
                      setAllDDL
                    );
                    setFieldValue("designation", "");
                    setFieldValue("department", valueOption);
                    getFilterValues("department", valueOption);
                    setIsFormOpen(false);
                    setRowDto([]);
                  }}
                  isDisabled={!values?.workplace}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <label>Designation</label>
                <FormikSelect
                  styles={customStyles}
                  name="designation"
                  placeholder={" "}
                  options={
                    [
                      {
                        value: 0,
                        label: "All",
                      },
                      ...designationDDL,
                    ] || []
                  }
                  value={values?.designation}
                  onChange={(valueOption) => {
                    getCombineAllDDL(
                      orgId,
                      values?.businessUnit?.value || 0,
                      values?.workplaceGroup?.value || 0,
                      values?.workplace?.value || 0,
                      values?.department?.value || 0,
                      valueOption?.value || 0,
                      values?.employeeType?.value || 0,
                      setAllDDL
                    );
                    setFieldValue("designation", valueOption);
                    getFilterValues("designation", valueOption);
                    setIsFormOpen(false);
                    setRowDto([]);
                  }}
                  isDisabled={!values?.department}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div
                style={{
                  marginTop: "23px",
                }}
                className="col-md-6"
              >
                <button
                  type="button"
                  className="btn btn-green btn-green-disable"
                  style={{ width: "auto" }}
                  label="View"
                  disabled={
                    !values?.businessUnit ||
                    !values?.workplaceGroup ||
                    !values?.workplace ||
                    !values?.department ||
                    !values?.designation
                  }
                  onClick={(e) => {
                    addHandler(values);
                    handleSearch(values);
                    setIsAccordion(!isAccordion);
                    setfilterAnchorEl(e.currentTarget);
                    setIsFormOpen(true);
                  }}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterForm;
