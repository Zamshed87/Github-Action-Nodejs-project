/*
 * Title: Reward & Punishment Letter Generate add and edit
 * Author: Adel Md. Adnan
 * Date: 11-11-2024
 *
 */

import { EyeOutlined, PrinterOutlined, SendOutlined } from "@ant-design/icons";
import { Form, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  DataTable,
  Flex,
  PButton,
  PCard,
  PCardHeader,
  PForm,
} from "Components";
import { PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { dateFormatter } from "utility/dateFormatter";
import { postPDFAction } from "utility/downloadFile";
import { getSerial } from "Utils";
import TemplateViewModal from "./templateViewModal";
import { ViewRewardPunishmentRecord } from "./letterGenAddEdit/helper";

const RewardPunishmentLanding = () => {
  // router states
  const history = useHistory();

  // Form Instance
  const [form] = Form.useForm();

  //   Data from redux state
  const dispatch = useDispatch();

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { orgId, buId, wgId, wId } = profileData;

  // menu permission
  let letterGenPermission: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30441) {
      letterGenPermission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Letter Generate";
    () => {
      document.title = "PeopleDesk";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // states
  const [filterList, setFilterList] = useState({});
  const [open, setOpen] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);

  // landing calls
  const landingApi = useApiRequest({});

  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filters?: any;
    searchText?: string;
  };
  const landingApiCall = ({
    pagination = { current: 1, pageSize: 25 },
    filters = filterList,
  }: TLandingApi) => {
    landingApi.action({
      urlKey: "GetRewardPunishmentLetterLanding",
      method: "GET",
      params: {
        accountId: orgId,
        branchId: buId,
        workplaceId: wId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        searchItem: "",
        pageNo: pagination?.current,
        pageSize: pagination?.pageSize,
      },
      onSuccess: (res) => {
        console.log(res);
      },
    });
  };

  useEffect(() => {
    landingApiCall({});
  }, [wgId, wId, buId]);

  // table column
  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApi?.data?.currentPage,
          pageSize: landingApi?.data?.pageSize,
          index,
        }),
      fixed: "left",
      align: "center",
    },
    {
      title: "Issued Type",
      dataIndex: "issueTypeName",
      filter: true,
      filterKey: "issuedTypeList",
      filterSearch: true,
    },
    {
      title: "Issued To",
      dataIndex: "issueForEmployeeName",
      filter: true,
      filterKey: "issuedEmployeeIdList",
      filterSearch: true,
    },
    {
      title: "Letter Type",
      dataIndex: "letterType",
      filter: true,
      filterKey: "letterTypeList",
      filterSearch: true,
    },
    {
      title: "Letter Name",
      dataIndex: "letterName",
      filter: true,
      filterKey: "letterNameList",
      filterSearch: true,
    },

    {
      title: "Issued By",
      dataIndex: "issueByEmployeeName",
      filter: true,
      filterKey: "createdByList",
      filterSearch: true,
    },
    {
      title: "Issued Date",
      dataIndex: "createdAt",
      render: (data: any) => dateFormatter(data),
    },

    {
      title: "Action",
      dataIndex: "letterGenerateId",
      render: (generateId: number, rec: any) => (
        <Flex justify="center">
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
          <Tooltip placement="bottom" title={"Send"}>
            <SendOutlined
              style={{
                color: "green",
                fontSize: "14px",
                cursor: "pointer",
                marginRight: "5px",
              }}
            />
          </Tooltip>
          <PButton
            size="small"
            type="primary"
            action="submit"
            content="Action"
            onClick={() => {
              history.push("/profile/customReportsBuilder/punishmentAction");
            }}
          />
        </Flex>
      ),
      align: "center",
    },
  ];
  return letterGenPermission?.isView ? (
    <>
      {loading && <Loading />}
      <PForm form={form}>
        <PCard>
          <PCardHeader
            title={`Total ${
              landingApi?.data?.totalCount ? landingApi?.data?.totalCount : 0
            } templates`}
            buttonList={[
              {
                type: "primary",
                content: "Create",
                icon: "plus",
                onClick: () => {
                  if (letterGenPermission?.isCreate) {
                    history.push(
                      "/profile/customReportsBuilder/rewardPunishment/letterGenerate"
                    );
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
            ]}
          />
          <div className="mb-3">
            <DataTable
              bordered
              data={landingApi?.data?.data || []}
              loading={landingApi?.loading}
              header={header}
              pagination={{
                pageSize: landingApi?.data?.pageSize,
                total: landingApi?.data?.totalCount,
              }}
              filterData={landingApi?.data?.filters}
              onChange={(pagination, filters) => {
                setFilterList(filters);
                landingApiCall({
                  pagination,
                  filters: filters,
                });
              }}
            />
          </div>
        </PCard>
      </PForm>
      <PModal
        title="View Template"
        open={open}
        onCancel={() => {
          setOpen(false);
          setSingleData({});
        }}
        components={<TemplateViewModal singleData={singleData} />}
        width={1000}
      />
      {/* <div className="d-none">
        <div ref={printLetterRef}>
          <LetterPrint singleData={pdfData} />
        </div>
      </div> */}
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default RewardPunishmentLanding;
