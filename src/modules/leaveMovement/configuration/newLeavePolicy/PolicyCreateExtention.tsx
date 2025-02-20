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
import { FcDataConfiguration } from "react-icons/fc";
import { GrConfigure } from "react-icons/gr";
import { GrDocumentConfig } from "react-icons/gr";
import { CiGlobe } from "react-icons/ci";
import { MdCalculate, MdOutlineMoreTime } from "react-icons/md";
import { MdTimelapse } from "react-icons/md";
import { SiNewbalance } from "react-icons/si";
import { BsCashCoin } from "react-icons/bs";
import { LuSandwich } from "react-icons/lu";
import { FaRegCalendarPlus } from "react-icons/fa";
import { ModalFooter } from "Components/Modal";

export const PolicyCreateExtention = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params: any = useParams();
  const [current, setCurrent] = useState(0);
  const [consumeData, setConsumeData] = useState<any>([]);
  const [selectedRow1, setSelectedRow1] = useState<any[]>([]);
  const [selectedRow2, setSelectedRow2] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any>([]);
  const [balanceTable, setBalanceTable] = useState<any>([]);
  const [policy, setPolicy] = useState<any>([]);

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

  // ddls

  const onFinish = () => {
    console.log("first");
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
      status: "finish",
      icon: <CiGlobe />,
    },
    {
      title: "Paid Leave",
      status: "finish",
      icon: <GrConfigure />,
    },
    {
      title: "Expenditure",
      status: "process",
      icon: <GrDocumentConfig />,
    },
    {
      title: "Sandwitch",
      status: "process",
      icon: <LuSandwich />,
    },
    {
      title: "Lapse",
      status: "wait",
      icon: <MdTimelapse />,
    },
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
    {
      title: "Pro Rata",
      status: "wait",
      icon: <FcDataConfiguration />,
    },
    {
      title: "Balance",
      status: "wait",
      icon: <SiNewbalance />,
    },
    {
      title: "Calculative",
      status: "wait",
      icon: <MdCalculate />,
    },
    {
      title: "Additional",
      status: "wait",
      icon: <MdOutlineMoreTime />,
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
    ],
    ["payValue", "payDependsOn", "paidType"],
    [
      "leaveConsumeType",
      "maxConsumeTime",
      "minConsumeTime",
      "standardWorkHour",
    ],
    [],
    ["leavelapse", "afterLeaveCompleted"],
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
    ["isProRata", "proRataCount", "proRataBasis"],
    [
      "dependsOn",
      "serviceStartLengthBalance",
      "serviceEndLengthBalance",
      "leaveDependsOn",
      "calculativeDays",
      "bridgeLeaveFor",
      "expireAfterAvailable",
      "minWorkHr",
      "leaveDaysFor",
    ],
    ["policy"],
  ];
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
            submitText="Save"
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
          <PCardBody className="mb-3">
            {current === 0 ? (
              <General
                form={form}
                params={params}
                buId={buId}
                orgId={orgId}
                employeeId={employeeId}
                wgId={wgId}
              />
            ) : current === 1 ? (
              <PaidLeave form={form} />
            ) : current === 2 ? (
              <Consumption
                form={form}
                consumeData={consumeData}
                setConsumeData={setConsumeData}
              />
            ) : current === 3 ? (
              <Sandwitch
                form={form}
                selectedRow2={selectedRow2}
                setSelectedRow2={setSelectedRow2}
                selectedRow1={selectedRow1}
                setSelectedRow1={setSelectedRow1}
              />
            ) : current === 4 ? (
              <Lapse form={form} />
            ) : current === 5 ? (
              <CarryForward form={form} />
            ) : current === 6 ? (
              <Encashment
                form={form}
                tableData={tableData}
                setTableData={setTableData}
              />
            ) : current === 7 ? (
              <ProRata form={form} />
            ) : current === 8 ? (
              <Balance
                form={form}
                balanceTable={balanceTable}
                setBalanceTable={setBalanceTable}
              />
            ) : current === 9 ? (
              <CalculativeDays
                form={form}
                policy={policy}
                setPolicy={setPolicy}
              />
            ) : current === 10 ? (
              <Additional form={form} />
            ) : (
              ""
            )}

            <Row justify="end" className="mt-3" gutter={10}>
              {current < steps.length - 1 && (
                <PButton
                  type="primary"
                  action="button"
                  content="Next"
                  onClick={() => {
                    const cond1 = current === 2 && consumeData.length === 0;
                    const cond2 = current === 6 && tableData.length === 0;
                    const cond3 = current === 8 && balanceTable.length === 0;
                    const cond4 = current === 9 && policy.length === 0;
                    form
                      .validateFields(fields[current])
                      .then(() => {
                        if (cond1 || cond2 || cond3 || cond4) {
                          return toast.warn("Please add data");
                        }
                        next();
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
          <Steps
            size="small"
            current={current}
            style={{ fontSize: "12px" }}
            items={items}
          />
        </PCard>
      </PForm>
    </>
  );
};
