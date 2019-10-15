import React from "react";


const MovieCard = ({ data = [], index, onClick, ...props }) => {
  const eventId = data[0];
  const eventData = data[1];
  const posterUrl = `https://in.bmscdn.com/events/moviecard/${eventId}.jpg`;
  const handleClick = () => {
    onClick(index, { id: eventId, ...eventData });
  };
  return (
    <>
      <div className="bg-black-400 xl:w-1/6 lg:w-1/4 md:w-1/3 sm:1/2 movie-card">
        <div
          onClick={handleClick}
          className="h-auto px-8 py-4 movie-card cursor-pointer relative"
        >
          <div className="h-12 w-12 absolute rounded-full flex border-4 border-white play_icon">
            <div className="arrow-left"></div>
          </div>
          <div className="h-10 w-10 absolute rounded-full flex release-date-icon bg-green-400 shadow">
            <div className="release-date-text text-center flex flex-col justify-center w-full">
              <div className="text-white font-bold text-xs">4</div>
              <div className="text-white font-medium text-xs">Jan</div>
            </div>
          </div>
          <img
            src={posterUrl}
            alt="some sorcery"
            className="w-full h-full rounded"
          />
          <div className="text-white text-bold text-sm text-left py-4">
            {eventData.EventTitle}
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieCard;
