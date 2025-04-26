"use client";
import { PostgrestSingleResponse } from "@supabase/supabase-js"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useRouter } from 'next/navigation'
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

const client = createClient();

interface EditAnnouncementsPageParams {
    announcementId: string
}

interface AnnouncementData {
    title: string,
    description: string
}
export default function EditAnnouncement({ params }: { params: Promise<EditAnnouncementsPageParams> }) {

    const router = useRouter();

    // Edit Announcement Form Schema 
    const editAnnouncementFormSchema = z.object({
        title: z.string().min(3, "Title must be at least 3 characters long"),
        description: z.string().optional(),
    });

    // Edit Announcement Form
    const editAnnouncementForm = useForm<z.infer<typeof editAnnouncementFormSchema>>({
        resolver: zodResolver(editAnnouncementFormSchema),
        defaultValues: {
            title: "",
            description: ""
        }
    });

    // Function to create a new announcement
    async function getAnnouncement(params: Promise<EditAnnouncementsPageParams>) {
        const paramsData = await params;
        const { data, error }: PostgrestSingleResponse<AnnouncementData> = await client
            .from("announcements")
            .select("*")
            .eq("announcementId", paramsData.announcementId)
            .single();

        if (error) {
            toast.error("Network Error", {
                description: `A network error has occured. Please try again later.`
            })
            return;
        }

        if (data) {
            editAnnouncementForm.setValue("title", data.title || "");
            editAnnouncementForm.setValue("description", data.description || "");
        }
    }

    // Function to edit an announcement 
    async function editExistingAnnouncement(values: z.infer<typeof editAnnouncementFormSchema>) {
        const paramsData = await params;
        const updatedLesson = {
            title: values.title,
            description: values.description
        };

        const { error } = await client
            .from("announcements")
            .update(updatedLesson)
            .eq("announcementId", paramsData.announcementId)
            .select();

        if (!error) {
            toast.success("Update Success", {
                description: "Announcement updated successfully!"
            });
            router.back();

        } else {
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

        getAnnouncement(params)
    }, [])

    return (<div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <Form {...editAnnouncementForm}>
            <form className="space-y-6" onSubmit={editAnnouncementForm.handleSubmit(editExistingAnnouncement)}>
                {/* Title */}
                <FormField
                    control={editAnnouncementForm.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Title</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Enter lesson title"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Description */}
                <FormField
                    control={editAnnouncementForm.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Brief summary of the lesson"
                                    className="w-full border border-gray-300 rounded-md p-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <button
                    type="submit"
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                >
                    Submit
                </button>
            </form>
        </Form>
    </div>
    )
}