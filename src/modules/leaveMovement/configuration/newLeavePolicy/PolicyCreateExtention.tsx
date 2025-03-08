import { Col, Divider, Form, message, Row, Steps } from "antd";
import Loading from "common/loading/Loading";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
} from "Components";
import { useApiRequest } from "Hooks";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";
import { General } from "./components/General";
import { Consumption } from "./components/Consumption";
import { Sandwitch } from "./components/Sandwitch";
import { Lapse } from "./components/Lapse";
import { CarryForward } from "./components/CarryForward";
import { Encashment } from "./components/Encashment";
import { ProRata } from "./components/ProRata";
import { Additional } from "./components/Additional";
import { Balance } from "./components/Balance";
import { CalculativeDays } from "./components/CalculativeDays";
import { PaidLeave } from "./components/PaidLeave";
// import { FcDataConfiguration } from "react-icons/fc";
// import { GrConfigure } from "react-icons/gr";
// import { GrDocumentConfig } from "react-icons/gr";
import { CiGlobe } from "react-icons/ci";
// import { MdCalculate, MdOutlineMoreTime } from "react-icons/md";
// import { MdTimelapse } from "react-icons/md";
// import { SiNewbalance } from "react-icons/si";
import { BsCashCoin } from "react-icons/bs";
import { LuSandwich } from "react-icons/lu";
import { FaRegCalendarPlus } from "react-icons/fa";
// import { ModalFooter } from "Components/Modal";

