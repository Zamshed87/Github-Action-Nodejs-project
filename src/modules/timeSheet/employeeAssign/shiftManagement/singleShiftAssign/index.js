import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import Loading from "../../../../../common/loading/Loading";
import FormikSelect from "../../../../../common/FormikSelect";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import AntTable from "../../../../../common/AntTable";
import { Tooltip } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { createShiftManagement, getCalenderDDL } from "../helper";
import { toast } from "react-toastify";
import moment from "moment";
import CalenderCommon from "../component/CalenderCommon";
import CalenderBulk from "../component/CalenderBulk";

const initialValues = {
  shiftName: "",
};
const validationSchema = Yup.object().shape({
  shiftName: Yup.object()
    .shape({
      label: Yup.string().required("Shift is required"),
      value: Yup.string().required("Shift is required"),
    })
    .typeError("Shift is required"),
});
function SingleShiftAssign({
  listId,
  setCreateModal,
  setSingleAssign,
  getData,
  pages,
  calendarData,
  setCalendarData,
  singleShiftData = [],
  uniqueShiftColor = [],
  uniqueShiftBg = [],
  uniqueShift = [],
  isMargin = false,
}) {
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  const [rosterDDL, setRosterDDL] = useState([]);

  useEffect(() => {
    getCalenderDDL(
      `/Employee/GetCalenderDdl?intAccountId=${orgId}&intBusinessUnitId=${buId}`,
      "intCalenderId",
      "strCalenderName",
      setRosterDDL
    );
  }, [orgId, buId]);

  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: initialValues,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const dateArray = calendarData?.filter((item) => item?.isActive);
      const modifiedData = dateArray?.map((item) => {
        return {
          shiftName: values?.shiftName,
          date: moment().format(
            `YYYY-MM-${item?.intDayId < 10 ? "0" : ""}${item?.intDayId}`
          ),
        };
      });

      const similarProperties = modifiedData.filter((property1) =>
        rowDto.every((property2) => property2.date !== property1.date)
      );

      if (similarProperties?.length === 0) {
        toast.warn("Shift already assigned for this date range");
        return;
      }

      setRowDto((prev) => [...rowDto, ...similarProperties]);
      resetForm(initialValues);
    },
  });

  const handleShiftAssignSubmit = () => {
    const calenderShifts = rowDto.map((item) => {
      return {
        intCalenderId: item?.shiftName?.value,
        strCalenderName: item?.shiftName?.strCalenderName,
        dteStartTime: item?.shiftName?.dteStartTime,
        dteExtendedStartTime: item?.shiftName?.dDteExtendedStartTime,
        dteLastStartTime: item?.shiftName?.dteLastStartTime,
        dteEndTime: item?.shiftName?.dteEndTime,
        numMinWorkHour: item?.shiftName?.numMinWorkHour,
        dteBreakStartTime: item?.shiftName?.dteBreakStartTime,
        dteBreakEndTime: item?.shiftName?.dteBreakEndTime,
        dteOfficeStartTime: item?.shiftName?.dteOfficeStartTime,
        dteOfficeCloseTime: item?.shiftName?.dteOfficeCloseTime,
        isNightShift: item?.shiftName?.isNightShif,
        fromdate: item.date,
        todate: item.date,
      };
    });
    const data = { ...listId };
    const stringLine = Object.values(data);

    const payload = {
      intEmployeeId: stringLine.join(", "),
      shifts: calenderShifts,
      IntActionBy: employeeId,
    };
    const callBack = () => {
      setSingleAssign(false);
      setCreateModal(false);
      getData(pages);
    };
    createShiftManagement(payload, setLoading, callBack);
  };
  const handleRowDtoDelete = (id) => {
    const updatedData = rowDto.filter((item, index) => index !== id);
    setRowDto(updatedData);
    const removeDate = moment(rowDto[id].date).format("D");
    const modifiedData = calendarData.map((item) => {
      if (Number(item?.intDayId) === Number(removeDate)) {
        return {
          ...item,
          isActive: false,
        };
      } else {
        return item;
      }
    });
    setCalendarData(modifiedData);
  };

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
      title: "Shift Name",
      dataIndex: "shiftName",
      render: (_, record, index) => (
        <div className="d-flex align-items-center">
          <p className="ml-2">{record.shiftName.label}</p>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
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
      {loading && <Loading />}
      <>
        {calendarData?.filter((item) => item?.isActive).length > 0 ? (
          <form onSubmit={handleSubmit} className="mb-2 shadow-sm pl-2 mr-3">
            <div className="">
              <div className="table-card-body">
                <div className="col-md-12 px-0">
                  <div className="">
                    <div className="row d-flex ml-1">
                      <label className="pt-2">Shift</label>
                      <div className="col-lg-6">
                        <div className="input-field-main ">
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
                      <div className="col-lg-4 ">
                        <div className="" style={{ marginLeft: "-15px" }}>
                          <button type="submit" className="btn btn-default">
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : (
          ""
        )}
        {singleShiftData.length > 0 && (
          <div className=" mr-3">
            <CalenderCommon
              orgId={orgId}
              setShowModal={setCreateModal}
              monthYear={moment().format("YYYY-MM")}
              calendarData={calendarData}
              setCalendarData={setCalendarData}
              isClickable={true}
              singleShiftData={singleShiftData}
              uniqueShiftColor={uniqueShiftColor}
              uniqueShiftBg={uniqueShiftBg}
            />
            <div className=" my-2 d-flex justify-content-around">
              {uniqueShift.length > 0 &&
                uniqueShift.map((item, index) => (
                  <div key={index} className="text-center">
                    <p
                      style={{
                        borderRadius: "99px",
                        fontSize: "14px",
                        padding: "2px 5px",
                        fontWeight: 500,
                        color: `${uniqueShiftColor[item]}`,
                        backgroundColor: `${uniqueShiftBg[item]}`,
                      }}
                    >{`${item} Shift `}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
        {singleShiftData.length === 0 && (
          <div className=" mr-3">
            <CalenderBulk
              orgId={orgId}
              setShowModal={setCreateModal}
              monthYear={moment().format("YYYY-MM")}
              calendarData={calendarData}
              setCalendarData={setCalendarData}
              isClickable={true}
            />
            <div className=" my-2 d-flex justify-content-around">
              {uniqueShift.length > 0 &&
                uniqueShift.map((item, index) => (
                  <div key={index} className="text-center">
                    <p
                      style={{
                        borderRadius: "99px",
                        fontSize: "14px",
                        padding: "2px 5px",
                        fontWeight: 500,
                        color: `${uniqueShiftColor[item]}`,
                        backgroundColor: `${uniqueShiftBg[item]}`,
                      }}
                    >{`${item}`}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
        <div
          className={`table-card-body  mt-3 ${rowDto?.length > 0 ? `  ` : ""}`}
        >
          <div
            style={{ height: "120px", overflow: "scroll" }}
            className="table-card-styled mr-3 tableOne "
          >
            {rowDto?.length > 0 ? (
              <>
                <AntTable
                  data={rowDto
                    .slice(0)
                    .sort((a, b) => a.date.localeCompare(b.date))}
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
      </>
      <div
        style={
          isMargin
            ? { marginTop: "50px", marginRight: "-8.5em" }
            : { marginTop: "50px" }
        }
        className="d-flex justify-content-end mb-2 "
      >
        <ul className="d-flex flex-wrap">
          <li>
            <button
              onClick={() => {
                setCreateModal(false);
              }}
              type="button"
              className="btn btn-cancel mr-2"
            >
              Cancel
            </button>
          </li>
          <li>
            <button
              onClick={() => handleShiftAssignSubmit()}
              type="button"
              className="btn btn-green flex-center"
              disabled={!rowDto?.length}
            >
              Save
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
export default SingleShiftAssign;
