import { Popover } from "@mui/material";
import { useEffect, useState } from "react";
import MasterFilter from "../MasterFilter";
import Checkbox from "./checkbox";
import { uuid } from "./helper";
import { isDevServer } from "App";

const PopoverDropdown = ({
  id,
  open,
  anchorEl,
  setAnchorEl,
  currentFilterSelection,
  columnData,
  checkedHeaderList,
  setCheckedHeaderList,
  filterOrderList,
  setFilterOrderList,
  getFilteredData,
}) => {
  const [rowDto, setRowDto] = useState([]);
  const [temp, setTemp] = useState(checkedHeaderList);
  const [searchKey, setSearchKey] = useState("");
  const [reset, setReset] = useState(false);
  const [currentHeaderListSelection, setCurrentHeaderListSelection] =
    useState(checkedHeaderList);

  const handleSearch = (keywords) => {
    let v = `${columnData[currentFilterSelection]?.dataIndex}List`;
    if (!keywords) {
      setRowDto(temp[v]);
      return;
    }

    const regex = new RegExp(keywords?.toLowerCase());
    // let newData = columnData[
    //   currentFilterSelection
    // ]?.filterDropDownList?.filter(({ label }) =>
    //   regex.test(label.toLowerCase())
    // );
    // setRowDto(newData, columnData, checkedHeaderList);
    // let v = `${columnData[currentFilterSelection]?.dataIndex}List`;
    let newData = temp[v]?.filter(({ label }) =>
      regex.test(label.toLowerCase())
    );
    setRowDto(newData, columnData, checkedHeaderList);
  };

  const allDisable = () => {
    return filterOrderList?.length &&
      filterOrderList[filterOrderList?.length - 1] !==
        columnData[currentFilterSelection]?.dataIndex &&
      filterOrderList?.findIndex(
        (item) => item === columnData[currentFilterSelection]?.dataIndex
      ) !== -1
      ? true
      : false;
  };

  const resetButtonDisable = () => {
    return allDisable() ||
      !checkedHeaderList[`${columnData[currentFilterSelection]?.dataIndex}List`]
        ?.length
      ? true
      : false;
  };

  const okButtonDisable = () => {
    return allDisable() ||
      !currentHeaderListSelection[
        `${columnData[currentFilterSelection]?.dataIndex}List`
      ]?.length
      ? true
      : false;
  };

  const handleOkButtonClick = () => {
    if (
      currentHeaderListSelection[
        `${columnData[currentFilterSelection]?.dataIndex}List`
      ]?.length &&
      filterOrderList?.find(
        (prev) => prev === columnData[currentFilterSelection]?.dataIndex
      ) === undefined
    ) {
      setCheckedHeaderList((prev) => ({
        ...prev,
        [`${columnData[currentFilterSelection]?.dataIndex}List`]: [
          ...currentHeaderListSelection[
            `${columnData[currentFilterSelection]?.dataIndex}List`
          ],
        ],
      }));
      setFilterOrderList((prev) => [
        ...prev,
        columnData[currentFilterSelection]?.dataIndex,
      ]);
      getFilteredData(
        columnData[currentFilterSelection]?.dataIndex,
        [...filterOrderList, columnData[currentFilterSelection]?.dataIndex],
        {
          ...checkedHeaderList,
          [`${columnData[currentFilterSelection]?.dataIndex}List`]: [
            ...currentHeaderListSelection[
              `${columnData[currentFilterSelection]?.dataIndex}List`
            ],
          ],
        }
      );
    } else {
      setCheckedHeaderList((prev) => ({
        ...prev,
        [`${columnData[currentFilterSelection]?.dataIndex}List`]: [
          ...currentHeaderListSelection[
            `${columnData[currentFilterSelection]?.dataIndex}List`
          ],
        ],
      }));
      getFilteredData(
        columnData[currentFilterSelection]?.dataIndex,
        [...filterOrderList],
        {
          ...checkedHeaderList,
          [`${columnData[currentFilterSelection]?.dataIndex}List`]: [
            ...currentHeaderListSelection[
              `${columnData[currentFilterSelection]?.dataIndex}List`
            ],
          ],
        }
      );
    }
    setSearchKey("");
    setCurrentHeaderListSelection({});
    setAnchorEl(null);
  };

  useEffect(() => {
    if (currentFilterSelection) {
      setRowDto([...columnData[currentFilterSelection]?.filterDropDownList]);
      setTemp((prev) => {
        let v = `${columnData[currentFilterSelection]?.dataIndex}List`;
        return {
          ...prev,
          [`${columnData[currentFilterSelection]?.dataIndex}List`]: [
            ...new Set(
              [
                ...prev[v],
                ...columnData[currentFilterSelection]?.filterDropDownList,
              ].map((item) => JSON.stringify(item))
            ),
          ]?.map((obj) => JSON.parse(obj)),
        };
      });
    }
    setCurrentHeaderListSelection(checkedHeaderList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilterSelection, columnData[currentFilterSelection]?.filterDropDownList]);

  // useEffect(() => {
  //   if (currentFilterSelection) {
  //     setRowDto([...columnData[currentFilterSelection]?.filterDropDownList]);
  //   }
  //   setCurrentHeaderListSelection(checkedHeaderList);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentFilterSelection, columnData]);

  useEffect(() => {
    if (reset && currentFilterSelection !== -1) {
      setReset(false);
      getFilteredData(
        columnData[currentFilterSelection]?.dataIndex,
        [...filterOrderList],
        {
          ...checkedHeaderList,
          [`${columnData[currentFilterSelection]?.dataIndex}List`]: [],
        }
      );
      setAnchorEl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedHeaderList]);

  useEffect(() => {
    setCurrentHeaderListSelection(checkedHeaderList);
  }, [checkedHeaderList]);

  // console.log(columnData[currentFilterSelection]?.filterDropDownList);
  // useEffect(() => {
  //   setTemp((prev) => {
  //     return [...new Set([...prev, ...rowDto])];
  //   });
  // }, [rowDto]);


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
        setSearchKey("");
        setCurrentHeaderListSelection(checkedHeaderList);
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
          style={{
            height: "250px",
            width: "100%",
            padding: "0",
          }}
        >
          <div
            style={{
              paddingTop: "4px",
              paddingBottom: "55px",
              width: "100%",
            }}
          >
            {currentFilterSelection &&
              rowDto?.map((item) => (
                <Checkbox
                  key={uuid()}
                  rowDto={rowDto}
                  columnData={columnData}
                  currentFilterSelection={currentFilterSelection}
                  item={item}
                  currentHeaderListSelection={currentHeaderListSelection}
                  setCurrentHeaderListSelection={setCurrentHeaderListSelection}
                  isDisabled={allDisable()}
                />
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
              disabled={resetButtonDisable()}
              onClick={() => {
                if (
                  checkedHeaderList[
                    `${columnData[currentFilterSelection]?.dataIndex}List`
                  ]
                ) {
                  setCheckedHeaderList((prev) => ({
                    ...prev,
                    [`${columnData[currentFilterSelection]?.dataIndex}List`]:
                      [],
                  }));
                  setReset(true);
                  let v = `${columnData[currentFilterSelection]?.dataIndex}List`;

                  setRowDto(temp[v]);
                  // setRowDto([
                  //   `${columnData[currentFilterSelection]?.dataIndex}List`,
                  // ]);
                  // handleOkResetButtonClick();
                }
              }}
              style={{
                marginRight: "10px",
                cursor: `${resetButtonDisable() ? "not-allowed" : "pointer"}`,
              }}
            >
              Reset
            </button>
          </div>
          <div className="master-filter-btn-group">
            <button
              type="button"
              className="btn btn-green btn-green-disable"
              style={{
                width: "auto",
                cursor: `${okButtonDisable() ? "not-allowed" : "pointer"}`,
              }}
              disabled={okButtonDisable()}
              onClick={handleOkButtonClick}
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
