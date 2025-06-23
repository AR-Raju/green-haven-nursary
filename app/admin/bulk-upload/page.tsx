"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import BulkImageUpload from "@/components/admin/BulkImageUpload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BulkUploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])

  const handleImagesUploaded = (urls: string[]) => {
    setUploadedUrls((prev) => [...prev, ...urls])
  }

  const downloadUrlsList = () => {
    if (uploadedUrls.length === 0) return

    const content = uploadedUrls.join("\n")
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `uploaded-images-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download Started",
      description: "Image URLs list has been downloaded",
    })
  }

  const copyUrlsToClipboard = async () => {
    if (uploadedUrls.length === 0) return

    try {
      await navigator.clipboard.writeText(uploadedUrls.join("\n"))
      toast({
        title: "Copied to Clipboard",
        description: "Image URLs have been copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URLs to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>

          <h1 className="text-3xl font-bold mb-2">Bulk Image Upload</h1>
          <p className="text-muted-foreground">Upload multiple images at once for your products and categories</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BulkImageUpload onImagesUploaded={handleImagesUploaded} maxImages={20} />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{uploadedUrls.length}</div>
                    <p className="text-sm text-muted-foreground">Images Uploaded</p>
                  </div>

                  {uploadedUrls.length > 0 && (
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" onClick={copyUrlsToClipboard} className="w-full">
                        Copy URLs
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadUrlsList} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download List
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium">Supported Formats</h4>
                  <p className="text-muted-foreground">JPG, PNG, GIF, WebP</p>
                </div>
                <div>
                  <h4 className="font-medium">File Size Limit</h4>
                  <p className="text-muted-foreground">Maximum 5MB per image</p>
                </div>
                <div>
                  <h4 className="font-medium">Batch Limit</h4>
                  <p className="text-muted-foreground">Up to 20 images at once</p>
                </div>
                <div>
                  <h4 className="font-medium">Drag & Drop</h4>
                  <p className="text-muted-foreground">Drag files directly to the upload area</p>
                </div>
              </CardContent>
            </Card>

            {uploadedUrls.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Uploads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uploadedUrls.slice(-5).map((url, index) => (
                      <div key={index} className="text-xs p-2 bg-gray-50 rounded break-all">
                        {url}
                      </div>
                    ))}
                    {uploadedUrls.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center">And {uploadedUrls.length - 5} more...</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
