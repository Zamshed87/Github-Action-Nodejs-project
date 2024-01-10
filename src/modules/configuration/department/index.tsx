import { AddOutlined } from "@mui/icons-material";

import { DataTable, PCard, PCardHeader, PForm, TableButton } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Form } from "antd";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

// import "./styles.css";
import { toast } from "react-toastify";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import Chips from "common/Chips";
import AddEditForm from "./addEditForm";
import ViewFormComponent from "./viewForm";

function Department() {
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
      urlKey: "GetAllEmpDepartment",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceId: wId,
      },
    });
  };

  useEffect(() => {
    landingApiCall();
    document.title = "Department";

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // menu permission
  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 48) {
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
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      render: (_: any, rec: any) => {
        return (
          <div className="d-flex align-items-center">
            <span className="">
              {rec?.strDepartment} [ {rec?.strDepartmentCode}]
            </span>
          </div>
        );
      },
      //   fixed: "left",
    },
    {
      title: "Business Unit",
      dataIndex: "strBusinessUnit",
      sorter: true,
      width: 100,

      //   fixed: "left",
    },
    {
      title: "Status",
      dataIndex: "isActive",
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
            title="Department"
            submitText="Department"
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
        title={id ? "Edit Department" : "Create Department"}
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
      <PModal
        open={view}
        title={"Department Details"}
        width=""
        onCancel={() => {
          setId("");
          setView(false);
        }}
        maskClosable={true}
        components={
          <>
            <ViewFormComponent singleData={id} />
          </>
        }
      />
    </>
  ) : (
    <NotPermittedPage />
  );
}

export default Department;
