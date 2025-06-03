// app/not-authorized/page.js

export default function NotAuthorizedPage() {
  return (
    <div className="text-center mt-40 text-red-600">
      <h1 className="text-2xl font-bold">🚫 Access Denied</h1>
      <p>You do not have permission to view this page.</p>
    </div>
  );
}
