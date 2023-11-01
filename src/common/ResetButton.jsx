
export default function ResetButton({ icon, title, onClick, classes,styles }) {
   return (
      <button
         className={classes ? `btn btn-reset ${classes}` : 'btn btn-reset'}
         style={{height:"28px",...styles}}
         type="button"
         onClick={onClick}
      >
         {icon && icon}
         {title}
      </button>
   );
}
