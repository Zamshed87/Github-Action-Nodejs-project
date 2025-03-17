const borderTypes = [
    'thin',
    'dotted',
    'dashDot',
    'hair',
    'dashDotDot',
    'slantDashDot',
    'mediumDashed',
    'mediumDashDotDot',
    'mediumDashDot',
    'medium',
    'double',
    'thick'
  ];
  
  export const getBorder = borderInfo => {
    const _borderDefinations = borderInfo.split(':');
    if (_borderDefinations[0].split(' ')[0] === 'all') {
      const _borderData = _borderDefinations[0].split(' ');
      if (_borderData?.length === 2) {
        return borderTypes.includes(_borderData[1])
          ? {
              top: { style: _borderData[1] },
              left: { style: _borderData[1] },
              bottom: { style: _borderData[1] },
              right: { style: _borderData[1] }
            }
          : {
              top: { color: { argb: _borderData[1] }, style: 'thin' },
              left: { color: { argb: _borderData[1] }, style: 'thin' },
              bottom: { color: { argb: _borderData[1] }, style: 'thin' },
              right: { color: { argb: _borderData[1] }, style: 'thin' }
            };
      } else {
        return {
          top: { color: { argb: _borderData[1] }, style: _borderData[2] },
          left: { color: { argb: _borderData[1] }, style: _borderData[2] },
          bottom: { color: { argb: _borderData[1] }, style: _borderData[2] },
          right: { color: { argb: _borderData[1] }, style: _borderData[2] }
        };
      }
    } else {
      const obj = {};
      _borderDefinations.forEach(item => {
        const _singleBorderDef = item.split(' ');
        // eslint-disable-next-line default-case
        switch (_singleBorderDef?.length) {
          case 1:
            obj[_singleBorderDef[0]] = { color: 'black', style: 'thin' };
            break;
          case 2:
            obj[_singleBorderDef[0]] = borderTypes.includes(_singleBorderDef[1])
              ? { style: _singleBorderDef[1] }
              : { color: { argb: _singleBorderDef[1] }, style: 'thin' };
            break;
          case 3:
            obj[_singleBorderDef[0]] = {
              color: { argb: _singleBorderDef[1] },
              style: _singleBorderDef[2]
            };
            break;
        }
      });
  
      return obj;
    }
  };
  