import { useFormik } from "formik";
import React, { useEffect } from "react";
import AddEditForm from "../components/addEditForm";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  saveTask,
  taskCreateInitData,
  validationSchemaForTaskCreation,
} from "../helper";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import Loading from "../../../../common/loading/Loading";

const SelfCreateTask = () => {
  const { orgId, buId, employeeId, userName } = useSelector(
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
    initialValues: {
      ...taskCreateInitData,
      empList: [{ label: userName, value: employeeId }],
    },
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

  // const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  // let permission = null;
  // permissionList.forEach((item) => {
  //   if (item?.menuReferenceId === 30351) {
  //     permission = item;
  //   }
  // });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, [dispatch]);

  return (
    <>
      {loadingTask && <Loading />}
      <form onSubmit={handleSubmit}>
        <AddEditForm
          propsObj={{
            loadingTask,
            handleSubmit,
            resetForm,
            initData: taskCreateInitData,
            values,
            touched,
            errors,
            setValues,
            setFieldValue,
            isSelfService: true,
          }}
        />
      </form>
    </>
  );
};

export default SelfCreateTask;
