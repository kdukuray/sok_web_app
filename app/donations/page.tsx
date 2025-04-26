"use client";

import { Button } from "@/components/ui/button";

export default function Donations() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900">
          Donations Coming Soon
        </h2>
        <p className="text-center text-gray-600 text-sm md:text-base">
          We are working hard to bring you a secure and easy way to support our mission. Thank you for your patience!
        </p>
        <Button
          disabled
          className="w-full bg-gray-300 text-gray-700 text-lg py-3 rounded-xl cursor-not-allowed"
        >
          Donate (Coming Soon)
        </Button>
      </div>
    </div>
  );
}
