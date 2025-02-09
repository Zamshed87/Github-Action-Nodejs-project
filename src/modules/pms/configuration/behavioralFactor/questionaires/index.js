import { AddOutlined, EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { PCard, PCardHeader, PForm } from "Components";
import { Collapse, Form } from "antd";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import NoResult from "../../../../../common/NoResult";
import ViewModal from "../../../../../common/ViewModal";
import Loading from "../../../../../common/loading/Loading";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../../../utility/customHooks/useAxiosPost";
import AddQuestionnariesGroupName from "./AddQuestionnariesGroupName";
import EditQuestionnaires from "./EditQuestionnaires";
import QuestionnairesList from "./QuestionnairesList";
const { Panel } = Collapse;
const Questionaires = () => {
  const [form] = Form.useForm();
  const {
    permissionList,
    profileData: { buId, orgId, employeeId },
  } = useSelector((state) => state?.auth, shallowEqual);
  const [questionnairesEditModal, setQuestionnairesEditModal] = useState(false);
  const [questionnairesGroupNameModal, setQuestionnairesGroupNameModal] =
    useState(false);
  const [questionnariesList, getQuestionnariesList, loadingQuestionnariesList] =
    useAxiosGet([]);
  const [questionGroupId, setQuestionGroupId] = useState(null);
  const [, addQuestionnariesGroupName, loadingAddQuestionnariesGroupName] =
    useAxiosPost();
  const permission = useMemo(
    () => permissionList?.find((item) => item?.menuReferenceId === 30438),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getQuestionnariesList(`/PMS/GetQuestionnaireGroupName?accountId=${orgId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  return (
    <>
      {(loadingQuestionnariesList || loadingAddQuestionnariesGroupName) && (
        <Loading />
      )}
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            backButton
            title="Create Questionnaires"
            buttonList={[
              {
                type: "primary",
                content: "Add Group",
                onClick: () => {
                  // if (!permission?.isCreate)
                  //   return toast.warn("You don't have permission");
                  setQuestionnairesGroupNameModal(true);
                  // setQuestionnairesEditModal(true);
                },
                icon: (
                  <AddOutlined
                    sx={{
                      marginRight: "0px",
                      fontSize: "15px",
                    }}
                  />
                ),
              },
            ]}
          />
          <div>
            {/* <div className="table-card-heading d-flex justify-content-end">
              <ul>
                <li>
                  <PrimaryButton
                    type="button"
                    className="btn btn-default flex-center"
                    label={questionnariesList?.length > 0 ? "Edit" : "Create"}
                    icon={
                      questionnariesList?.length > 0 ? (
                        <EditOutlined
                          sx={{
                            marginRight: "0px",
                            fontSize: "15px",
                          }}
                        />
                      ) : (
                        <AddOutlined
                          sx={{
                            marginRight: "0px",
                            fontSize: "15px",
                          }}
                        />
                      )
                    }
                    onClick={() => {
                      // if (!permission?.isCreate)
                      //   return toast.warn("You don't have permission");
                      setQuestionnairesGroupNameModal(true);
                      // setQuestionnairesEditModal(true);
                    }}
                  />
                </li>
              </ul>
            </div> */}
          </div>
          <QuestionnairesList
            questionnariesList={questionnariesList}
            setQuestionGroupId={setQuestionGroupId}
            setQuestionnairesEditModal={setQuestionnairesEditModal}
          />
          {/* modal for create button */}
          <ViewModal
            size="lg"
            title="Create Questionnaires Group Name "
            backdrop="static"
            classes="default-modal"
            show={questionnairesGroupNameModal}
            onHide={() => setQuestionnairesGroupNameModal(false)}
          >
            <AddQuestionnariesGroupName
              employeeId={employeeId}
              permission={permission}
              orgId={orgId}
              onHide={() => {
                setQuestionnairesGroupNameModal(false);
                getQuestionnariesList(
                  `/PMS/GetQuestionnaireGroupName?accountId=${orgId}`
                );
              }}
              questionnariesList={questionnariesList}
              // setQuestionairesList={setQuestionairesList}
              addQuestionnariesGroupName={addQuestionnariesGroupName}
              loadingAddQuestionnariesGroupName={
                loadingAddQuestionnariesGroupName
              }
            />
          </ViewModal>

          {/* modal for edit  */}
          <ViewModal
            size="lg"
            title="Questionnaires Details"
            backdrop="static"
            classes="default-modal preview-modal"
            show={questionnairesEditModal}
            onHide={() => {
              setQuestionnairesEditModal(false);
              setQuestionGroupId(null);
            }}
          >
            <EditQuestionnaires
              orgId={orgId}
              buId={buId}
              employeeId={employeeId}
              // setQuestionairesList={setQuestionairesList}
              setQuestionGroupId={setQuestionGroupId}
              questionGroupId={questionGroupId}
              questionnariesList={questionnariesList}
              onHide={() => {
                getQuestionnariesList(
                  `/PMS/GetQuestionnaireGroupName?accountId=${orgId}`
                );
                setQuestionnairesEditModal(false);
              }}
              permission={permission}
            />
          </ViewModal>
        </PCard>
      </PForm>
    </>
  );
};

export default Questionaires;
