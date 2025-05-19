import { Card } from "antd";
import { PButton, PInput } from "Components";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { useFormik } from "formik";
import * as Yup from "yup";
import { dateFormatter } from "utility/dateFormatter";
import DefaultInput from "common/DefaultInput";

export default function ReleaseViewModal({
  id,
  getData,
  applicationdate,
  lastWorkingDate,
}) {
  const [, postReleaseData] = useAxiosPost();

  const { setFieldValue, values, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: {
      releaseDate: "",
      releaseRemarks: "",
    },
    validationSchema: Yup.object().shape({
      releaseDate: Yup.date().required("Release date is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      if (id) {
        const payload = {
          IntSeparationId: id,
          DteReleaseDate: values?.releaseDate,
          StrReleaseRemarks: values?.releaseRemarks,
          IsReleased: true,
        };
        postReleaseData(
          `Separation/ReleasedSeparation`,
          payload,
          () => {
            getData();
            resetForm();
          },
          true
        );
      }
    },
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div
          className="d-flex justify-content-end align-items-center"
          style={{ marginBottom: "10px" }}
        >
          <PButton
            type="primary"
            content={<div style={{ fontSize: "10px" }}>Release</div>}
            onClick={handleSubmit}
          />
        </div>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  marginBottom: "5px",
                }}
              >
                Employee Release Date <span style={{ color: "red" }}>*</span>
              </p>
              <DefaultInput
                classes="input-sm"
                value={values?.releaseDate}
                type="date"
                style={{ marginBottom: "0px" }}
                onChange={(e) => {
                  setFieldValue("releaseDate", e.target.value);
                }}
              />
            </div>
            <div>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  marginBottom: "5px",
                }}
              >
                Comments
              </p>
              <div style={{ marginBottom: "12px" }}>
                <PInput
                  type="text"
                  name="releaseRemarks"
                  onChange={(e) =>
                    setFieldValue("releaseRemarks", e.target.value)
                  }
                  value={values?.releaseRemarks}
                />
              </div>
            </div>
            <div>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  marginBottom: "5px",
                }}
              >
                Application Date
              </p>
              <p style={{ color: "gray", marginBottom: "12px" }}>
                {dateFormatter(applicationdate)}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  marginBottom: "5px",
                }}
              >
                Last Working Date
              </p>
              <p style={{ color: "gray", marginBottom: "12px" }}>
                {dateFormatter(lastWorkingDate)}
              </p>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
