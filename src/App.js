import React, { useState } from "react";
import apifile from "./api.json";
import Youtube from "./components/Youtube.js";
import { getRangeArr } from "./utils";
import MovieCard from "./components/MovieCard.js";

const apis = Object.entries(apifile);

const getDummyDivPositon = () => {
  // this will not work in cases where flex width of container is more than childs it have
  // and also it can not show another child is available space
  return Math.floor(window.innerWidth / 290);
};

function App() {
  const [activeCard, setActiveCard] = useState({});
  const [vId, setVideo] = useState("H7_yY3yr-jE");

  const shouldPopVideoPlayer = i => {
    const range = getRangeArr(
      Math.floor(activeCard.index / getDummyDivPositon()) *
        getDummyDivPositon(),
      Math.ceil(activeCard.index / getDummyDivPositon()) * getDummyDivPositon()
    );
    return range.includes(i) || activeCard.index === i;
  };

  const handleOnCardClick = (index, data) => {
    // the data.TrailerURL is giving cors issue so I am just switching between videos;

    setVideo(vId === "H7_yY3yr-jE" ? "bzW9fmwcmG4" : "H7_yY3yr-jE");
    setActiveCard({ index, data });
  };

  const posterUrl = `https://in.bmscdn.com/events/moviecard/${activeCard.data &&
    activeCard.data.id}.jpg`;

  return (
    <div className="relative h-screen">
      <div className="p-12 bg-black-400 flex flex-wrap absolute top-0 left-0">
        {apis.map((arr, i) => {
          return (
            <>
              {/* put a dummy empty div for each row, 
             and give it full width on click of anyitem in row,
             as we are using flex it will push current div to next row*/}
              {i % getDummyDivPositon() === 0 && (
                <div
                  className={`dummy-div ${
                    activeCard.index !== undefined && shouldPopVideoPlayer(i)
                      ? "active flex px-10 w-full"
                      : ""
                  }`}
                >
                  <div className="w-2/3 sm:w-1/1">
                    {/* While frame is taking time to load, need to handle how to indicate user that video has changed */}
                    <Youtube url={vId} />
                  </div>
                  <div className="h-full w-1/3  sm:w-1/1">
                    <div
                      className="h-full w-full poster-image"
                      style={{
                        backgroundImage: `url(${posterUrl})`
                      }}
                    ></div>
                  </div>
                </div>
              )}
              <MovieCard
                data={arr}
                key={arr[0]}
                index={i}
                activeCard={activeCard.index}
                onClick={handleOnCardClick}
              />
            </>
          );
        })}
      </div>
    </div>
  );
}

export default App;
