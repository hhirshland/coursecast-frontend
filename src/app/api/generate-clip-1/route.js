const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dnuabur2f",
  api_key: "794987271811612",
  api_secret: "BowfKTHWJEPukcs-AwWcCdcQrYE",
});

//Supabase Variables
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = "https://ixbrsgekfioaizpwaogk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4YnJzZ2VrZmlvYWl6cHdhb2drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTgxNjg4NywiZXhwIjoyMDE3MzkyODg3fQ.MTggLFvV5ZzR50oQCARPEcQs5SCzWvToLOj2ozI_XtY";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  const body = await request.json();
  //console.log("body: " + body);
  //console.log("body.record: " + body.record);
  //console.log("body.old_record: " + body.old_record);
  let updatedRecord = body.record;
  let oldRecord = body.old_record;
  //Check to see if the update is setting generate-clip to TRUE, meaning we should generate the clip
  if (
    updatedRecord.clip_1_generated == true &&
    oldRecord.clip_1_generated != true
  ) {
    console.log("group ready for clip generation: " + updatedRecord.group_id);
    await generateClip(updatedRecord.group_id);
  }

  /*
  const raw1PublicId = body.record.raw_1_public_id;
  const raw1ImpactFrame = body.record.raw_1_impact_frame;
  const raw1ImpactTime = raw1ImpactFrame / 60; //60 FPS
  const raw2PublicId = body.record.raw_2_public_id;
  const raw2ImpactFrame = body.record.raw_2_impact_frame;
  const raw2ImpactTime = raw2ImpactFrame / 60; //60 FPS
  const raw3PublicId = body.record.raw_3_public_id;
  const raw3ImpactFrame = body.record.raw_3_impact_frame;
  const raw3ImpactTime = raw3ImpactFrame / 60; //60 FPS
  const raw4PublicId = body.record.raw_4_public_id;
  const raw4ImpactFrame = body.record.raw_4_impact_frame;
  const raw4ImpactTime = raw4ImpactFrame / 60; //60 FPS
*/
  //await main(raw1PublicId, raw1ImpactTime, raw2PublicId, raw2ImpactTime);
  return Response.json({
    message: `Clip should be getting generated for group ${updatedRecord.group_id}`,
  });
}

async function generateClip(groupId) {
  let { data: rawUploads, error } = await supabase
    .from("raw_uploads")
    .select("*")
    .eq("group_id", groupId);

  console.log("rawUploads: ", rawUploads);

  const transformations = [];

  const baseURL = "https://res.cloudinary.com/dnuabur2f";
  const videoURL = generateCloudinaryURL(baseURL, rawUploads);
  console.log("videoUrl: " + videoURL);

  /*
  rawUploads.forEach((upload, index) => {
    if (index > 0) {
      // Skip the first because it's handled outside the loop
      transformations.push({
        flags: "splice:transition_(name_fade;du_2)",
        overlay: `video:${upload.public_id}`,
      });
      transformations.push({ flags: "layer_apply" });
    }
  });
  // Always assume the first video as the base
  transformations.unshift({
    resource_type: "video",
    public_id: rawUploads[0].public_id,
  });

  // Additional transformations (for example, adding audio or a logo)
  transformations.push(
    { overlay: "audio:h1lwbct12rylznmjsv10" },
    { flags: "layer_apply" },
    {
      overlay: "psibwxeuh2c5wnnh8o4j",
      gravity: "north_east",
      x: 50,
      y: 50,
      width: 500,
    }
  );

  const htmlSnippet = cloudinary.video(transformations[0].public_id, {
    transformation: transformations.slice(1),
  });
  console.log("html snippet: " + htmlSnippet);

  //Use Regex to find the MP4 URL
  const regex = /<source src='([^']+\.mp4)'/;
  const match = htmlSnippet.match(regex);
  const mp4Url = match ? match[1] : "MP4 URL not found";
  //console.log(htmlSnippet);
  console.log("mp4url: " + mp4Url);

  */

  //Using the MP4 URL, upload the trimmed video clip to Cloudinary
  uploadVideoToCloudinary(videoURL);
}

function generateCloudinaryURL(baseURL, uploads) {
  let url = `${baseURL}/video/upload/`;

  // Start with the first video using just the public_id
  if (uploads.length > 0) {
    url += `l_video:${uploads[0].public_id},fl_layer_apply`;
  }

  // Append each subsequent video with fl_splice
  uploads.slice(1).forEach((upload) => {
    url += `/l_video:${upload.public_id},fl_splice,fl_layer_apply`;
  });

  return url;
}

