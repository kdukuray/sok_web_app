"use client";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialog,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AnnouncementData {
  announcementId: number;
  title: string;
  description: string;
  createdAt: string;
}
interface AdminAnnouncementCardProps {
  announcement: AnnouncementData;
  deleteAnnouncement: (announcementId: number) => void;
}

export default function AdminAnnouncementCard(props: AdminAnnouncementCardProps) {
  const { announcement, deleteAnnouncement } = props;

  return (
    <div className="border-blue-800 text-blue-900 min-h-50 border-2 shadow-md p-6 rounded-lg mb-6 w-[320px] sm:w-[400px] md:w-[600px] lg:w-[800px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-xl sm:text-2xl font-bold">{announcement.title}</h2>
        <span className="text-xs sm:text-sm text-yellow-700 font-bold">
          {new Date(announcement.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="text-gray-700 text-sm sm:text-base mb-4">{announcement.description}</p>
      <div className="flex flex-wrap justify-end gap-2">
        <Link href={`edit/${announcement.announcementId}`}>
          <Button variant="outline" className="px-3 py-1 text-white hover:text-white bg-blue-600 hover:bg-blue-700 rounded text-sm w-24 h-10 cursor-pointer">
            Edit
          </Button>
        </Link>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="px-3 py-1 text-white hover:text-white bg-red-600 hover:bg-red-700 rounded text-sm w-24 h-10 cursor-pointer">
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this announcement and remove its data from your servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="px-3 py-1 text-white hover:text-white bg-red-600 hover:bg-red-700 rounded text-sm"
                onClick={() => deleteAnnouncement(announcement.announcementId)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
