import axios from "axios";
import AvatarComponent from "../../../../common/AvatarComponent";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { numberWithCommas } from "../../../../utility/numberWithCommas";
export const getBuDetails = async (buId, setter, setLoading) => {
  try {
    const res = await axios.get(
      `/SaasMasterData/GetBusinessDetailsByBusinessUnitId?businessUnitId=${buId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
  }
};
// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    if (!keywords) {
      setRowDto(allData);
      return;
    }
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter((item) =>
      regex.test(item?.employee?.toLowerCase())
    );
    setRowDto(newDta);
  } catch (e) {
    setRowDto([]);
  }
};

export const getOvertimeReportLanding = async (
  partType,
  orgId,
  buId,
  workplaceGroupId,
  deptId,
  desigId,
  employeeId,
  formDate,
  toDate,
  setAllData,
  setter,
  setLoading,
  setTableRowDto
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/OvertimeReportLanding?PartType=${partType}&BusinessUnitId=${buId}&WorkplaceGroupId=${workplaceGroupId}&FromDate=${formDate}&ToDate=${toDate}`
    );
    if (res?.data) {
      setAllData && setAllData(res.data);
      setter(res?.data);
      setTableRowDto((prev) => ({
        ...prev,
        data: res?.data,
        totalCount: res?.data?.length,
      }));
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
export const empOverTimeDtoCol = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      sorter: false,
      filter: false,
      width: 60,
      className: "text-center",
      fixed: "left",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      sorter: true,
      filter: true,
      width: 100,
      fixed: "left",
    },
    {
      title: "Employee Name",
      dataIndex: "employee",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.employee}
            />
            <span className="ml-2">{record?.employee}</span>
          </div>
        );
      },
      sorter: true,
      fixed: "left",
      width: 250,
      filter: true,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sorter: true,
      filter: true,
      width: 200,
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: true,
      filter: true,
      width: 200,
    },
    {
      title: "Employment Type",
      dataIndex: "employementType",
      sorter: true,
      filter: true,
      width: 200,
    },
    {
      title: "Overtime Date",
      dataIndex: "overTimeDate",
      isDate: true,
      render: (_, record) => dateFormatter(record?.overTimeDate),
      width: 100,
    },
    {
      title: "Salary",
      dataIndex: "salary",
      sorter: true,
      width: 80,
    },
    {
      title: "Basic",
      dataIndex: "basicSalary",
      sorter: true,
      width: 80,
    },
    {
      title: "Hour",
      dataIndex: "hours",
      sorter: true,
      width: 80,
    },
    {
      title: "Hour Amount Rate",
      dataIndex: "perHourRate",
      sorter: true,
      width: 200,
      render: (_, data) => {
        return <span className="text-right">{data?.perHourRate}</span>;
      },
    },
    {
      title: "Total Amount",
      dataIndex: "Hour Amount Rate",
      sorter: true,
      width: 100,
      fixed: "right",
      render: (_, data) => {
        return (
          <span className="text-right">
            {numberWithCommas(data?.payAmount)}{" "}
          </span>
        );
      },
    },
  ];
};
