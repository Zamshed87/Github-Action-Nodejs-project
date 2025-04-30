import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Divider, Spin, Alert } from "antd";
import { useApiRequest } from "Hooks"; // Adjust the import path as needed
import { DataTable, PCard, PCardHeader } from "Components";
import { useDispatch } from "react-redux";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";

export const LeavePolicyDetails = () => {
  const { id: policyId }: any = useParams();
  const detailsApi = useApiRequest({});
  const enumApi = useApiRequest({});
  const policyApi = useApiRequest({});
  const dispatch = useDispatch();

  // const [sandWitchLanding, setSandWitchLanding] = useState<any>([]);
  const [landing, setLanding] = useState<any>([]);
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Leave Policy Details";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);
  const getDependTypes = () => {
    enumApi?.action({
      urlKey: "GetEnums",
      method: "GET",
      params: {
        types: "SandwichLeaveEnum",
      },
      onSuccess: (data: any) => {
        data?.SandwichLeaveEnum?.forEach((item: any, id: any) => {
          data.SandwichLeaveEnum[id].index = item.value;
          data.SandwichLeaveEnum[id].scenario = item.label;
          data.SandwichLeaveEnum[id].key = id;
        });
      },
    });
  };
  useEffect(() => {
    getDependTypes();
  }, []);
  useEffect(() => {
    if (+policyId) {
      detailsApi?.action({
        urlKey: "GetById",
        method: "GET",
        params: { PolicyId: +policyId },
        onSuccess: (res) => {
          res?.data?.generalData[0]?.leavePolicyCommonList?.workplaceId &&
            policyApi.action({
              urlKey: "GetPolicyName",
              method: "GET",
              params: {
                WorkplaceId:
                  res?.data?.generalData[0]?.leavePolicyCommonList?.workplaceId,
              },
              onSuccess: (res: any) => {
                res?.data?.forEach((item: any, i: any) => {
                  res.data[i].label = item?.policyName;
                  res.data[i].value = item?.policyId;
                });
              },
            });
        },
      });
    }
  }, [policyId]);
  // const findMatch = (d: any) => {
  //   const t: any = [];
  //   d?.forEach((i: any) => {
  //     const f = enumApi?.data?.SandwichLeaveEnum?.find(
  //       (j: any) => j?.index == i
  //     );
  //     if (f) {
  //       t.push({ scene: f?.label });
  //     }
  //   });
  //   setSandWitchLanding(t);
  // };
  // useEffect(() => {
  //   if (detailsApi?.data?.data?.sandwichData?.length > 0) {
  //     const sandwich = detailsApi.data?.data?.sandwichData[0];
  //     const d = sandwich?.sandwichLeaveScenarioId?.split(",");
  //     d?.length > 0 && findMatch(d);
  //   }
  // }, [detailsApi?.data, enumApi?.data]);
  useEffect(() => {
    if (detailsApi?.data?.data?.calculativeData?.length > 0) {
      detailsApi?.data?.data?.calculativeData[0]?.calculativeDaysPolicyId?.forEach(
        (i: any) => {
          const findData = policyApi?.data?.data?.find(
            (j: any) => j?.value == +i
          );
          findData?.policyName &&
            setLanding((prev: any) => [
              ...prev,
              {
                name: findData?.policyName,
                type: findData?.leaveType,
                codeName: findData?.policyDisplayName,
                id: findData?.policyId,
              },
            ]);
        }
      );
    }
  }, [detailsApi?.data, policyApi?.data]);

  if (detailsApi.loading) return <Spin size="large" />;
  if (detailsApi.error)
    return (
      <Alert
        message="Error"
        description={detailsApi.error.message}
        type="error"
        showIcon
      />
    );

  const {
    generalData = [],
    consumeTypeData = [],
    balanceData = [],
    calculativeData = [],
    carryData = [],
    encashmentData = [],
    additionalData = [],
  } = detailsApi?.data?.data || {};

  const general = generalData?.[0];
  const leavePolicyCommon = general?.leavePolicyCommonList;
  const balanceHeader: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Service Length",
      render: (_: any, rec: any) =>
        `${rec?.fromServiceLength}-${rec?.toServiceLength}`,
      width: 100,
    },
    {
      title: "Leave Balance Depend On",
      dataIndex: "balanceDependOn",
      width: 100,
    },
    {
      title: "Calculative Days",
      dataIndex: "calculativeDays",
      width: 100,
    },
    {
      title: "Bridge Leave For",
      dataIndex: "bridgeLeaveFor",
      width: 100,
    },
    {
      title: "Minumum Working Hour",
      dataIndex: "minimumWorkingHour",
      width: 100,
    },
    {
      title: "Leave Days",
      dataIndex: "leaveDays",
      width: 100,
    },
    {
      title: "Expire After Available (Days)",
      dataIndex: "expiresDays",
      width: 100,
    },
  ];
  const consumeheader: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Leave Consume Type",
      dataIndex: "leaveConsumeType",
      width: 100,
    },
    {
      title: "Consume Hour",
      render: (_: any, rec: any) =>
        rec?.leaveConsumeType === "Full Day"
          ? "Not Applicable"
          : `${rec?.minimumConsumeHour}-${rec?.maximumConsumeHour}`,
      width: 100,
    },
    {
      title: "Standard Working Hour",
      dataIndex: "standardWorkingHour",
      render: (_: any, rec: any) =>
        rec?.leaveConsumeType === "Full Day"
          ? "Not Applicable"
          : `${rec?.standardWorkingHour}`,
      width: 100,
    },
  ];
  const policyheader: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Policy Name",
      dataIndex: "name",
      width: 100,
    },
    {
      title: "Leave Display Name",
      dataIndex: "codeName",
      width: 100,
    },
    {
      title: "Leave Type",
      dataIndex: "type",
      width: 100,
    },
  ];

  const encashheader: any = [
    {
      title: "SL",
      render: (_value: any, _row: any, index: number) => index + 1,
      align: "center",
      width: 30,
    },
    {
      title: "Service Length",
      render: (_: any, rec: any) =>
        `${rec?.fromServiceLength}-${rec?.toServiceLength}`,
      width: 100,
    },
    {
      title: "Leave Encashment Type",
      dataIndex: "maxEncashmentType",
      width: 100,
    },
    {
      title: "Max Leave Encashment",
      dataIndex: "maxEncashmentDays",
      width: 100,
    },
    {
      title: "Encashment Benefits",
      dataIndex: "encashmentDependOn",
      width: 100,
    },
    {
      title: `Paid Amount/%`,
      dataIndex: "encashmentAmount",
      width: 100,
    },
  ];
  return (
    <PCard>
      <PCardHeader title={`Leave Policy Details`} />
      <h4 className="my-2">General Info</h4>
      <div style={{ fontSize: 12 }}>
        Policy Name: {leavePolicyCommon?.policyName} <br />
        Display Name: {leavePolicyCommon?.policyDisplayName} <br />
        Display Code: {leavePolicyCommon?.policyDisplayCode} <br />
        Leave Type: {leavePolicyCommon?.leaveType} <br />
        Workplace: {leavePolicyCommon?.workplaceName} <br />
        Designations:{" "}
        {general?.designationList
          ?.map((d: any) => d?.designationName)
          ?.join(", ")}{" "}
        <br />
        EmploymentTypes:{" "}
        {general?.employmentTypeList
          ?.map((d: any) => d?.employmentTypeName)
          ?.join(", ")}{" "}
        <br />
        Religions:{" "}
        {general?.religionList
          ?.map((d: any) => d?.religionName)
          ?.join(", ")}{" "}
        <br />
        Genders:{" "}
        {general?.genderList?.map((d: any) => d?.genderName)?.join(", ")} <br />
        <p>
          Description:
          <span dangerouslySetInnerHTML={{ __html: general?.description }} />
        </p>
      </div>
      <Divider />
      <h4 className="my-2">Paid Leave</h4>
      <div style={{ fontSize: 12 }}>
        Paid Leave: {general?.isPaidLeave ? "Yes" : "No"} <br />
        Pay Depend On: {general?.payDependOn} <br />
        Pay Depend On Value: {general?.payDependOnValue} <br />
      </div>
      <Divider />
      <h4 className="my-2"> Consume Types Info</h4>
      <div style={{ fontSize: 12 }}>
        <DataTable
          bordered
          data={consumeTypeData}
          loading={false}
          header={consumeheader}
        />
      </div>
      <Divider />
      <h4 className="my-2"> Lapse Type</h4>
      <div style={{ fontSize: 12 }}>
        Leave Lapse After:{general?.leaveLapse}
        <br />
        After Leaves Completed:{general?.lapseAfterDayCompleted}
        <br />
      </div>
      <Divider />
      <h4 className="my-2"> ProRata</h4>
      <div style={{ fontSize: 12 }}>
        ProRata:{general?.isProRata ? "Yes" : "No"}
        <br />
        ProRata Round: {general?.proRataRound}
        <br />
        ProRata Last Start Days: {general?.proRataLastStartDays}
        <br />
        Pro Rata Basis: {general?.proRataBasis}
        <br />
      </div>
      <Divider />
      <h4 className="my-2"> Balance </h4>
      <div style={{ fontSize: 12 }}>
        Service Length Depend On:{balanceData[0]?.serviceLengthDependOn}
        <br />
        <DataTable
          bordered
          data={balanceData}
          loading={false}
          header={balanceHeader}
        />
      </div>
      <Divider />
      <h4 className="my-2"> Calculative Data: </h4>

      <div style={{ fontSize: 12 }}>
        {calculativeData.map((calc: any, index: number) => (
          <div key={index}>
            Include Present: {calc?.isIncluePresent ? "Yes" : "No"} <br />
            Include OffDay: {calc?.isInclueOffDay ? "Yes" : "No"} <br />
            Include Movement: {calc?.isInclueMovement ? "Yes" : "No"} <br />
            Include Leave: {calc?.isInclueLeave ? "Yes" : "No"} <br />
            Include Late: {calc?.isInclueLate ? "Yes" : "No"} <br />
            Include Holiday: {calc?.isInclueHoliday ? "Yes" : "No"} <br />
            Include Absent: {calc?.isInclueAbsent ? "Yes" : "No"} <br />
          </div>
        ))}
        <DataTable
          bordered
          data={landing}
          loading={false}
          header={policyheader}
        />
      </div>
      {/* <Divider />
      <h4 className="my-2"> Sandwich Data: </h4>

      <div style={{ fontSize: 12 }}>
        {sandwichData.map((sandwich: any, index: number) => (
          <div key={index}>
            Sandwich Leave: {sandwich?.isSandwichLeave ? "Yes" : "No"}
          </div>
        ))}
        {sandWitchLanding?.length > 0 && (
          <DataTable
            bordered
            data={sandWitchLanding}
            loading={false}
            header={sandWitchHeader}
          />
        )}
      </div> */}
      <Divider />
      <h4 className="my-2"> Carry Data: </h4>

      <div style={{ fontSize: 12 }}>
        {carryData.map((carry: any, index: number) => (
          <div key={index}>
            Carry Forward: {carry?.isCarryForward ? "Yes" : "No"}
            <br />
            Leave Carry Forward Type : {carry?.carryForwardType}
            <br />
            Max Carry Forward After Lapse (Days) : {carry?.maxCarryAfterLapse}
            <br />
            Carry Expire : {carry?.isCarryExpire ? "Yes" : "No"}
            <br />
            Expiry of Carry Forward Days After Lapse : {carry?.carryExpireDays}
            <br />
            Max Carry Forward Balance (Days) : {carry?.maxCarryDays}
            <br />
            Add previous year carry balance :{" "}
            {carry?.isAddPreviouscarry ? "Yes" : "No"}
            <br />
          </div>
        ))}
      </div>
      <Divider />
      <h4 className="my-2"> Encashment Data </h4>

      <div style={{ fontSize: 12 }}>
        Leave Encashment:{encashmentData[0]?.isEncashment ? "Yes" : "No"}
        <br />
        Service Length Depend On :{encashmentData[0]?.serviceLengthDependOn}
        <br />
        Encashment Timeline :{encashmentData[0]?.encashmentTimeline}
        <br />
        <DataTable
          bordered
          data={encashmentData}
          loading={false}
          header={encashheader}
        />
      </div>
      <Divider />
      <h4 className="my-2"> Additional Data:</h4>

      <div style={{ fontSize: 12 }}>
        {additionalData.map((add: any, index: number) => (
          <div key={index}>
            Show Balance in ESS: {add?.isBalanceShowESS ? "Yes" : "No"}
            <br />
            Apply From Self Service : {add?.isApplyFromESS ? "Yes" : "No"}
            <br />
            Leave Rounding Type :{" "}
            {add?.roundingTypeId === 3 ? "Round Down" : "No Round"}
            <br />
            Leave Application Time : {add?.applicationTime}
            <br />
            Max. Leave Application in Lapse : {add?.maxLeaveApplicationInLapse}
            <br />
            Attachment Mandatory : {add?.isAttachmentMandatory ? "Yes" : "No"}
            <br />
            Min Attachment : {add?.minLeaveForAttachment}
            <br />
            Max. Leave Apply Days (Monthly) : {add?.maxLeaveInMonth}
            <br />
            Max. Leave Apply Days (At a Time) : {add?.maxLeaveInDays}
            <br />
            Min. Leave Application : {add?.minLeaveInApplication}
          </div>
        ))}
      </div>
    </PCard>
  );
};
