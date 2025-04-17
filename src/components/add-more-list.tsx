// "use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Eye, ImageDownIcon, Plus, X } from "lucide-react";
import { FaLink } from "react-icons/fa6";
import { Input } from "./ui/input";
import { MdOutlineMessage } from "react-icons/md";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { GoTrash } from "react-icons/go";
import { Card } from "./ui/card";
import Image from "next/image";
import Link from "next/link";
import { useDraft } from "@/hooks/useDraft";
import { useLists } from "@/hooks/useLists";
import { getUser } from "../../action/get-user";

type AddMoreListProps = {
  listName: string;
  isPaid: boolean;
  ownerEmail: string;
};

const AddMoreList = ({ ownerEmail, listName, isPaid }: AddMoreListProps) => {
  const [ownerName, setOwnerName] = useState<string>("");
  useEffect(() => {
    async function getUserData() {
      try {
        const getUserData = await getUser({
          email: ownerEmail,
          type: "user",
        });
        console.log("getUserData", getUserData);
        {
          if (getUserData.success) {
            setOwnerName(getUserData.data.name);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    getUserData();
  }, [ownerEmail]); // Add dependency array with ownerEmail
  const {
    moreItems,
    fileInputRef,
    moreItemLink,
    moreItemMessage,
    imageName,
    previewImage,
    setMoreItemLink,
    setMoreItemMessage,
    handleClickMoreItems,
    handleImageChange,
    handleClickAddMoreImages,
    handleLinkDelete,
    handleMessageDelete,
    handleImageDelete,
    handleRemoveImage,
    handleDraftPayment,
  } = useDraft({
    ownerEmail,
    listName,
    isPaid,
  });

  const { handleUpdatedTime } = useLists({
    userEmail: ownerEmail,
    userName: ownerName,
    userType: "user",
  });

  const handlePayment = async (listName: string, ownerEmail: string) => {
    try {
      const result = await handleDraftPayment(listName, ownerEmail);

      if (result) {
        console.log("pro star");
        handleUpdatedTime();
      }
    } catch (error) {
      console.error("Payment processing failed:", error);
    }
  };

  return (
    <div className="mt-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add More
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add more items to the list: {listName}</DialogTitle>
            <DialogDescription>
              Add links, messages, or images that will be stored locally first.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center gap-4 mt-4">
            {/* Link Input */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-gray-700">
                  <FaLink className="mr-1" />
                  Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a Link</DialogTitle>
                </DialogHeader>
                <div className="flex gap-2 mt-3">
                  <Input
                    type="text"
                    placeholder="Enter a link"
                    value={moreItemLink}
                    onChange={(e) => setMoreItemLink(e.target.value)}
                    className="bg-gray-200 text-gray-900"
                  />
                  <Button onClick={() => handleClickMoreItems(listName)}>
                    Add
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Message Input */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-gray-700">
                  <MdOutlineMessage className="mr-1" />
                  Message
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a Message</DialogTitle>
                </DialogHeader>
                <div className="flex gap-2 mt-3">
                  <Textarea
                    placeholder="Enter a Message"
                    value={moreItemMessage}
                    onChange={(e) => setMoreItemMessage(e.target.value)}
                    className="bg-gray-200 text-gray-900"
                  />
                  <Button onClick={() => handleClickMoreItems(listName)}>
                    Add
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Image Input */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-gray-700">
                  <ImageDownIcon className="mr-1" />
                  Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add an Image</DialogTitle>
                </DialogHeader>
                <div className="flex gap-2 mt-3">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(fileInputRef)}
                    className="bg-gray-200 text-gray-900"
                  />
                  <Button onClick={() => handleClickAddMoreImages(listName)}>
                    Add
                  </Button>
                </div>
                {previewImage && (
                  <div className="relative h-max w-full flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-2">
                    {/* Remove Button */}
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <X size={16} />
                    </button>

                    {/* Image Preview */}
                    <div className="h-32 w-full flex items-center justify-center">
                      <Image
                        src={previewImage}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="h-full w-auto rounded-lg object-contain"
                      />
                    </div>

                    {/* File Name */}
                    {imageName && (
                      <p className="text-sm text-gray-700 mt-2 font-medium">
                        {imageName}
                      </p>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Tab Section */}
          <Tabs defaultValue="links" className="mt-6">
            <TabsList className="grid grid-cols-3 gap-2 max-w-md mx-auto">
              <TabsTrigger value="links">Links</TabsTrigger>
              <TabsTrigger value="message">Messages</TabsTrigger>
              <TabsTrigger value="image">Images</TabsTrigger>
            </TabsList>

            {/* Link List */}
            <TabsContent value="links" className="mt-4 space-y-2">
              {moreItems[listName]?.link?.map(
                (item, index) =>
                  item?.length > 0 && (
                    <Card
                      key={index}
                      className="flex justify-between p-2 bg-gray-100 rounded"
                    >
                      <span className="text-sm truncate max-w-[80%]">
                        {item}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-gray-600 group"
                        onClick={() => handleLinkDelete(listName, item)}
                      >
                        <GoTrash className="w-4 h-4 group-hover:text-red-600" />
                      </Button>
                    </Card>
                  )
              )}
            </TabsContent>

            {/* Message List */}
            <TabsContent value="message" className="mt-4 space-y-2">
              {moreItems[listName]?.message?.map(
                (item, index) =>
                  item?.length > 0 && (
                    <Card
                      key={index}
                      className="flex justify-between p-2 bg-gray-100 rounded"
                    >
                      <span className="text-sm truncate max-w-[80%]">
                        {item}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-gray-600 group"
                        onClick={() => handleMessageDelete(listName, item)}
                      >
                        <GoTrash className="w-4 h-4 group-hover:text-red-600" />
                      </Button>
                    </Card>
                  )
              )}
            </TabsContent>

            {/* Image List */}
            <TabsContent value="image" className="mt-4 space-y-2">
              {moreItems[listName]?.image?.map((item, index) => (
                <Card
                  key={index}
                  className="flex justify-between p-2 bg-gray-100 rounded"
                >
                  <Image
                    src={item.url}
                    alt={item.imageName}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <span className="text-sm truncate max-w-[80%]">
                    {item.imageName}
                  </span>
                  <Link href={item.url} target="_blank" rel="noreferrer">
                    <Button>
                      <Eye className="w-4 h-4 group-hover:text-red-600" />
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-600 group"
                    onClick={() => handleImageDelete(listName, item.url)}
                  >
                    <GoTrash className="w-4 h-4 group-hover:text-red-600" />
                  </Button>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {(moreItems[listName]?.link?.length ?? 0) === 0 &&
          (moreItems[listName]?.message?.length ?? 0) === 0 &&
          (moreItems[listName]?.image?.length ?? 0) === 0 ? (
            <Button className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white opacity-50 cursor-not-allowed">
              Add More
            </Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white transition-all active:scale-95">
                  Add More
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Make payment to add more items</DialogTitle>
                  <DialogDescription>
                    User gets paid for adding more items to the list. The Qr
                    will remain same.
                  </DialogDescription>
                  <div className="flex gap-2 mt-3">
                    <ul>
                      <li>Link price: {moreItems[listName]?.link?.length}</li>
                      <li>
                        Message price: {moreItems[listName]?.message?.length}
                      </li>
                      <li>
                        Image price:{" "}
                        {(moreItems[listName]?.image?.length || 0) * 2}{" "}
                      </li>
                      <li>
                        Total price:{" "}
                        {(moreItems[listName]?.link?.length || 0) +
                          (moreItems[listName]?.message?.length || 0) +
                          (moreItems[listName]?.image?.length || 0) * 2}
                      </li>
                    </ul>
                  </div>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => handlePayment(listName, ownerEmail)}
                  >
                    Make Payment
                  </Button>
                  <DialogClose asChild>
                    <Button className="bg-gray-200 hover:bg-gray-300">
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddMoreList;
