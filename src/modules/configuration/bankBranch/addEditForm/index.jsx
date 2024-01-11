import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { Switch } from "antd";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { todayDate } from "utility/todayDate";
import moment from "moment";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) {
  // const debounce = useDebounce();
  const getDistrictDDL = useApiRequest({});
  const getBankDDL = useApiRequest({});
  const saveBankBranch = useApiRequest({});

  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  // states

  // ddls
  useEffect(() => {
    getDistrictDDL.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        id: singleData?.intBusinessUnitId,
        DDLType: "District",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.DistrictName;
          res[i].value = item?.DistrictId;
        });
      },
    });

    getBankDDL.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Bank",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.BankName;
          res[i].value = item?.BankID;
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
      intBankBranchId: singleData?.intBankBranchId
        ? singleData?.intBankBranchId
        : 0,
      strBankBranchCode: values?.strBankBranchCode,
      strBankBranchName: values?.strBankBranchName,
      strBankBranchAddress: values?.strBankBranchAddress,
      intAccountId: orgId,
      intDistrictId: values?.district?.value,
      intCountryId: 18,
      intBankId: values?.bank?.value,
      strBankName: values?.bank?.label,
      strBankShortName: singleData?.intBankBranchId
        ? singleData?.strBankShortName
        : values?.bank?.BankShortName,
      strBankCode: singleData?.intBankBranchId
        ? singleData?.strBankCode
        : values?.bankName?.BankCode,
      strRoutingNo: values?.strRoutingNo,
      isActive: values?.isActive,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
    };

    saveBankBranch.action({
      urlKey: "CreateBankBranch",
      method: "POST",
      payload: payload,
      onSuccess: () => {
        cb();
      },
    });
  };
  useEffect(() => {
    if (singleData?.intBankBranchId) {
      form.setFieldsValue({
        ...singleData,
        bank: {
          value: singleData?.intBankId,
          label: singleData?.strBankName,
        },
        district: {
          value: singleData?.intDistrictId,
          label: singleData?.strDistrict,
        },
        strBankBranchCode: moment(singleData?.strBankBranchCode),
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
            <PInput
              type="text"
              name="strBankBranchName"
              label="Branch Name"
              placeholder="Branch Name"
              rules={[{ required: true, message: "Branch Name is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="date"
              name="strBankBranchCode"
              label="Branch Code"
              placeholder="Branch Code"
              rules={[{ required: true, message: "Branch Code is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strBankBranchAddress"
              label="Branch Address"
              placeholder="Branch Address"
              rules={[
                { required: true, message: "Branch Address is required" },
              ]}
            />
          </Col>

          <Col md={12} sm={24}>
            <PSelect
              options={
                getDistrictDDL?.data?.length > 0 ? getDistrictDDL?.data : []
              }
              name="district"
              label="District"
              showSearch
              filterOption={true}
              placeholder="District"
              onChange={(value, op) => {
                form.setFieldsValue({
                  district: op,
                });
              }}
              rules={[{ required: true, message: "District is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={getBankDDL?.data?.length > 0 ? getBankDDL?.data : []}
              name="bank"
              label="Bank"
              showSearch
              filterOption={true}
              placeholder="Bank"
              onChange={(value, op) => {
                form.setFieldsValue({
                  bank: op,
                });
              }}
              rules={[{ required: true, message: "Bank is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strRoutingNo"
              label="Routing No"
              placeholder="Routing No"
              rules={[
                { required: true, message: "Routing No is required" },
                { min: 9, message: "Routing No must be minimum 9 characters." },
              ]}
            />
          </Col>
          {isEdit && (
            <Col
              md={24}
              style={{
                marginLeft: "-0.5rem",
              }}
            >
              <div
                className=""
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  className="input-main position-group-select "
                  style={{ margin: "3rem 0 0 0.7rem" }}
                >
                  <h6 className="title-item-name">Bank Branch Activation</h6>
                  <p className="subtitle-p">
                    Activation toggle indicates to the particular Bank Branch
                    status (Active/Inactive)
                  </p>
                </div>
                <div
                  style={{
                    margin: "4rem 0 -1.5rem -2rem",
                    // padding: "5rem -2rem 0 -15rem",
                  }}
                >
                  <Form.Item name="isActive" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </div>
              </div>
            </Col>
          )}
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

// const validationSchema = Yup.object().shape({
//   bankName: Yup.object()
//     .shape({
//       label: Yup.string().required("Bank Name is required"),
//       value: Yup.string().required("Bank Name is required"),
//     })
//     .typeError("Bank Name Type is required"),
//   bankBranchCode: Yup.date().required("Branch Code is required"),
//   bankBranchName: Yup.string().required("Branch Name is required"),
//   district: Yup.object()
//     .shape({
//       label: Yup.string().required("District Name is required"),
//       value: Yup.string().required("District Name is required"),
//     })
//     .typeError("District Name Type is required"),
//   bankBranchAddress: Yup.string().required("Branch Address is required"),
//   routingNumber: Yup.string()
//     .min(9, "Minimum 9 numbers")
//     .required("Routing number is required"),
// });

// export default function AddEditFormComponent({
//   id,
//   setId,
//   show,
//   onHide,
//   size,
//   backdrop,
//   classes,
//   isVisibleHeading = true,
//   fullscreen,
//   title,
//   getLandingData,
// }) {
//   const [, createBankBranch, loading1] = useAxiosPost();
//   const [singleData, getSingleData, loading2] = useAxiosGet();
//   const [bankDDL, setBankDDL] = useState([]);
//   const [districtDDL, setDistrictDDL] = useState([]);
//   const [modifySingleData, setModifySingleData] = useState("");

//   const { employeeId, orgId, wgId, buId } = useSelector(
//     (state) => state?.auth?.profileData,
//     shallowEqual
//   );
//   useEffect(() => {
//     getPeopleDeskAllDDL(
//       `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Bank&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}`,
//       "BankID",
//       "BankName",
//       setBankDDL
//     );
//     getPeopleDeskAllDDL(
//       `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=District&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}`,
//       "DistrictId",
//       "DistrictName",
//       setDistrictDDL
//     );
//   }, [wgId]);

//   const getSingleDataValues = () => {
//     getSingleData(
//       `/SaasMasterData/BankBranchLandingById?IntBankBranchId=${id}`
//     );
//   };

//   useEffect(() => {
//     if (id) {
//       getSingleDataValues();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   useEffect(() => {
//     if (id) {
//       const newRowData = {
//         bankName: {
//           label: singleData?.strBankName || "",
//           value: singleData?.intBankId || "",
//         },
//         district: {
//           label: singleData?.strDistrict || "",
//           value: singleData?.intDistrictId || "",
//         },
//         bankBranchCode: singleData?.strBankBranchCode || "",
//         bankBranchAddress: singleData?.strBankBranchAddress || "",
//         bankBranchName: singleData?.strBankBranchName || "",
//         routingNumber: singleData?.strRoutingNo || "",
//         isActive: singleData?.isActive || false,
//       };
//       setModifySingleData(newRowData);
//     }
//   }, [id, singleData]);

//   const saveHandler = () => {
//     let payload = {
//       intBankBranchId: !id ? 0 : id,
//       strBankBranchCode: values?.bankBranchCode,
//       strBankBranchName: values?.bankBranchName,
//       strBankBranchAddress: values?.bankBranchAddress,
//       intAccountId: orgId,
//       intDistrictId: values?.district?.value,
//       intCountryId: 18,
//       intBankId: values?.bankName?.value,
//       strBankName: values?.bankName?.label,
//       strBankShortName: !id
//         ? values?.bankName?.BankShortName
//         : singleData?.strBankShortName,
//       strBankCode: !id ? values?.bankName?.BankCode : singleData?.strBankCode,
//       strRoutingNo: values?.routingNumber,
//       isActive: values?.isActive,
//       dteCreatedAt: todayDate(),
//       intCreatedBy: employeeId,
//       dteUpdatedAt: todayDate(),
//       intUpdatedBy: employeeId,
//     };

//     const callback = () => {
//       if (id) {
//         getSingleDataValues();
//         resetForm(modifySingleData);
//       } else {
//         resetForm(initialValues);
//       }
//       // For landing page data
//       getLandingData();
//       onHide();
//     };

//     createBankBranch(`/Employee/CreateBankBranch`, payload, callback, true);
//   };

//   const { setFieldValue, values, errors, touched, handleSubmit, resetForm } =
//     useFormik({
//       enableReinitialize: true,
//       validationSchema,
//       initialValues: id ? modifySingleData : initialValues,
//       onSubmit: () => {
//         saveHandler();
//       },
//     });

//   return (
//     <>
//       {(loading1 || loading2) && <Loading />}
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
//             {isVisibleHeading && (
//               <Modal.Header className="bg-custom">
//                 <div className="d-flex w-100 justify-content-between align-items-center">
//                   <Modal.Title className="text-center">{title}</Modal.Title>
//                   <div>
//                     <IconButton
//                       onClick={() => {
//                         if (id) {
//                           resetForm(modifySingleData);
//                         } else {
//                           resetForm(initialValues);
//                         }
//                         setId(null);
//                         onHide();
//                       }}
//                     >
//                       <Close />
//                     </IconButton>
//                   </div>
//                 </div>
//               </Modal.Header>
//             )}

//             <Modal.Body id="example-modal-sizes-title-xl">
//               <div className="businessUnitModal">
//                 <div className="modalBody" style={{ padding: "0px 12px" }}>
//                   <div className="row mx-0">
//                     <div className="col-lg-6 pl-0">
//                       <div className="input-field">
//                         <label htmlFor=""> Branch Name </label>
//                         <DefaultInput
//                           classes="input-sm"
//                           type="text"
//                           value={values?.bankBranchName}
//                           name="bankBranchName"
//                           onChange={(e) => {
//                             setFieldValue("bankBranchName", e.target.value);
//                           }}
//                           placeholder=""
//                           errors={errors}
//                           touched={touched}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-lg-6 pr-0">
//                       <div className="input-field">
//                         <label htmlFor=""> Branch Code </label>
//                         <DefaultInput
//                           classes="input-sm"
//                           type="text"
//                           value={values?.bankBranchCode}
//                           name="bankBranchCode"
//                           onChange={(e) => {
//                             setFieldValue("bankBranchCode", e.target.value);
//                           }}
//                           placeholder=""
//                           errors={errors}
//                           touched={touched}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-lg-6 pl-0">
//                       <div className="input-field">
//                         <label htmlFor=""> Branch Address</label>
//                         <DefaultInput
//                           classes="input-sm"
//                           type="text"
//                           value={values?.bankBranchAddress}
//                           name="bankBranchAddress"
//                           onChange={(e) => {
//                             setFieldValue("bankBranchAddress", e.target.value);
//                           }}
//                           errors={errors}
//                           touched={touched}
//                           placeholder=""
//                         />
//                       </div>
//                     </div>
//                     <div className="col-lg-6 pr-0">
//                       <div className="input-field-main">
//                         <label>District</label>
//                         <FormikSelect
//                           name="district"
//                           options={districtDDL}
//                           value={values?.district}
//                           onChange={(valueOption) => {
//                             setFieldValue("district", valueOption);
//                           }}
//                           placeholder=""
//                           styles={customStyles}
//                           errors={errors}
//                           touched={touched}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-lg-6 pl-0">
//                       <div className="input-field-main">
//                         <label>Bank</label>
//                         <FormikSelect
//                           name="bankName"
//                           options={bankDDL}
//                           value={values?.bankName}
//                           onChange={(valueOption) => {
//                             setFieldValue("bankName", valueOption);
//                           }}
//                           placeholder=""
//                           styles={customStyles}
//                           errors={errors}
//                           touched={touched}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-lg-6 pr-0">
//                       <div className="input-field">
//                         <label htmlFor=""> Routing Number </label>
//                         <DefaultInput
//                           classes="input-sm"
//                           type="number"
//                           value={values?.routingNumber}
//                           name="routingNumber"
//                           onChange={(e) => {
//                             if (
//                               e.target.value > 0 &&
//                               e.target.value.length < 10
//                             ) {
//                               setFieldValue("routingNumber", e.target.value);
//                             } else {
//                               setFieldValue("routingNumber", "");
//                             }
//                           }}
//                           placeholder=""
//                           errors={errors}
//                           touched={touched}
//                         />
//                       </div>
//                     </div>
//                     {!!id && (
//                       <div className="col-12 px-0">
//                         <div className="input-main position-group-select mt-2">
//                           <h6 className="title-item-name">
//                             Bank Branch Activation
//                           </h6>
//                           <p className="subtitle-p">
//                             Activation toggle indicates to the particular Bank
//                             Branch status (Active/Inactive)
//                           </p>
//                           <FormikToggle
//                             name="isActive"
//                             color={values?.isActive ? greenColor : blackColor40}
//                             checked={values?.isActive}
//                             onChange={(e) => {
//                               setFieldValue("isActive", e.target.checked);
//                             }}
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </Modal.Body>
//             <Modal.Footer className="form-modal-footer">
//               <button
//                 disabled={loading1}
//                 type="button"
//                 className="btn btn-cancel"
//                 style={{
//                   marginRight: "15px",
//                 }}
//                 onClick={() => {
//                   if (id) {
//                     resetForm(modifySingleData);
//                   } else {
//                     resetForm(initialValues);
//                   }
//                   setId(null);
//                   onHide();
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="btn btn-green btn-green-disable"
//                 style={{ width: "auto" }}
//                 type="submit"
//                 onSubmit={() => handleSubmit()}
//               >
//                 Save
//               </button>
//             </Modal.Footer>
//           </form>
//         </Modal>
//       </div>
//     </>
//   );
// }
