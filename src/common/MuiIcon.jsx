import React from 'react';

export default function MuiIcon(props) {

   return (
      <>
         <div>
            {props?.icon}
         </div>
      </>
   );
}

/*
   Usage
   <Chips label="Busy" status={false} classes="mx-2" />
*/