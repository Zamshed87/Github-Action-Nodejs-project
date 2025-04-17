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
import useAxiosPost from "utility/customHooks/useAxiosPost";
import Chips from "common/Chips";
import { toast } from "react-toastify";

const AssessmentTimeline = () => {
  const [criteriaList, getCriteriaList, criteriaListLoader] = useAxiosGet([]);
  const [fiscalYear, GetFiscalYearDDL, fiscalYearLoader] = useAxiosGet();
  const [, saveAssetStart, asseStartloading, setAssetStart] = useAxiosPost({});

  const [modal, setModal] = useState(false);
  const [createmodal, setCreateModal] = useState(false);
  const [form] = Form.useForm();
  const [rowData, setRowData] = useState({});
  const { profileData } = useSelector((state) => state?.auth, shallowEqual);
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const dispatch = useDispatch();
  const history = useHistory();

  const landingApi = (values) => {
    let year = "";
    if (values?.year?.value) {
      year = `yearId=${values?.year?.value || 0}`;
    }
    getCriteriaList(
      `/PMS/GetAllAssesmentTimelineSetup?${year}&pageNumber=1&pageSize=125`
    );
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
      render: (status) => {
        let statusClass = "secondary p-2 rounded-5"; // Default class

        if (status === "Running") {
          statusClass = "success p-2 rounded-5";
        } else if (status === "Assigned") {
          statusClass = "secondary p-2 rounded-5";
        } else if (status === "Stop") {
          statusClass = "warning p-2 rounded-5";
        }

        return (
          <div>
            <Chips label={status} classess={statusClass} />
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "letterGenerateId",
      render: (generateId, rec) => (
        <Flex justify="center" gap="10px">
          <Tooltip placement="bottom" title={"Status"}>
            <button
              style={{
                height: "24px",
                fontSize: "12px",
                padding: "0px 12px 0px 12px",
                backgroundColor:
                  rec?.status === "Running" ? "red" : "var(--green)",
                color: "white",
              }}
              className="btn"
              type="button"
              onClick={() => {
                let payload = {
                  assesmentTimelineSetupId: rec?.assesmentTimelineSetupId,
                };
                let url =
                  rec?.status === "Running"
                    ? `/PMS/Assessment/Stop`
                    : `/PMS/Assessment/Start`;
                ("");
                saveAssetStart(url, payload, () => {
                  toast.success(
                    rec?.status === "Running"
                      ? "🟢 Sucessfully Started"
                      : "🔴 Sucessfully Stopped"
                  );
                  landingApi();
                });
              }}
            >
              {rec?.status === "Running" ? "Stop" : "Start"}
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
              onClick={() => {
                setRowData(rec);
                setModal(true);
              }} //
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
                  allowClear
                  placeholder="Select Year"
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
                    landingApi(values);
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
