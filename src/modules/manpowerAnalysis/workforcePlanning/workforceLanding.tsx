import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { DataTable, Flex, PCard, PCardHeader, PForm } from "Components";
import { getSerial } from "Utils";
import { Form, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import moment from "moment";
import { dateFormatter } from "utility/dateFormatter";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { toast } from "react-toastify";
const WorkforcePlanningLanding = () => {
  const defaultFromDate = moment().subtract(3, "months").startOf("month"); // 1st day of 3 months ago
  const defaultToDate = moment().endOf("month"); // Last day of the current month
  const dispatch = useDispatch();  const {
    permissionList,
  } = useSelector((state: any) => state?.auth, shallowEqual);

  // router states
  const history = useHistory();

  let permission: any = {};
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30623) {
      permission = item;
    }
  });

  // Demo data for workforce planning
  const demoWorkforcePlanningData = [
    {
      id: 1,
      workplaceGroupName: "Corporate Office",
      workplaceName: "Head Office",
      yearType: "Fiscal Year",
      planningYear: "2024-01-01",
      currentManpower: 150,
      plannedManpower: 175,
      difference: 25
    },
    {
      id: 2,
      workplaceGroupName: "Regional Office",
      workplaceName: "Dhaka Branch",
      yearType: "Calendar Year",
      planningYear: "2024-01-01",
      currentManpower: 85,
      plannedManpower: 95,
      difference: 10
    },
    {
      id: 3,
      workplaceGroupName: "Regional Office",
      workplaceName: "Chittagong Branch",
      yearType: "Calendar Year",
      planningYear: "2024-01-01",
      currentManpower: 65,
      plannedManpower: 80,
      difference: 15
    },
    {
      id: 4,
      workplaceGroupName: "Manufacturing",
      workplaceName: "Production Unit 1",
      yearType: "Fiscal Year",
      planningYear: "2024-01-01",
      currentManpower: 200,
      plannedManpower: 220,
      difference: 20
    },
    {
      id: 5,
      workplaceGroupName: "Manufacturing",
      workplaceName: "Production Unit 2",
      yearType: "Fiscal Year",
      planningYear: "2024-01-01",
      currentManpower: 180,
      plannedManpower: 190,
      difference: 10
    }
  ];
  // state
  const [loading] = useState(false);
  const [landingData, setLandingData] = useState({
    data: demoWorkforcePlanningData,
    totalCount: demoWorkforcePlanningData.length,
    currentPage: 1,
    pageSize: 25
  });
  // Form Instance
  const [form] = Form.useForm();  // table column
  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingData?.currentPage,
          pageSize: landingData?.pageSize,
          index,
        }),
      fixed: "left",
      align: "center",
    },
    {
      title: "Workplace Group",
      dataIndex: "workplaceGroupName",
    },
    {
      title: "Workplace",
      dataIndex: "workplaceName",
    },
    {
      title: "Year Type",
      dataIndex: "yearType",
    },
    {
      title: "Planning Year",
      dataIndex: "planningYear",
      render: (data: any) => dateFormatter(data),
    },
     {
      title: "Current Manpower",
      dataIndex: "currentManpower",
    },
     {
      title: "Planned Manpower",
      dataIndex: "plannedManpower",
    },
     {
      title: "Difference",
      dataIndex: "difference",
      render: (value: number) => (
        <span style={{ color: value > 0 ? 'green' : value < 0 ? 'red' : 'black' }}>
          {value > 0 ? `+${value}` : value}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (id: number) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title={"View"}>
            <EyeOutlined
              style={{ color: "green", fontSize: "14px", cursor: "pointer" }}
              onClick={() => {
                console.log("View workforce planning:", id);
                // Add view logic here
              }}
            />
          </Tooltip>
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
                console.log("Edit workforce planning:", id);
                // Add edit logic here
              }}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
    },
  ];  const handleDataFilter = (
    pagination: { current: number; pageSize: number } = {
      current: 1,
      pageSize: 25,
    }
  ) => {
    const values = form.getFieldsValue(true);
    console.log("Filter values:", values);
    
    // For demo purposes, we'll just update pagination
    setLandingData(prev => ({
      ...prev,
      currentPage: pagination.current,
      pageSize: pagination.pageSize
    }));
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Manpower Analysis";

    // Cleanup function to reset the title when the component unmounts
    return () => {
      document.title = "PeopleDesk";
    };
  }, [dispatch]);
  return permission?.isView ? (
    <div>
      {loading && <Loading />}

      <PForm
        form={form}
        initialValues={{
          fromDate: defaultFromDate,
          toDate: defaultToDate,
          bUnit: { label: "All", value: 0 },
          workplaceGroup: { label: "All", value: 0 },
          workplace: { label: "All", value: 0 },
          department: { label: "All", value: 0 },
          hrPosition: { label: "All", value: 0 },
          yearType: { label: "All", value: 0 },
        }}
      >
        <PCard>
          <PCardHeader
            title={`Total ${landingData?.totalCount || 0} Workforce Planning`}
            buttonList={[
              {
                type: "primary",
                content: "Create New",
                icon: "plus",
                onClick: () => {
                  history.push("/manpowerAnalysis/workforcePlanning/create");
                },
              },
            ]}
          />

          <div className="mb-3">
            <DataTable
              bordered
              data={landingData?.data || []}
              loading={loading}
              header={header}
              pagination={{
                pageSize: landingData?.pageSize,
                total: landingData?.totalCount,
              }}
              onChange={(pagination) => {
                handleDataFilter(pagination);
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
