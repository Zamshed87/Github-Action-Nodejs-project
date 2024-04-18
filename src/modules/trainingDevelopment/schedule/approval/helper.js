import { Cancel, CheckCircle } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import Chips from "../../../../common/Chips";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import MuiIcon from "../../../../common/MuiIcon";
import { gray900, greenColor } from "../../../../utility/customColor";
import {
  dateFormatter,
  dayMonthYearFormatter,
} from "../../../../utility/dateFormatter";

export const getAllTrainingScheduleListDataForApproval = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/TrainingScheduleLandingEngine`,
      payload
    );
    if (res?.data) {
      setAllData && setAllData(res?.data);
      setter(res?.data);
    }
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const TrainingScheduleApproveReject = async (payload, cb) => {
  try {
    const res = await axios.post(
      `/ApprovalPipeline/TrainingScheduleApprovalEngine`,
      payload
    );
    cb && cb();
    toast.success(res?.data || "Submitted Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

export const scheduleApprovalColumn = (
  setFieldValue,
  page,
  paginationSize,
  demoPopupForTable,
  filterLanding,
  landingApproval,
  setFilterLanding,
  setLandingApproval
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
    },
    {
      title: () => (
        <div className="d-flex align-items-center">
          <div className="mr-2">
            <FormikCheckBox
              styleObj={{
                margin: "0 auto!important",
                padding: "0 !important",
                color: gray900,
                checkedColor: greenColor,
              }}
              name="allSelected"
              checked={
                filterLanding?.length > 0 &&
                filterLanding?.every((item) => item?.selectCheckbox)
              }
              onChange={(e) => {
                const data = filterLanding.map((item) => ({
                  ...item,
                  selectCheckbox: e.target.checked,
                }));
                const data2 = landingApproval.map((item) => ({
                  ...item,
                  selectCheckbox: e.target.checked,
                }));
                setFilterLanding(data);
                setLandingApproval(data2);
                setFieldValue("allSelected", e.target.checked);
              }}
            />
          </div>
          <div>Training Code</div>
        </div>
      ),
      dataIndex: "trainingCode",
      render: (_, record) => (
        <div className="d-flex align-items-center">
          <div className="mr-2" onClick={(e) => e.stopPropagation()}>
            <FormikCheckBox
              styleObj={{
                margin: "0 auto!important",
                color: gray900,
                checkedColor: greenColor,
                padding: "0px",
              }}
              name="selectCheckbox"
              color={greenColor}
              checked={record?.selectCheckbox}
              onChange={(e) => {
                const data = filterLanding?.map((item) => {
                  if (
                    item?.application?.intScheduleId ===
                    record?.application?.intScheduleId
                  ) {
                    return {
                      ...item,
                      selectCheckbox: e.target.checked,
                    };
                  } else return item;
                });
                const data2 = landingApproval?.map((item) => {
                  if (
                    item?.application?.intScheduleId ===
                    record?.application?.intScheduleId
                  ) {
                    return {
                      ...item,
                      selectCheckbox: e.target.checked,
                    };
                  } else return item;
                });
                setFilterLanding(data);
                setLandingApproval(data2);
              }}
            />
          </div>
          <div className="d-flex align-items-center">
            <span className="ml-2">{record?.trainingCode}</span>
          </div>
        </div>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Name",
      dataIndex: "trainingName",
      sorter: true,
      filter: true,
    },
    // {
    //   title: "Resource Person Name",
    //   dataIndex: "resourcePersonName",
    //   sorter: true,
    //   filter: true,
    // },
    {
      title: "Training Duration",
      dataIndex: "fromDate",
      sorter: true,
      filter: true,
      isDate: true,
      render: (_, record) => {
        return (
          <div>
            {dayMonthYearFormatter(record?.fromDate)} -{" "}
            {dayMonthYearFormatter(record?.toDate)}
          </div>
        );
      },
    },
    {
      title: "Duration",
      dataIndex: "totalDuration",
      sorter: true,
      filter: true,
      render: (_, record) => {
        return <div>{record?.totalDuration} Hours</div>;
      },
    },
    {
      title: "Venue",
      dataIndex: "venue",
      sorter: true,
      filter: true,
    },
    {
      title: "Batch No",
      dataIndex: "batchNo",
      sorter: true,
      filter: true,
    },
    {
      title: "Application Date",
      dataIndex: "createdAt",
      render: (_, data) => <div>{dateFormatter(data?.createdAt)}</div>,
      filter: false,
      sorter: false,
      isDate: true,
    },
    {
      title: "Waiting Stage",
      dataIndex: "currentStage",
      filter: false,
      sorter: false,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, data) => (
        <div className="text-center action-chip" style={{ width: "70px" }}>
          {data?.status === "Approved" && (
            <Chips label="Approved" classess="success" />
          )}
          {data?.status === "Pending" && (
            <>
              <div className="actionChip">
                <Chips label="Pending" classess=" warning" />
              </div>
              <div className="d-flex actionIcon justify-content-center">
                <Tooltip title="Accept">
                  <div
                    className="mx-2 muiIconHover success "
                    onClick={() => {
                      demoPopupForTable("approve", "Approve", data);
                    }}
                  >
                    <MuiIcon icon={<CheckCircle sx={{ color: "#34A853" }} />} />
                  </div>
                </Tooltip>
                <Tooltip title="Reject">
                  <div
                    className="muiIconHover danger"
                    onClick={() => {
                      demoPopupForTable("reject", "Reject", data);
                    }}
                  >
                    <MuiIcon icon={<Cancel sx={{ color: "#FF696C" }} />} />
                  </div>
                </Tooltip>
              </div>
            </>
          )}
          {data?.status === "Rejected" && (
            <Chips label="Rejected" classess="danger" />
          )}
        </div>
      ),
      filter: false,
      sorter: false,
    },
  ];
};
