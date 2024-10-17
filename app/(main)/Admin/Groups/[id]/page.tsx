"use client";

import { useParams } from "next/navigation";
import { useGroups } from "@/libs/api/queries/admin/groupsQueries";
import UsersTable from "./UsersTable";

export default function GroupPage() {
  const { id } = useParams();
  const { getGroup } = useGroups();
  const { data: group, isLoading, isError } = getGroup(id as string);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching group</div>;
  }

  if (!group) {
    return <div>Group not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Group Details</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">ID:</label>
          <p>{group.id}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <p>{group.name}</p>
        </div>
      </div>
      <UsersTable groupId={group.id} />
    </div>
  );
}
