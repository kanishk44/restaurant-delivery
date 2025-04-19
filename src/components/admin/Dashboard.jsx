export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">
            Total Categories
          </h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Recipes</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Orders</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">0</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Welcome to the Admin Panel
        </h2>
        <p className="text-gray-600">
          This is your central hub for managing your restaurant's menu and
          delivery services. Use the sidebar navigation to access different
          sections of the admin panel.
        </p>
      </div>
    </div>
  );
}
