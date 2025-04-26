"use client"
import { Button } from "@/components/ui/button";
import {PostgrestMaybeSingleResponse, PostgrestSingleResponse } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import Link from "next/link";
import AdminAnnouncementCard from "@/custom_components/AdminAnnouncementCard";
import { toast } from "sonner";
import PagePagination from "@/custom_components/PagePagination";
import { useRouter } from 'next/navigation'
import { createClient } from "@/utils/supabase/client";


const client = createClient()

interface AdminAnnouncementsParams{
    pageNumber: string
}

interface AnnouncementData {
    announcementId: number,
    title: string,
    description: string,
    createdAt: string
}

export default function AdminAnnouncements({ params }: {params: Promise<AdminAnnouncementsParams>}) {
    const router = useRouter()
    const [allAnnoucements, setAllAnnoucements] = useState<AnnouncementData[] | undefined>([]);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const pageLimit: number = 10;
    const [nextPageAvailable, setNextPageAvailable] = useState<boolean>(true)


     // function that deletes an announcement
     async function deleteAnnouncement(announcementId: number) {
        const { error }: PostgrestMaybeSingleResponse<AnnouncementData> = await client
        .from("announcements")
        .delete()
        .eq("announcementId", announcementId)
        if (!error) {
            toast.success("Deletion Succesful", {
                description: "The Announcement has successfully been deleted from the database."
            })
            setAllAnnoucements(allAnnoucements?.filter((announcement)=> announcement.announcementId != announcementId))
        }
        else{
            toast.error("Network Error", {
                description: `A network error has occured. Please try again later.`
            })

        }
    }
    

    // function to get all the announcments from the server
    async function getAllAnnoucements(params: Promise<AdminAnnouncementsParams>) {
        const paramsData = await params;
        const pageNumber = parseInt(paramsData.pageNumber)
        setPageNumber(pageNumber)

        const { data, error }: PostgrestSingleResponse<AnnouncementData[]> = await client
        .from("announcements")
        .select("*")
        .order("createdAt", {ascending: false})
        .limit(pageLimit)
        .range(pageNumber * pageLimit - pageLimit, pageNumber * pageLimit - 1)
        if (!error) {
            if (data.length < pageLimit) {
                setNextPageAvailable(false)
            }
            return data
        }
        else{
            toast.error("Network Error", {
                description: `A network error has occured. Please try again later.`
            })
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await client.auth.getUser();
            if (!data.user) {
                router.push('/login');
            }
        };
        checkAuth();
        getAllAnnoucements(params)
            .then((data: AnnouncementData[] | undefined) => {
                setAllAnnoucements(data)
            })
    }, [])

    return (
        <div className="min-h-dvh pb-22 relative">
            <div className="relative">
                <h3 className="text-center text-3xl text-blue-900 font-extrabold mb-4">Announcements</h3>
                <Link href="/admin/announcements/create">
                <Button className="absolute top-0 left-0 bg-blue-800 hover:bg-blue-900 text-2xl flex justify-center items-center cursor-pointer">
                    <p>+</p>
                </Button>
                </Link>
                <div className="flex flex-col justify-center items-center">
                    {allAnnoucements && allAnnoucements.map((announcement, index) => (
                        <AdminAnnouncementCard announcement={announcement} deleteAnnouncement={deleteAnnouncement} key={index}/>

                    ))}
                </div>
            </div>
            <PagePagination pageNumber={pageNumber} nextPageAvailable={nextPageAvailable}/>
        </div>)
}