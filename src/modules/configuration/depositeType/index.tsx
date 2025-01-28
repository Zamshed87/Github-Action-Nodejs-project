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
// import ViewFormComponent from "./viewForm";

function DepositeType() {
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
  const deleteApi = useApiRequest({});

  const deleteDepositeById = (item: any) => {
    deleteApi?.action({
      urlKey: "DepositType",
      method: "DELETE",
      params: {
        id: item?.id,
      },
      toast: true,
      onSuccess: () => {
        landingApiCall();
      },
    });
  };
  const landingApiCall = () => {
    landingApi.action({
      urlKey: "DepositType",
      method: "GET",
      // params: {
      //   accountId: orgId,
      //   businessUnitId: buId,
      //   workplaceId: wId,
      // },
    });
  };

  useEffect(() => {
    landingApiCall();
    document.title = "Deposite Type";

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // menu permission
  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30528) {
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
      title: "Deposite Type",
      width: 20,
      dataIndex: "depositTypeName",
      sorter: true,
    },
    {
      title: "Comments",
      dataIndex: "comment",
      sorter: true,
      width: 50,
    },
    // {
    //   title: "Business Unit",
    //   dataIndex: "strBusinessUnit",
    //   sorter: true,
    //   align: "left",
    //   width: 20,
    // },
    // {
    //   title: "Workplace Group",
    //   dataIndex: "strWorkplaceGroup",
    //   sorter: true,
    //   align: "left",
    //   width: 20,
    // },
    // {
    //   title: "Workplace",
    //   dataIndex: "strWorkplace",
    //   sorter: true,
    //   align: "left",
    //   width: 20,
    // },
    // {
    //   title: "Cost Center Division",
    //   dataIndex: "strCostCenterDivision",
    //   sorter: true,
    //   align: "center",
    //   width: 20,

    //   //   fixed: "left",
    // },
    {
      title: "Active",
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
    // {
    //   title: "Status",
    //   dataIndex: "isActive",
    //   align: "center",
    //   width: 10,

    //   sorter: true,
    //   render: (_: any, rec: any) => (
    //     <>
    //       {/* <Chips
    //         label={rec?.isActive ? "Active" : "Inactive"}
    //         classess={`${rec?.isActive ? "success" : "danger"}`}
    //       /> */}
    //       <Tag color={`${rec?.isActive ? "green" : "red"}`}>
    //         {rec?.isActive ? "Active" : "Inactive"}
    //       </Tag>
    //     </>
    //   ),
    // },

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
              {
                type: "delete",
                onClick: (e: any) => {
                  e.preventDefault();
                  deleteDepositeById(rec);
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
            title="Deposite Type"
            submitText="Deposite Type"
            submitIcon={<AddOutlined />}
            buttonList={[]}
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
              landingApiCall();
            }}
            // scroll={{ x: 2000 }}
            // onRow={(record) => ({
            //   onClick: () => {
            //     setView(true);
            //     setId(record);
            //   },
            //   className: "pointer",
            // })}
          />
        </PCard>
      </PForm>

      <PModal
        open={open}
        title={id ? "Edit Deposite Type" : "Create Deposite Type"}
        width=""
        onCancel={() => {
          setOpen(false);
          setId("");
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
      {/* <PModal
        open={view}
        title={"Deposite Type Details"}
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
      /> */}
    </>
  ) : (
    <NotPermittedPage />
  );
}

export default DepositeType;
