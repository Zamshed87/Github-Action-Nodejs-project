import React from 'react';

function CalendarFooter() {
    return (
        <div id="calendar-footer" className="calendar-footer">
            <div className="color-all color-present">
                Present
            </div>
            <div className="color-all color-late">
                Late
            </div>
            <div className="color-all color-absent">
                Absent
            </div>
            <div className="color-all color-offday">
                Off Day
            </div>
            <div className="color-all color-holiday">
                Holiday
            </div>
            <div className="color-all color-leave">
                Leave
            </div>
            <div className="color-all color-movement">
                Movement
            </div>
            {/* <div className="color-all color-unprocessed">
                Unprocessed
            </div> */}
        </div>
    )
}

export default CalendarFooter
