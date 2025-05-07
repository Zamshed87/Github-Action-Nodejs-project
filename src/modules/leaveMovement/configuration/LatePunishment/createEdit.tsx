import { Col, DatePicker, Form } from "antd";
import Loading from "common/loading/Loading";
import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
} from "Components";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import CommonForm from "modules/pms/CommonForm/commonForm";
import {
  addHandler,
  createEditLatePunishmentConfig,
  LatePunishment,
} from "./helper";
import { getPeopleDeskAllDDL } from "common/api";
import { useApiRequest } from "Hooks";
import { getSerial } from "Utils";
import { DataState } from "./type";
import RangeDatePicker from "./RangeDatePicker";

const CreateEditLatePunishmentConfig = () => {
  const [form] = Form.useForm();
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [data, setData] = useState<DataState>([]);
  const employmentTypeDDL = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);

  const params = useParams();
  // redux
  const { profileData } = useSelector(
    (state: { auth: { profileData: any } }) => state?.auth,
    shallowEqual
  );
  const { permissionList } = useSelector(
    (store: { auth: { permissionList: any[] } }) => store?.auth,
    shallowEqual
  );

  const { buId, wgId, wId, orgId, intAccountId, employeeId } = profileData;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  type Permission = {
    isCreate?: boolean;
    [key: string]: any;
  };

  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30590),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getEmployeDepartment = () => {
    const { workplace } = form.getFieldsValue(true);

    empDepartmentDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDepartment",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.DepartmentName;
          res[i].value = item?.DepartmentId;
        });
      },
    });
  };
  const getEmployeDesignation = () => {
    const { workplace } = form.getFieldsValue(true);

    empDesignationDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDesignation",
        AccountId: orgId,
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.DesignationName;
          res[i].value = item?.DesignationId;
        });
      },
    });
  };

  const getEmploymentType = () => {
    const { workplace } = form.getFieldsValue(true);

    employmentTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmploymentType",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.EmploymentType;
          res[i].value = item?.Id;
        });
      },
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Late Punishment";
    () => {
      document.title = "PeopleDesk";
    };
    // have a need new useEffect to set the title

    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${employeeId}`,
      "intWorkplaceId",
      "strWorkplace",
      setWorkplaceDDL
    );
  }, [wgId]);

  const header = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: 1,
          pageSize: 100,
          index,
        }),
      fixed: "left",
      align: "center",
      width: 30,
    },
    {
      title: "Late Calculation Type",
      dataIndex: "lateCalculationType",
      fixed: "left",
    },
    {
      title: "Each Day Count by",
      dataIndex: "eachDayCountBy",
      fixed: "left",
    },
    {
      title: "Day Range",
      dataIndex: "dayRange",
      fixed: "left",
    },
    {
      title: "Is Consecutive Day?",
      dataIndex: "isConsecutiveDay",
      render: (rec: any) => {
        return rec ? "Yes" : "No";
      },
    },
    {
      title: "Late Time (Minutes)",
      dataIndex: "lateTimeMinutes",
      render: (value: any, rec: any) => {
        return (
          rec?.minimumLateTime + " to " + rec?.maximumLateTime + " Minutes"
        );
      },
    },
    {
      title: "Late Time Calculated by",
      dataIndex: "lateTimeCalculatedBy",
    },
    {
      title: "Punishment Type",
      dataIndex: "punishmentType",
    },
    {
      title: "Leave Deduct Type",
      dataIndex: "leaveDeductType",
    },
    {
      title: "Leave Deduct Qty",
      dataIndex: "leaveDeductQty",
    },
    {
      title: "Amount Deduct Type",
      dataIndex: "amountDeductType",
    },
    {
      title: "Amount Deduct",
      dataIndex: "amountDeduct",
    },
    {
      title: "% of Amount (Based on 1 day)",
      dataIndex: "percentOfAmount",
    },
  ];

  const lateCalculationType = Form.useWatch("lateCalculationType", form);
  const punishmentType = Form.useWatch("punishmentType", form);
  const leaveDeductType = Form.useWatch("leaveDeductType", form);
  const amountDeductFrom = Form.useWatch("amountDeductFrom", form);

  return permission?.isCreate ? (
    <div>
      {loading && <Loading />}
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            backButton
            title={`Late Punishment Configuration`}
            buttonList={[
              {
                type: "primary",
                content: "Save",
                // icon:
                //   type === "create" ? <SaveOutlined /> : <EditOutlined />,
                onClick: () => {
                  // const values = form.getFieldsValue(true);

                  form
                    .validateFields()
                    .then(() => {
                      createEditLatePunishmentConfig(
                        profileData,
                        form,
                        data,
                        setLoading,
                        () => {}
                      );
                    })
                    .catch(() => {});
                },
              },
            ]}
          />
          <PCardBody>
            {" "}
            <CommonForm
              formConfig={LatePunishment(
                workplaceDDL,
                getEmploymentType,
                getEmployeDepartment,
                getEmployeDesignation,
                employmentTypeDDL?.data,
                empDepartmentDDL?.data,
                empDesignationDDL?.data,
                <RangeDatePicker name={"dayRange"} />,
                {
                  lateCalculationType,
                  punishmentType,
                  leaveDeductType,
                  amountDeductFrom,
                }
              )}
              form={form}
            >
              {/* Add appropriate children here */}
              <Col md={6} sm={24}>
                <PButton
                  style={{ marginTop: "22px" }}
                  type="primary"
                  content={"Add"}
                  onClick={() => {
                    form
                      .validateFields()
                      .then(() => {
                        const values = form.getFieldsValue(true);
                        addHandler(setData, data, values);
                      })
                      .catch(() => {});
                  }}
                />
              </Col>
            </CommonForm>
          </PCardBody>
        </PCard>
        <DataTable
          bordered
          data={data || []}
          scroll={{ x: 1500 }}
          loading={false}
          header={header}
        />
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default CreateEditLatePunishmentConfig;
