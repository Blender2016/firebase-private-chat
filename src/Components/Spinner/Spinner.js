import React from "react";
import Styles from "./Spinner.module.css";

const spinner =(props)=>(
    <div className={Styles.Ellipsis}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default spinner;