import { useFormik } from "formik";
import React, { useEffect } from "react";
import AddEditForm from "../components/addEditForm";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  saveTask,
  taskCreateInitData,
  validationSchemaForTaskCreation,
} from "../helper";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import Loading from "../../../../common/loading/Loading";

function ManagementCreateTask() {
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const dispatch = useDispatch();

  const [, saveSingleTask, loadingTask] = useAxiosPost();

  const {
    setFieldValue,
    values,
    handleSubmit,
    resetForm,
    setValues,
    touched,
    errors,
  } = useFormik({
    enableReinitialize: true,
    initialValues: taskCreateInitData,
    validationSchema: validationSchemaForTaskCreation,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const cb = () => {
        resetForm(taskCreateInitData);
        setFieldValue("fDate", null);
        setFieldValue("tDate", null);
      };

      saveTask({ values, employeeId, orgId, buId, saveSingleTask, cb });
    },
  });

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30363) {
      permission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, [dispatch]);

  return (
    <>
      {loadingTask && <Loading />}
      {permission?.isCreate ? (
        <form onSubmit={handleSubmit}>
          <AddEditForm
            propsObj={{
              loadingTask,
              permission,
              handleSubmit,
              resetForm,
              initData: taskCreateInitData,
              values,
              touched,
              errors,
              setValues,
              setFieldValue,
            }}
          />
        </form>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
}

export default ManagementCreateTask;
