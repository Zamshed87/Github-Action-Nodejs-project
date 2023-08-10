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
  wId,
  partType,
  buId,
  workplaceGroupId,
  formDate,
  toDate,
  setter,
  setLoading,
  srcTxt,
  isPaginated,
  pageNo,
  pageSize,
  setPages,
  pages
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/OvertimeReportLanding?PartType=${partType}&BusinessUnitId=${buId}&WorkplaceGroupId=${workplaceGroupId}&WorkplaceId=${wId}&FromDate=${formDate}&ToDate=${toDate}&SearchText=${srcTxt}&IsPaginated=${isPaginated}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res?.data) {
      setter(res?.data);
      setPages({
        current: pages?.current,
        pageSize: pages?.pageSize,
        total: res?.data[0]?.totalCount,
      });
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
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      width: 50,
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      sort: false,
      filter: false,
      width: 100,
      fixed: "left",
    },
    {
      title: "Employee",
      dataIndex: "employee",
      sort: false,
      filter: false,
      render: (item) => (
        <div className="d-flex align-items-center justify-content-start">
          <div className="emp-avatar">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={item?.employee}
            />
          </div>
          <div className="ml-2">
            <span>{item?.employee}</span>
          </div>
        </div>
      ),
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sort: false,
      filter: false,
      width: 200,
    },
    {
      title: "Department",
      dataIndex: "department",
      sort: false,
      filter: false,
      width: 200,
    },
    {
      title: "Employment Type",
      dataIndex: "employementType",
      sort: false,
      filter: false,
      width: 200,
    },
    {
      title: "Overtime Date",
      dataIndex: "overTimeDate",
      isDate: true,
      render: (record) => dateFormatter(record?.overTimeDate),
      width: 100,
      sort: false,
      filter: false,
    },
    {
      title: "Salary",
      dataIndex: "salary",
      sort: false,
      filter: false,
      width: 80,
    },
    {
      title: "Basic",
      dataIndex: "basicSalary",
      sort: false,
      filter: false,
      width: 80,
    },
    {
      title: "Hour",
      dataIndex: "hours",
      sort: false,
      filter: false,
      width: 80,
    },
    {
      title: "Hour Amount Rate",
      dataIndex: "perHourRate",
      sort: false,
      filter: false,
      width: 200,
      render: (data) => {
        return <span className="text-right">{data?.perHourRate}</span>;
      },
    },
    {
      title: "Total Amount",
      dataIndex: "Hour Amount Rate",
      sort: false,
      filter: false,
      width: 100,
      fixed: "right",
      render: (data) => {
        return (
          <span className="text-right">
            {numberWithCommas(data?.payAmount)}{" "}
          </span>
        );
      },
    },
  ];
};
