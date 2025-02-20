import { Col, Form, Row } from "antd";
import Loading from "common/loading/Loading";
import { DataTable, PForm } from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { ModalFooter } from "Components/Modal";
const valueStyle = { fontSize: "14px", fontWeight: "550" };
const labelStyle = { fontSize: "12px" };
const ATLogDetails = ({ modal, setModal, data, cb }) => {
  // redux
  const { permissionList, profileData } = useSelector(
    (state) => state?.auth,
    shallowEqual
  );

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
      dataIndex: "levelOfLeadershipName",
    },
    {
      title: "Assesment End Date-Time",
      dataIndex: "status",
    },
    {
      title: "Period",
      dataIndex: "status",
    },
    {
      title: "Created By",
      dataIndex: "status",
    },
  ];
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
  }, []);

  const logDetailsData = [
    {
      levelOfLeadershipName: "2025-02-15 10:00 AM",
      status: "2025-02-20 05:00 PM",
      period: "Quarter 1, 2025",
      createdBy: "John Doe",
    },
    {
      levelOfLeadershipName: "2025-03-01 09:30 AM",
      status: "2025-03-10 06:00 PM",
      period: "Quarter 1, 2025",
      createdBy: "Jane Smith",
    },
    {
      levelOfLeadershipName: "2025-04-01 01:15 PM",
      status: "2025-04-05 04:45 PM",
      period: "Quarter 2, 2025",
      createdBy: "Alice Johnson",
    },
  ];

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
        <Row gutter={[10, 2]} style={{ paddingLeft: "15px" }}>
          <Col md={8}>
            <div style={labelStyle}>Year: </div>
            <div style={valueStyle}>{data?.year || "N/A"}</div>
          </Col>
          <Col md={8}>
            <div style={labelStyle}>Level of Leadership:</div>
            <div style={valueStyle}>{data?.levelofLeaderShip || "N/A"}</div>
          </Col>
        </Row>
        <div className="mt-2">
          <DataTable
            bordered
            data={logDetailsData || []}
            header={logDetailsHeader}
          />
        </div>
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default ATLogDetails;
