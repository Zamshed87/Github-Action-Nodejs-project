import { DataTable, PCardBody, TableButton } from "Components";
import { InfoOutlined } from "@mui/icons-material";

import { LightTooltip } from "common/LightTooltip";
import React, { useState } from "react";
import { gray900 } from "utility/customColor";
import { Popover, Tag } from "antd";
import Loading from "common/loading/Loading";

const HistoryBalance = ({ history = [] }) => {
  // console.log("values", values);

  const [details, setDetails] = useState([]);
  const [loading] = useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState(null);

  const toggleRowDetails = (key, details) => {
    if (selectedRowKey === key) {
      setSelectedRowKey(null); // Close if the same row is clicked
      setDetails([]);
    } else {
      setSelectedRowKey(key);
      setDetails([details]);
    }
  };

  const header = [
    {
      title: "Leave Type",
      render: (_, record) => (
        <>
          <p>{record?.type}</p>
        </>
      ),
      width: 80,
    },
    {
      title: "Start Date",
      render: (_, record) => (
        <>
          <p>{record?.startDate}</p>
        </>
      ),
      width: 80,
    },
    {
      title: "End Date",
      render: (_, record) => (
        <>
          <p>{record?.endDate}</p>
        </>
      ),
      width: 80,
    },
    {
      title: "Taken",
      render: (data) => (
        <>
          <p>{data}</p>
        </>
      ),
      dataIndex: "totalTakenDays",
      width: 40,
    },
    {
      title: "Balance",
      dataIndex: "totalBalanceDays",
      width: 45,
    },

    {
      title: "Total",
      dataIndex: "totalAllocatedDays",
      width: 40,
    },
    {
      title: "Status",
      render: (_, rec) => {
        return (
          <div>
            {rec?.status === "Active" ? (
              <Tag color="green">{rec?.status}</Tag>
            ) : rec?.status === "Inactive" ? (
              <Tag color="red">{rec?.status}</Tag>
            ) : rec?.status === "Salary Hold" ? (
              <Tag color="orange">{rec?.status}</Tag>
            ) : (
              <Tag color="gold">{rec?.status}</Tag>
            )}
          </div>
        );
      },
      width: 85,
    },
    {
      width: 20,
      align: "center",
      render: (_, rec, idx) => (
        <>
          <TableButton
            buttonsList={[
              {
                type: "view",
                onClick: () => {
                  toggleRowDetails(idx, rec?.details);
                },
              },
            ]}
          />
          {selectedRowKey === idx && (
            <Popover
              placement="bottom"
              content={
                <div style={{ width: "570px" }}>
                  <DataTable header={detailsHeader} data={details} />
                </div>
              }
              open={selectedRowKey === idx}
              trigger="click"
              onOpenChange={(newOpen) => {
                if (!newOpen) {
                  setSelectedRowKey(null); // Close popover when clicking outside
                }
              }}
            />
          )}
        </>
      ),
    },
  ];
  // --
  const detailsHeader = [
    {
      title: "Taken",
      render: (data, record) => (
        <>
          <p>{data}</p>
        </>
      ),
      dataIndex: "takenDays",
      width: 47,
    },
    {
      title: "Balance",
      dataIndex: "balanceDays",
      width: 60,
    },

    {
      title: "Total",
      dataIndex: "totalAllocatedDays",
      width: 45,
    },

    {
      title: "Carry Taken",
      dataIndex: "carryTakenDays",
    },
    {
      title: "Carry Balance",
      dataIndex: "carryBalanceDays",
    },
    {
      title: "Carry Allocated",
      dataIndex: "carryTotalAllocatedDays",
    },
    {
      title: "Carry Expire Balance",
      dataIndex: "carryExpiredDays",
    },
    {
      title: "Carry Expire Date",
      render: (data) => (data?.expireDate ? data?.expireDate : "N/A"),
    },
  ];
  return (
    <>
      {loading && <Loading />}
      <div>
        <PCardBody styles={{ minHeight: "240px" }}>
          <DataTable
            header={header}
            nodataStyle={{ marginTop: "-35px", height: "175px" }}
            // bordered
            data={history?.length > 0 ? history : []}
          />
        </PCardBody>
      </div>
    </>
  );
};

export default HistoryBalance;
