"use client";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation'
import { toast } from "sonner";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const client = createClient();

const { data: user } = await client.auth.getUser();

export default function CreateAnnouncement() {

    const router = useRouter()

    // Create Announcement form schema
    const createAnnouncementFormSchema = z.object({
        title: z.string().min(3, "Title must be at least 3 characters long"),
        description: z.string().optional(),
    });

    // Create Announcement form
    const createAnnouncementForm = useForm<z.infer<typeof createAnnouncementFormSchema>>({
        resolver: zodResolver(createAnnouncementFormSchema),
        defaultValues: {
            title: "",
            description: ""
        }
    });

    // Function to create a new announcement
    async function createNewAnnouncement(values: z.infer<typeof createAnnouncementFormSchema>) {
        const newAnnouncement = {
            title: values.title,
            description: values.description,
            user_id: user?.user?.id
        }
        const {error} = await client
        .from("announcements")
        .insert([newAnnouncement])
        .select()
       

        if (!error){
            toast.success("Creation Successful", {
                description: "New announcement created successfully"
            })
            router.push("/admin/announcements/1/")
        }
        else {
            toast.error("Network Error", {
                description: `A network error has occured. Please try again later.`
            })
        }
    }

    useEffect(()=>{
        const checkAuth = async () => {
            const { data } = await client.auth.getUser();
            if (!data.user) {
                router.push('/login');
            }
        };
        checkAuth();
    })

    return (<div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <Form {...createAnnouncementForm}>
            <form className="space-y-6" onSubmit={createAnnouncementForm.handleSubmit(createNewAnnouncement)}>

                {/* Title */}
                <FormField
                    control={createAnnouncementForm.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Title</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Enter Announcement title"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

              
                {/* Description */}
                <FormField
                    control={createAnnouncementForm.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Description of the Announcement"
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