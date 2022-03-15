import React, { useState } from "react";

import styles from "./styles.module.scss";

const Counter = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div className={styles.counter}>
      <button onClick={() => setCounter(counter + 1)}>Click Me!</button>
      <p>Times you clicked on the button: {counter}</p>
    </div>
  );
};

export default Counter;
