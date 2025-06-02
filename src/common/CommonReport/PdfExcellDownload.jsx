import DownloadIcon from "@mui/icons-material/Download";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Tooltip } from "antd";
import { downloadFile, getPDFAction } from "utility/downloadFile";
import { todayDate } from "utility/todayDate";
const PdfExcellDownload = ({
  data,
  setLoading,
  excelUrl,
  pdfUrl,
  reportName,
}) => {
  return (
    <div>
      {data && (
        <ul className="d-flex flex-row-reverse align-items-center justify-content-start">
          {excelUrl && (
            <li className="pr-2 ml-2">
              <Tooltip title="Download as Excel">
                <button
                  className="btn-save"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadFile(
                      excelUrl,
                      `${reportName}- ${todayDate()}`,
                      "xlsx",
                      setLoading
                    );
                  }}
                  style={{
                    border: "transparent",
                    width: "30px",
                    height: "30px",
                    background: "#f2f2f7",
                    borderRadius: "100px",
                  }}
                >
                  <DownloadIcon
                    sx={{
                      color: "#101828",
                      fontSize: "16px",
                    }}
                  />
                </button>
              </Tooltip>
            </li>
          )}
          {pdfUrl && (
            <li>
              <Tooltip title="Print as PDF">
                <button
                  className="btn-save"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    getPDFAction(pdfUrl, setLoading);
                  }}
                  // disabled={resDetailsReport?.length <= 0}
                  style={{
                    border: "transparent",
                    width: "30px",
                    height: "30px",
                    background: "#f2f2f7",
                    borderRadius: "100px",
                  }}
                >
                  <LocalPrintshopIcon
                    sx={{
                      color: "#101828",
                      fontSize: "16px",
                    }}
                  />
                </button>
              </Tooltip>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default PdfExcellDownload;
