import moment from "moment";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { ProfilePicIcon } from "../../../api";

function SingleMember({
  item,
  index,
  removeHandler,
  removeHandlerCreate,
  leaveHandler,
  values,
  isEdit,
}) {
  // get user profile data from store
  const { profileData } = useSelector((state) => {
    return { profileData: state.auth.profileData };
  }, shallowEqual);

  return (
    <>
      <div
        onClick={() => {
          // dispatch(setSelectedUserDataAction(item));
          // dispatch(setPopUpStateAction("room"));
        }}
        className="singleInboxWrapper"
        style={{ cursor: "default" }}
      >
        <div style={{ width: "15%", position: "relative" }}>
          {/* If Image */}
          {/* <img
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "50%",
            }}
            src="https://avatars.githubusercontent.com/u/57855533?s=400&u=dbe46684e54ed5be402bd63d447daf45e84d28bb&v=4"
            alt="iamgurdeepEmdadul Hauqe"
          /> */}

          {/* Icon Of a user */}
          <ProfilePicIcon name={item?.strUserName} />

          {/* Is Active Small Dot Icon Design */}
          <div
            // className={item?.isOnline ? `animate-pulse` : ""}
            style={{
              backgroundColor: item?.isOnline ? "#10B981" : "lightgray",
              height: "15px",
              width: "15px",
              borderRadius: "50%",
              position: "absolute",
              bottom: "0px",
              right: "0px",
              marginRight: "20px",
              marginBottom: "1px",
              border: "2px solid white",
            }}
          ></div>
        </div>
        <div style={{ width: "85%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "60%",
                display: "flex",
                fontSize: "15px",
              }}
            >
              {item?.strUserName || ""}
            </div>

            {/* If Unseen Message Number greater Then 0 */}
            <div
              style={{ display: "flex", alignItems: "center", opacity: "55%" }}
            >
              <div>
                {item?.inboxCreatedDate
                  ? moment(
                      item?.inboxCreatedDate,
                      "YYYY-MM-DD HH:mm:ss"
                    ).format("lll")
                  : ""}
              </div>
            </div>
          </div>
          <div
            style={{
              color: "#9CA3AF",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                color: "#9CA3AF",
                fontWeight: "normal",
              }}
            >
              {item?.strBusinessUnitName?.slice(0, 24) || ""}{" "}
              {item?.strBusinessUnitName?.length > 24 ? "..." : ""}{" "}
              {`(${item?.strBusinessUnitCode})` || ""}
            </span>

            {+item?.intUserId === +values?.groupOwner ? (
              <span
                style={{
                  background: "#A7F3D0",
                  padding: "2px 8px",
                  borderRadius: "5px",
                  color: "darkslategray",
                }}
              >
                Owner
              </span>
            ) : (
              <>
                {+values?.groupOwner === profileData?.userAutoId ? (
                  <span
                    onClick={() => removeHandler(index, item)}
                    style={{ opacity: "" }}
                  >
                    <button className="btn btn-danger px-2 py-1">Remove</button>
                  </span>
                ) : null}

                {+item?.intUserId === profileData?.userAutoId ? (
                  <span
                    onClick={() => leaveHandler(index)}
                    style={{ opacity: "" }}
                  >
                    <button className="btn btn-danger px-2 py-1">Leave</button>
                  </span>
                ) : null}
              </>
            )}

            {!isEdit ? (
              <span
                onClick={() => removeHandlerCreate(index, item)}
                style={{ opacity: "" }}
              >
                <button className="btn btn-danger px-2 py-1">Remove</button>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleMember;
