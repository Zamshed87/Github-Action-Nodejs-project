import axios from "axios";
import AvatarComponent from "../../../common/AvatarComponent";
import { gray600 } from "../../../utility/customColor";
import { dateFormatter } from "../../../utility/dateFormatter";

export const allRequisitionList = async (
  orgId,
  buId,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Training/GetApprovedTrainingRequisitionLanding?intAccountId=${orgId}&intBusinessUnitId=${buId}`
    );
    setter(res?.data);
    setAllData(res?.data);
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
    setAllData([]);
  }
};

export const trainingRequisitionColumn = (history, page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      className: "text-center",
      width: 30,
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
      title: "Trainer Name",
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
      dataIndex: "dteTrainingDate",
      render: (_, record) => {
        return (
          <div>
            {dateFormatter(record?.dteFromDate)} -{" "}
            {dateFormatter(record?.dteToDate)}
          </div>
        );
      },
      sorter: false,
    },
    {
      title: () => <span style={{ color: gray600 }}>Duration</span>,
      dataIndex: "numTotalDuration",
      render: (duration) => {
        return <div>{duration} Hrs</div>;
      },
    },
    {
      title: () => <span style={{ color: gray600 }}>Venue</span>,
      dataIndex: "strVenue",
    },
    {
      title: () => <span style={{ color: gray600 }}>Batch No (Size)</span>,
      className: "text-left",
      render: (_, record) => {
        return (
          <div>
            <span className="ml-2">
              {record?.strBatchNo}({record?.intBatchSize})
            </span>
          </div>
        );
      },
    },
    {
      title: "Assign Size",
      dataIndex: "totalRequisition",
      render: (_, record) => (
        <div className="d-flex align-items-center ml-2">
          <div>{record?.totalRequisition}</div>
        </div>
      ),
    },
  ];
};
