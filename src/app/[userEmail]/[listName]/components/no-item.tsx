const NoItemUi = ({
  userEmail,
  listName,
}: {
  userEmail: string;
  listName: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      <h2 className="text-xl font-semibold text-gray-700">No Items Found</h2>
      <p className="text-gray-500 mt-2">
        There are no links, messages, or images available in{" "}
        <strong>{listName}</strong>.
      </p>
      <p className="text-gray-400 text-sm mt-1">User: {userEmail}</p>
    </div>
  );
};

export default NoItemUi;
