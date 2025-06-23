import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (max 32MB for ImageBB)
    if (file.size > 32 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 32MB" }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")

    // Upload to ImageBB
    const imageBBFormData = new FormData()
    imageBBFormData.append("image", base64)

    const imageBBResponse = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMAGE_BB_API_KEY}`, {
      method: "POST",
      body: imageBBFormData,
    })

    if (!imageBBResponse.ok) {
      throw new Error("Failed to upload to ImageBB")
    }

    const imageBBData = await imageBBResponse.json()

    if (!imageBBData.success) {
      throw new Error(imageBBData.error?.message || "ImageBB upload failed")
    }

    return NextResponse.json({
      success: true,
      url: imageBBData.data.url,
      deleteUrl: imageBBData.data.delete_url,
      filename: file.name,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 },
    )
  }
}
