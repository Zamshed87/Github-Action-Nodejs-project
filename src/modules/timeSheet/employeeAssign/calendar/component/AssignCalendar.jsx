import { DeleteOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Col, Form, Row, Tag, Tooltip } from "antd";
import { isDevServer } from "App";
import IConfirmModal from "common/IConfirmModal";
import { PButton, PForm, PInput, PSelect } from "Components";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { isUniq } from "utility/uniqChecker";
import { rosterGenerateAction } from "../helper";
const ifPrevousDateSelected = (date) => {
  const selectedDate = new Date(date);
  const currentDate = new Date();
  const selectedMonth = selectedDate.getMonth(); // getMonth() returns month index (0-11)
  const currentMonth = currentDate.getMonth();
  const selectedYear = selectedDate.getFullYear();
  const currentYear = currentDate.getFullYear();
  if (
    selectedYear < currentYear ||
    (selectedYear === currentYear && selectedMonth < currentMonth)
  ) {
    return true;
  }
  return false;
};
export const AssignModal = ({
  setIsAddEditForm,
  getData,
  empIDString,
  setCheckedList,
  checked,
  singleData,
  setSingleData,
  isAssignAll,
}) => {
  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [tableData, setTableData] = useState([]);
  const [, setLoading] = useState(false);

  const [isPrevousDate, setIsPrevousDate] = useState(false);
  const setter = (payload) => {
    if (isUniq("intCalendarId", payload?.intCalendarId, tableData)) {
      setTableData([...tableData, payload]);
    }
  };

  const remover = (payload) => {
    const filterArr = tableData.filter((itm) => itm.intCalendarId !== payload);
    setTableData(filterArr);
  };
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tableData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTableData(items);
  };
  const saveHandler = (values, cb) => {
    if (values?.calenderType?.value === 1 && tableData.length === 0)
      return toast.warn("Please add calendar");

    const modifyFilterRowDto =
      singleData.length > 0 ? [singleData[0]?.employeeId] : empIDString;

    const payload = {
      employeeList: isAssignAll
        ? modifyFilterRowDto
        : modifyFilterRowDto?.join(","),
      generateStartDate: moment(values?.generateDate).format("YYYY-MM-DD"),
      intCreatedBy: employeeId,
      // runningCalendarId:
      //   values?.calenderType?.value === 2
      //     ? values?.startingCalender?.value
      //     : values?.calender?.value,
      // calendarType: values?.calenderType?.label,
      nextChangeDate:
        moment(values?.nextChangeDate).format("YYYY-MM-DD") || null,
      // runningCalendarId: tableData?.[0]?.intCalendarId || 0,
      runningCalendarId:
        values?.calenderType?.value === 2
          ? values?.startingCalender?.value
          : tableData?.[0]?.intCalendarId,
      calendarType: values?.calenderType?.label || "",
      strCalendarName: tableData?.[0]?.strCalendarName || "",
      rosterGroupId:
        values?.calenderType?.value === 2 ? values?.calender?.value : 0,
      generateEndDate: values?.generateEndDate
        ? moment(values?.generateEndDate).format("YYYY-MM-DD")
        : null,
      isAutoGenerate: false,
      // extendedEmployeeCalendarList: tableData.slice(1) || [],
      extendedEmployeeCalendarList: tableData,
    };
    if (
      values?.calenderType?.value === 1 &&
      orgId === 6 &&
      (checked?.length > 1 || isAssignAll)
    ) {
      demoPopup(() => {
        rosterGenerateAction(payload, setLoading, cb);
      });
    } else {
      rosterGenerateAction(payload, setLoading, cb);
    }
  };

  const [form] = Form.useForm();

  const CommonCalendarDDL = useApiRequest([]);

  const ddlApi = useApiRequest({});
  const startingCalendarApi = useApiRequest({});

  const getDDL = () => {
    const values = form.getFieldsValue(true);
    ddlApi.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: values?.calenderType?.value === 1 ? "Calender" : "RosterGroup",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
      },
      onSuccess: (res) => {
        res?.forEach((item, i) => {
          res[i].value =
            values?.calenderType?.value === 1
              ? item.CalenderId
              : item.RosterGroupId;
          res[i].label =
            values?.calenderType?.value === 1
              ? item.CalenderName
              : item.RosterGroupName;
        });
      },
    });
  };

  useEffect(() => {
    getDDL();
  }, [buId, wgId]);
  const getCalendarDefault = () => {
    CommonCalendarDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "MultiCalendarByEmployeeIdDDL",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: checked[0]?.employeeId,
      },
      onSuccess: (res) => {
        isDevServer && console.log("res", res);
        // res.forEach((item, i) => {
        //   res[i].label = item?.strCalendarName;
        //   res[i].value = item?.intCalendarId;
        // });
        setTableData([
          // {
          //   strCalendarName: checked[0]?.calendarName,
          //   intCalendarId: checked[0]?.calendarAssignId,
          // },
          ...res,
        ]);
      },
    });
  };
  useEffect(() => {
    if (checked?.length === 1 && !isAssignAll && orgId === 6) {
      getCalendarDefault();
    }
  }, [checked, isAssignAll]);
  const demoPopup = (cb) => {
    const confirmObject = {
      closeOnClickOutside: false,
      message: `There might be multiple calendar assigned to these employees
Are you sure ? You want to assign Calendar again?
`,
      yesAlertFunc: () => {
        cb();
      },
      noAlertFunc: () => null,
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          const values = form.getFieldsValue(true);

          saveHandler(values, () => {
            setCheckedList([]);
            setSingleData([]);
            getData();
            setTableData([]);
            form.resetFields();
            setIsAddEditForm(false);
          });
        }}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PInput
              type="date"
              name="generateDate"
              label="Generate From Date"
              placeholder="Generate From Date"
              rules={[
                { required: true, message: "Generate From Date is required" },
              ]}
              onChange={(value) => {
                if (
                  ifPrevousDateSelected(moment(value)?.format("YYYY-MM-DD"))
                ) {
                  setIsPrevousDate(true);
                } else {
                  setIsPrevousDate(false);
                }
                form.setFieldsValue({
                  generateDate: value,
                  generateEndDate: moment(value)?.endOf("month"),
                });
              }}
            />
          </Col>
          {isPrevousDate && (
            <Col md={12} sm={24}>
              <PInput
                type="date"
                name="generateEndDate"
                label="Generate End Date"
                placeholder="Generate End Date"
                rules={[
                  {
                    required: isPrevousDate,
                    message: "Generate End Date is required",
                  },
                ]}
                onChange={(value) => {
                  form.setFieldsValue({
                    generateEndDate: value,
                  });
                }}
              />
            </Col>
          )}
        </Row>
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PSelect
              options={[
                {
                  value: 1,
                  label: "Calendar",
                },
                { value: 2, label: "Roster" },
              ]}
              name="calenderType"
              label="Calender Type"
              placeholder="Calender Type"
              onChange={(value, op) => {
                form.setFieldsValue({
                  calenderType: op,
                  calender: undefined,
                  nextChangeDate: undefined,
                  startingCalender: undefined,
                });
                getDDL();
                setTableData([]);
              }}
              rules={[
                {
                  required: true,
                  message: "Calender Type is required",
                },
              ]}
            />
          </Col>
        </Row>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const { calenderType, calender } = form.getFieldsValue(true);

            return (
              <>
                <Row gutter={[10, 2]}>
                  <Col md={12} sm={24}>
                    <PSelect
                      options={ddlApi?.data?.length > 0 ? ddlApi?.data : []}
                      name="calender"
                      label={
                        calenderType?.value === 2
                          ? `Roster Name`
                          : `Calendar Name`
                      }
                      placeholder={
                        calenderType?.value === 2
                          ? `Roster Name`
                          : `Calendar Name`
                      }
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          calender: op,
                        });
                        calenderType?.value === 2 &&
                          startingCalendarApi.action({
                            urlKey: "PeopleDeskAllDDL",
                            method: "GET",
                            params: {
                              DDLType: "CalenderByRosterGroup",
                              intId: value,
                              BusinessUnitId: buId,
                              WorkplaceGroupId: wgId,
                              //   IntWorkplaceId: wId,
                            },
                            onSuccess: (res) => {
                              res?.forEach((item, i) => {
                                res[i].value = item.CalenderId;
                                res[i].label = item.CalenderName;
                              });
                            },
                          });
                      }}
                      rules={[
                        {
                          required:
                            (tableData.length === 0 &&
                              calenderType?.value === 1) ||
                            calenderType?.value === 2,
                          message: `${
                            calenderType?.value === 1
                              ? "Calendar Name is required"
                              : "Roster Name is required"
                          }`,
                        },
                      ]}
                    />
                  </Col>
                  {calenderType?.value === 1 && (
                    <Col style={{ marginTop: "20px" }}>
                      <PButton
                        type="primary"
                        action="button"
                        content={"Add"}
                        // icon={<PlusOutlined />}
                        onClick={() => {
                          const obj = {
                            intAutoId: 0,
                            intEmployeeId: employeeId || 0,
                            intCalendarId: calender?.value || 0,
                            strCalendarName: calender?.label || "",
                          };

                          // if (intAccountId === 6) {
                          //   setter(obj);
                          // } else {
                          const existingItems = tableData;
                          if (existingItems.length === 0) {
                            setter(obj);
                          } else {
                            toast.warn(
                              "You are allowed to add only one calendar name."
                            );
                          }
                          // }

                          form.setFieldsValue({ calender: undefined });
                        }}
                        disabled={!calender}
                      />
                    </Col>
                  )}
                </Row>
                <Row gutter={[10, 2]}>
                  {calenderType?.value === 2 && (
                    <Col md={12} sm={24}>
                      <PSelect
                        options={
                          startingCalendarApi?.data?.length > 0
                            ? startingCalendarApi?.data
                            : []
                        }
                        name="startingCalender"
                        label="Starting Calendar"
                        onChange={(value, op) => {
                          form.setFieldsValue({
                            startingCalender: op,
                          });
                        }}
                        rules={[
                          {
                            required: calenderType?.value === 2,
                            message: "Starting Calendar is required",
                          },
                        ]}
                      />
                    </Col>
                  )}
                  {calenderType?.value === 2 && (
                    <Col md={12} sm={24}>
                      <PInput
                        type="date"
                        name="nextChangeDate"
                        label="Next Calendar Change"
                        placeholder="Next Calendar Change"
                        rules={[
                          {
                            required: calenderType?.value === 2,
                            message: "Next Calendar Change is required",
                          },
                        ]}
                        onChange={(value) => {
                          form.setFieldsValue({
                            nextChangeDate: value,
                          });
                        }}
                      />
                    </Col>
                  )}
                </Row>
                <Row gutter={[10, 2]}>
                  {calenderType?.value === 1 && (
                    <Col md={24} sm={24}>
                      <div className="table-card-body pt-3">
                        <div
                          className="table-card-styled tableOne"
                          style={{ padding: "0px " }}
                        >
                          <table className="table align-middle">
                            <thead style={{ color: "#212529" }}>
                              <tr>
                                <th>
                                  <div className="d-flex align-items-center">
                                    Calendar name
                                  </div>
                                </th>
                                <th>
                                  <div className="d-flex align-items-center justify-content-end">
                                    Action
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            {console.log("tableData", tableData)}
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                              <Droppable droppableId="tableData">
                                {(provided) => (
                                  <tbody
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                  >
                                    {tableData?.length > 0 &&
                                      tableData.map((item, index) => {
                                        const {
                                          strCalendarName,
                                          intCalendarId,
                                        } = item;

                                        return (
                                          <Draggable
                                            key={intCalendarId}
                                            draggableId={String(intCalendarId)}
                                            index={index}
                                          >
                                            {(provided) => (
                                              <tr
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                              >
                                                <td>
                                                  {index === 0 ? (
                                                    <>
                                                      {strCalendarName}{" "}
                                                      <Tag
                                                        color="green"
                                                        style={{
                                                          borderRadius: "16px",
                                                          padding: "0 8px",
                                                        }}
                                                      >
                                                        Default
                                                      </Tag>
                                                    </>
                                                  ) : (
                                                    strCalendarName
                                                  )}
                                                </td>
                                                <td>
                                                  <div className="d-flex align-items-end justify-content-end">
                                                    <IconButton
                                                      type="button"
                                                      style={{
                                                        height: "25px",
                                                        width: "25px",
                                                      }}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        remover(intCalendarId);
                                                      }}
                                                    >
                                                      <Tooltip title="Delete">
                                                        <DeleteOutlined
                                                          sx={{
                                                            height: "25px",
                                                            width: "25px",
                                                          }}
                                                        />
                                                      </Tooltip>
                                                    </IconButton>
                                                  </div>
                                                </td>
                                              </tr>
                                            )}
                                          </Draggable>
                                        );
                                      })}
                                    {provided.placeholder}
                                  </tbody>
                                )}
                              </Droppable>
                            </DragDropContext>
                          </table>
                        </div>
                      </div>
                    </Col>
                  )}
                </Row>
              </>
            );
          }}
        </Form.Item>

        <ModalFooter
          onCancel={() => {
            setIsAddEditForm(false);
            getData();
            setCheckedList([]);
            form.resetFields();
            setTableData([]);
            setSingleData([]);
          }}
          submitAction="submit"
          //loading={loading}
        />
      </PForm>
    </>
  );
};
