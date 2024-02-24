import React from 'react';
import { useState } from 'react';
import AntTable from '../../../common/AntTable';
// import AvatarComponent from "../../../common/AvatarComponent";
import NoResult from '../../../common/NoResult';
import { mealColumns, mealColumnsType2 } from '../helper';
import AntScrollTable from '../../../common/AntScrollTable';

const CardTable = ({ propsObj, viewType }) => {
   const { rowDto } = propsObj;

   const [page, setPage] = useState(1);
   const [paginationSize, setPaginationSize] = useState(15);
   return (
     <>
       {rowDto?.length > 0 ? (
         <>
           {viewType === 2 ? (
             <div className="table-card-styled employee-table-card table-responsive ant-scrolling-Table">
               <AntScrollTable
                 data={rowDto}
                 columnsData={mealColumnsType2(page, paginationSize)}
                 setPage={setPage}
                 setPaginationSize={setPaginationSize}
               />
             </div>
           ) : (
             <div className="table-card-styled tableOne">
               <AntTable
                 data={rowDto}
                 columnsData={mealColumns(page, paginationSize)}
                 setPage={setPage}
                 setPaginationSize={setPaginationSize}
               />
             </div>
           )}
         </>
       ) : (
         <>
           <NoResult title="No Result Found" para="" />
         </>
       )}
     </>
   );
};

export default CardTable;