export const PolicyCreateExtention = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params: any = useParams();
  const [current, setCurrent] = useState(0);
  const [consumeData, setConsumeData] = useState<any>([]);
  const [selectedRow1, setSelectedRow1] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any>([]);
  const [balanceTable, setBalanceTable] = useState<any>([]);
  const [policy, setPolicy] = useState<any>([]);
  const [id, setId] = useState<any>();
  const [attachmentList, setAttachmentList] = useState<any>([]);

  const {
    permissionList,
    profileData: { buId, employeeId, orgId, wgId },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  // states
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Leave Policy";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  const createApi = useApiRequest({});
  const policyApi = useApiRequest({});
  const grossBasicEnum = useApiRequest({});
  const JoinOrConfirmEnum = useApiRequest({});
  const PercentOrFixedEnum = useApiRequest({});
  const getDependTypes = () => {
    grossBasicEnum?.action({
      urlKey: "GetEnums",
      method: "GET",
      params: {
        types: "LeavePolicyDependOnEnum",
      },
    });
    JoinOrConfirmEnum?.action({
      urlKey: "GetEnums",
      method: "GET",
      params: {
        types: "DateDependsOnEnum",
      },
    });
    PercentOrFixedEnum?.action({
      urlKey: "GetEnums",
      method: "GET",
      params: {
        types: "DaysTypeEnum",
      },
    });
  };

  // ddls

  const onFinish = () => {
    createApi.action({
      urlKey: "CreateLeavePolicy",
      method: "post",
      payload: generatePayload(current),
      toast: true,
      onSuccess: (data: any) => {
        // setId(data?.data);
        // next();
      },
    });
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: "General",
      status: "process",
      icon: <CiGlobe />,
    },
    // {
    //   title: "Paid Leave",
    //   status: "wait",
    //   icon: <GrConfigure />,
    // },
    // {
    //   title: "Expenditure",
    //   status: "wait",
    //   icon: <GrDocumentConfig />,
    // },
    {
      title: "Sandwitch",
      status: "wait",
      icon: <LuSandwich />,
    },
    // {
    //   title: "Lapse",
    //   status: "wait",
    //   icon: <MdTimelapse />,
    // },
    {
      title: "Carry",
      status: "wait",
      icon: <FaRegCalendarPlus />,
    },
    {
      title: "Encash",
      status: "wait",
      icon: <BsCashCoin />,
    },
    // {
    //   title: "Pro Rata",
    //   status: "wait",
    //   icon: <FcDataConfiguration />,
    // },
    // {
    //   title: "Balance",
    //   status: "wait",
    //   icon: <SiNewbalance />,
    // },
    // {
    //   title: "Calculative",
    //   status: "wait",
    //   icon: <MdCalculate />,
    // },
    {
      title: "Additional",
      status: "wait",
      // icon: <MdOutlineMoreTime />,
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const fields = [
    [
      "strPolicyName",
      "leaveType",
      "strDisplayName",
      "strDisplayCode",
      "workplace",
      "designationListDTO",
      "intEmploymentTypeList",
      "religionListDto",
      "intGender",
      "payValue",
      "payDependsOn",
      "paidType",
      "leaveConsumeType",
      "maxConsumeTime",
      "minConsumeTime",
      "standardWorkHour",
      "leavelapse",
      "afterLeaveCompleted",
      "isProRata",
      "proRataCount",
      "proRataBasis",
      "dependsOn",
      "serviceStartLengthBalance",
      "serviceEndLengthBalance",
      "leaveDependsOn",
      "calculativeDays",
      "bridgeLeaveFor",
      "expireAfterAvailable",
      "minWorkHr",
      "leaveDaysFor",
      "policy",
    ],
    // ["payValue", "payDependsOn", "paidType"],
    // [
    //   "leaveConsumeType",
    //   "maxConsumeTime",
    //   "minConsumeTime",
    //   "standardWorkHour",
    // ],
    // [],
    // ["leavelapse", "afterLeaveCompleted"],
    ["isSandwitch"],

    [
      "addPrevCarry",
      "maxCarryForwardBalance",
      "leaveCarryForwardType",
      "expiryCarryForwardDaysAfterLapse",
      "minConsumeTime",
      "isCarryForward",
    ],
    [
      "isEncashment",
      "enLengthDependOn",
      "encashmentTimeline",
      "serviceStartLength",
      "serviceEndLength",
      "encashType",
      "maxEncashment",
      "encashBenefits",
      "paidAmount",
    ],
    // ["isProRata", "proRataCount", "proRataBasis"],
    // [
    //   "dependsOn",
    //   "serviceStartLengthBalance",
    //   "serviceEndLengthBalance",
    //   "leaveDependsOn",
    //   "calculativeDays",
    //   "bridgeLeaveFor",
    //   "expireAfterAvailable",
    //   "minWorkHr",
    //   "leaveDaysFor",
    // ],
    // ["policy"],
  ];

  const generatePayload = (step: number) => {
    const values = form.getFieldsValue(true);
    switch (step) {
      case 0:
        return {
          generalPayload: {
            businessUnitId: buId,
            workplaceGroupId: wgId,
            stepperId: 1,
            policyName: values?.strPolicyName,
            leaveTypeId: values?.leaveType?.value,
            displayName: values?.strDisplayName,
            displayCode: values?.strDisplayCode,
            workplaceId: values?.workplace?.value || 0,
            designationIdList: values?.designationListDTO
              ?.map((item: any) => item.value)
              .join(","),
            employmentTypeIdList: values?.intEmploymentTypeList
              ?.map((item: any) => item.value)
              .join(","),
            genderIdList: values?.intGender
              ?.map((item: any) => item.value)
              .join(","),
            religionIdList: values?.religionListDto
              ?.map((item: any) => item.value)
              .join(","),
            description: values?.applicationBody,
            documentId: attachmentList[0]?.documentId || 0,
            // ---------Paid Leave-----------------
            isPaidLeave: values?.paidType?.label?.includes("Paid") || false,
            payDependOnId: +values?.payDependsOn?.value || 0,
            payDependOn: values?.payDependsOn?.label,
            payDependOnValue: values?.payValue || 0,
            // ---------Leave Consume-----------------
            leaveConsumeTypes:
              consumeData?.map((item: any) => ({
                leaveConsumeTypeId:
                  item.leaveConsumeType === "Full Day"
                    ? 1
                    : item.leaveConsumeType === "1st Half Day"
                    ? 2
                    : item.leaveConsumeType === "2nd Half Day"
                    ? 3
                    : item.leaveConsumeType === "Clock Time"
                    ? 4
                    : 0,
                minimumConsumeHour:
                  item.leaveConsumeType === "Full Day"
                    ? 0
                    : item.consumeHr?.split(" to ")[0] || 0,
                maximumConsumeHour:
                  item.leaveConsumeType === "Full Day"
                    ? 0
                    : item.consumeHr?.split(" to ")[1]?.split(" Hr.")[0] || 0,
                standardWorkingHour: item.standardWorkHour || 0,
              })) || [],
            // ---------Leave Lapse-----------------
            leaveLapseId: +values?.leavelapse?.value || 0,
            lapseAfterDayCompleted: values?.afterLeaveCompleted || 0,
            // ---------Pro Rata-----------------
            isProRata: values?.isProRata?.value === 1,
            proRataLastStartDays: values?.proRataCount || 0,
            proRataBasisId: +values?.proRataBasis?.value || 0,
            // --------- Balance-----------------
            serviceLengthDependOnId: +values?.dependsOn?.value || 0,
            leaveBalances:
              balanceTable?.map((item: any) => ({
                fromServiceLength:
                  parseInt(item.serviceLength.split(" - ")[0]) || 0,
                toServiceLength:
                  parseInt(item.serviceLength.split(" - ")[1]) || 0,
                balanceDependOn:
                  item.leaveDependsOn === "Fixed Days"
                    ? 1
                    : item.leaveDependsOn === "Calculative Days"
                    ? 2
                    : item.leaveDependsOn === "Bridge Leave"
                    ? 3
                    : 0,
                calculativeDays: parseInt(item.calculativeDays) || 0,
                bridgeLeaveFor:
                  item.bridgeLeaveFor === "Off Days"
                    ? 3
                    : item.bridgeLeaveFor === "Holiday"
                    ? 2
                    : item.bridgeLeaveFor === "Both"
                    ? 1
                    : 0,
                minimumWorkingHour: parseInt(item.minWorkHr) || 0,
                leaveDays: parseInt(item.leaveDaysFor) || 0,
                expiresDays: parseInt(item.expireAfterAvailable) || 0,
              })) || [],
            // --------- Calculative Days-----------------
            calculativeDays: {
              isIncluePresent: values?.isPresent || false, // Bind from isPresent
              isInclueMovement: values?.isMovement || false, // Bind from isMovement
              isInclueLate: values?.isLate || false, // Bind from isLate
              isInclueLeave: values?.isLeave || false, // Bind from isLeave
              isInclueOffDay: values?.isOffday || false, // Bind from isOffday
              isInclueHoliday: values?.isHoliday || false, // Bind from isHoliday
              isInclueAbsent: values?.isAbsent || false, // Bind from isAbsent
            },
            calculativePolicies:
              policy?.map((item: any) => ({
                policyId: item?.id,
              })) || [],
          },
        };
      case 1:
        return {
          businessUnitId: buId,
          workplaceGroupId: wgId,
          sandwichPayload: {
            stepperId: 2,
            policyId: id,
            isSandwichLeave: values?.isSandwitch?.value === 1,
            sandwichLeaveScenarioId:
              selectedRow1?.length > 0
                ? selectedRow1?.map((row: any) => row.index)?.join(",")
                : null,
          },
        };
      case 2:
        return {
          businessUnitId: buId,
          workplaceGroupId: wgId,
          carryPayload: {
            policyId: id,

            stepperId: 3, // Assuming stepperId is managed elsewhere or not directly bound here
            isCarryForward: values?.isCarryForward?.value === 1,
            carryForwardTypeId: +values?.leaveCarryForwardType?.value || 0,
            maxCarryAfterLapse: values?.minConsumeTime || 0,
            isAddPreviouscarry: values?.addPrevCarry?.value === 1,
            maxCarryDays: values?.maxCarryForwardBalance || 0,
            isCarryExpire: values?.isCarryExpired?.value === 1,
            carryExpireDays: values?.expiryCarryForwardDaysAfterLapse || 0,
          },
        };
      case 3:
        return {
          businessUnitId: buId,
          workplaceGroupId: wgId,
          encashmentPayload: {
            stepperId: 4,
            policyId: id,

            isEncashment: values?.isEncashment?.value === 1,
            serviceLengthDependOnId: +values?.enLengthDependOn?.value,
            encashmentTimelineId: +values?.encashmentTimeline?.value,
            encashmentRows: tableData?.map((item: any) => {
              const [fromLength, toLength] = item?.serviceLength.split(" - ");
              const encashTypeLabel = item.encashmentType;
              const encashBenefitsLabel = item.encashBenefits;

              let maxEncashmentTypeId = 0;
              if (encashTypeLabel === "% of Days") {
                maxEncashmentTypeId = 2;
              } else if (encashTypeLabel === "Fixed Days") {
                maxEncashmentTypeId = 1;
              }

              let encashmentDependOnId = 0;
              if (encashBenefitsLabel === "Basic Salary") {
                encashmentDependOnId = 1;
              } else if (encashBenefitsLabel === "Gross Salary") {
                encashmentDependOnId = 2;
              } else if (encashBenefitsLabel === "Fixed Amount") {
                encashmentDependOnId = 3;
              }

              return {
                fromServiceLength: parseInt(fromLength),
                toServiceLength: parseInt(toLength),
                maxEncashmentTypeId: maxEncashmentTypeId,
                maxEncashmentDays: item.maxEncashment,
                encashmentDependOnId: encashmentDependOnId,
                encashmentAmount: item.paidAmount,
              };
            }),
          },
        };
      case 4:
        return {
          businessUnitId: buId,
          workplaceGroupId: wgId,
          additionalPayload: {
            stepperId: 5,
            policyId: id,

            isBalanceShowESS: values?.isEssShowBalance?.value === 1,
            isApplyFromESS: values?.isEssApply?.value === 1,
            roundingTypeId: values?.leaveRoundingType?.value,
            applicationTimeId: +values?.leaveApplicationTime?.value,
            isAttachmentMandatory: values?.isAttachmentMandatory?.value === 1,
            minLeaveForAttachment: values?.attachmentMandatoryAfter,
            maxLeaveInMonth: values?.maxLeaveApplyMonthly,
            maxLeaveInDays: values?.minLeaveApplyDays,
          },
        };
    }
  };
  useEffect(() => {
    getDependTypes();
  }, []);
  return (
    <>
      <PForm
        form={form}
        initialValues={{
          // employee: { value: employeeId, label: userName },
          fromDate: moment(todayDate()),
          toDate: moment(todayDate()),
        }}
        onFinish={onFinish}
      >
        <PCard>
          <PCardHeader
            submitText={current === 4 ? "Save" : undefined}
            // buttonList={[
            //   {
            //     type: "primary",
            //     action: "submit",
            //     content: "Save",
            //     // icon: "plus",
            //     // onClick: () => {
            //     //   if (true) {
            //     //     // history.push(
            //     //     //   "/compensationAndBenefits/securityDeposit/create"
            //     //     // );
            //     //   } else {
            //     //     toast.warn("You don't have permission");
            //     //   }
            //     // },
            //   },
            // ]}

            title={`Leave Policy`}
          />
          {loading && <Loading />}
          <Steps
            className="my-3"
            size="small"
            current={current}
            style={{ fontSize: "12px" }}
            items={items}
          />
          <PCardBody className="mb-3">
            {current === 0 ? (
              <>
                <General
                  form={form}
                  params={params}
                  buId={buId}
                  orgId={orgId}
                  employeeId={employeeId}
                  wgId={wgId}
                  attachmentList={attachmentList}
                  setAttachmentList={setAttachmentList}
                  policyApi={policyApi}
                />
                <PaidLeave form={form} grossBasicEnum={grossBasicEnum} />
                <Consumption
                  form={form}
                  consumeData={consumeData}
                  setConsumeData={setConsumeData}
                />
                <Lapse form={form} />
                <ProRata form={form} />
                <Balance
                  form={form}
                  balanceTable={balanceTable}
                  setBalanceTable={setBalanceTable}
                  JoinOrConfirmEnum={JoinOrConfirmEnum}
                />
                <CalculativeDays
                  form={form}
                  policy={policy}
                  setPolicy={setPolicy}
                  policyApi={policyApi}
                />
              </>
            ) : current === 1 ? (
              // <PaidLeave form={form} />
              <Sandwitch
                form={form}
                selectedRow1={selectedRow1}
                setSelectedRow1={setSelectedRow1}
              />
            ) : current === 2 ? (
              // <Consumption
              //   form={form}
              //   consumeData={consumeData}
              //   setConsumeData={setConsumeData}
              // />
              <CarryForward
                form={form}
                PercentOrFixedEnum={PercentOrFixedEnum}
              />
            ) : current === 3 ? (
              // <Sandwitch
              //   form={form}
              //   selectedRow2={selectedRow2}
              //   setSelectedRow2={setSelectedRow2}
              //   selectedRow1={selectedRow1}
              //   setSelectedRow1={setSelectedRow1}
              // />
              <Encashment
                form={form}
                tableData={tableData}
                setTableData={setTableData}
                grossBasicEnum={grossBasicEnum}
                JoinOrConfirmEnum={JoinOrConfirmEnum}
                PercentOrFixedEnum={PercentOrFixedEnum}
              />
            ) : current === 4 ? (
              // <Lapse form={form} />
              <Additional form={form} />
            ) : (
              // : current === 5 ? (
              //   // <CarryForward form={form} />
              // ) : current === 6 ? (
              //   // <Encashment
              //   //   form={form}
              //   //   tableData={tableData}
              //   //   setTableData={setTableData}
              //   // />
              // ) : current === 7 ? (
              //   // <ProRata form={form} />
              // ) : current === 8 ? (
              //   // <Balance
              //   //   form={form}
              //   //   balanceTable={balanceTable}
              //   //   setBalanceTable={setBalanceTable}
              //   // />
              // ) : current === 9 ? (
              //   // <CalculativeDays
              //   //   form={form}
              //   //   policy={policy}
              //   //   setPolicy={setPolicy}
              //   // />
              // ) : current === 10 ? (
              //   // <Additional form={form} />
              // )
              ""
            )}

            <Row justify="end" className="mt-3" gutter={10}>
              {current < steps.length - 1 && (
                <PButton
                  type="primary"
                  action="button"
                  content="Next"
                  onClick={() => {
                    const cond1 = current === 0 && consumeData.length === 0;
                    const cond2 = current === 3 && tableData.length === 0;
                    const cond3 = current === 0 && balanceTable.length === 0;
                    const cond4 = current === 0 && policy.length === 0;
                    form
                      .validateFields(fields[current])
                      .then(() => {
                        if (cond1 || cond2 || cond3 || cond4) {
                          return toast.warn("Please add data");
                        }
                        // next();

                        createApi.action({
                          urlKey: "CreateLeavePolicy",
                          method: "post",
                          payload: generatePayload(current),
                          onSuccess: (data: any) => {
                            setId(data?.data);
                            next();
                          },
                          onError: (error: any) => {
                            console.log({ error });
                            toast.error(
                              error?.response?.data?.message ||
                                error?.response?.data?.Message ||
                                error?.response?.data?.title ||
                                error?.response?.title ||
                                error?.response?.message ||
                                error?.response?.Message
                            );
                          },
                        });
                      })
                      .catch((e: any) => {
                        console.log({ e });
                      });
                  }}
                />
              )}
              {/* {current === steps.length - 1 && (
                <PButton
                  type="primary"
                  action="button"
                  content="Next"
                  onClick={() => message.success("Processing complete!")}
                />
              )} */}
              {current > 0 && (
                <PButton
                  className="ml-2"
                  type="primary"
                  action="button"
                  content="Previous"
                  onClick={() => prev()}
                />
              )}
            </Row>
          </PCardBody>
        </PCard>
      </PForm>
    </>
  );
};
