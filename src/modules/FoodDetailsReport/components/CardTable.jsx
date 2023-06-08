import React,{useMemo} from "react";
import AvatarComponent from "../../../common/AvatarComponent";

const CardTable = ({ propsObj }) => {
  const {rowDto} = propsObj;

  const total = useMemo(
    () => rowDto.reduce((acc, item) => acc + +item?.mealCount, 0),
    [rowDto]
  );

  return (
    <div className="table-card-styled tableOne pr-1">
      <div className="text-right mr-3 mb-2">Total Meal <b>{total}</b></div>
      <table className="table">
        <thead>
          <tr>
            <th style={{width:"40px"}}>
              SL
            </th>
            <th>
              <div className="d-flex align-items-center">
                Employee
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center">
                Designation
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center">
                Department
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center justify-content-center">
                Meal Count
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center justify-content-center">
                Meal Date
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.map((data, i) => (
            <tr key={i}>
              <td className="text-center">
                <div>{i + 1}</div>
              </td>
              <td>
                <div className="employeeInfo d-flex align-items-center">
                <AvatarComponent letterCount={1} label={data?.employeeFullName} />
                  <div className="employeeTitle ml-2">
                    <p className="employeeName">
                      {data?.employeeFullName} [{data?.employeeCode}]
                    </p>
                  </div>
                </div>
              </td>
              <td>
                {data?.designationName}
              </td>
              <td>
                {data?.departmentName}
              </td>
              <td className="text-center">
               {data?.mealCount}
              </td>
              <td className="text-center">
                {data?.mealDate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CardTable;
