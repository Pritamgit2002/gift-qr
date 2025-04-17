import { notFound } from "next/navigation";
import { getListByName } from "../../../../action/get-list-by-name";
import RedirectToRandomLink from "./components/RiderctToRandomLink";
import { getRandomImagefromArray, getRandomItemfromArray } from "@/constants";
import { NoMessageUi } from "./components/messages/no-message-ui";
import { MessageUi } from "./components/messages/message-ui";
import NoImages from "./components/images/no-images";
import ImageFrame from "./components/images/image-frame";

const Page = async ({
  params,
}: {
  params: { userEmail: string; listName: string };
}) => {
  const userEmail = decodeURIComponent(params.userEmail);
  const listName = decodeURIComponent(params.listName);

  if (!userEmail || !listName) return <div>Missing userEmail or listName</div>;

  try {
    const listData = await getListByName({ email: userEmail, listName });

    if (!listData?.success || !listData.data) return notFound();

    const { links = [], messages = [], images = [] } = listData.data;

    // Filter out empty arrays
    const availableTypes: ("links" | "messages" | "images")[] = [];
    if (links.length) availableTypes.push("links");
    if (messages.length) availableTypes.push("messages");
    if (images.length) availableTypes.push("images");

    // If no data is available, return the empty UI
    if (!availableTypes.length)
      return <NoMessageUi userEmail={userEmail} listName={listName} />;

    // Pick a random available type
    const randomType = getRandomItemfromArray(availableTypes);

    switch (randomType) {
      case "links": {
        const randomLink = getRandomItemfromArray(links);
        return <RedirectToRandomLink randomLink={randomLink || ""} />;
      }
      case "messages": {
        const randomMessage = getRandomItemfromArray(messages);
        return (
          <MessageUi
            userEmail={userEmail}
            listName={listName}
            randomMessage={randomMessage || ""}
          />
        );
      }
      case "images": {
        const randomImage = getRandomImagefromArray(images);
        return randomImage ? (
          <ImageFrame
            imageUrl={randomImage.url}
            imageName={randomImage.imageName}
          />
        ) : (
          <NoImages userEmail={userEmail} listName={listName} />
        );
      }

      default:
        return notFound();
    }
  } catch (error) {
    console.error("Error in dynamic route:", error);
    return notFound();
  }
};

export default Page;
