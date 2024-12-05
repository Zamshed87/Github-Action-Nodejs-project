import moment from "moment";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { dateFormatter, monthFirstDate, monthLastDate } from "../../../utility/dateFormatter";
import { Cell } from "../../../utility/customExcel/createExcelHelper";

export const taskCreateInitData = {
  empList: [],
  fDate: null,
  tDate: null,
  taskTitle: "",
  description: "",
};

export const initDataForLanding = {
  status: "",
  search: "",
  filterFromDate: monthFirstDate(),
  filterToDate: monthLastDate(),
  employee: "",
};

export const validationSchemaForLanding = Yup.object().shape({
  filterFromDate: Yup.string().required("This field is required"),
  filterToDate: Yup.string().required("This field is required"),
});

export const validationSchemaForTaskCreation = Yup.object().shape({
  taskTitle: Yup.string().required("This field is required"),
  description: Yup.string().required("This field is required"),
});

export const saveTask = ({
  values,
  employeeId,
  orgId,
  buId,
  saveSingleTask,
  cb,
}) => {
  if (
    values?.empList?.length === 0 ||
    !values?.fDate ||
    !values?.tDate ||
    !values?.description
  ) {
    return toast.error("All fields are required");
  }

  const empList = values?.empList?.map((data, index) => {
    return {
      rowId: index + 1,
      employeeId: data?.value,
    };
  });
  const payload = {
    tmsHeader: {
      headerId: 0,
      taskTitle: values?.taskTitle,
      taskDescription: values?.description,
      fromdate: values?.fDate,
      todate: values?.tDate,
      createdAt: moment().format("YYYY-MM-DDTHH:mm:ssZ"),
      createdBy: employeeId,
      accountId: orgId,
      businessunitId: buId,
    },
    tmsRow: empList,
  };
  saveSingleTask(
    "/Task/TaskManagmentCreate",
    payload,
    (res) => {
      cb();
    },
    true
  );
};

export const getTask = ({
  getAllTasks,
  setRowDto,
  fDate,
  tDate,
  employeeId,
  isManagement,
  srcTxt,
  isPaginated,
  pageNo,
  pageSize,
  setPages,
}) => {
  getAllTasks(
    `/Task/TaskManagmentLandingPagination?fromDate=${fDate}&toDate=${tDate}&employeeId=${employeeId}&isManagementView=${isManagement}&searchTxt=${srcTxt}&IsPaginated=${isPaginated}&PageNo=${pageNo}&PageSize=${pageSize}`,
    (res) => {
      setRowDto(res?.data);
      setPages({
        current: res?.currentPage,
        pageSize: res?.pageSize,
        total: res?.totalCount,
      });
    }
  );
};
export const column = {
  sl: "SL",
  title: "Title",
  fromDate: "From Date",
  toDate: "To Date",
  createdBy: "CreatedBy",
  createdAt: "CreatedAt",
};

export const getTableDataForExcel = (row) => {
  const data = row?.map((item, index) => {
    return [
      new Cell(String(index + 1), "center", "text").getCell(),
      new Cell(item?.title, "left", "text").getCell(),
      new Cell(dateFormatter(item?.fromDate), "center", "text").getCell(),
      new Cell(dateFormatter(item?.toDate), "center", "text").getCell(),
      new Cell(item?.createdBy, "left", "text").getCell(),
      new Cell(dateFormatter(item?.createdAt), "center", "text").getCell(),
    ];
  });
  return data;
};

export const taskLandingTableCol = (page, paginationSize) => {
  return [
    {
      title: "SL",
      // need to fixed issue after pagination
      render: (text, record, index) => index + 1,
      sorter: false,
      filter: false,
    },
    {
      title: "Title",
      dataIndex: "title",
      sort: false,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Duration",
      dataIndex: "",
      render: (record) => {
        return (
          <div className="d-flex align-items-center">
            {moment(record?.fromDate).format("DD MMM, YYYY h:mmA")} To{" "}
            {moment(record?.toDate).format("DD MMM, YYYY h:mmA")}
          </div>
        );
      },
      sort: false,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      sort: false,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Created At",
      dataIndex: "",
      render: (record) => {
        return (
          <div className="d-flex align-items-center">
            {moment(record?.createdAt).format("DD MMM, YYYY h:mma")}
          </div>
        );
      },
      sort: false,
      filter: false,
      fieldType: "string",
    },
  ];
};

export const getSingleData = ({
  orgId,
  buId,
  employeeId,
  isManagement,
  taskId,
  getSingleTask,
  setSingleData,
}) => {
  getSingleTask(
    `/Task/TaskManagmentGetbyId?accountId=${orgId}&businessUnitId=${buId}&employeeId=${employeeId}&isManagementView=${isManagement}&taskHeaderId=${taskId}`,
    (res) => {
      setSingleData(res);
    }
  );
};
