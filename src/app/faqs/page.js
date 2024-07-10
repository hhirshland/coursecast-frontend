"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "../page.module.css";

import "next-cloudinary/dist/cld-video-player.css";
import { Cloudinary } from "@cloudinary/url-gen";
import FeedbackForm from "../components/FeedbackForm";

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
async function fetchVideoUrls() {
  console.log("fetchVideos called");
  let { data: clips, error } = await supabase
    .from("clips")
    .select("*")
    .order("created_at", { ascending: false });
  console.log("clips: ", clips);
  if (error) console.log(error);
  return clips;
}

async function fetchRawUrls() {
  console.log("fetchVideos called");
  let { data: clips, error } = await supabase
    .from("raw_uploads")
    .select("*")
    .order("created_at", { ascending: false });
  console.log("raws: ", clips);
  if (error) console.log(error);
  return clips;
}
/*
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // formats date as "MM/DD/YYYY" in the U.S.
};
*/
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "short", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  const day = date.getDate();
  let daySuffix = "th";
  if (day % 10 === 1 && day !== 11) {
    daySuffix = "st";
  } else if (day % 10 === 2 && day !== 12) {
    daySuffix = "nd";
  } else if (day % 10 === 3 && day !== 13) {
    daySuffix = "rd";
  }

  return `${formattedDate.split(" ")[0]} ${day}${daySuffix}`;
};
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); // formats time as "H:MM AM/PM"
};

const ShareButton = () => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "CourseCast",
          text: "Check out my golf swing!",
          url: window.location.href,
        });
        console.log("Data was shared successfully");
      } catch (err) {
        console.error("Share failed:", err.message);
      }
    } else {
      console.log("Web Share API not supported");
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Link copied to clipboard");
      });
    }
  };

  return (
    <button onClick={handleShare} className={styles.shareButton}>
      Share
    </button>
  );
};

export default function Home() {
  const searchParams = useSearchParams();
  console.log("searchParams: ", searchParams);
  const [clips, setClips] = useState([]);
  const [raws, setRaws] = useState([]);
  //console.log(searchParams);
  //console.log(searchParams.get("group_id"));
  const queryGroupId = searchParams.get("group_id");
  const satisfaction = searchParams.get("satisfaction");
  console.log("queryGroupId: ", queryGroupId);

  //Fetch videos from supabase/cloudinary
  useEffect(() => {
    console.log("useEffect called");
    async function loadVideos() {
      const clipsJson = await fetchVideoUrls();
      setClips(clipsJson);
      const rawsJson = await fetchRawUrls();
      setRaws(rawsJson);
    }
    loadVideos();
  }, []); // The empty array ensures this effect runs only once on mount

  return (
    <div>
      <p>yoyoyo</p>
    </div>
  );
}
