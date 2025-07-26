export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center py-8">
      <div className="h-10 w-10 border-4 border-dotted border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-3 text-sm text-gray-600">Loading more products...</p>
    </div>
  );
}
