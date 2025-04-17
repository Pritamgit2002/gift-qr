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
import {
  CreditCard,
  Eye,
  ImageDownIcon,
  ImageIcon,
  LinkIcon,
  Loader2,
  MessageSquare,
  Plus,
  X,
} from "lucide-react";
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

export const AddMoreList = ({
  ownerEmail,
  listName,
  isPaid,
}: AddMoreListProps) => {
  const [ownerName, setOwnerName] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  // Add a local payment processing state
  const [localProcessingPayment, setLocalProcessingPayment] = useState(false);

  useEffect(() => {
    async function getUserData() {
      try {
        const getUserData = await getUser({
          email: ownerEmail,
          type: "user",
        });

        if (getUserData.success) {
          setOwnerName(getUserData.data.name);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    getUserData();
  }, [ownerEmail]);

  const {
    moreItems,
    fileInputRef,
    moreItemLink,
    moreItemMessage,
    imageName,
    previewImage,
    // Loading states
    isFetchingDraft,
    isAddingItem,
    isAddingImage,
    isDeletingItem,
    isProcessingPayment,
    // Setters
    setIsProcessingPayment,
    setMoreItemLink,
    setMoreItemMessage,
    // Handlers
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
      // Set local payment processing state
      // setLocalProcessingPayment(true);
      setIsProcessingPayment(true);

      // Close current dialog before opening payment gateway
      setIsDialogOpen(false);
      setActiveDialog(null);

      // Small delay to ensure dialog is closed before payment modal opens
      setTimeout(async () => {
        try {
          const result = await handleDraftPayment(listName, ownerEmail);

          if (result) {
            handleUpdatedTime();
          }
        } catch (error) {
          console.error("Payment processing failed:", error);
          //setLocalProcessingPayment(false);
          setIsProcessingPayment(false);
        } finally {
          // Reset the local payment processing state regardless of outcome
          //setLocalProcessingPayment(false);
          setIsProcessingPayment(false);
        }
      }, 100);
    } catch (error) {
      console.error("Payment processing failed:", error);
      // Ensure the local payment processing state is reset on any error
      //setLocalProcessingPayment(false);
      setIsProcessingPayment(false);
    }
  };

  const handleDialogChange = (dialogType: string | null) => {
    setActiveDialog(dialogType);
  };

  const closeAllDialogs = () => {
    setActiveDialog(null);
    setIsDialogOpen(false);
    // Also reset the payment processing state when dialogs are closed
    //setLocalProcessingPayment(false);
    setIsProcessingPayment(false);
  };

  const itemsCount = {
    links: moreItems[listName]?.link?.length || 0,
    messages: moreItems[listName]?.message?.length || 0,
    images: moreItems[listName]?.image?.length || 0,
  };

  const totalItems = itemsCount.links + itemsCount.messages + itemsCount.images;
  const totalPrice =
    itemsCount.links + itemsCount.messages + itemsCount.images * 2;
  const hasItems = totalItems > 0;

  // Determine if we should show payment processing based on either the hook state or our local state
  const showPaymentProcessing = isProcessingPayment;
  console.log("showPaymentProcessing", showPaymentProcessing);

  return (
    <div className="mt-6">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg">
            <Plus className="w-5 h-5" />
            Add More
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl bg-gray-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-indigo-700">
              Add more items to: {listName}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Add links, messages, or images to enhance your list
            </DialogDescription>
          </DialogHeader>

          {isFetchingDraft ? (
            <div className="flex justify-center items-center h-40">
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-sm text-indigo-600 font-medium">
                  Loading your items...
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {/* Link Input */}
                <Dialog
                  open={activeDialog === "link"}
                  onOpenChange={(open) =>
                    open ? handleDialogChange("link") : handleDialogChange(null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-indigo-700 border-indigo-300 hover:bg-indigo-50 transition-all flex-1 md:flex-none"
                    >
                      <FaLink className="mr-2" />
                      Add Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white z-50">
                    <DialogHeader>
                      <DialogTitle className="text-indigo-700">
                        Add a Link
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col md:flex-row gap-3 mt-3">
                      <Input
                        type="text"
                        placeholder="Enter a link"
                        value={moreItemLink}
                        onChange={(e) => setMoreItemLink(e.target.value)}
                        className="bg-gray-100 text-gray-900 flex-grow"
                      />
                      <Button
                        onClick={() => {
                          handleClickMoreItems(listName);
                          handleDialogChange(null);
                        }}
                        disabled={isAddingItem}
                        className="bg-indigo-600 hover:bg-indigo-700 transition-all"
                      >
                        {isAddingItem ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        {isAddingItem ? "Adding..." : "Add Link"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Message Input */}
                <Dialog
                  open={activeDialog === "message"}
                  onOpenChange={(open) =>
                    open
                      ? handleDialogChange("message")
                      : handleDialogChange(null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-emerald-700 border-emerald-300 hover:bg-emerald-50 transition-all flex-1 md:flex-none"
                    >
                      <MdOutlineMessage className="mr-2" />
                      Add Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white z-50">
                    <DialogHeader>
                      <DialogTitle className="text-emerald-700">
                        Add a Message
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 mt-3">
                      <Textarea
                        placeholder="Enter a Message"
                        value={moreItemMessage}
                        onChange={(e) => setMoreItemMessage(e.target.value)}
                        className="bg-gray-100 text-gray-900 min-h-[100px]"
                      />
                      <Button
                        onClick={() => {
                          handleClickMoreItems(listName);
                          handleDialogChange(null);
                        }}
                        disabled={isAddingItem}
                        className="bg-emerald-600 hover:bg-emerald-700 transition-all"
                      >
                        {isAddingItem ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        {isAddingItem ? "Adding..." : "Add Message"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Image Input */}
                <Dialog
                  open={activeDialog === "image"}
                  onOpenChange={(open) =>
                    open
                      ? handleDialogChange("image")
                      : handleDialogChange(null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-amber-700 border-amber-300 hover:bg-amber-50 transition-all flex-1 md:flex-none"
                    >
                      <ImageDownIcon className="mr-2" />
                      Add Image
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white z-50">
                    <DialogHeader>
                      <DialogTitle className="text-amber-700">
                        Add an Image
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 mt-3">
                      <div className="flex flex-col md:flex-row gap-3">
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(fileInputRef)}
                          className="bg-gray-100 text-gray-900 flex-grow"
                        />
                        <Button
                          onClick={() => {
                            handleClickAddMoreImages(listName);
                            if (!previewImage) handleDialogChange(null);
                          }}
                          disabled={isAddingImage || !previewImage}
                          className="bg-amber-600 hover:bg-amber-700 transition-all whitespace-nowrap"
                        >
                          {isAddingImage ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : null}
                          {isAddingImage ? "Uploading..." : "Add Image"}
                        </Button>
                      </div>

                      {previewImage && (
                        <div className="relative w-full bg-white shadow-md rounded-lg p-3 border border-amber-200">
                          {/* Remove Button */}
                          <button
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                            aria-label="Remove image"
                          >
                            <X size={16} />
                          </button>

                          {/* Image Preview */}
                          <div className="h-40 w-full flex items-center justify-center">
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
                            <p className="text-sm text-gray-700 mt-2 font-medium text-center">
                              {imageName}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Tab Section */}
              <Tabs defaultValue="links" className="mt-6">
                <TabsList className="grid grid-cols-3 gap-2 max-w-md mx-auto bg-gray-200">
                  <TabsTrigger
                    value="links"
                    className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                  >
                    Links {itemsCount.links > 0 && `(${itemsCount.links})`}
                  </TabsTrigger>
                  <TabsTrigger
                    value="message"
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    Messages{" "}
                    {itemsCount.messages > 0 && `(${itemsCount.messages})`}
                  </TabsTrigger>
                  <TabsTrigger
                    value="image"
                    className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
                  >
                    Images {itemsCount.images > 0 && `(${itemsCount.images})`}
                  </TabsTrigger>
                </TabsList>

                {/* Link List */}
                <TabsContent
                  value="links"
                  className="mt-4 space-y-2 max-h-[300px] overflow-y-auto p-2"
                >
                  {isDeletingItem && (
                    <div className="flex justify-center mb-2">
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                    </div>
                  )}

                  {itemsCount.links === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <LinkIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No links added yet</p>
                    </div>
                  ) : (
                    moreItems[listName]?.link?.map(
                      (item, index) =>
                        item?.length > 0 && (
                          <Card
                            key={index}
                            className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border-l-4 border-indigo-500 hover:shadow-md transition-all"
                          >
                            <div className="flex items-center space-x-2 flex-grow overflow-hidden">
                              <FaLink className="text-indigo-600 flex-shrink-0" />
                              <span className="text-sm truncate">{item}</span>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-gray-600 group hover:bg-red-50"
                              onClick={() => handleLinkDelete(listName, item)}
                              disabled={isDeletingItem}
                            >
                              <GoTrash className="w-4 h-4 group-hover:text-red-600" />
                            </Button>
                          </Card>
                        )
                    )
                  )}
                </TabsContent>

                {/* Message List */}
                <TabsContent
                  value="message"
                  className="mt-4 space-y-2 max-h-[300px] overflow-y-auto p-2"
                >
                  {isDeletingItem && (
                    <div className="flex justify-center mb-2">
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                    </div>
                  )}

                  {itemsCount.messages === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No messages added yet</p>
                    </div>
                  ) : (
                    moreItems[listName]?.message?.map(
                      (item, index) =>
                        item?.length > 0 && (
                          <Card
                            key={index}
                            className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border-l-4 border-emerald-500 hover:shadow-md transition-all"
                          >
                            <div className="flex items-center space-x-2 flex-grow overflow-hidden">
                              <MdOutlineMessage className="text-emerald-600 flex-shrink-0" />
                              <span className="text-sm truncate">{item}</span>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-gray-600 group hover:bg-red-50"
                              onClick={() =>
                                handleMessageDelete(listName, item)
                              }
                              disabled={isDeletingItem}
                            >
                              <GoTrash className="w-4 h-4 group-hover:text-red-600" />
                            </Button>
                          </Card>
                        )
                    )
                  )}
                </TabsContent>

                {/* Image List */}
                <TabsContent
                  value="image"
                  className="mt-4 space-y-3 max-h-[300px] overflow-y-auto p-2"
                >
                  {isDeletingItem && (
                    <div className="flex justify-center mb-2">
                      <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
                    </div>
                  )}

                  {itemsCount.images === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No images added yet</p>
                    </div>
                  ) : (
                    moreItems[listName]?.image?.map((item, index) => (
                      <Card
                        key={index}
                        className="flex flex-col sm:flex-row items-center justify-between p-3 bg-white rounded-lg shadow-sm border-l-4 border-amber-500 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <Image
                            src={item.url}
                            alt={item.imageName}
                            width={80}
                            height={80}
                            className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover border border-amber-200"
                          />
                          <span className="text-sm truncate max-w-[120px] sm:max-w-[200px]">
                            {item.imageName}
                          </span>
                        </div>

                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <Link
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button className="bg-amber-600 hover:bg-amber-700">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-gray-600 group hover:bg-red-50"
                            onClick={() =>
                              handleImageDelete(listName, item.url)
                            }
                            disabled={isDeletingItem}
                          >
                            <GoTrash className="w-4 h-4 group-hover:text-red-600" />
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>

              {!hasItems ? (
                <Button
                  className="mt-6 w-full bg-gray-400 text-white opacity-50 cursor-not-allowed"
                  disabled
                >
                  No Items Added Yet
                </Button>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white transition-all active:scale-95 shadow-md">
                      Complete & Pay
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white z-50">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-indigo-700">
                        Complete Your Purchase
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Make payment to add these items to your list:{" "}
                        <span className="font-medium text-indigo-600">
                          {listName}
                        </span>
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-lg text-gray-800 mb-3">
                        Order Summary
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Links ({itemsCount.links})
                          </span>
                          <span className="font-medium">
                            {itemsCount.links}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Messages ({itemsCount.messages})
                          </span>
                          <span className="font-medium">
                            {itemsCount.messages}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Images ({itemsCount.images} × 2)
                          </span>
                          <span className="font-medium">
                            {itemsCount.images * 2}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span className="text-indigo-700">
                              {totalPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-3 mt-4">
                      <Button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 sm:order-1"
                        onClick={closeAllDialogs}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 flex-1 sm:flex-none"
                        onClick={() => handlePayment(listName, ownerEmail)}
                        disabled={showPaymentProcessing}
                      >
                        {showPaymentProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Make Payment
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                    {isProcessingPayment && (
                      <span
                        className=" hover:underline text-right text-xs text-gray-500/60 cursor-pointer"
                        onClick={() => setIsProcessingPayment(false)}
                      >
                        Click here to if button is disbled
                      </span>
                    )}
                  </DialogContent>
                </Dialog>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
