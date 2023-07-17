import { InfoOutlined } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";

import AvatarComponent from "../../../common/AvatarComponent";
import Chips from "../../../common/Chips";
import { LightTooltip } from "../../../common/LightTooltip";
import { gray600, gray900 } from "../../../utility/customColor";
import { dateFormatterForInput, dayMonthYearFormatter } from "../../../utility/dateFormatter";
import moment from "moment";

export const trainingScheduleColumn = (
  history,
  page,
  paginationSize,
  demoPopup,
  setAnchorEl,
  setAnchorEl2,
  setIsEdit,
  permission,
  setSingleData,
  setValues,
  setAnchorEl3
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      className: "text-center",
    },
    {
      title: "Code",
      dataIndex: "strTrainingCode",
      sorter: true,
    },
    {
      title: "Name",
      dataIndex: "strTrainingName",
      sorter: true,
      filter: true,
    },
    {
      title: "Resource Person",
      dataIndex: "strResourcePersonName",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.strResourcePersonName}
            />
            <span className="ml-2">{record?.strResourcePersonName}</span>
          </div>
        );
      },
      className: "text-left",
    },
    {
      title: () => <span style={{ color: gray600 }}>Training Period</span>,
      dataIndex: "dteFromDate",
      render: (_, record) => {
        return (
          <div>
            {dayMonthYearFormatter(record?.dteFromDate)} -{" "}
            {dayMonthYearFormatter(record?.dteToDate)}
          </div>
        );
      },
    },
    {
      title: () => <span style={{ color: gray600 }}>Duration</span>,
      dataIndex: "numTotalDuration",
      render: (_, record) => {
        return <div>{record?.numTotalDuration} Hours</div>;
      },
    },
    {
      title: () => <span style={{ color: gray600 }}>Venue</span>,
      dataIndex: "strVenue",
    },
    {
      title: () => <span style={{ color: gray600 }}>Batch No (Size)</span>,
      dataIndex: "strBatchNo",
      className: "text-left",
    },
    {
      title: "Status",
      dataIndex: "strStatus",
      render: (_, item) => (
        <div>
          {item?.strStatus === "Approved" && (
            <Chips label="Approved" classess="success p-2" />
          )}
          {item?.strStatus === "Pending" && (
            <Chips label="Pending" classess="warning p-2" />
          )}
          {item?.strStatus === "Rejected" && (
            <>
              <Chips label="Rejected" classess="danger p-2 mr-2" />
              {item?.RejectedBy && (
                <LightTooltip
                  title={
                    <div className="p-1">
                      <div className="mb-1">
                        <p
                          className="tooltip-title"
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          Rejected by {item?.RejectedBy}
                        </p>
                      </div>
                    </div>
                  }
                  arrow
                >
                  <InfoOutlined
                    sx={{
                      color: gray900,
                    }}
                  />
                </LightTooltip>
              )}
            </>
          )}
        </div>
      ),
      filter: true,
    },
    
 
    {
      title: "Course Extention",
      dataIndex: "strStatus",
      key: "strStatus",
      width: 120,
      render: (_, item) => {
        return (
          <div className="d-flex">
            {item?.strStatus === "Approved" && moment().format() < moment(item?.dteCourseCompletionDate).format() ? (
                <button
                style={{
                  height: "24px",
                  fontSize: "12px",
                  padding: "0px 12px 0px 12px",
                }}
                className="btn btn-default btn-assign ml-1"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!permission?.isCreate)
                    return toast.warn("You don't have permission");
                  setAnchorEl2(e.currentTarget);
                  setSingleData(item);
                  setValues((prev) => {
                    return {
                      ...prev,
                      extendDate: item?.dteExtentedDate
                        ? dateFormatterForInput(item?.dteExtentedDate)
                        : '',
                    };
                  });
                }}
              >
                Extend Date
              </button>
              
            ) : ( 
              item?.strStatus==="Approved" && moment().format() > moment(item?.dteCourseCompletionDate).format() && <Chips label="Completed" classess="success p-2" />

            )}
          </div>
        );
      },
    },
    {
      title: "Final Assessment Submission",
      dataIndex: "strStatus",
      key: "strStatus",
      width: 150,
      render: (_, item) => {
        return (
          <div className="d-flex">
            {item?.strStatus === "Approved" && moment().format() < moment(item?.dteCourseCompletionDate).format() ? (
                <button
                style={{
                  height: "24px",
                  fontSize: "12px",
                  padding: "0px 12px 0px 12px",
                }}
                className="btn btn-default btn-assign ml-1"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!permission?.isCreate)
                    return toast.warn("You don't have permission");
                  setAnchorEl3(e.currentTarget);
                  setSingleData(item);
                  setValues((prev) => {
                    return {
                      ...prev,
                      lastAssesmentDate: item?.dteLastAssesmentSubmissionDate
                        ? dateFormatterForInput(item?.dteLastAssesmentSubmissionDate)
                        : '',
                    };
                  });
                }}
              >
                Final Submission
              </button>
              
            ) : ( 
              item?.strStatus==="Approved" && moment().format() > moment(item?.dteCourseCompletionDate).format() && <Chips label="Completed" classess="success p-2" />


            )}
          </div>
        );
      },
    },
    {
      title: "Course Duration",
      dataIndex: "strStatus",
      key: "strStatus",
      width: 170,
      render: (_, item) => {
        return (
          <div className="d-flex">
            {item?.strStatus === "Approved" && moment().format() < moment(item?.dteCourseCompletionDate).format() ? (
                <button
                style={{
                  height: "24px",
                  fontSize: "12px",
                  padding: "0px 12px 0px 12px",
                }}
                className="btn btn-default btn-assign ml-1"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!permission?.isCreate)
                    return toast.warn("You don't have permission");
                  setAnchorEl(e.currentTarget);
                  setSingleData(item)
                  setValues((prev) => {
                    return {
                      ...prev,
                      confirmDate: item?.dteCourseCompletionDate
                        ? dateFormatterForInput(item?.dteCourseCompletionDate)
                        : '',
                    };
                  });
                }}
              >Completion Date
              </button>
              
            ) : ( 
              item?.strStatus==="Approved" && moment().format() > moment(item?.dteCourseCompletionDate).format() && <Chips label="Completed" classess="success p-2" />

            )}
          </div>
        );
      },
    },
 
  ];
};


export const updateSchedule = async (payload,cb) => {
  
  try {
    const res = await axios.put(
      `/Training/UpdateTrainingSchedule`,
      payload
    );

    cb && cb();
    toast.success(
      res.data?.message ||
        `Successfully  "Updated"}`
    );
  } catch (error) {
  }
};