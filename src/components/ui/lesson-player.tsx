"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUserWatchLesson, useAddLessonComment, useTrackLessonProgress } from "@/hooks/useUserCourse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Download,
  MessageCircle,
  Send,
  User,
  Clock,
  CheckCircle,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Lesson, LessonComment } from "@/types/course.types";
import Link from "next/link";
import Image from "next/image";


interface LessonPlayerProps {
  courseId: string;
  lessonId: string;
  onLessonComplete?: () => void;
  onNextLesson?: () => void;
  onPreviousLesson?: () => void;
  hasNextLesson?: boolean;
  hasPreviousLesson?: boolean;
}

export default function LessonPlayer({
  courseId,
  lessonId,
  onLessonComplete,
  onNextLesson,
  onPreviousLesson,
  hasNextLesson,
  hasPreviousLesson,
}: LessonPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [comment, setComment] = useState("");

  const trackProgress = useTrackLessonProgress();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);


  const {
    data: lessonData,
    isLoading,
    isError,
  } = useUserWatchLesson(lessonId);
  const addComment = useAddLessonComment();

  const lesson: Lesson | undefined = lessonData?.data;
  const course = lessonData?.course;
  const siblingLessons = lessonData?.lesson || [];
  const comments: LessonComment[] = lessonData?.comments || [];
  console.log("lesson", lessonData?.data?.url);

  const currentLessonIndex = siblingLessons.findIndex((l: Lesson) => l._id === lessonId);
  const prevLesson = currentLessonIndex > 0 ? siblingLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex !== -1 && currentLessonIndex < siblingLessons.length - 1 ? siblingLessons[currentLessonIndex + 1] : null;

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying && lessonId && videoRef.current) {
      intervalId = setInterval(() => {
        const video = videoRef.current;
        if (video && video.duration > 0) {
          const percentage = Math.round((video.currentTime / video.duration) * 100);
          trackProgress.mutate({ lessonId, duration: percentage });
        }
      }, 30000);
    }

    return () => clearInterval(intervalId);
  }, [isPlaying, lessonId, trackProgress]);

  const handleLessonComplete = () => {
    if (onLessonComplete) onLessonComplete();
  };

  const handleNext = () => {
    if (onNextLesson) onNextLesson();
  };

  const handlePrevious = () => {
    if (onPreviousLesson) onPreviousLesson();
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      // Auto-seek to saved watch_time (assuming watch_time is percentage)
      if (lesson?.watch_time && lesson.watch_time > 0) {
        const seekTime = (lesson.watch_time / 100) * videoRef.current.duration;
        videoRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (newMuted) {
        videoRef.current.volume = 0;
        setVolume(0);
      } else {
        videoRef.current.volume = 1;
        setVolume(1);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    
    if (isPlaying) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      setControlsTimeout(timeout);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleSubmitComment = () => {
    if (comment.trim()) {
      addComment.mutate({
        courseId,
        lessonId,
        commentData: {
          message: comment.trim(),
        },
      });
      setComment("");
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-red-600">Failed to load lesson</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Video Player */}
      <div
        ref={videoContainerRef}
        className={`relative ${
          isFullscreen ? "fixed inset-0 z-50 w-full h-full bg-black" : "relative aspect-video bg-black rounded-lg overflow-hidden shadow-xl group"
        }`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        onClick={togglePlay}
      >
        <video 
          ref={videoRef}
          src={lessonData?.data?.url} 
          poster={lessonData?.data?.thumbnail} 
          className="w-full h-full object-contain cursor-pointer"
          onEnded={() => { setIsPlaying(false); handleLessonComplete(); }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          controlsList="nodownload"
          playsInline
        />

        {/* Custom YouTube-style Controls Overlay */}
        <div 
          className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 flex flex-col justify-end
            ${showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Bar */}
          <div className="w-full h-1.5 mb-4 group/progress cursor-pointer relative flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full h-full bg-white/30 rounded-full relative overflow-hidden transition-all group-hover/progress:h-2">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
            </div>
            {/* Scrubber Knob */}
            <div 
              className="absolute h-3 w-3 bg-blue-500 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity z-20 pointer-events-none shadow-sm"
              style={{ left: `calc(${(currentTime / (duration || 1)) * 100}% - 6px)` }}
            />
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <button onClick={togglePlay} className="hover:text-blue-400 transition-colors focus:outline-none">
                {isPlaying ? <Pause className="h-6 w-6" fill="currentColor" /> : <Play className="h-6 w-6" fill="currentColor" />}
              </button>

              <div className="flex items-center space-x-2 group/volume relative">
                <button onClick={toggleMute} className="hover:text-blue-400 transition-colors focus:outline-none">
                  {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300 flex items-center">
                   <input 
                     type="range" 
                     min="0" 
                     max="1" 
                     step="0.05"
                     value={isMuted ? 0 : volume}
                     onChange={handleVolumeChange}
                     className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-blue-500"
                   />
                </div>
              </div>

              <div className="text-sm font-medium tabular-nums tracking-wide opacity-90">
                {formatTime(currentTime)} <span className="opacity-60 mx-1">/</span> {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="hover:text-blue-400 transition-colors focus:outline-none opacity-90 hover:opacity-100">
                <Settings className="h-5 w-5" />
              </button>
              <button onClick={toggleFullscreen} className="hover:text-blue-400 transition-colors focus:outline-none opacity-90 hover:opacity-100">
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Information and Interactive Elements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lesson Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {lesson.title}
              </h1>
              <div className="flex items-center space-x-2">
                {lesson.free && (
                  <Badge className="bg-green-100 text-green-800">Free</Badge>
                )}
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {lesson.duration}m
                </Badge>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{lesson.description}</p>

            {/* Progress Button */}
            <Button onClick={handleLessonComplete} className="mb-4">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Complete
            </Button>
          </div>

          {/* Tabs */}
          <div className="space-y-4">
            {/* Transcript */}
            {lesson.transcript && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-lg">
                      <FileText className="h-5 w-5 mr-2" />
                      Transcript
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTranscript(!showTranscript)}
                    >
                      {showTranscript ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {showTranscript && (
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {lesson.transcript}
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Resources */}
            {lesson.resources && lesson.resources.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-lg">
                      <Download className="h-5 w-5 mr-2" />
                      Resources
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowResources(!showResources)}
                    >
                      {showResources ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {showResources && (
                  <CardContent>
                    <div className="space-y-2">
                      {lesson.resources.map((resource, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="font-medium">
                              {resource.filename}
                            </span>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={resource.path}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Comments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Comments ({comments.length})
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowComments(!showComments)}
                  >
                    {showComments ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              {showComments && (
                <CardContent className="space-y-4">
                  {/* Add Comment */}
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Ask a question or share your thoughts..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                    />
                    <Button
                      onClick={handleSubmitComment}
                      disabled={addComment.isPending || !comment.trim()}
                      className="w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div
                          key={comment._id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-gray-900">
                                  {comment.user.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {new Date(
                                    comment.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700">{comment.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No comments yet. Be the first to ask a question!
                      </p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lesson Info */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{lesson.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Views</span>
                <span className="font-medium">
                  {Array.isArray(lesson.views) ? lesson.views.length : (lesson.views ?? 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Position</span>
                <span className="font-medium">#{lesson.position}</span>
              </div>
              {lesson.group && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Group</span>
                  <Badge variant="outline">{lesson.group}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nextLesson && (
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Up Next</span>
                  <Link href={`/user/courses/${courseId}/lessons/${nextLesson._id}`} className="group block">
                    <div className="flex gap-3 items-center rounded-lg hover:bg-gray-50 p-2 -mx-2 transition-colors">
                      <div className="relative w-24 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image
                          src={nextLesson.thumbnail || "/images/image_placeholder.jpg"}
                          alt={nextLesson.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="96px"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Play className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {nextLesson.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {nextLesson.duration}m
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {prevLesson && (
                <div className="space-y-2 pt-2 border-t">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Previous</span>
                  <Link href={`/user/courses/${courseId}/lessons/${prevLesson._id}`} className="group block">
                    <div className="flex gap-3 items-center rounded-lg hover:bg-gray-50 p-2 -mx-2 transition-colors">
                      <div className="relative w-24 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image
                          src={prevLesson.thumbnail || "/images/image_placeholder.jpg"}
                          alt={prevLesson.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="96px"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {prevLesson.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {prevLesson.duration}m
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {!nextLesson && !prevLesson && (
                <p className="text-sm text-gray-500 text-center py-2">No other lessons available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
