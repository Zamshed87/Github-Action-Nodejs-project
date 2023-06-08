import React from "react";
import BorderlessSelect from "../../../common/BorderlessSelect";
import { borderlessSelectStyle } from "../../../utility/BorderlessStyle";

const DemoFilterModal = ({ propsObj }) => {
  //   const { orgId, buId } = useSelector(
  //     (state) => state?.auth?.profileData,
  //     shallowEqual
  //   );
  const { getFilterValues, setFieldValue, values, errors, touched } = propsObj;

  //   const [allDDL, setAllDDL] = useState([]);
  //   useEffect(() => {
  //     getFilterDDLNewAction(buId, "", "", "", "", "", setAllDDL);
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [orgId, buId]);

  return (
    <>
      <div className="row align-items-center">
        <div className="col-md-4">
          <h3>Type</h3>
        </div>
        <div className="col-md-8 ml-0">
          <BorderlessSelect
            classes="input-sm"
            name="workplaceGroup"
            options={[]}
            value={values?.workplaceGroup}
            onChange={(valueOption) => {
              setFieldValue("department", "");
              setFieldValue("designation", "");
            }}
            placeholder=""
            styles={borderlessSelectStyle}
            errors={errors}
            touched={touched}
            isClearable={false}
            setClear={(name, val) => {
              getFilterValues("department", "");
              getFilterValues("designation", "");

              getFilterValues(name, "");
            }}
          />
        </div>
      </div>
    </>
  );
};

export default DemoFilterModal;
