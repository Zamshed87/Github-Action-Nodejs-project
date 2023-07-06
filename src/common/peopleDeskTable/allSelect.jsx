import { gray900, greenColor } from "../../utility/customColor";
import FormikCheckBox from "../FormikCheckbox";
import { isAlreadyPresent } from './helper';

const AllSelect = ({
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
      name="allSelect"
      checked={
        rowDto?.length > 0 ? rowDto?.every((item) => item?.isSelected) : false
      }
      onChange={(e) => {
        let tempCheckedList = [...checkedList];
        const updatedData = rowDto?.map((item) => {
          const newItem = {
            ...item,
            isSelected: e.target.checked,
          };

          // Updating the checked list and rowDto state
          if (!e.target.checked) {
            tempCheckedList = tempCheckedList?.filter(
              (checkedItem) => checkedItem[uniqueKey] !== item[uniqueKey]
            );
            setCheckedList(tempCheckedList);
          } else if (isAlreadyPresent(item, checkedList, uniqueKey) === -1) {
            setCheckedList((prev) => [...prev, newItem]);
          }

          return newItem;
        });

        setRowDto(updatedData);
      }}
    />
  );
};

export default AllSelect;
