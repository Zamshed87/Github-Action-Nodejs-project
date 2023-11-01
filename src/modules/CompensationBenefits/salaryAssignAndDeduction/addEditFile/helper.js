import * as Yup from "yup";

export const initData = {
  searchString: "",
  isAutoRenew: "",
  fromMonth: "",
  toMonth: "",
  salaryType: "",
  allowanceAndDeduction: "",
  amountDimension: "",
  amount: "",
};

export const validationSchema = Yup.object().shape({
  fromMonth: Yup.string().required("From month is required"),
  salaryType: Yup.object()
    .shape({
      label: Yup.string().required("Allowance type is required"),
      value: Yup.string().required("Allowance type is required"),
    })
    .typeError("Allowance type is required"),
  allowanceAndDeduction: Yup.object()
    .shape({
      label: Yup.string().required("Allowance and deduction type is required"),
      value: Yup.string().required("Allowance and deduction type is required"),
    })
    .typeError("Allowance and deduction type is required"),
  amountDimension: Yup.object()
    .shape({
      label: Yup.string().required("Amount dimension is required"),
      value: Yup.string().required("Amount dimension type is required"),
    })
    .typeError("Amount dimension type is required"),
  amount: Yup.number()
    .min(0, "Amount should be positive number")
    .required("Amount is required"),
});

export const validationSchema2 = Yup.object().shape({
  fromMonth: Yup.string().required("From month is required"),
  salaryType: Yup.object()
    .shape({
      label: Yup.string().required("Allowance type is required"),
      value: Yup.string().required("Allowance type is required"),
    })
    .typeError("Allowance type is required"),
});

export const empListColumn = (page, paginationSize, headerList) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (record) => {
        return (
          <div className="d-flex align-items-center">
            <span className="ml-2">{record?.strEmployeeName}</span>
          </div>
        );
      },
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`strDepartmentList`],
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`strDesignationList`],
      fieldType: "string",
    },
    {
      title: "Workplace",
      dataIndex: "strWorkplaceName",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    // {
    //   title: "",
    //   dataIndex: "",
    //   render: (_, index) => {
    //     return (
    //       <div className="d-flex">
    //         <Tooltip title="Delete" arrow>
    //           <button type="button" className="iconButton">
    //             <DeleteOutlineOutlinedIcon
    //               onClick={(e) => {
    //                 e.stopPropagation();
    //                 deleteHandler(index);
    //               }}
    //             />
    //           </button>
    //         </Tooltip>
    //       </div>
    //     );
    //   },
    // },
  ];
};
