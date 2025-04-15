/* eslint-disable @typescript-eslint/no-empty-function */
import { DataTable } from "Components";

import { useApiRequest } from "Hooks";
import { Row } from "antd";

import { useEffect } from "react";

import { data, sandwitchHeader } from "./PunishmentCreate";

export const PunishmentDetails = ({ singleData }: any) => {
  const detailsApi = useApiRequest({});

  useEffect(() => {
    if (singleData?.punishmentId) {
      detailsApi.action({
        urlKey: "LeavePunishmentGetById",
        method: "GET",
        params: {
          PunishmentId: singleData?.punishmentId,
        },
      });
    }
  }, [singleData]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const header: any = [
    {
      title: "Sequence",
      dataIndex: "sequnceId",

      align: "center",
      width: 30,
    },
    {
      title: "leave Type",
      dataIndex: "leaveTypeName",
      width: 100,
    },
  ];

  return (
    <>
      <h4 className="">General Info</h4>
      <div style={{ fontSize: 12 }}>
        Policy Name: {detailsApi?.data?.data?.generalData?.punishmentPolicyName}{" "}
        <br />
        Workplace Name: {
          detailsApi?.data?.data?.generalData?.workplaceName
        }{" "}
        <br />
        Employment Name: {
          detailsApi?.data?.data?.generalData?.employmentName
        }{" "}
        <br />
      </div>
      <div className="mt-2">
        <DataTable
          bordered
          data={data.filter((item) => detailsApi?.data?.data?.[item?.id])}
          loading={false}
          header={sandwitchHeader}
        />
      </div>
      <div className="mt-2">
        <h4 className="my-2">Leave Sequence</h4>

        <DataTable
          bordered
          data={detailsApi?.data?.data?.sequenceList || []}
          loading={false}
          header={header}
        />
      </div>
      <Row gutter={[10, 2]}></Row>
      {/* <DataTable
            bordered
            data={
              landingApi?.data?.data?.length > 0 ? landingApi?.data.data : []
            }
            loading={landingApi?.loading}
            header={header}
            pagination={{
              pageSize: landingApi?.data?.pageSize,
              total: landingApi?.data?.totalCount,
            }}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;

              landingApiCall({
                pagination,
              });
            }}
            // scroll={{ x: 1500 }}
          /> */}
    </>
  );
};
