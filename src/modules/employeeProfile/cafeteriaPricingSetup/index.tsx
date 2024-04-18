/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AddOutlined } from "@mui/icons-material";
import { PCard, PCardHeader } from "Components";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import React, { useEffect, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const CafeteriaPricingLanding = () => {
  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30417),
    []
  );
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return permission?.isView ? (
    <PCard>
      <PCardHeader
        title="Cafeteria Pricing"
        // onSearch={(e) => {
        // searchFunc(e?.target?.value);
        // }}
        submitIcon={<AddOutlined />}
        buttonList={[
          {
            type: "primary",
            content: "Setup Pricing",
            onClick: () => {
              history.push(
                "/profile/cafeteriaManagement/cafeteriaPricingSetup/pricingSetupForm"
              );
            },
            icon: <AddOutlined />,
          },
        ]}
      />

      {/* Example Using Data Table Designed By Ant-Design v4 */}
      {/* <DataTable
    bordered
    data={landingApi?.data?.length > 0 ? landingApi?.data : []}
    loading={landingApi?.loading}
    header={header}
    // pagination={{
    //   pageSize: landingApi?.data?.pageSize,
    //   total: landingApi?.data?.totalCount,
    // }}
    // filterData={landingApi?.data?.employeeHeader}
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
    
  /> */}
    </PCard>
  ) : (
    <NotPermittedPage />
  );
};

export default CafeteriaPricingLanding;
