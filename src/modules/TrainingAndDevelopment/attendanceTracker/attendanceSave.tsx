import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Col, Form, FormInstance, Row, Tooltip, Checkbox } from "antd";
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

import { useApiRequest } from "Hooks";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import ListOfPerticipants from "../planning/listOfPerticipants";
import { toast } from "react-toastify";

const TnDAttendanceSave = () => {
  interface LocationState {
    data?: any;
  }

  const dispatch = useDispatch();
  const location = useLocation<LocationState>();
  const history = useHistory();
  const data = location?.state?.data;

  const [loading, setLoading] = useState(false);
  const [perticipantField, setperticipantField] = useState<any>([]);
  const empDepartmentDDL = useApiRequest([]);
  const positionDDL = useApiRequest([]);

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

  const [form] = Form.useForm();
  const params = useParams<{ type: string }>();
  const { type } = params;
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
      title: "Department",
      dataIndex: "department",
    },
    {
      title: "HR Position",
      dataIndex: "hrPosition",
      width: 50,
    },
    {
      title: "workplaceGroup",
      dataIndex: "workplaceGroup",
      width: 50,
    },
    {
      title: "workplace",
      dataIndex: "workplace",
    },
    {
      title: "Attendance",
      dataIndex: "action",
      render: (_: any, rec: any) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title="View">
            <Checkbox
              style={{ color: "green", fontSize: "14px", cursor: "pointer" }}
              onChange={() => {}}
            ></Checkbox>
          </Tooltip>
        </Flex>
      ),
      align: "center",
      width: 120,
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
            title={`Attendance Tracker`}
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
              <Col md={6} sm={24}>
                <PInput
                  type="date"
                  name="attendanceDate"
                  label="Attendance Date"
                  placeholder="Attendance Date"
                  onChange={(value) => {
                    form.setFieldsValue({
                      attendanceDate: value,
                    });
                  }}
                />
              </Col>
            </Row>
          </PCardBody>
          <PCardBody>
            <ListOfPerticipants
              form={form}
              perticipantField={perticipantField}
              setperticipantField={setperticipantField}
              addHandler={addHanderForPerticipant}
              // calculatePerPersonCost={calculatePerPersonCost}
              departmentDDL={empDepartmentDDL?.data || []}
              positionDDL={positionDDL?.data || []}
            />{" "}
          </PCardBody>
        </PCard>
      </PForm>
    </div>
  );
};

export default TnDAttendanceSave;
