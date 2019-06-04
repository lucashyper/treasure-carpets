import React, { useState, useMemo, useRef } from "react";
import { graphql } from "gatsby";
import { css, injectGlobal } from "emotion";
import { List, WindowScroller, AutoSizer } from "react-virtualized";

import DefaultLayout from "../layouts/DefaultLayout";
import CarpetListItem from "../components/CarpetListItem";
import Dropdown from "../components/Dropdown";
import Modal from "../components/Modal";

import { setConfig } from "react-hot-loader";
setConfig({ pureSFC: true });

injectGlobal`
/* Webfont: LatoLatin-Black */@font-face {
  font-family: 'LatoLatinWebBlack';
  src: url('fonts/LatoLatin/fonts/LatoLatin-Black.eot'); /* IE9 Compat Modes */
  src: url('fonts/LatoLatin/fonts/LatoLatin-Black.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('fonts/LatoLatin/fonts/LatoLatin-Black.woff2') format('woff2'), /* Modern Browsers */
       url('fonts/LatoLatin/fonts/LatoLatin-Black.woff') format('woff'), /* Modern Browsers */
       url('fonts/LatoLatin/fonts/LatoLatin-Black.ttf') format('truetype');
  font-style: normal;
  font-weight: normal;
  text-rendering: optimizeLegibility;
}
`;

injectGlobal`
body {
  font-family: LatoLatinWebBlack;
}
.ReactModalPortal > * {
  opacity: 0;
}
.ReactModal__Overlay {
  transition: opacity 200ms ease-in-out;
  background: rgba(0, 0, 0, 0.15);
  &--after-open {
      opacity: 1;
  }
  &--before-close {
      opacity: 0;
  }
}
`;

const FilterBarStyle = css`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;

  padding: 15px 0;
  background-color: white;

  z-index: 5;
  position: sticky;
  top: 0;

  > div {
    margin: 0 10px;
  }

  @media only screen and (max-width: 768px) {
    padding: 0;
    position: relative;
    flex-wrap: wrap;

    > div {
      width: 100%;
      margin: 0 5px;
    }
  }
`;

const filterOptions = {
  seriesFilter: [
    { label: "所有系列", value: [] },
    { label: "伊斯法罕", value: ["ISFAHAN"] },
    { label: "大不里士", value: ["TABRIZ"] }
  ],
  priceFilter: [
    { label: "所有价格", value: { min: 0, max: Number.MAX_SAFE_INTEGER } },
    { label: "¥0-¥49,999", value: { min: 0, max: 50000 } },
    { label: "¥49,999-¥99,999", value: { min: 50000, max: 100000 } },
    { label: "¥99,999-", value: { min: 100000, max: Number.MAX_SAFE_INTEGER } }
  ],
  sizeFilter: [
    { label: "所有大小", value: { min: 0, max: Number.MAX_SAFE_INTEGER } },
    { label: "0-5m2", value: { min: 0, max: 5 } },
    { label: "5m2-10m2", value: { min: 5, max: 10 } },
    { label: "10m2-", value: { min: 10, max: Number.MAX_SAFE_INTEGER } }
  ]
};

const mockCarpets = carpets => {
  return carpets.map((v, k) => {
    let temp = { ...v.node };
    temp.display_size = `${temp.width}x${temp.height}cm`;
    return temp;
  });
};

export default ({ data }) => {
  const [modalCarpet, setModalCarpet] = useState(null);

  const listRef = useRef(null);

  const [selectedFilters, setselectedFilters] = useState({
    series: 0,
    price: 0,
    size: 0
  });

  const carpets = useMemo(() => mockCarpets(data.carpets.edges), []);

  const filteredCarpets = useMemo(() => {
    const seriesFilter =
      filterOptions.seriesFilter[selectedFilters.series].value;
    const priceFilter = filterOptions.priceFilter[selectedFilters.price].value;
    const sizeFilter = filterOptions.sizeFilter[selectedFilters.size].value;
    return carpets.filter(carpet => {
      if (seriesFilter.length != 0 && !seriesFilter.includes(carpet.series)) {
        return false;
      }

      const price = parseInt(carpet.price.replace(",", ""));
      if (price < priceFilter.min || price >= priceFilter.max) {
        return false;
      }

      const size = (carpet.width * carpet.height) / 10000;
      if (size < sizeFilter.min || size >= sizeFilter.max) {
        return false;
      }

      return true;
    });
  }, [selectedFilters.series, selectedFilters.price, selectedFilters.size]);

  return (
    <>
      <Modal
        carpet={modalCarpet}
        isOpen={!!modalCarpet}
        onRequestClose={() => setModalCarpet(null)}
      />
      <DefaultLayout>
        <img
          style={{ alignSelf: "center", maxWidth: 800, width: "100%" }}
          src={"Logo/2x/Artboard 2@2x.png"}
        />
        <div className={FilterBarStyle}>
          {/* <Dropdown
            labels={filterOptions.seriesFilter.map(item => item.label)}
            selected={selectedFilters.series}
            onSelect={i =>
              setselectedFilters({ ...selectedFilters, series: i })
            }
          /> */}
          <Dropdown
            labels={filterOptions.priceFilter.map(item => item.label)}
            selected={selectedFilters.price}
            onSelect={i => setselectedFilters({ ...selectedFilters, price: i })}
          />
          <Dropdown
            labels={filterOptions.sizeFilter.map(item => item.label)}
            selected={selectedFilters.size}
            onSelect={i => setselectedFilters({ ...selectedFilters, size: i })}
          />
        </div>
        {/* {filteredCarpets.map(carpet => (
        <CarpetListItem carpet={carpet} key={carpet.id} />
      ))} */}
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <AutoSizer
              disableHeight
              onResize={dimentions => {
                console.log(dimentions);
                listRef.current.recomputeRowHeights(); //default row is 0, which in turn causes all other row caches be wiped
                listRef.current.forceUpdateGrid();
              }}
            >
              {({ width }) => (
                <List
                  ref={listRef}
                  style={{ outline: "none" }} // remove blue border
                  autoHeight
                  height={height}
                  width={width}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  rowCount={filteredCarpets.length}
                  overscanRowCount={4}
                  rowHeight={({ index }) => {
                    const isMobile = window.matchMedia(
                      "only screen and (max-width: 768px)"
                    ).matches;
                    const imageButtonWidth = isMobile ? 30 : 40;
                    const imageAspectRatio =
                      filteredCarpets[index].fields.mainImage.normal
                        .aspectRatio;

                    const mobileRightSideHeight = 285;

                    if (isMobile) {
                      const imageWidth = width - 2 * imageButtonWidth;
                      return (
                        imageWidth / imageAspectRatio + mobileRightSideHeight
                      );
                    } else {
                      const imageWidth = width / 2 - imageButtonWidth;
                      return Math.max(imageWidth / imageAspectRatio, 500);
                    }
                  }}
                  rowRenderer={({ index, style }) => {
                    return (
                      <div style={style} key={filteredCarpets[index].id}>
                        <CarpetListItem
                          onOpenInfo={() =>
                            setModalCarpet(filteredCarpets[index])
                          }
                          carpet={filteredCarpets[index]}
                          key={width} // React Image Magnify fails when window is resized. That event is rare so we just reset the whole CarpetListItem (reseting just the magnify component didnt work for some reason);
                        />
                      </div>
                    );
                  }}
                  scrollTop={scrollTop}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      </DefaultLayout>
    </>
  );
};

export const query = graphql`
  query {
    carpets: allDataXlsxCarpet {
      edges {
        node {
          ...CarpetListItemCarpetFragment
        }
      }
    }
  }
`;
