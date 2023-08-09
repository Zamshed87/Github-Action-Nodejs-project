import { EditOutlined, InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import Chips from "../../../common/Chips";
import { gray900 } from "../../../utility/customColor";
import { dateFormatter } from "../../../utility/dateFormatter";
import { numberWithCommas } from "../../../utility/numberWithCommas";
import { LightTooltip } from "../../employeeProfile/LoanApplication/helper";
import AvatarComponent from "../../../common/AvatarComponent";
import axios from "axios";

// export const empExpenceDtoCol = (history, page, paginationSize) => {
//   return [
//     {
//       title: "SL",
//       render: (text, record, index) => (page - 1) * paginationSize + index + 1,
//       className: "text-center",
//       width: 20,
//     },
//     {
//       title: "Expense Type",
//       dataIndex: "strExpenseType",
//       sorter: true,
//       filter: true,
//     },
//     {
//       title: "To Date",
//       dataIndex: "dteExpenseDate",
//       isDate: true,
//       render: (_, record) => dateFormatter(record?.dteExpenseDate),
//     },
//     {
//       title: "Expense Amount",
//       dataIndex: "numExpenseAmount",
//       sorter: true,
//       render: (_, record) => (
//         <span className="text-right">
//           {numberWithCommas(record?.numExpenseAmount)}
//         </span>
//       ),
//     },
//     {
//       title: "Reason",
//       dataIndex: "strDiscription",
//       sorter: true,
//     },
//     {
//       title: "Status",
//       dataIndex: "Status",
//       width: 100,
//       filter: true,
//       render: (_, item) => {
//         return (
//           <div>
//             {item?.Status === "Approved" && (
//               <Chips label="Approved" classess="success p-2" />
//             )}
//             {item?.Status === "Pending" && (
//               <Chips label="Pending" classess="warning p-2" />
//             )}
//             {item?.Status === "Process" && (
//               <Chips label="Process" classess="primary p-2" />
//             )}
//             {item?.Status === "Rejected" && (
//               <>
//                 <Chips label="Rejected" classess="danger p-2 mr-2" />
//                 {item?.RejectedBy && (
//                   <LightTooltip
//                     title={
//                       <div className="p-1">
//                         <div className="mb-1">
//                           <p
//                             className="tooltip-title"
//                             style={{
//                               fontSize: "12px",
//                               fontWeight: "600",
//                             }}
//                           >
//                             Rejected by {item?.RejectedBy}
//                           </p>
//                         </div>
//                       </div>
//                     }
//                     arrow
//                   >
//                     <InfoOutlined
//                       sx={{
//                         color: gray900,
//                       }}
//                     />
//                   </LightTooltip>
//                 )}
//               </>
//             )}
//           </div>
//         );
//       },
//     },
//     {
//       title: "",
//       dataIndex: "action",
//       render: (_, item) => {
//         return (
//           <div className="d-flex">
//             {item?.Status === "Pending" && (
//               <Tooltip title="Edit" arrow>
//                 <button className="iconButton" type="button">
//                   <EditOutlined
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       history.push(
//                         `/SelfService/expense/expenseApplication/edit/${item?.ExpenseId}`
//                       );
//                     }}
//                   />
//                 </button>
//               </Tooltip>
//             )}
//           </div>
//         );
//       },
//     },
//   ];
// };

export const expenseLandingTableColumn = (page, paginationSize, history) => {
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
      title: "Code",
      dataIndex: "employeeCode",
      sort: true,
      filter: false,
      width: 100,
      fieldType: "string",
    },
    {
      title: "Employee",
      dataIndex: "employeeName",
      sort: true,
      filter: false,
      render: (item) => (
        <div className="d-flex align-items-center justify-content-start">
          <div className="emp-avatar">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={item?.employeeName}
            />
          </div>
          <div className="ml-2">
            <span>{item?.employeeName}</span>
          </div>
        </div>
      ),
      fieldType: "string",
    },
    {
      title: "Expense Type",
      dataIndex: "strExpenseType",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "From Date",
      dataIndex: "dteExpenseFromDate",
      render: (item) => (
        <div>
          {item?.dteExpenseFromDate
            ? dateFormatter(item?.dteExpenseFromDate)
            : "N/A"}
        </div>
      ),
      width: 100,
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "To Date",
      dataIndex: "dteExpenseToDate",
      render: (item) => (
        <div>
          {item?.dteExpenseToDate
            ? dateFormatter(item?.dteExpenseToDate)
            : "N/A"}
        </div>
      ),
      width: 100,
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "Expense Amount",
      dataIndex: "numExpenseAmount",
      render: (item) => (
        <>
          {item?.numExpenseAmount
            ? numberWithCommas(item?.numExpenseAmount)
            : "N/A"}
        </>
      ),
      className: "text-right",
      sort: true,
      filter: false,
      fieldType: "number",
    },
    {
      title: "Reason",
      dataIndex: "strDiscription",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Status",
      dataIndex: "status",
      filter: false,
      width: 80,
      render: (item) => (
        <>
          {item?.status === "Approved" && (
            <Chips label="Approved" classess="success p-2" />
          )}
          {item?.status === "Pending" && (
            <Chips label="Pending" classess="warning p-2" />
          )}
          {item?.status === "Process" && (
            <Chips label="Process" classess="primary p-2" />
          )}
          {item?.status === "Rejected" && (
            <>
              <Chips label="Rejected" classess="danger p-2 mr-2" />
              {item?.rejectedBy && (
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
                          Rejected by {item?.rejectedBy}
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
        </>
      ),
      sort: true,
      fieldType: "string",
    },
    {
      title: "Action",
      render: (item) => (
        <div className="d-flex align-items-center justify-content-center">
          {item?.status === "Pending" && (
            <Tooltip title="Edit" arrow>
              <button className="iconButton" type="button">
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push(
                      `/profile/expense/expenseApplication/edit/${item?.expenseId}`
                    );
                  }}
                />
              </button>
            </Tooltip>
          )}
        </div>
      ),
      sort: true,
      filter: false,
      fieldType: "string",
      width: 80,
    },
  ];
};

export const getExpenseApplicationById = async (
  id,
  buId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);

  try {
    const res = await axios.get(
      `/Employee/GetExpenseById?intExpenseId=${id}&businessUnitId=${buId}`
    );

    if (res?.data) {
      const resData = [res?.data];
      const modifyArr = resData?.map((data, index) => {
        return {
          ...data,
          initialSerialNumber: index + 1,
        };
      });
      setter(modifyArr);

      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const onGetExpenseApplicationLanding = async (
  buId,
  wgId,
  fromDate,
  toDate,
  search,
  setter,
  setLoading,
  pageNo,
  pageSize,
  setPages,
  employeeId,
  intWorkplaceId
) => {
  setLoading && setLoading(true);

  let searchTxt = search ? `&strSearchTxt=${search}` : "";

  try {
    const res = await axios.get(
      `/Employee/ExpenseApplicationLandingDataPaginetion?intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&dteFromDate=${fromDate}&dteToDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}${searchTxt}&intEmployeeId=${employeeId}&workplaceId=${intWorkplaceId}`
    );
    if (res?.data) {
      setter(res?.data?.expenseApplicationLandings);

      setPages({
        current: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        total: res?.data?.totalCount,
      });

      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
