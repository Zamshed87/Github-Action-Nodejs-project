import axios from "axios";
import AvatarComponent from "../../../common/AvatarComponent";

export const getAllLocationAssignLanding = async (
  orgId,
  buId,
  setAllData,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/TimeSheet/GetEmployeeListLocationBasedByAccountId?IntAccountId=${orgId}&IntBusinessUnitId=${buId}`
    );
    if (res?.data) {
      setAllData && setAllData(res.data);
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getAllLocation = async (
  orgId,
  buId,
  setAllData,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/TimeSheet/GetLocationDashBoardByAccountId?IntAccountId=${orgId}&IntBusinessUnitId=${buId}`
    );
    if (res?.data) {
      setAllData && setAllData(res.data);
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const remoteLocationColumn = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (text, record, index) =>
        (page - 1) * paginationSize + index + 1,
      className: "text-center",
    },
    {
      title: "Employee",
      dataIndex: "strEmployeeName",
      render: (data) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent classess="" letterCount={1} label={data} />
            <span className="ml-2">{data}</span>
          </div>
        );
      },
      sorter: true,
      filter: true,
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      filter: true,
    },
    {
      title: "Loation Name",
      dataIndex: "locationList",
      render: (_, record) => (
        <div>
          {record?.locationList?.map((data, i) => (
            <div key={i}>
              <span style={{ fontWeight: 600 }}>{data?.strPlaceName}</span> (
              {data?.strStatus})
            </div>
          ))}
        </div>
      ),
    },
  ];
};
