import { AddOutlined } from "@mui/icons-material";

import { DataTable, PCard, PCardHeader, PForm, TableButton } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Form, Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

// import "./styles.css";
import { toast } from "react-toastify";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import AddEditForm from "./addEditForm";

function OrgInfoId() {
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
      urlKey: "GetEmpIdCardExternalInfo",
      method: "GET",
      params: {
        accountId: orgId,
      },
    });
  };

  useEffect(() => {
    landingApiCall();
    document.title = "Org Info For Id";

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // menu permission
  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30385) {
      employeeFeature = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const searchFunc = debounce((value) => {
  //   landingApiCall({ searchText: value });
  // }, 500);

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
      title: "Org Address",
      dataIndex: "orgAddress",
      sorter: true,
      //   fixed: "left",
    },
    {
      title: "Org Address Bangla",
      dataIndex: "orgAddressBn",
      sorter: true,
      //   fixed: "left",
    },
    {
      title: "Email",
      dataIndex: "orgEmail",
      sorter: true,
      //   fixed: "left",
    },
    {
      title: "Org Domain",
      dataIndex: "orgDomainAddress",
      sorter: true,
      //   fixed: "left",
    },
    {
      title: "Telephone",
      dataIndex: "orgTelephone",
      sorter: true,
      //   fixed: "left",
    },
    {
      title: "Workplaces",
      dataIndex: "workplaces",
       render: (_: any, rec: any) => {
        const name = rec?.workplaces || "";
        const workplaces = name.split(",").map((w: any) => w.trim());
        const firstWorkplace = workplaces[0] || "";
        const remainingCount = workplaces.length - 1;

        return workplaces.length > 1 ? (
          <Tooltip title={name}>
            <span>
              {firstWorkplace},{" "}
              <span
                style={{
                  backgroundColor: "rgb(20 184 54 / 57%)", // Custom green with transparency
                  color: "white",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "10px",
                  display: "inline-block",
                  minWidth: "7px",
                  textAlign: "center",
                }}
              >
                {remainingCount}+
              </span>
            </span>
          </Tooltip>
        ) : (
          firstWorkplace
        );
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      width:50,
      render: (_: any, rec: any) => (
        <>
          <Tag color={`${rec?.isActive ? "green" : "red"}`}>
            {rec?.isActive ? "Active" : "Inactive"}
          </Tag>
        </>
      ),
    },
    {
      title:"Action",
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
            title="Org Info For Id"
            submitText="Org Info For Id"
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
          />
        </PCard>
      </PForm>

      <PModal
        open={open}
        title={id ? "Edit Org Info for Id" : "Create Org Info for Id"}
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

export default OrgInfoId;
