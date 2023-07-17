export const getAlignment = cell => {
    return {
      horizontal: cell?.alignment?.split(':')[0] || 'center',
      vertical: cell?.alignment?.split(':')[1] || 'middle',
      wrapText: cell?.wrapText || true
    };
  };
  