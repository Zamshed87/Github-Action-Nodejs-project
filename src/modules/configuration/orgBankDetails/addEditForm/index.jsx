import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row, Switch } from "antd";
import { useEffect, useState } from "react";

import { shallowEqual, useSelector } from "react-redux";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) {
  // const debounce = useDebounce();

  const saveOrgBank = useApiRequest({});
  const getBUnitDDL = useApiRequest({});
  const getWGDDL = useApiRequest({});
  const getWDDL = useApiRequest({});
  const getBanksDDL = useApiRequest({});
  const getBranchDDL = useApiRequest({});

  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  // ddls
  useEffect(() => {
    // }&intWorkplaceId=${wId || 0}${year ? `&intYear=${year}` : ""}`
    getBUnitDDL.action({
      urlKey: "BusinessUnitIdAll",
      method: "GET",
      params: {
        accountId: orgId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strBusinessUnit;
          res[i].value = item?.intBusinessUnitId;
        });
      },
    });
    getWGDDL.action({
      urlKey: "WorkplaceGroupIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
    getBanksDDL.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        // id: singleData?.intBusinessUnitId,
        DDLType: "Bank",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        intId: 0,
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
  // states

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
    const payload = {
      intAccountBankDetailsId: !singleData?.intAccountBankDetailsId
        ? 0
        : singleData?.intAccountBankDetailsId,
      intAccountId: orgId,
      intBusinessUnitId: values?.businessUnit?.value,
      strBusinessUnitName: values?.businessUnit?.label,
      intBankOrWalletType: 1,
      intBankWalletId: values?.bankName?.value,
      strBankWalletName: values?.bankName?.label,
      strDistrict: values?.districtName,
      intBankBranchId: values?.branchName?.value,
      strBranchName: values?.branchName?.label,
      strRoutingNo: values?.routingNo,
      strSwiftCode: values?.swiftCode,
      strAccountName: values?.accName,
      strAccountNo: `${values?.accNo}`,
      isActive: values?.isActive,
      intCreatedBy: employeeId,
      intUpdatedBy: employeeId,
      workplaceId: values?.workplace?.value,
      workplaceName: values?.workplace?.label,
      workplaceGroupId: values?.workplaceGroup?.value,
      workplaceGroupName: values?.workplaceGroup?.label,
      strBankAdvice: JSON.stringify(values?.bankAdvice || []),
    };
    saveOrgBank.action({
      urlKey: "AccountBankDetailsCRUD",
      method: "POST",
      payload: payload,
      onSuccess: () => {
        cb();
      },
    });
  };

  useEffect(() => {
    if (singleData?.intAccountBankDetailsId) {
      form.setFieldsValue({
        businessUnit: {
          value: singleData?.intBusinessUnitId,
          label: singleData?.strBusinessUnitName,
        },
        isActive: singleData?.isActive || false,
        bankName: {
          value: singleData?.intBankWalletId,
          label: singleData?.strBankWalletName,
        },
        branchName: {
          value: singleData?.intBankBranchId,
          label: singleData?.strBranchName,
        },
        workplaceGroup: {
          value: singleData?.workplaceGroupId,
          label: singleData?.workplaceGroupName,
        },
        workplace: {
          value: singleData?.workplaceId,
          label: singleData?.workplaceName,
        },
        bankAdvice: JSON.parse(singleData?.strBankAdvice)?.map((itm) => {
          return {
            ...itm,
          };
        }),
        routingNo: singleData?.strRoutingNo,
        districtName: singleData?.strDistrict,
        swiftCode: singleData?.strSwiftCode,
        accName: singleData?.strAccountName,
        accNo: singleData?.strAccountNo,
      });
    }
  }, [singleData]);
  useEffect(() => {
    if (singleData?.intAccountBankDetailsId) {
      getWDDL.action({
        urlKey: "WorkplaceIdAll",
        method: "GET",
        params: {
          accountId: orgId,
          businessUnitId: buId,
          workplaceGroupId: singleData?.workplaceGroupId,
        },
        onSuccess: (res) => {
          res.forEach((item, i) => {
            res[i].label = item?.strWorkplace;
            res[i].value = item?.intWorkplaceId;
          });
        },
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
              options={getBanksDDL?.data?.length > 0 ? getBanksDDL?.data : []}
              name="bankName"
              label="Bank Name"
              showSearch
              filterOption={true}
              placeholder="Bank Name"
              onChange={(value, op) => {
                form.setFieldsValue({
                  bankName: op,
                });
                getBranchDDL.action({
                  urlKey: "BankBranchDDL",
                  method: "GET",
                  params: {
                    BankId: op?.value,
                    WorkplaceGroupId: wgId,
                    BusinessUnitId: buId,
                    intId: 0,
                    AccountID: orgId,
                    DistrictId: 0,
                  },
                  // onSuccess: (res) => {
                  //   res.forEach((item, i) => {
                  //     res[i].label = item?.BankName;
                  //     res[i].value = item?.BankID;
                  //   });
                  // },
                });
              }}
              rules={[{ required: true, message: "Bank Name is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={getBranchDDL?.data?.length > 0 ? getBranchDDL?.data : []}
              name="branchName"
              label="Branch Name"
              showSearch
              filterOption={true}
              placeholder="Branch Name"
              onChange={(value, op) => {
                form.setFieldsValue({
                  branchName: op,
                  routingNo: op?.name,
                });
              }}
              rules={[{ required: true, message: "Branch Name is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="routingNo"
              disabled={true}
              label="Routing No"
              placeholder="Routing No"
              rules={[{ required: true, message: "Routing No is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="swiftCode"
              label="Swift Code"
              placeholder="Swift Code"
              // rules={[{ required: true, message: "Swift Code is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="accName"
              label="Account Name"
              placeholder="Account Name"
              rules={[{ required: true, message: "Account Name is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="accNo"
              label="Account No"
              placeholder="Account No"
              rules={[{ required: true, message: "Account No is required" }]}
            />
          </Col>

          {/* <Form.Item shouldUpdate noStyle>
            {() => {
              const { branchName } = form.getFieldsValue();

              // const empType = employeeType?.label;

              return (
                <>
                  <Col md={12} sm={24}>
                    <PInput
                      type="text"
                      name="strDesignation"
                      label="Designation"
                      placeholder="Designation"
                      rules={[
                        { required: true, message: "Designation is required" },
                      ]}
                    />
                  </Col>
                </>
              );
            }}
          </Form.Item> */}

          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="districtName"
              label="District"
              placeholder="District"
              rules={[{ required: true, message: "District is required" }]}
            />
          </Col>

          <Col md={12} sm={24}>
            <PSelect
              options={getBUnitDDL?.data?.length > 0 ? getBUnitDDL?.data : []}
              name="businessUnit"
              label="Business Unit"
              showSearch
              filterOption={true}
              placeholder="Business Unit"
              onChange={(value, op) => {
                form.setFieldsValue({
                  businessUnit: op,
                });
              }}
              rules={[{ required: true, message: "Business Unit is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={getWGDDL?.data?.length > 0 ? getWGDDL?.data : []}
              name="workplaceGroup"
              label="Workplace Group"
              showSearch
              filterOption={true}
              placeholder="Workplace Group"
              onChange={(value, op) => {
                form.setFieldsValue({
                  workplaceGroup: op,
                });
                getWDDL.action({
                  urlKey: "WorkplaceIdAll",
                  method: "GET",
                  params: {
                    accountId: orgId,
                    businessUnitId: buId,
                    workplaceGroupId: value,
                  },
                  onSuccess: (res) => {
                    res.forEach((item, i) => {
                      res[i].label = item?.strWorkplace;
                      res[i].value = item?.intWorkplaceId;
                    });
                  },
                });
              }}
              rules={[
                { required: true, message: "Workplace Group is required" },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={getWDDL?.data?.length > 0 ? getWDDL?.data : []}
              name="workplace"
              label="Workplace"
              showSearch
              filterOption={true}
              placeholder="Workplace"
              onChange={(value, op) => {
                form.setFieldsValue({
                  workplace: op,
                });
              }}
              rules={[{ required: true, message: "Workplace is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={[
                {
                  value: "IBBL",
                  label: "IBBL",
                },
                {
                  value: "BFTN",
                  label: orgId === 4 ? "City Life" : "BFTN",
                },
                {
                  value: "DBL",
                  label: "DBL",
                },
                {
                  value: "SCB",
                  label: "SCB",
                },
                {
                  value: "CityBank",
                  label: "City Bank",
                },
                {
                  value: "DBBL",
                  label: "DBBL",
                },
                {
                  value: "DigitalPayment",

                  label: "Digital Payment",
                },
              ]}
              name="bankAdvice"
              label="Bank Advice"
              showSearch
              mode="multiple"
              filterOption={true}
              placeholder="Bank Advic"
              onChange={(value, op) => {
                form.setFieldsValue({
                  bankAdvice: op,
                });
              }}
              rules={[{ required: true, message: "Bank Advice is required" }]}
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
                  <h6 className="title-item-name">Organization Activation</h6>
                  <p className="subtitle-p">
                    Activation toggle indicates to the particular Employment
                    Type status (Active/Inactive)
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

//
//   useEffect(() => {
//     getPeopleDeskAllDDL(
//       `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Bank&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
//       "BankID",
//       "BankName",
//       setBankDDL
//     );
//     PeopleDeskSaasDDL(
//       "BusinessUnit",
//       wgId,
//       buId,
//       setBusinessUnitDDL,
//       "intBusinessUnitId",
//       "strBusinessUnit",
//       employeeId
//     );
//   }, [buId, employeeId, wgId]);

//   useEffect(() => {
//     if (singleData?.intAccountBankDetailsId) {
//       const newRowData = {
//         businessUnit: {
//           value: singleData?.intBusinessUnitId,
//           label: singleData?.strBusinessUnitName,
//         },
//         isActive: singleData?.isActive || false,
//         bankName: {
//           value: singleData?.intBankWalletId,
//           label: singleData?.strBankWalletName,
//         },
//         branchName: {
//           value: singleData?.intBankBranchId,
//           label: singleData?.strBranchName,
//         },
//         routingNo: singleData?.strRoutingNo,
//         districtName: singleData?.strDistrict,
//         swiftCode: singleData?.strSwiftCode,
//         accName: singleData?.strAccountName,
//         accNo: singleData?.strAccountNo,
//       };
//       setModifySingleData(newRowData);
//     }
//   }, [singleData]);

//   const saveHandler = () => {
//     const payload = {
//       intAccountBankDetailsId: !singleData?.intAccountBankDetailsId
//         ? 0
//         : singleData?.intAccountBankDetailsId,
//       intAccountId: orgId,
//       intBusinessUnitId: values?.businessUnit?.value,
//       strBusinessUnitName: values?.businessUnit?.label,
//       intBankOrWalletType: 1,
//       intBankWalletId: values?.bankName?.value,
//       strBankWalletName: values?.bankName?.label,
//       strDistrict: values?.districtName,
//       intBankBranchId: values?.branchName?.value,
//       strBranchName: values?.branchName?.label,
//       strRoutingNo: values?.routingNo,
//       strSwiftCode: values?.swiftCode,
//       strAccountName: values?.accName,
//       strAccountNo: values?.accNo,
//       isActive: values?.isActive,
//       intCreatedBy: employeeId,
//       intUpdatedBy: employeeId,
//     };
//     const callback = () => {
//       if (singleData?.intAccountBankDetailsId) {
//         resetForm(modifySingleData);
//         onHide();
//       } else {
//         resetForm(initialValues);
//         onHide();
//       }
//       getLandingData();
//     };
//     createEditBankOrgDetails(payload, setLoading, callback);
//   };

//   // useFormik hooks
//   const { setFieldValue, values, errors, touched, handleSubmit, resetForm } =
//     useFormik({
//       enableReinitialize: true,
//       validationSchema,
//       initialValues: singleData?.intAccountBankDetailsId
//         ? modifySingleData
//         : initialValues,
//       onSubmit: () => saveHandler(),
//     });

//   return (
//     <>
//       {loading && <Loading />}
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
//                         if (singleData?.intAccountBankDetailsId) {
//                           resetForm(modifySingleData);
//                         } else {
//                           resetForm(initialValues);
//                         }
//                         onHide();
//                         setSingleData("");
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
//                 <div className="modalBody pt-1 px-0">
//                   <div className="row mx-0">
//                     <div className="col-6">
//                       <label>Bank Name</label>
//                       <FormikSelect
//                         name="bankName"
//                         options={bankDDL}
//                         value={values?.bankName}
//                         menuPosition="fixed"
//                         onChange={(valueOption) => {
//                           setFieldValue("routingNo", "");
//                           setFieldValue("branchName", "");
//                           setFieldValue("bankName", valueOption);
//                           getBankBranchDDL(
//                             valueOption?.value,
//                             orgId,
//                             0,
//                             setBankBranchDDL
//                           );
//                         }}
//                         placeholder=" "
//                         styles={customStyles}
//                         errors={errors}
//                         touched={touched}
//                         isDisabled={false}
//                       />
//                     </div>
//                     <div className="col-6">
//                       <label>Bank Branch</label>
//                       <FormikSelect
//                         name="branchName"
//                         options={bankBranchDDL}
//                         value={values?.branchName}
//                         menuPosition="fixed"
//                         onChange={(valueOption) => {
//                           setFieldValue("routingNo", valueOption?.name);
//                           setFieldValue("branchName", valueOption);
//                         }}
//                         placeholder=" "
//                         styles={customStyles}
//                         errors={errors}
//                         touched={touched}
//                         isDisabled={!values?.bankName}
//                       />
//                     </div>
//                     <div className="col-6">
//                       <label>Routing No</label>
//                       <DefaultInput
//                         value={values?.routingNo}
//                         disabled={true}
//                         name="routingNo"
//                         type="text"
//                         className="form-control"
//                         onChange={(e) => {
//                           setFieldValue("routingNo", e.target.value);
//                         }}
//                         errors={errors}
//                         touched={touched}
//                         placeholder=" "
//                         classes="input-sm"
//                       />
//                     </div>
//                     <div className="col-6">
//                       <label>Swift Code</label>
//                       <DefaultInput
//                         value={values?.swiftCode}
//                         onChange={(e) => {
//                           setFieldValue("swiftCode", e.target.value);
//                         }}
//                         name="swiftCode"
//                         type="text"
//                         className="form-control"
//                         errors={errors}
//                         touched={touched}
//                         placeholder=" "
//                         classes="input-sm"
//                       />
//                     </div>
//                     <div className="col-6">
//                       <label>Account Name</label>
//                       <DefaultInput
//                         value={values?.accName}
//                         onChange={(e) => {
//                           setFieldValue("accName", e.target.value);
//                         }}
//                         name="accName"
//                         type="text"
//                         className="form-control"
//                         errors={errors}
//                         touched={touched}
//                         placeholder=" "
//                         classes="input-sm"
//                       />
//                     </div>
//                     <div className="col-6">
//                       <label>Account No</label>
//                       <DefaultInput
//                         value={values?.accNo}
//                         onChange={(e) => {
//                           setFieldValue("accNo", e.target.value);
//                         }}
//                         name="accNo"
//                         type="number"
//                         className="form-control"
//                         errors={errors}
//                         touched={touched}
//                         placeholder=" "
//                         classes="input-sm"
//                       />
//                     </div>
//                     <div className="col-6">
//                       <label>District Name</label>
//                       <DefaultInput
//                         value={values?.districtName}
//                         disabled={false}
//                         name="districtName"
//                         type="text"
//                         className="form-control"
//                         onChange={(e) => {
//                           setFieldValue("districtName", e.target.value);
//                         }}
//                         errors={errors}
//                         touched={touched}
//                         placeholder=" "
//                         classes="input-sm"
//                       />
//                     </div>

//                     <div className="col-6">
//                       <label>Business Unit</label>
//                       <FormikSelect
//                         name="businessUnit"
//                         options={
//                           [{ value: 0, label: "All" }, ...businessUnitDDL] || []
//                         }
//                         value={values?.businessUnit}
//                         onChange={(valueOption) => {
//                           setFieldValue("businessUnit", valueOption);
//                         }}
//                         placeholder=" "
//                         styles={customStyles}
//                         errors={errors}
//                         touched={touched}
//                         menuPosition="fixed"
//                       />
//                     </div>
//                     {singleData?.intAccountBankDetailsId && (
//                       <div className="col-6">
//                         <div className="input-main position-group-select mt-2">
//                           <h6
//                             className="title-item-name"
//                             style={{ fontSize: "14px" }}
//                           >
//                             Designation Activation
//                           </h6>
//                           <p className="subtitle-p">
//                             Activation toggle indicates to the particular bank
//                             account status (Active/Inactive)
//                           </p>
//                         </div>
//                         <FormikToggle
//                           name="isActive"
//                           color={values?.isActive ? greenColor : blackColor80}
//                           checked={values?.isActive}
//                           onChange={(e) => {
//                             setFieldValue("isActive", e.target.checked);
//                           }}
//                         />
//                       </div>
//                     )}
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
//                   if (singleData?.intAccountBankDetailsId) {
//                     resetForm(modifySingleData);
//                   } else {
//                     resetForm(initialValues);
//                   }
//                   onHide();
//                   setSingleData("");
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="btn btn-green btn-green-disable"
//                 style={{ width: "auto" }}
//                 type="submit"
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
