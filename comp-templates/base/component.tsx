import AutoTypes from "@autoTypes";

import * as styles from "./styles.module.css";

export type @@nameProps = AutoTypes.@@nameProps;

function @@name(props: @@nameProps) {
	return <div className={styles.container}></div>;
}

export default @@name;
