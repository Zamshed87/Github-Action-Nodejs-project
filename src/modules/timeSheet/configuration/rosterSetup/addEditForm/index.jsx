import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FormikInput from "../../../../../common/FormikInput";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
import { getPeopleDeskAllDDL } from "common/api";

const RosterSetupCreate = ({ id, setFieldValue, touched, errors, values }) => {
  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [organizationDDL, setOrganizationDDL] = useState([]);
  const [workPlaceDDL, setWorkPlaceDDL] = useState([]);
  const [, setLoader] = useState(false);

  useEffect(() => {
    getPeopleDeskAllDDL(
      // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=${employeeId}`,
      `/PeopleDeskDdl/WorkplaceGroupWithRoleExtension?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&empId=${employeeId}`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setOrganizationDDL
    );
    getPeopleDeskAllDDL(
      // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      `/PeopleDeskDdl/WorkplaceWithRoleExtension?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&empId=${employeeId}`,
      "intWorkplaceId",
      "strWorkplace",
      setWorkPlaceDDL
    );
  }, [buId]);

  return (
    <>
      <div className="row">
        {/* workPlaceGroup */}
        <div className="col-md-4">
          <label className="mb-2">Workplace Group </label>
          <FormikSelect
            isDisabled={id}
            classes="input-sm"
            styles={customStyles}
            name="orgName"
            options={organizationDDL || []}
            value={values?.orgName}
            onChange={(valueOption) => {
              setLoader(true);
              setFieldValue("orgName", valueOption);
              setFieldValue("workplace", "");

              getPeopleDeskAllDDL(
                // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${valueOption.value}&intId=${employeeId}`,
                `/PeopleDeskDdl/WorkplaceWithRoleExtension?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${valueOption.value}&empId=${employeeId}`,
                "intWorkplaceId",
                "strWorkplace",
                setWorkPlaceDDL
              );
              setLoader(false);
            }}
            errors={errors}
            touched={touched}
            placeholder=" "
            isClearable={false}
            menuPosition="fixed"
          />
        </div>
        {/* workPlace */}
        <div className="col-md-4">
          <label className="mb-2">Workplace </label>
          <FormikSelect
            isDisabled={id}
            classes="input-sm"
            styles={customStyles}
            name="workplace"
            options={
              [
                {
                  value: 0,
                  label: "All",
                },
                ...workPlaceDDL,
              ] || []
            }
            value={values?.workplace || { value: -1, label: "" }}
            onChange={(valueOption) => {
              setFieldValue("workplace", valueOption);
            }}
            errors={errors}
            touched={touched}
            placeholder=" "
            isClearable={true}
            menuPosition="fixed"
          />
        </div>
        <div className="col-md-4">
          <label className="mb-2">Roster Name </label>
          <FormikInput
            classes="input-sm"
            value={values?.rosterGroupName}
            name="rosterGroupName"
            type="text"
            className="form-control"
            placeholder=""
            onChange={(e) => {
              setFieldValue("rosterGroupName", e.target.value);
            }}
            errors={errors}
            touched={touched}
          />
        </div>
      </div>
    </>
  );
};

export default RosterSetupCreate;
