import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ChatAppSocket } from "../../..";
import Loading from "../../../../../common/loading/Loading";
import { setSelectedGroupDataAction } from "../../../redux/Action";
import Form from "./form";

const initData = {
  groupName: "",
  user: "",
};

const CreateGroupModal = ({ data, setCreateGroupModal }) => {
  const [isDisabled, setDisabled] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [singleData, setSingleData] = useState();
  const dispatch = useDispatch();

  // get user profile data from store
  const { profileData, values } = useSelector((state) => {
    return { profileData: state.auth.profileData, values: state.iChatApp };
  }, shallowEqual);

  useEffect(() => {
    /* Group Created Socket Called */
    ChatAppSocket.on("groupCreated", (rcvData) => {
      if (rcvData?.error) {
        setDisabled(false);
        toast.warning(rcvData?.error, { toastId: 42 });
      }
      if (rcvData?.message) {
        setRowData([]);
        setDisabled(false);
        setCreateGroupModal(false);
        toast.success(rcvData?.message, { toastId: 43 });
      }
    });

    ChatAppSocket.on("getAllGroupMember", (allMember) => {
      setRowData(allMember);
      setSingleData({
        groupName: allMember[0]?.groupName,
        user: "",
        groupOwner: +allMember[0]?.groupOwner,
      });
      setDisabled(false);
    });

    ChatAppSocket.on("changeGroupNameOrImg", (res) => {
      if (res?.message) {
        dispatch(
          setSelectedGroupDataAction({
            ...values?.selectedGroupData,
            groupName: res?.groupName,
          })
        );
        toast.success(res?.message, { toastId: 42 });
        setDisabled(false);
        setCreateGroupModal(false);
      }
      if (res?.error) {
        toast.warning(res?.error, { toastId: 43 });
        setDisabled(false);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data?.groupId) {
      setDisabled(true);
      ChatAppSocket.emit("getAllGroupMember", {
        groupId: +data?.groupId,
        ownerId: profileData?.userAutoId,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.groupId]);

  const saveHandler = (values, cb) => {
    if (rowData?.length > 0) {
      if (data?.groupId) {
        const payload = {
          actionBy: +data?.actionBy,
          groupId: +data?.groupId,
          groupName: values?.groupName,
          ownerId: profileData?.userAutoId,
          actionByName: profileData?.fullname,
        };
        setDisabled(true);
        ChatAppSocket.emit("changeGroupNameOrImg", payload);
      } else {
        const payload = {
          groupName: values?.groupName,
          groupImg: "",
          actionBy: +profileData?.userAutoId,
          actionByName: profileData?.fullname,
          dateTime: `${moment().format("YYYY-MM-DD HH:mm:ss")}`,
          rowData,
        };
        setDisabled(true);
        ChatAppSocket.emit("createNewGroup", payload);
      }
    } else {
      toast.warning("Please add at least one user");
    }
  };

  return (
    <>
      {isDisabled && <Loading />}
      <Form
        initData={data?.groupId ? singleData : initData}
        saveHandler={saveHandler}
        rowData={rowData}
        isDisabled={isDisabled}
        setRowData={setRowData}
        isEdit={data?.groupId}
        setDisabled={setDisabled}
      />
    </>
  );
};

export default CreateGroupModal;
