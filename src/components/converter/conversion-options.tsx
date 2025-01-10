import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sparkles, Gauge, Frame } from "lucide-react";
import { useState } from "react";

interface ConversionOptionsProps {
  type: "video" | "image";
  onOptionsChange: (options: object) => void;
  defaultValues: {
    format?: string;
    quality: number;
    preserveAudio?: boolean;
    resolution?: string;
    fps?: number;
  };
  isSelectDisabled?: boolean;
}

const formatOptions = {
  video: [
    { value: "mp4", label: "MP4", description: "Recommended" },
    { value: "webm", label: "WebM", description: "Better Compression" },
    { value: "mov", label: "MOV", description: "High Quality" },
  ],
  image: [
    { value: "webp", label: "WebP", description: "Recommended" },
    { value: "png", label: "PNG", description: "Lossless" },
    { value: "jpg", label: "JPG", description: "Smaller Size" },
    { value: "gif", label: "GIF", description: "Animations" },
    // { value: "avif", label: "AVIF", description: "Next-Gen" },
  ],
};

const defaultFormats = {
  video: "mp4",
  image: "webp",
};

export function ConversionOptions({
  type,
  onOptionsChange,
  defaultValues,
  isSelectDisabled,
}: ConversionOptionsProps) {
  const getQualityInfo = (quality: number) => {
    if (quality >= 90)
      return {
        text: "Best quality, larger file size",
        icon: Sparkles,
        color: "text-green-500",
      };
    if (quality >= 70)
      return {
        text: "Good balance of quality and size",
        icon: Gauge,
        color: "text-blue-500",
      };
    if (quality >= 50)
      return {
        text: "Reduced quality, smaller file size",
        icon: Frame,
        color: "text-yellow-500",
      };
    return {
      text: "Low quality, smallest file size",
      icon: Frame,
      color: "text-red-500",
    };
  };

  const QualityControl = () => {
    const qualityInfo = getQualityInfo(defaultValues.quality);
    const QualityIcon = qualityInfo.icon;
    const [localQuality, setLocalQuality] = useState(defaultValues.quality);

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">Quality</Label>
          <div className="flex items-center gap-2">
            <QualityIcon className={`w-4 h-4 ${qualityInfo.color}`} />
            <span className="text-sm font-medium">{localQuality}%</span>
          </div>
        </div>
        <Slider
          defaultValue={[defaultValues.quality]}
          max={100}
          step={5}
          className="py-4"
          onValueChange={([value]) => setLocalQuality(value)}
          onValueCommit={([value]) => onOptionsChange({ quality: value })}
        />
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          {qualityInfo.text}
        </p>
      </div>
    );
  };

  const FormatSelect = () => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Output Format</Label>
      <Select
        defaultValue={defaultValues.format || defaultFormats[type]}
        onValueChange={(value) => onOptionsChange({ format: value })}
        disabled={isSelectDisabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a format" />
        </SelectTrigger>
        <SelectContent>
          {formatOptions[type].map((format) => (
            <SelectItem key={format.value} value={format.value}>
              <div className="flex items-center justify-between w-full gap-1">
                <span>{format.label}</span>
                <span className="text-xs text-muted-foreground">
                  {format.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const VideoAdvancedOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Resolution</Label>
        <Select
          defaultValue={defaultValues.resolution || "1080p"}
          onValueChange={(value) => onOptionsChange({ resolution: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select resolution" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2160p">4K (2160p)</SelectItem>
            <SelectItem value="1440p">2K (1440p)</SelectItem>
            <SelectItem value="1080p">Full HD (1080p)</SelectItem>
            <SelectItem value="720p">HD (720p)</SelectItem>
            <SelectItem value="480p">SD (480p)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Frame Rate</Label>
        <Select
          defaultValue={String(defaultValues.fps || "30")}
          onValueChange={(value) => onOptionsChange({ fps: Number(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frame rate" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="60">60 FPS (Smooth)</SelectItem>
            <SelectItem value="30">30 FPS (Standard)</SelectItem>
            <SelectItem value="24">24 FPS (Cinema)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-sm font-medium">Preserve Audio</Label>
          <p className="text-sm text-muted-foreground">
            Keep original audio track
          </p>
        </div>
        <Switch
          defaultChecked={defaultValues.preserveAudio}
          onCheckedChange={(checked) =>
            onOptionsChange({ preserveAudio: checked })
          }
        />
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {type === "video" ? (
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <FormatSelect />
            <QualityControl />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <VideoAdvancedOptions />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-6">
          <FormatSelect />
          <QualityControl />
        </div>
      )}
    </div>
  );
}
