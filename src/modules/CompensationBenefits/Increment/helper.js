import { EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import AvatarComponent from "../../../common/AvatarComponent";
import Chips from "../../../common/Chips";
import { dateFormatter } from "../../../utility/dateFormatter";

export const getAllIncrementAndPromotionLanding = async (
  orgId,
  buId,
  wgId,
  searchText = "",
  setter,
  setAllData,
  setLoading,
  values,
  pages,
  setPages
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/GetEmployeeIncrementLanding?accountId=${orgId}&businessUnitId=${buId}&dteFromDate=${values?.filterFromDate}&dteToDate=${values?.filterToDate}&workplaceGroupId=${wgId}&PageNo=${pages?.current}&PageSize=${pages?.pageSize}&searchTxt=${searchText}`
    );
    if (res?.data) {
      const modifiedData = res?.data?.data?.map((item, index) => ({
        ...item,
        initialSerialNumber: index + 1,
      }));
      setter && setter(modifiedData);
      setAllData && setAllData(modifiedData);
      setPages?.({
        current: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        total: res?.data?.totalCount,
      });
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const incrementColumnData = (
  page,
  paginationSize,
  history,
  getTransferNpromotion
) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      width: 30,
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (record) => {
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
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Employee Code",
      dataIndex: "strEmployeeCode",
      sort: true,
      filter: false,
      fieldType: "string",
      width: 130,
    },
    {
      title: "Type",
      dataIndex: "strEmploymentType",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Section",
      dataIndex: "strSection",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Depend On",
      dataIndex: "strIncrementDependOn",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Increment Percentage/Amount",
      dataIndex: "numIncrementPercentageOrAmount",
      sort: true,
      filter: false,
      fieldType: "number",
    },
    {
      title: "Effective Data",
      dataIndex: "dteEffectiveDate",
      render: (record) => dateFormatter(record?.dteEffectiveDate),
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "Status",
      dataIndex: "strStatus",
      sort: true,
      filter: false,
      fieldType: "string",
      render: (record) => {
        return (
          <div className="tableBody-title">
            {record?.strStatus === "Approved" && (
              <Chips label="Approved" classess="success" />
            )}
            {record?.strStatus === "Approved By Admin" && (
              <Chips label="Approved" classess="success" />
            )}
            {record?.strStatus === "Pending" && (
              <Chips label="Pending" classess="warning" />
            )}
            {record?.strStatus === "Rejected" && (
              <Chips label="Rejected" classess="danger" />
            )}
            {record?.strStatus === "Reject By Admin" && (
              <Chips label="Rejected" classess="danger" />
            )}
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "strStatus",
      width: 80,
      render: (record) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="Edit" arrow>
            <button
              className={`${
                record?.strStatus === "Pending" ? "iconButton" : "d-none"
              }`}
              type="button"
            >
              <EditOutlined
                onClick={() => {
                  if (record?.intTransferNpromotionReferenceId) {
                    getTransferNpromotion(
                      `/Employee/GetEmpTransferNpromotionById?id=${record?.intTransferNpromotionReferenceId}`,
                      (res) => {
                        history.push({
                          pathname: `/compensationAndBenefits/increment/singleIncrement/edit/${record?.intIncrementId}`,
                          state: {
                            singleData: {
                              incrementList: [record],
                              transferPromotionObj: res,
                            },
                            // isPromotion: false,
                            // incrementList: modifiedData,
                            // transferPromotionObj: null,
                          },
                        });
                      }
                    );
                  } else {
                    history.push({
                      pathname: `/compensationAndBenefits/increment/singleIncrement/edit/${record?.intIncrementId}`,
                      state: {
                        singleData: {
                          incrementList: [record],
                          transferPromotionObj: {},
                        },
                        // isPromotion: false,
                        // incrementList: modifiedData,
                        // transferPromotionObj: null,
                      },
                    });
                  }
                }}
              />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];
};

export const searchData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.data?.filter(
      (item) =>
        regex.test(item?.strEmployeeName?.toLowerCase()) ||
        regex.test(item?.strDesignation?.toLowerCase()) ||
        regex.test(item?.strDepartment?.toLowerCase()) ||
        regex.test(item?.strWorkplace?.toLowerCase()) ||
        regex.test(item?.strWorkplaceGroup?.toLowerCase()) ||
        regex.test(item?.strBusinessUnit?.toLowerCase())
    );
    setRowDto({ data: newDta });
  } catch {
    setRowDto([]);
  }
};
export const columns = {
  sl: "SL",
  strEmployeeName: "Employee Name",
  strEmploymentType: "Type",
  strDesignation: "Designation",
  strDepartment: "Department",
  strIncrementDependOn: "Depend On",
  numIncrementPercentageOrAmount: "Increment Percentage/Amount",
  dteEffectiveDate: "Effective Data",
  strStatus: "Status",
};
