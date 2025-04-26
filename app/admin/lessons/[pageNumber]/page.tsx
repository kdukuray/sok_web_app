"use client"
import { Button } from "@/components/ui/button";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLessonCard from "@/custom_components/AdminLessonCard";
import { toast } from "sonner";
import PagePagination from "@/custom_components/PagePagination";
import { useRouter } from 'next/navigation'
import { createClient } from "@/utils/supabase/client";

const client = createClient();

interface AdminLessonsPageParams{
    pageNumber: string
}

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

export default function AdminLessons({ params }: {params: Promise<AdminLessonsPageParams>}) {
    const router = useRouter()


    const [allLessons, setAllLessons] = useState<LessonData[] | undefined>([]);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const pageLimit: number = 10;
    const [nextPageAvailable, setNextPageAvailable] = useState<boolean>(true)

    // Function to delete a lesson from the database
    async function deleteLesson(lessonId: number) {
        const { error }: PostgrestSingleResponse<null> = await client
        .from("lessons")
        .delete()
        .eq("lessonId", lessonId)

        if (!error) {
            setAllLessons(allLessons?.filter(lesson => lesson.lessonId != lessonId))
            toast.success(`Deletion Success`, {
                description: "The esson has been deleted successfully!"
            })
        }
        else{
            toast.error("Network Error", {
                description: `A network error has occured. Please try again later.`
            })
        }
    }

    // Function to get all of the lessons from the database.
    async function getAllLessons(params: Promise<AdminLessonsPageParams>) {
        const paramsData: AdminLessonsPageParams = await params;
        const pageNumber: number = parseInt(paramsData.pageNumber)
        setPageNumber(pageNumber)
        

        const { data, error }: PostgrestSingleResponse<LessonData[]> = await client
        .from("lessons")
        .select("*")
        .order("createdAt", { ascending: false })
        .limit(pageLimit)
        .range(pageNumber * pageLimit - pageLimit, pageNumber * pageLimit - 1)

        if (!error) {
            if (data.length < pageLimit){
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
        getAllLessons(params)
            .then((data: LessonData[] | undefined) => {
                setAllLessons(data)
            })
    }, [])

    return (
        <div className="min-h-dvh relative pb-22">
            <div className="relative">
                <h3 className="text-center text-3xl text-blue-900 font-extrabold mb-2">Lessons</h3>
                <Link href="/admin/lessons/create">
                <Button className="absolute top-0 left-0 bg-blue-800 hover:bg-blue-900 text-2xl flex justify-center items-center cursor-pointer">
                    <p>+</p>
                </Button>
                </Link>
                {allLessons && allLessons.map((lesson, index) => (
                    <AdminLessonCard lesson={lesson} deleteLesson={deleteLesson} key={index}></AdminLessonCard>

                ))}
            </div>
            <PagePagination pageNumber={pageNumber} nextPageAvailable={nextPageAvailable}/>



        </div>)
}