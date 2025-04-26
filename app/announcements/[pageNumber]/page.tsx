"use client";
import AnnouncementCard from "@/custom_components/AnnocementCard";
import { createClient, PostgrestSingleResponse } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import PagePagination from "@/custom_components/PagePagination";
import Spinner from "@/custom_components/Spinner";

let supabaseUrl = ""
let supabaseAnonKey = ""

if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

}
const client = createClient(supabaseUrl, supabaseAnonKey);

interface AnnocemenetsPageParams {
    pageNumber: string
}

interface AnnouncementData {
    title: string,
    description: string,
    createdAt: string
}

export default function Annocemenets({ params }: { params: Promise<AnnocemenetsPageParams> }) {

    const [allAnnoucements, setAllAnnoucements] = useState<AnnouncementData[] | undefined>([]);
    const [pageNumber, setPageNumber] = useState<number>(0)
    const pageLimit = 10
    const [nextPageAvailable, setNextPageAvailable] = useState(true)



    // function to get all the announcements in reverse chronological order
    async function getAllAnnoucements(params: Promise<AnnocemenetsPageParams>, pageLimit: number) {
        const paramsData = await params;
        const pageNumber = parseInt(paramsData.pageNumber)
        setPageNumber(pageNumber)

        const { data, error }: PostgrestSingleResponse<AnnouncementData[]> = await client
            .from("announcements")
            .select("*")
            .order("createdAt", { ascending: false })
            .limit(pageLimit)
            .range((pageNumber * pageLimit) - pageLimit, (pageNumber * pageLimit) - 1);
        if (!error) {
            if (data.length < pageLimit) {
                setNextPageAvailable(false)
            }
            return data
        }
        else {
            toast.error("Network Error", {
                description: `A network error has occured. Please try again later.`
            })

        }
    }

    useEffect(() => {
        getAllAnnoucements(params, pageLimit)
            .then((data: AnnouncementData[] | undefined) => {
                setAllAnnoucements(data)
            })

    }, [])


    return (
        <div className="min-h-dvh flex flex-col items-center pt-16 relative pb-16">
            <div>
                <h3 className="text-5xl mb-6 text-blue-950 ">Annoecements</h3>
            </div>
            <div className="w-4xl flex flex-col items-center">
                {allAnnoucements ?
                allAnnoucements.map((annocemenet: AnnouncementData, index: number) => (
                    <AnnouncementCard title={annocemenet.title}
                        description={annocemenet.description}
                        createdAt={annocemenet.createdAt}
                        key={index}
                    />
                ))
                :
                <Spinner></Spinner>
            
            
            }
                
           
            </div>
            <PagePagination pageNumber={pageNumber} nextPageAvailable={nextPageAvailable}/>
        </div>
    )



}