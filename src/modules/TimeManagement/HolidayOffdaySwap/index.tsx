import { Form } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { DataTable, PCard, PCardHeader, PForm } from "Components";
import { useApiRequest } from "Hooks";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { holidayOffdaySwapLandingheader } from "./helper";

const HolidayOffdaySwap = () => {
  const {
    permissionList,
    profileData: { wId, wgId, buId },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  const dispatch = useDispatch();

  // Form Instance
  const [form] = Form.useForm();

  const holidayOffdayPermission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30419),
    []
  );

  // states
  const [rowDto, setRowDto] = useState<any[]>([]);
  // api states
  const holidayOffdayLandingAPI = useApiRequest([]);
  const history = useHistory();

  const getholidayOffdayLanding = (
    pagination = { current: 1, pageSize: 25 }
  ) => {
    const { search } = form.getFieldsValue(true);
    // api: /Employee/SwapEmployeeHistory?workplaceGroupId=4&workplaceId=15&CurrentPage=1&PageSize=15
    holidayOffdayLandingAPI?.action({
      urlKey: "SwapEmployeeHistory",
      method: "get",
      params: {
        workplaceId: wId,
        workplaceGroupId: wgId,
        searchTxt: search || "",
        CurrentPage: pagination?.current,
        PageSize: pagination?.pageSize,
      },
      onSuccess: (res) => {
        setRowDto(res?.swapEmployeeHistoryDTO);
      },
    });
  };

  // Life Cycle Hooks
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Holiday/Offday Swap";
  }, []);

  useEffect(() => {
    getholidayOffdayLanding();
  }, [wgId, buId, wId]);

  return holidayOffdayPermission?.isView ? (
    <>
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            title="Holiday/Offday Swap"
            onSearch={(e) => {
              form.setFieldsValue({
                search: e?.target?.value,
              });
              getholidayOffdayLanding();
            }}
            buttonList={[
              {
                type: "primary",
                content: `Assign Swap`,
                onClick: () => {
                  history.push(
                    "/administration/timeManagement/holidayOffdaySwap/assign"
                  );
                },
                disabled: !holidayOffdayPermission?.isCreate,
              },
            ]}
          />

          <DataTable
            header={holidayOffdaySwapLandingheader()}
            bordered
            data={rowDto || []}
            loading={holidayOffdayLandingAPI?.loading}
            pagination={{
              current: holidayOffdayLandingAPI?.data?.currentPage,
              pageSize: holidayOffdayLandingAPI?.data?.pageSize,
              total: holidayOffdayLandingAPI?.data?.totalCount,
            }}
            // rowSelection={{
            //   type: "checkbox",
            //   selectedRowKeys: selectedRow.map((item) => item?.key),
            //   onChange: (selectedRowKeys, selectedRows) => {
            //     setSelectedRow(selectedRows);
            //   },
            // }}
            onChange={(pagination, filters, sorter, extra) => {
              if (extra.action === "sort") return;
              getholidayOffdayLanding(pagination);
              // setSelectedRow([]);
            }}
          />
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default HolidayOffdaySwap;
