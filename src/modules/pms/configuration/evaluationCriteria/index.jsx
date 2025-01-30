import { useHistory } from "react-router-dom";
import { AddOutlined, Edit, Grain } from "@mui/icons-material";
import { toast } from "react-toastify";
import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import PrimaryButton from "../../../../common/PrimaryButton";
import Loading from "../../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { IconButton } from "@mui/material";
import { DataTable, Flex, PButton, PCard, PCardBody, PForm } from "Components";
import CommonForm from "modules/pms/CommonForm/commonForm";
import { Col, Form, Tooltip } from "antd";
import { formConfig } from "./helper";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { EditOutlined } from "@ant-design/icons";

const EvaluationCriteria = () => {
  const [criteriaList, getCriteriaList, criteriaListLoader] = useAxiosGet();
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  // const [rowDto, getRowData, rowDataLoader] = useAxiosGet();
  const { profileData } = useSelector((state) => state?.auth, shallowEqual);
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getCriteriaList(
      `/PMS/GetEvaluationCriteria?accountId=${profileData?.intAccountId}`
    );
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
      dataIndex: "participantName",
    },
    {
      title: "Designation",
      dataIndex: "hrPositionName",
    },
    {
      title: "KPI Score",
      dataIndex: "hrPositionName",
    },
    {
      title: "BAR Score",
      dataIndex: "hrPositionName",
    },
    {
      title: "Action",
      dataIndex: "letterGenerateId",
      render: (generateId, rec) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title={"Edit"}>
            <EditOutlined
              style={{
                color: "green",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                setEditMode(true);
                form.setFieldsValue({
                  leadership: rec?.participantName,
                  age: rec?.kpiScore,
                  department: rec?.hrPositionName,
                });
                //   if (!permission?.isEdit) {
                //     toast.warning("You don't have permission to edit");
                //     return;
                //   }
                //   ViewTrainingRequistion(
                //     rec?.id,
                //     setLoading,
                //     setViewData,
                //     (d: any) => {
                //       history.push("/trainingAndDevelopment/requisition/edit", {
                //         data: d,
                //       });
                //     }
                //   );
              }}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
    },
  ];
  const demoData = [
    {
      key: "1",
      participantName: "John Doe",
      hrPositionName: "Manager",
      kpiScore: 85,
      barScore: 90,
      letterGenerateId: "12345",
    },
    {
      key: "2",
      participantName: "Jane Smith",
      hrPositionName: "Senior Developer",
      kpiScore: 78,
      barScore: 88,
      letterGenerateId: "67890",
    },
    {
      key: "3",
      participantName: "Alice Johnson",
      hrPositionName: "Team Lead",
      kpiScore: 92,
      barScore: 85,
      letterGenerateId: "11223",
    },
    {
      key: "4",
      participantName: "Bob Brown",
      hrPositionName: "Analyst",
      kpiScore: 80,
      barScore: 82,
      letterGenerateId: "44556",
    },
  ];
  return permission?.isView ? (
    <div className="table-card">
      <div className="table-card-heading justify-content-end">
        <ul className="d-flex flex-wrap">
          <ul className="d-flex flex-wrap">
            {criteriaList?.scoreScaleId ? (
              <li>
                <PrimaryButton
                  type="button"
                  className="btn btn-default flex-center"
                  label={"Edit"}
                  icon={<Edit sx={{ marginRight: "11px", fontSize: "16px" }} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!permission?.isEdit)
                      return toast.warn("You don't have permission");
                    history.push({
                      pathname: `/pms/configuration/EvaluationCriteria/edit/${criteriaList?.scoreScaleId}`,
                    });
                  }}
                />
              </li>
            ) : (
              <li>
                <PrimaryButton
                  type="button"
                  className="btn btn-default flex-center"
                  label={"Create"}
                  icon={<AddOutlined sx={{ marginRight: "11px" }} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push(
                      "/pms/configuration/EvaluationCriteria/create"
                    );
                  }}
                />
              </li>
            )}
          </ul>
        </ul>
      </div>
      {criteriaListLoader && <Loading />}
      <PForm form={form}>
        {/* <PCard>
          <PCardBody> */}
        <h1 className="mb-2">Evaluation Criteria Score and Scale</h1>
        <CommonForm formConfig={formConfig} form={form}>
          {!editMode && (
            <Col span={4}>
              <PButton
                style={{
                  marginTop: "22px",
                  marginRight: "10px",
                }}
                type="primary"
                content={"Save"}
                onClick={() => {
                  const values = form.getFieldsValue(true);
                  form
                    .validateFields()
                    .then(() => {
                      console.log(values);
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }}
              />
            </Col>
          )}
          {editMode && (
            <Col span={4}>
              <PButton
                style={{
                  marginTop: "22px",
                  backgroundColor: "red",
                }}
                type="primary"
                content={"Edit"}
                onClick={() => {
                  const values = form.getFieldsValue(true);
                  form
                    .validateFields()
                    .then(() => {
                      console.log(values);
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }}
              />
            </Col>
          )}
        </CommonForm>
        <div className="mt-2">
          <DataTable
            bordered
            data={demoData || []}
            header={evaluationCriteriaHeader}
          />
        </div>
        {/* </PCardBody>
        </PCard> */}
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default EvaluationCriteria;
