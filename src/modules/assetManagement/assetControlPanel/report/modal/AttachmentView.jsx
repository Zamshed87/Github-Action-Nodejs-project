import React, { useEffect, useState } from "react";
import { AttachmentOutlined } from "@mui/icons-material";
import Loading from "common/loading/Loading";
import PeopleDeskTable from "common/peopleDeskTable";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import { useDispatch } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { documentAttachmentColumn } from "../utils";
import NoResult from "common/NoResult";

const AttachmentView = ({ assetId }) => {
  const dispatch = useDispatch();
  const [rowDto, setRowDto] = useState([]);
  const [singleData, getSingleData, loading, setSingleData] = useAxiosGet({});

  useEffect(() => {
    if (assetId) {
      getSingleData(
        `AssetManagement/GetAssetDocumentUploadService?intAssetId=${assetId}`,
        (res) => {
          setSingleData(res);
          setRowDto(res?.multipleDocument || []);
        }
      );
    }
  }, [assetId]);

  return (
    <>
      {loading && <Loading />}
      <div className="row mr-3 ml-3 mb-3">
        <div className="col-lg-12">
          {singleData?.globalImageUrlID ? (
            <div className="d-flex mb-2 pointer">
              <div>
                <span className="mr-2">Asset Image</span>
              </div>
              <div
                className="d-inline-block"
                onClick={() => {
                  dispatch(
                    getDownlloadFileView_Action(singleData?.globalImageUrlID)
                  );
                }}
              >
                <div
                  className="d-flex align-items-center"
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#0072E5",
                    cursor: "pointer",
                  }}
                >
                  <AttachmentOutlined
                    sx={{ marginRight: "5px", color: "#0072E5" }}
                  />
                  {singleData?.attachmentName || "Attachment"}
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="col-lg-12">
          <div className="table-card-body">
            {rowDto?.length > 0 ? (
              <PeopleDeskTable
                columnData={documentAttachmentColumn(
                  dispatch,
                  rowDto,
                  setRowDto,
                  "view"
                )}
                rowDto={rowDto}
                setRowDto={setRowDto}
                uniqueKey="itemId"
                isPagination={false}
              />
            ) : (
              <>
                {!loading && (
                  <div className="col-12">
                    <NoResult title={"No Data Found"} para={""} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AttachmentView;
