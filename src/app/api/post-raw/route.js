//Supabase Variables
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = "https://ixbrsgekfioaizpwaogk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4YnJzZ2VrZmlvYWl6cHdhb2drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTgxNjg4NywiZXhwIjoyMDE3MzkyODg3fQ.MTggLFvV5ZzR50oQCARPEcQs5SCzWvToLOj2ozI_XtY";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  const body = await request.json();
  const videoPublicId = body.record.video_public_id;
  const videoJson = body.record.video_json;
  console.log("videoPublicId: ", videoPublicId);
  console.log("videoJson: ", videoJson);

  const { data, error } = await supabase
    .from("raw_uploads")
    .insert([{ cloudinary_public_id: videoPublicId, video_json: videoJson }]);
  if (error) {
    console.log("error", error);
    return Response.json({ message: "Error uploading video" });
  }

  return Response.json({ message: `Video ${videoPublicId} has been uploaded` });
}
