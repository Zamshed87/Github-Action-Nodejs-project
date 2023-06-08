import React, { useEffect, useState } from "react";
import { shallowEqual,  useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
import * as Yup from "yup";
// import { setFirstLevelNameAction } from "../../../../../commonRedux/reduxForLocalStorage/actions";
import { useFormik } from "formik";
import Loading from "../../../../../common/loading/Loading";
// import BackButton from "../../../../../common/BackButton";
import FormikSelect from "../../../../../common/FormikSelect";
// import { customStyles } from "../../../../utility/selectCustomStyle";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import AntTable from "../../../../../common/AntTable";
import { Tooltip } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
// import Accordion from "../component/Accordion";
import {
  createShiftManagement,
  getCalenderDDL,
  // getEmployeeProfileViewData,
} from "../helper";
import { toast } from "react-toastify";
// import CalenderCommon from "../../monthlyOffdayAssign/calenderCommon";
import moment from "moment";
import CalenderCommon from "../component/CalenderCommon";
import CalenderBulk from "../component/CalenderBulk";

const initialValues = {
  shiftName: "",
  // fromDate: monthFirstDate(),
  // toDate: monthLastDate(),
};
const validationSchema = Yup.object().shape({
  shiftName: Yup.object()
    .shape({
      label: Yup.string().required("Shift is required"),
      value: Yup.string().required("Shift is required"),
    })
    .typeError("Shift is required"),
  // fromDate: Yup.string().required("From Date is required"),
  // toDate: Yup.string().required("To Date is required"),
});
function SingleShiftAssign({
  listId,
  setCreateModal,
  setSingleAssign,
  getData,
  pages,
  calendarData,
  setCalendarData,
  singleShiftData=[],
  uniqueShiftColor=[],
  uniqueShiftBg=[],
  uniqueShift=[]
}) {
  // console.log("-->",singleShiftData)
  // const params = useParams();
  // const dispatch = useDispatch();
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  // const [empBasic, setEmpBasic] = useState([]);

  const [rosterDDL, setRosterDDL] = useState([]);

  // const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  // let permission = null;
  // permissionList.forEach((item) => {
  //   if (item?.menuReferenceId === 30349) {
  //     permission = item;
  //   }
  // });

  // useEffect(() => {
  //   dispatch(setFirstLevelNameAction("Administration"));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    getCalenderDDL(
      `/Employee/GetCalenderDdl?intAccountId=${orgId}&intBusinessUnitId=${buId}`,
      "intCalenderId",
      "strCalenderName",
      setRosterDDL
    );
  }, [orgId, buId]);

  const { setFieldValue, values, errors, touched, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      validationSchema: validationSchema,
      initialValues: initialValues,
      onSubmit: (values, { setSubmitting, resetForm }) => {
        // if (params?.id) {
        //   // editSchedule([{ ...values, ...editField }], employeeId, orgId, buId);
        // } else {
          const dateArray=calendarData?.filter((item)=>item?.isActive)
          const modifiedData= dateArray?.map((item)=>{
            return {
              shiftName:values?.shiftName,
              date:moment().format(
                `YYYY-MM-${item?.intDayId < 10 ? "0" : ""}${item?.intDayId}`)
            }
          })
        // if (editField?.id) {
        //   let updated = rowDto?.filter((item) => item.id !== editField?.id);
        //   setRowDto([...updated, { id: editField?.id, ...values }]);
        //   setEditField({});
        // } else {
          const similarProperties = modifiedData.filter(property1 =>
            rowDto.every(property2 => property2.date !== property1.date)
          );
          // const isExist = rowDto?.filter(
          //   (item) =>
          //     item?.fromDate === values?.fromDate ||
          //     item?.toDate === values?.fromDate
          // );

          if (similarProperties?.length === 0) {
            toast.warn("Shift already assigned for this date range");
            return;
          }

          // const currId = id;
          // setId(currId + 1);
          setRowDto((prev) => [...rowDto, ...similarProperties]);
          // setRowDto((prev)=>[...prev,...newData]);
        // }
        resetForm(initialValues);
        // }
      },
    });
  // const getSingleData = () => {
  //   getEmployeeProfileViewData(params?.id, setEmpBasic, setLoading);
  // };
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
    const payload = {
      intEmployeeId: [...listId],
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
    const updatedData = rowDto.filter((item,index) => index !== id);
    setRowDto(updatedData);
   const removeDate=moment(rowDto[id].date).format("D")
    const modifiedData=calendarData.map(item=>{
      // console.log(item?.intDayId,Number(removeDate))
if(Number(item?.intDayId) === Number(removeDate)){

  return{
    ...item,
    isActive:false
  }
}else{
  return item
}
    })
    // console.log(modifiedData)
    setCalendarData(modifiedData)
  };
  // const handleEdit = (id) => {
  //   const updatedData = rowDto.filter((item) => item.id === id)[0];
  //   setEditField(updatedData);
  //   const newFieldValue = {
  //     shiftName: {
  //       label: updatedData?.shiftName?.label,
  //       value: updatedData?.shiftName?.value,
  //     },
  //     fromDate: dateFormatterForInput(updatedData?.fromDate),
  //     toDate: dateFormatterForInput(updatedData?.toDate),
  //   };
  //   setValues(newFieldValue);
  // };
  // useEffect(() => {
  //   getSingleData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  const columns = () => [
    {
      title: "SL",
      // dataIndex: "id",
      render: (_, record, index) => (
        <div className="d-flex align-items-center">
          <p className="ml-2">{index+1}</p>
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
    // {
    //   title: "To Date",
    //   dataIndex: "toDate",
    // },
    {
      className: "text-center",
      width: 100,
      render: (_, record, index) => (
        <div className="d-flex justify-content-center">
          {/* {record?.strStatus === "Pending" && !edit && ( */}
          {/* <Tooltip title="Edit" arrow>
            <button className="iconButton" type="button">
              <EditOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  //  console.log(record.id)
                  handleEdit(record.id);
                }}
              />
            </button>
          </Tooltip> */}
          <Tooltip title="Delete" arrow>
            <button className="iconButton" type="button">
              <DeleteOutlineOutlinedIcon
                onClick={(e) => {
                  e.stopPropagation();
                  //  console.log(record.id)
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
      {/* {permission?.isCreate ? ( */}
        <>
        {calendarData?.filter(item=>item?.isActive).length > 0 ?(
          <form onSubmit={handleSubmit} className="mb-2 shadow-sm pl-2 mr-3">
            <div className="">
              {/* <div className="table-card-heading">
                <div className="d-flex align-items-center">
                  <BackButton />
                  <h2>
                    {editField?.id ? "Edit Assigned Shift" : "New Shift Assign"}
                  </h2>
                </div>
                <div className="d-flex align-items-center">
                  <button
                    type="button"
                    className="btn btn-default flex-center"
                    onClick={handleShiftAssignSubmit}
                    disabled={!rowDto?.length}
                  >
                    Save
                  </button>
                </div>
              </div> */}

              {/* <div
                className="table-card-body card-style my-3"
                style={{ minHeight: "auto" }}
              > */}
              {/* <div className="mt-2">
                  <Accordion empBasic={empBasic} />
                </div> */}
              <div className="table-card-body">
                <div className="col-md-12 px-0">
                  {/* <div className="card-style"> */}
                  
                  <div className="">
                    
                    <div className="row d-flex ml-1">
                    <label className="pt-2">Shift</label>
                      <div className="col-lg-6">
                        <div className="input-field-main ">
                          {/* <label>Shift</label> */}
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
                      {/* <div className="col-lg-4">
                        <label>From Date</label>
                        <DefaultInput
                          classes="input-sm"
                          value={values?.fromDate}
                          name="fromDate"
                          type="date"
                          min={values?.fromDate}
                          max={values?.toDate}
                          placeholder=" "
                          onChange={(e) => {
                            setFieldValue("fromDate", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-4">
                        <div className="input-field-main">
                          <label>To date</label>
                          <DefaultInput
                            classes="input-sm"
                            value={values?.toDate}
                            name="toDate"
                            type="date"
                            min={values?.fromDate}
                            max={values?.toDate}
                            placeholder=" "
                            onChange={(e) => {
                              setFieldValue("toDate", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div> */}
                      {/* <div className="col-lg-9 "></div> */}
                      <div className="col-lg-4 ">
                        {/* {editField?.id ? (
                          <div className="" style={{ marginLeft: "35px" }}>
                            <button
                              type="submit"
                              className="btn btn-default flex-end"
                            >
                              Edit
                            </button>
                          </div>
                        ) : ( */}
                          <div className="" style={{ marginLeft: "-15px" }}>
                            <button type="submit" className="btn btn-default">
                              Add
                            </button>
                          </div>
                        {/* )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>
          </form>
          ) :'' }
          {singleShiftData.length > 0 && (
          <div  className=" mr-3">
            
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
                  {/* <p style={getChipStyleShift(item)}>{`${item} Shift `}</p> */}
                  <p style={{
                      borderRadius: "99px",
                      fontSize: "14px",
                      padding: "2px 5px",
                      fontWeight: 500,
                      color: `${uniqueShiftColor[item]}`,
                      backgroundColor: `${
                        uniqueShiftBg[item]
                      }`,
                    }}>{`${item} Shift `}</p>
                </div>
              ))}
          </div>
                  </div>
          )}
          {singleShiftData.length === 0 && (
          <div  className=" mr-3">
            
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
                  {/* <p style={getChipStyleShift(item)}>{`${item} Shift `}</p> */}
                  <p style={{
                      borderRadius: "99px",
                      fontSize: "14px",
                      padding: "2px 5px",
                      fontWeight: 500,
                      color: `${uniqueShiftColor[item]}`,
                      backgroundColor: `${
                        uniqueShiftBg[item]
                      }`,
                    }}>{`${item} Shift `}</p>
                </div>
              ))}
          </div>
                  </div>
          )}
          {/* {rowDto?.length > 0 ? ( */}
          <div
            className={`table-card-body  mt-3 ${
              rowDto?.length > 0 ? `  ` : ""
            }`}
          >
           
            <div 
            style={{ height: "120px", overflow: "scroll" }}
            className="table-card-styled mr-3 tableOne ">
              {rowDto?.length > 0 ? (
                <>
                  <AntTable
                    data={rowDto.slice(0).sort((a,b) => a.date.localeCompare(b.date))}
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
          {/* ):''} */}
        </>
      {/* ) : ( */}
        {/* <NotPermittedPage /> */}
      {/* )} */}
      <div
        style={{ marginTop: "50px" }}
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
