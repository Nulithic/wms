"use client";

import { useTitle } from "@/components/NavBar/TitleContext";
import { Fragment, useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

interface FakeData {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  lastLogin: string;
}

// Utility function to generate fake data
const generateFakeData = (count: number): FakeData[] => {
  const statuses = ["Active", "Inactive", "Pending"];
  const roles = ["Admin", "User", "Editor", "Viewer"];
  const firstNames = [
    "James",
    "Mary",
    "John",
    "Patricia",
    "Robert",
    "Jennifer",
    "Michael",
    "Linda",
    "William",
    "Elizabeth",
    "David",
    "Barbara",
    "Richard",
    "Susan",
    "Joseph",
    "Jessica",
    "Thomas",
    "Sarah",
    "Charles",
    "Karen",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: `ID${(index + 1).toString().padStart(4, "0")}`,
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
      lastNames[Math.floor(Math.random() * lastNames.length)]
    }`,
    email: `user${index + 1}@example.com`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
    lastLogin: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  }));
};

const Page = () => {
  const { setShowNavBar, setActions } = useTitle();
  const [pageData, setPageData] = useState({
    page: 1,
    perPage: 10,
  });

  // Generate 100 fake records
  const allData = useMemo(() => generateFakeData(100000), []);

  // Get current page data
  const getCurrentPageData = () => {
    const start = (pageData.page - 1) * pageData.perPage;
    const end = start + pageData.perPage;
    return allData.slice(start, end);
  };

  const columns = useMemo<ColumnDef<FakeData>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: () => <span>ID</span>,
      },
      {
        id: "name",
        accessorKey: "name",
        header: () => <span>Name</span>,
      },
      {
        id: "email",
        accessorKey: "email",
        header: () => <span>Email</span>,
      },
      {
        id: "status",
        accessorKey: "status",
        header: () => <span>Status</span>,
      },
      {
        id: "role",
        accessorKey: "role",
        header: () => <span>Role</span>,
      },
      {
        id: "lastLogin",
        accessorKey: "lastLogin",
        header: () => <span>Last Login</span>,
      },
    ],
    [],
  );

  useEffect(() => {
    setShowNavBar(true);
    setActions(null);
    return () => {
      setShowNavBar(false);
      setActions(null);
    };
  }, [setShowNavBar, setActions]);

  return (
    <Fragment>
      <DataTable
        data={getCurrentPageData()}
        columns={columns}
        pageData={pageData}
        onPageDataChange={setPageData}
        totalCount={allData.length}
      />
    </Fragment>
  );
};

export default Page;
