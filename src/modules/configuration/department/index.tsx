import { AddOutlined } from "@mui/icons-material";

import { DataTable, PCard, PCardHeader, PForm, TableButton } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Form, Tag } from "antd";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

// import "./styles.css";
import { toast } from "react-toastify";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
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

  const landingApiCall = () => {
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
    if (item?.menuReferenceId === 50) {
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
      width: 5,
    },
    {
      title: "Department",
      width: 20,
      dataIndex: "strDepartment",
      sorter: true,

      render: (_: any, rec: any) => {
        return (
          <div className="">
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
      align: "center",
      width: 20,

      //   fixed: "left",
    },
    {
      title: "Cost Center Division",
      dataIndex: "strCostCenterDivision",
      sorter: true,
      align: "center",
      width: 20,

      //   fixed: "left",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      align: "center",
      width: 10,

      sorter: true,
      render: (_: any, rec: any) => (
        <>
          {/* <Chips
            label={rec?.isActive ? "Active" : "Inactive"}
            classess={`${rec?.isActive ? "success" : "danger"}`}
          /> */}
          <Tag color={`${rec?.isActive ? "green" : "red"}`}>
            {rec?.isActive ? "Active" : "Inactive"}
          </Tag>
        </>
      ),
    },

    {
      width: 20,
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
              landingApiCall();
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
