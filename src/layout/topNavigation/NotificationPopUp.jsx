import { Close } from "@mui/icons-material";
import { IconButton, LinearProgress, Popover } from "@mui/material";
import React, { useState } from "react";
import useDebounce from "../../utility/customHooks/useDebounce";
import Loading from "./../../common/loading/Loading";
import { blackColor60 } from "./../../utility/customColor";
import { getAllNotificationsActions } from "./helper";
import NotiBodyContent from "./NotiBodyContent";
import style from "./autoComplete.module.css";

const styleObj = {
  borderRadius: "50%",
  backgroundColor: "#eaf3ff",
  padding: "5px",
  marginTop: "5px",
  textAlign: "center",
  color: "blue",
  fontWeight: "bold",
  marginLeft: "5px",
  fontSize: "10px",
  width: "20px",
};

const NotificationPopUp = ({ propsObj }) => {
  const {
    id,
    open,
    anchorEl,
    handleClose,
    employeeId,
    orgId,
    buId,
    data,
    setData,
    loading,
    pageNo,
    setPageNo,
    pageSize,
    setLoading,
    filterLatestNthDayData,
  } = propsObj;

  const [notficationLoading, setNotificationLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const debounce = useDebounce();
  return (
    <Popover
      sx={{
        "& .MuiPaper-root": {
          minWidth: "346px",
          // maxHeight: "360px",
          // padding: "0px 5px",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      }}
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={() => {
        setLoadMore(false);
        handleClose();
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <div className="notification-popover">
        {loading && <Loading />}
        <div className="notification-popover-header">
          <h6>Notification</h6>
          <div className="notification-popover-header-icon">
            <IconButton
              onClick={(e) => {
                handleClose();
                setLoadMore(false);
                e.stopPropagation();
              }}
            >
              <Close sx={{ fontSize: "20px", color: blackColor60 }} />
            </IconButton>
          </div>
        </div>
        <div
          className="notification-popover-body-content"
          style={{ overflowY: "scroll", overflowX: "hidden", height: "360px" }}
          onScroll={(e) => {
            e.stopPropagation();
            anchorEl &&
              debounce(() => {
                setPageNo(pageNo + 1);
                getAllNotificationsActions(
                  data,
                  setData,
                  pageNo + 1,
                  pageSize,
                  employeeId,
                  orgId,
                  setNotificationLoading
                );
              }, 500);
          }}
        >
          {filterLatestNthDayData?.length > 0 && (
            <>
              <p className="py-1 px-1">
                <b>New <small>Last 3 days</small></b>
                <span style={styleObj}>{filterLatestNthDayData?.length}</span>
              </p>
              {filterLatestNthDayData
                ?.slice(0, !loadMore ? 2 : filterLatestNthDayData?.length)
                ?.map((item) => (
                  <NotiBodyContent
                    key={item?.id}
                    content={item}
                    buId={buId}
                    orgId={orgId}
                    handleClose={handleClose}
                    setLoading={setLoading}
                    data={data}
                    setData={setData}
                    employeeId={employeeId}
                  />
                ))}
              <p
                className={`${loadMore ? "d-none" : ""} ${
                  style?.notification_load_more_btn
                }`}
                onClick={() => setLoadMore(!loadMore)}
              >
                Load More {filterLatestNthDayData?.length - 2}
              </p>
            </>
          )}
          <p className={`py-1 px-1 ${data?.length > 0 ? "" : "d-none"}`}>
            <b>Earlier </b>
            <span style={styleObj}>{data?.length}</span>
          </p>
          {data?.map((item) => (
            <NotiBodyContent
              key={item?.id}
              content={item}
              buId={buId}
              orgId={orgId}
              handleClose={handleClose}
              setLoading={setLoading}
              data={data}
              setData={setData}
              employeeId={employeeId}
            />
          ))}
        </div>
        <div style={{ padding: "5px 0px" }} className="text-center my-5">
          {notficationLoading && <LinearProgress color="success" />}
        </div>
      </div>
    </Popover>
  );
};

export default NotificationPopUp;
