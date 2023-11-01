import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { gray700 } from "../../../../utility/customColor";
import { getMonthwithYear } from "../../../../utility/dateFormatter";

const SingleScheduleCard = ({ item, handleRowDtoDelete, handleEdit }) => {
  const {
    id,
    serialNo,
    trainingName,
    resourcePerson,
    requestedBy,
    batchSize,
    batchNo,
    fromDate,
    toDate,
    duration,
    venue,
    remarks,
  } = item;

  return (
    <div
      className="d-flex justify-content-between"
      style={{
        backgroundColor: "#F9FAFB",
        width: "100%",
        padding: "10px 30px",
        border: "1px solid #D0D5DD",
        borderRadius: "5px",
      }}
    >
      <div className="d-flex">
        <div
          className=""
          style={{ fontSize: "14px", color: "#101828", fontWeight: "bold" }}
        >
          #{serialNo}
        </div>
        <div className="d-flex" style={{ marginLeft: "50px" }}>
          <div
            className=""
            style={{ display: "flex", flexDirection: "column", gap: "1px" }}
          >
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Training Name -
                </small>
                <span className="ml-2">{trainingName?.label}</span>
                {/* {dateFormatter(singleData?.SeparationDate)} */}
              </p>
            </div>
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Resource Person -
                </small>
                <span className="ml-2">{resourcePerson}</span>
                {/* {dateFormatter(singleData?.SeparationDate)} */}
              </p>
            </div>
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Requested By -
                </small>
                <span className="ml-2">{requestedBy?.label || "N/A"}</span>
                {/* {dateFormatter(singleData?.SeparationDate)} */}
              </p>
            </div>
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Batch Size -
                </small>
                <span className="ml-2">{batchSize}</span>
                {/* {dateFormatter(singleData?.SeparationDate)} */}
              </p>
            </div>
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Batch No -
                </small>
                <span className="ml-2">{`#${batchNo}` || "N/A"}</span>
                {/* {dateFormatter(singleData?.SeparationDate)} */}
              </p>
            </div>
          </div>
          <div
            className=""
            style={{
              marginLeft: "50px",
              display: "flex",
              flexDirection: "column",
              gap: "1px",
            }}
          >
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Month-Year -
                </small>
                <span className="ml-2">{getMonthwithYear(fromDate)}</span>
                {/* {dateFormatter(singleData?.SeparationDate)} */}
              </p>
            </div>
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Date -
                </small>
                <span className="ml-2">
                  {fromDate} - {toDate}
                </span>
                {/* {dateFormatter(singleData?.SeparationDate)} */}
              </p>
            </div>
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Duration -
                </small>
                <span className="ml-2">{duration} Hours</span>
                {/* {dateFormatter(singleData?.SeparationDate)} */}
              </p>
            </div>
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Venue -
                </small>
                <span className="ml-2">{venue}</span>
                {/* {dateFormatter(singleData?.SeparationDate)} */}
              </p>
            </div>
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Remarks -
                </small>
                <span className="ml-2">{remarks}</span>
                {/* {dateFormatter(singleData?.SeparationDate)} */}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex">
        <div className="d-flex" style={{}}>
          <CreateOutlinedIcon sx={{ fontSize: "18px", cursor: "pointer" }} />
          <p
            className="ml-1"
            style={{ fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}
            onClick={() => handleEdit(id)}
          >
            Edit
          </p>
        </div>
        <div className="d-flex ml-4">
          <DeleteOutlineOutlinedIcon
            sx={{ fontSize: "18px", cursor: "pointer" }}
          />
          <p
            className="ml-1"
            style={{ fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}
            onClick={() => handleRowDtoDelete(id)}
          >
            Delete
          </p>
        </div>
      </div>
    </div>
  );
};

export default SingleScheduleCard;
