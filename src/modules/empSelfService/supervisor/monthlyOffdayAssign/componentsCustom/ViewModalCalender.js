import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Avatar } from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { APIUrl } from "../../../../../App";
import CommonEmpInfo from "../../../../../common/CommonEmpInfo";
import CalenderCommon from "../calenderCommonCustom";

const ViewModalCalender = ({ propsObj }) => {
  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const {
    singleAssign,
    checkedList,
    selectedSingleEmployee,
    profileImg,
    setShowModal,
    calendarData,
    setCalendarData,
    setSingleAssign,
    handleSave,
    isAssignAll,
    setValue,
    // currMonthName,
    // currYear,
    // prevMonth,
    // nextMonth,
  } = propsObj;
  const [monthYear, setMonthYear] = useState(moment().format("YYYY-MM"));
  const prevMonth = () => {
    setMonthYear((prev) =>
      moment(prev).subtract(1, "months").format("YYYY-MM")
    );
  };

  const nextMonth = () => {
    setMonthYear((prev) => moment(prev).add(1, "months").format("YYYY-MM"));
  };

  const currMonthName = () => moment(monthYear).format("MMMM");
  const currYear = () => moment(monthYear).format("YYYY");

  return (
    <>
      <div className="mr-3">
        <div className="row">
          <div className="col-4 px-2">
            {checkedList?.length > 0 && !isAssignAll && (
              <p className="ml-3 mb-2">
                Total Selected {checkedList?.length}
                {/* {resLanding?.filter((data) => data?.selectCheckbox)?.length}{" "} */}
              </p>
            )}
            {isAssignAll && (
              <p className="ml-3 mb-2">Assigning all employees</p>
            )}
            {isAssignAll || (
              <div style={{ height: "300px", overflow: "scroll" }}>
                {singleAssign ? (
                  <div>
                    <img
                      className="ml-4 mb-1"
                      src={
                        selectedSingleEmployee[0]?.profileImageUrl
                          ? `${APIUrl}/Document/DownloadFile?id=${selectedSingleEmployee[0]?.profileImageUrl}`
                          : profileImg
                      }
                      alt=""
                      style={{ maxHeight: "48px", minWidth: "48px" }}
                    />
                    <CommonEmpInfo
                      classes="ml-4"
                      employeeName={selectedSingleEmployee[0]?.employeeName}
                      designationName={selectedSingleEmployee[0]?.designation}
                      departmentName={selectedSingleEmployee[0]?.department}
                    />
                  </div>
                ) : (
                  checkedList?.map((data, index) => (
                    <ol className="mb-2" key={index}>
                      <li>
                        <div>
                          <Avatar
                            className="ml-4 mb-1"
                            sx={{
                              mt: 0.2,
                              "&.MuiAvatar-root": {
                                width: "22px!important",
                                height: "22px!important",
                              },
                            }}
                          />
                        </div>

                        <CommonEmpInfo
                          classes="ml-4"
                          employeeName={data?.employeeName}
                          designationName={data?.designation}
                          departmentName={data?.department}
                        />
                      </li>
                    </ol>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="col-8">
            <div className="d-flex align-items-center justify-content-center mb-2">
              <KeyboardArrowLeftIcon className="pointer" onClick={prevMonth} />
              <p style={{ fontSize: "20px" }}>
                {currMonthName() + `, ` + currYear()}
              </p>
              <KeyboardArrowRightIcon className="pointer" onClick={nextMonth} />
            </div>
            <div className="mr-2">
              <CalenderCommon
                orgId={orgId}
                setShowModal={setShowModal}
                monthYear={monthYear}
                calendarData={calendarData}
                setCalendarData={setCalendarData}
                isClickable={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end py-3 pr-4">
        <ul className="d-flex flex-wrap">
          <li>
            <button
              onClick={() => {
                setShowModal(false);
                setSingleAssign(false);
                setCalendarData([]);
              }}
              type="button"
              className="btn btn-cancel mr-2"
            >
              Cancel
            </button>
          </li>
          <li>
            <button
              onClick={handleSave}
              type="button"
              className="btn btn-green flex-center"
            >
              Save
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ViewModalCalender;
