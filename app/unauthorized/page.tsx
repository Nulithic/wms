export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">401 - Unauthorized</h1>
      <p className="text-gray-600">You do not have permission to access this page.</p>
    </div>
  );
}
