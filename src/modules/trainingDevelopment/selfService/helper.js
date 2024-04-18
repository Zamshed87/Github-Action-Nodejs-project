import axios from "axios";
import { gray600 } from "../../../utility/customColor";
import { dateFormatter } from "../../../utility/dateFormatter";

export const attendanceColumn = (history, page, paginationSize) => {
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
      filter: true,
    },
    {
      title: "Name",
      dataIndex: "strTrainingName",
      sorter: true,
      filter: true,
    },
    {
      title: () => <span style={{ color: gray600 }}>Training Date</span>,
      dataIndex: "dteFromDate",
      render: (dteFromDate, record) => (
        <div className="d-flex align-items-center">
          <div>
            {`${dateFormatter(dteFromDate)} - ${dateFormatter(
              record?.dteToDate
            )}`}
          </div>
        </div>
      ),
      filter: false,
      sorter: false,
    },
    {
      title: () => <span style={{ color: gray600 }}>Duration</span>,
      dataIndex: "numTotalDuration",
      render: (numTotalDuration) => (
        <div className="d-flex align-items-center ml-2">
          <div>{numTotalDuration + " Hrs"}</div>
        </div>
      ),
      filter: false,
      sorter: false,
    },
    {
      title: () => <span style={{ color: gray600 }}>Venue</span>,
      dataIndex: "strVenue",
    },
    // {
    //   title: () => <span style={{ color: gray600 }}>Batch No (Size)</span>,
    //   // dataIndex: "dateRange",
    //   render: (_, record) => (
    //     <div className="d-flex align-items-center ml-2">
    //       <div>
    //         {`${record?.strBatchNo} (${record?.intBatchSize})`}
    //       </div>
    //     </div>
    //   ),
    //   filter: false,
    //   sorter: false,
    // },
    // {
    //   title: "Assign Size",
    //   dataIndex: "totalRequisition",
    //   render: (_, record) => (
    //     <div className="d-flex align-items-center ml-2">
    //       <div>
    //         {record?.totalRequisition}
    //       </div>
    //     </div>
    //   ),
    // },
  ];
};
export const allAttendanceList = async (
  accId,
  buId,
  employeeId,
  setLoading,
  setter,
  setAllData
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Training/GetTrainingSelfAssesmentLanding?intAccountId=${accId}&intEmployeeId=${employeeId}&intBusinessUnitId=${buId}`
    );
    setter(res?.data);
    setAllData(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
    setAllData([]);
  }
};
