import { SaveOutlined } from "@ant-design/icons";
import { Checkbox, Col, Form, Row } from "antd";
import Loading from "common/loading/Loading";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  DataTable,
  Flex,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { saveFeedback } from "./helper";
import { useApiRequest } from "Hooks";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";

const TnDFeedback = () => {
  interface LocationState {
    data?: any;
    dataDetails?: any;
  }
  const [form] = Form.useForm();
  const params = useParams<{ type: string }>();
  const { type } = params;

  const dispatch = useDispatch();
  const location = useLocation<LocationState>();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { data = {}, dataDetails = {} } = location?.state || {};

  const [rowData, setRowData] = useState<any>(null);

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  let permission: any = {};
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30356) {
      permission = item;
    }
  });

  const { buId, wgId, wId } = profileData;

  // landing calls
  const ddlApi = useApiRequest({});

  const ddlApiCall = () => {
    const payload = {
      businessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      isPaginated: false,
      isHeaderNeeded: true,
      typeList: [2],
      pageNo: 1,
      pageSize: 500,
      statusList: [],
      createdByList: [],
    };
    ddlApi?.action({
      urlKey: "GetQuestionLanding",
      method: "POST",
      payload: payload,
    });
  };

  //   api calls

  // table column
  const header: any = [
    {
      title: "SL",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Participants List",
      dataIndex: "participantName",
      width: 120,
    },
    {
      title: "HR Position",
      dataIndex: "hrPositionName",
      width: 50,
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      width: 50,
    },
    {
      title: "Workplace",
      dataIndex: "workplaceName",
      width: 50,
    },
    {
      title: "Workplace Group",
      dataIndex: "workplaceGroupName",
      width: 60,
    },
    {
      title: "Feedback Count",
      dataIndex: "privouslyFeedbackSubmittedCount",
      width: 50,
    },
    {
      title: (
        <>
          Feedback Done
          <br />
          <Checkbox
            style={{ color: "green", fontSize: "14px", cursor: "pointer" }}
            checked={rowData?.every(
              (item: any) => item.isFeedbackDone === true
            )}
            onChange={(e) => {
              setRowData(
                rowData.map((item: any) => ({
                  ...item,
                  isFeedbackDone: e.target.checked,
                }))
              );
            }}
          />
        </>
      ),
      dataIndex: "isFeedbackDone",
      render: (_: any, rec: any) => (
        <Flex justify="center">
          <Checkbox
            style={{ color: "green", fontSize: "14px", cursor: "pointer" }}
            checked={rec.isFeedbackDone === true}
            onChange={(e) => {
              setRowData(
                rowData.map((item: any) =>
                  item.uId === rec.uId
                    ? { ...item, isFeedbackDone: e.target.checked }
                    : item
                )
              );
            }}
          />
        </Flex>
      ),
      align: "center",
      width: 40,
    },
  ];

  const [landingApi, getLandingApi, landingLoading, , landingError] =
    useAxiosGet();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
    ddlApiCall();
    landingApiCall();
  }, []);

  const landingApiCall = () => {
    getLandingApi(
      `/TrainingFeedback/FeedbackParticipant/${data?.id}`,
      (data: any) => {
        setRowData(
          data.map((item: any, index: number) => ({
            ...item,
            uId: index,
          }))
        );
      }
    );
  };
  return permission?.isView ? (
    <div>
      {loading && <Loading />}
      <PForm
        form={form}
        initialValues={{
          trainingTypeName: data?.trainingTypeName,
          trainingTitle: data?.trainingTitleName,
          trainingMode: data?.trainingModeStatus?.label,
          trainingOrganizer: data?.trainingOrganizerType?.label,
          trainingVenue: data?.venueAddress,
          trainingStatus: data?.status?.label,
        }}
      >
        <PCard>
          <PCardHeader
            backButton
            title={`Training Feedback`}
            buttonList={[
              {
                type: "primary",
                content: "Save",
                icon: <SaveOutlined />,
                onClick: () => {
                  const values = form.getFieldsValue(true);
                  if (!permission?.isCreate) {
                    toast.warn("You don't have permission to create");
                    return;
                  }
                  saveFeedback(form, data, rowData, setLoading, () => {
                    history.push("/trainingAndDevelopment/trainingPlan");
                  });
                  form
                    .validateFields()
                    .then(() => {})
                    .catch(() => {});
                },
              },
            ]}
          />
          <PCardBody>
            <Row gutter={[10, 2]}>
              <Col md={4} sm={24}>
                <PInput
                  type="text"
                  placeholder="Training Type"
                  label="Training Type"
                  name="trainingTypeName"
                  disabled={true}
                />
              </Col>
              <Col md={4} sm={24}>
                <PInput
                  type="text"
                  placeholder="Training Title"
                  label="Training Title"
                  name="trainingTitle"
                  disabled={true}
                />
              </Col>
              <Col md={4} sm={24}>
                <PInput
                  type="text"
                  placeholder="Training Mode"
                  label="Training Mode"
                  name="trainingMode"
                  disabled={true}
                />
              </Col>
              <Col md={4} sm={24}>
                <PInput
                  type="text"
                  placeholder="Training Organizer"
                  label="Training Organizer"
                  name="trainingOrganizer"
                  disabled={true}
                />
              </Col>
              <Col md={4} sm={24}>
                <PInput
                  type="text"
                  placeholder="Training Venue"
                  label="Training Venue"
                  name="trainingVenue"
                  disabled={true}
                />
              </Col>
              <Col md={4} sm={24}>
                <PInput
                  type="text"
                  placeholder="Training Status"
                  label="Training Status"
                  name="trainingStatus"
                  disabled={true}
                />
              </Col>
              {/* <Col md={4} sm={24}>
                <PInput
                  type="text"
                  placeholder="Training Duration"
                  label="Training Duration"
                  name="trainingDuration"
                />
              </Col> */}
              <Col md={6} sm={24}>
                <PSelect
                  name="feedbackform"
                  options={
                    ddlApi?.data?.data?.map((item: any) => ({
                      label: item?.title,
                      value: item?.id,
                    })) || []
                  }
                  label="Feedback Form"
                  onChange={(op) => {
                    form.setFieldsValue({
                      feedbackform: op,
                    });
                  }}
                  rules={[
                    { required: true, message: "Feedback Form is required" },
                  ]}
                />
              </Col>
            </Row>
          </PCardBody>
          {!landingLoading && rowData && (
            <PCardBody>
              <DataTable bordered data={rowData || []} header={header} />
            </PCardBody>
          )}
        </PCard>
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default TnDFeedback;
