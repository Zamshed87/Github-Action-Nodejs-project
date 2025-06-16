import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import AsyncFormikSelect from "../../../common/AsyncFormikSelect";
import DefaultInput from "../../../common/DefaultInput";
import { gray600, success500, whiteColor } from "../../../utility/customColor";
import { customStyles } from "../../../utility/selectCustomStyle";
import { todayTimeFormate } from "../../../utility/todayTimeFormate";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { createGroup } from "../helper";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { setSelectedUserForChatAction } from "../redux/Action";
import { toast } from "react-toastify";
import { signalR_KEY } from "utility/data";

const initialValues = {
  groupName: "",
  userName: [],
  message: "",
};

export const validationSchema = Yup.object({});

export default function GroupChatCreate({ propsObj }) {
  const { strLoginId, intAccountId, strDisplayName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const dispatch = useDispatch();

  const { orgId, setGroupCreate } = propsObj;
  const chatting_KEY = signalR_KEY + "__chatting_" + intAccountId;
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [groupNameCreate, setGroupNameCreate] = useState(false);

  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(`/Auth/GetUserList?AccountId=${orgId}&Search=${v}`)
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  // const setter = (payload) => {
  //   if (isUniq("intEmployeeId", payload?.intEmployeeId, [])) {

  //   }
  // };

  // const remover = (payload) => {
  // };

  // const deleteRow = (payload) => {
  // };
  const history = useHistory();
  const saveHandler = (values, resetForm) => {
    if (values?.groupName?.length < 4) {
      toast.warn("Group name must be at least 4 characters long");
      return;
    }
    if (values?.userName?.length < 1) {
      toast.warn("Please select at least one user");
      return;
    }

    const groupMemberList = values?.userName?.map((item) => {
      return {
        id: 0,
        groupId: 0,
        userId: item?.userId,
        isDelete: false,
        createdBy: strLoginId,
        createdAt: todayTimeFormate(),
      };
    });
    groupMemberList.push({
      id: 0,
      groupId: 0,
      userId: strLoginId,
      isDelete: false,
      createdBy: strLoginId,
      createdAt: todayTimeFormate(),
    });

    const payload = {
      id: 0,
      accountId: orgId,
      groupName: values?.groupName,
      groupImgUrl: "",
      isDelete: false,
      createdBy: strLoginId,
      createdAt: todayTimeFormate(),
      message: {
        id: 0,
        accountId: orgId,
        senderId: strLoginId,
        receiverId: "",
        receiverGroupId: 0,
        messageType: "text",
        message: values?.message,
        groupImgUrl: "",
        isSeen: false,
        isDelete: false,
        createdAt: todayTimeFormate(),
        isReceiver: false,
        appName: chatting_KEY,
        receiverName: values?.groupName,
        senderName: strDisplayName,
        senderReact: "",
        recieverReact: "",
      },
      groupMemberList,
    };
    const cb = (data) => {
      setLoading(false);
      resetForm();
      dispatch(
        setSelectedUserForChatAction({
          empId: data?.id,
          userId: data?.id,
          name: data?.groupName,
          lastMessageAt: data?.createdAt,
          unSeenMessage: 0,
          isGroup: true,
          imgId: data?.groupImgUrl,
          connectionKEY: data?.connectionKEY,
        })
      );
      history.push("/chat-app");
    };
    createGroup(payload, cb, setLoading);
  };

  const { values, setFieldValue, handleSubmit, errors, touched, resetForm } =
    useFormik({
      enableReinitialize: true,
      initialValues: initialValues,
      validationSchema,
      onSubmit: (values) => saveHandler(values),
    });

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="chat_create_group_messenger"
        onClick={(e) => {
          e.stopPropagation();
          setGroupNameCreate(false);
        }}
      >
        {/* header */}
        <div className="modal-header bg-custom">
          <div className="d-flex w-100 justify-content-between align-items-center">
            <div>
              <div
                className="modal-title text-center chat_user_form"
                style={{
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setGroupNameCreate(true);
                }}
              >
                {groupNameCreate ? (
                  <>
                    <DefaultInput
                      classes="input-sm"
                      value={values?.groupName}
                      placeholder="Group Name"
                      name="groupName"
                      type="text"
                      onChange={(e) => {
                        if (e.target.value < 1) {
                          setGroupNameCreate(false);
                        }
                        setFieldValue("groupName", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </>
                ) : values?.groupName ? (
                  values?.groupName
                ) : (
                  <DefaultInput
                    classes="input-sm"
                    value={values?.groupName}
                    placeholder="Group Name"
                    name="groupName"
                    type="text"
                    onChange={(e) => {
                      if (e.target.value < 1) {
                        setGroupNameCreate(false);
                      }
                      setFieldValue("groupName", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                )}
              </div>
            </div>
            <div>
              <IconButton
                onClick={() => {
                  resetForm(initialValues);
                  setGroupCreate(false);
                  setGroupNameCreate(false);
                }}
              >
                <Close />
              </IconButton>
            </div>
          </div>
        </div>

        {/* body */}
        <div className="modal-body">
          <div className="modalBody px-3">
            <div>
              <label>To</label>
              <AsyncFormikSelect
                styleMode="medium"
                styles={{
                  ...customStyles,
                  control: (provided, state) => ({
                    ...provided,
                    minHeight: "auto!important",
                    height: "auto!important",
                    borderRadius: "4px",
                    boxShadow: `${success500}!important`,
                    ":hover": {
                      borderColor: `${gray600}!important`,
                    },
                    ":focus": {
                      borderColor: `${gray600}!important`,
                    },
                  }),
                  valueContainer: (provided, state) => ({
                    ...provided,
                    height: "auto!important",
                    padding: "0 0px",
                  }),
                  multiValue: (styles) => {
                    return {
                      ...styles,
                      position: "relative",
                      top: "-1px",
                    };
                  },
                  multiValueLabel: (styles) => ({
                    ...styles,
                    padding: "0",
                    position: "relative",
                    top: "-1px",
                  }),
                }}
                name="userName"
                selectedValue={values?.userName}
                onChange={(valueOption) => {
                  setFieldValue("userName", valueOption);
                }}
                loadOptions={loadUserList}
                placeholder=""
                isMulti
              />
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="modal-footer form-modal-footer">
          <div
            className="input-group"
            style={{
              alignItems: "center",
              background: whiteColor,
              borderRadius: "12px !important",
            }}
          >
            <input
              type="text"
              className="form-control chatting-input-field-cls bg-white rounded chatting_group-message"
              placeholder="Message"
              aria-label="Message"
              name="message"
              value={values?.message}
              onChange={(e) => {
                e.stopPropagation();
                setFieldValue("message", e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  saveHandler(values, resetForm);
                }
              }}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
