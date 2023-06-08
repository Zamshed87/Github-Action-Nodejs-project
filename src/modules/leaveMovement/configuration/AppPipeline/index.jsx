import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import Loading from "../../../../common/loading/Loading";
import PrimaryButton from "../../../../common/PrimaryButton";
import { AddOutlined } from "@mui/icons-material";
import CardTable from "./components/CardTable";
import AddEditFormComponent from "./addEditForm";
import "./style.css";
import { getApprovalLandingData } from "./helper";
import { useDispatch, useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { toast } from "react-toastify";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";

const initData = {
  movementTypeName: "",
};

const AppPipeline = () => {
  // const { orgId } = useSelector(
  //   (state) => state?.auth?.profileData,
  //   shallowEqual
  // );
  const [openModal, setOpenModal] = useState(false);
  const saveHandler = (values) => {};
  const [loading, setLoading] = useState(false);
  const [landing, setLanding] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    getApprovalLandingData(setLoading, setLanding);
  };

  useEffect(() => {
    getData();
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 37) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="table-card leave-type">
                  <div className="table-card-heading">
                    <div></div>
                    <div className="table-card-head-right">
                      <PrimaryButton
                        type="button"
                        className="btn btn-default flex-center"
                        label={"Approval Pipeline"}
                        icon={<AddOutlined sx={{ marginRight: "11px" }} />}
                        onClick={() => {
                          if (!permission?.isCreate)
                            return toast.warn("You don't have permission");
                          setOpenModal(true);
                        }}
                      />
                    </div>
                  </div>
                  <div className="table-card-body border-top pt-3">
                    <h6 style={{color: "rgba(0, 0, 0, 0.6)"}}>Leave and Movement Pipeline</h6>
                    <CardTable landing={landing}></CardTable>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
      <AddEditFormComponent
        show={openModal}
        title="Create Approval Pipeline"
        onHide={setOpenModal}
        size="lg"
        backdrop="static"
        classes="default-modal"
        getData={getData}
        // id={id}
        // orgId={orgId}
        // setRowDto={setRowDto}
      />
    </>
  );
};

export default AppPipeline;
