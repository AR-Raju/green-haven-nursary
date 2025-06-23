"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Upload, X, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
  disabled?: boolean
  label?: string
  required?: boolean
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  label = "Image",
  required = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 32MB for ImageBB)
    if (file.size > 32 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 32MB",
        variant: "destructive",
      })
      return
    }

    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await response.json()

      if (data.success) {
        onChange(data.url)
        toast({
          title: "Upload Successful",
          description: "Image has been uploaded successfully",
        })
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = () => {
    onRemove()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (disabled || uploading) return

    const files = Array.from(event.dataTransfer.files)
    const imageFile = files.find((file) => file.type.startsWith("image/"))

    if (imageFile) {
      await uploadFile(imageFile)
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please drop an image file",
        variant: "destructive",
      })
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="space-y-4">
        {/* Current Image Display */}
        {value && !uploading && (
          <div className="relative group">
            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
              <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  disabled={disabled}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        {!value && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              disabled ? "border-gray-200 bg-gray-50" : "border-gray-300 hover:border-gray-400 cursor-pointer"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
          >
            {uploading ? (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="h-6 w-6 text-blue-600 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploading image...</p>
                  <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                  <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Drop an image here, or click to select</p>
                  <p className="text-xs text-muted-foreground">Supports JPG, PNG, GIF up to 32MB</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select Image
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Replace Image Button */}
        {value && !uploading && (
          <div className="flex justify-center">
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={disabled}>
              <Upload className="h-4 w-4 mr-2" />
              Replace Image
            </Button>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </div>
  )
}
