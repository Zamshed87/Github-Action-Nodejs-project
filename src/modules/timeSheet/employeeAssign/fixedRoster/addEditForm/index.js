/* eslint-disable react-hooks/exhaustive-deps */
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AntTable from "../../../../../common/AntTable";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import BackButton from "../../../../../common/BackButton";
import FormikInput from "../../../../../common/FormikInput";
import FormikSelect from "../../../../../common/FormikSelect";
import Loading from "../../../../../common/loading/Loading";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import CalenderBlank from "../component/CalenderBlank";
import {
  createNUpdateFixedRoaster,
  getCalenderDDL,
  getFixedRosterDetailsById,
} from "../helper";
import CalenderEdit from "../component/CalenderEdit";

const initData = {
  rosterName: "",
  shiftName: "",
};
const validationSchema = Yup.object().shape({
  shiftName: Yup.object()
    .shape({
      label: Yup.string().required("Shift is required"),
      value: Yup.string().required("Shift is required"),
    })
    .typeError("Shift is required"),
  rosterName: Yup.string()
    .required("Roster Name is required")
    .typeError("Roster Name is required"),
});
export default function FixedRosterCreateEdit() {
  // const history = useHistory();
  const params = useParams();
  const { state } = useLocation();
  const [rosterDDL, setRosterDDL] = useState([]);
  const history = useHistory();

  const { orgId, buId, employeeId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const colors = [
    "#299647",
    "#B54708",
    "#B42318",
    "#6927DA",
    "#3538CD",
    "#667085",
    "#667085",
  ];
  // eslint-disable-next-line
  const bgColors = [
    "#E6F9E9",
    "#FEF0C7",
    "#FEE4E2",
    "#ECE9FE",
    "#E0EAFF",
    "#F2F4F7",
    "#FEF0D7",
  ];
  const [loading, setLoading] = useState(false);
  const [calendar, setCalendar] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [uniqueShiftBg, setUniqueShiftBg] = useState({});
  const [uniqueShiftColor, setUniqueShiftColor] = useState({});
  const [isRosterSetup, setIsRosterSetup] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  useEffect(() => {
    getCalenderDDL(
      `/Employee/GetCalenderDdl?intBusinessUnitId=${buId}&IntWorkplaceId=${wId}`,
      "intCalenderId",
      "strCalenderName",
      setRosterDDL
    );
  }, [orgId, buId, wId]);
  useEffect(() => {
    setUniqueShiftColor([]);
    // console.log(rosterDDL, "rosterDDL")
    setUniqueShiftBg([]);
    if (rosterDDL?.length > 0) {
      let colorData = {};
      let colorDataBg = {};
      rosterDDL.forEach((status, index) => {
        colorData[status?.label] = colors[index % colors.length];
      });
      setUniqueShiftColor(colorData);
      rosterDDL.forEach((status, index) => {
        colorDataBg[status?.label] = bgColors[index % bgColors.length];
      });
      setUniqueShiftBg(colorDataBg);
    }
    // eslint-disable-next-line
  }, [rosterDDL]);
  // const saveHandler = (values, cb) => {
  //   if (rowDto?.length < 2)
  //     return toast.warn("Please add atleast two calender");

  //   let firstRowCalId = rowDto[0]?.calendarId;
  //   let lastRowNextCalId = rowDto[rowDto?.length - 1]?.nextCalenderId;

  //   // firstRowCalId and lastRowNextCalId should be equal
  //   if (firstRowCalId !== lastRowNextCalId) return toast.warn("Invalid circle");

  //   let payload = {
  //     partType: "Roster",
  //     timeSheetRosterJsons: [...rowDto],
  //   };

  //   // createTimeSheetAction(payload, setLoading, cb);
  // };
  // const setter = (values) => {
  //   // rosterGroup id means edit, user must clear all row data for editing
  //   if (rowDto?.[0]?.rosterId)
  //     return toast.warn("Please clear data , then add again");
  //   let payload = {
  //     calenderName: values?.calendarName?.label,
  //     rosterGroupId: +params?.id,
  //     calendarId: +values?.calendarName?.value,
  //     noOfDaysChange: values?.noOfChangeDays,
  //     nextCalenderId: +values?.nextCalendar?.value,
  //     nextCalendarName: values?.nextCalendar?.label,
  //     IntCreatedBy: employeeId,
  //   };
  //   setRowDto([...rowDto, payload]);
  // };

  const handlefixRosterSubmit = (values) => {
    const modifiedData = rowDto.map((item) => {
      return {
        intId: 0,
        intDay: Number(item?.intDayId),
        intCalendarId: item?.shiftName?.intCalenderId || 0,
        strCalendarName: item?.shiftName?.strCalenderName || "",
        isOffDay: item?.shiftName?.label === "off Day" ? true : false,
        isHoliday: item?.shiftName?.label === "Holiday" ? true : false,
        isActive: true,
      };
    });
    const payload = {
      intId: params?.id ? Number(params?.id) : 0,
      intAccountId: orgId,
      intBusinessUnit: buId,
      strRoasterName: values?.rosterName,
      isActive: true,
      intActionBy: employeeId,
      fixedRoasterDetails: modifiedData,
    };
    const cb = () => {
      setCalendarData([]);
      history.push("/administration/timeManagement/fixedRosterSetup");
    };
    createNUpdateFixedRoaster(payload, setLoading, cb);
  };
  const handleRowDtoDelete = (id) => {
    const updatedData = rowDto.filter((item, index) => index !== id);
    setRowDto(updatedData);
    const removeDate = rowDto[id].intDayId;
    const modifiedData = calendarData.map((item) => {
      if (item?.intDayId === removeDate) {
        const { shiftName, ...rest } = item;
        return {
          ...rest,
          isActive: false,
        };
      } else {
        return item;
      }
    });
    setCalendarData(modifiedData);
  };

  const getData = () => {
    getFixedRosterDetailsById(params?.id, setLoading, setCalendar);
  };

  useEffect(() => {
    getData();
  }, [orgId, buId, params]);

  const columns = () => [
    {
      title: "SL",
      render: (_, record, index) => (
        <div className="d-flex align-items-center">
          <p className="ml-2">{index + 1}</p>
        </div>
      ),
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "rosterName",
      //   render: (_, record, index) => (
      //     <div className="d-flex align-items-center">
      //       <p className="ml-2">{record.shiftName.label}</p>
      //     </div>
      //   ),
    },
    {
      title: "Shift Name",
      dataIndex: "shiftName",
      render: (_, record, index) => (
        <div className="d-flex align-items-center">
          <p className="ml-2">{record.shiftName.label}</p>
        </div>
      ),
    },
    {
      title: "Day",
      dataIndex: "intDayId",
    },
    {
      className: "text-center",
      width: 100,
      render: (_, record, index) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="Delete" arrow>
            <button className="iconButton" type="button">
              <DeleteOutlineOutlinedIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleRowDtoDelete(index);
                }}
              />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          params?.id ? { ...initData, rosterName: state } : initData
        }
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const dateArray = calendarData?.filter((item) => item?.isActive);
          const modifiedData = dateArray?.map((item) => {
            return {
              rosterName: values?.rosterName,
              shiftName: values?.shiftName,
              intDayId: item?.intDayId,
            };
          });
          const similarProperties = modifiedData.filter((property1) =>
            rowDto.every(
              (property2) => property2.intDayId !== property1.intDayId
            )
          );
          if (similarProperties?.length === 0) {
            toast.warn("Already assigned for this day");
            return;
          }
          const temp = [...rowDto, ...similarProperties];
          setRowDto(temp.slice(0).sort((a, b) => a.intDayId - b.intDayId));
          setIsRosterSetup(false);
          let data = calendarData?.map((item) => {
            if (item?.isActive && !item?.shiftName) {
              return {
                ...item,
                shiftName: values?.shiftName.label,
                color: uniqueShiftColor[values?.shiftName.label],
                bg: uniqueShiftBg[values?.shiftName.label],
              };
            } else {
              return item;
            }
          });
          setCalendarData(data);
          //   saveHandler(values, () => {
          //     // don't reset form, not use ful for the purpose
          //     // resetForm(initData);
          //   });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          setValues,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {loading && <Loading />}
            <Form onSubmit={handleSubmit}>
              {/* {loading && <Loading />} */}

              <div className="table-card">
                <div className="table-card-heading mb12">
                  <div className="d-flex align-items-center">
                    <BackButton />
                    <h2>{params?.id ? "Edit " : "New Fixed Roster Setup"}</h2>
                  </div>
                  {!params?.id ? (
                    <ul className="d-flex flex-wrap">
                      <li>
                        <button
                          type="button"
                          className="btn btn-default flex-center"
                          onClick={() => handlefixRosterSubmit(values)}
                          disabled={rowDto?.length < 31}
                        >
                          Save
                        </button>
                      </li>
                    </ul>
                  ) : (
                    <ul className="d-flex flex-wrap">
                      <li>
                        <button
                          type="button"
                          className="btn btn-default flex-center"
                          onClick={() => handlefixRosterSubmit(values)}
                          disabled={rowDto?.length < 30}
                        >
                          Edit
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
                <div className="table-card-body">
                  <div className="col-md-12 px-0 mt-3">
                    <div className="card-style">
                      <div className="row">
                        <div className="col-lg-3">
                          <div className="policy-category-ddl-wrapper">
                            <label>Roster Name </label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.rosterName}
                              placeholder=""
                              name="rosterName"
                              type="text"
                              // label={"Roster Name"}
                              className="form-control"
                              onChange={(e) => {
                                setFieldValue("rosterName", e.target.value);
                              }}
                              disabled={rowDto.length > 0}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        {isRosterSetup && (
                          <div className="col-lg-3">
                            <div className="policy-category-ddl-wrapper">
                              <label>Calendar Name </label>
                              <FormikSelect
                                placeholder=" "
                                classes="input-sm"
                                styles={customStyles}
                                name="shiftName"
                                options={rosterDDL || []}
                                isClearable={false}
                                value={values?.shiftName}
                                onChange={(valueOption) => {
                                  setFieldValue("shiftName", valueOption);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                        )}

                        <div className="col-lg-3 mt-4">
                          {params?.id ? (
                            <div className="">
                              <button
                                type="submit"
                                className="btn btn-default flex-center"
                              >
                                Add
                              </button>
                            </div>
                          ) : (
                            <div className="">
                              <button
                                type="submit"
                                className="btn btn-default flex-center"
                              >
                                Add
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div
                    style={{ height: "420px" }}
                    className="table-card-styled mr-3 mt-2 tableOne "
                  >
                    {rowDto?.length > 0 ? (
                      <>
                        <AntTable
                          data={rowDto
                            .slice(0)
                            .sort((a, b) => a.intDayId - b.intDayId)}
                          columnsData={columns()}
                          removePagination={true}
                          onRowClick={(dataRow) => {}}
                        />
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="col-6 mt-3 " style={{ width: "100px" }}>
                  {params?.id ? (
                    <CalenderEdit
                      setIsRosterSetup={setIsRosterSetup}
                      calendar={calendar}
                      calendarData={calendarData}
                      monthYear={"2023-03"}
                      setCalendarData={setCalendarData}
                      isClickable={true}
                      uniqueShiftBg={uniqueShiftBg}
                      rosterDDL={rosterDDL}
                      uniqueShiftColor={uniqueShiftColor}
                    />
                  ) : (
                    <CalenderBlank
                      setIsRosterSetup={setIsRosterSetup}
                      monthYear={"2023-03"}
                      calendarData={calendarData}
                      setCalendarData={setCalendarData}
                      isClickable={true}
                      uniqueShiftBg={uniqueShiftBg}
                      rosterDDL={rosterDDL}
                      uniqueShiftColor={uniqueShiftColor}
                    />
                  )}
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
