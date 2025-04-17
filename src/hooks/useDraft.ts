"use client";

import { IImage } from "@/models/list";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { fetchDraftByName } from "../../action/draft/fetch-draft-by-name";
import { addLinksMessagesImagesinDraft } from "../../action/draft/add-links-messages";
import { addImagesInDraft } from "../../action/draft/add-images-in-draft";
import { deleteLinkFromDraft } from "../../action/draft/delete-link-from-draft";
import { deleteMessageFromDraft } from "../../action/draft/delete-message-from-draft";
import { deleteImagesInDraft } from "../../action/draft/delete-images-in-draft";
import { loadScript } from "@/utils/razorpayScript";
import { addDraftToList } from "../../action/draft/add-draft-to-list";

type AddMoreListProps = {
  listName: string;
  isPaid: boolean;
  ownerEmail: string;
};
export const useDraft = ({
  ownerEmail,
  listName,
  isPaid,
}: AddMoreListProps) => {
  const [moreItems, setMoreItems] = useState<{
    [listName: string]: {
      link: string[];
      message: string[];
      image: IImage[];
    };
  }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draftPaymentStatus, setDraftPaymentStatus] = useState<
    "unpaid" | "paid"
  >();
  const [moreItemLink, setMoreItemLink] = useState<string>("");
  const [moreItemMessage, setMoreItemMessage] = useState<string>("");
  const [moreItemImage, setMoreItemImage] = useState<File>();
  const [imageName, setImageName] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    async function fetchDraft() {
      try {
        const response = await fetchDraftByName({
          ownerEmail: ownerEmail,
          listName: listName,
          draftName: "draft_" + listName,
        });

        if (response.success) {
          setMoreItems({
            [listName]: {
              link: response.data.links || [],
              message: response.data.messages || [],
              image: response.data.images || [],
            },
          });
          setDraftPaymentStatus(response.data.status);

          console.log("response.data.images", response.data.images);
        }
      } catch (error) {
        toast.error("Failed to fetch draft data.");
      }
    }

    if (ownerEmail && listName) {
      fetchDraft();
    }
  }, [listName, moreItemImage, ownerEmail]);

  const prevList = moreItems[listName] || {
    link: [],
    message: [],
    image: [],
  };
  const handleClickMoreItems = async (listName: string) => {
    try {
      const trimmedLink = moreItemLink.trim();
      const trimmedMessage = moreItemMessage.trim();

      if (!trimmedLink && !trimmedMessage) return;

      const updatedLinks =
        trimmedLink && !prevList.link.includes(trimmedLink)
          ? [...prevList.link, trimmedLink]
          : [...prevList.link];

      const updatedMessages =
        trimmedMessage && !prevList.message.includes(trimmedMessage)
          ? [...prevList.message, trimmedMessage]
          : [...prevList.message];

      const updatedMoreItems = {
        ...moreItems,
        [listName]: {
          link: updatedLinks,
          message: updatedMessages,
          image: prevList.image,
        },
      };

      setMoreItems(updatedMoreItems);
      setMoreItemLink("");
      setMoreItemMessage("");
      setMoreItemImage(undefined);

      const response = await addLinksMessagesImagesinDraft({
        ownerEmail: ownerEmail,
        ownerType: "user",
        listName: listName,
        draftName: "draft_" + listName,
        links: updatedLinks,
        messages: updatedMessages,
        // images: updatedImages,
      });

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const handleImageChange = (
    fileInputRef: React.RefObject<HTMLInputElement>
  ) => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    console.log("file", file.name);
    const formattedName = file.name.split(".").slice(0, -1).join(".");
    setPreviewImage(URL.createObjectURL(file));
    console.log("formattedName", formattedName);
    setMoreItemImage(file);
    setImageName(formattedName);
    console.log("imageName", imageName);
  };

  const handleClickAddMoreImages = async (listName: string) => {
    if (!moreItemImage) {
      toast.error("Please select an image before adding.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("ownerEmail", ownerEmail);
      formData.append("listName", listName);
      formData.append("draftName", "draft_" + listName);
      formData.append("image", moreItemImage);
      formData.append("imageName", moreItemImage.name);

      const response = await addImagesInDraft(formData);

      if (response.success) {
        toast.success(response.message);
        setMoreItemImage(undefined);
        handleRemoveImage();
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleLinkDelete = async (listName: string, link: string) => {
    try {
      const response = await deleteLinkFromDraft({
        ownerEmail: ownerEmail,
        listName: listName,
        draftName: "draft_" + listName,
        link: link,
      });

      if (response.success) {
        toast.success(response.message);
        const updatedLinks = moreItems[listName].link.filter(
          (item) => item !== link
        );
        setMoreItems({
          ...moreItems,
          [listName]: {
            ...moreItems[listName],
            link: updatedLinks,
          },
        });
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong while deleting link");
    }
  };

  const handleMessageDelete = async (listName: string, message: string) => {
    try {
      const response = await deleteMessageFromDraft({
        ownerEmail: ownerEmail,
        listName: listName,
        draftName: "draft_" + listName,
        message: message,
      });

      if (response.success) {
        toast.success(response.message);
        const updatedMessages = moreItems[listName].message.filter(
          (item) => item !== message
        );
        setMoreItems({
          ...moreItems,
          [listName]: {
            ...moreItems[listName],
            message: updatedMessages,
          },
        });
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(
        error.message || "Something went wrong while deleting message"
      );
    }
  };

  const handleImageDelete = async (listName: string, imageUrl: string) => {
    try {
      const response = await deleteImagesInDraft({
        ownerEmail: ownerEmail,
        listName: listName,
        draftName: "draft_" + listName,
        imageUrl: imageUrl,
      });

      if (response.success) {
        toast.success(response.message);

        // The issue here was the property name - based on your schema,
        // it should be "images" (plural), not "image"
        const updatedImages = moreItems[listName].image.filter(
          (item) => item.url !== imageUrl
        );

        setMoreItems({
          ...moreItems,
          [listName]: {
            ...moreItems[listName],
            image: updatedImages, // Using "images" instead of "image"
          },
        });
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong while deleting image");
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setImageName("");
    setMoreItemImage(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDraftPayment = async (listName: string, ownerEmail: string) => {
    console.log("handleDraftPayment");
    try {
      const response = await fetchDraftByName({
        ownerEmail: ownerEmail,
        listName: listName,
        draftName: "draft_" + listName,
      });

      if (!response.success) {
        toast.error(response.message);
        return { success: false };
      }

      console.log("response.data pro", response.data.links);
      {
        response.data.images &&
          console.log("response pro", listName, response.data.images);
      }
      const total =
        (response.data.images?.length || 0) * 2 +
        (response.data.links?.length || 0) +
        (response.data.messages?.length || 0);

      console.log("Calculated totalPrice:", total);
      setTotalPrice(total);

      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        toast.error(
          "Razorpay SDK failed to load. Please check your internet connection."
        );
        return { success: false };
      }

      console.log("totalPrice", total);
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          receipt: `receipt_order_${Date.now()}`,
          notes: {
            listName: listName,
            draftName: "draft_" + listName,
            userEmail: ownerEmail,
          },
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        toast.error("Could not create order. Please try again.");
        return { success: false };
      }

      // Return a promise that will resolve when payment is complete
      return new Promise((resolve) => {
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
              console.log("Response: ", verifyData.data);
              const listUpdateResponse = await addDraftToList({
                ownerEmail: ownerEmail,
                listName: listName,
                draftName: "draft_" + listName,
              });

              if (listUpdateResponse.success) {
                toast.success(listUpdateResponse.message);
                resolve({ success: true });
              } else {
                toast.error(listUpdateResponse.message);
                resolve({ success: false });
              }
              toast.success(verifyData.message);
            } else {
              toast.error(
                "Payment verification failed. Please contact support."
              );
              resolve({ success: false });
            }
          },
          prefill: {
            email: ownerEmail,
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
          resolve({ success: false });
        });
      });
    } catch (error) {
      toast.error("An error occurred while fetching the draft");
      return { success: false };
    }
  };
  return {
    setDraftPaymentStatus,
    moreItems,
    fileInputRef,
    moreItemLink,
    moreItemMessage,
    moreItemImage,
    imageName,
    previewImage,
    totalPrice,

    setMoreItemLink,
    setMoreItemMessage,
    setMoreItemImage,
    setImageName,
    setPreviewImage,
    setTotalPrice,

    handleClickMoreItems,
    handleImageChange,
    handleClickAddMoreImages,
    handleLinkDelete,
    handleMessageDelete,
    handleImageDelete,
    handleRemoveImage,
    handleDraftPayment,
  };
};
