import React, { useState, useRef } from "react";
import { graphql } from "gatsby";
import { css } from "emotion";
import ReactImageMagnify from "react-image-magnify";
import Ratio from "react-ratio";

import ReactSlick from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import CarpetImage from "../../data/images/ny1-1.jpg";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function mod(n, m) {
  return ((n % m) + m) % m;
}

const CarpetListItemStyle = css`
  color: #000000db;
  font-family: Lato;
  width: 100%;
  // height: 1000px;
  display: flex;

  .slick-initialized .slick-slide {
    float: none;
    display: inline-block;
    vertical-align: middle;
  }

  .left {
    flex: 4;
    align-items: center;
    display: flex;
    flex-direction: row;
    img {
      // width: 100%;
    }

    .Ratio {
      flex: 1;
    }

    .Ratio-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    svg {
      cursor: pointer;
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;

    text-align: center;
    flex: 4;
    padding: 0 10px;

    h3 {
      margin: 0;

      font-size: 4.4em;
    }
    h2 {
      margin: 0;
      font-weight: 100;
      font-size: 4em;
      margin-top: -20px;
    }

    .row {
      display: flex;
    }
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column-reverse;

    .right {
      margin: 25px 10px 15px 10px;

      h3 {
        margin: 0;

        font-size: 3.2em;
      }
      h2 {
        margin: 0;
        font-weight: 100;
        font-size: 2.5em;
        margin-top: -20px;
      }
    }
  }
`;

const DetailStyle = css`
  flex: 1;
  margin-top: 5px;
  label {
    margin: 0;
    font-size: 1.4em;
  }
  p {
    margin: -8px 0 0 0;
    font-size: 2.2em;
  }

  @media only screen and (max-width: 768px) {
    label {
      font-size: 1em;
    }
    p {
      margin: -4px 0 0 0;
      font-size: 1.3em;
    }
  }
`;

const Detail = ({ label, text }) => (
  <div className={DetailStyle}>
    <label>{label}</label>
    <p>{text}</p>
  </div>
);

const PriceAndButtonStyle = css`
  display: flex;
  margin-top: 25px;
  height: 2em;
  align-items: center;
  div {
    flex: 1;
  }
  p {
    font-size: 2.4em;
    margin: 0;
  }
  a {
    display: block;
    text-align: center;
    width: 100%;
    font-weight: 700;
    padding: 5px 0;
    font-size: 2em;
    border-bottom: 5px solid #000000db;
    text-decoration: none;
    color: #000000db;
  }

  @media only screen and (max-width: 768px) {
    margin-top: 12px;
    p {
      font-size: 1.4em;
    }
    a {
      font-size: 1em;
    }
  }
`;

const PriceAndButton = ({ price }) => (
  <div className={PriceAndButtonStyle}>
    <div>
      <p>¥{price}</p>
    </div>
    <div>
      <a href="#">预约访问</a>
    </div>
  </div>
);

const nextImageDivStyle = css`
  width: 0;
  @media only screen and (max-width: 768px) {
    width: initial;
  }
`;

const CarpetListItem = React.memo(
  ({ carpet }) => {
    const [activeImage, setActiveImage] = useState(0);
    const slickRef = useRef(null);

    const changeImage = delta => {
      let final = activeImage + delta;

      while (final < 0) {
        final += carpet.fields.images.length;
      }

      final %= carpet.fields.images.length;
      setActiveImage(final);
    };
    // console.log(carpet);
    return (
      <div className={CarpetListItemStyle}>
        <div className="left">
          {/* <img src={CarpetImage} /> */}
          <div>
            <FiChevronLeft
              size={40}
              onClick={() => slickRef.current.slickPrev()}
            />
          </div>
          <Ratio ratio={carpet.fields.images[0].normal.aspectRatio}>
            <ReactSlick
              ref={slickRef}
              {...{
                dots: true,
                arrows: false,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
                lazyLoad: true
              }}
            >
              {carpet.fields.images.map((image, index) => (
                <div key={index}>
                  <ReactImageMagnify
                    {...{
                      enlargedImagePosition: "over",
                      smallImage: {
                        alt: "Wristwatch by Ted Baker London",
                        isFluidWidth: true,
                        ...image.normal
                      },
                      largeImage: {
                        ...image.zoom,
                        width: 1800 * image.normal.aspectRatio,
                        height: 1800
                      },
                      lensStyle: { backgroundColor: "rgba(0,0,0,.6)" }
                    }}
                  />
                </div>
              ))}
            </ReactSlick>
          </Ratio>

          <div className={nextImageDivStyle}>
            <FiChevronRight
              size={40}
              onClick={() => slickRef.current.slickNext()}
            />
          </div>
        </div>
        <div className="right">
          <h3>{carpet.series}</h3>
          <h2>{carpet.series_cn}</h2>

          <div className="row">
            <Detail label="标记" text={carpet.signature} />
            <Detail label="制造" text={carpet.made_in} />
          </div>

          <div className="row">
            <Detail label="密度" text={carpet.density} />
            <Detail label="尺寸" text={carpet.display_size} />
          </div>

          <PriceAndButton price={carpet.price} />
        </div>
      </div>
    );
  },
  (a, b) => a.carpet.id === b.carpet.id
);

export default CarpetListItem;

export const query = graphql`
  fragment CarpetListItemCarpetFragment on DataXlsx__Carpet {
    id
    price
    series
    series_cn
    made_in
    signature
    width
    height
    display_size
    density
    fields {
      images {
        normal: fluid(maxWidth: 640) {
          aspectRatio
          src
          srcSet
          sizes
        }
        zoom: fixed(width: 1400) {
          src
        }
      }
    }
  }
`;
