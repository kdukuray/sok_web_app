"use client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

const client = createClient();

interface LessonsPageParams {
  lessonId: string;
}

interface LessonData {
  title: string;
  lecturer: string;
  discipline: string;
  book: string;
  videoLink: string;
  pdfLink: string;
  summary: string;
  createdAt: string;
}

export default function LessonPage({ params }: { params: Promise<LessonsPageParams> }) {
  const [lesson, setLesson] = useState<LessonData>();

  async function getLessonDetails(params: Promise<LessonsPageParams>) {
    const paramsData = await params;
    const { data, error }: PostgrestSingleResponse<LessonData> = await client
      .from("lessons")
      .select("*")
      .eq("lessonId", paramsData.lessonId)
      .single();
    if (!error) {
      return data;
    } else {
      toast.error("Network Error", {
        description: `A network error has occurred. Please try again later.`,
      });
    }
  }

  useEffect(() => {
    getLessonDetails(params).then((data: LessonData | undefined) => {
      setLesson(data);
    });
  }, []);

  return (
    <div className="min-h-dvh">
      {lesson && (
        <div className="pt-5">
          <div className="flex flex-col lg:flex-row justify-around gap-6 px-4">
            {/* Video Section */}
            <div className="flex-1">
              {lesson.videoLink ? (
                <div className="relative w-full pt-[56.25%] rounded-sm overflow-hidden">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-sm"
                    src={lesson.videoLink}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center bg-gray-100 text-gray-600 border border-dashed border-gray-400 rounded-sm">
                  Resource not available
                </div>
              )}
            </div>

            {/* PDF Section */}
            <div className="flex-1">
              {lesson.pdfLink ? (
                <div className="relative w-full pt-[56.25%] rounded-sm overflow-hidden">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-sm"
                    src={lesson.pdfLink}
                    title="Public PDF Viewer"
                    frameBorder="0"
                  ></iframe>
                </div>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center bg-gray-100 text-gray-600 border border-dashed border-gray-400 rounded-sm">
                  PDF resource not available
                </div>
              )}
            </div>
          </div>

          {/* Lesson Metadata */}
          <div className="lesson-metadata mt-6 p-6 rounded-lg shadow-md text-blue-950 space-y-4">
            <p className="text-xl">
              <strong>Title: </strong>
              <span className="font-normal">{lesson.title}</span>
            </p>
            <p className="text-lg">
              <strong>Lecturer: </strong>
              <span className="text-gray-700">{lesson.lecturer}</span>
            </p>
            <p className="">
              <strong>Date: </strong>
              <span className="italic">{new Date(lesson.createdAt).toLocaleString()}</span>
            </p>
            <div className="w-full max-w-4xl">
              <h4 className="text-lg font-bold mb-1">Summary</h4>
              <p className="text-gray-700 leading-relaxed">{lesson.summary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
