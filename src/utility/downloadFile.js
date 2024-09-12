import axios from "axios";
import { toast } from "react-toastify";

export const downloadFile = (
  url,
  fileName,
  extension,
  setLoading,
  method = "GET"
) => {
  setLoading && setLoading(true);
  axios({
    url: url,
    method: method,
    responseType: "blob", // important
  })
    .then((response) => {
      const urlTwo = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlTwo;
      //   const fileExtension = imageView?.type.split('/')[1];
      link.setAttribute("download", fileName);
      link.setAttribute("download", `${fileName}.${extension}`);
      document.body.appendChild(link);
      setLoading && setLoading(false);
      link.click();
    })
    .catch(() => {
      setLoading && setLoading(false);
    });
};

export const getPDFAction = async (url, setLoading, fileName = "") => {
  try {
    setLoading(true);
    await axios
      .get(url, {
        responseType: "blob",
      })
      .then((response) => {
        setLoading(false);
        //Create a Blob from the PDF Stream
        const file = new Blob([response.data], { type: "application/pdf" });
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
        const pdfWindow = window.open();

        if (pdfWindow) {
          // Navigate the window to the PDF URL
          pdfWindow.location.href = fileURL;
        } else {
          console.log(fileName);
          // Create a temporary link element
          const link = document.createElement("a");
          link.href = fileURL;
          link.target = "_blank";
          link.download = fileName ? fileName : "file.pdf";
          // Programmatically click the link to trigger the download
          document.body.appendChild(link);
          link.click();
          // // Clean up
          document.body.removeChild(link);
          URL.revokeObjectURL(fileURL);
        }
      })
      .catch((error) => {
        console.log("inner error", error);
        setLoading(false);
        toast.warn(error?.response?.data?.message || "Failed, try again");
      });
  } catch (error) {
    console.log("root error", error);

    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};
