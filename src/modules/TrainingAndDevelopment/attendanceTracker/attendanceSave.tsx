import { SaveOutlined } from "@ant-design/icons";
import { Checkbox, Col, Form, Row } from "antd";
import Loading from "common/loading/Loading";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import {
  DataTable,
  Flex,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { perticipantMap } from "./helper";
import { saveAttendace } from "./helper";
import { useApiRequest } from "Hooks";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ViewTrainingPlan,
  ViewTrainingPlanDetails,
  ViewTrainingSchedule,
} from "../planning/helper";
import moment from "moment";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const TnDAttendanceSave = () => {
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
  const [viewData, setViewData] = useState<any>(null);
  const [viewDataDetails, setViewDataDetails] = useState<any>(null);
  const [rowData, setRowData] = useState<any>(null);
  const [attendanceDDL, setAttendanceDDL] = useState(null);

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
          Attendance
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
      dataIndex: "attendanceStatus",
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

  const addHanderForPerticipant = (values: any) => {
    if (!values?.employee) {
      toast.error("Employee is required");
      return;
    }
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    const nextId =
      perticipantField.length > 0
        ? perticipantField[perticipantField.length - 1].id + 1
        : 1;
    setperticipantField([
      ...perticipantField,
      {
        id: nextId,
        perticipant: `${values?.employee?.label} - ${values?.employee?.value}`,
        perticipantId: values?.employee?.value,
        department: values?.department?.label,
        departmentId: values?.department?.value,
        hrPosition: values?.hrPosition?.label,
        hrPositionId: values?.hrPosition?.value,
        workplaceGroup: workplaceGroup?.label,
        workplaceGroupId: workplaceGroup?.value,
        workplace: workplace?.label,
        workplaceId: workplace?.value,
      },
    ]);
  };

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
      setAttendanceDDL(formattedData);
    });
  }, []);

  return (
    <div>
      {(loading || landingLoading) && <Loading />}
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
            title={`Attendance Tracker`}
            buttonList={[
              {
                type: "primary",
                content: "Save",
                icon: <SaveOutlined />,
                onClick: () => {
                  const values = form.getFieldsValue(true);
                  saveAttendace(form, data, rowData, setLoading, () => {
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
                  name="attendanceDate"
                  label="Attendance Date & Time"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      attendanceDate: op,
                    });
                  }}
                  rules={[
                    { required: true, message: "Attendance Date is required" },
                  ]}
                  options={attendanceDDL || []}
                />
              </Col>
              <Col md={2} sm={24} style={{ marginTop: "22px" }}>
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
              </Col>
              <Col md={6} sm={24} style={{ marginTop: "22px" }}>
                <PButton
                  type="primary"
                  content="Add Participants"
                  onClick={() =>
                    ViewTrainingPlan(
                      data?.id,
                      setLoading,
                      setViewData,
                      (d: any) => {
                        ViewTrainingPlanDetails(
                          data?.id,
                          setLoading,
                          setViewDataDetails,
                          (details: any) => {
                            history.push(
                              "/trainingAndDevelopment/planning/edit",
                              {
                                data: d,
                                dataDetails: details,
                                onlyPerticipant: true,
                              }
                            );
                          }
                        );
                      }
                    )
                  }
                />
              </Col>
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

export default TnDAttendanceSave;
