"use client";

import React from "react";
import styled from "styled-components";

const Bt1 = (props) => {
  return (
    <StyledWrapper>
      <button className="button">
        <div className="blob1" />
        <div className="blob2" />
        <div className="inner">{props.name}</div>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    cursor: pointer;
    font-size: 0.9rem;
    border-radius: 12px;
    border: none;
    padding: 1px;
    background: radial-gradient(circle 50px at 80% -10%, #ffffff, #181b1b);
    position: relative;
    transition: transform 0.2s ease-in-out;
  }

  .button::after {
    content: "";
    position: absolute;
    width: 50%;
    height: 45%;
    border-radius: 80px;
    top: 0;
    right: 0;
    box-shadow: 0 0 10px #ffffff38;
    z-index: -1;
  }

  .blob1 {
    position: absolute;
    width: 40px;
    height: 100%;
    border-radius: 12px;
    bottom: 0;
    left: 0;
    background: radial-gradient(
      circle 40px at 0% 100%,
      #3fe9ff,
      #0000ff80,
      transparent
    );
    box-shadow: -5px 5px 15px #0051ff2d;
  }

  .inner {
    padding: 8px 16px;
    border-radius: 10px;
    color: #fff;
    z-index: 3;
    position: relative;
    background: radial-gradient(circle 50px at 80% -50%, #777777, #0f1111);
  }

  .inner::before {
    content: "";
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 10px;
    background: radial-gradient(
      circle 40px at 0% 100%,
      #00e1ff1a,
      #0000ff11,
      transparent
    );
    position: absolute;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .button {
      font-size: 0.8rem;
    }

    .inner {
      padding: 6px 12px;
    }

    .blob1 {
      width: 35px;
    }
  }

  @media (max-width: 480px) {
    .button {
      font-size: 0.75rem;
      transform: scale(0.95);
    }

    .inner {
      padding: 8px 10px;
    }

    .blob1 {
      width: 25px;
    }
  }
`;

export default Bt1;
