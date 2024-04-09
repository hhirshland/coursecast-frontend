export async function POST(request) {
  const body = await request.json();
  const videoPublicId = body.record.video_public_id;
  const videoJson = body.record.video_json;
  console.log("videoPublicId: ", videoPublicId);
  console.log("videoJson: ", videoJson);

  return Response.json({ message: `Video ${videoPublicId} has been uploaded` });
}
