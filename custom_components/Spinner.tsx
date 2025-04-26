// components/Spinner.tsx
export default function Spinner() {
    return (
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="h-30 w-30 animate-spin rounded-full border-5 border-x-blue-900 border-y-yellow-600"></div>
      </div>
    );
  }
  