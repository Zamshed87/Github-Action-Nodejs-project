import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import PeopleDeskTable from "../../common/peopleDeskTable";
import { onBoardColumns } from "./helper";
import { monthFirstDate } from "../../utility/dateFormatter";
import { todayDate } from "../../utility/todayDate";
import { getTodayDateAndTime } from "../../utility/todayDateTime";
import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";
import Loading from "../../common/loading/Loading";
import NoResult from "../../common/NoResult";
import NotPermittedPage from "../../common/notPermitted/NotPermittedPage";
import useAxiosGet from "../../utility/customHooks/useAxiosGet";

const initData = {
  search: "",
  designation: "",
  filterFromDate: monthFirstDate(),
  filterToDate: todayDate(),
  confirmDate: getTodayDateAndTime(),
  pinNo: "",
};

function HiredeskOnboarding() {
  const dispatch = useDispatch();

  // const history = useHistory();
  const { orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading] = useState(false);
  const [resEmpLanding, setEmpLanding] = useState([]);
  const [, getLanding, ,] = useAxiosGet();

  // const open = Boolean(anchorEl);
  // const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
  }, [dispatch]);

  useEffect(() => {
    // getData(pages);
    getLanding(`/Employee/OnboardingFromHireDeskLanding`, (data) => {
      setEmpLanding(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wgId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30539) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        // onSubmit={(values, { setSubmitting, resetForm }) => {
        //   saveHandler(values, () => {
        //     resetForm(initData);
        //   });
        // }}
      >
        {({ handleSubmit }) => (
          <>
            {loading && <Loading />}
            <Form onSubmit={handleSubmit} className="employeeProfile-form-main">
              <div className="employee-profile-main">
                {permission?.isView ? (
                  <div className="table-card">
                    <div
                      className="table-card-heading justify-content-between"
                      style={{ marginBottom: "6px" }}
                    >
                      <div className="ml-2 ">
                        <div className="d-flex justify-content-between align-items-center">
                          {resEmpLanding?.length > 0 ? (
                            <>
                              <h6 className="count">
                                Total {resEmpLanding?.length} employee
                                {resEmpLanding?.length > 1 ? "s" : ""}
                              </h6>
                            </>
                          ) : (
                            <>
                              <h6 className="count">Total result 0</h6>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="table-card-body">
                      {resEmpLanding?.length > 0 ? (
                        <div className="table-card-styled employee-table-card tableOne mt-3">
                          <PeopleDeskTable
                            scrollCustomClass="confirmationScrollTable"
                            columnData={onBoardColumns(permission)}
                            // pages={pages}
                            rowDto={resEmpLanding}
                            uniqueKey="phoneNo"
                            isScrollAble={true}
                            isPagination={false}
                          />
                        </div>
                      ) : (
                        <NoResult title="No Result Found" para="" />
                      )}
                    </div>
                  </div>
                ) : (
                  <NotPermittedPage />
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default HiredeskOnboarding;
