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
import axios from "axios";
import { toast } from "react-toastify";

const PerformanceAppraisal = ({ modal, setModal, data, cb }) => {
  // redux
  const { permissionList, profileData } = useSelector(
    (state) => state?.auth,
    shallowEqual
  );

  const { buId, wgId, wId, orgId, intAccountId } = profileData;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [performanceAppraisal, setPerformanceAppraisal] = useState([]);
  const [landingData, setLandingData] = useState([]);

  let permission = {};
  permissionList.forEach((item) => {
    permission = item;
  });

  const [form] = Form.useForm();
  const params = useParams();
  const { type } = params;

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
        idx: crypto.randomUUID(),
        markStart: values?.markStart,
        markEnd: values?.markEnd,
        gradeName: values?.gradeName,
        cola: values?.cola,
        appraisal: values?.appraisal,
        comment: values?.comment,
      },
    ]);
    form.resetFields();
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
      varname: "comment",
      placeholder: "Comments",
      col: 3,
    },
  ];

  const handlePerformanceAppraisal = async () => {
    setLoading && setLoading(true);
    const payload = performanceAppraisal?.map((item) => ({
      performanceAppraisalConfigId: item?.performanceAppraisalConfigId || 0,
      markStart: item?.markStart,
      markEnd: item?.markEnd,
      gradeName: item?.gradeName,
      cola: item?.cola,
      appraisal: item?.appraisal,
      comment: item?.comment,
    }));
    try {
      const res = await axios.put(`/PMS/PerformanceAppraisalConfig`, payload);
      cb && cb();
      toast.success(res?.data?.message);
      setLoading && setLoading(false);
      // form.resetFields();
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setLoading && setLoading(false);
    }
  };

  const landingApi = async (
    pagination = {
      current: 1,
      pageSize: 25,
    }
  ) => {
    const res = await axios.get(
      `/PMS/GetAllPerformanceAppraisalConfig?pageNumber=${pagination?.current}&pageSize=${pagination?.pageSize}`
    );
    setLandingData(res?.data);
    const updatedData = res?.data?.data?.map((item) => ({
      ...item,
      idx: item.performanceAppraisalConfigId,
    }));
    setPerformanceAppraisal(updatedData || []);
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    landingApi();
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
                disabled: performanceAppraisal?.length <= 0,
                content: "Save",
                icon: <SaveOutlined />,
                onClick: () => handlePerformanceAppraisal(),
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
          setData={setPerformanceAppraisal}
          landingApiCall={landingApi}
          landingApi={landingData}
        />
      )}
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default PerformanceAppraisal;
