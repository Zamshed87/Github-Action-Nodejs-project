import { Room } from "@mui/icons-material";
import React from "react";
import { useHistory } from "react-router-dom";
import Dialogs from "./../../../common/Dialogs";
import IConfirmModal from "./../../../common/IConfirmModal";

export default function DialogsModule() {
  const history = useHistory();
  const demoPopup = () => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: "Discard draft?",
      yesAlertFunc: () => {},
      noAlertFunc: () => {
        history.push("/components/dialogs");
      },
    };
    IConfirmModal(confirmObject);
  };
  return (
    <>
      <h2>Dialogs</h2>
      <div className="container-fluid">
        <div className="my-3">
          <div className="dialogs-module custom-grid">
            <Dialogs
              headerCenter={false}
              title={"Subtitle 1"}
              para={
                "Body 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
              }
              buttonRight={true}
              dialogYes={() => {
                demoPopup();
              }}
              dialogNo={() => {
                demoPopup();
              }}
            />
            <Dialogs
              headerCenter={true}
              icon={<Room sx={{ fontSize: "20px" }} />}
              title={"Subtitle 1"}
              para={
                "Body 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
              }
              buttonRight={true}
              dialogYes={() => {
                demoPopup();
              }}
              dialogNo={() => {
                demoPopup();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
