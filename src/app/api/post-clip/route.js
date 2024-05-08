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
  const videoUrl = body.videoUrl;
  console.log("videoUrl: ", videoUrl);

  let result = await cloudinary.v2.uploader.upload(videoUrl, {
    resource_type: "video",
  });
  console.log("upload should be finished");
  console.log("Video upload result: " + result);
  await insertClipToSupabase(result.public_id, result.url, groupId);

  return Response.json({
    message: `Video ${result.public_id} has been uploaded`,
  });
}

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
