import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { DataTable, Flex, PCard, PCardHeader, PForm } from "Components";
import { getSerial } from "Utils";
import { Form, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { formatDate, ViewTrainingRequistion } from "./helper";

import Chips from "common/Chips";
import moment from "moment";
import { dateFormatter } from "utility/dateFormatter";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { toast } from "react-toastify";
import { formatFilterValue } from "utility/filter/helper";
const WorkforcePlanningLanding = () => {
  const defaultFromDate = moment().subtract(3, "months").startOf("month"); // 1st day of 3 months ago
  const defaultToDate = moment().endOf("month"); // Last day of the current month
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { intEmployeeId },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  // router states
  const history = useHistory();

  let permission: any = {};
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30623) {
      permission = item;
    }
  });
  // hooks
  const [landingApi, getLandingApi, landingLoading] = useAxiosGet();

  // state
  const [loading, setLoading] = useState(false);
  // Form Instance
  const [form] = Form.useForm();
  // table column
  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApi?.currentPage,
          pageSize: landingApi?.pageSize,
          index,
        }),
      fixed: "left",
      align: "center",
    },
    {
      title: "Requestor",
      dataIndex: "employmentName",
    },
    {
      title: "Training Type",
      dataIndex: "trainingTypeName",
    },
    {
      title: "Created By",
      dataIndex: "createdByName",
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      render: (data: any) => dateFormatter(data),
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: any) => {
        let statusClass = "secondary p-2 rounded-5"; // Default class

        if (status?.label === "Pending") {
          statusClass = "success p-2 rounded-5";
        } else if (status?.label === "Assigned") {
          statusClass = "secondary p-2 rounded-5";
        } else if (status?.label === "Deferred") {
          statusClass = "warning p-2 rounded-5";
        }

        return (
          <div>
            <Chips label={status?.label} classess={statusClass} />
          </div>
        );
      },
      width: 30,
    },
    {
      title: "Action",
      dataIndex: "letterGenerateId",
      render: (generateId: number, rec: any) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title={"View"}>
            <EyeOutlined
              style={{ color: "green", fontSize: "14px", cursor: "pointer" }}
              onClick={() => {
                //
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
              }}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
    },
  ];
  const landingApiCall = (
    pagination: { current: number; pageSize: number } = {
      current: 1,
      pageSize: 25,
    }
  ) => {
    const values = form.getFieldsValue(true);
    console.log(values);
    const fromDate = values?.fromDate;
    const toDate = values?.toDate;

    const apiUrl = `/TrainingRequisition/Training/TrainingRequisition?fromDate=${formatDate(
      fromDate
    )}&toDate=${formatDate(toDate)}&trainingTypeIds=${formatFilterValue(
      values?.trainingType
    )}&departmentIds=${formatFilterValue(
      values?.departmentId
    )}&designationIds=${formatFilterValue(values?.hrPositionId)}&statusIds=${
      formatFilterValue(values?.requisitionStatus)
        ? formatFilterValue(values?.requisitionStatus)
        : ""
    }&pageNumber=${pagination?.current}&pageSize=${pagination?.pageSize}`;

    console.log(apiUrl); // Check the constructed URL
    getLandingApi(apiUrl);
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
      {loading || (landingLoading && <Loading />)}

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
          trainingType: { label: "All", value: 0 },
          requisitionStatus: { label: "All", value: "" },
        }}
      >
        <PCard>
          <PCardHeader
            title={`Total ${landingApi?.totalCount || 0} Training Requisition`}
            buttonList={[
              {
                type: "primary",
                content: "Create New",
                icon: "plus",
                onClick: () => {
                  history.push("/trainingAndDevelopment/requisition/create");
                },
              },
            ]}
          />

          <div className="mb-3">
            <DataTable
              bordered
              data={landingApi?.data || []}
              loading={landingLoading}
              header={header}
              pagination={{
                pageSize: landingApi?.pageSize,
                total: landingApi?.totalCount,
              }}
              filterData={landingApi?.data?.filters}
              onChange={(pagination) => {
                landingApiCall(pagination);
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
