import {
    AlertDialogContent, AlertDialogHeader,
    AlertDialog, AlertDialogTitle,
    AlertDialogTrigger, AlertDialogDescription,
    AlertDialogFooter, AlertDialogCancel,
    AlertDialogAction
  } from "@/components/ui/alert-dialog";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent } from "@/components/ui/card";
  import Link from "next/link";
  
  interface LessonData {
    lessonId: number,
    title: string,
    lecturer: string,
    discipline: string,
    book: string,
    videoLink: string,
    pdfLink: string,
    summary: string,
    createdAt: string
  }
  
  export default function AdminLessonCard({ lesson, deleteLesson }: { lesson: LessonData, deleteLesson: (lessonId: number) => void; }) {
    return (
      <Card className="flex items-center justify-center px-4 py-4 mb-4 w-full max-w-5xl shadow-sm border rounded-lg">
        <CardContent className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full p-0">
          {/* Thumbnail / Video Preview */}
          {lesson.videoLink ? (
            <iframe
              className="rounded-sm w-full sm:w-[200px] h-[180px] sm:h-[120px]"
              src={lesson.videoLink}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="w-full sm:w-[200px] h-[180px] sm:h-[120px] flex items-center justify-center bg-gray-200 rounded-sm text-gray-600 text-sm">
              No video uploaded
            </div>
          )}
  
          {/* Lesson Info */}
          <div className="flex-1 text-sm text-blue-950 w-full">
            <p className="text-base font-semibold mb-1"><strong>Title:</strong> {lesson.title}</p>
            <p><strong>Lecturer:</strong> {lesson.lecturer}</p>
            <p><strong>Book:</strong> {lesson.book}</p>
          </div>
  
          {/* Actions */}
          <div className="flex flex-wrap sm:flex-col gap-2 justify-center sm:justify-start w-full sm:w-auto">
            <Link href={`/lessons/details/${lesson.lessonId}`}>
              <button className="px-3 py-1 text-white bg-green-600 hover:bg-green-700 rounded text-sm w-24 h-10 cursor-pointer">
                Go to
              </button>
            </Link>
            <Link href={`edit/${lesson.lessonId}`}>
              <button className="px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded text-sm w-24 h-10 cursor-pointer">
                Edit
              </button>
            </Link>
  
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded text-sm w-24 h-10 cursor-pointer">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this lesson and remove its data from your servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded text-sm cursor-pointer"
                    onClick={() => deleteLesson(lesson.lessonId)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
  
          </div>
        </CardContent>
      </Card>
    );
  }
  