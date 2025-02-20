import { DeleteTwoTone } from "@ant-design/icons";
import { Card } from "antd";
import { getSearchEmployeeListWithWarning } from "common/api";
import AsyncFormikSelect from "common/AsyncFormikSelect";
import Loading from "common/loading/Loading";
import PrimaryButton from "common/PrimaryButton";
import { DataTable, PInput } from "Components";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import useAxiosPost from "utility/customHooks/useAxiosPost";

export default function ChargeHandOver({ separationId }) {
  const { buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const params = useParams();
  const [employeeList, setEmployeeList] = useState([]);
  const [, getHandOverData, handoverloading] = useAxiosGet();
  const [, postHandOverData] = useAxiosPost();
  const [loading, setLoading] = useState(false);
  const initData = {
    employeeName: "",
    comment: "",
    employeeId: 0,
  };

  useEffect(() => {
    getData();
  }, [separationId]);

  const header = [
    {
      title: "SL",
      dataIndex: "serialNumber",
    },
    {
      title: "Charge Handedover To",
      dataIndex: "strEmployeeName",
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
    },
    {
      title: "Comment",
      dataIndex: "comment",
    },
    {
      title: "",
      dataIndex: "data",
      render: (_, data) => (
        <PrimaryButton
          type="button"
          className="btn btn-cancel"
          icon={<DeleteTwoTone twoToneColor="#f5222d" />}
          customStyle={{
            width: "30px",
            border: "none",
          }}
          onClick={() => {
            setEmployeeList((prev) =>
              prev.filter((item) => item.intEmployeeId !== data.intEmployeeId)
            );
          }}
        />
      ),
      width: 30,
    },
  ];

  const getData = () => {
    setLoading(true);
    getHandOverData(
      `/ChargeHandedOver/GetChargeHandedOverBySeparationId/${separationId}`,
      (res) => {
        const modifiedData = res?.data?.map((item, index) => ({
          serialNumber: index + 1,
          strEmployeeName: item?.strEmployeeName,
          intHandOverId: 0,
          intEmployeeId: item?.intEmployeeId,
          strDesignation: item?.strDesignation,
          strDepartment: item?.strDepartment,
          comment: item?.comment,
        }));
        setEmployeeList(modifiedData);
        setLoading(false);
      }
    );
  };

  const saveHandler = (values, cb) => {
    if (!values?.employeeName) {
      return toast.warning("Employee Name is required!!!");
    } else if (!values?.comment.trim()) {
      return toast.warning("Comment is required!!!");
    }

    const modifiedValues = {
      serialNumber: employeeList.length + 1,
      strEmployeeName: values?.employeeName?.employeeName,
      intHandOverId: 0,
      intEmployeeId: values?.employeeId,
      strDesignation: values?.employeeName?.strDesignation,
      strDepartment: values?.employeeName?.strDepartment,
      comment: values?.comment,
    };
    setEmployeeList((prev) => [...prev, modifiedValues]);
    resetForm({ values: { employeeName: "", comment: "", employeeId: 0 } });
    cb();
  };

  const saveChangeHandler = () => {
    const payload = {
      intSeparationId: separationId,
      list: employeeList.map((item) => ({
        intHandOverId: 0,
        intEmployeeId: item.intEmployeeId,
        strEmployeeName: item.strEmployeeName,
        comment: item.comment,
      })),
    };
    postHandOverData(
      `/ChargeHandedOver/SaveChargeHandedOver`,
      payload,
      () => {
        getData();
      },
      true
    );
  };

  const { setFieldValue, values, errors, touched, handleSubmit, resetForm } =
    useFormik({
      enableReinitialize: true,
      initialValues: initData,
      onSubmit: (values, { resetForm }) => {
        saveHandler(values, () => {
          resetForm({
            values: { employeeName: "", comment: "", employeeId: 0 },
          });
        });
      },
    });

  return (
    <div>
      {loading && <Loading />}
      <div className="d-flex justify-content-end mb-3">
        <PrimaryButton
          type="button"
          className="btn btn-default"
          label={"Save"}
          customStyle={{
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => {
            saveChangeHandler();
          }}
        />
      </div>
      <Card
        style={{
          width: "100%",
        }}
      >
        <div className="d-flex justify-content-start">
          <form onSubmit={handleSubmit} className="d-flex">
            <div style={{ minWidth: "300px" }}>
              <div className="input-field-main">
                <label>Select Employee</label>
              </div>
              <AsyncFormikSelect
                selectedValue={values?.employeeName}
                isSearchIcon={true}
                handleChange={(valueOption) => {
                  setFieldValue("employeeName", valueOption);
                  setFieldValue("employeeId", valueOption?.employeeId);
                }}
                placeholder="Search (min 3 letter)"
                loadOptions={(v) =>
                  getSearchEmployeeListWithWarning(buId, wgId, v)
                }
                isDisabled={+params?.id}
                styleMode="medium"
              />
            </div>
            <div className="ml-3">
              <div className="input-field-main">
                <label>Comment</label>
              </div>
              <PInput
                type="text"
                value={values?.comment}
                onChange={(e) => {
                  setFieldValue("comment", e.target.value);
                }}
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="ml-3">
              <PrimaryButton
                type="submit"
                className="btn btn-default"
                customStyle={{
                  marginTop: "21px",
                }}
                label={"Add"}
              />
            </div>
          </form>
        </div>
      </Card>
      <div className="mt-3">
        <DataTable
          header={header}
          data={employeeList || []}
          loading={handoverloading}
        />
      </div>
    </div>
  );
}
