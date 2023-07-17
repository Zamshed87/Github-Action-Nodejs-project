import React, { useState } from 'react'
import Application from './application/Application';
import General from './application/General';
import Pipeline from './application/Pipeline';

export default function MasterFilterTabs({ propsObj }) {
   const [index, setIndex] = useState(0);
   const tabName = [{ name: "Applicaiton" }, { name: "Pipeline" }, { name: "General" }];
   return (
      <div className="filter-tabs">
         <div className="row-filter-tabs">
            <div className="row">
               <div className="col-md-3">
                  <div className="tabs-name">
                     {tabName.map((item, i) => {
                        return (
                           <button className={`btn btn-tab ${i === index && "btn btn-tab-active"}`} onClick={() => setIndex(i)}>
                              {item.name}
                           </button>
                        );
                     })}
                  </div>
               </div>
               <div className="col-md-9">
                  <div className="form-main">
                     <Application index={index} tabIndex={0} propsObj={propsObj} />
                     <Pipeline index={index} tabIndex={1} propsObj={propsObj} />
                     <General index={index} tabIndex={2} propsObj={propsObj} />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
