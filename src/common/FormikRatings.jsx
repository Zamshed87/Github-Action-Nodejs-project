/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Box, Rating } from "@mui/material";

export default function FormikRatings(props) {
  const [hover, setHover] = useState(0);
  return (
    <>
      <Box sx={props?.ratingStyle}>
        <Rating
          name={props?.name}
          disabled={props?.disabled || false}
          value={props?.value ? +props?.value : 0}
          onChange={props?.onChange}
          onChangeActive={(event, newHover) => {
            setHover(newHover);
          }}
          sx={{
            "& .MuiRating-icon": {
              color: props?.color,
              fontSize: props?.ratingStyle?.fontSize,
            },
          }}
        />
      </Box>
    </>
  );
}

/*
   Usages

   <FormikRatings
      name="ratingsOne"
      value={values?.ratingsOne}
      color={blueColor}
      onChange={(e) => {
         setFieldValue("ratingsOne", +e.target.value);
      }}
      ratingStyle={{
         width: 200,
         display: 'block',
         alignItems: 'center',
      }}
   />

*/
