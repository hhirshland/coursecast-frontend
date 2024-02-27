"use client";
import { CldVideoPlayer } from "next-cloudinary";
import styles from ".././page.module.css";

const Gallery = () => {
  return (
    <div className={styles.gridContainer}>
      {videos.map((video, index) => (
        <div>
          <AdvancedVideo
            className={styles.videoItem}
            cldVid={video.video}
            cldPoster="auto"
            controls
            key={video.videoId}
          />
        </div>
      ))}
    </div>
  );
};
export default Gallery;
