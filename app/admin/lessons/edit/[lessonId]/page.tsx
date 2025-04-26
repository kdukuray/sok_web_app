"use client";
import { PostgrestSingleResponse } from "@supabase/supabase-js"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';
import { createClient } from "@/utils/supabase/client";

const client = createClient();

interface EditLessonsPageParams {
    lessonId: string
}

interface LessonData {
    title: string,
    lecturer: string,
    discipline: string,
    book?: string,
    videoLink?: string,
    pdfLink?: string,
    summary?: string,
}

export default function EditLesson({ params }: { params: Promise<EditLessonsPageParams> }) {

    const router = useRouter();
    const [oldPdfLink, setOldPdfLink] = useState<string | undefined>("");

    // Schema for Editing Lessons
    const editLessonFormSchema = z.object({
        title: z.string().min(3, "Title must be at least 3 characters long"),
        lecturer: z.string().min(3, "Lecturer name must be at least 3 characters long"),
        discipline: z.string().min(2, "Discipline is required"),
        book: z.string().optional(),
        videoLink: z.string().min(2, "Must be a valid URL").optional(),
        summary: z.string().optional(),
        pdfFile: z
            .custom<FileList>()
            .refine((files) => files && files.length === 1, "Upload one PDF")
            .refine(
                (files) => files && files[0]?.type === "application/pdf",
                "File must be a PDF",
            ).optional(),
    });

    // Form for editing Lessons
    const editLessonForm = useForm<z.infer<typeof editLessonFormSchema>>({
        resolver: zodResolver(editLessonFormSchema),
        defaultValues: {
            title: "",
            lecturer: "",
            discipline: "",
            book: "",
            pdfFile: undefined,
            videoLink: "",
            summary: ""
        }
    });


    // function to upload pdf to supabase
    // if may seem like im uploading an empty url string if 
    // there is mo pdf, but if no pdf is uploaded to the form, this function will never run in the first place
    async function uploadPdf(values: z.infer<typeof editLessonFormSchema>): Promise<string> {
        if (values.pdfFile && values.pdfFile.length > 0) {

            //Build the file name **once** so upload/getPublicUrl match
            const fileName = `title_${values.title}_${uuidv4()}.pdf`;

            // Upload the file
            const { error: uploadError } = await client.storage
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


    // function to get the lesson to be edited
    async function getLesson(params: Promise<EditLessonsPageParams>) {
        const paramsData = await params;
        const { data, error }: PostgrestSingleResponse<LessonData> = await client
            .from("lessons")
            .select("*")
            .eq("lessonId", paramsData.lessonId)
            .single();

        if (error) {
            toast.error("Network Error", {
                description: `A network error has occured. Please try again later.`
            })
            return;
        }

        if (data) {
            console.log(data)
            editLessonForm.setValue("title", data.title || "");
            editLessonForm.setValue("lecturer", data.lecturer || "");
            editLessonForm.setValue("discipline", data.discipline || "");
            editLessonForm.setValue("book", data.book || "");
            setOldPdfLink(data.pdfLink || undefined)
            editLessonForm.setValue("videoLink", data.videoLink || "");
            editLessonForm.setValue("summary", data.summary || "");
        }
    }


    // function to actually edit the lesson
    async function editExistingLesson(values: z.infer<typeof editLessonFormSchema>) {
        const paramsData = await params;
        const updatedLesson: LessonData = {
            title: values.title,
            lecturer: values.lecturer,
            discipline: values.discipline,
            book: values.book,
            videoLink: values.videoLink,
            summary: values.summary,
        };

        // if pdf has been input, upload it and set pdflink to the upladed pdf's link
        if (values.pdfFile && values.pdfFile.length > 0) {


            try{
                updatedLesson.pdfLink = await uploadPdf(values);
                toast.success("Upload Succeful", {
                    description: "The lecture pdf has been uploaded successfully."
                })
                if (oldPdfLink) {
                    const pathToOldPdf = oldPdfLink.split("https://xgaudhaoysqsvomwuzeo.supabase.co/storage/v1/object/public/")[1]
                    // delete old pdf
                    const { error } = await client.storage
                        .from("lecture-pdfs")
                        .remove([pathToOldPdf])
                    if (error) {
                        toast.error("Network Error", {
                            description: "Failed to Delete old pdf, please notfiy the developers."
                        })
                    }
                }
            }
            catch{
                toast.error("Network Error", {
                    description: `A network error has occured. Please try again later.`
                })
            }
            
        }
        // Actually uupdating the lesson in supabase
        const { error }: PostgrestSingleResponse<LessonData[]> = await client
            .from("lessons")
            .update(updatedLesson)
            .eq("lessonId", paramsData.lessonId)
            .select();

        if (!error) {
            toast.success("Update successful!", {
                description: "The lesson has been updated successfully."
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
        getLesson(params)
    }, [])

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <Form {...editLessonForm}>
                <form className="space-y-6" onSubmit={editLessonForm.handleSubmit(editExistingLesson)}>

                    {/* Title */}
                    <FormField
                        control={editLessonForm.control}
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
                        control={editLessonForm.control}
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
                        control={editLessonForm.control}
                        name="discipline"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Discipline</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="e.g. Math, Biology"
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Book */}
                    <FormField
                        control={editLessonForm.control}
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


                    {/* PDF Link */}
                    {/* <FormField
                        control={editLessonForm.control}
                        name="pdfLink"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">PDF link</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="e.g. Tawheed, Quran, Fiqh"
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    /> */}


                    <FormField
                        control={editLessonForm.control}
                        name="pdfFile"
                        render={({ field: { onChange, onBlur, name, ref } }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">PDF file</FormLabel>
                                <FormControl>
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
                                {oldPdfLink &&
                                    <a className="text-blue-900 font-semibold underline text-right" href={oldPdfLink} target="_blank">Current PDF</a>
                                }
                            </FormItem>
                        )}
                    />

                    {/* Summary */}
                    <FormField
                        control={editLessonForm.control}
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
                        control={editLessonForm.control}
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