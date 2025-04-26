"use client";
import { PostgrestSingleResponse } from "@supabase/supabase-js"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'
import { toast } from "sonner";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const client = createClient();
const { data: user } = await client.auth.getUser();

interface LessonData {
    title: string,
    lecturer: string,
    discipline: string,
    book?: string,
    videoLink?: string,
    pdfLink?: string,
    summary?: string,
    user_id: string | undefined,
}

export default function CreateLesson() {
    const router = useRouter()

    // Takes regular youtube links (all types), and turns them into emded iframe youtube links
    
    function toEmbedUrl(rawUrl: string | undefined): string {
        if (!rawUrl) return "";

        try {
            const url = new URL(rawUrl);
            let id: string | null = '';

            if (url.hostname === 'youtu.be') {
                // Short link: youtu.be/<id>
                id = url.pathname.slice(1);
            } else if (url.pathname.startsWith('/embed/')) {
                // Already embed: /embed/<id>
                id = url.pathname.split('/')[2];
            } else {
                // Standard watch link: /watch?v=<id>
                id = url.searchParams.get('v');
            }

            return id ? `https://www.youtube.com/embed/${id}` : "";
        } catch {
            return ""; // Invalid URL string
        }
    }


    // Create lesson form schema
    const createLessonFormSchema = z.object({
        title: z.string().min(3, "Title must be at least 3 characters long"),
        lecturer: z.string().min(3, "Lecturer name must be at least 3 characters long"),
        discipline: z.string().min(2, "Discipline is required"),
        book: z.string().optional(),
        videoLink: z.string().url().optional(),
        summary: z.string().optional(),
        pdfFile: z
            .custom<FileList>()
            .refine((files) => files && files.length === 1, "Upload one PDF")
            .refine(
                (files) => files && files[0]?.type === "application/pdf",
                "File must be a PDF",
            ).optional(),
    });

    // create lesson form
    const createLessonForm = useForm<z.infer<typeof createLessonFormSchema>>({
        resolver: zodResolver(createLessonFormSchema),
        defaultValues: {
            title: "",
            lecturer: "",
            discipline: "",
            book: "",
            videoLink: undefined,
            summary: "",
            pdfFile: undefined
        }
    });


    // function to upload pdf to supabase
    // if may seem like im uploading an empty url string if 
    // there is no pdf, but if no pdf is uploaded to the form, this function will never run in the first place 
    // (necessary conditional in place).
    // The last empty string is there simply to satisfy typescript
    async function uploadPdf(values: z.infer<typeof createLessonFormSchema>): Promise<string> {
        if (values.pdfFile && values.pdfFile.length > 0) {

            //Build the file name **once** so upload/getPublicUrl match
            const fileName = `title_${values.title}_${uuidv4()}.pdf`;

            // Upload the file
            const { data: uploadData, error: uploadError } = await client.storage
                .from("lecture-pdfs")
                .upload(fileName, values.pdfFile[0], {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (uploadError) {
                // Bubble the error up so the caller can handle it
                throw uploadError;
            }

            // Get a public URL 
            const { data: publicData } = client.storage
                .from("lecture-pdfs")
                .getPublicUrl(fileName);

            if (!publicData?.publicUrl) {
                throw new Error("Failed to generate a public URL");
            }

            const publicUrl = publicData.publicUrl;

            return publicUrl;
        }
        return "";
    }


    async function createNewLesson(values: z.infer<typeof createLessonFormSchema>) {
        let newLesson: LessonData = {
            title: values.title,
            lecturer: values.lecturer,
            discipline: values.discipline,
            // optional props need conditional incase there are not defined
            book: values.book ? values.book : undefined,
            videoLink: values.videoLink ? toEmbedUrl(values.videoLink) : undefined,
            summary: values.summary ? values.summary : undefined,
            pdfLink: undefined,
            user_id: user?.user?.id,

        }

        // if pdf has been input, upload it and set pdflink to the upladed pdf's link
        if (values.pdfFile && values.pdfFile.length > 0) {
            try{
                newLesson.pdfLink = await uploadPdf(values);
                toast.success("Upload Succeful", {
                    description: "The lecture pdf has been uploaded successfully."
                })
            }
            catch{
                toast.error("Network Error", {
                    description: `A network error has occured. Please try again later.`
                })
            }
            
        }

        const { error }: PostgrestSingleResponse<LessonData[]> = await client.from("lessons").insert([newLesson]).select()
        if (!error) {
            toast.success("Creation Success", {
                description: "New Lesson created Successfully"
            })
            router.push("/admin/lessons/1/")
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
        <Form {...createLessonForm}>
            <form className="space-y-6" onSubmit={createLessonForm.handleSubmit(createNewLesson)}>
                {/* Title */}
                <FormField
                    control={createLessonForm.control}
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

                {/* Lecturer */}
                <FormField
                    control={createLessonForm.control}
                    name="lecturer"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Lecturer</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Lecturer's name"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                {/* Discipline */}
                <FormField
                    control={createLessonForm.control}
                    name="discipline"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Discipline</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="e.g. Tawheed, Quran, Fiqh"
                                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />


                {/* Book */}
                <FormField
                    control={createLessonForm.control}
                    name="book"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Book</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="e.g. Quran, Uthool Al-Thalatha etc."
                                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />


                <FormField
                    control={createLessonForm.control}
                    name="pdfFile"
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">PDF file</FormLabel>
                            <FormControl>
                                {/* use plain <input> or a wrapper that DOESN’T auto‑spread props */}
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    name={name}
                                    ref={ref}
                                    onBlur={onBlur}
                                    onChange={(e) => onChange(e.target.files)}  // FileList → RHF
                                    className="w-full border border-gray-300 rounded-md p-2
                                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />


                {/* Summary */}
                <FormField
                    control={createLessonForm.control}
                    name="summary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Summary</FormLabel>
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

                {/* Video Link */}
                <FormField
                    control={createLessonForm.control}
                    name="videoLink"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Video Link</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="https://youtube.com/..."
                                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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