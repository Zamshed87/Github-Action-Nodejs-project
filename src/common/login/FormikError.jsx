// Dont touch this file
import React from "react";
import { Error } from "@mui/icons-material";
const FormikError = ({ errors, name, touched }) => {
  const errorRowIndex = name?.split(".")[1];
  const errorRowName = name?.split(".")[2];
  const errorMasseage = errors?.itemLists?.[errorRowIndex]?.[`${errorRowName}`];
  const touchedMasseage = touched?.itemLists?.[errorRowIndex]?.[`${errorRowName}`];

  return (
    <p
      style={{
        fontSize: "12px",
        fontWeight: 400,
        lineHeight: "18px",
        width: "100%",
        marginTop: "5px",
        marginBottom: "0",
        textAlign: "left",
      }}
      className={errors?.[name] || errorMasseage ? "error" : "d-none"}
    >
      {errors && errors[name] && touched && touched[name] ? (
        <>
          <Error sx={{ fontSize: "14px", position: "relative", top: "-1px" }} /> {errors?.[name]?.value || errors?.[name]}
        </>
      ) : (
        ""
      )}

      {errors && errorMasseage && touched && touchedMasseage ? (
        <>
          <Error sx={{ fontSize: "14px", position: "relative", top: "-1px" }} /> {errorMasseage.value || errorMasseage}
        </>
      ) : (
        ""
      )}
    </p>
  );
};

export default FormikError;
