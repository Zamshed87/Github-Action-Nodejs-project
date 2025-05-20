import { Col, Form, Tooltip } from "antd";
import Loading from "common/loading/Loading";
import {
  DataTable,
  Flex,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
} from "Components";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { DeleteOutlined } from "@mui/icons-material";
import { getPeopleDeskAllDDL } from "common/api";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useApiRequest } from "Hooks";
import CommonForm from "modules/pms/CommonForm/commonForm";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { getSerial } from "Utils";
import { DataState } from "../type";
import View from "./components/view";
import { GratuityPolicyForm } from "./form";
import { addHandler, createEditLatePunishmentConfig } from "./helper";

const GPCreateViewEdit = () => {
  const [form] = Form.useForm();
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [data, setData] = useState<DataState>([]);

  const employmentTypeDDL = useApiRequest([]);

  useAxiosGet();
  const [
    gratuityPolicy,
    getgratuityPolicy,
    gratuityPolicyLoader,
    setgratuityPolicy,
  ] = useAxiosGet();
  const params = useParams<{ type?: string; id?: string }>() as {
    type?: string;
    id?: string;
  };
  const history = useHistory();

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

  const getEmploymentType = () => {
    form.setFieldsValue({
      employmentType: undefined,
    });
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
    if (params?.type === "extend" || params?.type === "view") {
      getgratuityPolicy(`/LatePunishmentpolicy/${params?.id}`, (data: any) => {
        // Populate the form with the fetched data
        // form.setFieldsValue({
        //   lateCalculationType: data?.name,
        // });

        setData(data?.elements || []); // need to modify
      });
    }

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
      title: "Service Length (Month)",
      dataIndex: "",
      render: (value: any, rec: any) => {
        return (
          rec?.serviceLengthStart + " to " + rec?.serviceLengthEnd + " Month"
        );
      },
    },
    {
      title: "Gratuity Disbursement Depend On",
      dataIndex: "disbursementDependOnName",
    },
    {
      title: "Gratuity Disbursement (% of Gross/ Basic Salary/ Amount)",
      dataIndex: "numPercentage",
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
                const filterData = data.filter(
                  (item: any) => item.idx !== rec.idx
                );
                setData(filterData);
              }}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
      width: 40,
    },
  ];

  const lateCalculationType = Form.useWatch("lateCalculationType", form);

  return permission?.isCreate ? (
    <div>
      {(loading || gratuityPolicyLoader) && <Loading />}
      <PForm form={form} initialValues={{}}>
        <PCard>
          <PCardHeader
            backButton
            title={`Gratuity Policy`}
            buttonList={
              params?.type !== "view"
                ? [
                    {
                      type: "primary",
                      content: "Save",
                      // icon:
                      //   type === "create" ? <SaveOutlined /> : <EditOutlined />,
                      onClick: () => {
                        form
                          .validateFields([])
                          .then(() => {
                            createEditLatePunishmentConfig(
                              profileData,
                              form,
                              data,
                              setLoading,
                              () => {
                                history.push(
                                  "/administration/latePunishmentPolicy"
                                );
                              }
                            );
                          })
                          .catch(() => {});
                      },
                    },
                  ]
                : []
            }
          />
          {params?.type !== "view" ? (
            <PCardBody>
              {" "}
              <CommonForm
                formConfig={GratuityPolicyForm(
                  workplaceDDL,
                  getEmploymentType,
                  employmentTypeDDL?.data,
                  {
                    lateCalculationType,
                  },
                  form
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
                          addHandler(setData, data, form);
                        })
                        .catch(() => {});
                    }}
                  />
                </Col>
              </CommonForm>
            </PCardBody>
          ) : (
            <PCardBody>
              <View data={gratuityPolicy} />
            </PCardBody>
          )}
        </PCard>
        {data?.length > 0 && (
          <DataTable
            bordered
            data={data || []}
            // scroll={{ x: 1500 }}
            loading={false}
            header={header}
          />
        )}
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default GPCreateViewEdit;
