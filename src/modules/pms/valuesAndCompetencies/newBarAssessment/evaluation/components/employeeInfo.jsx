
const EmployeeInfo = ({employeeInfo}) => {
  return (
    <>
     <div>
            <p>
              <span className="font-weight-bold">
                Name :
              </span>
              <span> {employeeInfo?.name}</span>
            </p>
          </div>
          <div>
            <p>
              <span className="font-weight-bold">
                Designation :
              </span>
              <span> {employeeInfo?.designation}</span>
            </p>
          </div>
          <div>
            <p>
              <span className="font-weight-bold">
                Employee ID :
              </span>
              <span> {employeeInfo?.code}</span>
            </p>
          </div></>
  )
}

export default EmployeeInfo