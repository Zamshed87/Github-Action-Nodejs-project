import React from 'react'

const EmployeeInfo = ({employeeInfo}) => {
  return (
    <>
     <div>
            <p>
              <span className="font-weight-bold">
                Name :
              </span>
              <span> {employeeInfo?.EmployeeOnlyName}</span>
            </p>
          </div>
          <div>
            <p>
              <span className="font-weight-bold">
                Designation :
              </span>
              <span> {employeeInfo?.DesignationName}</span>
            </p>
          </div>
          <div>
            <p>
              <span className="font-weight-bold">
                Employee ID :
              </span>
              <span> {employeeInfo?.EmployeeId}</span>
            </p>
          </div></>
  )
}

export default EmployeeInfo