"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { CldVideoPlayer } from "next-cloudinary";
import Gallery from "./components/Gallery.js";
import "next-cloudinary/dist/cld-video-player.css";
import { Cloudinary } from "@cloudinary/url-gen";

import { AdvancedImage } from "@cloudinary/react";
import { AdvancedVideo } from "@cloudinary/react";
// Import required actions and qualifiers.
import { fill } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { Gravity } from "@cloudinary/url-gen/qualifiers";
import { AutoFocus } from "@cloudinary/url-gen/qualifiers/autoFocus";

export default function Home() {
  const cld = new Cloudinary({
    cloud: {
      cloudName: "dnuabur2f",
    },
  });

  const myImage = cld.image("cld-sample-4");
  const vid = cld.video("video_upload_example");

  // Apply the transformation.
  vid.resize(fill().width(270).height(200)); //.roundCorners(byRadius(20)); // Round the corners.

  // Resize to 250 x 250 pixels using the 'fill' crop mode.
  myImage.resize(fill().width(250).height(250));

  return (
    <main>
      <Image
        src="/coursecast_logo2.png"
        width={400}
        height={100}
        alt="logo"
        className={styles.logo}
      ></Image>
      <h1 className={styles.title}>View your content</h1>
      <div className={styles.gridContainer}>
        <AdvancedVideo
          className={styles.videoItem}
          cldVid={vid}
          cldPoster="auto"
          controls
        />
        <AdvancedVideo
          className={styles.videoItem}
          cldVid={vid}
          cldPoster="auto"
          controls
        />
        <AdvancedVideo
          className={styles.videoItem}
          cldVid={vid}
          cldPoster="auto"
          controls
        />
        <AdvancedVideo
          className={styles.videoItem}
          cldVid={vid}
          cldPoster="auto"
          controls
        />
        <AdvancedVideo
          className={styles.videoItem}
          cldVid={vid}
          cldPoster="auto"
          controls
        />
        <AdvancedVideo
          className={styles.videoItem}
          cldVid={vid}
          cldPoster="auto"
          controls
        />
        <AdvancedVideo
          className={styles.videoItem}
          cldVid={vid}
          cldPoster="auto"
          controls
        />
        <AdvancedVideo
          className={styles.videoItem}
          cldVid={vid}
          cldPoster="auto"
          controls
        />
        <AdvancedVideo
          className={styles.videoItem}
          cldVid={vid}
          cldPoster="auto"
          controls
        />
      </div>
    </main>
  );
}
