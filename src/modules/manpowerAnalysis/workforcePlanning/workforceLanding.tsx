import { EditOutlined } from "@ant-design/icons";
import { DataTable, Flex, PCard, PCardHeader, PForm } from "Components";
import { getSerial } from "Utils";
import { Form, Switch, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { toast } from "react-toastify";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { downloadFile } from "utility/downloadFile";
import CommonFilter from "common/CommonFilter";
import axios from "axios";
const WorkforcePlanningLanding = () => {
  const [criteriaList, getCriteriaList, criteriaListLoader] = useAxiosGet();
  const dispatch = useDispatch();
  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { orgId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  // router states
  const history = useHistory();

  let permission: any = {};
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30623) {
      permission = item;
    }
  });

  // Pagination state
  const [currentPage, setcurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [excelLoading, setExcelLoading] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Add filter state
  const [filterValues, setFilterValues] = useState<{
    yearTypeId?: number;
    fromYear?: number;
    workplaceGroupId?: number;
    workplaceId?: number;
  }>({});

  // Table data state
  const [data, setData] = useState<any[]>([]);

  // Sync data state with criteriaList?.data
  useEffect(() => {
    setData(criteriaList?.data?.data || []);
  }, [criteriaList]);

  const landingApi = (
    page: number = currentPage,
    size: number = pageSize,
    filters: {
      yearTypeId?: number;
      fromYear?: number;
      toYear?: number;
      workplaceGroupId?: number;
      workplaceId?: number;
    } = filterValues
  ) => {
    const yearTypeId = filters.yearTypeId ?? 0;
    const fromYear = filters.fromYear ?? 0;
    const toYear = filters.toYear ?? 0;
    getCriteriaList(
      `/WorkforcePlanning/GetAll?WorkplaceGroupId=${
        filters.workplaceGroupId || wgId
      }&WorkplaceId=${filters.workplaceId || wId}&yearTypeId=${
        yearTypeId || 0
      }&fromYear=${fromYear || 0}&toYear=${
        toYear || 0
      }&AccountId=${orgId}&pageNumber=${page}&pageSize=${size}`
    );
  };

  const updatePolicyStatusLocally = (
    list: any[],
    policyId: number,
    isActive: boolean
  ) => {
    const updatedList = [...list];
    const index = updatedList.findIndex((item) => item.headerId === policyId);
    if (index !== -1) {
      updatedList[index] = {
        ...updatedList[index],
        isActive: isActive,
        strStatus: isActive ? "Active" : "Inactive",
      };
    }
    return updatedList;
  };

  // Update: Accept record and newStatus
  const togglePfPolicyStatus = async (record: any, isActive: boolean) => {
    let url = `/WorkforcePlanning/ActiveNInactive?HeaderId=${record.headerId}&IsActive=${isActive}`;
    if (isActive) {
      url += `&WorkplaceId=${record.workplaceId}&FromDate=${record.fromYear}&ToDate=${record.toYear}`;
    }
    const response = await axios.put(url);
    return response?.data;
  };

  // Form Instance
  const [form] = Form.useForm(); // table column

  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: criteriaList?.data?.currentPage,
          pageSize: criteriaList?.data?.pageSize,
          index,
        }),
      fixed: "left",
      align: "center",
    },
    {
      title: "Workplace Group",
      dataIndex: "workplaceGroup",
    },
    {
      title: "Workplace",
      dataIndex: "workplace",
    },
    {
      title: "Year Type",
      dataIndex: "yearType",
    },
    {
      title: "Planning Year",
      dataIndex: "planningYear",
      render: (_: any, data: any) => {
        if (data?.fromYear && data?.toYear) {
          return `${data.fromYear} - ${data.toYear}`;
        }
        if (data?.fromYear) {
          return `${data.fromYear}`;
        }
        return "";
      },
    },
    {
      title: "Current Manpower",
      dataIndex: "currentManpower",
    },
    {
      title: "Planned Manpower",
      dataIndex: "targetManpower",
    },
    {
      title: "Difference",
      dataIndex: "difference",
      render: (value: number) => (
        <span
          style={{ color: value > 0 ? "green" : value < 0 ? "red" : "black" }}
        >
          {value > 0 ? `+${value}` : value}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (_: any, rec: any) => {
        const isActive = rec?.isActive === true;
        return (
          <Flex justify="center">
            <Tooltip title={isActive ? "Active" : "Inactive"}>
              <Switch
                size="small"
                checked={isActive}
                onChange={async (checked) => {
                  const prevStatus = rec.isActive;
                  setData((prev) =>
                    updatePolicyStatusLocally(prev, rec.headerId, checked)
                  );
                  try {
                    const result = await togglePfPolicyStatus(rec, checked);
                    const getSuccessMsg = (msg: any, checked: boolean) => {
                      if (Array.isArray(msg) && msg.length > 0) return msg[0];
                      if (typeof msg === "string") return msg;
                      return checked
                        ? "Activated successfully"
                        : "Deactivated successfully";
                    };
                    setTimeout(() => {
                      if (checked) {
                        toast.success(getSuccessMsg(result?.message, checked), {
                          autoClose: 3000,
                        });
                      } else {
                        toast.warn(getSuccessMsg(result?.message, checked), {
                          autoClose: 3000,
                        });
                      }
                    }, 100); // slight delay to ensure UI update
                  } catch (error) {
                    setData((prev) =>
                      updatePolicyStatusLocally(prev, rec.headerId, prevStatus)
                    );
                    let errorMsg = "Failed to update status";
                    let isWarn = false;
                    if (
                      error &&
                      typeof error === "object" &&
                      error !== null &&
                      "response" in error &&
                      error.response &&
                      typeof error.response === "object" &&
                      error.response !== null &&
                      "data" in error.response &&
                      error.response.data &&
                      typeof error.response.data === "object" &&
                      error.response.data !== null
                    ) {
                      const resp = error.response;
                      const respData = resp.data as any;
                      if (
                        "statusCode" in respData &&
                        respData.statusCode === 500 &&
                        Array.isArray(respData.message) &&
                        respData.message.length > 0
                      ) {
                        errorMsg = respData.message[0];
                        isWarn = true;
                      } else if (
                        "message" in respData &&
                        typeof respData.message === "string"
                      ) {
                        errorMsg = respData.message;
                      }
                    }
                    if (isWarn) {
                      toast.warn(errorMsg);
                    } else {
                      toast.error(errorMsg);
                    }
                  }
                }}
              />
            </Tooltip>
          </Flex>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (id: number, record: any) => (
        <Flex justify="center">
          {record?.isActive && (
            <Tooltip placement="bottom" title={"Edit"}>
              <EditOutlined
                style={{
                  color: "green",
                  fontSize: "14px",
                  cursor: "pointer",
                  margin: "0 5px",
                }}
                onClick={() => {
                  if (!permission?.isEdit) {
                    toast.warning("You don't have permission to edit");
                    return;
                  }
                  history.push(
                    "/profile/ManpowerAnalysis/WorkforcePlanning/edit",
                    {
                      workplaceId: record.workplaceId,
                      yearTypeId: record.yearTypeId,
                      fromYear: record.fromYear,
                      toYear: record.toYear,
                      headerId: record.headerId,
                    }
                  );
                }}
              />
            </Tooltip>
          )}
        </Flex>
      ),
      align: "center",
    },
  ];

  useEffect(() => {
    landingApi(currentPage, pageSize, filterValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wgId, wId, orgId, currentPage, pageSize, filterValues]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Manpower Analysis";

    // Cleanup function to reset the title when the component unmounts
    return () => {
      document.title = "PeopleDesk";
    };
  }, [dispatch]);

  const handleFilter = (values: any) => {
    setFilterValues({
      yearTypeId: values.yearTypeId,
      fromYear: values.fromYear,
      workplaceGroupId: values.workplaceGroup?.value,
      workplaceId: values.workplace?.value,
    });
  };

  return permission?.isView ? (
    <div>
      {criteriaListLoader && <Loading />}
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            title={`Total ${criteriaList?.data?.totalCount || 0} Workforce Planning`}
            buttonList={[
              {
                type: "primary",
                content: "Create New",
                icon: "plus",
                onClick: () => {
                  history.push(
                    "/profile/ManpowerAnalysis/WorkforcePlanning/create"
                  );
                },
              },
            ]}
            exportIcon
            onExport={() => {
              const yearTypeId = filterValues.yearTypeId ?? 0;
              const fromYear = filterValues.fromYear ?? 0;
              const excelLanding = async () => {
                setExcelLoading(true);
                if (criteriaList?.data?.length === 0) return null;
                try {
                  downloadFile(
                    `/WorkforcePlanning/WorkforcePlanningExcelReport?WorkplaceGroupId=${wgId}&WorkplaceId=${wId}&YearTypeId=${yearTypeId}&FromYear=${fromYear}&ToYear=${fromYear}&PageNumber=${currentPage}&PageSize=${pageSize}`,
                    "Workforce Planning",
                    "xlsx"
                  );
                  setExcelLoading(false);
                } catch (error: any) {
                  console.log("error", error);
                  toast.error("Failed to download excel");
                  setExcelLoading(false);
                }
              };
              excelLanding();
            }}
            filterComponent={
              <CommonFilter
                visible={isFilterVisible}
                onClose={(visible) => setIsFilterVisible(visible)}
                onFilter={handleFilter}
                isWorkplaceGroup={true}
                isWorkplace={true}
              />
            }
          />

          <div className="mb-3">
            <DataTable
              bordered
              data={data}
              loading={criteriaListLoader}
              header={header}
              pagination={{
                current: criteriaList?.currentPage || currentPage,
                pageSize: criteriaList?.pageSize || pageSize,
                total: criteriaList?.totalCount || 0,
                showSizeChanger: true,
              }}
              onChange={(pagination) => {
                setcurrentPage(pagination.current || 1);
                setPageSize(pagination.pageSize || 25);
              }}
            />
          </div>
        </PCard>
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};
export default WorkforcePlanningLanding;
