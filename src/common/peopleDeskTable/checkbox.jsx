import { useState, useEffect } from "react";
import { greenColor, success25 } from "../../utility/customColor";
import { RiCheckboxBlankLine, RiCheckboxFill } from "react-icons/ri";

const Checkbox = ({
  columnData,
  currentFilterSelection,
  item,
  currentHeaderListSelection,
  setCurrentHeaderListSelection,
  isDisabled,
}) => {
  const [checked, setChecked] = useState(
    currentHeaderListSelection[
      `${columnData[currentFilterSelection]?.dataIndex}List`
    ]?.length
      ? currentHeaderListSelection[
          `${columnData[currentFilterSelection]?.dataIndex}List`
        ]?.find((value) => value === item.value)
        ? true
        : false
      : false
  );

  useEffect(() => {
    setChecked(
      currentHeaderListSelection[
        `${columnData[currentFilterSelection]?.dataIndex}List`
      ]?.length
        ? currentHeaderListSelection[
            `${columnData[currentFilterSelection]?.dataIndex}List`
          ]?.find((value) => value === item.value)
          ? true
          : false
        : false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHeaderListSelection]);

  return (
    <button
      style={{
        marginBottom: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: checked ? success25 : "",
        padding: "4px 10px 4px 18px",
        width: "100%",
        cursor: `${isDisabled ? "not-allowed" : "pointer"}`,
        border: "none",
      }}
      disabled={isDisabled}
      className="small-checkbox"
      onClick={() => {
        const prevSelected =
          currentHeaderListSelection[
            `${columnData[currentFilterSelection]?.dataIndex}List`
          ] || [];

        if (checked) {
          const updatedList = currentHeaderListSelection[
            `${columnData[currentFilterSelection]?.dataIndex}List`
          ]?.filter((value) => value !== item.value);

          setCurrentHeaderListSelection((prev) => ({
            ...prev,
            [`${columnData[currentFilterSelection]?.dataIndex}List`]:
              updatedList,
          }));
        } else {
          setCurrentHeaderListSelection((prev) => ({
            ...prev,
            [`${columnData[currentFilterSelection]?.dataIndex}List`]: [
              ...prevSelected,
              item.value,
            ],
          }));
        }
        setChecked((prev) => !prev);
      }}
    >
      {!checked ? (
        <RiCheckboxBlankLine />
      ) : (
        <RiCheckboxFill style={{ color: greenColor }} />
      )}
      <p style={{ paddingLeft: "8px" }}>{item.label}</p>
    </button>
  );
};

export default Checkbox;
