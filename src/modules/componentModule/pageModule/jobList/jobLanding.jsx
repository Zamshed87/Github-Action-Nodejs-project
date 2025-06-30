import {
  DeleteOutlined,
  EditOutlined,
  RemoveRedEyeOutlined,
  RoomOutlined
} from "@mui/icons-material";
import { TableCell, TableRow } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import ActionMenu from "./../../../../common/ActionMenu";
import Chips from "./../../../../common/Chips";
import LandingTable from "./../../../../common/LandingTable";
import { landingData } from "./data";

const styles = makeStyles({
  tableRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: "4px",
    borderBottom: "8px solid rgb(250,250,250)",
  },
  tableHead: {
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "20px",
    letterSpacing: "-0.36px",
    color: "#6F767D",
    borderBottom: 0,
    padding: "28px 32px",
  },
  tableCell: {
    padding: "32px",
    borderBottom: 0,
  },
});

export default function JobLanding() {
  const classes = styles();
  const [rowDto, setRowDto] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setRowDto(landingData?.data);
  }, []);

  const handleChangePage = (page) => {};
  const handleChangeRowsPerPage = (size) => {};

  return (
    <div>
      <LandingTable
        headers={
          <TableRow>
            <TableCell align="left" className={classes?.tableHead}>
              Job Opening
            </TableCell>
            <TableCell align="left" className={classes?.tableHead}>
              Candidates
            </TableCell>
            <TableCell align="left" className={classes?.tableHead}>
              Assignee
            </TableCell>
            <TableCell align="left" className={classes?.tableHead}>
              Published On
            </TableCell>
            <TableCell align="center" className={classes?.tableHead}>
              Status
            </TableCell>
          </TableRow>
        }
        body={rowDto?.map((data, index) => (
          <TableRow
            key={index}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            className={classes?.tableRow}
          >
            <TableCell align="left" className={classes?.tableCell}>
              <div className="td-head">
                <h4>{data.jobName}</h4>
              </div>
              <div className="td-para">
                <p>
                  <RoomOutlined
                    sx={{
                      fontSize: "14px",
                      marginRight: "6px",
                      position: "relative",
                      left: "-4px",
                    }}
                  />
                  {data.jobLocation}
                </p>
              </div>
            </TableCell>
            <TableCell align="left" className={classes?.tableCell}>
              <div className="td-head">
                <h4>{data.totalCadidate}</h4>
              </div>
              <div className="td-para">
                <p style={{ color: "#34A853" }}>{data.newCadidate} new</p>
              </div>
            </TableCell>
            <TableCell align="left" className={classes?.tableCell}>
              <div className="td-head">
                <h4>{data.jobReqAssignee}</h4>
              </div>
              <div className="td-para">
                <p>{data.jobAssignee}</p>
              </div>
            </TableCell>
            <TableCell align="left" className={classes?.tableCell}>
              <div className="td-head">
                <h4>{data.jobPublish}</h4>
              </div>
              <div className="td-para">
                <p>{data.jobOpening}</p>
              </div>
            </TableCell>
            <TableCell align="center" className={classes?.tableCell}>
              <div className="td-box">
                <div className="td-box-txt">
                  <div className="td-head">
                    <h4>{data.jobStatus}</h4>
                  </div>
                  <div className="td-chip">
                    {data?.jobStatusTag === "not started" && (
                      <Chips label={data?.jobStatusTag} classess="warning" />
                    )}
                    {data?.jobStatusTag === "completed" && (
                      <Chips label={data?.jobStatusTag} classess="success" />
                    )}
                    {data?.jobStatusTag === "on hold" && (
                      <Chips label={data?.jobStatusTag} classess="danger" />
                    )}
                    {data?.jobStatusTag === "in progress" && (
                      <Chips
                        label={data?.jobStatusTag}
                        classess="in-progress"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <ActionMenu
                    color={"#000"}
                    options={[
                      {
                        value: 1,
                        label: "View",
                        icon: (
                          <RemoveRedEyeOutlined sx={{ marginRight: "10px" }} />
                        ),
                        onClick: () => {},
                      },
                      {
                        value: 2,
                        label: "Edit",
                        icon: <EditOutlined sx={{ marginRight: "10px" }} />,
                        onClick: () => {},
                      },
                      {
                        value: 3,
                        label: "Delete",
                        icon: <DeleteOutlined sx={{ marginRight: "10px" }} />,
                        onClick: () => {},
                      },
                    ]}
                  />
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
        count={landingData?.totalCount}
        pageNo={pageNo}
        pageSize={pageSize}
        setPageNo={setPageNo}
        setPageSize={setPageSize}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}
