import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import ViewModal from "../../../common/ViewModal";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatter } from "../../../utility/dateFormatter";
import "./bulkUploadHistory.css";
import { getSummaryBulkHistoryAction } from "./helper";
import HistoryDetails from "./HistoryDetails";

const initData = {};

export default function BulkUploadHistory() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [isShowModal, setIsShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const { buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values) => {};

  useEffect(() => {
    getSummaryBulkHistoryAction(setLoading, setData, buId);
  }, [buId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 136) {
      permission = item;
    }
  });

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
              <div className="overtime-entry bulk-upload-history">
                {permission?.isView ? (
                  <div className="table-card">
                    <div className="table-card-heading justify-content-end"></div>
                    <div className="table-card-body">
                      <div className="table-card-styled tableOne">
                        <table className="table">
                          <thead>
                            <tr>
                              <th
                                style={{
                                  textAlign: "center",
                                  minWidth: "40px",
                                }}
                              >
                                SL
                              </th>
                              <th>Insert Date</th>
                              <th>Total</th>
                              <th>Processed</th>
                              <th>Not Processed</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.map((item, index) => (
                              <tr>
                                <td
                                  style={{
                                    textAlign: "center",
                                    minWidth: "40px",
                                    color: "rgba(0, 0, 0, 0.6)",
                                  }}
                                >
                                  {index + 1}
                                </td>
                                <td>
                                  <div className="content tableBody-title">
                                    {dateFormatter(item?.InsertDate)}
                                  </div>
                                </td>
                                <td>
                                  <div className="content tableBody-title">
                                    {item?.TotalData}
                                  </div>
                                </td>
                                <td>
                                  <div
                                    onClick={(e) => {
                                      setCurrentItem({
                                        ...item,
                                        statusId: 1,
                                      });
                                      setIsShowModal(true);
                                    }}
                                    className="content tableBody-title blue-link"
                                  >
                                    {item?.Processed}
                                  </div>
                                </td>
                                <td>
                                  <div
                                    onClick={(e) => {
                                      setCurrentItem({
                                        ...item,
                                        statusId: 0,
                                      });
                                      setIsShowModal(true);
                                    }}
                                    className="content tableBody-title blue-link"
                                  >
                                    {item?.NotProcessed}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
      <ViewModal
        show={isShowModal}
        title={"Bulk Upload Details"}
        onHide={() => setIsShowModal(false)}
        size="xl"
        classes="bulk-upload-history-modal"
      >
        <HistoryDetails currentItem={currentItem} />
      </ViewModal>
    </>
  );
}
