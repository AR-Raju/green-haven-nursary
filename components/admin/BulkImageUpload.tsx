"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, X, CheckCircle, AlertCircle, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UploadedImage {
  id: string
  file: File
  url?: string
  status: "pending" | "uploading" | "success" | "error"
  progress: number
  error?: string
}

interface BulkImageUploadProps {
  onImagesUploaded: (urls: string[]) => void
  maxImages?: number
  disabled?: boolean
}

export default function BulkImageUpload({ onImagesUploaded, maxImages = 10, disabled = false }: BulkImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    addFiles(files)
  }

  const addFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length !== files.length) {
      toast({
        title: "Some files skipped",
        description: "Only image files are allowed",
        variant: "destructive",
      })
    }

    const newImages: UploadedImage[] = imageFiles.slice(0, maxImages - images.length).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: "pending",
      progress: 0,
    }))

    if (newImages.length < imageFiles.length) {
      toast({
        title: "Upload limit reached",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive",
      })
    }

    setImages((prev) => [...prev, ...newImages])
  }

  const uploadFile = async (image: UploadedImage): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Update status to uploading
        setImages((prev) =>
          prev.map((img) => (img.id === image.id ? { ...img, status: "uploading", progress: 0 } : img)),
        )

        // Simulate progress
        const progressInterval = setInterval(() => {
          setImages((prev) =>
            prev.map((img) => {
              if (img.id === image.id && img.progress < 90) {
                return { ...img, progress: img.progress + 10 }
              }
              return img
            }),
          )
        }, 200)

        const formData = new FormData()
        formData.append("image", image.file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Upload failed")
        }

        const data = await response.json()

        if (data.success) {
          setImages((prev) =>
            prev.map((img) =>
              img.id === image.id ? { ...img, status: "success", progress: 100, url: data.url } : img,
            ),
          )
          resolve(data.url)
        } else {
          throw new Error(data.error || "Upload failed")
        }
      } catch (error) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? { ...img, status: "error", error: error instanceof Error ? error.message : "Upload failed" }
              : img,
          ),
        )
        reject(error)
      }
    })
  }

  const uploadAllImages = async () => {
    setIsUploading(true)
    const pendingImages = images.filter((img) => img.status === "pending")

    try {
      const uploadPromises = pendingImages.map((image) => uploadFile(image))
      const urls = await Promise.allSettled(uploadPromises)

      const successfulUrls = urls
        .filter((result): result is PromiseFulfilledResult<string> => result.status === "fulfilled")
        .map((result) => result.value)

      if (successfulUrls.length > 0) {
        onImagesUploaded(successfulUrls)
        toast({
          title: "Upload Complete",
          description: `${successfulUrls.length} images uploaded successfully`,
        })
      }

      const failedCount = urls.length - successfulUrls.length
      if (failedCount > 0) {
        toast({
          title: "Some uploads failed",
          description: `${failedCount} images failed to upload`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const clearAll = () => {
    setImages([])
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (disabled || isUploading) return

    const files = Array.from(event.dataTransfer.files)
    addFiles(files)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const getStatusIcon = (status: UploadedImage["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "uploading":
        return <Upload className="h-4 w-4 text-blue-600 animate-pulse" />
      default:
        return <ImageIcon className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: UploadedImage["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "uploading":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Bulk Image Upload</span>
          <div className="flex gap-2">
            {images.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={clearAll} disabled={isUploading}>
                  Clear All
                </Button>
                <Button
                  size="sm"
                  onClick={uploadAllImages}
                  disabled={isUploading || images.filter((img) => img.status === "pending").length === 0}
                >
                  Upload All ({images.filter((img) => img.status === "pending").length})
                </Button>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            disabled || isUploading
              ? "border-gray-200 bg-gray-50"
              : "border-gray-300 hover:border-gray-400 cursor-pointer"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        >
          <div className="space-y-2">
            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto" />
            <p className="text-sm font-medium">Drop images here or click to select (max {maxImages})</p>
            <p className="text-xs text-muted-foreground">Supports JPG, PNG, GIF up to 32MB each</p>
          </div>
        </div>

        {/* Image List */}
        {images.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              Selected Images ({images.length}/{maxImages})
            </h4>
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
              {images.map((image) => (
                <div key={image.id} className="flex items-center gap-3 p-2 border rounded-lg">
                  <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                    {image.url ? (
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.file.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getStatusIcon(image.status)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{image.file.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(image.status)}>
                        {image.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {(image.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    {image.status === "uploading" && <Progress value={image.progress} className="w-full h-1 mt-1" />}
                    {image.error && <p className="text-xs text-red-600 mt-1">{image.error}</p>}
                  </div>

                  <Button variant="outline" size="sm" onClick={() => removeImage(image.id)} disabled={isUploading}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />
      </CardContent>
    </Card>
  )
}
