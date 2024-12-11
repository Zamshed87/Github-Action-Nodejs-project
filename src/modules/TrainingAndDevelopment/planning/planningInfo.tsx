import React, { useEffect, useState } from "react";
import { Checkbox, Col, Form, Row, Tooltip } from "antd";
import { DataTable, Flex, PButton, PInput, PSelect } from "Components";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { getEnumData } from "common/api/commonApi";
const PlanningInfo = ({
  form,
  getBUnitDDL,
  workplaceGroup,
  getWorkplace,
  workplace,
  getEmployeDepartment,
  getEmployeePosition,
  setTrainingDuration,
  trainingTypeDDL,
  setOpenTraingTypeModal,
  setOpenTrainingTitleModal,
  trainingTitleDDL,
  trainingTime,
  setTrainingTime,
  addHandler,
}: any) => {
  const [trainingModeStatusDDL, setTrainingModeStatusDDL] = useState<any>([]);
  const [trainingOrganizerTypeDDL, setTrainingOrganizerTypeDDL] = useState<any>(
    []
  );
  const [trainingStatusDDL, setTrainingStatusDDL] = useState<any>([]);

  useEffect(() => {
    getEnumData("TrainingModeStatus", setTrainingModeStatusDDL);
    getEnumData("TrainingOrganizerType", setTrainingOrganizerTypeDDL);
    getEnumData("TrainingStatus", setTrainingStatusDDL);
  }, []);

  const header = [
    {
      title: "SL",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Start Date",
      dataIndex: "trainingStartDate",
      width: 80,
    },
    {
      title: "Start Time",
      dataIndex: "trainingStartTime",
    },
    {
      title: "End Time",
      dataIndex: "trainingEndTime",
      width: 50,
    },
    {
      title: "Duration",
      dataIndex: "trainingDuration",
      width: 50,
    },
    {
      title: "Action",
      dataIndex: "status",
      render: (_: any, rec: any) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title="Delete">
            <DeleteOutlined
              style={{
                color: "red",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                const updatedperticipantField = trainingTime.filter(
                  (item: any) => item.id !== rec.id
                );
                setTrainingTime(updatedperticipantField);
              }}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
      width: 40,
    },
  ];

  const calculateTotalDuration = () => {
    let totalMinutes = 0;

    trainingTime.forEach((item: any) => {
      const [hoursStr, minutesStr] = item.trainingDuration
        .split(" ")
        .filter((_: any, index: number) => index % 2 === 0);
      const hours = parseInt(hoursStr);
      const minutes = parseInt(minutesStr);
      totalMinutes += hours * 60 + minutes;
    });

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return `${totalHours} hours ${remainingMinutes} minutes`;
  };

  const isMultipleDayTraining = Form.useWatch("isMultipleDayTraining", form);

  return (
    <>
      <Row gutter={[10, 2]} style={{ marginBottom: "20px" }}>
        <Col md={6} sm={12} xs={24}>
          <PSelect
            options={getBUnitDDL?.data?.length > 0 ? getBUnitDDL?.data : []}
            name="bUnit"
            label="Business Unit"
            showSearch
            filterOption={true}
            placeholder="Business Unit"
            onChange={(value, op) => {
              form.setFieldsValue({
                bUnit: op,
              });
            }}
            rules={[{ required: true, message: "Business Unit is required" }]}
          />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <PSelect
            options={workplaceGroup?.data || []}
            name="workplaceGroup"
            label="Workplace Group"
            placeholder="Workplace Group"
            onChange={(value, op) => {
              form.setFieldsValue({
                workplaceGroup: op,
                workplace: undefined,
              });
              getWorkplace();
            }}
            rules={[{ required: true, message: "Workplace Group is required" }]}
          />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <PSelect
            options={workplace?.data || []}
            name="workplace"
            label="Workplace"
            placeholder="Workplace"
            // disabled={+id ? true : false}
            onChange={(value, op) => {
              form.setFieldsValue({
                workplace: op,
              });
              getEmployeDepartment();
              getEmployeePosition();

              //   getDesignation();
            }}
            rules={[{ required: true, message: "Workplace is required" }]}
          />
        </Col>

        <Col md={6} sm={12} xs={24}>
          <PSelect
            options={trainingTypeDDL || []}
            name="trainingType"
            label={
              <>
                Training Type{" "}
                <PlusCircleOutlined
                  onClick={() => {
                    setOpenTraingTypeModal(true);
                  }}
                  style={{
                    color: "green",
                    fontSize: "15px",
                    cursor: "pointer",
                    margin: "0 5px",
                  }}
                />
              </>
            }
            placeholder="Training Type"
            onChange={(value, op) => {
              form.setFieldsValue({
                trainingType: op,
              });
            }}
            rules={[
              {
                required: true,
                message: "Training Type is required",
              },
            ]}
          />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <PSelect
            options={trainingTitleDDL || []}
            name="trainingTitle"
            label={
              <>
                Training Title{" "}
                <PlusCircleOutlined
                  onClick={() => {
                    setOpenTrainingTitleModal(true);
                  }}
                  style={{
                    color: "green",
                    fontSize: "15px",
                    cursor: "pointer",
                    margin: "0 5px",
                  }}
                />
              </>
            }
            placeholder="Training Title"
            onChange={(value, op) => {
              form.setFieldsValue({
                trainingTitle: op,
              });
            }}
            rules={[
              {
                required: true,
                message: "Training Title is required",
              },
            ]}
          />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <PSelect
            options={trainingModeStatusDDL || []}
            name="trainingMode"
            label="Training Mode"
            placeholder="Training Mode"
            onChange={(value, op) => {
              form.setFieldsValue({
                trainingMode: op,
              });
            }}
            rules={[
              {
                required: true,
                message: "Training Mode is required",
              },
            ]}
          />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <PSelect
            options={trainingOrganizerTypeDDL || []}
            name="trainingOrganizer"
            label="Training Organizer"
            placeholder="Training Organizer"
            onChange={(value, op) => {
              form.setFieldsValue({
                trainingOrganizer: op,
              });
            }}
            rules={[
              {
                required: true,
                message: "Training Organizer is required",
              },
            ]}
          />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <PSelect
            options={trainingStatusDDL || []}
            name="trainingStatus"
            label="Training Status"
            placeholder="Training Status"
            onChange={(value, op) => {
              form.setFieldsValue({
                trainingStatus: op,
              });
            }}
            rules={[
              {
                required: true,
                message: "Training Status is required",
              },
            ]}
          />
        </Col>
        <Col md={6} sm={24}>
          <PInput
            type="text"
            placeholder="Objectives/ Key Learnings/ Outcomes"
            label="Objectives/ Key Learnings/ Outcomes"
            name="objectives"
            rules={[
              {
                required: true,
                message: "Objectives/ Key Learnings/ Outcomes is required",
              },
            ]}
          />
        </Col>
        <Col md={6} sm={24}>
          <PInput
            type="text"
            placeholder="Training Vanue"
            label="Training Vanue"
            name="trainingVanue"
            rules={[
              {
                required: true,
                message: "Training Vanue is required",
              },
            ]}
          />
        </Col>

        {/* <Col md={6} sm={24}>
        <PInput
          disabled={true}
          type="text"
          placeholder="Training Duration"
          label="Training Duration"
          name="trainingDuration"
        />
      </Col> */}
      </Row>
      <Row gutter={[10, 2]}>
        <Col md={4} sm={24} style={{ marginTop: "10px" }}>
          <Form.Item name="isMultipleDayTraining" valuePropName="checked">
            <Checkbox>Multiple Days Training?</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[10, 2]}>
        <Col md={6} sm={24}>
          <PInput
            type="date"
            name="trainingStartDate"
            label="Training Start Date"
            placeholder="Training Start Date"
            onChange={(value) => {
              form.setFieldsValue({
                trainingStartDate: value,
              });
              setTrainingDuration(form);
            }}
            rules={[
              {
                required: true,
                message: "Training Start Date is required",
              },
            ]}
          />
        </Col>
        <Col md={6} sm={24}>
          <PInput
            type="time"
            name="trainingStartTime"
            label="Training Start Time"
            placeholder="Training Start Time"
            format="h:mm:ss A"
            onChange={(value) => {
              form.setFieldsValue({
                trainingStartTime: value,
              });
              setTrainingDuration(form);
            }}
            rules={[
              {
                required: true,
                message: "Training Start Time is required",
              },
            ]}
          />
        </Col>

        {/* <Col md={6} sm={24}>
          <PInput
            type="date"
            name="trainingEndDate"
            label="Training End Date"
            placeholder="Training End Date"
            onChange={(value) => {
              form.setFieldsValue({
                trainingEndDate: value,
              });
              setTrainingDuration(form);
            }}
            rules={[
              {
                required: true,
                message: "Training End Date is required",
              },
            ]}
          />
        </Col> */}
        <Col md={6} sm={24}>
          <PInput
            type="time"
            name="trainingEndTime"
            label="Training End Time"
            placeholder="Training End Time"
            format="h:mm:ss A"
            onChange={(value) => {
              form.setFieldsValue({
                trainingEndTime: value,
              });
              setTrainingDuration(form);
            }}
            rules={[
              {
                required: true,
                message: "Training End Time is required",
              },
            ]}
          />
        </Col>
        <Col md={6} sm={24}>
          <PInput
            type="text"
            placeholder="Training Duration"
            label="Training Duration"
            disabled={true}
            name="trainingDuration"
            rules={[
              {
                required: true,
                message: "Training Duration is required",
              },
            ]}
          />
        </Col>
        {isMultipleDayTraining && (
          <Col md={6} sm={24}>
            <PButton
              style={{ marginTop: "22px" }}
              type="primary"
              content="Add"
              onClick={() => {
                const values = form.getFieldsValue(true);
                addHandler(values);
              }}
            />
          </Col>
        )}
      </Row>
      {trainingTime?.length > 0 && (
        <Flex justify="flex-end" align="flex-start" className="mr-2 mt-4">
          <h1>Total Training Duration: {calculateTotalDuration()}</h1>
        </Flex>
      )}
      {trainingTime?.length > 0 && (
        <div className="mb-3 mt-2">
          <DataTable
            bordered
            data={trainingTime || []}
            loading={false}
            header={header}
          />
        </div>
      )}
    </>
  );
};

export default PlanningInfo;
