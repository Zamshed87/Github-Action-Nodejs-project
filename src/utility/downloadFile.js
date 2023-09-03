import axios from "axios";
import { toast } from "react-toastify";

export const downloadFile = (url, fileName, extension, setLoading) => {
  setLoading && setLoading(true);
  axios({
    url: url,
    method: "GET",
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
    .catch((err) => {
      setLoading && setLoading(false);
    });
};

export const getPDFAction = async (url, setLoading) => {
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
        pdfWindow.location.href = fileURL;
      })
      .catch((error) => {
        setLoading(false);
        toast.warn(error?.response?.data?.message || "Failed, try again");
      });
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};
