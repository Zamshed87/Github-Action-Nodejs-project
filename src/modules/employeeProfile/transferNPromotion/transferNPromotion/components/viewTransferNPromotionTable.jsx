import React from "react";
import { dateFormatter } from "../../../../../utility/dateFormatter";

const ViewTransferTable = ({ transferNpromotion }) => {
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
            <div>B.Unit & Workplace Group</div>
          </td>
          {/* <td
            style={{
              backgroundColor: "rgba(247, 220, 92, 1)",
            }}
          >
            <div>Wing, Sole Depo & Region</div>
          </td>
          <td
            style={{
              backgroundColor: "rgba(247, 220, 92, 1)",
            }}
          >
            <div>Area & Territory</div>
          </td> */}
          <td
            style={{
              backgroundColor: "rgba(247, 220, 92, 1)",
            }}
          >
            Dept, Section & Designation
          </td>
          <td
            style={{
              backgroundColor: "rgba(129, 225, 255, 1)",
            }}
          >
            B.Unit & Workplace
          </td>
          {/* <td
            style={{
              backgroundColor: "rgba(129, 225, 255, 1)",
            }}
          >
            Wing, Sole Depo & Region
          </td>
          <td
            style={{
              backgroundColor: "rgba(129, 225, 255, 1)",
            }}
          >
            Area & Territory
          </td> */}
          <td
            style={{
              backgroundColor: "rgba(129, 225, 255, 1)",
            }}
          >
            Dept, Section & Designation
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          style={{
            color: "rgba(95, 99, 104, 1)",
            fontSize: "14px",
          }}
        >
          <td className="text-center">
            <div>1</div>
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
              <div>{transferNpromotion?.businessUnitNameFrom}</div>
              <div>{transferNpromotion?.workplaceNameFrom}</div>
            </div>
          </td>
          {/* <td
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
              <div>{transferNpromotion?.wingNameFrom}</div>
              <div>{transferNpromotion?.soldDepoNameFrom}</div>
              <div>{transferNpromotion?.regionNameFrom}</div>
            </div>
          </td> */}
          {/* <td
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
              <div>{transferNpromotion?.areaNameFrom}</div>
              <div>{transferNpromotion?.territoryNameFrom}</div>
            </div>
          </td> */}
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
              <div>{transferNpromotion?.departmentNameFrom}</div>
              <div>{transferNpromotion?.sectionNameFrom || "N/A"}</div>
              <div>{transferNpromotion?.designationNameFrom}</div>
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
              <div>{transferNpromotion?.businessUnitName}</div>
              <div>{transferNpromotion?.workplaceName}</div>
            </div>
          </td>
          {/* <td
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
              <div>{transferNpromotion?.wingName}</div>
              <div>{transferNpromotion?.soldDepoName}</div>
              <div>{transferNpromotion?.regionName}</div>
            </div>
          </td> */}
          {/* <td
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
              <div>{transferNpromotion?.areaName}</div>
              <div>{transferNpromotion?.territoryName}</div>
            </div>
          </td> */}
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
              <div>{transferNpromotion?.departmentName}</div>
              <div>{transferNpromotion?.strSectionName || "N/A"}</div>
              <div>{transferNpromotion?.designationName}</div>
            </div>
          </td>
          <td>
            <div
              style={{
                color: "rgba(95, 99, 104, 1)",
              }}
            >
              <div>{transferNpromotion?.strTransferNpromotionType}</div>
            </div>
          </td>
          <td>
            <div>{dateFormatter(transferNpromotion?.dteEffectiveDate)}</div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ViewTransferTable;
