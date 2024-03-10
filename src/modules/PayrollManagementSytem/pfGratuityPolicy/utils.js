import { TableButton } from "Components";
import { toast } from "react-toastify";

const header = (rowDto, setRowDto, type) => [
  {
    title: "SL",
    align: "center",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Depends On",
    dataIndex: "strDependsOn",
  },
  {
    title: "Employment Type",
    dataIndex: "strEmploymentTypeName",
  },
  {
    title: "Year Range",
    render: (text, record) => `${record?.intFromYear} - ${record?.intToYear}`,
  },
  {
    title: "Multiplier",
    dataIndex: "numMultiplier",
  },
  {
    title: "Action",
    align: "center",
    isHidden: type === "view",
    render: (_, item, index) => (
      <TableButton
        buttonsList={[
          {
            type: "delete",
            onClick: () => {
              deleteHandler(index, rowDto, setRowDto);
            },
          },
        ]}
      />
    ),
  },
].filter(item => !item?.isHidden);

const deleteHandler = (id, rowData, setRowData) => {
  const deleteData = rowData?.filter((data, index) => id !== index);
  setRowData(deleteData);
};

const addHandler = (values, rowDto, setRowDto, cb) => {
  // check if the input values are already added
  const isDuplicate = rowDto?.some(
    (item) =>
      item?.strDependsOn === values?.dependsOn?.label &&
      item?.intEmploymentTypeId === values?.employmentType?.value &&
      item?.intFromYear === +values?.fromYear &&
      item?.intToYear === +values?.toYear &&
      item?.numMultiplier === +values?.multiplier
  );
  if (isDuplicate)
    return toast.warning("Data already added", { toastId: "isDuplicate" });
  // check if the input values overlap with existing ranges
  const isOverlapping = rowDto?.some(
    (item) =>
      item?.strDependsOn === values?.dependsOn?.label &&
      item?.intEmploymentTypeId === values?.employmentType?.value &&
      // check if the input range is within or crosses an existing range
      ((+values?.fromYear >= item?.intFromYear &&
        +values?.fromYear <= item?.intToYear) ||
        (+values?.toYear >= item?.intFromYear &&
          +values?.toYear <= item?.intToYear) ||
        // check if the input range contains an existing range
        (+values?.fromYear <= item?.intFromYear &&
          +values?.toYear >= item?.intToYear))
  );
  if (isOverlapping)
    return toast.warning("Range overlaps with existing data", {
      toastId: "isOverlapping",
    });
  // create a new object with the input values
  const obj = {
    intGratuityId: 0,
    strDependsOn: values?.dependsOn?.label,
    intEmploymentTypeId: values?.employmentType?.value,
    strEmploymentTypeName: values?.employmentType?.label,
    intFromYear: +values?.fromYear,
    intToYear: +values?.toYear,
    numMultiplier: +values?.multiplier,
    isactive: true,
  };
  setRowDto([...rowDto, obj]);
  cb();
};

const isMultiHandler = ({ valueOption, name, setFieldValue, workplaceDDL }) => {
  const lastItem = valueOption[valueOption?.length - 1];

  let modifiedOptions;
  if (lastItem?.label === "All") {
    modifiedOptions = workplaceDDL.filter((item) => item.label !== "All");
  } else {
    modifiedOptions = valueOption.map((option) => {
      if (option?.label !== "All") {
        return { ...option, [name]: option };
      }
      return option;
    });
  }

  setFieldValue(name, modifiedOptions);
};


const getCommaMethod = (arr) => {
  const names = arr?.map(item =>  item?.strPfworkPlaceName);
  return names.join(", ");
}

export { addHandler, getCommaMethod, header, isMultiHandler };

