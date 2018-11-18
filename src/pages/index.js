import React, { useState, useMemo, useRef } from "react";
import { graphql } from "gatsby";
import { css, injectGlobal } from "emotion";
import { List, WindowScroller, AutoSizer } from "react-virtualized";

import DefaultLayout from "../layouts/DefaultLayout";
import CarpetListItem from "../components/CarpetListItem";
import Dropdown from "../components/Dropdown";

import { setConfig } from "react-hot-loader";
setConfig({ pureSFC: true });

injectGlobal`
@import url('https://fonts.googleapis.com/css?family=Lato:900');
body {
  font-family: Lato;
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

const mockCarpets = carpet => {
  return Array.from({ length: 3 }).map((v, k) => {
    let temp = { ...carpet };
    temp.id = k;
    temp.made_in = 1970 + Math.floor(Math.random() * 30);
    temp.density = 300 + Math.floor(Math.random() * 5) * 100;
    temp.price = Math.floor(Math.random() * 150) * 1000;
    temp.series = Math.random() > 0.5 ? "ISFAHAN" : "TABRIZ";
    temp.series_cn = temp.series == "ISFAHAN" ? "伊斯法罕" : "大不里士";
    temp.width = Math.floor(Math.random() * 50) * 10;
    temp.height = Math.floor(Math.random() * 30) * 10;
    temp.display_size = `${temp.width}x${temp.height}cm`;
    return temp;
  });
};

export default ({ data }) => {
  const listRef = useRef(null);

  const [selectedFilters, setselectedFilters] = useState({
    series: 0,
    price: 0,
    size: 0
  });
  const carpets = useMemo(() => mockCarpets(data.carpets.edges[0].node), []);

  const filteredCarpets = useMemo(
    () => {
      const seriesFilter =
        filterOptions.seriesFilter[selectedFilters.series].value;
      const priceFilter =
        filterOptions.priceFilter[selectedFilters.price].value;
      const sizeFilter = filterOptions.sizeFilter[selectedFilters.size].value;
      return carpets.filter(carpet => {
        if (seriesFilter.length != 0 && !seriesFilter.includes(carpet.series)) {
          return false;
        }
        if (carpet.price < priceFilter.min || carpet.price >= priceFilter.max) {
          return false;
        }

        const size = (carpet.width * carpet.height) / 10000;
        if (size < sizeFilter.min || size >= sizeFilter.max) {
          return false;
        }

        return true;
      });
    },
    [selectedFilters.series, selectedFilters.price, selectedFilters.size]
  );

  return (
    <DefaultLayout>
      <div className={FilterBarStyle}>
        <Dropdown
          labels={filterOptions.seriesFilter.map(item => item.label)}
          selected={selectedFilters.series}
          onSelect={i => setselectedFilters({ ...selectedFilters, series: i })}
        />
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
              listRef.current.recomputeRowHeights();
              listRef.current.forceUpdateGrid();
            }}
          >
            {({ width }) => (
              <List
                ref={listRef}
                // key={width}
                autoHeight
                height={height}
                width={width}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                rowCount={filteredCarpets.length}
                overscanRowCount={5}
                rowHeight={({ index }) => {
                  const imageWidth = width / 2 - 40;
                  return (
                    imageWidth /
                    filteredCarpets[index].fields.images[0].normal.aspectRatio
                  );
                }}
                rowRenderer={({ index, style }) => {
                  return (
                    <div style={style} key={filteredCarpets[index].id}>
                      <CarpetListItem carpet={filteredCarpets[index]} />
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
