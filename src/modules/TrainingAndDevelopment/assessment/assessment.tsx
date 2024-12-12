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

import { useApiRequest } from "Hooks";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

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
  const [showTable, setShowTable] = useState(false);
  const [viewData, setViewData] = useState<any>(null);
  const [viewDataDetails, setViewDataDetails] = useState<any>(null);
  const [rowData, setRowData] = useState<any>(null);

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
      dataIndex: "perticipant",
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
      dataIndex: "Workplace",
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
            checked={rowData?.every((item: any) => item.isRequested)}
            onChange={(e) => {
              setRowData(
                rowData.map((item: any) => ({
                  ...item,
                  isRequested: e.target.checked,
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
            checked={rec.isRequested}
            onChange={(e) => {
              setRowData(
                rowData.map((item: any) =>
                  item.key === rec.key
                    ? { ...item, isRequested: e.target.checked }
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

  const demoData = [
    {
      key: "1",
      perticipant: "John Doe",
      hrPosition: "Manager",
      department: "HR",
      Workplace: "Head Office",
      workplaceGroup: "Group A",
      isRequested: false,
    },
    {
      key: "2",
      perticipant: "Jane Smith",
      hrPosition: "Developer",
      department: "IT",
      Workplace: "Remote",
      workplaceGroup: "Group B",
      isRequested: false,
    },
    {
      key: "3",
      perticipant: "Robert Brown",
      hrPosition: "Analyst",
      department: "Finance",
      Workplace: "Branch Office",
      workplaceGroup: "Group C",
      isRequested: false,
    },
    {
      key: "4",
      perticipant: "Emily Johnson",
      hrPosition: "Designer",
      department: "Marketing",
      Workplace: "Remote",
      workplaceGroup: "Group A",
      isRequested: false,
    },
    {
      key: "5",
      perticipant: "Michael Wilson",
      hrPosition: "Intern",
      department: "Operations",
      Workplace: "Head Office",
      workplaceGroup: "Group B",
      isRequested: false,
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
    setRowData(demoData);
  }, []);

  return (
    <div>
      {loading && <Loading />}
      <PForm
        form={form}
        initialValues={{ reasonForRequisition: data?.requestor }}
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
                  name="trainingTitle"
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
              <Col md={4} sm={24}>
                <PInput
                  type="text"
                  placeholder="Training Duration"
                  label="Training Duration"
                  name="trainingDuration"
                  disabled={true}
                />
              </Col>
              <Col md={4} sm={24}>
                <PSelect
                  name="assessmentform"
                  label="Assessment Form"
                  onChange={(value) => {
                    form.setFieldsValue({
                      attendanceDate: value,
                    });
                  }}
                  rules={[
                    { required: true, message: "Assessment Form is required" },
                  ]}
                />
              </Col>
              <Col md={2} sm={24} style={{ marginTop: "22px" }}>
                <PButton
                  type="primary"
                  content="View"
                  onClick={() => setShowTable(!showTable)}
                />
              </Col>
            </Row>
          </PCardBody>
          {showTable && (
            <PCardBody>
              <DataTable bordered data={rowData || []} header={header} />
            </PCardBody>
          )}
        </PCard>
      </PForm>
    </div>
  );
};

export default TnDAssessment;
