import { DataTable, PForm } from "Components";
import { Form, Popconfirm } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { EditableCell } from "./editableCell";
import useAxiosPost from "utility/customHooks/useAxiosPost";

const originData = Array.from({
  length: 5,
}).map((_, i) => ({
  key: i.toString(),
  factor: `Edward ${i}`,
  displayName: `Edward King ${i}+2`,
  scale: 32,
}));
const BehavioralFactorScale = () => {
  const [factorScale, getFactorScale, factorScaleLoader] = useAxiosGet();
  const [, saveFactorScale, saveFactorScaleLoader] = useAxiosPost();
  const [isScoreSettings, setIsScoreSettings] = useState({
    open: false,
    type: "",
  });
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const { profileData } = useSelector((state) => state?.auth, shallowEqual);
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const dispatch = useDispatch();
  const history = useHistory();

  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30540),
    []
  );
  const edit = (record) => {
    form.setFieldsValue({
      displayName: "",
      scale: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const values = form.getFieldsValue(true);
      form
        .validateFields()
        .then(() => {
          const payload = {
            scoreScaleId: values?.scoreScaleId,
            accountId: profileData?.intAccountId,
            actionBy: profileData?.employeeId,
            displayName: values?.displayName,
            scaleValue: values?.scaleValue,
          };
          saveFactorScale(
            `/PMS/SaveBehavioralFactorScaleSetting`,
            payload,
            () => {
              landingApi();
              setEditingKey("");
            },
            true
          );
          // save api call
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "Factor",
      dataIndex: "scaleName",
      width: "25%",
    },
    {
      title: "Display Name",
      dataIndex: "displayName",
      width: "25%",
      editable: true,
    },
    {
      title: "Scale",
      dataIndex: "scaleValue",
      width: "20%",
      editable: true,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <div>
            <Popconfirm
              title="Sure to save?"
              onConfirm={() => save(record.key)}
            >
              <button
                style={{
                  height: "24px",
                  fontSize: "12px",
                  padding: "0px 12px 0px 12px",
                  backgroundColor: "var(--green)",
                  color: "white",
                }}
                className="btn"
                type="button"
              >
                Save
              </button>
            </Popconfirm>
            <button
              onClick={cancel}
              style={{
                height: "24px",
                fontSize: "12px",
                padding: "0px 12px 0px 12px",
                marginLeft: "5px",
                color: "var(--fail)",
              }}
              className="btn btn-dander"
              type="button"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            style={{
              height: "24px",
              fontSize: "12px",
              padding: "0px 12px 0px 12px",
            }}
            className="btn btn-secondary"
            type="button"
            onClick={() => {
              edit(record);
            }}
          >
            Change
          </button>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "scaleValue" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const landingApi = () => {
    getFactorScale(
      `/PMS/GetAllBehavioralFactorScaleSettingData?accountId=${profileData?.intAccountId}`
    );
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    landingApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return permission?.isView ? (
    <div className="table-card">
      {factorScaleLoader && <Loading />}
      <h1>Behavioral Factor Scale</h1>
      <PForm form={form}>
        <div className="mt-2">
          <DataTable
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            rowClassName="editable-row"
            bordered
            data={factorScale || []}
            header={mergedColumns}
          />
        </div>
      </PForm>
    </div>
  ) : (
    <NotPermittedPage />
  );
};

export default BehavioralFactorScale;
