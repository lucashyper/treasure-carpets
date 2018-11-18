import React, { useState, useEffect, useRef } from "react";
import { css } from "emotion";

import { FiChevronDown } from "react-icons/fi";

const DropDownStyle = css`
  height: 70px;

  p {
    font-size: 26px;
    font-weight: 700;
    margin: 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .click {
    border-bottom: 5px solid #000000db;
    color: #000000db;

    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-width: 160x;
    align-items: center;

    svg {
      stroke: #000000db;
      height: 100%;
      width: 40px;

      transition: 0.15s;
    }

    p {
      padding-right: 10px;
    }

    padding: 0 5px;
  }

  div {
    position: relative;
    padding-left: 5px;
    border-width: 0 5px 5px 5px;
    border-style: solid;
    border-color: #000000db;

    background-color: white;

    display: flex;
    flex-direction: column;
    align-items: stretch;

    a {
      padding: 5px 10px 5px 0;
    }
  }
`;

const Dropdown = ({ labels = ["所有"], selected = 0, onSelect = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={DropDownStyle}>
      <a
        href="#"
        className="click"
        onMouseDown={e => setIsOpen(!isOpen)}
        onTouchStart={e => setIsOpen(!isOpen)}
        onTouchEnd={e => e.preventDefault()}
        onBlur={e => setIsOpen(false)}
      >
        <p>{labels[selected]}</p>
        <FiChevronDown style={isOpen && { transform: "rotate(180deg)" }} />
      </a>
      {isOpen && (
        <div>
          {labels.map((label, index) => (
            <a
              href="#"
              key={index}
              onMouseDown={() => {
                onSelect(index);
                setIsOpen(false);
              }}
              onTouchStart={() => {
                onSelect(index);
                setIsOpen(false);
              }}
              onTouchEnd={e => e.preventDefault()}
            >
              <p>{labels[index]}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
