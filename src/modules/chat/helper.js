import axios from "axios";

export const getUsersList = async (setLoading, setter, orgId) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/Auth/UserLanding?AccountId=${orgId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const updateSeenMessageAction = async (fromUserId, toUserId, getUser) => {
  try {
    await axios.post(`http://localhost:5000/updateSeenMessage`, {
      fromUserId,
      toUserId,
    });
    getUser()
  } catch (error) {}
};

export const getAllMessageListAction = async (
  setLoading,
  setter,
  orgId,
  fromUserId,
  toUserId,
  scrollToBottom
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `http://localhost:5000/messageList/${orgId}/${fromUserId}/${toUserId}`
    );
    setter(res?.data);
    scrollToBottom();
    // setTimeout(() => {

    // }, 200);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
