import axios from "axios";
import { toast } from "react-toastify";
import { dateFormatter } from "../../../../utility/dateFormatter";

export const employeeIdCardLandingColumns = (
  pages,
  permission,
  rowDto,
  setRowDto,
  checkedList,
  setCheckedList,
  headerList,
  wgName,
  downloadEmpIdCardZipFile
) =>
  [
    {
      title: "SL",
      render: (_, index) => (pages?.current - 1) * pages?.pageSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Employee Id",
      dataIndex: "EmployeeCode",
      sort: true,
      filter: false,
      fieldType: "string",
      width: 150,
    },
    {
      title: "Employee Name",
      dataIndex: "EmployeeName",
      render: (record) => {
        return (
          <div className="d-flex align-items-center">
            <span className="ml-2">{record?.EmployeeName}</span>
          </div>
        );
      },
      sort: true,
      filter: false,
      fieldType: "string",
    },

    {
      title: "Department",
      dataIndex: "Department",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`DepartmentList`],
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "Designation",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`DesignationList`],
      fieldType: "string",
    },
    {
      title: "Nid",
      dataIndex: "Nid",
      fieldType: "string",
    },
    {
      title: "Personal Mobile Number",
      dataIndex: "PersonalMobileNumber",
      fieldType: "string",
    },
    {
      title: "Official Email",
      dataIndex: "officialEmail",
      fieldType: "string",
    },
    {
      title: "Blood Group",
      dataIndex: "BloodGroup",
      fieldType: "string",
    },
    // {
    //   title: "Supervisor",
    //   dataIndex: "supervisor",
    //   sort: true,
    //   filter: true,
    //   filterDropDownList: headerList[`supervisorList`],
    //   fieldType: "string",
    // },
    // {
    //   title: "Employment Type",
    //   dataIndex: "employmentType",
    //   sort: true,
    //   filter: true,
    //   filterDropDownList: headerList[`employmentTypeList`],
    //   fieldType: "string",
    // },
    // {
    //   title: "Line Manager",
    //   dataIndex: "linemanager",
    //   sort: true,
    //   filter: true,
    //   filterDropDownList: headerList[`linemanagerList`],
    //   fieldType: "string",
    // },
    {
      title: "Joining Date",
      dataIndex: "JoiningDate",
      render: (record) => dateFormatter(record?.JoiningDate),
    },
    {
      title: "Action",
      className: "text-center",
      dataIndex: "",
      render: (record) => (
        <div>
          {!(record?.CalendarAssignId || record?.isSelected) && (
            <div className="assign-btn">
              <button
                style={{
                  marginRight: "25px",
                  height: "24px",
                  fontSize: "12px",
                  padding: "0px 12px 0px 12px",
                }}
                type="button"
                className="btn btn-default"
                onClick={() => {
                  if (!permission?.isCreate)
                    return toast.warn("You don't have permission");
                  if (!permission?.isCreate)
                    return toast.warn("You don't have permission");
                  // setSingleData([record]);
                  // setCreateModal(true);
                  downloadEmpIdCardZipFile(false, record);
                }}
                disabled={checkedList.length > 1}
              >
                Download
              </button>
            </div>
          )}
        </div>
      ),
    },
  ].filter((item) => item.hidden !== true);

export const downloadEmployeeCardFile = (
  url,
  data,
  fileName,
  extension,
  setLoading
) => {
  setLoading && setLoading(true);
  axios({
    url: url,
    method: "POST",
    responseType: "blob", // important
    data: data,
  })
    .then((response) => {
      const urlTwo = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlTwo;
      //   const fileExtension = imageView?.type.split('/')[1];
      link.setAttribute("download", fileName);
      link.setAttribute("download", `${fileName}.${extension}`);
      document.body.appendChild(link);
      console.log({ response, link });

      setLoading && setLoading(false);
      link.click();
    })
    .catch(() => {
      setLoading && setLoading(false);
    });
};
