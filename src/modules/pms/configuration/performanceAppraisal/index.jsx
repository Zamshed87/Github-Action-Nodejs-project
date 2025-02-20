import { Col, Form } from "antd";
import Loading from "common/loading/Loading";
import { PButton, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import CommonForm from "modules/pms/CommonForm/commonForm";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { levelOfLeaderApiCall } from "../evaluationCriteria/helper";
import PerformanceAppraisalTable from "./PerformanceAppraisalTable";
import { SaveOutlined } from "@ant-design/icons";

const PerformanceAppraisal = ({ modal, setModal, data, cb }) => {
  // redux
  const { permissionList, profileData } = useSelector(
    (state) => state?.auth,
    shallowEqual
  );

  const { buId, wgId, wId, orgId, intAccountId } = profileData;
  const dispatch = useDispatch();
  const firstSegment = location.pathname.split("/")[1];
  const [loading, setLoading] = useState(false);
  const [levelofLeaderShip, setLevelofLeaderShip] = useState([]);
  const [userGrp, getUserGrp, loadingUserGrp, setUserGrp] = useAxiosGet([]);
  const [performanceAppraisal, setPerformanceAppraisal] = useState([]);

  let permission = {};
  permissionList.forEach((item) => {
    permission = item;
  });
  const CommonEmployeeDDL = useApiRequest([]);

  const [form] = Form.useForm();
  const params = useParams();
  const { type } = params;

  const doUserGrp = () => {
    const api = `/Auth/GetAllUserGroupByAccountId?PageNo=1&PageSize=125&searchTxt=`;
    getUserGrp(api, (res) => {
      const list = [];
      res?.data?.forEach((item, i) => {
        list.push({
          label: item?.strUserGroup,
          value: item?.intUserGroupHeaderId,
        });
      });
      setUserGrp(list);
    });
  };

  const getEmployee = (value) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: profileData?.buId,
        workplaceGroupId: profileData?.wgId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };

  const addHandler = (values) => {
    // const isDuplicate = performanceAppraisal.some(
    //   (org) => org.idx === values?.stakeholder?.label
    // );

    // if (isDuplicate) {
    //   toast.error("Stakeholder already exists");
    //   return;
    // }

    setPerformanceAppraisal([
      ...performanceAppraisal,
      {
        idx: values?.scoreWeight + performanceAppraisal?.length,
        stakeholderName: values?.stakeholder?.label,
        stakeholderId: values?.stakeholder?.value,
        stakeholderTypeName: values?.stakeholderType?.label,
        stakeholderTypeId: values?.stakeholderType?.value,
        scoreWeight: values?.scoreWeight,
      },
    ]);
    // form.resetFields(["stakeholder", "stakeholderType", "scoreWeight"]);
  };

  const formFields = [
    {
      type: "number",
      label: "Mark Start",
      varname: "markStart",
      placeholder: "Mark Start",
      rules: [{ required: true, message: "Mark Start is required!" }],
      col: 3,
    },
    {
      type: "number",
      label: "Mark End",
      varname: "markEnd",
      placeholder: "Mark End",
      rules: [{ required: true, message: "Mark End is required!" }],
      col: 3,
    },
    {
      type: "text",
      label: "Grade Name",
      varname: "gradeName",
      placeholder: "Grade Name",
      col: 3,
      rules: [{ required: true, message: "Grade Name is required!" }],
    },
    {
      type: "number",
      label: "Cola (%)",
      varname: "cola",
      placeholder: "Cola (%)",
      rules: [{ required: true, message: "Cola (%) is required!" }],
      col: 3,
    },
    {
      type: "number",
      label: "Appraisal (%)",
      varname: "appraisal",
      placeholder: "Appraisal (%)",
      rules: [{ required: true, message: "Appraisal (%) is required!" }],
      col: 3,
    },
    {
      type: "text",
      label: "Comments",
      varname: "comments",
      placeholder: "Comments",
      col: 3,
    },
  ];

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    levelOfLeaderApiCall(intAccountId, setLevelofLeaderShip, setLoading, true); // Call the API
  }, []);

  return permission?.isCreate ? (
    <div>
      {loading && <Loading />}
      <PForm
        form={form}
        initialValues={
          {
            // leadership: data?.levelOfLeadershipName,
            // positionGroupId: data?.levelOfLeadershipId,
            // kpiScore: data?.percentageOfKPI,
            // barScore: data?.percentageOfBAR,
            // id: data?.scoreScaleId,
          }
        }
      >
        <PCard>
          <PCardHeader
            buttonList={[
              {
                type: "primary",
                content: "Save",
                icon: <SaveOutlined />,
                onClick: () => {},
              },
            ]}
          />
          <PCardBody>
            <CommonForm formConfig={formFields} form={form}>
              <Col md={6} sm={24}>
                <PButton
                  style={{ marginTop: "22px" }}
                  type="primary"
                  content={"Add"}
                  onClick={() => {
                    const values = form.getFieldsValue(true);
                    form
                      .validateFields()
                      .then(() => {
                        const values = form.getFieldsValue(true);

                        addHandler(values);
                      })
                      .catch(() => {});
                  }}
                />
              </Col>
            </CommonForm>
          </PCardBody>
        </PCard>
      </PForm>
      {performanceAppraisal.length > 0 && (
        <PerformanceAppraisalTable
          data={performanceAppraisal}
          setPerformanceAppraisal={setPerformanceAppraisal}
        />
      )}
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default PerformanceAppraisal;
