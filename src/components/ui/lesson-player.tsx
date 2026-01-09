"use client";

import React, { useState, useEffect } from "react";
import { useUserWatchLesson, useAddLessonComment } from "@/hooks/useUserCourse";
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
  const [currentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [comment, setComment] = useState("");


  const {
    data: lessonData,
    isLoading,
    isError,
  } = useUserWatchLesson(courseId, lessonId);
  const addComment = useAddLessonComment();

  const lesson: Lesson | undefined = lessonData?.data;
  const comments: LessonComment[] = lessonData?.comments || [];

  useEffect(() => {
    if (lesson) {
      setDuration(lesson.duration * 60); // Convert minutes to seconds
    }
  }, [lesson]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      addComment.mutate({
        courseId,
        lessonId,
        commentData: {
          comment: comment.trim(),
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
        className={`relative ${
          isFullscreen ? "fixed inset-0 z-50 bg-black" : "aspect-video"
        } bg-black rounded-lg overflow-hidden`}
      >
        {/* Video Element Placeholder */}
        <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          {lesson.thumbnail && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-50"
              style={{ backgroundImage: `url(${lesson.thumbnail})` }}
            />
          )}

          {/* Play Button Overlay */}
          {!isPlaying && (
            <Button
              size="lg"
              className="absolute inset-0 w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 m-auto"
              onClick={handlePlayPause}
            >
              <Play className="h-8 w-8 text-white" />
            </Button>
          )}

          {/* Video URL display (for demo) */}
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
            Video: {lesson.url}
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full h-2 bg-white/20 rounded-full cursor-pointer">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPreviousLesson}
                  disabled={!hasPreviousLesson}
                  className="text-white hover:bg-white/20"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNextLesson}
                  disabled={!hasNextLesson}
                  className="text-white hover:bg-white/20"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>

                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <Settings className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
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
            <Button onClick={onLessonComplete} className="mb-4">
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
                <span className="font-medium">{lesson.views?.length || 0}</span>
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
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={onPreviousLesson}
                disabled={!hasPreviousLesson}
              >
                <SkipBack className="h-4 w-4 mr-2" />
                Previous Lesson
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={onNextLesson}
                disabled={!hasNextLesson}
              >
                Next Lesson
                <SkipForward className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
