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
  setPages,
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

    console.log("res?.data", res?.data);

    if (res?.data) {
      const modifiedData = res?.data?.data?.map((item, index) => ({
        ...item,
        initialSerialNumber: index + 1,
      }));

      setter && setter?.(modifiedData);

      setPages({
        current: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        total: res?.data?.totalCount,
      });

      setLoading && setLoading(false);
    }
  } catch (err) {
    setLoading && setLoading(false);
    setter([]);
  }
};

export const loanReportColumns = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      width: 60,
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Employee",
      dataIndex: "employeeName",
      render: (item) => (
        <div className="d-flex align-items-center">
          <AvatarComponent
            classess=""
            letterCount={1}
            label={item?.strEmployeeName}
          />
          <span className="ml-2">{item?.strEmployeeName}</span>
        </div>
      ),
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "designationName",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Application Date",
      dataIndex: "applicationDate",
      render: (record) => dateFormatter(record?.applicationDate),
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "Loan Type",
      dataIndex: "loanType",
      render: (record) => (
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
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "Loan Amount",
      dataIndex: "loanAmount",
      render: (record) => (
        <>
          <span>BDT {record?.loanAmount}</span>
        </>
      ),
      sort: true,
      filter: false,
      fieldType: "number",
    },
    {
      title: "Installment",
      dataIndex: "numberOfInstallment",
      sort: true,
      filter: false,
      fieldType: "number",
    },
    {
      title: "Approval",
      dataIndex: "applicationStatus",
      render: (record) => (
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
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Status",
      dataIndex: "installmentStatus",
      render: (record) => (
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
      sort: true,
      filter: false,
      fieldType: "string",
    },
  ];
};
