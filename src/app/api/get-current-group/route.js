//Supabase Variables
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = "https://ixbrsgekfioaizpwaogk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4YnJzZ2VrZmlvYWl6cHdhb2drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTgxNjg4NywiZXhwIjoyMDE3MzkyODg3fQ.MTggLFvV5ZzR50oQCARPEcQs5SCzWvToLOj2ozI_XtY";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request) {
  let { data: groups, error } = await supabase
    .from("groups")
    .select("*")
    .order("group_id", { ascending: false });
  //.limit(1);
  if (error) {
    return Response.json({
      message: "Error getting groups",
    });
  }
  console.log("groups: ", groups);
  let groupId = groups[0].group_id;
  console.log("groupId: ", groupId);
  if (groups[0].clip_1_generated == true) {
    groupId = groupId + 1;
  }

  return Response.json({
    groupId: groupId,
  });
}
