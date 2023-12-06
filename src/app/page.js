"use client";
import React, { useState, useEffect } from "react";
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

//Supabase initialization
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ixbrsgekfioaizpwaogk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4YnJzZ2VrZmlvYWl6cHdhb2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4MTY4ODcsImV4cCI6MjAxNzM5Mjg4N30.P_okRAnwioEqJjj2i2d_Gt7n_FZJwJRpyL60j3ywA4o"
);

async function fetchVideos() {
  let { data: clips, error } = await supabase.from("clips").select("*");
  if (error) console.log(error);
  return clips;
}

export default function Home() {
  const [videos, setVideos] = useState([]);
  const cld = new Cloudinary({
    cloud: {
      cloudName: "dnuabur2f",
    },
  });

  useEffect(() => {
    async function loadVideos() {
      const fetchedVideos = await fetchVideos();
      let videosArray = [];
      for (const video of fetchedVideos) {
        let vid = cld
          .video(video.public_id)
          .resize(fill().width(270).height(200));

        videosArray.push(vid);
      }
      setVideos(videosArray);
    }
    loadVideos();
  }, []); // The empty array ensures this effect runs only once on mount

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
        {videos.map((video, index) => (
          <AdvancedVideo
            className={styles.videoItem}
            cldVid={video}
            cldPoster="auto"
            controls
          />
        ))}
      </div>
    </main>
  );
}
