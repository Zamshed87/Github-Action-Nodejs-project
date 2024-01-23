import { AddOutlined } from "@mui/icons-material";

import { DataTable, PCard, PCardHeader, PForm, TableButton } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Form } from "antd";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";

// import "./styles.css";
import { toast } from "react-toastify";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import Chips from "common/Chips";
import AddEditForm from "./addEditForm";
import { getSerial } from "Utils";
import { dateFormatter } from "utility/dateFormatter";

function CommonAppPipeline() {
  // hook
  const dispatch = useDispatch();

  // redux
  const { buId, wgId, wId, orgId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );

  // state
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [id, setId] = useState("");

  // Form Instance
  const [form] = Form.useForm();

  // Api Instance
  const landingApi = useApiRequest({});

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
      urlKey: "ApprovalPipeline",
      method: "GET",
      params: {
        accountId: orgId,
        intWorkplaceId: wId,
        intWorkplaceGroupId: wgId,
        intBusinessUnitId: buId,
        searchText: searchText || "",
        PageSize: pagination?.pageSize || 25,
        PageNo: pagination?.current || 1,
      },
    });
  };

  useEffect(() => {
    landingApiCall();
    document.title = "Common Approval Pipeline";

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // menu permission
  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 129) {
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

  // Header
  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApi?.data?.currentPage,
          pageSize: landingApi?.data?.pageSize,
          index,
        }),
      fixed: "left",
      width: 25,
      align: "center",
    },
    {
      title: "Pipeline Name",
      dataIndex: "strPipelineName",
      sorter: true,
    },
    {
      title: "Remarks",
      dataIndex: "strRemarks",
      sorter: true,
    },
    {
      title: "Date",
      dataIndex: "dteCreatedAt",
      render: (_: any, rec: any) => dateFormatter(rec?.dteCreatedAt),
      sorter: true,
    },
    {
      title: "Workp. Group/Location",
      dataIndex: "workplcaeGroup",
      sorter: true,
    },
    {
      title: "Workplace/Concern",
      dataIndex: "workplcae",
      sorter: true,
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
            title="Common Approval Pipeline"
            // onSearch={(e) => {
            //   searchFunc(e?.target?.value);
            // }}
            submitText="Approval Pipeline"
            submitIcon={<AddOutlined />}
            buttonList={[]}
            onExport={() => {}}
          />

          {/* Example Using Data Table Designed By Ant-Design v4 */}
          <DataTable
            bordered
            data={
              landingApi?.data?.data?.length > 0 ? landingApi?.data?.data : []
            }
            loading={landingApi?.loading}
            header={header}
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
            onRow={(record) => ({
              onClick: () => {
                setView(true);
                setId(record);
              },
              className: "pointer",
            })}
          />
        </PCard>
      </PForm>

      <PModal
        open={open}
        title={id ? "Edit Approval Pipeline" : "Create Approval Pipeline"}
        width=""
        onCancel={() => {
          setId("");
          setOpen(false);
        }}
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

export default CommonAppPipeline;
