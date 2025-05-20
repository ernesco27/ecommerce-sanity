import { client } from "@/sanity/lib/client";

interface ImageAsset {
  _id: string;
  url: string;
}

export async function uploadImages(files: File[]): Promise<ImageAsset[]> {
  const assets: ImageAsset[] = [];

  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      throw new Error("Image size should be less than 5MB");
    }

    const asset = await client.assets.upload("image", file, {
      filename: file.name,
    });

    assets.push({
      _id: asset._id,
      url: asset.url,
    });
  }

  return assets;
}
