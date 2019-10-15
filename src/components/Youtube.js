import React from "react";
export default ({ url }) => {
  return (
    <div
      className="video"
      style={{
        position: "relative",
        paddingTop: 25,
        height: "100%"
      }}
    >
      <iframe
        title="youtube"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%"
        }}
        width="560"
        height="315"
        autoplay
        src={`https://www.youtube.com/embed/${url}`}
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </div>
  );
};
