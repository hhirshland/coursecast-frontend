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

  main(raw1PublicId, raw1ImpactTime, raw2PublicId, raw2ImpactTime);
  return Response.json({ message: "Clip should be getting generated!" });
}

//OLD CODE BELOW
/*
functions.http("generateClip", (req, res) => {
  console.log(req.body);
  const raw1PublicId = req.body.record.raw_1_public_id;
  const raw1ImpactFrame = req.body.record.raw_1_impact_frame;
  console.log("raw 1 public id:");
  console.log(raw1PublicId);
  const raw1ImpactTime = raw1ImpactFrame / 60; //60 FPS

  main(raw1PublicId, raw1ImpactTime);
});
*/
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

  /*
  const htmlSnippet = cloudinary.video(raw1PublicId, {
    end_offset: raw1ImpactTime + 3,
    start_offset: raw1ImpactTime - 3,
    transformation: {
      //This transformation adds the logo overlay to the video (logo is stored in cloudinary, currently using pebble logo)
      overlay: "psibwxeuh2c5wnnh8o4j", //"dthc1g5nfk0bl7cj0doo",
      gravity: "north_east", // Position at top right
      x: 50, // Margin from the right edge
      y: 50, // Margin from the top edge
      width: 500,
      //height: 300,
    },
  });
  */

  //music: h1lwbct12rylznmjsv10

  //Use Regex to find the MP4 URL
  const regex = /<source src='([^']+\.mp4)'/;
  np;
  const match = htmlSnippet.match(regex);
  const mp4Url = match ? match[1] : "MP4 URL not found";
  console.log(htmlSnippet);
  console.log(mp4Url);

  //Using the MP4 URL, upload the trimmed video clip to Cloudinary
  uploadVideoToCloudinary(mp4Url);
}

//This function take a video URL and uploads the video to cloudinary. It then inserts the clip data into the supabase clips table
async function uploadVideoToCloudinary(videoUrl) {
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
}

//This function takes a clip's public_id, url, and group_id and inserts this data into the supabase clips table
async function insertClipToSupabase(publicId, url, groupId) {
  const { data, error } = await supabase
    .from("clips")
    .insert([{ public_id: publicId, url: url, group_id: "0" }])
    .select();

  if (error) {
    console.log(error);
    Response.json({ error: error });
  } else {
    Response.json({ message: "Uploaded clip to supabase successfully!" });
  }
}
