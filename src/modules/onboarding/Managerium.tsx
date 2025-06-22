import { Col, Form, Row, Switch } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useApiRequest } from "Hooks";
import moment from "moment";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { PCard, PCardBody, PCardHeader, PForm, PInput } from "Components";
import { monthFirstDate, monthLastDate } from "utility/dateFormatter";
import Loading from "common/loading/Loading";

import { toast } from "react-toastify";

// import ViewModal from "common/ViewModal";
// import ViewForm from "./ViewForm";

export const ManageriumOnBoarding = () => {
  // hook
  const dispatch = useDispatch();

  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  // menu permission
  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30617) {
      employeeFeature = item;
    }
  });

  // Form Instance
  const [form] = Form.useForm();
  const landingApi = useApiRequest({});
  const saveApi = useApiRequest({});

  const landingApiCall = () => {
    landingApi.action({
      urlKey: "ManageriumIntregationGetByAccountId",
      method: "GET",
      onSuccess: (data) => {
        form.setFieldsValue({
          strURL: data?.strURL || "",
          strToken: data?.strToken || "",
          strSeed: data?.strSeed || "",
          isActive: data?.isActive ? true : false,
        });
      },
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Managerium Onboarding";
    return () => {
      document.title = "Peopledesk";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    landingApiCall();
    // getWorkplaceDetails(wId, setBuDetails);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return employeeFeature?.isView ? (
    <>
      <PForm
        layout="horizontal"
        labelCol={{ span: 2 }}
        // wrapperCol={{ span: 10 }}
        form={form}
        initialValues={{
          fromDate: moment(monthFirstDate()),
          toDate: moment(monthLastDate()),
        }}
        onFinish={() => {
          landingApiCall();
        }}
      >
        <PCard>
          {(landingApi?.loading || saveApi?.loading) && <Loading />}
          <PCardHeader
            title="Managerium Onboarding"
            buttonList={[
              {
                type: "primary",
                content: "Save",
                onClick: () => {
                  if (employeeFeature?.isCreate) {
                    const payload = form.getFieldsValue(true);
                    saveApi?.action({
                      urlKey: "ManageriumIntregation",
                      method: "POST",
                      payload,
                      onSuccess: (data) => {
                        toast.success(data?.message[0] || "Saved Successfully");
                        landingApiCall();
                      },
                      onError: (err: any) => {
                        toast.error(
                          err?.response?.data?.message[0] ||
                            "Something went wrong"
                        );
                        landingApiCall();
                      },
                      toast: true,
                    });
                  } else {
                    toast.warn("You don't have permission");
                  }
                },
              },
            ]}
          />
          <PCardBody className="mb-3" styles={{ marginTop: "15px" }}>
            <Row gutter={[10, 2]} style={{ marginLeft: "-35px" }}>
              <Col md={20} sm={12} xs={24}>
                <PInput
                  type="text"
                  name="strURL"
                  label="URL"
                  placeholder="URL"
                  rules={[{ required: true, message: "Url is required" }]}
                />
              </Col>
              <Col md={20} sm={12} xs={24}>
                <PInput
                  type="text"
                  name="strToken"
                  label="Token"
                  placeholder="Token"
                  rules={[{ required: true, message: "Token is required" }]}
                />
              </Col>
              <Col md={20} sm={12} xs={24}>
                <PInput
                  type="text"
                  name="strSeed"
                  label="Seed"
                  placeholder="Seed"
                  rules={[{ required: true, message: "Seed is required" }]}
                />
              </Col>
              <Col md={20} sm={12} xs={24}>
                <div
                  className=""
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="input-main position-group-select "
                    // style={{ margin: "3rem 0 0 0.7rem" }}
                    style={{ margin: "-1.3rem 0 0 2.5rem" }}
                  >
                    <h6 className="title-item-name">Status</h6>
                  </div>
                  <div
                    style={{
                      margin: "0 0 0 .5rem",
                    }}
                  >
                    <Form.Item name="isActive" valuePropName="checked">
                      <Switch
                        checkedChildren="Active"
                        unCheckedChildren="In Active"
                      />
                    </Form.Item>
                  </div>
                </div>
              </Col>
              <Col
                style={{
                  marginTop: "23px",
                }}
              >
                {/* <PButton type="primary" action="submit" content="View" /> */}
              </Col>
            </Row>
          </PCardBody>
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};
