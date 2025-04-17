import React from "react";

type Props = {
  userEmail: string;
  listName: string;
};

const NoImages = (props: Props) => {
  return (
    <div className="p-6 space-y-4 bg-white shadow-md rounded-lg max-w-md mx-auto">
      <h1 className="text-lg text-gray-600">
        User Email:{" "}
        <span className="font-medium text-gray-900">{props.userEmail}</span>
      </h1>
      <h2 className="text-lg text-gray-600">
        List Name:{" "}
        <span className="font-medium text-gray-900">{props.listName}</span>
      </h2>

      <p className="text-gray-500 italic text-center py-4 border rounded-md bg-gray-100">
        {" "}
        No images available
      </p>
    </div>
  );
};

export default NoImages;
