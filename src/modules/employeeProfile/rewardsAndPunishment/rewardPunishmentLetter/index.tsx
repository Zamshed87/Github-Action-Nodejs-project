/*
 * Title: Reward & Punishment Letter Generate add and edit
 * Author: Adel Md. Adnan
 * Date: 11-11-2024
 *
 */

import { EyeOutlined, PrinterOutlined } from "@ant-design/icons";
import { Form, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { DataTable, Flex, PCard, PCardHeader, PForm } from "Components";
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
import PunishmentExplantion from "./punishmentExplantion";
import PBadge from "Components/Badge";

const UserEndRewardPunishmentLanding = ({
  empId,
  tabIndex,
  index,
}: {
  empId: number;
  tabIndex: number;
  index: number;
}) => {
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
  const { orgId, buId, wgId, wId, employeeId } = profileData;

  // menu permission
  let letterGenPermission: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30448) {
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
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [punishmentData, setPunishmentData] = useState({});
  const [loading, setLoading] = useState(false);

  // landing calls
  const landingApiReward = useApiRequest({});
  const landingApiPunishment = useApiRequest({});

  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filters?: any;
    searchText?: string;
  };
  const rewardLandingApiCall = ({
    pagination = { current: 1, pageSize: 25 },
    filters = filterList,
  }: TLandingApi) => {
    landingApiReward.action({
      urlKey: "GetUserRewardPunishmentLetterLanding",
      method: "GET",
      params: {
        accountId: orgId,
        userId: empId,
        actionType: 1,
        // branchId: buId,
        // workplaceId: wId,
        // businessUnitId: buId,
        // workplaceGroupId: wgId,
        // searchItem: "",
        pageNo: pagination?.current,
        pageSize: pagination?.pageSize,
      },
      onSuccess: (res) => {
        console.log(res);
      },
    });
  };

  const punishmentlandingApiCall = ({
    pagination = { current: 1, pageSize: 25 },
    filters = filterList,
  }: TLandingApi) => {
    landingApiPunishment.action({
      urlKey: "GetUserRewardPunishmentLetterLanding",
      method: "GET",
      params: {
        accountId: orgId,
        userId: empId,
        actionType: 2,
        pageNo: pagination?.current,
        pageSize: pagination?.pageSize,
      },
      onSuccess: (res) => {
        console.log(res);
      },
    });
  };

  useEffect(() => {
    rewardLandingApiCall({});
    punishmentlandingApiCall({});
  }, [wgId, wId, buId]);

  // table column
  const headerReward: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApiReward?.data?.currentPage,
          pageSize: landingApiReward?.data?.pageSize,
          index,
        }),
      fixed: "left",
      align: "center",
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
      dataIndex: "issueDate",
      render: (data: any) => dateFormatter(data),
      width: "40px",
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

  const headerPunishment: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApiReward?.data?.currentPage,
          pageSize: landingApiReward?.data?.pageSize,
          index,
        }),
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
      title: "Action Name",
      dataIndex: "actionName",
      filter: true,
      filterKey: "actionNameList",
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
          {employeeId === empId && !rec?.isExplanation && (
            <button
              style={{ border: "none", background: "none" }}
              onClick={() => {
                ViewRewardPunishmentRecord(
                  rec?.recordId,
                  setLoading,
                  setSingleData,
                  (data: any) => {
                    setPunishmentData(data);
                    setExplanationOpen(true); // need
                  }
                );
              }}
            >
              <PBadge type="warning" text="Explanation" />
            </button>
          )}
        </Flex>
      ),
      align: "center",
    },
  ];

  return index === tabIndex ? (
    letterGenPermission?.isView ? (
      <>
        {loading && <Loading />}
        <PForm form={form}>
          <PCard className="mx-3">
            <PCardHeader title={`Rewards`} />
            <div className="mb-3">
              <DataTable
                bordered
                data={landingApiReward?.data?.data || []}
                loading={landingApiReward?.loading}
                header={headerReward}
                pagination={{
                  pageSize: landingApiReward?.data?.pageSize,
                  total: landingApiReward?.data?.totalCount,
                }}
                filterData={landingApiReward?.data?.filters}
                onChange={(pagination, filters) => {
                  setFilterList(filters);
                  rewardLandingApiCall({
                    pagination,
                    filters: filters,
                  });
                }}
              />
            </div>
          </PCard>

          {/* Punishment */}
          <PCard className="mx-3">
            <PCardHeader title={`Punishment`} />
            <div className="mb-3">
              <DataTable
                bordered
                data={landingApiPunishment?.data?.data || []}
                loading={landingApiPunishment?.loading}
                header={headerPunishment}
                pagination={{
                  pageSize: landingApiPunishment?.data?.pageSize,
                  total: landingApiPunishment?.data?.totalCount,
                }}
                filterData={landingApiPunishment?.data?.filters}
                onChange={(pagination, filters) => {
                  setFilterList(filters);
                  punishmentlandingApiCall({
                    pagination,
                    filters: filters,
                  });
                }}
              />
            </div>
          </PCard>
        </PForm>

        <PModal
          title=""
          open={open}
          onCancel={() => {
            setOpen(false);
            setSingleData({});
          }}
          components={<TemplateViewModal singleData={singleData} />}
          width={1000}
        />
        <PModal
          title="Create Explanation"
          open={explanationOpen} // explanationOpen
          onCancel={() => {
            setExplanationOpen(false);
            setPunishmentData({});
            punishmentlandingApiCall({});
          }}
          components={
            <PunishmentExplantion
              punishmentData={punishmentData}
              setExplanationOpen={setExplanationOpen}
              punishmentlandingApiCall={punishmentlandingApiCall}
            />
          }
          width={1000}
        />
        {/* <div className="d-none">
        <div ref={printLetterRef}>  setExplanationOpen
          <LetterPrint singleData={pdfData} />
        </div>
      </div> */}
      </>
    ) : (
      <NotPermittedPage />
    )
  ) : (
    <></>
  );
};

export default UserEndRewardPunishmentLanding;
