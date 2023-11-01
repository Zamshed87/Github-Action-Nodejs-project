import React, { useState } from 'react';
import DataDisplay from './dataDisplay';
import FormInputDisplay from './formInputDisplay';
import FeedBackDisplay from './feedbackDisplay';
import ColorSystem from './colorSystem';

export default function OverviewTab() {
  const [index, setIndex] = useState(0);
  const tabName = [
    { name: "Inputs" },
    { name: "Data display" },
    { name: "Feedback" },
    { name: "Color" },
  ];
  return (
    <>
      <div className="overview-filter">
        <div className="filter-tabs">
          <div className="row-filter-tabs">
            <div className="row">
              <div className="col-md-3">
                <div className="tabs-name">
                  {tabName.map((item, i) => {
                    return (
                      <button
                        key={i}
                        className={`btn btn-tab ${i === index && "btn btn-tab-active"
                          }`}
                        onClick={() => setIndex(i)}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="col-md-9">
                <div className="form-main">
                  <FormInputDisplay index={index} tabIndex={0} />
                  <DataDisplay index={index} tabIndex={1} />
                  <FeedBackDisplay index={index} tabIndex={2} />
                  <ColorSystem index={index} tabIndex={3} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