async function main(
  raw1PublicId,
  raw1ImpactTime,
  raw2PublicId,
  raw2ImpactTime
) {
  //This is the HTML snippet of the edited video

  const htmlSnippet = cloudinary.video(raw1PublicId, {
    end_offset: raw1ImpactTime + 3,
    start_offset: raw1ImpactTime - 3,
    transformation: [
      {
        //this transition concats the second video (also include the layer_apply)
        flags: "splice:transition_(name_fade;du_2)",
        overlay: "video:" + raw2PublicId,
        start_offset: raw2ImpactTime - 3,
        end_offset: raw2ImpactTime + 3,
      },
      { flags: "layer_apply" },

      {
        //this transition concats the second video (also include the layer_apply)
        flags: "splice:transition_(name_fade;du_2)",
        overlay: "video:" + raw1PublicId,
        start_offset: raw1ImpactTime - 3,
        end_offset: raw1ImpactTime + 3,
      },
      { flags: "layer_apply" },

      {
        //this transition concats the second video (also include the layer_apply)
        flags: "splice:transition_(name_fade;du_2)",
        overlay: "video:" + raw2PublicId,
        start_offset: raw2ImpactTime - 3,
        end_offset: raw2ImpactTime + 3,
      },
      { flags: "layer_apply" },

      //This overlay adds the audio to the video
      { overlay: "audio:h1lwbct12rylznmjsv10" },
      { flags: "layer_apply" },

      {
        //This transformation adds the logo overlay to the video (logo is stored in cloudinary, currently using pebble logo)
        overlay: "psibwxeuh2c5wnnh8o4j", //"dthc1g5nfk0bl7cj0doo",
        gravity: "north_east", // Position at top right
        x: 50, // Margin from the right edge
        y: 50, // Margin from the top edge
        width: 500,
        //height: 300,
        //overlay: "video:Hole3_TeeShot_2_ppyntv",
      },
    ],
  });

  //music: h1lwbct12rylznmjsv10

  //Use Regex to find the MP4 URL
  const regex = /<source src='([^']+\.mp4)'/;
  const match = htmlSnippet.match(regex);
  const mp4Url = match ? match[1] : "MP4 URL not found";
  //console.log(htmlSnippet);
  console.log(mp4Url);

  //Using the MP4 URL, upload the trimmed video clip to Cloudinary
  uploadVideoToCloudinary(mp4Url);
}

//This function take a video URL and uploads the video to cloudinary. It then inserts the clip data into the supabase clips table
async function uploadVideoToCloudinary(videoUrl) {
  //await insertClipToSupabase("no-public-id", videoUrl, "0");
  /*
  console.log("Uploading video to cloudinary.");
  const res = await cloudinary.uploader.unsigned_upload(
    "sample.jpg",
    "unsigned_1"
  );
  //.then((result) => console.log(result));
  console.log("PRINTING res");
  console.log(res);
  console.log("Finished uploading video to cloudinary.");
  console.log(videoUrl);
  console.log("Running uploadVideoToCloudinary function.");
  /*
  cloudinary.uploader.upload_large(
    videoUrl,
    { resource_type: "video" },
    function (error, result) {
      console.log(result, error);
      if (result.done) {
        console.log("large upload is done bruv");
        console.log(result);
        insertClipToSupabase(result.public_id, result.url, "0");
      }
    }
  );
*/

  try {
    console.log("Entering the TRY");
    const result = await cloudinary.uploader.upload(videoUrl, {
      resource_type: "video",
    });
    console.log("Video upload result: " + result);
    await insertClipToSupabase(result.public_id, result.url, "0");
  } catch (error) {
    console.log("Error uploading video:", error);
    //Response.json({ error: error });
  }

  cloudinary.uploader
    .upload(videoUrl, {
      resource_type: "video",
    })
    .then(async (result) => {
      console.log("Video uploaded successfully");
      console.log(result);
      //After uploading the clip to cloudinary, insert the clip data into the supabase clips table
      await insertClipToSupabase(result.public_id, result.url, "0");
    })
    .catch((error) => {
      console.error("Error uploading video:", error);
    });

  console.log("Finished running uploadVideoToCloudinary function.");
}

//This function takes a clip's public_id, url, and group_id and inserts this data into the supabase clips table
async function insertClipToSupabase(publicId, url, groupId) {
  console.log("Inserting clip to supabase.");
  const { data, error } = await supabase
    .from("clips")
    .insert([{ public_id: publicId, url: url, group_id: groupId }]);

  if (error) {
    console.log(error);
    //Response.json({ error: error });
  } else {
    console.log("Uploaded clip to supabase successfully!");
    //Response.json({ message: "Uploaded clip to supabase successfully!" });
  }
}

/*
const htmlSnippet = cloudinary.video(raw1PublicId, {
  transformation: [
    {
      //this transition concats the second video (also include the layer_apply)
      flags: "splice:transition_(name_fade;du_2)",
      overlay: "video:" + raw2PublicId,
    },
    { flags: "layer_apply" },

    {
      //this transition concats the second video (also include the layer_apply)
      flags: "splice:transition_(name_fade;du_2)",
      overlay: "video:" + raw1PublicId,
    },
    { flags: "layer_apply" },

    {
      //this transition concats the second video (also include the layer_apply)
      flags: "splice:transition_(name_fade;du_2)",
      overlay: "video:" + raw2PublicId,
    },
    { flags: "layer_apply" },

    //This overlay adds the audio to the video
    { overlay: "audio:h1lwbct12rylznmjsv10" },
    { flags: "layer_apply" },

    {
      //This transformation adds the logo overlay to the video (logo is stored in cloudinary, currently using pebble logo)
      overlay: "psibwxeuh2c5wnnh8o4j", //"dthc1g5nfk0bl7cj0doo",
      gravity: "north_east", // Position at top right
      x: 50, // Margin from the right edge
      y: 50, // Margin from the top edge
      width: 500,
      //height: 300,
      //overlay: "video:Hole3_TeeShot_2_ppyntv",
    },
  ],
});
*/
