import { Popover } from "@mui/material";
import { useEffect, useState } from "react";
import FormikCheckBox from "../../../common/FormikCheckbox";
import MasterFilter from "../../../common/MasterFilter";
import { gray900, greenColor } from "../../../utility/customColor";

const PopoverDropdown = ({
  id,
  open,
  anchorEl,
  setAnchorEl,
  currentFilterSelection,
  columnData,
  checkedHeaderList,
  setCheckedHeaderList,
  getFilteredData,
}) => {
  const [rowDto, setRowDto] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const handleSearch = (keywords) => {
    if (!keywords) {
      setRowDto(columnData[currentFilterSelection].filterDropDownList);
      return;
    }

    const regex = new RegExp(keywords?.toLowerCase());
    let newData = columnData[currentFilterSelection].filterDropDownList?.filter(
      ({ label }) => regex.test(label.toLowerCase())
    );
    setRowDto(newData);
  };

  useEffect(() => {
    if (currentFilterSelection) {
      setRowDto([...columnData[currentFilterSelection].filterDropDownList]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilterSelection]);

  return (
    <Popover
      sx={{
        "& .MuiPaper-root": {
          width: "250px",
          minHeight: "200px",
          borderRadius: "4px",
        },
      }}
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={() => {
        setAnchorEl(null);
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <div
        className="master-filter-modal-container employeeProfile-src-filter-main"
        style={{ height: "auto" }}
      >
        <div className="master-filter-header employeeProfile-src-filter-header">
          <div style={{ padding: "10px 0px", width: "100%" }}>
            <MasterFilter
              isHiddenFilter
              styles={{
                marginRight: "0px",
              }}
              width="100%"
              inputWidth="200px"
              value={searchKey}
              setValue={(value) => {
                setSearchKey(value);
                handleSearch(value);
              }}
              cancelHandler={() => {
                setSearchKey("");
                handleSearch("");
              }}
            />
          </div>
        </div>
        <hr />

        <div
          className="body-employeeProfile-master-filter"
          style={{ height: "250px", paddingBottom: "55px" }}
        >
          <div>
            {currentFilterSelection &&
              rowDto?.map((item) => (
                <div
                  style={{
                    marginBottom: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                  className="small-checkbox"
                >
                  <FormikCheckBox
                    styleObj={{
                      margin: "0 auto!important",
                      padding: "0 !important",
                      color: gray900,
                      checkedColor: greenColor,
                    }}
                    name="selectCheckbox"
                    checked={
                      checkedHeaderList[
                        `${columnData[currentFilterSelection].dataIndex}List`
                      ]?.length
                        ? checkedHeaderList[
                          `${columnData[currentFilterSelection].dataIndex}List`
                        ].find((value) => value === item.value)
                          ? true
                          : false
                        : false
                    }
                    onChange={(e) => {
                      const prevSelected =
                        checkedHeaderList[
                        `${columnData[currentFilterSelection].dataIndex}List`
                        ] || [];

                      if (!e.target.checked) {
                        const updatedList = checkedHeaderList[
                          `${columnData[currentFilterSelection].dataIndex}List`
                        ]
                          .filter((value) => value !== item.value)
                          ?.map((value) => value);

                        setCheckedHeaderList((prev) => ({
                          ...prev,
                          [`${columnData[currentFilterSelection].dataIndex}List`]:
                            updatedList,
                        }));
                      } else {
                        setCheckedHeaderList((prev) => ({
                          ...prev,
                          [`${columnData[currentFilterSelection].dataIndex}List`]:
                            [...prevSelected, item.value],
                        }));
                      }
                    }}
                  />
                  <p>{item.label}</p>
                </div>
              ))}
          </div>
        </div>
        <div
          className="master-filter-bottom footer-employeeProfile-src-filter justify-content-between"
          style={{ padding: "10px 15px" }}
        >
          <div className="master-filter-btn-group">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={(e) => {
                e.stopPropagation();

                if (
                  checkedHeaderList[
                  `${columnData[currentFilterSelection].dataIndex}List`
                  ]
                ) {
                  setCheckedHeaderList((prev) => ({
                    ...prev,
                    [`${columnData[currentFilterSelection].dataIndex}List`]: [],
                  }));
                }
              }}
              style={{
                marginRight: "10px",
              }}
            >
              Reset
            </button>
          </div>
          <div className="master-filter-btn-group">
            <button
              type="button"
              className="btn btn-green btn-green-disable"
              style={{ width: "auto" }}
              onClick={() => {
                getFilteredData();
                setAnchorEl(null);
              }}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </Popover>
  );
};

export default PopoverDropdown;
