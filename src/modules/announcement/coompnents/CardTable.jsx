import styled from "@emotion/styled";
import { CreateOutlined, DeleteOutlined } from "@mui/icons-material";
import { Tooltip, tooltipClasses } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import NoResult from "../../../common/NoResult";
import { dateFormatterForInput } from "../../../utility/dateFormatter";
import { stripHtml } from "../../../utility/stripHTML";
import { getSingleAnnouncementDeleteData } from "../helper";

const CardTable = ({ propsObj }) => {
  const history = useHistory();

  const { rowDto, demoPopup, permission } = propsObj;

  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#fff !important",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#fff",
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow:
        "0px 1px 5px rgba(0, 0, 0, 0.05), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 1px 5px rgba(0, 0, 0, 0.05)",
      fontSize: 11,
    },
  }));

  return (
    <div className="table-card-styled tableOne">
      {rowDto?.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: "30px" }}>
                <div>SL</div>
              </th>
              <th>
                <div>Announcement Title</div>
              </th>
              <th>
                <div>Announcement Body</div>
              </th>
              <th>
                <div>Publish Date</div>
              </th>
              <th>
                <div>Expired Date</div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rowDto?.length > 0 &&
              rowDto?.map((data, index) => (
                <tr
                  className="hasEvent"
                  onClick={() =>
                    history.push({
                      pathname: `/administration/announcement/${data?.intAnnouncementId}`,
                      state: data,
                    })
                  }
                  key={index}
                >
                  <td className="tableBody-title">
                    <div className="content tableBody-title pl-1">
                      {index + 1}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center justify-content-between">
                      <LightTooltip title={data?.strTitle} arrow>
                        <span className="content tableBody-title pointer">
                          {data?.strTitle?.length > 15
                            ? data?.strTitle?.slice(0, 15) + "..."
                            : data?.strTitle}
                        </span>
                      </LightTooltip>
                    </div>
                  </td>
                  <td>
                    <LightTooltip title={stripHtml(data?.strDetails)} arrow>
                      <div className="content tableBody-title pointer">
                        {stripHtml(data?.strDetails.slice(0, 120))}
                        {stripHtml(data?.strDetails.length > 120 ? "..." : "")}
                      </div>
                    </LightTooltip>
                  </td>
                  <td>
                    <div className="tableBody-title">
                      {dateFormatterForInput(data?.dteCreatedAt)}
                    </div>
                  </td>
                  <td>
                    <div className="tableBody-title">
                      {dateFormatterForInput(data?.dteExpiredDate)}
                    </div>
                  </td>
                  <td width="10%">
                    <div className="d-flex align-items-center">
                      <Tooltip title="Edit" arrow>
                        <button
                          type="button"
                          className="iconButton"
                          onClick={(e) => {
                            e.stopPropagation();
                            // resetForm(initData);
                            // if (!permission?.isEdit)
                            //   return toast.warn("You don't have permission");
                            // setIsEdit(true);
                            // scrollRef.current.scrollIntoView({
                            //   behavior: "smooth",
                            // });
                            // setValues({
                            //   id: data?.intAnnouncementId,
                            //   title: data?.strTitle,
                            //   body: data?.strDetails,
                            //   date: dateFormatterForInput(data?.dteExpiredDate),
                            //   insertDate: dateFormatterForInput(
                            //     data?.dteCreatedAt
                            //   ),
                            // });
                            history.push({
                              pathname: `/administration/announcement/edit/${data?.intAnnouncementId}`,
                              state: data,
                            });
                          }}
                        >
                          <CreateOutlined />
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <button
                          type="button"
                          className="iconButton mt-0 mt-md-2 mt-lg-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!permission?.isClose)
                              return toast.warn("You don't have permission");
                            getSingleAnnouncementDeleteData(
                              data?.intAnnouncementId,
                              (res) => demoPopup(res)
                            );

                          }}
                        >
                          <DeleteOutlined />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <>{<NoResult title="No Result Found" para="" />}</>
      )}
    </div>
  );
};

export default CardTable;
