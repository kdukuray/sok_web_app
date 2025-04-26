type Announcement = {
  title: string;
  createdAt: string;
  description: string;
};

export default function AnnouncementCard({ title, createdAt, description }: Announcement) {
  return (
    <div className="border-blue-800 text-blue-900 min-h-50 border-2 shadow-md p-6 rounded-lg mb-6 w-[320px] sm:w-[400px] md:w-[600px] lg:w-[800px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <span className="text-xs sm:text-sm text-yellow-700 font-bold">
          {new Date(createdAt).toLocaleString()}
        </span>
      </div>
      <p className="text-gray-700 text-sm sm:text-base">{description}</p>
    </div>
  );
}
