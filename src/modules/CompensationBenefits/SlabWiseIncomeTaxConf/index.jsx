import DefaultInput from "common/DefaultInput";
import NoResult from "common/NoResult";
import { useFormik } from "formik";

const SlabWiseIncomeTaxConf = () => {
  // const

  const { handleSubmit, values, errors, touched, setFieldValue, setValues } =
    useFormik({
      enableReinitialize: true,
      initialValues: {
        fromDate: "",
        toDate: "",
      },
      onSubmit: () => {
        //
      },
    });
  return (
    <form onSubmit={handleSubmit}>
      <div className="table-card">
        <div className="table-card-heading">
          <div className="d-flex align-items-center">
            <h2 className="ml-1">Slab Wise Income Tax Configuration</h2>
          </div>
          <div className="table-card-head-right"></div>
        </div>
        <div className="table-card-body">
          <div className="card-style" style={{ margin: "14px 0px 12px 0px" }}>
            <div className="row">
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>From Date</label>
                  <DefaultInput
                    classes="input-sm"
                    placeholder=" "
                    value={values?.fromDate}
                    name="fromDate"
                    type="date"
                    onChange={(e) => {
                      setValues((prev) => ({
                        ...prev,
                        fromDate: e.target.value,
                      }));
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>To Date</label>
                  <DefaultInput
                    classes="input-sm"
                    placeholder=" "
                    value={values?.toDate}
                    name="toDate"
                    type="date"
                    onChange={(e) => {
                      setValues((prev) => ({
                        ...prev,
                        toDate: e.target.value,
                      }));
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              {/* <div className="col-12">
                <NoResult title={"Coming Soon"} para="Under Construction" />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SlabWiseIncomeTaxConf;
