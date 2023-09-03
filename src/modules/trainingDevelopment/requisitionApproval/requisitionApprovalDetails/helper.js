import {  InfoOutlined } from "@mui/icons-material";
import AvatarComponent from "../../../../common/AvatarComponent";
import Chips from "../../../../common/Chips";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import { LightTooltip } from "../../../../common/LightTooltip";
import { gray600, gray900, greenColor } from "../../../../utility/customColor";

export const employeeListColumn = (
  history,
  rowDto,
  setRowDto,
  page,
  paginationSize
) => {
  return [
    {
      title: () => (
        <div>
          <FormikCheckBox
            styleObj={{
              margin: "0 auto!important",
              padding: "0 !important",
              color: gray900,
              checkedColor: greenColor,
            }}
            name="allSelected"
            checked={
              false
              //   rowDto?.length > 0 && rowDto?.every((item) => item?.isAssigned)
            }
            onChange={(e) => {
              //   allGridCheck(e.target.checked);
              //   setRowDto(
              //     rowDto?.map((item) => ({
              //       ...item,
              //       isAssigned: e.target.checked,
              //     }))
              //   );
              //   setFieldValue("allSelected", e.target.checked);
            }}
          />
        </div>
      ),
      dataIndex: "strEmployeeCode",
      render: (_, record, index) => (
        <div>
          <FormikCheckBox
            styleObj={{
              margin: "0 auto!important",
              color: gray900,
              checkedColor: greenColor,
              padding: "0px",
            }}
            name="selectCheckbox"
            color={greenColor}
            checked={record?.isAssigned}
            disabled={record?.Status === "Approved"}
            onChange={(e) => {
              //   rowDtoHandler(record);
            }}
          />
        </div>
      ),
    },
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      className: "text-center",
    },
    {
      title: "Employee",
      dataIndex: "strEmployeeName",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.strEmployeeName}
            />
            <span className="ml-2">{record?.strEmployeeName}</span>
          </div>
        );
      },
      className: "text-left",
    },
    {
      title: () => <span style={{ color: gray600 }}>Designation</span>,
      dataIndex: "strDesignation",
      sorter: true,
    },
    {
      title: () => <span style={{ color: gray600 }}>Department</span>,
      dataIndex: "strDepartment",
    },
    {
      title: () => <span style={{ color: gray600 }}>Email</span>,
      dataIndex: "strEmail",
    },
    {
      title: () => <span style={{ color: gray600 }}>Phone</span>,
      dataIndex: "strPhone",
      className: "text-left",
    },
    {
      title: "Status",

      dataIndex: "Status",
      render: (_, item) => (
        <div>
          {item?.Status === "Approved" && (
            <Chips label="Approved" classess="success p-2" />
          )}
          {item?.Status === "Pending" && (
            <Chips label="Pending" classess="warning p-2" />
          )}
          {item?.Status === "Process" && (
            <Chips label="Process" classess="primary p-2" />
          )}
          {item?.Status === "Rejected" && (
            <>
              <Chips label="Rejected" classess="danger p-2 mr-2" />
              {item?.RejectedBy && (
                <LightTooltip
                  title={
                    <div className="p-1">
                      <div className="mb-1">
                        <p
                          className="tooltip-title"
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          Rejected by {item?.RejectedBy}
                        </p>
                      </div>
                    </div>
                  }
                  arrow
                >
                  <InfoOutlined
                    sx={{
                      color: gray900,
                    }}
                  />
                </LightTooltip>
              )}
            </>
          )}
        </div>
      ),
      filter: true,
    },
  ];
};
