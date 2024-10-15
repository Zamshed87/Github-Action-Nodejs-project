/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AddOutlined } from "@mui/icons-material";
import { DataTable, PCard, PCardHeader, TableButton } from "Components";
import { useApiRequest } from "Hooks";
import { getSerial } from "Utils";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import React, { useEffect, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
const CafeteriaPricingLanding = () => {
  const {
    permissionList,
    profileData: { buId, wgId, orgId, wId },
  } = useSelector((state: any) => state?.auth, shallowEqual);
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
  const landing = useApiRequest([]);

  const getLanding = () => {
    landing?.action({
      urlKey: "CafeteriaConfigLanding",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        intWorkplaceId: wId,
        searchTxt: "",
        pageNo: 1,
        pageSize: 10000,
      },
    });
  };

  useEffect(() => {
    getLanding();
  }, [wgId, wId]);
  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landing?.data?.currentPage,
          pageSize: landing?.data?.pageSize,
          index,
        }),
      width: 15,
      align: "center",
    },

    {
      title: "Meal Type",
      dataIndex: "mealTypeName",
    },
    {
      title: "Pricing Matrix",
      dataIndex: "pricingMatrixTypeName",
      width: 55,
    },

    // {
    //   title: "Designation",
    //   dataIndex: "strDesignationName",
    //   width: 40,
    // },

    // {
    //   title: "Min Amount",
    //   dataIndex: "minAmount",
    //   width: 50,
    // },
    // {
    //   title: "Max Amount",
    //   dataIndex: "maxAmount",
    //   width: 50,
    // },
    // {
    //   title: "Own Contribution",
    //   dataIndex: "monOwnContribution",
    //   width: 50,
    // },
    // {
    //   title: "Company Contribution",
    //   dataIndex: "monCompanyContribution",
    //   width: 60,
    // },

    {
      title: "Total Cost",
      dataIndex: "monTotalCost",
      width: 33,
    },

    {
      width: 20,
      align: "center",
      render: (_: any, rec: any) => (
        <TableButton
          buttonsList={[
            {
              type: "edit",
              onClick: () => {
                history.push({
                  pathname: `/profile/cafeteriaManagement/cafeteriaPricingSetup/pricingSetupForm/${rec?.intConfigId}`,
                  state: {
                    rec,
                  },
                });
              },
            },
          ]}
        />
      ),
    },
  ];
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
      <DataTable header={header} bordered data={landing?.data?.data || []} />
      {/* <DataTable header={header} bordered data={temp?.data || []} /> */}
    </PCard>
  ) : (
    <NotPermittedPage />
  );
};

export default CafeteriaPricingLanding;
