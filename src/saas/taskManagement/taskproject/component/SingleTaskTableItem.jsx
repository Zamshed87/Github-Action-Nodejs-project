import React from 'react';
import Chips from '../../../../common/Chips';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import { LinearProgress } from '@mui/material';
import { useHistory } from 'react-router-dom';

const SingleTaskTableItem = ({ item, index, rowDto, setRowDto }) => {
  let history = useHistory();
  return (
    <>
      <td style={{cursor:'pointer'}} onClick={() =>
                            history.push(
                              "/taskmanagement/taskmgmt/projects/task-project/1/task-board"
                            )
                          } >

        <div className="employeeInfo d-flex align-items-center">
          <SportsVolleyballIcon
            sx={{
              mr: "10px",
              color: "#33A551",
              height: "100px",
              width: "100px"
            }}
          />
          <div>
            <p style={{color: "rgba(0, 0, 0, 0.7)"}}>{item.taskName}</p>
            <span className='text-secondary'>{item.startDate}</span>
          </div>
        </div>
      </td>
      <td>
        <div className="content tableBody-title text-center mr-3 ">
        {item?.priority === "High" && <span  className="text-success" >High</span>}
        {item?.priority === "Medium" && <span className="text-primary">Medium</span>}
        {item?.priority === "Low" && <span className="text-warning">Low</span>}
        </div>
      </td>
      <td>
        <div className="content tableBody-title text-start">{item?.endDate}</div>
      </td>
      <td>
        <div className="content tableBody-title d-flex justify-content-center">
          <p
            style={{
              borderRadius: "50%",
              backgroundColor: "#E9EAFF",
              padding: "10px",
              color:'#6469DE'
            }}
          >10</p>
        </div>
      </td>

      <td
        style={{
          width: "120px"
        }}
      >
        <div className="content tableBody-title text-center"> <LinearProgress variant="determinate" /></div>
      </td>
      <td></td>
      <td
        style={{ width: "80px" }}>
        {item?.status === "Inprogress" && <Chips label="Inprogress" classess="primary" />}
        {item?.status === "Open" && <Chips label="Open" classess="success" />}
        {item?.status === "Review" && <Chips label="Review" classess="secondary" />}
        {item?.status === "Closed" && <Chips label="Closed" classess="danger" />}
      </td>
    </>
  );
};

export default SingleTaskTableItem;