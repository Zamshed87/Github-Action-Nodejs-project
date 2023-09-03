/* eslint-disable no-unused-vars */
import { LocalPrintshopOutlined } from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/styles";
import { shallowEqual, useSelector } from "react-redux";
// import SortingIcon from "../../../../common/SortingIcon";

const CardTable = ({ propsObj }) => {
  const { orgId, buId, employeeId, userId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { rowDto, setRowDto } = propsObj;

  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#fff !important",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#fff",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 500,
      boxShadow:
        "0px 1px 5px rgba(0, 0, 0, 0.05), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 1px 5px rgba(0, 0, 0, 0.05)",
      fontSize: 11,
    },
  }));
  return (
    <div className="table-card-styled tableOne pt-3">
      <table className="table">
        <thead>
          <tr>
            <th>
              <div className="sortable">
                <span>Asset Name</span>
              </div>
            </th>
            <th>
              <div className="sortable">
                <span>Assign To</span>
              </div>
            </th>
            <th>
              <div className="sortable">
                <span>Designation</span>
              </div>
            </th>
            <th>
              <div className="sortable">
                <span>Department</span>
              </div>
            </th>
            <th>
              <div className="sortable">
                <span>UoM</span>
              </div>
            </th>
            <th>
              <div className="sortable justify-content-end">
                <span>Assigned Date</span>
              </div>
            </th>
            <th>
              <div className="sortable justify-content-end">
                <span>Accquisition Date</span>
              </div>
            </th>
            <th>
              <div className="sortable justify-content-end">
                <span>Warranty Date</span>
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
                    <span className="content tableBody-title">
                      {" "}
                      {data?.assetName} [{data?.assetCode}]
                    </span>
                    <LightTooltip
                      title={
                        <div className="assetTooltip p-2">
                          <p className="assetTooltipSubTitleText">
                            Dell Inspiron 15
                          </p>
                          <p className="assetTooltipSubTitleText">3505 Ryzen</p>
                          <p className="assetTooltipSubTitleText">3 3250U</p>
                          <p className="assetTooltipSubTitleText">15.6" FHD</p>
                        </div>
                      }
                      arrow
                    >
                      <InfoOutlinedIcon sx={{ marginLeft: "12px" }} />
                    </LightTooltip>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <span className="content tableBody-title">
                      {" "}
                      {data?.assignTo}
                    </span>
                    <LightTooltip
                      title={
                        <div className="movement-tooltip p-2">
                          <div>
                            <p className="tooltip-title">Responsible Person</p>
                            <p className="tooltip-subTitle mb-0">
                              Mahade Hasan Mridul
                            </p>
                          </div>
                        </div>
                      }
                      arrow
                    >
                      <InfoOutlinedIcon sx={{ marginLeft: "12px" }} />
                    </LightTooltip>
                  </div>
                </td>
                <td>{data?.designation}</td>
                <td>{data?.department}</td>
                <td>{data?.uom}</td>
                <td width="10%">
                  <div className="d-flex align-items-center justify-content-between">
                    <LightTooltip
                      title={
                        <div className="movement-tooltip p-2">
                          <div className="border-bottom">
                            <p className="tooltip-title">
                              Depreciation Value (BDT)
                            </p>
                            <p className="tooltip-subTitle">10,000</p>
                          </div>
                          <div>
                            <p className="tooltip-title mt-2">
                              Depreciation Run Date
                            </p>
                            <p className="tooltip-subTitle mb-0">12/19/2022</p>
                          </div>
                        </div>
                      }
                      arrow
                    >
                      <InfoOutlinedIcon sx={{ marginLeft: "12px" }} />
                    </LightTooltip>
                    <span className="content tableBody-title">
                      {" "}
                      {data?.assignedDate}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center justify-content-end">
                    <span className="content tableBody-title">
                      {" "}
                      {data?.accquisitionDate}
                    </span>
                  </div>
                </td>
                <td className="text-right">{data?.warrantyDate}</td>
                <td>
                  <div className="d-flex align-items-center justify-content-center">
                    <button
                      type="button"
                      className="iconButton"
                      onClick={(e) => {}}
                    >
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
