import React from "react";
import { css } from "emotion";

const ContainerStyle = css`
  margin: 0 auto;
  max-width: 1140px;

  display: flex;
  flex-direction: column;
`;

export default ({ children }) => (
  <div className={ContainerStyle}> {children} </div>
);
