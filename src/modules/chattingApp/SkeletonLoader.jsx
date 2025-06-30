import styles from "./SkeletonLoader.module.css";

const SkeletonLoader = ({ loaderCount }) => {
  return (
    <>
      {[...Array(loaderCount)].map((_, index) => (
        <div className={styles.loaderContainer}>
          <div className={styles.loaderAvatar}></div>
          <div className={styles.loaderTextContainer}>
            <p className={styles.nameLoader}></p>
            <p className={styles.messageLoader}></p>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;
