/* eslint-disable no-unused-vars */
import { useState } from "react";
import IConfirmModal from "../../common/IConfirmModal";
import PopOverMasterFilter from "../../common/PopoverMasterFilter";
import PrimaryButton from "../../common/PrimaryButton";
import CreateModalFormModule from "./CreateModalFormModule";
import DemoFilterModal from "./FilterModalModule";

export default function FeedBackDisplay({ index, tabIndex }) {
  // yes/no popup
  const demoPopup = () => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: "Do You Want To Save?",
      yesAlertFunc: () => {},
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  // Modal
  const [createModal, setCreateModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const handleCreateClose = () => setCreateModal(false);

  // Advanced Filter
  const [filterAnchorEl, setfilterAnchorEl] = useState(null);
  const [filterBages, setFilterBages] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const openFilter = Boolean(filterAnchorEl);
  const id = openFilter ? "simple-popover" : undefined;

  const [isFilter, setIsFilter] = useState(false);

  // const debounce = useDebounce()
  const handleSearch = (values) => {
    // getData(values);
    setFilterBages(values);
    setfilterAnchorEl(null);
  };

  const clearFilter = () => {
    setFilterBages({});
    setFilterValues("");
    // getData();
  };

  const clearBadge = (values, name) => {
    const data = values;
    data[name] = "";
    setFilterBages(data);
    setFilterValues(data);
    handleSearch(data);
  };
  const getFilterValues = (name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    index === tabIndex && (
      <>
        <div className="common-overview-part">
          <div className="common-overview-content">
            {/* Feedback Display */}
            <h2>Dialogs</h2>
            <div className="card p-2">
              <div className="d-flex mt-2 p-2">
                <div className="table-card-heading">
                  <h2>Dialogs</h2>
                </div>
              </div>
              <p className="text-subtitle">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta
                culpa consequuntur deserunt quo dolores ad. Rerum perferendis
                eum aliquid provident accusamus eaque voluptates, esse magni
                quae a animi enim consequatur saepe neque nesciunt culpa labore
                voluptatem odit velit facere!
              </p>
              <div className="d-flex ml-auto">
                {/* yes no pop up button */}
                <PrimaryButton
                  type="button"
                  className="btn btn-default flex-center mx-1"
                  label={"Yes/No Popup"}
                  onClick={(e) => {
                    demoPopup();
                  }}
                />
                {/* modal popup button */}
                <PrimaryButton
                  type="button"
                  className="btn btn-default flex-center mx-1"
                  label={"Modal Popup"}
                  onClick={(e) => {
                    setCreateModal(true);
                    setModalType("create");
                  }}
                />
                {/* filter popup button */}
                <PrimaryButton
                  type="button"
                  className="btn btn-default flex-center mx-1"
                  label={"Filter Popup"}
                  onClick={(e) => {
                    demoPopup();
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* View Form Modal */}
        <CreateModalFormModule
          show={createModal}
          title={"Demo Modal"}
          onHide={handleCreateClose}
          size="lg"
          backdrop="static"
          classes="default-modal"
          id={id}
        />

        <PopOverMasterFilter
          propsObj={{
            id,
            open: openFilter,
            anchorEl: filterAnchorEl,
            handleClose: () => setfilterAnchorEl(null),
            handleSearch,
            clearFilter,
            sx: {},
            size: "lg",
          }}
        >
          <DemoFilterModal
            propsObj={{
              getFilterValues,
              // setFieldValue,
              // values,
              // errors,
              // touched,
            }}
          ></DemoFilterModal>
        </PopOverMasterFilter>
      </>
    )
  );
}
