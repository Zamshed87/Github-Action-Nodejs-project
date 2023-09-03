/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { SearchOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import AddEditFormComponent from "./AddEditForm";
import { getPayrollGradeAllLanding } from "./helper";
import "./styles.css";

const initData = {
  search: "",
};

export default function Grade() {
  const { buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);

  //  form states
  const [isFormModal, setIsFormModal] = useState(false);

  // demo table date

  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);

  const getData = () => {
    getPayrollGradeAllLanding(
      "PayscaleGrade",
      buId,
      setRowDto,
      setAllData,
      setLoading
    );
  };
  // const obj = {tableName:"PayrollGroup",buId, orgId, empId, setRowDto,setAllData, setLoading };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  // search
  const filterData = (keywords) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter(
        (item) =>
          regex.test(item?.strGrade?.toLowerCase()) ||
          regex.test(item?.strPayrollGroup?.toLowerCase())
      );
      setRowDto(newDta);
    } catch (error) {
      setRowDto([]);
    }
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 74) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="col-md-12">
                  <div className="table-card">
                    <div className="table-card-heading justify-content-end">
                      <div className="table-card-head-right">
                        <FormikInput
                          classes="search-input fixed-width "
                          inputClasses="search-inner-input"
                          placeholder="Search"
                          value={values?.search}
                          onChange={(e) => {
                            filterData(e.target.value, allData, setRowDto);
                            setFieldValue("search", e.target.value);
                          }}
                          name="search"
                          type="text"
                          trailicon={
                            <SearchOutlined
                              sx={{ color: "rgba(0, 0, 0, 0.7)" }}
                            />
                          }
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="table-card-body mt-2">
                      <div className="table-responsive table-card-styled tableOne">
                        <table className="table align-middle">
                          <thead style={{ color: "#212529" }}>
                            <tr>
                              <th>
                                <div className="pl-3">SL</div>
                              </th>
                              <th>
                                <div className="d-flex align-items-center justify-content-start">
                                  Payroll Group
                                  {/* <SortingIcon /> */}
                                </div>
                              </th>
                              <th>
                                <div className="d-flex align-items-center justify-content-start">
                                  Payscale Grade
                                  {/* <SortingIcon /> */}
                                </div>
                              </th>
                              <th>
                                <div className="d-flex align-items-center justify-content-center">
                                  Minimum
                                  {/* <SortingIcon /> */}
                                </div>
                              </th>
                              <th>
                                <div className="d-flex align-items-center justify-content-center">
                                  Maximum
                                  {/* <SortingIcon /> */}
                                </div>
                              </th>
                              <th>
                                <div className="d-flex align-items-center justify-content-center">
                                  Yearly Inc. Amount
                                  {/* <SortingIcon /> */}
                                </div>
                              </th>
                              <th>
                                <div className="d-flex align-items-center justify-content-center">
                                  Max Inc. Year
                                  {/* <SortingIcon /> */}
                                </div>
                              </th>
                              {/* <th></th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className="pl-3 tableBody-title">
                                      {index + 1}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="tableBody-title">
                                      {item?.strPayrollGroup}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="tableBody-title text-left">
                                      {item?.strGrade}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="tableBody-title text-center">
                                      {item?.numMinBasic}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="tableBody-title text-center">
                                      {item?.numMaxBasic}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="tableBody-title text-center">
                                      {item?.numYearlyIncrementAmount}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="tableBody-title text-center">
                                      {item?.intMaxIncrementYear}
                                    </div>
                                  </td>

                                  {/* <td>
                                        <div className="hover-icon">
                                          <button onClick={() => setIsFormModal(true)} className="border-icon " style={{ marginRight: "16px", height: "25px", width: "25px" }}>
                                            <Tooltip title="Edit">
                                              <EditOutlined />
                                            </Tooltip>
                                          </button>
                                        </div>
                                      </td> */}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}

              {/* addEdit form Modal */}
              <AddEditFormComponent
                show={isFormModal}
                title={"Create Grade"}
                onHide={() => setIsFormModal(false)}
                size="lg"
                backdrop="static"
                classes="default-modal"
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
