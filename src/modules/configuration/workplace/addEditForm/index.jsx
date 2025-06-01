import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { Switch } from "antd";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { todayDate } from "utility/todayDate";
import { toast } from "react-toastify";
import FileUploadComponents from "utility/Upload/FileUploadComponents";
import { AttachmentOutlined } from "@mui/icons-material";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) {
  // const debounce = useDebounce();
  const getBUnitDDL = useApiRequest({});
  const getWgDDL = useApiRequest({});
  const createWg = useApiRequest({});
  const SaveWorkplace = useApiRequest({});
  const [workplaceImage, setWorkplaceImage] = useState();
  const [letterHeadImage, setLetterHeadImage] = useState();
  const [signatureImage, setSignatureImage] = useState();
  const [letterBuilderImage, setLetterBuilderImage] = useState();
  const dispatch = useDispatch();

  const { orgId, buId, employeeId, wgId, intAccountId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  // states

  // ddls
  useEffect(() => {
    getBUnitDDL.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        id: singleData?.intBusinessUnitId,
        DDLType: "BusinessUnit",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        intId: employeeId || 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strBusinessUnit;
          res[i].value = item?.intBusinessUnitId;
        });
      },
    });
    getWgDDL.action({
      urlKey: "GetAllWorkplaceGroup",
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
      actionTypeId: singleData.intWorkplaceId ? singleData.intWorkplaceId : 0,
      intWorkplaceId: singleData.intWorkplaceId ? singleData.intWorkplaceId : 0,
      strWorkplace: values?.strWorkplace,
      strWorkplaceBn: values?.strWorkplaceBn,
      strWorkplaceCode: values?.strWorkplaceCode,
      strAddress: "",
      intDistrictId: 0,
      strDistrict: "",
      intWorkplaceGroupId: values?.wgDDL?.value,
      strWorkplaceGroup: values?.wgDDL?.label,
      isActive: values?.isActive,
      intBusinessUnitId: values?.bUnit?.value,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
      intImageId: workplaceImage?.[0]?.response?.[0]?.globalFileUrlId || 0,
      intWorkplaceLogoId:
        workplaceImage?.[0]?.response?.[0]?.globalFileUrlId ||
        singleData?.intWorkplaceLogoId,
      intLetterHeadId:
        letterHeadImage?.[0]?.response?.[0]?.globalFileUrlId ||
        singleData?.intLetterHeadId,
      intSignatureId:
        signatureImage?.[0]?.response?.[0]?.globalFileUrlId ||
        singleData?.intSignatureId,
      intLetterBuilderId:
        letterBuilderImage?.[0]?.response?.[0]?.globalFileUrlId ||
        singleData?.intLetterBuilderId,
    };
    SaveWorkplace.action({
      urlKey: "SaveWorkplace",
      method: "POST",
      payload: payload,
      toast: true,
      onSuccess: () => {
        cb();
      },
    });
  };
  useEffect(() => {
    if (singleData?.intWorkplaceId) {
      form.setFieldsValue({
        ...singleData,
        bUnit: {
          value: singleData?.intBusinessUnitId,
          label: singleData?.strBusinessUnit,
        },
        wgDDL: {
          value: singleData?.intWorkplaceGroupId,
          label: singleData?.strWorkplaceGroup,
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
            <PInput
              type="text"
              name="strWorkplace"
              label="Workplace"
              placeholder="Workplace"
              disabled={isEdit}
              rules={[{ required: true, message: "Workplace is required" }]}
            />
          </Col>
          {intAccountId === 7 && (
            <Col md={12} sm={24}>
              <PInput
                type="text"
                name="strWorkplaceBn"
                label="Workplace Bangla"
                placeholder="Workplace Bangla"
                disabled={isEdit}
                rules={[{ required: true, message: "Workplace is required" }]}
              />
            </Col>
          )}
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strWorkplaceCode"
              label="Code"
              placeholder="Code"
              disabled={isEdit}
              rules={[{ required: true, message: "Code is required" }]}
            />
          </Col>

          <Col md={12} sm={24}>
            <PSelect
              options={getBUnitDDL?.data?.length > 0 ? getBUnitDDL?.data : []}
              name="bUnit"
              label="Business Unit"
              showSearch
              filterOption={true}
              placeholder="Business Unit"
              disabled={isEdit}
              onChange={(value, op) => {
                form.setFieldsValue({
                  bUnit: op,
                });
              }}
              rules={[{ required: true, message: "Business Unit is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={getWgDDL?.data?.length > 0 ? getWgDDL?.data : []}
              name="wgDDL"
              label="Workplace Group"
              showSearch
              filterOption={true}
              placeholder="Workplace Group"
              disabled={isEdit}
              onChange={(value, op) => {
                form.setFieldsValue({
                  wgDDL: op,
                });
              }}
              rules={[
                { required: true, message: "Workplace Group is required" },
              ]}
            />
          </Col>

          <Form.Item shouldUpdate noStyle>
            {() => {
              const { newWorkplaceGroup } = form.getFieldsValue();

              // const empType = employeeType?.label;

              return (
                <>
                  <Col md={12} sm={24}>
                    <PInput
                      type="text"
                      name="newWorkplaceGroup"
                      label="Add New Workplace Group"
                      placeholder="Add New Workplace Group"
                      disabled={isEdit}
                      rules={
                        [
                          // {
                          //   required: true,
                          //   message: "Add New Workplace Group is required",
                          // },
                        ]
                      }
                    />
                  </Col>
                  <Col md={12} className="mt-1">
                    <button
                      disabled={isEdit}
                      type="button"
                      className="mt-3  btn btn-green  "
                      style={{
                        width: "auto",
                        // margin: "0.4em 0 0 0.7em",
                        // padding: " 0 2rem",
                      }}
                      onClick={() => {
                        if (newWorkplaceGroup === undefined) {
                          return toast.warn("Please fill up the field");
                        }
                        const payload = {
                          intWorkplaceGroupId: 0,
                          strWorkplaceGroup: newWorkplaceGroup,
                          strWorkplaceGroupCode: newWorkplaceGroup,
                          isActive: true,
                          intAccountId: orgId,
                          intBusinessUnitId: buId,
                        };
                        createWg.action({
                          urlKey: "SaveWorkplaceGroup",
                          method: "POST",
                          payload: payload,
                          onSuccess: () => {
                            form.setFieldsValue({
                              newWorkplaceGroup: undefined,
                            });
                            getWgDDL.action({
                              urlKey: "GetAllWorkplaceGroup",
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
                            toast.success(
                              "Workplace Group Created Successfully"
                            );
                          },
                        });
                      }}
                    >
                      Add Work. Group
                      {/* <IoMdAddCircleOutline sx={{ fontSize: "16px" }} /> */}
                    </button>
                  </Col>
                </>
              );
            }}
          </Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent:
                window.innerWidth <= 768 ? "flex-start" : "space-between",
              width: "100%",
              flexDirection: window.innerWidth <= 768 ? "column" : "row",
            }}
          >
            <Col md={6} sm={24} style={{ marginTop: "21px" }}>
              <div className="mt-3">
                <FileUploadComponents
                  propsObj={{
                    title: "WORKPLACE LOGO",
                    attachmentList: workplaceImage,
                    setAttachmentList: setWorkplaceImage,
                    accountId: orgId,
                    tableReferrence: "WORKPLACE",
                    documentTypeId: 15,
                    userId: employeeId,
                    buId,
                    maxCount: 1,
                    accept: "image/png, image/jpeg, image/jpg",
                  }}
                />
              </div>
              {((workplaceImage?.length > 0 ||
                singleData?.intWorkplaceLogoId !== 0) && isEdit) && (
                <p
                  onClick={() => {
                    dispatch(
                      getDownlloadFileView_Action(
                        singleData?.intWorkplaceLogoId
                      )
                    );
                  }}
                >
                  <AttachmentOutlined
                    sx={{
                      marginRight: "5px",
                      color: "#0072E5",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#0072E5",
                      cursor: "pointer",
                    }}
                  >
                    {"Attachment"}
                  </span>
                </p>
              )}
            </Col>

            <Col md={5} sm={24} style={{ marginTop: "21px" }}>
              <div className="mt-3">
                <FileUploadComponents
                  propsObj={{
                    title: "LETTER HEAD",
                    attachmentList: letterHeadImage,
                    setAttachmentList: setLetterHeadImage,
                    accountId: orgId,
                    tableReferrence: "LETTERHEAD",
                    documentTypeId: 15,
                    userId: employeeId,
                    buId,
                    maxCount: 1,
                    accept: "image/png, image/jpeg, image/jpg",
                  }}
                />
              </div>
              {((letterHeadImage?.length > 0 ||
                singleData?.intLetterHeadId !== 0) && isEdit) && (
                <p
                  onClick={() => {
                    dispatch(
                      getDownlloadFileView_Action(singleData?.intLetterHeadId)
                    );
                  }}
                >
                  <AttachmentOutlined
                    sx={{
                      marginRight: "5px",
                      color: "#0072E5",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#0072E5",
                      cursor: "pointer",
                    }}
                  >
                    {"Attachment"}
                  </span>
                </p>
              )}
            </Col>

            <Col md={5} sm={24} style={{ marginTop: "21px" }}>
              <div className="mt-3">
                <FileUploadComponents
                  propsObj={{
                    title: "SIGNATURE",
                    attachmentList: signatureImage,
                    setAttachmentList: setSignatureImage,
                    accountId: orgId,
                    tableReferrence: "SIGNATURE",
                    documentTypeId: 15,
                    userId: employeeId,
                    buId,
                    maxCount: 1,
                    accept: "image/png, image/jpeg, image/jpg",
                  }}
                />
              </div>
              {((signatureImage?.length > 0 ||
                singleData?.intSignatureId !== 0) && isEdit) && (
                <p
                  onClick={() => {
                    dispatch(
                      getDownlloadFileView_Action(singleData?.intSignatureId)
                    );
                  }}
                >
                  <AttachmentOutlined
                    sx={{
                      marginRight: "5px",
                      color: "#0072E5",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#0072E5",
                      cursor: "pointer",
                    }}
                  >
                    {"Attachment"}
                  </span>
                </p>
              )}
            </Col>

            <Col md={5} sm={24} style={{ marginTop: "21px" }}>
              <div className="mt-3">
                <FileUploadComponents
                  propsObj={{
                    title: "LETTER BUILDER",
                    attachmentList: letterBuilderImage,
                    setAttachmentList: setLetterBuilderImage,
                    accountId: orgId,
                    tableReferrence: "LETTERBUILDER",
                    documentTypeId: 15,
                    userId: employeeId,
                    buId,
                    maxCount: 1,
                    accept: "image/png, image/jpeg, image/jpg",
                  }}
                />
              </div>
              {((letterBuilderImage?.length > 0 ||
                singleData?.intLetterBuilderId !== 0) && isEdit) && (
                <p
                  onClick={() => {
                    dispatch(
                      getDownlloadFileView_Action(
                        singleData?.intLetterBuilderId
                      )
                    );
                  }}
                >
                  <AttachmentOutlined
                    sx={{
                      marginRight: "5px",
                      color: "#0072E5",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#0072E5",
                      cursor: "pointer",
                    }}
                  >
                    {"Attachment"}
                  </span>
                </p>
              )}
            </Col>
          </div>

          {isEdit && (
            <Col
              md={24}
              style={{
                marginLeft: "-0.5rem",
              }}
              disabled={isEdit}
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
                  <h6 className="title-item-name">Workplace Activation</h6>
                  <p className="subtitle-p">
                    Activation toggle indicates to the particular Workplace
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
                    <Switch
                    // disabled={!!isEdit}
                    />
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

// export default function AddEditFormComponent({
//   id,
//   show,
//   onHide,
//   size,
//   backdrop,
//   classes,
//   isVisibleHeading = true,
//   fullscreen,
//   title,
//   setEditId,
//   singleData,
//   setSingleData,
//   setRowDto,
//   setAllData,
// }) {
//   const [loading, setLoading] = useState(false);

//   const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
//   const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
//   const [modifySingleData, setModifySingleData] = useState("");

//   const [addNewType, setAddNewType] = useState(false);

//   const { orgId, buId, wgId, employeeId } = useSelector(
//     (state) => state?.auth?.profileData,
//     shallowEqual
//   );

//   useEffect(() => {
//     if (singleData) {
//       const newRowData = {
//         workplace: singleData?.strWorkplace,
//         code: singleData?.strWorkplaceCode,
//         workplaceGroup: {
//           value: singleData?.intWorkplaceGroupId,
//           label: singleData?.strWorkplaceGroup,
//         },
//         businessUnit: {
//           value: singleData?.intBusinessUnitId,
//           label: singleData?.strBusinessUnit,
//         },
//         isActive: singleData?.isActive,
//       };
//       setModifySingleData(newRowData);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [singleData]);

//   useEffect(() => {
//     if (id) {
//       getWorkplaceById(id, setSingleData);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   useEffect(() => {
//     getPeopleDeskAllDDL(
//       `/SaasMasterData/GetAllWorkplaceGroup?accountId=${orgId}&businessUnitId=${buId}`,
//       "intWorkplaceGroupId",
//       "strWorkplaceGroup",
//       setWorkplaceGroupDDL
//     );
//     getPeopleDeskAllDDL(
//       `/SaasMasterData/GetAllBusinessUnit?accountId=${orgId}`,
//       "intBusinessUnitId",
//       "strBusinessUnit",
//       setBusinessUnitDDL
//     );
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const addWorkplaceGroup = (values, setFieldValue) => {
//     const payload = {
//       intWorkplaceGroupId: 0,
//       strWorkplaceGroup: values?.newWorkplaceGroup,
//       strWorkplaceGroupCode: values?.newWorkplaceGroup,
//       // strWorkplaceGroupCode: values?.newWorkplaceGroupCode,
//       isActive: true,
//       intAccountId: orgId,
//     };

//     const callback = () => {
//       getPeopleDeskAllDDL(
//         `/SaasMasterData/GetAllWorkplaceGroup?accountId=${orgId}&businessUnitId=${buId}`,
//         "intWorkplaceGroupId",
//         "strWorkplaceGroup",
//         setWorkplaceGroupDDL
//       );
//       setAddNewType(false);
//       setFieldValue("newPositionGroup", "");
//       setFieldValue("newPositionGroupCode", "");
//     };
//     createWorkplaceGroup(payload, setLoading, callback);
//   };

//   const saveHandler = (values, cb) => {
//     let payload = {
//       strWorkplace: values?.workplace,
//       strWorkplaceCode: values?.code,
//       strAddress: "",
//       intDistrictId: 0,
//       strDistrict: "",
//       intWorkplaceGroupId: values?.workplaceGroup?.value,
//       strWorkplaceGroup: values?.workplaceGroup?.label,
//       isActive: values?.isActive,
//       intBusinessUnitId: values?.businessUnit?.value,
//       intAccountId: orgId,
//       dteCreatedAt: todayDate(),
//       intCreatedBy: employeeId,
//       dteUpdatedAt: todayDate(),
//       intUpdatedBy: employeeId,
//     };

//     const callback = () => {
//       cb();
//       onHide();
//       getWorkplaceLanding(orgId, buId, wgId, setRowDto, setAllData);
//       id && getWorkplaceById(id, setSingleData);
//     };
//     if (id) {
//       createWorkplace(
//         { ...payload, actionTypeId: id, intWorkplaceId: id },
//         setLoading,
//         callback
//       );
//     } else {
//       createWorkplace(
//         { ...payload, actionTypeId: 0, intWorkplaceId: 0 },
//         setLoading,
//         callback
//       );
//     }
//   };

//   return (
//     <>
//       <Formik
//         enableReinitialize={true}
//         initialValues={id ? modifySingleData : initData}
//         validationSchema={validationSchema}
//         onSubmit={(values, { setSubmitting, resetForm }) => {
//           saveHandler(values, () => {
//             if (id) {
//               resetForm(modifySingleData);
//             } else {
//               resetForm(initData);
//             }
//           });
//         }}
//       >
//         {({
//           handleSubmit,
//           resetForm,
//           values,
//           errors,
//           touched,
//           setFieldValue,
//           isValid,
//         }) => (
//           <>
//             {loading && <Loading />}
//             <div className="viewModal">
//               <Modal
//                 show={show}
//                 onHide={onHide}
//                 size={size}
//                 backdrop={backdrop}
//                 aria-labelledby="example-modal-sizes-title-xl"
//                 className={classes}
//                 fullscreen={fullscreen && fullscreen}
//               >
//                 <Form>
//                   {isVisibleHeading && (
//                     <Modal.Header className="bg-custom">
//                       <div className="d-flex w-100 justify-content-between align-items-center">
//                         <Modal.Title className="text-center">
//                           {title}
//                         </Modal.Title>
//                         <div>
//                           <IconButton
//                             onClick={() => {
//                               if (id) {
//                                 resetForm(modifySingleData);
//                               } else {
//                                 resetForm(initData);
//                               }
//                               onHide();
//                               setAddNewType(false);
//                             }}
//                           >
//                             <Close />
//                           </IconButton>
//                         </div>
//                       </div>
//                     </Modal.Header>
//                   )}

//                   <Modal.Body id="example-modal-sizes-title-xl">
//                     <div className="businessUnitModal">
//                       <div className="modalBody pt-0 px-0">
//                         <div className="row mx-0">
//                           <div className="col-6">
//                             <label>Workplace</label>
//                             <FormikInput
//                               classes="input-sm"
//                               value={values?.workplace}
//                               name="workplace"
//                               type="text"
//                               className="form-control"
//                               placeholder=""
//                               onChange={(e) => {
//                                 setFieldValue("workplace", e.target.value);
//                               }}
//                               errors={errors}
//                               touched={touched}
//                             />
//                           </div>
//                           <div className="col-6">
//                             <label>Code</label>
//                             <FormikInput
//                               classes="input-sm"
//                               value={values?.code}
//                               name="code"
//                               type="text"
//                               className="form-control"
//                               placeholder=""
//                               onChange={(e) => {
//                                 setFieldValue("code", e.target.value);
//                               }}
//                               errors={errors}
//                               touched={touched}
//                             />
//                           </div>
//                           <div className="col-6">
//                             <label>Workplace Group</label>
//                             <FormikSelect
//                               name="workplaceGroup"
//                               options={workplaceGroupDDL || []}
//                               value={values?.workplaceGroup}
//                               onChange={(valueOption) => {
//                                 setFieldValue("workplaceGroup", valueOption);
//                               }}
//                               placeholder=" "
//                               styles={customStyles}
//                               errors={errors}
//                               touched={touched}
//                             />
//                           </div>
//                           <div className="col-6">
//                             <label>Business Unit</label>
//                             <FormikSelect
//                               name="businessUnit"
//                               options={businessUnitDDL || []}
//                               value={values?.businessUnit}
//                               onChange={(valueOption) => {
//                                 setFieldValue("businessUnit", valueOption);
//                               }}
//                               placeholder=" "
//                               styles={customStyles}
//                               errors={errors}
//                               touched={touched}
//                             />
//                           </div>
//                           {addNewType ? (
//                             <>
//                               <div className="col-12 px-0 row m-0">
//                                 <div className="col-6">
//                                   <label>New Workplace Group</label>
//                                   <FormikInput
//                                     classes="input-sm"
//                                     value={values?.newWorkplaceGroup}
//                                     name="newWorkplaceGroup"
//                                     type="text"
//                                     className="form-control"
//                                     placeholder=""
//                                     onChange={(e) => {
//                                       setFieldValue(
//                                         "newWorkplaceGroup",
//                                         e.target.value
//                                       );
//                                     }}
//                                     errors={errors}
//                                     touched={touched}
//                                   />
//                                 </div>
//                                 {/* <div className="col-6">
//                                   <label>New Workplace Group Code</label>
//                                   <FormikInput
//                                     classes="input-sm"
//                                     value={values?.newWorkplaceGroupCode}
//                                     name="newWorkplaceGroupCode"
//                                     type="text"
//                                     className="form-control"
//                                     placeholder=""
//                                     onChange={(e) => {
//                                       setFieldValue(
//                                         "newWorkplaceGroupCode",
//                                         e.target.value
//                                       );
//                                     }}
//                                     errors={errors}
//                                     touched={touched}
//                                   />
//                                 </div> */}
//                                 <div className="offset-6 col-6">
//                                   <div className="d-flex justify-content-end align-items-center mt-3">
//                                     <Button
//                                       type="button"
//                                       className="btn btn-cancel"
//                                       sx={{
//                                         fontWeight: "500",
//                                         fontSize: "14px",
//                                         lineHeight: "19px",
//                                         letterSpacing: "0.15px",
//                                         color: "rgba(0, 0, 0, 0.7)",
//                                         marginRight: "10px",
//                                       }}
//                                       onClick={() => {
//                                         setAddNewType(false);
//                                       }}
//                                     >
//                                       Cancel
//                                     </Button>
//                                     <Button
//                                       type="button"
//                                       sx={{
//                                         fontWeight: "500",
//                                         fontSize: "14px",
//                                         lineHeight: "19px",
//                                         letterSpacing: "0.15px",
//                                         color: "var(--primary-color)",
//                                         marginRight: "10px",
//                                       }}
//                                       onClick={() => {
//                                         addWorkplaceGroup(
//                                           values,
//                                           setFieldValue
//                                         );
//                                       }}
//                                       disabled={
//                                         !values?.newWorkplaceGroup /* ||
//                                         !values?.newWorkplaceGroupCode */
//                                       }
//                                     >
//                                       Add
//                                     </Button>
//                                   </div>
//                                 </div>
//                               </div>
//                             </>
//                           ) : (
//                             <>
//                               <div className="col-6 mt-3">
//                                 <button
//                                   className="btn btn-green btn-green-disable"
//                                   style={{ width: "auto" }}
//                                   type="button"
//                                   onClick={() => setAddNewType(true)}
//                                 >
//                                   Add New Workplace Group
//                                 </button>
//                               </div>
//                             </>
//                           )}

//                           {id && (
//                             <div className="col-6">
//                               <div className="input-main position-group-select mt-2">
//                                 <h6
//                                   className="title-item-name"
//                                   style={{ fontSize: "14px" }}
//                                 >
//                                   Workplace Activation
//                                 </h6>
//                                 <p className="subtitle-p">
//                                   Activation toggle indicates to the particular
//                                   Workplace status (Active/Inactive)
//                                 </p>
//                                 <FormikToggle
//                                   name="isActive"
//                                   color={
//                                     values?.isActive ? greenColor : blackColor80
//                                   }
//                                   checked={values?.isActive}
//                                   onChange={(e) => {
//                                     setFieldValue("isActive", e.target.checked);
//                                   }}
//                                 />
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </Modal.Body>
//                   <Modal.Footer className="form-modal-footer">
//                     <button
//                       type="button"
//                       className="btn btn-cancel"
//                       onClick={() => {
//                         if (id) {
//                           resetForm(modifySingleData);
//                         } else {
//                           resetForm(initData);
//                         }
//                         onHide();
//                       }}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       className="btn btn-green btn-green-disable"
//                       style={{ width: "auto" }}
//                       type="submit"
//                       onSubmit={() => handleSubmit()}
//                     >
//                       Save
//                     </button>
//                   </Modal.Footer>
//                 </Form>
//               </Modal>
//             </div>
//           </>
//         )}
//       </Formik>
//     </>
//   );
// }
