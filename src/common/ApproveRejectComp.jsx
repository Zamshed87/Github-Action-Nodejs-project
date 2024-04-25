/* eslint-disable @typescript-eslint/no-empty-function */
const ApproveRejectComp = ({ props = {} }) => {
  const { className, onApprove = () => {}, onReject = () => {} } = props || {};
  return (
    <div className={className}>
      <div
        style={{
          width: "140px",
        }}
        className="custom-approve-reject-flex-btn"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <button type="button" className="btn-approve" onClick={onApprove}>
            Approve
          </button>
          <button type="button" className="btn-reject" onClick={onReject}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveRejectComp;
