import DefaultInput from "common/DefaultInput";
import NoResult from "common/NoResult";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { useFormik } from "formik";
import { shallowEqual, useSelector } from "react-redux";

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
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30413) {
      permission = item;
    }
  });
  return (
    <form onSubmit={handleSubmit}>
      {0 ? (
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
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <NotPermittedPage />
        </>
      )}
    </form>
  );
};

export default SlabWiseIncomeTaxConf;
