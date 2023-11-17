"use client";
import { CldVideoPlayer } from "next-cloudinary";

const Gallery = () => {
  return (
    <div>
      <h1>Gallery</h1>
      <p>View your highlights!</p>
      <CldVideoPlayer
        id="sea-turtle"
        width="300"
        height="300"
        src="video_upload_example"
        colors={{
          accent: "#ff0000",
          base: "#00ff00",
          text: "#0000ff",
        }}
      />
      <CldVideoPlayer
        id="sea-turtle"
        width="300"
        height="300"
        src="video_upload_example"
      />
    </div>
  );
};
export default Gallery;
