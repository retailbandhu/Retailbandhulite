import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  X,
  Mic,
  MessageSquare,
  Package,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Home,
} from 'lucide-react';

interface VideoDemoProps {
  onClose?: () => void;
  onBackToHome?: () => void;
  autoPlay?: boolean;
}

export function VideoDemo({ onClose, onBackToHome, autoPlay = false }: VideoDemoProps) {
  const [selectedVideo, setSelectedVideo] = useState<string>('overview');
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const videos = [
    {
      id: 'overview',
      title: 'Complete Overview',
      duration: '2:30',
      thumbnail: 'Overview of all features',
      description: 'Full app tour - sabhi features ek saath',
      icon: Sparkles,
      views: '12.5K'
    },
    {
      id: 'voice-billing',
      title: 'Voice Billing Demo',
      duration: '1:15',
      thumbnail: 'Voice billing in action',
      description: 'See how voice billing works in real shop',
      icon: Mic,
      views: '8.2K'
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Integration',
      duration: '1:45',
      thumbnail: 'WhatsApp bill sharing',
      description: 'Bill sharing and automation demo',
      icon: MessageSquare,
      views: '6.8K'
    },
    {
      id: 'inventory',
      title: 'Inventory Management',
      duration: '2:00',
      thumbnail: 'Stock management',
      description: 'Complete inventory walkthrough',
      icon: Package,
      views: '5.3K'
    },
    {
      id: 'analytics',
      title: 'Reports & Analytics',
      duration: '1:30',
      thumbnail: 'Analytics dashboard',
      description: 'Business insights and reports',
      icon: TrendingUp,
      views: '4.9K'
    }
  ];

  const selectedVideoData = videos.find(v => v.id === selectedVideo) || videos[0];
  const Icon = selectedVideoData.icon;

  // Simulate video progress
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
          <Play className="w-3 h-3 mr-1" />
          Video Tutorials
        </Badge>
        <h2 className="text-3xl md:text-5xl mb-4 text-gray-900">
          Watch <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">How It Works</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Quick video demos to understand each feature. Dekho aur samjho - bilkul simple!
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden bg-black">
            {/* Video Area */}
            <div className="aspect-video bg-gradient-to-br from-[#1E88E5] to-[#FF6F00] relative group">
              {/* Video Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Icon className="w-24 h-24 mx-auto mb-6 opacity-50" />
                  <h3 className="text-2xl mb-2">{selectedVideoData.title}</h3>
                  <p className="text-white/80 mb-6">{selectedVideoData.description}</p>
                  <div className="flex items-center justify-center gap-4">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {selectedVideoData.duration} duration
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30">
                      {selectedVideoData.views} views
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Play/Pause Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <Button
                  size="lg"
                  className="w-20 h-20 rounded-full bg-white/90 hover:bg-white hover:scale-110 transition-all"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-blue-600" />
                  ) : (
                    <Play className="w-10 h-10 text-blue-600 ml-1" />
                  )}
                </Button>
              </div>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] transition-all"
                      style={{ width: `${isPlaying ? (currentTime % 100) : 0}%` }}
                    />
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={handleRestart}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                    <span className="text-sm">
                      0:00 / {selectedVideoData.duration}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-white/20"
                  >
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Video Info */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-[#1E88E5] to-[#FF6F00] flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl mb-2 text-gray-900">{selectedVideoData.title}</h3>
                <p className="text-gray-600 mb-4">{selectedVideoData.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{selectedVideoData.views} views</span>
                  <span>•</span>
                  <span>{selectedVideoData.duration} minutes</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Hindi + English
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Chapters/Key Points */}
          <Card className="p-6">
            <h4 className="text-lg mb-4 text-gray-900">Video Chapters</h4>
            <div className="space-y-3">
              {[
                { time: '0:00', title: 'Introduction', description: 'Welcome and overview' },
                { time: '0:30', title: 'Main Feature Demo', description: 'Step-by-step walkthrough' },
                { time: '1:30', title: 'Pro Tips', description: 'Advanced usage tips' },
                { time: '2:00', title: 'Common Questions', description: 'FAQ answers' }
              ].map((chapter, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Badge variant="outline" className="font-mono">
                    {chapter.time}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-gray-900">{chapter.title}</p>
                    <p className="text-sm text-gray-600">{chapter.description}</p>
                  </div>
                  <Play className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Video List Sidebar */}
        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="mb-4 text-gray-900">All Video Tutorials</h4>
            <div className="space-y-3">
              {videos.map((video) => {
                const VideoIcon = video.icon;
                return (
                  <div
                    key={video.id}
                    onClick={() => setSelectedVideo(video.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedVideo === video.id
                        ? 'bg-gradient-to-r from-blue-50 to-orange-50 border-2 border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-14 rounded bg-gradient-to-br from-[#1E88E5] to-[#FF6F00] flex items-center justify-center">
                          <VideoIcon className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="absolute -bottom-1 -right-1 text-xs bg-black text-white border-0 px-1 py-0">
                          {video.duration}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm mb-1 text-gray-900 truncate">
                          {video.title}
                        </h5>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                          {video.description}
                        </p>
                        <p className="text-xs text-gray-500">{video.views} views</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* CTA Card */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-orange-50 border-2 border-blue-200">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E88E5] to-[#FF6F00] flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg mb-2 text-gray-900">Ready to Start?</h4>
              <p className="text-sm text-gray-600 mb-4">
                Begin your free trial and experience all features
              </p>
              <Button className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">
                Start Free Trial
              </Button>
              <p className="text-xs text-gray-500 mt-3">
                No credit card required
              </p>
            </div>
          </Card>

          {/* Help Card */}
          <Card className="p-6">
            <h4 className="text-lg mb-3 text-gray-900">Need Help?</h4>
            <div className="space-y-3 text-sm">
              <a href="#" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <MessageSquare className="w-4 h-4" />
                WhatsApp Support
              </a>
              <a href="#" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <Play className="w-4 h-4" />
                Video Tutorials
              </a>
              <a href="#" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <CheckCircle2 className="w-4 h-4" />
                Documentation
              </a>
            </div>
          </Card>

          {/* Back to Home Button */}
          <Card className="p-6">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white"
              onClick={onBackToHome}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}