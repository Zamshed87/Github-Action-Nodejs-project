import { AddOutlined, EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import NoResult from "../../../../../common/NoResult";
import PrimaryButton from "../../../../../common/PrimaryButton";
import ViewModal from "../../../../../common/ViewModal";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../../../utility/customHooks/useAxiosPost";
import AddQuestionnariesGroupName from "./AddQuestionnariesGroupName";
import EditQuestionnaires from "./EditQuestionnaires";
import Loading from "../../../../../common/loading/Loading";

const Questionaires = () => {
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
      <div>
        <div className="table-card-heading d-flex justify-content-end">
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
        </div>
      </div>

      {questionnariesList?.length > 0 ? (
        <div className="table-card-body">
          <div className="row mb-4">
            {questionnariesList?.map((questionGroupList, index) => (
              <div className="col-6 mb-4 ">
                <div className="d-flex align-items-center">
                  <h2>
                    <span>{index + 1}.</span>
                    {questionGroupList?.strGroupName}
                  </h2>
                  <div className="d-flex align-items-center justify-content-center">
                    <Tooltip title="Edit" arrow>
                      <button
                        style={{ border: "none" }}
                        className="iconButton mx-2 "
                        onClick={(e) => {
                          e.stopPropagation();
                          // if (!permission?.isEdit)
                          //   return toast.warn("You don't have permission");
                          setQuestionGroupId(questionGroupList?.intHeaderId);
                          setQuestionnairesEditModal?.(true);
                          // setCompetencyId(record?.competencyId);
                        }}
                      >
                        <EditOutlined sx={{ fontSize: "20px" }} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <ul className="ml-4 mt-2">
                  {questionGroupList?.questionRows?.map(
                    (questionItem, index) => (
                      <li>
                        <span>{index + 1}.</span> {questionItem?.strQuestion}
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <NoResult />
      )}
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
          loadingAddQuestionnariesGroupName={loadingAddQuestionnariesGroupName}
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
    </>
  );
};

export default Questionaires;
