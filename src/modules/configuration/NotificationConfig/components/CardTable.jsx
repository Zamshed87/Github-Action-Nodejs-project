import { CreateOutlined, DeleteOutlineOutlined } from "@mui/icons-material";
import React from "react";
import SortingIcon from "../../../../common/SortingIcon";

const CardTable = ({ propsObj }) => {
  // eslint-disable-next-line no-unused-vars
  const { rowDto, setRowDto } = propsObj;
  return (
    <>
      <div className="table-card-styled tableOne pt-3">
        <table className="table ">
          <thead>
            <tr>
              <th><div className="pl-2">SL</div></th>
              <th>
                <div className="sortable">
                  <span>SMS Category</span>
                  <SortingIcon />
                </div>
              </th>
              <th>
                <div className="sortable">
                  <span>SMS Type</span>
                  <SortingIcon />
                </div>
              </th>
              <th>
                <div className="sortable">
                  <span>User Category</span>
                  <SortingIcon />
                </div>
              </th>
              <th>
                <div className="sortable">
                  <span>Department</span>
                  <SortingIcon />
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rowDto?.length > 0 &&
              rowDto?.map((data, index) => (
                <tr>
                  <td >
                    <div className="pl-2">{index + 1}</div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="content tableBody-title"> {data?.smsCategory}</span>
                    </div>
                  </td>
                  <td>
                    <div className="content tableBody-title">{data?.smsType}</div>
                  </td>
                  <td>
                    <div className="content tableBody-title">{data?.userCategory}</div>
                  </td>
                  <td>
                    <div className="content tableBody-title">{data?.department}</div>
                  </td>
                  <td width="10%">
                    <div className="d-flex align-items-center">
                      <button type="button" className="iconButton" onClick={(e) => { }}>
                        <CreateOutlined />
                      </button>
                      <button type="button" className="iconButton" onClick={(e) => { }}>
                        <DeleteOutlineOutlined />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CardTable;
