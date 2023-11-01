import moment from "moment";
import AvatarComponent from "../../../../common/AvatarComponent";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import { gray900, greenColor } from "../../../../utility/customColor";
import * as Yup from "yup";

export const salaryGenerateValidationSchema = Yup.object().shape({
  monthYear: Yup.date().required("Payroll month is required"),
});

export const salaryGenerateInitialValues = {
  salaryTpe: {
    value: "Salary",
    label: "Full Salary",
  },
  businessUnit: "",
  description: "",
  monthYear: moment().format("YYYY-MM"),
  monthId: new Date().getMonth() + 1,
  yearId: new Date().getFullYear(),
  fromDate: "",
  toDate: "",
  search: "",
  allSelected: false,

  // marketing
  wing: "",
  soleDepo: "",
  region: "",
  area: "",
  territory: "",
};

export const columnsData = (
  setAllData,
  allData,
  rowDto,
  offDaylanding,
  setOffDaylanding,
  modifyData,
  setRowDto,
  setFieldValue
) => {
  const columns = [
    {
      title: "SL",
      render: (text, record, index) => <div>{index + 1}</div>,
      sorter: false,
      filter: false,
    },
    {
      title: () => (
        <div className="d-flex align-items-center">
          <div className="mr-2">
            <FormikCheckBox
              styleObj={{
                margin: "0 auto!important",
                padding: "0 !important",
                color: gray900,
                checkedColor: greenColor,
              }}
              name="allSelected"
              //   checked={
              //     rowDto?.length > 0 &&
              //     rowDto?.every((item) => item?.isSalaryGenerate)
              //   }
              checked={
                offDaylanding?.length > 0
                  ? offDaylanding?.every((item) => item?.selectCheckbox)
                  : false
              }
              //   onChange={(e) => {
              //     let modifyRowDto = rowDto?.map((item) => ({
              //       ...item,
              //       isSalaryGenerate: e.target.checked,
              //     }));
              //     setRowDto(modifyRowDto);
              //     setFieldValue("allSelected", e.target.checked);
              //   }}
              onChange={(e) => {
                setOffDaylanding(modifyData(offDaylanding, e.target.checked));
                setAllData(modifyData(allData, e.target.checked));
              }}
            />
          </div>
          <div>Employee Name</div>
        </div>
      ),
      dataIndex: "strEmployeeName",
      render: (strEmployeeName, record, index) => (
        <div className="d-flex align-items-center">
          <div className="mr-2" onClick={(e) => e.stopPropagation()}>
            <FormikCheckBox
              styleObj={{
                margin: "0 auto!important",
                color: gray900,
                checkedColor: greenColor,
                padding: "0px",
              }}
              name="isSalaryGenerate"
              color={greenColor}
              checked={rowDto[index]?.isSalaryGenerate}
              //   onChange={() => {
              //     const copyRowDto = [...rowDto];
              //     copyRowDto[index].isSalaryGenerate =
              //       !copyRowDto[index].isSalaryGenerate;
              //     setRowDto(copyRowDto);
              //   }}
              onChange={(e) => {
                let data = offDaylanding?.map((item) => {
                  if (item?.intEmployeeId === record?.intEmployeeId) {
                    return {
                      ...item,
                      selectCheckbox: e.target.checked,
                    };
                  } else return item;
                });
                let newAllData = allData?.map((item) => {
                  if (item?.intEmployeeId === record?.intEmployeeId) {
                    return {
                      ...item,
                      selectCheckbox: e.target.checked,
                    };
                  } else return item;
                });
                setOffDaylanding([...data]);
                setAllData([...newAllData]);
              }}
              // disabled={item?.ApplicationStatus === "Approved"}
            />
          </div>
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={strEmployeeName}
            />
            <span className="ml-2">{strEmployeeName}</span>
          </div>
        </div>
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "Code",
      dataIndex: "strEmployeeCode",
      sorter: true,
      filter: true,
    },
    {
      title: "Type",
      dataIndex: "strEmploymentType",
      sorter: true,
      filter: true,
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      filter: true,
    },
    {
      title: "Department Section",
      dataIndex: "strDepartmentSection",
      sorter: true,
      filter: true,
    },
    {
      title: "Workplace",
      dataIndex: "strWorkplace",
      sorter: true,
      filter: true,
    },
    {
      title: "Workplace Group",
      dataIndex: "strWorkplaceGroup",
      sorter: true,
      filter: true,
    },
    {
      title: "Payroll Group",
      dataIndex: "strPayrollGroup",
      sorter: true,
      filter: true,
    },
  ];

  return columns;
};
