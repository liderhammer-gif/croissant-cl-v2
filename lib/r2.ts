import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) return null;
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey }
  });
}

export async function uploadR2Object(key: string, body: Buffer, contentType: string) {
  const bucket = process.env.R2_BUCKET;
  const r2 = client();
  if (!r2 || !bucket) throw new Error("R2 no configurado");
  await r2.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
  return key;
}
