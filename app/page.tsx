"use client";

export default function Home() {
  return (
    <main>
      <div>
        <form action="/signout" method="post">
          <button className="button block" type="submit">
            Sign Out
          </button>
        </form>
      </div>
    </main>
  );
}
