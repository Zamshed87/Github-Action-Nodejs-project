import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { PForm } from "Components";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const FlexibleTimeSheet = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Flexible Timesheet";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  return (
    <PForm
      initialValues={{
        department: null,
        supervisor: null,
        fDate: moment(),
        tDate: moment(),
      }}
    ></PForm>
  );
};

export default FlexibleTimeSheet;
