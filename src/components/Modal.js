import React from "react";
import Modal from "react-modal";
import { css } from "emotion";

const modalStyle = {
  overlay: {
    zIndex: 10
  },
  content: {
    width: "90%",
    maxWidth: "800px",
    padding: 0,
    left: "50%",
    right: "auto",
    transform: "translate(-50%,0)",
    border: "5px solid #000000db"
  }
};

const contentStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  * {
    margin: 0;
  }

  .code {
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
      font-size: 1em;
    }
    h2 {
      font-size: 3em;
    }

    padding-bottom: 10px;
    border-bottom: 5px solid #000000db;
    margin: 5px 0;
  }

  .bottom {
    height: 100%;
    margin: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;

    div {
      flex: 2;
      background-position: center;
    }

    p {
      font-size: 1.6em;
    }
  }
`;

export default ({ isOpen, onRequestClose, carpet }) => (
  <Modal
    isOpen={isOpen}
    ariaHideApp={false}
    onRequestClose={onRequestClose}
    style={modalStyle}
    contentLabel="Contact Modal"
  >
    {isOpen && (
      <div className={contentStyle}>
        <div className="code">
          <p>你选择的产品代码</p>
          <h2>{carpet.code}</h2>
        </div>
        <div className="bottom">
          <div
            style={{
              backgroundImage: `url(${carpet.fields.mainImage.normal.src})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              margin: 10,

              height: "100%"
            }}
          />
          <div>
            <p>如果您对这种地毯感兴趣，请联系我们:</p>
            <p>18610017411</p>
            <p>或</p>
            <p>18610017400</p>
          </div>
        </div>
      </div>
    )}
  </Modal>
);
