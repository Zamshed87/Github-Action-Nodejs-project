import CheckIcon from '@material-ui/icons/Check';
import { Chip } from "@mui/material";
import { useState } from "react";

const CopyToClipboard = ({ children }) => {
  // const [play] = useSound(copySoundEffect);
  const [show, setShow] = useState(false);
  const copyFunc = (e) => {
    navigator.clipboard.writeText(children);
    e.stopPropagation();
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 1500);
  };

  return (
    <span
      onClick={(e) => {
        copyFunc(e);
        // play();
      }}
    >
      {children}
      {show ? (
        <>
          <span>
            <Chip
              size="small"
              sx={{
                marginLeft: "10px",
                "&.MuiChip-root": {
                  height: "18px",
                  fontSize: "12px",
                  color: "rgba(34, 154, 22, 1)",
                  backgroundColor: "rgba(228, 248, 221, 1)",
                  fontWeight: "550",
                  padding: "0px 5px 0px 0px",
                },
              }}
              icon={
                <CheckIcon
                  sx={{
                    fontSize: "10px",
                    color: "rgba(34, 154, 22, 1)",
                    "&.MuiChip-icon": {
                      color: "rgba(34, 154, 22, 1)",
                    },
                  }}
                />
              }
              label="Copied"
            />
          </span>
        </>
      ) : (
        <></>
      )}
    </span>
  );
};

export default CopyToClipboard;

//usage
/* <TableCell
  sx={{ width: "500px" }}
  onClick={(e) => e.stopPropagation()}
>
  <CopyToClipBoard>
    {item?.productionOrderCode}
  </CopyToClipBoard>
</TableCell> */
