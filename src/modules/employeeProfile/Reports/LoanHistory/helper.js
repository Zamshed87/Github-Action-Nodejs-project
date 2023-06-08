import axios from "axios";
import AvatarComponent from "../../../../common/AvatarComponent";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { LightTooltip } from "../../../../common/LightTooltip";
import { InfoOutlined } from "@mui/icons-material";
import Chips from "../../../../common/Chips";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    if (!keywords) {
      setRowDto(allData);
      return;
    }
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter((item) =>
      regex.test(item?.employeeName?.toLowerCase())
    );
    setRowDto(newDta);
  } catch (e) {
    setRowDto([]);
  }
};

export const getLoanApplicationByAdvanceFilter = async (
  pages,
  setPages,
  setAllData,
  setter,
  setLoading,
  payload
) => {
  setLoading && setLoading(true);
  try {
    let res = await axios.post(
      `/Employee/GetLoanApplicationByAdvanceFilter`,
      payload
    );
    setPages({
      ...pages,
      current: pages.current,
      pageSize: pages.pageSize,
      total: res?.data[0]?.totalCount,
    });
    setLoading && setLoading(false);
    setAllData && setAllData(res?.data);
    setter(res?.data);
  } catch (err) {
    setLoading && setLoading(false);
    setter([]);
  }
};

export const loanReportColumns = (pages) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => {
        return (
          <span>
            {pages?.current === 1
              ? index + 1
              : (pages.current - 1) * pages?.pageSize + (index + 1)}
          </span>
        );
      },
      sorter: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      sorter: true,
      filter: true,
    },
    {
      title: "Employee",
      dataIndex: "employeeName",
      render: (strEmployeeName) => (
        <div className="d-flex align-items-center">
          <AvatarComponent
            classess=""
            letterCount={1}
            label={strEmployeeName}
          />
          <span className="ml-2">{strEmployeeName}</span>
        </div>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Designation",
      dataIndex: "designationName",
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      sorter: true,
      filter: true,
    },
    {
      title: "Application Date",
      dataIndex: "applicationDate",
      isDate: true,
      render: (_, record) => dateFormatter(record?.applicationDate),
    },
    {
      title: "Loan Type",
      dataIndex: "loanType",
      render: (data, record) => (
        <div>
          <LightTooltip
            title={
              <div className="application-tooltip">
                <h6>Reason</h6>
                <span className="tableBody-title">{record?.description}</span>
              </div>
            }
            arrow
          >
            <InfoOutlined className="mr-1" />
          </LightTooltip>
          <span>{record?.loanType}</span>
        </div>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Loan Amount",
      dataIndex: "loanAmount",
      render: (data, record) => (
        <>
          <span>BDT {record?.loanAmount}</span>
        </>
      ),
      sorter: true,
      filter: true,
      isNumber: true,
    },
    {
      title: "Installment",
      dataIndex: "numberOfInstallment",
      sorter: true,
      filter: true,
      isNumber: true,
    },
    {
      title: "Approval",
      dataIndex: "applicationStatus",
      render: (_, record) => (
        <>
          {record?.applicationStatus === "Approved" && (
            <Chips label="Approved" classess="success" />
          )}
          {record?.applicationStatus === "Pending" && (
            <Chips label="Pending" classess="warning" />
          )}
          {record?.applicationStatus === "Rejected" && (
            <Chips label="Rejected" classess="danger" />
          )}
        </>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Status",
      dataIndex: "installmentStatus",
      render: (_, record) => (
        <>
          {record?.installmentStatus === "Completed" && (
            <Chips label="Completed" classess="success" />
          )}
          {record?.installmentStatus === "Running" && (
            <Chips label="Running" classess="warning" />
          )}
          {record?.installmentStatus === "Not Started" && (
            <Chips label="Not Started" classess="danger" />
          )}
          {record?.installmentStatus.toLowerCase() === "deleted" && (
            <Chips label="Deleted" classess="primary p-2" />
          )}
        </>
      ),
      sorter: true,
      filter: true,
    },
  ];
};
