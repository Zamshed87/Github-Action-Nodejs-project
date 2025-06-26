import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { DataTable, Flex, PCard, PCardHeader, PForm } from "Components";
import { getSerial } from "Utils";
import { Form, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { dateFormatter } from "utility/dateFormatter";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { toast } from "react-toastify";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { downloadFile } from "utility/downloadFile";
import CommonFilter from "common/CommonFilter";
const WorkforcePlanningLanding = () => {
  const [criteriaList, getCriteriaList, criteriaListLoader] = useAxiosGet();
  const dispatch = useDispatch();
  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { orgId, buId, wgId, wId } = useSelector(
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
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [excelLoading, setExcelLoading] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Add filter state
  const [filterValues, setFilterValues] = useState<{
    yearTypeId?: number;
    fromYear?: number;
    workplaceGroupId?: number;
    workplaceId?: number;
  }>({});

  const landingApi = (
    page: number = pageNo,
    size: number = pageSize,
    filters: {
      yearTypeId?: number;
      fromYear?: number;
      workplaceGroupId?: number;
      workplaceId?: number;
    } = filterValues
  ) => {
    const yearTypeId = filters.yearTypeId ?? 0;
    const fromYear = filters.fromYear ?? 0;
    getCriteriaList(
      `/WorkforcePlanning/WorkforcePlanning?WorkplaceGroupId=${
        filters.workplaceGroupId || wgId
      }&WorkplaceId=${
        filters.workplaceId || wId
      }&yearTypeId=${yearTypeId}&fromYear=${fromYear}&AccountId=${orgId}&pageNumber=${page}&pageSize=${size}`
    );
  };

  // Form Instance
  const [form] = Form.useForm(); // table column

  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: criteriaList?.pageNo,
          pageSize: criteriaList?.pageSize,
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
      title: "Action",
      dataIndex: "id",
      render: (id: number, record: any) => (
        <Flex justify="center">
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
                  "/profile/ManpowerAnalysis/WorkforcePlanning/edit/" + id,
                  {
                    workplaceId: record.workplaceId,
                    yearTypeId: record.yearTypeId,
                    fromYear: record.fromYear,
                    toYear: record.toYear,
                  }
                );
              }}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
    },
  ];

  useEffect(() => {
    landingApi(pageNo, pageSize, filterValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wgId, wId, orgId, pageNo, pageSize, filterValues]);

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
            title={`Total ${criteriaList?.totalCount || 0} Workforce Planning`}
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
                    `/WorkforcePlanning/WorkforcePlanningLandingExcel?WorkplaceGroupId=${wgId}&WorkplaceId=${wId}&yearTypeId=${yearTypeId}&fromYear=${fromYear}&toYear=${fromYear}&AccountId=${orgId}&pageNumber=${pageNo}&pageSize=${pageSize}`,
                    "Workforce Planning",
                    "xlsx",
                    setLoading
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
              data={criteriaList?.data || []}
              loading={criteriaListLoader}
              header={header}
              pagination={{
                current: criteriaList?.pageNo || pageNo,
                pageSize: criteriaList?.pageSize || pageSize,
                total: criteriaList?.totalCount || 0,
                showSizeChanger: true,
              }}
              onChange={(pagination) => {
                setPageNo(pagination.current || 1);
                setPageSize(pagination.pageSize || 10);
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
