import React from "react";
import { dateFormatter } from "../../../../../utility/dateFormatter";

const HistoryTransferTable = ({ historyData }) => {
  console.log(historyData);
  return (
    <table className="table table-bordered mt-3">
      <thead>
        <tr
          style={{
            backgroundColor: "rgba(247, 247, 247, 1)",
            fontSize: "14px",
            fontWeight: "600",
            color: "rgba(95, 99, 104, 1)!important",
          }}
        >
          <th
            className="text-center"
            rowSpan="2"
            style={{
              verticalAlign: "top",
            }}
          >
            SL
          </th>
          <th
            style={{
              border: "1px solid rgba(0, 0, 0, 0.12)",
            }}
            colSpan="2"
          >
            <div className="text-center">From</div>
          </th>
          <th
            style={{
              border: "1px solid rgba(0, 0, 0, 0.12)",
            }}
            colSpan="2"
          >
            <div className="text-center">To</div>
          </th>
          <th
            rowSpan="2"
            style={{
              border: "1px solid rgba(0, 0, 0, 0.12)",
              verticalAlign: "top",
            }}
          >
            <div className="sortable justify-content-center">Type</div>
          </th>
          <th
            rowSpan="2"
            style={{
              border: "1px solid rgba(0, 0, 0, 0.12)",
              verticalAlign: "top",
            }}
          >
            <div className="sortable justify-content-center">
              Effective Date
            </div>
          </th>
        </tr>
        <tr
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "rgba(82, 82, 82, 1)",
          }}
        >
          <td
            style={{
              backgroundColor: "rgba(247, 220, 92, 1)",
            }}
          >
            <div>B.Unit & Workplace Group & Workplace</div>
          </td>
          <td
            style={{
              backgroundColor: "rgba(247, 220, 92, 1)",
            }}
          >
            Dept & Designation
          </td>
          <td
            style={{
              backgroundColor: "rgba(129, 225, 255, 1)",
            }}
          >
            B.Unit & Workplace Group & Workplace
          </td>
          <td
            style={{
              backgroundColor: "rgba(129, 225, 255, 1)",
            }}
          >
            Dept & Designation
          </td>
        </tr>
      </thead>
      <tbody>
        {historyData?.map((item, index) => (
          <tr
            style={{
              color: "rgba(95, 99, 104, 1)",
              fontSize: "14px",
            }}
            key={index}
          >
            <td className="text-center">
              <div>{index + 1}</div>
            </td>
            <td
              style={{
                backgroundColor: "rgba(254, 249, 223, 1)",
              }}
            >
              <div
                style={{
                  color: "rgba(95, 99, 104, 1)",
                }}
                className=" "
              >
                <div>{item?.businessUnitNameFrom}</div>
                <div>{item?.workplaceGroupNameFrom}</div>
                <div>{item?.workplaceNameFrom}</div>
              </div>
            </td>
            <td
              style={{
                backgroundColor: "rgba(254, 249, 223, 1)",
              }}
            >
              <div
                style={{
                  color: "rgba(95, 99, 104, 1)",
                }}
              >
                <div>{item?.departmentNameFrom}</div>
                <div>{item?.designationNameFrom}</div>
              </div>
            </td>
            <td
              style={{
                backgroundColor: "rgba(230, 246, 253, 1)",
              }}
            >
              <div
                style={{
                  color: "rgba(95, 99, 104, 1)",
                }}
                className=""
              >
                <div>{item?.businessUnitName}</div>
                <div>{item?.workplaceGroupName}</div>
                <div>{item?.workplaceName}</div>
              </div>
            </td>
            <td
              style={{
                backgroundColor: "rgba(230, 246, 253, 1)",
              }}
            >
              <div
                style={{
                  color: "rgba(95, 99, 104, 1)",
                }}
                className=""
              >
                <div>{item?.departmentName}</div>
                <div>{item?.designationName}</div>
              </div>
            </td>
            <td>
              <div
                style={{
                  color: "rgba(95, 99, 104, 1)",
                }}
              >
                <div>{item?.strTransferNpromotionType}</div>
              </div>
            </td>
            <td>
              <div>{dateFormatter(item?.dteEffectiveDate)}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HistoryTransferTable;
