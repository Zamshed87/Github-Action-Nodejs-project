import { EditOutlined } from "@ant-design/icons";
import { AddOutlined } from "@mui/icons-material";
import { DataTable, Flex, PForm } from "Components";
import { PModal } from "Components/Modal";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Tooltip,
  Typography,
} from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import PrimaryButton from "../../../../common/PrimaryButton";
import Loading from "../../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { EditableCell } from "./editableCell";

const originData = Array.from({
  length: 100,
}).map((_, i) => ({
  key: i.toString(),
  name: `Edward ${i}`,
  age: 32,
  address: `London Park no. ${i}`,
}));
const BehavioralFactorScale = () => {
  const [criteriaList, getCriteriaList, criteriaListLoader] = useAxiosGet();
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
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getCriteriaList(
      `/PMS/GetEvaluationCriteria?accountId=${profileData?.intAccountId}`
    );
  }, []);
  const permission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30540),
    []
  );
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "name",
      dataIndex: "name",
      width: "25%",
      editable: true,
    },
    {
      title: "age",
      dataIndex: "age",
      width: "15%",
      editable: true,
    },
    {
      title: "address",
      dataIndex: "address",
      width: "40%",
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
                }}
                className="btn btn-secondary"
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
          <EditOutlined
            style={{
              color: "green",
              fontSize: "15px",
              cursor: "pointer",
              margin: "1px 5px",
            }}
            onClick={() => {
              edit(record);
            }}
          />
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
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return permission?.isView ? (
    <div className="table-card">
      {criteriaListLoader && <Loading />}
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
            data={data || []}
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
