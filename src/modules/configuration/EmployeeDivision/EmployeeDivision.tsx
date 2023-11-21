import { DataTable, PCard, PCardHeader, PForm, TableButton } from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { debounce } from "lodash";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import CreateEmployeeDivision from "./Create/CreateEmployeeDivision";
const EmployeeDivision: React.FC = () => {
  // Data From Store
  const { intAccountId, buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );
  //   States
  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState<any>("");
  // Api Actions
  const GetEmployeeDivision = useApiRequest([]);

  // Landing Api
  const landingApi = (searchText?: any) => {
    GetEmployeeDivision?.action({
      urlKey: "GetEmployeeDivision",
      method: "GET",
      params: {
        accountId: intAccountId,
        workplaceId: wId,
        searchTxt: searchText || "",
      },
    });
  };

  // Life Cycle Hooks
  useEffect(() => {
    landingApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  // Table Header
  const header: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) => index + 1,
      align: "center",
      width: 10,
    },
    {
      title: "Division Name",
      dataIndex: "strDivisionName",
    },
    {
      title: "Division Code",
      dataIndex: "strDivisionCode",
      sorter: true,
    },
    {
      title: "Action",
      align: "center",
      render: (data: any, record: any) => {
        return (
          <TableButton
            buttonsList={[
              {
                type: "edit",
                onClick: () => {
                  setRowData(record);
                  setOpen(true);
                },
              },
            ]}
          />
        );
      },
      width: "60px",
    },
  ];

  // Search Handler
  const onSearch = debounce((e: any) => {
    landingApi(e?.target?.value);
  }, 500);
  return (
    <>
      <PForm
        onFinish={() => {
          setOpen(true);
        }}
      >
        <PCard>
          <PCardHeader
            title="Employee Division"
            onSearch={onSearch}
            submitText="Create"
          />

          <DataTable
            header={header}
            bordered
            data={GetEmployeeDivision?.data || []}
            loading={GetEmployeeDivision?.loading}
            scroll={{ x: 1000 }}
          />
        </PCard>
      </PForm>
      <PModal
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        afterClose={() => {
          setRowData("");
        }}
        title={`${rowData ? "Edit" : "Create"} Employee Division`}
        components={
          <CreateEmployeeDivision
            setOpen={setOpen}
            landingApi={landingApi}
            rowData={rowData}
          />
        }
      />
    </>
  );
};

export default EmployeeDivision;
