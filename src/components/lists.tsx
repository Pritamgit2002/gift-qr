"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Plus,
  Link as LinkIcon,
  QrCode,
  ImageDownIcon,
  X,
  Eye,
  DollarSignIcon,
  DollarSign,
} from "lucide-react";
import { MdOutlineMessage } from "react-icons/md";
import { getUser } from "../../action/get-user";
import { useLists } from "@/hooks/useLists";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { getListByName } from "../../action/get-list-by-name";
import { toast } from "sonner";
import { FaLink, FaMessage } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "../../auth";
import { IUser } from "@/models/user";
import { DialogClose } from "@radix-ui/react-dialog";
import { list } from "postcss";
import { IList } from "@/models/list";
import { AddMoreList } from "./add-more-list";

type ListProps = {
  ownerEmail: string;
  ownerName: string;
  ownerType: IUser["type"];
};
const Lists = (data: ListProps) => {
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userType, setUserType] = useState<IUser["type"]>(data.ownerType);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const getUserSession = async () => {
      console.log(data.ownerEmail);
      const user = await getUser({
        email: data.ownerEmail,
        type: data.ownerType,
      });
      if (data.ownerType === "user" && user.success) {
        setUserEmail(user.data.email);
        setUserName(user.data.name);
        setUserType(user.data.type);
      } else if (data.ownerType === "guest") {
        setUserEmail(data.ownerEmail);
        setUserName(data.ownerName);
        setUserType("guest");
      }
    };
    getUserSession();
  }, []);

  const {
    // List management
    lists,
    listName,
    inputValues,
    setListName,
    setInputValues,
    addList,
    removeList,
    addToList,
    removeLink,
    removeMessage,
    handlePayment,
    // Image handling
    fileInputRef,
    previewImage,
    imageName,
    loading,
    handleDialogClose,
    handleImageChange,
    handleImageUpload,
    handleRemoveImage,
    handleDeleteImage,
  } = useLists({
    userEmail,
    userName,
    userType,
  });

  const handleQrPricePayment = async (
    listName: string,
    isPaid: boolean,
    ownwerEmail: string,
    ownerType: string
  ) => {
    try {
      const listData = await getListByName({
        email: ownwerEmail,
        listName: listName,
      });

      if (!listData.success) {
        toast.error(listData.message);
        return;
      }

      console.log("syska");

      if (
        listData.data.images?.length +
          listData.data.links?.length +
          listData.data.messages?.length <
        5
      ) {
        console.log("syska-listData", listData);
        toast.error("Atleast there must be 5 items in the list to proceed");
        return;
      }

      console.log("oreo");

      if (listData.data.paid) {
        toast.error("List is already paid...");
        return;
      }

      if (ownerType === "guest") {
        toast.error("Guest can not pay for a list");
        return;
      }

      const totalItem =
        listData.data.links.length +
        listData.data.messages.length +
        listData.data.images?.length;
      if (totalItem < 5) {
        toast.error("Atleast there must be 5 items in the list to proceed");
        return;
      }

      const res = await handlePayment(listName, isPaid, ownwerEmail, ownerType);

      return;
    } catch (error) {
      toast.error("An error occurred while paying for the list, Try Again.");
    }
  };

  const generateQRCode = async (
    listName: string,
    userEmail: string,
    userType: IUser["type"]
  ) => {
    if (!userEmail && !userType && !listName) {
      toast.error("Something went wrong while generating QR Code");
      return;
    }
    const listUrl = `${window.location.origin}/${encodeURIComponent(
      userEmail
    )}/${encodeURIComponent(listName)}`;
    setRedirectUrl(listUrl);

    try {
      const listData = await getListByName({
        email: userEmail,
        listName: listName,
      });

      if (!listData.success) {
        toast.error(listData.message);
        return;
      }

      if (!listData.data.paid && userType === "guest") {
        toast.error("List is not paid");
        return;
      }
      const qrData = await QRCode.toDataURL(listUrl);
      setQrCodeUrl(qrData);
      setIsDialogOpen(true);
      setTotalPrice(
        listData?.data?.links.length +
          listData?.data?.messages.length +
          listData?.data?.images?.length * 2
      );
      console.log(totalPrice.toString);
    } catch (error) {
      console.error("QR Code Generation Error:", error);
    }
  };

  return (
    <div className="min-h-screen w-3xl mt-4 bg-gray-200 text-gray-900 flex flex-col items-center p-6 space-y-6 rounded-xl">
      <div className="w-max flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center">
          🎁 Welcome, {userName}
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex items-center justify-center gap-2"
      >
        <Input
          type="text"
          placeholder="Enter Gift list name"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          className="bg-gray-100/65 text-gray-900 w-96"
        />
        <Button onClick={addList} className="bg-pink-500 hover:bg-pink-600">
          <Plus className="w-5 h-5" />
        </Button>
      </motion.div>

      <div className="w-full bg-gray-100 p-4 rounded-lg grid grid-cols-3 justify-items-center gap-6">
        {lists.map((list, i) => (
          <motion.div
            key={list.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 w-full bg-white rounded-lg shadow border border-gray-200"
          >
            <div className=" w-full flex justify-between items-center ">
              <h3 className="text-lg font-medium text-gray-900">{list.name}</h3>
              <div className="flex gap-2">
                <TooltipProvider>
                  {list.paid && (
                    <Tooltip delayDuration={80}>
                      <TooltipTrigger asChild>
                        <div className="p-2 flex items-center justify-center rounded-lg bg-lime-500/70 hover:bg-lime-500 transition-all duration-150 ease-in text-white">
                          <DollarSign className="w-4 h-4 font-semibold " />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Already Paid</TooltipContent>
                    </Tooltip>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger>
                          <Button size="icon" variant="ghost">
                            <QrCode className="w-5 h-5 text-gray-600" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {list.paid ? "Get Qr" : "Make Payment"}
                            </DialogTitle>
                            <DialogDescription>
                              Have you done the payment? Unless you can't access
                              the patyment
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              {...(list.paid
                                ? {
                                    onClick: () =>
                                      generateQRCode(
                                        list.name,
                                        userEmail,
                                        userType
                                      ),
                                  }
                                : {
                                    onClick: () =>
                                      handleQrPricePayment(
                                        list.name,
                                        true,
                                        userEmail,
                                        userType
                                      ),
                                  })}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              {list.paid ? "Get Qr" : "Make Payment"}
                            </Button>
                            <DialogClose asChild>
                              <Button className="bg-gray-200 hover:bg-gray-300">
                                Cancel
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      {list.paid ? "Get Qr" : "Make Payment"}
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger>
                          <Button size="icon" variant="ghost" className="group">
                            <GoTrash className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Get your Qr</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              onClick={() => removeList(list.name)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Yes, Delete List
                            </Button>
                            <DialogClose asChild>
                              <Button
                                //onClick={() => setIsDialogOpen(!isDialogOpen)}
                                className="bg-gray-200 hover:bg-gray-300"
                              >
                                Cancel
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>Remove</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            {((!list.paid && userType === "user") || userType === "guest") && (
              <div className="flex gap-3 mt-3">
                {/* link input */}
                <Dialog>
                  <DialogTrigger className="text-gray-700 p-2">
                    <FaLink />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add a Link</DialogTitle>
                      <DialogDescription>
                        <div className="flex gap-2 mt-2">
                          <Input
                            type="text"
                            placeholder="Enter a link"
                            value={inputValues[list.name] || ""}
                            onChange={(e) =>
                              setInputValues({
                                ...inputValues,
                                [list.name]: e.target.value,
                              })
                            }
                            className="bg-gray-200 text-gray-900"
                          />
                          <Button
                            onClick={() =>
                              addToList(
                                list.name,
                                inputValues[list.name] || "",
                                false
                              )
                            }
                            className="bg-gray-800 text-white"
                          >
                            Add Link
                          </Button>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                {/* message input */}
                <Dialog>
                  <DialogTrigger className="text-gray-700 p-2">
                    <MdOutlineMessage />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Leave a Message</DialogTitle>
                      <DialogDescription>
                        <div className="flex gap-2 mt-2">
                          <Textarea
                            value={inputValues[list.name] || ""}
                            onChange={(e) =>
                              setInputValues({
                                ...inputValues,
                                [list.name]: e.target.value,
                              })
                            }
                            placeholder="Type your message here."
                          />
                          <Button
                            onClick={() =>
                              addToList(list.name, inputValues[list.name], true)
                            }
                            className="bg-gray-800 text-white"
                          >
                            Add Message
                          </Button>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                {/* image input */}
                <Dialog onOpenChange={() => handleDialogClose(isDialogOpen)}>
                  <DialogTrigger className="text-gray-700 p-2">
                    <ImageDownIcon />
                  </DialogTrigger>
                  <DialogContent className="h-max w-full max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Image</DialogTitle>
                      <DialogDescription className="w-full h-max bg-gray-100 flex flex-col items-center justify-between p-4 gap-4 rounded-lg">
                        <div className="flex gap-2 mt-2 w-full">
                          <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={() => handleImageChange(fileInputRef)}
                            className="border-gray-300 border-2 border-dotted bg-white w-full p-2"
                          />
                          <Button
                            onClick={() =>
                              handleImageUpload(
                                list.name,
                                fileInputRef.current?.files?.[0]
                              )
                            }
                            className="bg-gray-800 text-white px-4"
                          >
                            Add Image
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
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            <Tabs defaultValue="links" className="w-full mt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="links">Links</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>
              <div className="mt-3 space-y-2">
                {/* links list */}
                <TabsContent value="links">
                  {list.links.map((link, index) => (
                    <Card
                      key={index}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded"
                    >
                      <span className="text-sm truncate max-w-[80%] text-gray-800">
                        {link}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeLink(list.name, link)}
                        className="text-gray-600 group"
                      >
                        <GoTrash className="w-4 h-4 text-gray-600 group-hover:text-red-600 " />
                      </Button>
                    </Card>
                  ))}
                </TabsContent>
                {/* message list */}
                <TabsContent value="messages">
                  {list.messages.map((message, index) => (
                    <Card
                      key={index}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded"
                    >
                      <span className="text-sm truncate max-w-[80%] text-gray-800">
                        {message}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeMessage(list.name, message)}
                        className="text-gray-600 group"
                      >
                        <GoTrash className="w-4 h-4 text-gray-600 group-hover:text-red-600 " />
                      </Button>
                    </Card>
                  ))}
                </TabsContent>
                {/* images list */}
                <TabsContent
                  value="images"
                  key={`images-${list.name}-${list.images?.length || 0}`}
                >
                  {list.images?.length ? (
                    list.images.map((item, index) => (
                      <Card
                        key={`${list.name}-${item.imageName}-${index}`}
                        className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2"
                      >
                        <div className="w-max flex items-center justify-center gap-2">
                          <Image
                            priority
                            src={item.url}
                            alt={item.imageName}
                            width={80}
                            height={80}
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                          <span className="truncate max-w-[200px]">
                            {item.imageName}
                          </span>
                        </div>
                        <div className="b w-max flex items-center justify-center gap-x-3">
                          <Link
                            href={item.url || ""}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-gray-600 group"
                            >
                              <Eye />
                            </Button>
                          </Link>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-gray-600 group"
                            onClick={() => handleDeleteImage(list.name, item)}
                          >
                            <GoTrash className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No images in this list
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
            {list.paid && userType === "user" && (
              <AddMoreList
                ownerEmail={userEmail}
                listName={list.name}
                isPaid={list.paid}
              />
            )}
          </motion.div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white text-gray-900 border border-gray-200 rounded-lg">
          <DialogHeader>
            <DialogTitle>🎉 Gift List QR Code</DialogTitle>
          </DialogHeader>
          {qrCodeUrl ? (
            <div className="flex flex-col items-center gap-y-2">
              <Image
                src={qrCodeUrl}
                alt="QR Code"
                width={200}
                height={200}
                className="mt-4"
              />
              {userType === "guest" ? (
                <span>No Price for Guests</span>
              ) : (
                <span>Total-Price: {totalPrice}</span>
              )}
              <Link
                href={redirectUrl || "/"}
                target="_blank"
                className="text-sm text-gray-600 font-light"
              >
                {redirectUrl}
              </Link>
            </div>
          ) : (
            <p>Generating QR Code...</p>
          )}
          <DialogClose asChild>
            <Button className="bg-red-500 hover:bg-red-600">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Lists;
