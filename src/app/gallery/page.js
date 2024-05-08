"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "../page.module.css";
import { CldVideoPlayer } from "next-cloudinary";
import Gallery from "../components/Gallery.js";
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

const cld = new Cloudinary({
  cloud: {
    cloudName: "dnuabur2f",
  },
});

const supabase = createClient(
  "https://ixbrsgekfioaizpwaogk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4YnJzZ2VrZmlvYWl6cHdhb2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4MTY4ODcsImV4cCI6MjAxNzM5Mjg4N30.P_okRAnwioEqJjj2i2d_Gt7n_FZJwJRpyL60j3ywA4o"
);

//This function fetches videos from supabase and cloudinary, filtering based on the group_id parameter in the url (if present)
async function fetchVideos(queryGroupId) {
  console.log("fetchVideos called");
  let { data: clips, error } = await supabase.from("raw_uploads").select("*");
  console.log("clips: ", clips);
  if (error) console.log(error);

  let videosArray = [];

  //For every clip public_id stored in supabase, fetch the video from cloudinary and add it to the videosArray
  for (const video of clips) {
    let vid = cld
      .video(video.public_id)
      //.resize(fill().width(1080).height(720)) // Example of higher resolution
      .quality("auto:good"); // Adjust quality settings
    //If the group_id parameter is present in the url, only add videos with that group_id to the videosArray
    if (queryGroupId && queryGroupId == video.group_id) {
      videosArray.push({
        video: vid,
        group: video.group_id,
        videoId: video.public_id,
      });
    }
    //If group_id is not present in the url, add all videos to the videosArray
    else if (!queryGroupId) {
      videosArray.push({
        video: vid,
        group: video.group_id,
        videoId: video.public_id,
      });
    }
  }
  return videosArray;
}

export default function Home() {
  const [videos, setVideos] = useState([]);
  const searchParams = useSearchParams();
  //console.log(searchParams);
  //console.log(searchParams.get("group_id"));
  const queryGroupId = searchParams.get("group_id");

  //Fetch videos from supabase/cloudinary
  useEffect(() => {
    console.log("useEffect called");
    async function loadVideos() {
      const videosArray = await fetchVideos(queryGroupId);
      setVideos(videosArray);
    }
    loadVideos();
  }, []); // The empty array ensures this effect runs only once on mount

  const myVideo = cld.video("docs/walking_talking");

  return (
    <div>
      <div className={styles.navBar}>
        <Image
          src="/coursecast_logo2.png"
          width={128}
          height={28}
          alt="logo"
          className={styles.logo}
        ></Image>
      </div>
      <main>
        <div className={styles.gridContainer}>
          <video className={styles.videoItem} controls key={"test"}>
            <source
              src="https://res.cloudinary.com/dnuabur2f/video/upload/l_audio:nice-shot-daniel/fl_layer_apply,so_1.2/fl_splice,l_video:test-clip-1/fl_layer_apply/fl_splice,l_video:test-clip-1/fl_layer_apply/fl_splice,l_video:test-clip-1/fl_layer_apply/l_psibwxeuh2c5wnnh8o4j/fl_layer_apply,g_north_east,x_50,y_50/l_audio:h1lwbct12rylznmjsv10/fl_layer_apply/test-clip-1.mp4"
              type="video/mp4"
            />
          </video>
          {videos.map((video, index) => (
            <div key={index}>
              <div className={styles.videoDetails}>
                <div className={styles.videoDetailsLeft}>
                  <p>
                    <b>Your Group</b>
                  </p>
                  <p>Stanford Hole 8</p>
                </div>
                <div className={styles.videoDetailsRight}>
                  <p>April 23rd</p>
                  <p>4:38 pm</p>
                </div>
              </div>
              <AdvancedVideo
                className={styles.videoItem}
                cldVid={video.video}
                //cldPoster="auto"
                controls
                key={/*video.videoId*/ index}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
