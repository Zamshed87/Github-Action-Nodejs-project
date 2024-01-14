import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { yearDDLAction } from "utility/yearDDL";
import { dateFormatter, dateFormatterForInput } from "utility/dateFormatter";
import moment from "moment";
import { todayDate } from "utility/todayDate";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) {
  const dispatch = useDispatch();
  // const debounce = useDebounce();
  const getFiscalDDL = useApiRequest({});
  const getBankDDL = useApiRequest({});
  const getSingleData = useApiRequest({});
  const saveTaxChallanConfig = useApiRequest({});

  const { orgId, buId, employeeId, intUrlId, wgId, wId, intAccountId } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  const [loading, setLoading] = useState(false);

  // states
  const [isOpen, setIsOpen] = useState(false);
  const [attachmentList, setAttachmentList] = useState([]);

  // ddls
  useEffect(() => {
    getFiscalDDL.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "fiscalYearDDL",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
      },
    });
    getBankDDL.action({
      urlKey: "GetAllBankWallet",
      method: "GET",

      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strBankWalletName;
          res[i].value = item?.intBankWalletId;
        });
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wgId]);
  // Pages Start From Here code from above will be removed soon

  // Form Instance
  const [form] = Form.useForm();

  // submit
  const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
    const cb = () => {
      resetForm();
      setIsAddEditForm(false);
      getData();
    };
    let payload = {
      intTaxChallanConfigId: singleData?.intTaxChallanConfigId || 0,
      intYear: values?.intYear?.value,
      dteFiscalFromDate: values?.dteFiscalFromDate,
      dteFiscalToDate: values?.dteFiscalToDate,
      strCircle: values?.strCircle,
      strZone: values?.strZone,
      strChallanNo: values?.strChallanNo,
      strBankName: values?.bankName?.label,
      intBankId: values?.bankName?.value,
      intAccountId: orgId,
      intFiscalYearId: values?.fiscalYearRange?.value,
      intActionBy: singleData?.intActionBy || employeeId,
      intCreatedBy: singleData?.intCreatedBy || employeeId,
      intUpdatedBy: singleData?.intTaxChallanConfigId ? employeeId : 0,
      dteChallanDate: values?.dteChallanDate,
      dteCreatedAt: singleData?.dteCreatedAt || todayDate(),
    };

    saveTaxChallanConfig.action({
      urlKey: "SaveTaxChallanConfig",
      method: "POST",
      payload: payload,
      onSuccess: () => {
        cb();
      },
    });
  };
  useEffect(() => {
    if (singleData?.intTaxChallanConfigId) {
      // getLeaveTypeById(setSingleData, id, setLoading);
      form.setFieldsValue({
        ...singleData,
        intYear: { label: singleData?.intYear, value: singleData?.intYear },
        fiscalYearRange: {
          label: singleData?.strFiscalYearDateRange,
          value: singleData?.intFiscalYearId,
        },
        bankName: {
          label: singleData?.strBankName,
          value: singleData?.intBankId,
        },
        dteChallanDate: moment(singleData?.dteChallanDate),
        dteFiscalFromDate: moment(singleData?.dteFiscalFromDate),
        dteFiscalToDate: moment(singleData?.dteFiscalToDate),
      });
    }
  }, [singleData]);
  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          const values = form.getFieldsValue(true);
          submitHandler({
            values,
            getData,
            resetForm: form.resetFields,
            setIsAddEditForm,
            isEdit,
          });
        }}
        initialValues={{}}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PSelect
              options={yearDDLAction(5, 100)}
              name="intYear"
              label="Year"
              filterOption={true}
              placeholder="Year"
              onChange={(value, op) => {
                form.setFieldsValue({
                  intYear: op,
                });
              }}
              rules={[{ required: true, message: "Year is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={getFiscalDDL?.data?.length > 0 ? getFiscalDDL?.data : []}
              name="fiscalYearRange"
              label="Fiscal Year Range"
              showSearch
              filterOption={true}
              placeholder="Fiscal Year Range"
              onChange={(value, op) => {
                form.setFieldsValue({
                  fiscalYearRange: op,
                });
              }}
              rules={[
                { required: true, message: "Fiscal Year Range is required" },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="date"
              format={"YYYY-MM-DD"}
              name="dteFiscalFromDate"
              label="From Date"
              placeholder="From Date"
              rules={[{ required: true, message: "From Date is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="date"
              format={"YYYY-MM-DD"}
              name="dteFiscalToDate"
              label="To Date"
              placeholder="To Date"
              rules={[{ required: true, message: "To Date is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strCircle"
              label="Circle"
              placeholder="Circle"
              rules={[{ required: true, message: "Circle is required" }]}
            />
          </Col>{" "}
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strZone"
              label="Zone"
              placeholder="Zone"
              rules={[{ required: true, message: "Zone is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strChallanNo"
              label="Challan Number"
              placeholder="Challan Number"
              rules={[
                { required: true, message: "Challan Number is required" },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="date"
              format={"YYYY-MM-DD"}
              name="dteChallanDate"
              label="Challan Date"
              placeholder="Challan Date"
              rules={[{ required: true, message: "Challan Date is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={getBankDDL?.data?.length > 0 ? getBankDDL?.data : []}
              name="bankName"
              label="Bank Name"
              showSearch
              filterOption={true}
              placeholder="Bank Name"
              onChange={(value, op) => {
                form.setFieldsValue({
                  bankName: op,
                });
              }}
              rules={[{ required: true, message: "Year is required" }]}
            />
          </Col>
        </Row>
        <ModalFooter
          onCancel={() => {
            setId("");

            setIsAddEditForm(false);
          }}
          submitAction="submit"
          loading={loading}
        />
      </PForm>
    </>
  );
}

// import { Close } from "@mui/icons-material";
// import { IconButton } from "@mui/material";
// import { Modal } from "react-bootstrap";
// import React, { useEffect } from "react";
// import Loading from "../../../common/loading/Loading";
// import DefaultInput from "../../../common/DefaultInput";
// import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
// import useAxiosPost from "../../../utility/customHooks/useAxiosPost";
// import FormikSelect from "../../../common/FormikSelect";
// import { customStyles } from "../../../utility/selectCustomStyle";
// import { useFormik } from "formik";
// import * as yup from "yup";
// import {
//   onCreateTaxChallanConfig,
//   onGetTaxChallanById,
//   // yearToYearDDL,
// } from "./helper";
// import { shallowEqual, useSelector } from "react-redux";
// import { todayDate } from "../../../utility/todayDate";
// import { yearDDLAction } from "../../../utility/yearDDL";
// const initialState = {
//   intTaxChallanConfigId: null,
//   year: null,
//   fiscalYearRange: null,
//   fromDate: null,
//   toDate: null,
//   circle: null,
//   zone: null,
//   challanNumber: null,
//   bankName: null,
//   dteChallanDate: null,
//   dteCreatedAt: todayDate(),
//   dteUpdatedAt: todayDate(),
// };

// const TaxChallanConfigCreate = ({
//   show,
//   onHide,
//   size,
//   backdrop,
//   classes,
//   fullscreen,
//   title,
//   taxChallanId,
// }) => {
//   const { wgId, buId } = useSelector(
//     (state) => state?.auth?.profileData,
//     shallowEqual
//   );
//   const { profileData } = useSelector((state) => state?.auth, shallowEqual);
//   const [, getTaxChallanInfo, loadingOnGetTaxChallanInfo] = useAxiosGet();
//   const {
//     values,
//     setValues,
//     handleSubmit,
//     errors,
//     touched,
//     setFieldValue,
//     resetForm,
//   } = useFormik({
//     initialValues: initialState,
//     enableReinitialize: true,
//     validationSchema,
//     onSubmit: (formValues) => {
//       onCreateTaxChallanConfig(
//         formValues,
//         profileData,
//         createTaxChallanConfig,
//         onHide,
//         resetForm
//       );
//     },
//   });
//   const [fiscalYearDDL, getFiscalYearDDL, loadingOnGetFiscalDDL] =
//     useAxiosGet();
//   const [bankDDL, getBankDDL, loadingOnGetBankDDL, setBankDDL] = useAxiosGet();
//   useEffect(() => {
//     if (show) {
//       getBankDDL("/MasterData/GetAllBankWallet", (response) => {
//         const modfiedBankDDL = response.map((item) => ({
//           label: item?.strBankWalletName,
//           value: item?.intBankWalletId,
//         }));
//         setBankDDL(modfiedBankDDL);
//       });
//       getFiscalYearDDL(
//         `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=fiscalYearDDL&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}`
//       );
//     }

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [show]);
//   useEffect(() => {
//     if (taxChallanId) {
//       onGetTaxChallanById(getTaxChallanInfo, taxChallanId, setValues);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [taxChallanId]);

//   const [, createTaxChallanConfig, loadingOnCreateTaxChallanConfig] =
//     useAxiosPost();
//   return (
//     <>
//       {(loadingOnGetBankDDL ||
//         loadingOnGetFiscalDDL ||
//         loadingOnCreateTaxChallanConfig ||
//         loadingOnGetTaxChallanInfo) && <Loading />}
//       <div className="viewModal">
//         <Modal
//           show={show}
//           onHide={onHide}
//           size={size}
//           backdrop={backdrop}
//           aria-labelledby="example-modal-sizes-title-xl"
//           className={classes}
//           fullscreen={fullscreen && fullscreen}
//         >
//           <form onSubmit={handleSubmit}>
//             <Modal.Header className="bg-custom">
//               <div className="d-flex w-100 justify-content-between align-items-center">
//                 <Modal.Title className="text-center">{title}</Modal.Title>
//                 <div>
//                   <IconButton
//                     onClick={() => {
//                       onHide();
//                       resetForm();
//                     }}
//                   >
//                     <Close />
//                   </IconButton>
//                 </div>
//               </div>
//             </Modal.Header>

//             <Modal.Body id="example-modal-sizes-title-xl">
//               <div className="businessUnitModal">
//                 <div className="modalBody pt-1 px-0">
//                   <div className="row mx-0">
//                     <div className="col-6">
//                       <label>Year</label>
//                       <FormikSelect
//                         name="year"
//                         options={yearDDLAction(5, 100) || []}
//                         value={values?.year}
//                         placeholder="Year"
//                         onChange={(valueOption) => {
//                           setFieldValue("year", valueOption);
//                         }}
//                         styles={customStyles}
//                         errors={errors}
//                         touched={touched}
//                       />
//                     </div>
//                     <div className="col-6">
//                       <label>Fiscal Year Range</label>
//                       <FormikSelect
//                         name="fiscalYearRange"
//                         options={fiscalYearDDL || []}
//                         value={values?.fiscalYearRange}
//                         label=""
//                         onChange={(valueOption) => {
//                           setFieldValue("fiscalYearRange", valueOption);
//                         }}
//                         menuPosition="fixed"
//                         placeholder=" "
//                         styles={customStyles}
//                         errors={errors}
//                         touched={touched}
//                       />
//                     </div>
//                     <div className="col-6">
//                       <label>From Date</label>
//                       <DefaultInput
//                         value={values?.fromDate}
//                         name="fromDate"
//                         type="date"
//                         className="form-control"
//                         max={values?.toDate}
//                         onChange={(e) => {
//                           setFieldValue("fromDate", e.target.value);
//                         }}
//                         errors={errors}
//                         touched={touched}
//                         placeholder=" "
//                         classes="input-sm"
//                       />
//                     </div>
//                     <div className="col-6">
//                       <label>To Date</label>
//                       <DefaultInput
//                         value={values?.toDate}
//                         name="toDate"
//                         type="date"
//                         min={values?.fromDate}
//                         className="form-control"
//                         onChange={(e) => {
//                           setFieldValue("toDate", e.target.value);
//                         }}
//                         errors={errors}
//                         touched={touched}
//                         placeholder=" "
//                         classes="input-sm"
//                       />
//                     </div>

//                     <div className="col-6">
//                       <label>Circle</label>
//                       <DefaultInput
//                         value={values?.circle}
//                         name="circle"
//                         type="text"
//                         className="form-control"
//                         onChange={(e) => {
//                           setFieldValue("circle", e.target.value);
//                         }}
//                         errors={errors}
//                         touched={touched}
//                         placeholder=" "
//                         classes="input-sm"
//                       />
//                     </div>
//                     <div className="col-6">
//                       <label>Zone</label>
//                       <DefaultInput
//                         value={values?.zone}
//                         name="zone"
//                         type="text"
//                         className="form-control"
//                         onChange={(e) => {
//                           setFieldValue("zone", e.target.value);
//                         }}
//                         errors={errors}
//                         touched={touched}
//                         placeholder=" "
//                         classes="input-sm"
//                       />
//                     </div>
//                     <div className="col-6">
//                       <label>Challan Number</label>
//                       <DefaultInput
//                         value={values?.challanNumber}
//                         name="challanNumber"
//                         type="text"
//                         className="form-control"
//                         onChange={(e) => {
//                           setFieldValue("challanNumber", e.target.value);
//                         }}
//                         errors={errors}
//                         touched={touched}
//                         placeholder=" "
//                         classes="input-sm"
//                       />
//                     </div>
//                     <div className="col-6">
//                       <label>Challan Date</label>
//                       <DefaultInput
//                         value={values?.dteChallanDate}
//                         name="dteChallanDate"
//                         type="date"
//                         className="form-control"
//                         onChange={(e) => {
//                           setFieldValue("dteChallanDate", e.target.value);
//                         }}
//                         errors={errors}
//                         touched={touched}
//                         placeholder=" "
//                         classes="input-sm"
//                       />
//                     </div>
//                     <div className="col-6">
//                       <label>Bank Name</label>
//                       <FormikSelect
//                         name="bankName"
//                         options={bankDDL}
//                         value={values?.bankName}
//                         menuPosition="fixed"
//                         onChange={(valueOption) => {
//                           setFieldValue("bankName", valueOption);
//                         }}
//                         placeholder=" "
//                         styles={customStyles}
//                         errors={errors}
//                         touched={touched}
//                         isDisabled={false}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Modal.Body>
//             <Modal.Footer className="form-modal-footer">
//               <button
//                 className="btn btn-cancel"
//                 type="button"
//                 sx={{
//                   marginRight: "15px",
//                 }}
//                 onClick={() => {
//                   resetForm();
//                   onHide();
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="btn btn-green btn-green-disable"
//                 style={{ width: "auto" }}
//                 type="button"
//                 onClick={handleSubmit}
//               >
//                 Save
//               </button>
//             </Modal.Footer>
//           </form>
//         </Modal>
//       </div>
//     </>
//   );
// };

// export default TaxChallanConfigCreate;
