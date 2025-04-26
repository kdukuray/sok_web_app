import { SidebarProvider, Sidebar, SidebarGroup, SidebarGroupLabel, SidebarContent, SidebarHeader, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

export default async function DashboardLayout({

    children,
}: {
    children: React.ReactNode;
}) {
    const panels = ["Lessons", "Announcements"]

    return (
        <div className="min-h-dvh relative flex">
            <SidebarProvider className="border-2 w-3xs">
                <div className="absolute top-4 left-4 z-50 md:hidden">
                    <SidebarTrigger />
                </div>

                <Sidebar className="absolute h-full">
                    <SidebarHeader>
                        <div>
                            <h3 className="text-2xl font-bold text-blue-800 text-center">Admin Panel</h3>
                        </div>

                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-sm text-gray-500 uppercase tracking-wide mb-2">Naviagtion</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {panels.map((panel_item, index) => (
                                        <SidebarMenuItem key={index}>
                                            <Link href={`/admin/${panel_item.toLowerCase()}/1`}>
                                                <SidebarMenuButton className="block w-full text-left px-4 py-2 rounded-lg hover:bg-blue-100 text-blue-900 font-medium transition flex items-center cursor-pointer">
                                                    {panel_item}
                                                </SidebarMenuButton>
                                            </Link>

                                        </SidebarMenuItem>

                                    ))}

                                </SidebarMenu>



                            </SidebarGroupContent>

                        </SidebarGroup>

                    </SidebarContent>

                </Sidebar>
            </SidebarProvider>
            <div className="w-7xl">
                <main className="p-6">{children}</main>
            </div>
        </div>
    );








}