import React from 'react';
import { gray100, gray200, gray25, gray300, gray400, gray50, gray500, gray600, gray700, gray800, gray900, success100, success200, success25, success300, success400, success50, success500, success600, success700, success800, success900, whiteColor } from '../../utility/customColor';

export default function ColorSystem({ index, tabIndex }) {
  return (
    index === tabIndex && (
      <>
        <div className="common-overview-part">
          <div className="common-overview-content">
            {/* color */}
            <div>
              <div className="table-card-heading mt-3">
                <h2>Color</h2>
              </div>
              <div className="d-flex flex-wrap justify-content-between my-2">
                <div
                  className="color-item mb-2"
                  style={{
                    color: gray500,
                    background: gray25
                  }}
                >
                  gray25
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: gray500,
                    background: gray50
                  }}
                >
                  gray50
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: gray500,
                    background: gray100
                  }}
                >
                  gray100
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: gray500,
                    background: gray200
                  }}
                >
                  gray200
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: whiteColor,
                    background: gray300
                  }}
                >
                  gray300
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: whiteColor,
                    background: gray400
                  }}
                >
                  gray400
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: whiteColor,
                    background: gray500
                  }}
                >
                  gray500
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: whiteColor,
                    background: gray600
                  }}
                >
                  gray600
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: whiteColor,
                    background: gray700
                  }}
                >
                  gray700
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: whiteColor,
                    background: gray800
                  }}
                >
                  gray800
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: whiteColor,
                    background: gray900
                  }}
                >
                  gray900
                </div>
              </div>
              <div className="d-flex flex-wrap justify-content-between my-2">
                <div
                  className="color-item mb-2"
                  style={{
                    color: success700,
                    background: success25
                  }}
                >
                  success25
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: success700,
                    background: success50
                  }}
                >
                  success50
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: success700,
                    background: success100
                  }}
                >
                  success100
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: success700,
                    background: success200
                  }}
                >
                  success200
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: whiteColor,
                    background: success300
                  }}
                >
                  success300
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: whiteColor,
                    background: success400
                  }}
                >
                  success400
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: whiteColor,
                    background: success500
                  }}
                >
                  success500
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: whiteColor,
                    background: success600
                  }}
                >
                  success600
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: whiteColor,
                    background: success700
                  }}
                >
                  success700
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: whiteColor,
                    background: success800
                  }}
                >
                  success800
                </div>
                <div
                  className="color-item mb-2"
                  style={{
                    color: whiteColor,
                    background: success900
                  }}
                >
                  success900
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
}
