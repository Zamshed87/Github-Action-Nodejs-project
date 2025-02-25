import { Col, Form, Row } from "antd";
import Loading from "common/loading/Loading";
import { DataTable, PForm } from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { ModalFooter } from "Components/Modal";
import CommonForm from "modules/pms/CommonForm/commonForm";
import { AssesmentTimelineSetup, handleAssesmentTimelineSetup } from "./helper";
import { levelOfLeaderApiCall } from "../evaluationCriteria/helper";
import useAxiosGet from "utility/customHooks/useAxiosGet";
const valueStyle = { fontSize: "14px", fontWeight: "550" };
const labelStyle = { fontSize: "12px" };
const ATLogDetails = ({ modal, setModal, data, cb, isDetails }) => {
  // redux
  const { permissionList, profileData } = useSelector(
    (state) => state?.auth,
    shallowEqual
  );
  const [levelofLeaderShip, setLevelofLeaderShip] = useState([]);
  const [fiscalYear, GetFiscalYearDDL, fiscalYearLoader] = useAxiosGet();
  const [logDetailsData, getlogDetailsData, logDetailsLoader] = useAxiosGet();

  const { buId, wgId, wId, orgId, intAccountId } = profileData;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  let permission = {};
  permissionList.forEach((item) => {
    permission = item;
  });

  const [form] = Form.useForm();
  const params = useParams();
  const { type } = params;

  const logDetailsHeader = [
    {
      title: "SL",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Assesment Start Date-Time",
      dataIndex: "assesmentStartTime",
    },
    {
      title: "Assesment End Date-Time",
      dataIndex: "assesmentEndTime",
    },
    {
      title: "Period",
      dataIndex: "period",
    },
  ];
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    if (!isDetails) {
      GetFiscalYearDDL(`/PMS/GetFiscalYearDDL`);
      levelOfLeaderApiCall(intAccountId, setLevelofLeaderShip, setLoading);
    } else {
      getlogDetailsData(
        `/PMS/Assessment/LogDetails?yearId=2&positionGroupId=${data?.positionGroupId}&pageNumber=1&pageSize=125`
      );
    }
  }, []);

  return permission?.isCreate ? (
    <div>
      {loading && <Loading />}
      <PForm
        form={form}
        initialValues={
          {
            // leadership: data?.levelOfLeadershipName,
            // positionGroupId: data?.levelOfLeadershipId,
            // kpiScore: data?.percentageOfKPI,
            // barScore: data?.percentageOfBAR,
            // id: data?.scoreScaleId,
          }
        }
      >
        {isDetails ? (
          <>
            <Row gutter={[10, 2]} style={{ paddingLeft: "15px" }}>
              <Col md={8}>
                <div style={labelStyle}>Year: </div>
                <div style={valueStyle}>{data?.yearName || "N/A"}</div>
              </Col>
              <Col md={8}>
                <div style={labelStyle}>Level of Leadership:</div>
                <div style={valueStyle}>{data?.positionGroupName || "N/A"}</div>
              </Col>
            </Row>
            <div className="mt-2">
              <DataTable
                bordered
                data={logDetailsData?.data || []}
                header={logDetailsHeader}
              />
            </div>
          </>
        ) : (
          <>
            <CommonForm
              formConfig={AssesmentTimelineSetup(
                fiscalYear,
                levelofLeaderShip,
                "create",
                form
              )}
              form={form}
            />
          </>
        )}
        <>
          {!isDetails && (
            <ModalFooter
              onCancel={() => {
                setModal(() => ({ open: false, type: "" }));
              }}
              submitAction="submit"
              onSubmit={() => {
                const values = form.getFieldsValue(true);
                form
                  .validateFields()
                  .then(() => {
                    console.log("values", values);
                    handleAssesmentTimelineSetup(
                      values,
                      profileData,
                      setLoading,
                      () => {
                        cb && cb();
                        setModal(false);
                      }
                    );
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }}
            />
          )}
        </>
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default ATLogDetails;
