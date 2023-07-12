import styles from "./List.module.css";

const List = ({ name, value }) => (
  <div className={styles.details} key={name}>
    <div className={styles.label}>{name}</div>
    <div className={styles.value}>{value}</div>
  </div>
);

export default List;
