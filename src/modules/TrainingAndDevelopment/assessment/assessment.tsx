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
import { useApiRequest } from "Hooks";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { ViewTrainingSchedule } from "../planning/helper";
import { perticipantMap, saveAssessment } from "./helper";

const TnDAssessment = () => {
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
  const [perticipantField, setperticipantField] = useState<any>(
    type === "edit"
      ? perticipantMap(dataDetails?.trainingParticipantDto, data)
      : []
  );
  const empDepartmentDDL = useApiRequest([]);
  const positionDDL = useApiRequest([]);
  const [rowData, setRowData] = useState<any>(null);
  const [assessmentDDL, setAssessmentDDL] = useState(null);

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  let permission = null;

  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30356) {
      permission = item;
    }
  });

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
      dataIndex: "hrPosition",
      width: 50,
    },
    {
      title: "Department",
      dataIndex: "department",
      width: 50,
    },
    {
      title: "Workplace",
      dataIndex: "workplace",
      width: 50,
    },
    {
      title: "Workplace Group",
      dataIndex: "workplaceGroup",
      width: 60,
    },
    {
      title: (
        <>
          Send Request
          <br />
          <Checkbox
            style={{ color: "green", fontSize: "14px", cursor: "pointer" }}
            checked={rowData?.every((item: any) => item.attendanceStatus === 0)}
            onChange={(e) => {
              setRowData(
                rowData.map((item: any) => ({
                  ...item,
                  attendanceStatus: e.target.checked ? 0 : 1,
                }))
              );
            }}
          />
        </>
      ),
      dataIndex: "isRequested",
      render: (_: any, rec: any) => (
        <Flex justify="center">
          <Checkbox
            style={{ color: "green", fontSize: "14px", cursor: "pointer" }}
            checked={rec.attendanceStatus === 0}
            onChange={(e) => {
              setRowData(
                rowData.map((item: any) =>
                  item.uId === rec.uId
                    ? { ...item, attendanceStatus: e.target.checked ? 0 : 1 }
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
    empDepartmentDDL?.action({
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: {
        businessUnitId: profileData?.buId,
        // workplaceGroupId: workplaceGroup?.value,
        // workplaceId: workplace?.value,

        accountId: profileData?.orgId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.strDepartment;
          res[i].value = item?.intDepartmentId;
        });
      },
    });
    positionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Position",
        BusinessUnitId: profileData?.buId,
        // WorkplaceGroupId: workplaceGroup?.value,
        // IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.PositionName;
          res[i].value = item?.PositionId;
        });
      },
    });
  }, []);

  useEffect(() => {
    ViewTrainingSchedule(data?.id, setLoading, (responseData: any) => {
      const formattedData = responseData.map((item: any) => ({
        ...item,
        value: item.id,
        label: `${moment(item?.trainingDate).format("DD-MM-YYYY")}[${moment(
          item.startTime,
          "HH:mm"
        ).format("hh:mm A")}-${moment(item?.endTime, "HH:mm").format(
          "hh:mm A"
        )}]`,
      }));
      setAssessmentDDL(formattedData);
    });
  }, []);

  return (
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
          trainingDuration: "TEST",
        }}
      >
        <PCard>
          <PCardHeader
            backButton
            title={`Training Assessment`}
            buttonList={[
              {
                type: "primary",
                content: "Save",
                icon: <SaveOutlined />,
                onClick: () => {
                  const values = form.getFieldsValue(true);
                  saveAssessment(form, data, rowData, setLoading, () => {
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
                  name="assessmentform"
                  label="Assessment Form"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      attendanceDate: op,
                    });
                  }}
                  rules={[
                    { required: true, message: "Assessment Form is required" },
                  ]}
                  options={assessmentDDL || []}
                />
              </Col>
              {/* <Col md={2} sm={24} style={{ marginTop: "22px" }}>
                <PButton
                  type="primary"
                  content="View"
                  onClick={() => {
                    const values = form.getFieldsValue(true);
                    form
                      .validateFields()
                      .then(() => {
                        getLandingApi(
                          `/TrainingAttendance/GetAllParticipantByTrainingId?trainingId=${data?.id}&attendanceDate=${values?.attendanceDate?.trainingDate}`,
                          (data: any) => {
                            setRowData(
                              data.map((item: any, index: number) => ({
                                ...item,
                                uId: index,
                              }))
                            );
                          }
                        );
                      })
                      .catch(() => {});
                  }}
                />
              </Col> */}
            </Row>
          </PCardBody>
          {!landingLoading && rowData && (
            <PCardBody>
              <DataTable bordered data={rowData || []} header={header} />
            </PCardBody>
          )}
          {/* <PCardBody>
            <ListOfPerticipants
              form={form}
              perticipantField={perticipantField}
              setperticipantField={setperticipantField}
              addHandler={addHanderForPerticipant}
              // calculatePerPersonCost={calculatePerPersonCost}
              departmentDDL={empDepartmentDDL?.data || []}
              positionDDL={positionDDL?.data || []}
            />{" "}
          </PCardBody> */}
        </PCard>
      </PForm>
    </div>
  );
};

export default TnDAssessment;
