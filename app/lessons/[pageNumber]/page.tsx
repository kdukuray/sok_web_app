"use client";
import { useEffect, useState } from "react";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { toast } from "sonner";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import LessonCard from "@/custom_components/LessonCard";
import PagePagination from "@/custom_components/PagePagination";
import Spinner from "@/custom_components/Spinner";

const client = createClient();

interface LessonsPageParams {
    pageNumber: string;
}

interface LessonData {
    lessonId: number;
    title: string;
    lecturer: string;
    discipline: string;
    book: string;
    videoLink: string;
    pdfLink: string;
    summary: string;
    createdAt: string;
}

export default function Lessons({ params }: {params: Promise<LessonsPageParams>}) {
    const [allLessons, setAllLessons] = useState<LessonData[] | undefined>([]);
    const [filteredLessons, setFilteredLessons] = useState<LessonData[] | undefined>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [nextPageAvailable, setNextPageAvailable] = useState<boolean>(true);
    const pageLimit: number = 10;


    async function searchLessonsFromDB(searchTerm: string) {

        let query = client
            .from("lessons")
            .select("*")
            .order("createdAt", { ascending: false })
            .limit(pageLimit);

        if (searchTerm.trim() !== "") {
            query = query.ilike("title", `%${searchTerm}%`);  // <-- CASE INSENSITIVE search
        }

        const { data, error }: PostgrestSingleResponse<LessonData[]> = await query;

        if (!error) {
            if (data.length < pageLimit) {
                setNextPageAvailable(false);
            } else {
                setNextPageAvailable(true);
            }
            return data;
        } else {
            toast.error("Network Error", {
                description: `A network error has occurred. Please try again later.`,
            });
        }
    }


    async function getAllLessons(params: Promise<LessonsPageParams>) {
        const paramsData = await params;
        const pageNumber = parseInt(paramsData.pageNumber);
        setPageNumber(pageNumber);

        const pageLimit = 10;
        const { data, error }: PostgrestSingleResponse<LessonData[]> = await client
            .from("lessons")
            .select("*")
            .order("createdAt", { ascending: false })
            .limit(pageLimit)
            .range(pageNumber * pageLimit - pageLimit, pageNumber * pageLimit - 1);

        if (!error) {
            if (data.length < pageLimit) {
                setNextPageAvailable(false);
            }
            return data;
        } else {
            toast.error("Network Error", {
                description: `A network error has occurred. Please try again later.`,
            });
        }
    }

    // 1. Fetch the initial page when component loads
    useEffect(() => {
        getAllLessons(params).then((data: LessonData[] | undefined) => {
            if (data) {
                setAllLessons(data);
                setFilteredLessons(data);
            }
        });
    }, [params]);

    // 2. Whenever searchTerm changes, query the database if searchTerm is not empty
    useEffect(() => {
        async function fetchSearchResults() {
            if (searchTerm.trim() === "") {
                // If no search term, show the default lessons for that page
                setFilteredLessons(allLessons);
            } else {
                const data = await searchLessonsFromDB(searchTerm);
                setFilteredLessons(data);
            }
        }

        fetchSearchResults();
    }, [searchTerm]);



    return (
        <div className="min-h-dvh relative pb-22">
            {/* Search Bar */}
            <div className="flex justify-center p-5">
                <input
                    type="text"
                    placeholder="Search lessons by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* Lessons List */}
            <div className="lg:pl-20 lg:pr-20 pt-5 flex justify-between flex-wrap">
                {filteredLessons ? (
                    filteredLessons.length > 0 ? (
                        filteredLessons.map((lesson) => (
                            <Link href={`details/${lesson.lessonId}`} key={lesson.lessonId}>
                                <LessonCard lesson={lesson} />
                            </Link>
                        ))
                    ) : (
                        <div className="text-center w-full text-gray-500 pt-10">No lessons found.</div>
                    )
                ) : (
                    <Spinner />
                )}
            </div>

            {/* Pagination */}
            <PagePagination pageNumber={pageNumber} nextPageAvailable={nextPageAvailable} />
        </div>
    );
}
