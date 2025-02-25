import {
  DataTable,
  Flex,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PSelect,
} from "Components";
import { PModal } from "Components/Modal";
import { Col, Form, Row, Tooltip } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import ATCreateEdit from "./createEdit";

const AssessmentTimeline = () => {
  const [criteriaList, getCriteriaList, criteriaListLoader] = useAxiosGet([]);
  const [fiscalYear, GetFiscalYearDDL, fiscalYearLoader] = useAxiosGet();

  const [modal, setModal] = useState(false);
  const [createmodal, setCreateModal] = useState(false);
  const [form] = Form.useForm();
  const [rowData, setRowData] = useState({});
  const { profileData } = useSelector((state) => state?.auth, shallowEqual);
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const dispatch = useDispatch();
  const history = useHistory();

  const landingApi = () => {
    getCriteriaList(`/PMS/GetAllAssesmentTimelineSetup?accountId`);
    GetFiscalYearDDL(`/PMS/GetFiscalYearDDL`);
  };
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    landingApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30469),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const evaluationCriteriaHeader = [
    {
      title: "SL",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Level of Leadership",
      dataIndex: "positionGroupName",
    },
    {
      title: "Year",
      dataIndex: "yearName",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "letterGenerateId",
      render: (generateId, rec) => (
        <Flex justify="center" gap="10px">
          <Tooltip placement="bottom" title={"View"}>
            <button
              style={{
                height: "24px",
                fontSize: "12px",
                padding: "0px 12px 0px 12px",
                backgroundColor: "var(--green)",
                color: "white",
              }}
              className="btn"
              type="button"
            >
              Start
            </button>
          </Tooltip>
          <Tooltip placement="bottom" title={"Details"}>
            <button
              style={{
                height: "24px",
                fontSize: "12px",
                padding: "0px 12px 0px 12px",
                backgroundColor: "var(--green)",
                color: "white",
              }}
              className="btn"
              type="button"
              onClick={() => setModal(true)}
            >
              Log Details
            </button>
          </Tooltip>
        </Flex>
      ),
      align: "center",
    },
  ];

  return permission?.isView ? (
    <div>
      {criteriaListLoader && <Loading />}
      <PForm form={form}>
        <PCard>
          <PCardHeader
            buttonList={[
              {
                type: "primary",
                content: "Create",
                icon: "plus",
                onClick: () => setCreateModal(true),
              },
            ]}
          />
          <PCardBody>
            <Row gutter={[10, 2]} style={{ marginBottom: "20px" }}>
              <Col md={4} sm={12} xs={24}>
                <PSelect
                  options={fiscalYear || []}
                  name="year"
                  label="Year"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      year: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Year is required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={24}>
                <PButton
                  style={{ marginTop: "22px" }}
                  type="primary"
                  content="View"
                  onClick={() => {
                    const values = form.getFieldsValue(true);
                    // addHandler(values);
                  }}
                />
              </Col>
            </Row>
            <div className="mt-2">
              <DataTable
                bordered
                data={criteriaList?.data || []}
                header={evaluationCriteriaHeader}
              />
            </div>
            <PModal
              title="Create Assesment Timeline"
              open={createmodal}
              onCancel={() => {
                setCreateModal(false);
                landingApi();
              }}
              components={
                <ATCreateEdit
                  modal={createmodal}
                  setModal={setCreateModal}
                  data={rowData}
                  cb={landingApi}
                  isDetails={false}
                />
              }
              width={1000}
            />
            <PModal
              title="Assesment Timeline Setup Log Details"
              open={modal}
              onCancel={() => {
                setModal(false);
                landingApi();
              }}
              components={
                <ATCreateEdit
                  modal={modal}
                  setModal={setModal}
                  data={rowData}
                  cb={landingApi}
                  isDetails={true}
                />
              }
              width={1000}
            />
          </PCardBody>
        </PCard>
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default AssessmentTimeline;
