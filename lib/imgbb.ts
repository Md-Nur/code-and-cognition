export async function uploadToImgbb(file: File): Promise<string> {
    const apiKey = process.env.IMGBB_API;
    if (!apiKey) {
        throw new Error("IMGBB_API key is not defined in environment variables");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to upload image to Imgbb");
    }

    return data.data.url;
}
