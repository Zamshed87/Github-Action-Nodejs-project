import { Form, Formik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FormikSelect from "../../../../../common/FormikSelect";
import NoResult from "../../../../../common/NoResult";
import { gray500, gray700 } from "../../../../../utility/customColor";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { yearDDLAction } from "../../../../../utility/yearDDL";
import { getAllAnnouncement } from "../../helper";

const initData = {
  monthYear: moment().format("YYYY-MM"),
};

export default function NoticeBoard({
  allNoticeData,
  setShow,
  setSingleNoticeData,
  employeeId,
  orgId,
  buId,
  setAllNoticeData,
}) {
  const [date, setDate] = useState({
    year: moment().year(),
    month: moment().month() + 1,
  });
  const { wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getAllAnnouncement(
      buId,
      orgId,
      employeeId,
      +date?.year,
      setAllNoticeData,
      wgId
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, orgId, employeeId, date]);

  const isNew = (createdDate) =>
    Math.floor(
      moment
        .duration(
          moment(
            moment().format("YYYY-MM-DDThh:mm:ss"),
            "YYYY-MM-DDThh:mm:ss"
          ).diff(createdDate)
        )
        .asDays()
    ) <= 3;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          monthYear: {
            value: 2023,
            label: "2023",
          },
        }}
      >
        {({ handleSubmit, errors, touched, setFieldValue, values }) => (
          <Form
            onSubmit={handleSubmit}
            className="h-100"
            style={{ overflow: "hidden" }}
          >
            <div style={{ display: "grid", placeItems: "left", height: "20%" }}>
              <h2
                style={{
                  color: gray500,
                  fontSize: "1rem",
                  fontWeight: 600,
                  width: "100%",
                  margin: "10px 0",
                }}
              >
                Notice Board
              </h2>
              <div className="input-field-main" style={{ width: "150px" }}>
                <FormikSelect
                  name="monthYear"
                  options={yearDDLAction(5, 10) || []}
                  value={values?.monthYear}
                  onChange={(valueOption) => {
                    setDate({
                      year: valueOption?.value,
                      month: "",
                    });
                    setFieldValue("monthYear", valueOption);
                  }}
                  isClearable={false}
                  styles={customStyles}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
            <div
              style={{
                height: "90%",
                overflowX: "hidden",
                overflowY: "auto",
                cursor: "pointer",
              }}
            >
              {allNoticeData.length < 1 ? (
                <NoResult />
              ) : (
                <div className="h-100 mt-3">
                  {allNoticeData?.map((item) => (
                    <div
                      key={item?.intAnnouncementId}
                      className="d-flex"
                      style={{
                        paddingBottom: "12px",
                      }}
                      onClick={() => {
                        setShow(true);
                        setSingleNoticeData(item);
                      }}
                    >
                      {/* <div className="mr-2">
                        <img src={NoticeIcon} alt="" />
                      </div> */}
                      <div className="noticeCardStyle">
                        <p style={{ color: gray500, fontSize: "14px" }}>
                          {item?.strTitle}
                        </p>
                        <div className="d-flex align-items-center">
                          <p style={{ color: gray700, fontWeight: 500 }}>
                            {dateFormatter(item?.dteCreatedAt)}
                          </p>

                          {isNew(item?.dteCreatedAt) && (
                            <p
                              style={{
                                marginLeft: "12px",
                                color: "#B42318",
                                padding: "1px 8px",
                                fontWeight: 500,
                                fontSize: "10px",
                                backgroundColor: "#FEE4E2",
                                borderRadius: "99px",
                              }}
                            >
                              New
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
