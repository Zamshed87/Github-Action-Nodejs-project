import axios from "axios";
import { toast } from "react-toastify";

export const getUserListForChatByAccountIdAsync = async (
  accountId,
  userId,
  searchText,
  pageNo,
  pageSize,
  setChattingUserListByUserIdPagination,
  setLoading,
  setHasMore,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/ChattingApp/GetUserListForChatByAccountIdAsync?accountId=${accountId}&userId=${userId}&searchText=${searchText}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
    setLoading?.(false);
    if (res?.data?.length) {
      setHasMore(true);
      setChattingUserListByUserIdPagination?.([...res?.data]);
      cb?.(res?.data);
    } else {
      setHasMore(false);
    }
  } catch (error) {
    setLoading?.(false);
  }
};

export const dateToTicks = (date) => {
  const epochOffset = 621355968000000000;
  const ticksPerMillisecond = 10000;

  const ticks = date.getTime() * ticksPerMillisecond + epochOffset;

  return ticks;
};

export const getChattingUserListByUserIdPaginationAsync = async (
  accountId,
  userId,
  pageNo,
  pageSize,
  setChattingUserListByUserIdPagination,
  setLoading,
  setHasMore,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/ChattingApp/GetChattingUserListByUserIdPaginationAsync?accountId=${accountId}&userId=${userId}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
    setLoading?.(false);
    if (res?.data?.length) {
      setChattingUserListByUserIdPagination?.([...res?.data]);
      cb?.(res?.data);

      setHasMore(true);
      setLoading?.(false);
    } else {
      setHasMore(false);
    }
  } catch (error) {
    setLoading?.(false);
  }
};

export const getMessageListBySenderNReceiverIdPaginationAsync = async (
  accountId,
  senderId,
  receiverId,
  receiverGroupId,
  pageNo,
  pageSize,
  setMessageList,
  setLoading,
  cb
) => {
  setLoading?.(true);
  try {
    const res = await axios.get(
      `/ChattingApp/GetMessageListBySenderNReceiverIdPaginationAsync?accountId=${accountId}&senderId=${senderId}&receiverId=${receiverGroupId?senderId:receiverId}&receiverGroupId=${+receiverGroupId}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
    setLoading?.(false);
    if (res?.data?.length) {
      setMessageList && setMessageList(res?.data);
      cb?.(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading?.(false);
  }
};

export const seenNUnseenMessageStatusUpdate = (
  accountId,
  senderId,
  receiverId,
  receiverGroupId
) => {
  try {
    axios.get(
      `/ChattingApp/SeenNUnseenMessageStatusUpdate?accountId=${accountId}&senderId=${senderId}&receiverId=${receiverId}&receiverGroupId=${receiverGroupId}`
    );
  } catch (error) {}
};

export const sendMessageToSingleUserByUsernameAsync = async (payload,cb) => {
  
  try {
    const res = await axios.post(
      `/ChattingApp/SendMessageToSingleUserByUsername`,
      payload
    );
    if (res?.data) {
      cb(res?.data);
    }
  } catch (error) {
    toast.info("Failed to send message !!!", {
      autoClose: 2000,
      limit: 10,
      closeOnClick: true,
      newestOnTop: true,
    });
  }
};
export const SendMessageToSingleUserByUsernameReact = async (payload) => {
  try {
    await axios.post(
      `/ChattingApp/SendMessageToSingleUserByUsernameReact`,
      payload
    );
  } catch (error) {
    toast.info("Failed to send message !!!", {
      autoClose: 2000,
      limit: 10,
      closeOnClick: true,
      newestOnTop: true,
    });
  }
};

export const createGroup = async (payload,cb,setLoading) => {
  setLoading(true)
  try {
    const res = await axios.post(
      `/ChattingApp/CreateGroup`,
      payload
    );
    if (res?.data) {
      cb(res?.data);
    }
    
  } catch (error) {
    toast.info("Failed to send message !!!", {
      autoClose: 2000,
      limit: 10,
      closeOnClick: true,
      newestOnTop: true,
    });
  }
};