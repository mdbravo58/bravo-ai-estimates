import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Image, X, Download, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PhotoGalleryProps {
  jobId?: string;
  userId?: string;
  onUploadComplete?: () => void;
}

export const PhotoGallery = ({ jobId, userId, onUploadComplete }: PhotoGalleryProps) => {
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (jobId) {
      fetchPhotos();
    }
  }, [jobId]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload JPEG, PNG, WebP, or GIF images only.",
      });
      return;
    }

    // Validate file size (5MB limit for photos)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload images smaller than 5MB.",
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to upload photos.",
        });
        return;
      }

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('customer-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save file metadata to database if jobId is provided
      if (jobId) {
        const { error: dbError } = await supabase
          .from('job_files')
          .insert({
            job_id: jobId,
            file_name: file.name,
            file_path: filePath,
            file_type: 'photo',
            mime_type: file.type,
            file_size: file.size,
            uploaded_by: user.id,
          });

        if (dbError) throw dbError;
      }

      toast({
        title: "Photo uploaded",
        description: "Your photo has been uploaded successfully.",
      });

      onUploadComplete?.();
      fetchPhotos();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload photo.",
      });
    } finally {
      setUploading(false);
    }
  };

  const fetchPhotos = async () => {
    if (!jobId) return;

    try {
      const { data, error } = await supabase
        .from('job_files')
        .select('*')
        .eq('job_id', jobId)
        .eq('file_type', 'photo')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error: any) {
      console.error('Fetch error:', error);
    }
  };

  const getPhotoUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('customer-photos')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const downloadPhoto = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('customer-photos')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: error.message || "Failed to download photo.",
      });
    }
  };

  const deletePhoto = async (fileId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('customer-photos')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('job_files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      toast({
        title: "Photo deleted",
        description: "Photo has been removed successfully.",
      });

      fetchPhotos();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message || "Failed to delete photo.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Photo Gallery
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
          <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Upload project photos
            </p>
            <Input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploading}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Supported: JPEG, PNG, WebP, GIF (max 5MB)
            </p>
          </div>
        </div>

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Project Photos ({photos.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={getPhotoUrl(photo.file_path)}
                      alt={photo.file_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedPhoto(getPhotoUrl(photo.file_path))}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>{photo.file_name}</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[70vh] overflow-auto">
                          <img
                            src={getPhotoUrl(photo.file_path)}
                            alt={photo.file_name}
                            className="w-full h-auto"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => downloadPhoto(photo.file_path, photo.file_name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deletePhoto(photo.id, photo.file_path)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Photo info */}
                  <div className="mt-1">
                    <p className="text-xs text-muted-foreground truncate">
                      {photo.file_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(photo.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {photos.length === 0 && (
          <div className="text-center py-8">
            <Image className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">No photos uploaded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};