import React from "react";
import { useDispatch } from "react-redux";
import { ProfilePicIcon } from "../../api";
import {
  setPopUpStateAction,
  setSelectedUserDataAction,
} from "../../redux/Action";

export default function SingleSearchUserCard({ item }) {
  const dispatch = useDispatch();

  return (
    <>
      <div
        onClick={() => {
          dispatch(
            setSelectedUserDataAction({
              intUserId: +item?.intUserId,
              strUserName: item?.strUserName,
            })
          );
          dispatch(setPopUpStateAction("room"));
        }}
        className="singleInboxWrapper"
      >
        <div
          style={{
            width: "15%",
          }}
        >
          {/* <img
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "50%",
              border: "2px solid #34a853",
            }}
            src="https://avatars.githubusercontent.com/u/57855533?s=400&u=dbe46684e54ed5be402bd63d447daf45e84d28bb&v=4"
            alt="iamgurdeepEmdadul Hauqe"
          /> */}
          <ProfilePicIcon name={item?.strUserName} />
        </div>
        <div
          style={{
            width: "85%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "80%",
                fontSize: "15px",
              }}
            >
              {item?.strUserName || ""}
            </div>
          </div>
          <div
            style={{
              color: "#9CA3AF",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              {item?.strBusinessUnitName} {`(${item?.strBusinessUnitCode})`}
            </span>
            {/* <span style={{ opacity: "" }}>9.00 AM</span> */}
          </div>
        </div>
      </div>
    </>
  );
}

export const SingleUserCardDemoForLoading = () => {
  return (
    <>
      {[...Array(4)].map((item, index) => (
        <div key={index} className="singleInboxWrapper animate-pulse">
          <div
            style={{
              width: "15%",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#F3F4F6",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "17px",
                fontWeight: "500",
              }}
            ></div>
          </div>
          <div
            style={{
              width: "85%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: "80%",
                  fontSize: "15px",
                  height: "20px",
                  backgroundColor: "#F3F4F6",
                  marginBottom: "5px",
                }}
              ></div>
            </div>
            <div
              style={{
                color: "#9CA3AF",
                display: "flex",
                justifyContent: "space-between",
                height: "20px",
                width: "100%",
                backgroundColor: "#F3F4F6",
              }}
            ></div>
          </div>
        </div>
      ))}
    </>
  );
};
