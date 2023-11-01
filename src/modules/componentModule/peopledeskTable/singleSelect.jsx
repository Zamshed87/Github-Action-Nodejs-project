import FormikCheckBox from "../../../common/FormikCheckbox";
import { gray900, greenColor } from "../../../utility/customColor";
import { isAlreadyPresent } from "./helper";

const SingleSelect = ({
  index,
  rowDto,
  setRowDto,
  checkedList,
  setCheckedList,
  uniqueKey,
}) => {
  return (
    <FormikCheckBox
      styleObj={{
        margin: "0 auto!important",
        padding: "0 !important",
        color: gray900,
        checkedColor: greenColor,
      }}
      name="selectCheckbox"
      checked={rowDto[index]?.isSelected}
      onChange={(e) => {
        let tempRowDto = [...rowDto];
        tempRowDto[index].isSelected = e.target.checked;
        setRowDto(tempRowDto);

        const idx = isAlreadyPresent(rowDto[index], checkedList, uniqueKey);
        if (idx === -1)
          setCheckedList((prev) => [
            ...prev,
            {
              ...rowDto[index],
              isSelected: e.target.checked,
            },
          ]);
        else {
          let updatedChecked = [...checkedList];
          updatedChecked.splice(idx, 1);
          setCheckedList(updatedChecked);
        }
      }}
    />
  );
};

export default SingleSelect;
