import React from "react";

type Props = {
  userEmail: string;
  listName: string;
  randomMessage: string;
};

export const MessageUi = (props: Props) => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-lg text-gray-600">
          User Email: <span className="font-medium">{props.userEmail}</span>
        </h1>
        <h2 className="text-lg text-gray-600">
          List Name: <span className="font-medium">{props.listName}</span>
        </h2>
        <p className="mt-6 text-2xl font-semibold text-gray-900 bg-white shadow-md p-4 rounded-lg">
          {props.randomMessage}
        </p>
      </div>
    </div>
  );
};
