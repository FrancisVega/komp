import AutoTypes from "@autoTypes";

import * as styles from "./styles.module.css";

export type FoolanderProps = AutoTypes.FoolanderProps;

function Foolander(props: FoolanderProps) {
	return <div className={styles.container}></div>;
}

export default Foolander;
