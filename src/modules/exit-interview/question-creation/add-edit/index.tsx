/*
 * Title: Exit interview add and edit
 * Author: Khurshida Meem
 * Date: 12-11-2024
 *
 */

import { Col, Form, Row } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { Flex, PCard, PCardHeader, PForm, PInput, PSelect } from "Components";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getWorkplaceDDL, getWorkplaceGroupDDL } from "common/api/commonApi";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useApiRequest } from "Hooks";
import { SortableList } from "../components";

const QuestionCreationAddEdit = () => {
  // Router state
  const { quesId }: any = useParams();

  // Form Instance
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const { permissionList, profileData, businessUnitDDL } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { orgId } = profileData;

  const addLabelValue = (
    ddlArray: any[],
    labelField: string,
    valueField: string
  ) => {
    return ddlArray.map((item) => ({
      ...item,
      label: item[labelField],
      value: item[valueField],
    }));
  };

  //   states
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([{ id: 1 }, { id: 2 }, { id: 3 }]);

  // menu permission
  let letterConfigPermission: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30440) {
      letterConfigPermission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // api states
  const workplaceGroupDDL: any = useApiRequest([]);
  const workplaceDDL = useApiRequest([]);

  return letterConfigPermission?.isCreate ? (
    <PForm formName="tempCreate" form={form}>
      <PCard>
        <PCardHeader
          title={quesId ? "Edit Question" : "Create Question"}
          backButton={true}
          buttonList={[
            {
              type: "primary",
              content: "Save",
              icon: "plus",
              disabled: loading,
              onClick: () => {
                // const values = form.getFieldsValue(true);
              },
            },
          ]}
        />
        <Row gutter={[10, 2]}>
          <Col md={6} sm={24}>
            <PSelect
              options={
                addLabelValue(
                  businessUnitDDL,
                  "BusinessUnitName",
                  "BusinessUnitId"
                ) || []
              }
              name="buDDL"
              label="Business Unit"
              placeholder="Business Unit"
              onChange={(value: number, op) => {
                form.setFieldsValue({
                  buDDL: op,
                  wgDDL: null,
                  wDDL: null,
                });
                getWorkplaceGroupDDL({
                  workplaceGroupDDL,
                  orgId,
                  buId: value,
                });
              }}
              rules={[{ required: true, message: "Required Field" }]}
            />
          </Col>

          <Col md={6} sm={24}>
            <PSelect
              options={workplaceGroupDDL?.data || []}
              name="wgDDL"
              label="Workplace Group"
              placeholder="Workplace Group"
              onChange={(value, op) => {
                const { buId } = form.getFieldsValue(true);
                form.setFieldsValue({
                  wgDDL: op,
                  wDDL: null,
                });
                getWorkplaceDDL({
                  workplaceDDL,
                  orgId,
                  buId: buId?.value,
                  wgId: value,
                });
              }}
              rules={[{ required: true, message: "Required Field" }]}
            />
          </Col>
          <Col md={6} sm={24}>
            <PSelect
              options={workplaceDDL?.data || []}
              name="wDDL"
              label="Workplace"
              placeholder="Workplace"
              onChange={(value, op) => {
                form.setFieldsValue({
                  wDDL: op,
                });
              }}
              rules={[{ required: true, message: "Required Field" }]}
            />
          </Col>
        </Row>
        <Row gutter={[10, 2]}>
          <Col md={6} sm={24}>
            <PSelect
              options={[]}
              name="survayType"
              label="Survay Type"
              placeholder="Survay Type"
              onChange={(_: number, op) => {
                form.setFieldsValue({
                  survayType: op,
                });
              }}
              rules={[{ required: true, message: "Required Field" }]}
            />
          </Col>

          <Col md={6} sm={24}>
            <PInput
              type="text"
              name="survayTitle"
              placeholder="Survay Title"
              label="Survay Title"
              rules={[{ required: true, message: "Required Field" }]}
            />
          </Col>
          <Col md={6} sm={24}>
            <PInput
              type="text"
              name="survayDescription"
              placeholder="Survay Description"
              label="Survay Description"
              rules={[{ required: true, message: "Required Field" }]}
            />
          </Col>
        </Row>
        <div>
          <SortableList
            items={items}
            onChange={setItems}
            renderItem={(item: any) => (
              <SortableList.Item id={item.id}>
                hi
                <SortableList.DragHandle />
              </SortableList.Item>
            )}
          />
        </div>
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default QuestionCreationAddEdit;
