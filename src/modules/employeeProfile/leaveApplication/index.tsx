import { PButton, PCard, PCardHeader, PForm, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import withLeaveApplication from "common/HOCLeave/withLeaveApplication";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Loading from "common/loading/Loading";
import { CommonView } from "common/HOCLeave/component/CommonView";

type TEmLeaveApplication = any;
const EmLeaveApplicationT: React.FC<TEmLeaveApplication> = (props) => {
  // Data From Store
  //   const { orgId, buId, wgId, wId, employeeId } = useSelector(
  //     (state: any) => state?.auth?.profileData,
  //     shallowEqual
  //   );
  const dispatch = useDispatch();

  // States
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Leave Application";
    return () => {
      document.title = "Peopledesk";
    };
  }, []);
  const {
    singleData,
    imageFile,
    leaveHistoryData,
    employeeInfo,
    isEdit,
    leaveTypeDDL,
    leaveBalanceData,
    loading,
    progress,
    loadingForInfo,
    getEmpInfoDetails,
    saveHandler,
    getData,
    setSingleData,
    setImageFile,
    setIsEdit,
    setLeaveHistoryData,
    userName,
    employeeId,
    buId,
    wgId,
    isOfficeAdmin,

    showHistoryBalanceData,
    setShowHistoryBalanceData,
    historyBalanceData,
    // demoPopupForDeleteAdmin,
  } = props?.propjObj;
  // Form Instance
  const [form] = Form.useForm();

  // Api Actions
  const CommonEmployeeDDL = useApiRequest([]);

  // Life Cycle Hooks
  useEffect(() => {
    // const { empSearchType, date, employee } = form.getFieldsValue(true);
    // empSearchType && date && employee();
  }, [buId, wgId]);

  const getEmployee = (value: any) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        // workplaceId: wId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };
  return (
    <PForm
      form={form}
      initialValues={{
        employee: {
          value: loadingForInfo
            ? ""
            : employeeInfo?.[0]?.EmployeeId || employeeId,
          label: loadingForInfo
            ? ""
            : employeeInfo?.[0]?.EmployeeName || userName,
        },
        year: moment().format("YYYY"),
      }}
    >
      {loading && <Loading />}

      <PCard>
        <PCardHeader>
          <Form.Item shouldUpdate noStyle>
            {() => {
              // const { employee, year } = form.getFieldsValue();
              return (
                <Row gutter={[10, 2]} style={{ width: "500px" }}>
                  <Col xs={16}>
                    <PSelect
                      name="employee"
                      placeholder="Search Min 2 char"
                      options={CommonEmployeeDDL?.data || []}
                      loading={CommonEmployeeDDL?.loading}
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          employee: op,
                        });
                        getEmpInfoDetails(value);
                        getData(value);
                      }}
                      onSearch={(value) => {
                        getEmployee(value);
                      }}
                      showSearch
                      filterOption={false}
                    />
                  </Col>
                  <Col xs={8}>
                    <PButton
                      type="primary"
                      action="button"
                      content="Balance History"
                      onClick={() => {
                        setShowHistoryBalanceData(true);
                      }}
                    />
                  </Col>
                </Row>
              );
            }}
          </Form.Item>
        </PCardHeader>
        <Row gutter={[10, 2]} style={{ marginTop: "-5.7rem" }}>
          <CommonView
            loadingForInfo={loadingForInfo}
            progress={progress}
            employeeInfo={employeeInfo}
            saveHandler={saveHandler}
            singleData={singleData}
            form={form}
            imageFile={imageFile}
            setImageFile={setImageFile}
            isEdit={isEdit}
            leaveTypeDDL={leaveTypeDDL}
            leaveBalanceData={leaveBalanceData}
            setLeaveHistoryData={setLeaveHistoryData}
            leaveHistoryData={leaveHistoryData}
            setSingleData={setSingleData}
            setIsEdit={setIsEdit}
            isOfficeAdmin={isOfficeAdmin}
            getData={getData}
            showHistoryBalanceData={showHistoryBalanceData}
            setShowHistoryBalanceData={setShowHistoryBalanceData}
            historyBalanceData={historyBalanceData}
          />

          <Col
            style={{
              marginTop: "23px",
            }}
          ></Col>
        </Row>
      </PCard>
    </PForm>
  );
};

export default withLeaveApplication(EmLeaveApplicationT, true);
