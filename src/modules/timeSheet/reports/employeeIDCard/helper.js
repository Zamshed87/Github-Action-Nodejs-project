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
      dataIndex: "employeeCode",
      sort: true,
      filter: false,
      fieldType: "string",
      width: 150,
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      render: (record) => {
        return (
          <div className="d-flex align-items-center">
            <span className="ml-2">{record?.employeeName}</span>
          </div>
        );
      },
      sort: true,
      filter: false,
      fieldType: "string",
    },

    {
      title: "Department",
      dataIndex: "department",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`departmentList`],
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`designationList`],
      fieldType: "string",
    },
    {
      title: "Nid",
      dataIndex: "nid",
      fieldType: "string",
    },
    {
      title: "Personal Mobile Number",
      dataIndex: "personalMobileNumber",
      fieldType: "string",
    },
    {
      title: "Official Email",
      dataIndex: "officialEmail",
      fieldType: "string",
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
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
      dataIndex: "joiningDate",
      render: (record) => dateFormatter(record?.joiningDate),
    },
    {
      title: "Action",
      className: "text-center",
      dataIndex: "",
      render: (record) => (
        <div>
          {!(record?.calendarAssignId || record?.isSelected) && (
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
                onClick={(e) => {
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
    .catch((err) => {
      setLoading && setLoading(false);
    });
};
