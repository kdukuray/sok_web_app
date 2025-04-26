import { Card, CardContent } from "@/components/ui/card";

export default function LessonCard({ lesson }: { lesson: any }) {
  return (
    <Card className="w-[320px] sm:w-[350px] md:w-[400px] mb-6">
      <CardContent className="p-4 flex flex-col">
        {/* Responsive video container */}
        <div className="relative w-full pt-[56.25%] rounded-sm overflow-hidden">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-sm"
            src={lesson.videoLink}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>

        {/* Lesson Info */}
        <div className="pt-4 text-blue-950 text-sm sm:text-base md:text-lg">
          <p className="mb-1"><strong>Title:</strong> {lesson.title}</p>
          <p className="mb-1"><strong>Lecturer:</strong> {lesson.lecturer}</p>
          <p className="mb-1"><strong>Book:</strong> {lesson.book}</p>
        </div>
      </CardContent>
    </Card>
  );
}
