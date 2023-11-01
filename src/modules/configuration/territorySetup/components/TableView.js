import React from "react";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import NoResult from "../../../../common/NoResult";
import AntTable from "../../../../common/AntTable";
import { tableViewCols } from "../helper";

const TableView = ({
  index,
  tabIndex,
  territoryType,
  loading,
  rowDto,
  handleSubmit,
  values,
  setFieldValue,
  errors,
  touched,
}) => {
  return (
    index === tabIndex && (
      <form onSubmit={handleSubmit}>
        <div className="card-style mb-2" style={{ marginTop: "13px" }}>
          <div className="row">
            <div className="col-lg-3 d-none">
              <div className="input-field-main">
                <label>Parent Territory</label>
                <FormikSelect
                  classes="input-sm"
                  styles={customStyles}
                  name="parentTerritory"
                  placeholder=""
                  options={[]}
                  value={values?.parentTerritory}
                  onChange={(valueOption) => {
                    setFieldValue("parentTerritory", valueOption);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="input-field-main">
                <label>Territory Type</label>
                <FormikSelect
                  classes="input-sm"
                  styles={customStyles}
                  name="territoryType"
                  placeholder=""
                  options={
                    [{ label: "All", value: "" }, ...territoryType] || []
                  }
                  value={values?.territoryType}
                  onChange={(valueOption) => {
                    setFieldValue("territoryType", valueOption);
                  }}
                  errors={errors}
                  touched={touched}
                  isClearable={false}
                />
              </div>
            </div>
            <div className="col-lg-1">
              <button
                style={{ marginTop: "21px" }}
                className="btn btn-green"
                onClick={() => {}}
              >
                View
              </button>
            </div>
          </div>
        </div>
        {rowDto?.length > 0 ? (
          <div className="table-card-styled tableOne employee-table-card tableOne  table-responsive">
            <AntTable data={rowDto} columnsData={tableViewCols()} />
          </div>
        ) : (
          !loading && <NoResult />
        )}
      </form>
    )
  );
};

export default TableView;
