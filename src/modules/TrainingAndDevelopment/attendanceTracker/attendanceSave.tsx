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

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
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
              calculatePerPersonCost={calculatePerPersonCost}
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
