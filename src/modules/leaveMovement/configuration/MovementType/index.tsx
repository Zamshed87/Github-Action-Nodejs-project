import { AddOutlined } from "@mui/icons-material";
import { DataTable, PCard, PCardHeader, PForm, TableButton } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Form } from "antd";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
// import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
// import { dateFormatter } from "../../../utility/dateFormatter";
// import AddEditForm from "./addEditFile";

// import "./styles.css";
import { toast } from "react-toastify";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import AddEditForm from "./addEditForm";

function MovementType() {
  const frequencyLabel = (id: any) => {
    switch (id) {
      case 1:
        return "Daily";
      case 2:
        return "Weekly";
      case 3:
        return "Monthly";
      case 4:
        return "Half-Yearly";
      case 5:
        return "Yearly";
      default:
        return " ";
    }
  };
  // hook
  const dispatch = useDispatch();

  // redux
  const { buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  // state
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");

  // Form Instance
  const [form] = Form.useForm();

  // Api Instance
  const landingApi = useApiRequest({});
  const deleteMovement = useApiRequest({});

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

    searchText = "",
  }: TLandingApi = {}) => {
    landingApi.action({
      urlKey: "GetAllLveMovementType",
      method: "GET",
      params: {
        BusinessUnitId: buId,
        WorkGroupId: wgId,
        SearchText: searchText,
        PageNo: pagination?.current,
        PageSize: pagination?.pageSize,
      },
    });
  };

  useEffect(() => {
    landingApiCall();
    document.title = "Movement Policy";

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // menu permission
  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 36) {
      employeeFeature = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      title: "Movement Type Name",
      dataIndex: "strMovementType",
      sorter: true,
      //   fixed: "left",
    },
    {
      title: "Quota Hour",
      dataIndex: "intQuotaHour",
      sorter: true,
      //   fixed: "left",
    },
    {
      title: "Quota Frequency",
      dataIndex: "strLeaveTypeCode",
      render: (_: any, rec: any) => (
        <div>{frequencyLabel(rec?.intQuotaFrequency)}</div>
      ),

      sorter: true,
      //   fixed: "left",
    },

    {
      width: 50,
      align: "center",
      render: (_: any, rec: any) => (
        <>
          <TableButton
            buttonsList={[
              {
                type: "edit",
                onClick: (e: any) => {
                  if (!employeeFeature?.isEdit) {
                    return toast.warn("You don't have permission");
                    e.stopPropagation();
                  }
                  setOpen(true);
                  setId(rec);
                },
              },
              {
                type: "delete",
                onClick: (e: any) => {
                  if (!employeeFeature?.isEdit) {
                    return toast.warn("You don't have permission");
                    e.stopPropagation();
                  }
                  const cb = () => {
                    console.log("callback calling...");

                    landingApiCall();
                  };

                  deleteMovement.action({
                    urlKey: "DeleteLveMovementTypeById",
                    method: "GET",
                    params: {
                      id: rec?.intMovementTypeId,
                    },
                    onSuccess: () => {
                      cb();
                    },
                  });
                  //   getDeleteLveMovementTypeById(rec?.intMovementTypeId, () => {
                  //     landingApiCall();
                  //   });
                },
              },
            ]}
          />
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
            // onSearch={(e) => {
            //   searchFunc(e?.target?.value);
            // }}
            submitText="Movement Type"
            submitIcon={<AddOutlined />}
            buttonList={[]}
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

      <PModal
        open={open}
        title={id ? "Edit Movement Type" : "Create Movement Type"}
        width=""
        onCancel={() => setOpen(false)}
        maskClosable={false}
        components={
          <>
            <AddEditForm
              getData={landingApiCall}
              setIsAddEditForm={setOpen}
              isEdit={id ? true : false}
              singleData={id}
              setId={setId}
            />
          </>
        }
      />
    </>
  ) : (
    <NotPermittedPage />
  );
}

export default MovementType;
