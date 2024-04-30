import React, { useEffect, useRef, useState } from "react";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import Loading from "common/loading/Loading";
import AttachmentUpload from "./AttachmentUpload";
import Required from "common/Required";
import FormikInput from "common/FormikInput";
import PrimaryButton from "common/PrimaryButton";
import {
  addDocumentHandler,
  documentAttachmentColumn,
  saveAttachmentHandler,
} from "../utils";
import NoResult from "common/NoResult";
import PeopleDeskTable from "common/peopleDeskTable";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const CreateAttachmentUpload = ({ assetId, setIsAttachmentShow }) => {
  const dispatch = useDispatch();
  const [, saveAttachmentUpload, attachmentUploadLoading] = useAxiosPost({});
  const [assetImageFile, setAssetImageFile] = useState("");
  const [documentFile, setDocumentFile] = useState("");
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, getSingleData, singleLoading] = useAxiosGet({});
  // image
  const assetImageRef = useRef(null);
  const documentRef = useRef(null);

  useEffect(() => {
    if (assetId) {
      getSingleData(
        `/AssetManagement/GetAssetDocumentUploadService?intAssetId=${assetId}`,
        (res) => {
          setAssetImageFile({
            globalFileUrlId: res?.globalImageUrlID,
            fileName: res?.attachmentName,
          });
          setRowDto(res?.multipleDocument || []);
        }
      );
    }
  }, [assetId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        documentName: "",
      }}
      onSubmit={(values, { resetForm }) => {
        saveAttachmentHandler(
          assetId,
          rowDto,
          assetImageFile,
          saveAttachmentUpload,
          () => {
            resetForm();
            setRowDto([]);
            setAssetImageFile("");
            setIsAttachmentShow(false);
          }
        );
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <>
          {(loading || attachmentUploadLoading || singleLoading) && <Loading />}
          <Form onSubmit={handleSubmit}>
            <div className="pl-4 pr-4 pb-4">
              <div className="row">
                <div className="col-lg-12 mb-2">
                  <div className="d-flex align-items-end justify-content-end">
                    <PrimaryButton
                      className="btn btn-green btn-green-disable"
                      type="submit"
                      label="Save"
                      disabled={attachmentUploadLoading}
                    />
                  </div>
                </div>
                <div className="col-lg-12 mb-3">
                  <AttachmentUpload
                    title="Upload Asset Image"
                    fileRef={assetImageRef}
                    setLoading={setLoading}
                    imageFile={assetImageFile}
                    setImageFile={setAssetImageFile}
                  />
                </div>
                <div className="col-lg-4">
                  <label>
                    Document Name <Required />
                  </label>
                  <FormikInput
                    classes="input-sm"
                    placeholder=""
                    value={values?.documentName}
                    name="documentName"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("documentName", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4 mt-2">
                  <AttachmentUpload
                    title="Upload Document File"
                    fileRef={documentRef}
                    setLoading={setLoading}
                    imageFile={documentFile}
                    setImageFile={setDocumentFile}
                  />
                </div>
                <div className="col-lg-4 mt-3">
                  <PrimaryButton
                    type="button"
                    className="btn btn-default flex-center"
                    label={"Add"}
                    disabled={!values?.documentName}
                    onClick={(e) => {
                      e.stopPropagation();
                      addDocumentHandler(
                        values,
                        documentFile,
                        rowDto,
                        setRowDto,
                        () => {
                          resetForm();
                          setDocumentFile("");
                        }
                      );
                    }}
                  />
                </div>
                <div className="col-lg-12">
                  <div className="table-card-body">
                    {rowDto?.length > 0 ? (
                      <PeopleDeskTable
                        columnData={documentAttachmentColumn(
                          dispatch,
                          rowDto,
                          setRowDto,
                          "create"
                        )}
                        rowDto={rowDto}
                        setRowDto={setRowDto}
                        uniqueKey="itemId"
                        isPagination={false}
                      />
                    ) : (
                      <>
                        {!loading && (
                          <div className="col-12">
                            <NoResult title={"No Data Found"} para={""} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default CreateAttachmentUpload;
