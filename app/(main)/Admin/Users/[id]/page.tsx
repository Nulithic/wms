"use client";

import { useParams } from "next/navigation";
import { useUsers } from "@/libs/api/queries/admin/usersQueries";

export default function UserPage() {
  const { id } = useParams();
  const { getUser } = useUsers();
  const { data: user, isLoading, isError } = getUser(id as string);

  console.log(user);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching user</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">ID:</label>
          <p>{user.id}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <p>{user.email}</p>
        </div>
        {/* Add more user details as needed */}
      </div>
    </div>
  );
}
