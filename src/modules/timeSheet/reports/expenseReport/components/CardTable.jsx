/* eslint-disable no-unused-vars */
import { LocalPrintshopOutlined } from "@mui/icons-material";
import AvatarComponent from "../../../../../common/AvatarComponent";
import SortingIcon from "../../../../../common/SortingIcon";

const CardTable = ({ propsObj }) => {
  const { rowDto } = propsObj;
  return (
    <div className="table-card-styled tableOne pt-3">
      <table className="table ">
        <thead>
          <tr>
            <th>
              <div className="sortable">
                <span>Employee</span>
                <SortingIcon />
              </div>
            </th>
            <th>
              <div className="sortable">
                <span>Designation</span>
                <SortingIcon />
              </div>
            </th>
            <th>
              <div className="sortable">
                <span>Department</span>
                <SortingIcon />
              </div>
            </th>
            <th>
              <div className="sortable">
                <span>Expense Type</span>
                <SortingIcon />
              </div>
            </th>
            <th>
              <div className="sortable justify-content-end">
                <span>Date</span>
                <SortingIcon />
              </div>
            </th>
            <th>
              <div className="sortable justify-content-center">
                <span>Expense Amount</span>
                <SortingIcon />
              </div>
            </th>
            <th>
              <div className="sortable">
                <span>Line Manager</span>
              </div>
            </th>
            <th>
              <div className="sortable">
                <span>Reason</span>
              </div>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.length > 0 &&
            rowDto?.map((data, index) => (
              <tr key={index}>
                <td>
                  <div className="d-flex align-items-center">
                    <AvatarComponent
                      letterCount={1}
                      label={data?.employeeName}
                    />
                    <span className="content tableBody-title ml-2">
                      {" "}
                      {data?.employeeName} [{data?.employeeCode}]
                    </span>
                  </div>
                </td>
                <td>
                  {data?.designation}, {data?.employmentType}
                </td>
                <td>{data?.department}</td>
                <td>
                  <div className="content tableBody-title">
                    {data?.expenseType}
                  </div>
                </td>
                <td>
                  <div className="content tableBody-title text-right">
                    {data?.date}
                  </div>
                </td>
                <td>
                  <div className="content tableBody-title text-center">
                    {data?.expenseAmount}
                  </div>
                </td>
                <td>{data?.lineManager}</td>
                <td>{data?.reason}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <button type="button" className="iconButton">
                      <LocalPrintshopOutlined />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CardTable;
