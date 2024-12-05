import { EyeOutlined, PrinterOutlined } from "@ant-design/icons";
import { Divider, Tooltip } from "antd";
import LabelValuePair from "common/LabelValuePair";
import Loading from "common/loading/Loading";
import NoResult from "common/NoResult";
import { DataTable, Flex } from "Components";
import { PModal } from "Components/Modal";
import { ViewRewardPunishmentRecord } from "modules/employeeProfile/reportBuilder/rewardPunishmentLetter/letterGenAddEdit/helper";
import React, { forwardRef, useState } from "react";
import { dateFormatter } from "utility/dateFormatter";
import { postPDFAction } from "utility/downloadFile";

const PunishmentHistory = forwardRef((props: any, ref: any) => {
  const punishmentData = props?.landingApiPunishment;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState<any>({});

  const headerPunishment: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) => index + 1,
      fixed: "left",
      align: "center",
    },

    {
      title: "Letter Name",
      dataIndex: "letterName",
      filter: true,
      filterKey: "letterNameList",
      filterSearch: true,
      width: "40px",
    },

    {
      title: "Issued By",
      dataIndex: "issueByEmployeeName",
      filter: true,
      filterKey: "createdByList",
      filterSearch: true,
      width: "40px",
    },
    {
      title: "Issued Date",
      dataIndex: "issueDate",
      render: (data: any) => dateFormatter(data),
      width: "30px",
    },

    {
      title: "Action",
      dataIndex: "letterGenerateId",
      render: (generateId: number, rec: any) => (
        <Flex justify="flex-start" gap="4">
          <Tooltip placement="bottom" title={"View"}>
            <EyeOutlined
              style={{ color: "green", fontSize: "14px", cursor: "pointer" }}
              onClick={() => {
                ViewRewardPunishmentRecord(
                  rec?.recordId,
                  setLoading,
                  setSingleData
                ); // check
                setOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip placement="bottom" title={"Print"}>
            <PrinterOutlined
              style={{
                color: "green",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                const payload = {
                  isForPreview: false,
                  issuedEmployeeId: 0,
                  templateId: 0,
                  letterGenerateId: rec?.letterGenerateId, // check
                  letterBody: "",
                };
                postPDFAction(
                  "/PdfAndExcelReport/GetGeneratedLetterPreviewPDF",
                  payload,
                  setLoading
                );
              }}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
    },
  ];

  return (
    <div ref={ref} style={{ fontSize: "12px" }}>
      {loading && <Loading />}
      <center>
        <h1 style={{ fontSize: "16px", marginBottom: "10px" }}>
          Punishment History
        </h1>
      </center>
      <div>
        {punishmentData?.data?.data?.length > 0 ? (
          <DataTable
            bordered
            data={punishmentData?.data?.data || []}
            header={headerPunishment}
          />
        ) : (
          <NoResult />
        )}
      </div>
      <PModal
        style={{ top: "20px" }}
        title="Reward Detail"
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        components={
          <>
            <LabelValuePair
              label={"Issued Type"}
              value={singleData?.issueTypeName || "N/A"}
            />
            <LabelValuePair
              className="mt-1"
              label={"Letter Name"}
              value={singleData?.letterName || "N/A"}
            />
            <LabelValuePair
              className="mt-1"
              label={"Letter Type"}
              value={singleData?.letterType || "N/A"}
            />
            <LabelValuePair
              className="mt-1"
              label={"Issued To"}
              value={singleData?.issueForEmployeeName || "N/A"}
            />
            <LabelValuePair
              className="mt-1"
              label={"Issued By"}
              value={singleData?.issueByEmployeeName || "N/A"}
            />
            <Divider />

            <h2>Letter Template</h2>
            <div
              className="mt-2"
              style={{
                border: "1px solid #f0f0f0",
                borderRadius: "4px",
                padding: "12px",
                backgroundColor: "#fafafa",
                maxHeight: "300px",
                overflowY: "auto",
              }}
              dangerouslySetInnerHTML={{
                __html: singleData?.letterBody || "<p>No content available</p>",
              }}
            />
          </>
        }
        width={1000}
      />
    </div>
  );
});

export default PunishmentHistory;
