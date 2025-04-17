"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { getLists } from "../../action/get-lists";
import { AddList, AddListData } from "../../action/add-lists-link-message";
import { deleteList } from "../../action/delete-list";
import { formatUrl, isValidLink } from "@/constants";
import { IList, IImage } from "@/models/list";
import { deleteLinkFromList } from "../../action/delete-link-from-list-by-name";
import { deleteMessageFromList } from "../../action/delete-message-from-list-by-name";
import { uploadAwsImageLinkToList } from "../../action/upload-aws-image-link-to-list";
import { deleteAwsImageLinkToList } from "../../action/delete-aws-image-link-to-list";
import { IUser } from "@/models/user";
import { addPaidInList } from "../../action/add-paid-in-list";
import { getListByName } from "../../action/get-list-by-name";
import { loadScript } from "@/utils/razorpayScript";
import { useDraft } from "./useDraft";

type UseListsProps = {
  userEmail: string;
  userName: string;
  userType: IUser["type"];
};

export const useLists = ({ userEmail, userName, userType }: UseListsProps) => {
  const [lists, setLists] = useState<
    Pick<IList, "name" | "links" | "messages" | "images" | "paid">[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [listName, setListName] = useState("");
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isPaid, setIsPaid] = useState<boolean>(
    userType === "guest" ? true : false
  );
  const [isUpdatedAt, setIsUpdatedAt] = useState<number>(0);

  useEffect(() => {
    console.log("🔥 useEffect triggered with isUpdatedAt =", isUpdatedAt);

    const fetchLists = async () => {
      console.log("Fetching lists...");
      try {
        const response = await getLists({ email: userEmail });
        if (response.success) {
          setLists(response.data || []);
          console.log("Fetched lists:", response.data);
        } else {
          toast.error("Failed to load lists");
        }
      } catch (error) {
        console.error("Error fetching lists:", error);
        toast.error("Error fetching lists");
      }
    };

    if (userEmail) {
      fetchLists();
    }
  }, [userEmail, uploading, isPaid, isUpdatedAt]);

  // Image Handling Methods
  const handleImageChange = (
    fileInputRef: React.RefObject<HTMLInputElement>
  ) => {
    //const file = e.target.files?.[0];
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const formattedName = file.name
      .split(".")[0]
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    setImageName(formattedName);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setImageName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      handleRemoveImage();
    }
  };

  const handleImageUpload = async (listName: string, file?: File) => {
    const image =
      file ||
      (document.getElementById("imageInput") as HTMLInputElement)?.files?.[0];

    if (!userEmail) {
      toast.error("Cannot upload image as Guest");
      return;
    }

    if (!image || !imageName) {
      toast.error("Missing image or image name");
      return;
    }

    const targetList = lists.find((list) => list.name === listName);
    const isDuplicate = targetList?.images?.some(
      (img) => img.imageName === imageName
    );

    if (isDuplicate) {
      toast.error(
        `An image with the name "${imageName}" already exists in this list. Please choose a different name.`
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("imageName", imageName);
      formData.append("ownerEmail", userEmail);
      formData.append("listName", listName);

      if (userType === "guest") {
        toast.error("Guest user cannot upload images");
        return;
      }

      const response = await uploadAwsImageLinkToList(formData);
      // setInterval(() => handleDialogClose(false), 4000);

      if (!response.success) {
        toast.error(response.message || "Failed to upload image");
      } else {
        handleDialogClose(false);
        // Update lists with the new image
        const updatedLists = lists.map((list) =>
          list.name === listName
            ? {
                ...list,
                images: [
                  ...(list.images || []),
                  {
                    imageName,
                    url: response.url,
                  },
                ],
                updatedAt: Date.now(),
              }
            : list
        );
        setUploading(!uploading);
        toast.success("Image uploaded successfully!");
        setLists(updatedLists);
      }
      console.log("pro");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  // Image Deletion Method
  const handleDeleteImage = async (listName: string, image: IImage) => {
    if (!userEmail) return;

    setLoading(true);

    try {
      const response = await deleteAwsImageLinkToList({
        ownerEmail: userEmail,
        listName: listName,
        imageName: image.imageName,
        imageUrl: image.url,
      });

      if (response.success) {
        toast.success("Image deleted successfully!");

        // Update lists by removing the specific image
        const updatedLists = lists.map((list) =>
          list.name === listName
            ? {
                ...list,
                images: list.images?.filter(
                  (img) => img.imageName !== image.imageName
                ),
                updatedAt: Date.now(),
              }
            : list
        );

        setLists(updatedLists);
      } else {
        toast.error(response.message || "Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Error deleting image");
    } finally {
      setLoading(false);
    }
  };

  // Existing List Management Methods
  const addList = async () => {
    if (!listName.trim()) {
      toast.error("List name cannot be empty.");
      return;
    }

    if (userType === "guest" && lists.length >= 2) {
      toast.error("Guest can only have up to 2 lists");
      return;
    }

    // Check if the list name already exists
    const listExists = lists.find((l) => l.name === listName);

    if (listExists) {
      toast.error("Each list name must be unique.");
      return;
    }

    const newList: IList = {
      id: `list-${Date.now()}`, // Generate a unique ID
      ownerEmail: userEmail,
      ownerName: userName,
      ownerType: userType,
      name: listName,
      links: [],
      messages: [],
      images: [],
      paid: userType === "guest" ? true : false,
      price: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      const response = await AddList({
        ownerEmail: userEmail,
        ownerName: userName,
        ownerType: userType,
        name: listName,
        links: [],
        messages: [],
        isPaid: userType === "guest" ? true : false,
      });

      if (response.success) {
        setLists([...lists, newList]);
        toast.success(response.message);
        setListName("");
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const removeList = async (name: string) => {
    if (!userEmail) {
      toast.error("You must be logged in to delete a list...");
      return;
    }

    try {
      const response = await deleteList({
        ownerEmail: userEmail,
        listName: name,
        ownerType: userType,
      });

      if (response.success) {
        toast.success(response.message);
        setLists(lists.filter((list) => list.name !== name));
      } else {
        toast.error(response.message || "Failed to delete list");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the list");
    }
  };

  const addToList = async (
    listName: string,
    content: string,
    isMessage: boolean = false
  ) => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      toast.error(
        isMessage
          ? `Message cannot be empty. ${content}`
          : `Link cannot be empty. ${content}`
      );
      return;
    }

    const formattedContent = isMessage
      ? trimmedContent
      : formatUrl(trimmedContent);

    const list = lists.find((l) => l.name === listName);

    if (list) {
      if (userType === "guest") {
        console.log("Guest user list size validation");
        const totalLinks = list.links.length + (isMessage ? 0 : 1);
        const totalMessages = list.messages.length + (isMessage ? 1 : 0);

        if (totalLinks > 2) {
          toast.error("Guest users can only add up to 2 links.");
          return;
        }

        if (totalMessages > 2) {
          toast.error("Guest users can only add up to 2 messages.");
          return;
        }
      }

      if (isMessage && list.messages.includes(trimmedContent)) {
        toast.error("Message already exists in this list.");
        return;
      } else if (!isMessage && !isValidLink(trimmedContent)) {
        toast.error("Invalid link.");
        return;
      } else if (!isMessage && list.links.includes(formattedContent)) {
        toast.error("Link already exists in this list.");
        return;
      }
    }

    try {
      const payload: AddListData = {
        ownerEmail: userEmail,
        ownerName: userName,
        ownerType: userType,
        name: listName,
        links: isMessage ? [] : [formattedContent],
        messages: isMessage ? [trimmedContent] : [],
        isPaid: userType === "guest" ? true : false,
      };
      console.log("Guest user payload", payload);

      const response = await AddList(payload);

      if (response.success) {
        const updatedLists = lists.map((list) =>
          list.name === listName
            ? {
                ...list,
                [isMessage ? "messages" : "links"]: [
                  ...(isMessage ? list.messages : list.links),
                  isMessage ? trimmedContent : formattedContent,
                ],
                updatedAt: Date.now(),
              }
            : list
        );

        setLists(updatedLists);
        toast.success(response.message);

        setInputValues((prev) => ({ ...prev, [listName]: "" }));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(isMessage ? "Error adding message" : "Error adding link");
    }
  };

  const removeLink = async (listName: string, link: string) => {
    const list = lists.find((l) => l.name === listName);
    if (!list) {
      toast.error("List not found");
      return;
    }

    if (list.links.includes(link)) {
      const response = await deleteLinkFromList({
        ownerEmail: userEmail || "",
        listName: listName,
        link: link,
        ownerType: userType,
      });

      if (response.success) {
        toast.success(response.message);

        // Update lists by removing the link
        const updatedLists = lists.map((list) =>
          list.name === listName
            ? {
                ...list,
                links: list.links.filter((l) => l !== link),
                updatedAt: Date.now(),
              }
            : list
        );

        setLists(updatedLists);
      } else {
        toast.error(response.message);
      }
    }
  };

  const removeMessage = async (listName: string, message: string) => {
    const list = lists.find((l) => l.name === listName);
    if (!list) {
      toast.error("List not found");
      return;
    }

    if (list.messages.includes(message)) {
      const response = await deleteMessageFromList({
        ownerEmail: userEmail || "",
        listName: listName,
        message: message,
        ownerType: userType,
      });

      if (response.success) {
        toast.success(response.message);

        // Update lists by removing the message
        const updatedLists = lists.map((list) =>
          list.name === listName
            ? {
                ...list,
                messages: list.messages.filter((m) => m !== message),
                updatedAt: Date.now(),
              }
            : list
        );

        setLists(updatedLists);
      } else {
        toast.error("Error removing message");
      }
    }
  };

  const handleUpdatedTime = async () => {
    const response = await getLists({ email: userEmail });
    if (response.success) {
      const latestUpdateTime = response.data.reduce(
        (acc, curr) => acc + curr.updatedAt,
        0
      );
      console.log("Previous:", isUpdatedAt);
      console.log("New:", latestUpdateTime);

      if (latestUpdateTime !== isUpdatedAt) {
        setIsUpdatedAt(latestUpdateTime);
      } else {
        console.log("No change in updated time");
      }
    }
  };

  // Updated handlePayment function with the variable naming conflict fixed
  const handlePayment = async (
    listName: string,
    isPaid: boolean,
    ownerEmail: string,
    ownerType: string
  ) => {
    if (!userType) {
      toast.error("Guest can not pay for a list");
      return;
    }
    if (!ownerEmail && !userEmail) {
      toast.error("You must be logged in to pay for a list...");
      return;
    }

    try {
      // Get list data
      const listData = await getListByName({
        email: userEmail,
        listName: listName,
      });

      if (!listData.success) {
        toast.error(listData.message);
        return;
      }

      if (listData.data.paid) {
        toast.error("List is already paid");
        return;
      }

      console.log("hello");
      console.log(listData.data.paid);
      console.log(listData.data.links.length);
      console.log(listData.data.messages.length);
      console.log(
        "yopooooo, ",
        listData.data.images?.map((image) => image.imageName).length || 0
      );

      const totalItem =
        listData.data.links.length +
        listData.data.messages.length +
        ((listData.data.images &&
          listData.data.images?.map((image) => image.imageName).length) ||
          0);
      console.log("totalItem", totalItem);
      if (totalItem < 5) {
        console.log("hello total Item");
        return toast.error(
          "Atleast there must be 5 items in the list to proceed...star"
        );
        //return;
      }

      const totalPrice =
        listData.data.links.length +
        listData.data.messages.length +
        (listData.data.images?.map((image) => image.imageName).length || 0) * 2;

      console.log("totalPrice", totalPrice);

      if (totalPrice <= 5) {
        toast.error("Price must be greater than Five Rupees");
        return;
      }

      console.log("Pro Star");

      // Load Razorpay script
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        toast.error(
          "Razorpay SDK failed to load. Please check your internet connection."
        );
        return;
      }

      // Create order on the server
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalPrice,
          currency: "INR",
          receipt: `receipt_order_${Date.now()}`,
          notes: {
            listName: listName,
            userEmail: userEmail,
            ownerType: ownerType,
          },
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        toast.error("Could not create order. Please try again.");
        return;
      }

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID,
        amount: totalPrice * 100,
        currency: "INR",
        name: "Gift Qr",
        description: `Payment for list: ${listName}`,
        order_id: orderData.order.id,
        handler: async function (razorpayResponse: any) {
          // Verify payment on your server
          const verifyResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            // Update list as paid in your database
            const dbUpdateResponse = await addPaidInList({
              ownerEmail: userEmail,
              listName: listName,
              price: totalPrice,
              isPaid: true,
              ownerType: ownerType as IUser["type"],
              paymentId: razorpayResponse.razorpay_payment_id,
              orderId: razorpayResponse.razorpay_order_id,
            });

            console.log("dbUpdateResponse", dbUpdateResponse);

            if (dbUpdateResponse.success) {
              console.log("Response: ", dbUpdateResponse.data);
              toast.success(dbUpdateResponse.message);
              setIsPaid(true);
            } else {
              toast.error(dbUpdateResponse.message);
            }
          } else {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: userName, // You can add user's name here if available
          email: userEmail,
          contact: "", // You can add user's phone here if available
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Open Razorpay payment form
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

      // Handle payment failures
      paymentObject.on("payment.failed", function (failureResponse: any) {
        toast.error(`Payment failed: ${failureResponse.error.description}`);
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred while processing the payment");
    }
  };

  return {
    // List management
    lists,
    isPaid,
    setIsPaid,
    setLists,
    listName,
    inputValues,
    isSaving,
    setListName,
    setInputValues,
    addList,
    removeList,
    addToList,
    removeLink,
    removeMessage,
    handleUpdatedTime,
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
  };
};
