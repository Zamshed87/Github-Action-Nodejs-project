import { AddOutlined } from "@mui/icons-material";
import {
  Avatar,
  DataTable,
  PCard,
  PCardHeader,
  PForm,
  TableButton,
} from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Form, message } from "antd";
import axios from "axios";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
// import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
// import { dateFormatter } from "../../../utility/dateFormatter";
// import AddEditForm from "./addEditFile";

// import "./styles.css";
import { toast } from "react-toastify";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import Chips from "common/Chips";

function LeaveTypeCreate() {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();

  // redux
  const { buId, wgId, wgName, wId, buName } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  // state
  const [open, setOpen] = useState(false);

  // Form Instance
  const [form] = Form.useForm();

  // Api Instance
  const landingApi = useApiRequest({});
  const GetBusinessDetailsByBusinessUnitId = useApiRequest({});

  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any;
    searchText?: string;
    excelDownload?: boolean;
  };
  const landingApiCall = ({
    pagination = {},
    filerList,
    searchText = "",
  }: TLandingApi = {}) => {
    landingApi.action({
      urlKey: "GetAllLveLeaveType",
      method: "GET",
    });
  };

  useEffect(() => {
    landingApiCall();
    document.title = "Leave Type";

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // menu permission
  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 35) {
      employeeFeature = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchFunc = debounce((value) => {
    landingApiCall({ searchText: value });
  }, 500);
  console.log({ landingApi });
  // Header
  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) => index + 1,
      //   fixed: "left",
      width: 25,
      align: "center",
    },
    {
      title: "Leave Type Name",
      dataIndex: "strLeaveType",
      sorter: true,
      //   fixed: "left",
    },
    {
      title: "Code",
      dataIndex: "strLeaveTypeCode",
      sorter: true,
      //   fixed: "left",
    },

    {
      title: "Status",
      dataIndex: "statusValue",
      sorter: true,
      render: (_: any, rec: any) => (
        <>
          <Chips
            label={rec?.isActive ? "Active" : "Inactive"}
            classess={`${rec?.isActive ? "success" : "danger"}`}
          />
        </>
      ),
    },

    {
      width: 50,
      align: "center",
      render: (_: any, rec: any) => (
        <>
          {console.log({ rec })}
          {rec?.intAccountId > 0 ? (
            <TableButton
              buttonsList={[
                {
                  type: "edit",
                  onClick: () => {
                    history.push({
                      pathname: `/profile/employee/${rec?.intEmployeeBasicInfoId}`,
                      state: {
                        buId: rec?.intBusinessUnitId,
                        wgId: rec?.intWorkplaceGroupId,
                      },
                    });
                  },
                },
              ]}
            />
          ) : null}
        </>
      ),
    },
  ];
  // console.log(landingApi?.data);
  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        onFinish={() => {
          setOpen(true);
        }}
      >
        <PCard>
          <PCardHeader
            // exportIcon={true}
            // title={`Total ${landingApi?.data?.totalCount || 0} employees`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
            }}
            submitText="Leave Type"
            submitIcon={<AddOutlined />}
            buttonList={[]}
            onExport={() => {}}
          />

          {/* Example Using Data Table Designed By Ant-Design v4 */}
          <DataTable
            bordered
            data={landingApi?.data?.length > 0 ? landingApi?.data : []}
            loading={landingApi?.loading}
            header={header}
            // pagination={{
            //   pageSize: landingApi?.data?.pageSize,
            //   total: landingApi?.data?.totalCount,
            // }}
            // filterData={landingApi?.data?.employeeHeader}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              const { search } = form.getFieldsValue(true);
              landingApiCall({
                pagination,
                filerList: filters,
                searchText: search,
              });
            }}
            // scroll={{ x: 2000 }}
            // onRow={(record) => ({
            //   onClick: () =>
            //     history.push({
            //       pathname: `/profile/employee/${record?.intEmployeeBasicInfoId}`,
            //       state: {
            //         buId: record?.intBusinessUnitId,
            //         wgId: record?.intWorkplaceGroupId,
            //       },
            //     }),
            //   className: "pointer",
            // })}
          />
        </PCard>
      </PForm>

      {/* <PModal
        open={open}
        title="Create New Employee"
        width=""
        onCancel={() => setOpen(false)}
        maskClosable={false}
        components={
          <>
            <AddEditForm
              getData={landingApiCall}
              setIsAddEditForm={setOpen}
              isEdit={false}
              pages={undefined}
              singleData={undefined}
            />
          </>
        }
      /> */}
    </>
  ) : (
    <NotPermittedPage />
  );
}

export default LeaveTypeCreate;
