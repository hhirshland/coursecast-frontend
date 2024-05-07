const cloudinary = require("cloudinary");
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
    generateClip(updatedRecord.group_id);
  }

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

  const baseURL = "https://res.cloudinary.com/dnuabur2f";
  const videoURL = generateCloudinaryURL(baseURL, rawUploads);
  console.log("videoUrl: " + videoURL);

  //Using the MP4 URL, upload the trimmed video clip to Cloudinary
  uploadVideoToCloudinary(videoURL, groupId);
}

function generateCloudinaryURL(baseURL, uploads) {
  let url = `${baseURL}/video/upload/`;

  // Append each subsequent video with fl_splice
  uploads.forEach((upload, index) => {
    if (index > 0) {
      url += `fl_splice,l_video:${upload.public_id}/fl_layer_apply/`;
    }
  });

  //Add the first video
  url += "l_audio:h1lwbct12rylznmjsv10/fl_layer_apply/";
  url += uploads[0].public_id;
  url += ".mp4";

  return url;
}

//This function take a video URL and uploads the video to cloudinary. It then inserts the clip data into the supabase clips table
async function uploadVideoToCloudinary(videoUrl, groupId) {
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
    const result = await cloudinary.v2.uploader.upload(videoUrl, {
      resource_type: "video",
    });
    console.log("Video upload result: " + result);
    await insertClipToSupabase(result.public_id, result.url, groupId);
  } catch (error) {
    console.log("Error uploading video:", error);
    //Response.json({ error: error });
  }

  console.log("Uploading video to cloudinary. about to enter the .then ");
  cloudinary.v2.uploader
    .upload(videoUrl, {
      resource_type: "video",
    })
    .then(async (result) => {
      console.log("Video uploaded successfully");
      console.log(result);
      //After uploading the clip to cloudinary, insert the clip data into the supabase clips table
      await insertClipToSupabase(result.public_id, result.url, groupId);
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
