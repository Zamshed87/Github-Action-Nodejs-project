import { Col, Divider, Form, Row } from "antd";
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
import { LeaveCalculation } from "./components/LeaveCalculation";
import { PaidLeave } from "./components/PaidLeave";

export const PolicyCreateExtention = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params: any = useParams();

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

  const onFinish = () => {};
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
            buttonList={[
              {
                type: "primary",
                content: "Save",
                // icon: "plus",
                onClick: () => {
                  if (true) {
                    // history.push(
                    //   "/compensationAndBenefits/securityDeposit/create"
                    // );
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
            ]}
            title={`Leave Policy`}
          />
          {loading && <Loading />}
          <PCardBody className="mb-3">
            <General
              form={form}
              params={params}
              buId={buId}
              orgId={orgId}
              employeeId={employeeId}
              wgId={wgId}
            />
            <PaidLeave form={form} />
            <Consumption form={form} />
            <Sandwitch form={form} />
            <Lapse form={form} />
            <CarryForward form={form} />
            <Encashment form={form} />
            <ProRata form={form} />
            <Additional form={form} />
            <Balance form={form} />
            <CalculativeDays form={form} />
            <LeaveCalculation form={form} />
          </PCardBody>
        </PCard>
      </PForm>
    </>
  );
};
