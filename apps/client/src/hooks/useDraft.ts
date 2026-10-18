"use client";

import { priceOf, type IImage } from "@giftqr/shared";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  deleteDraftImage,
  deleteDraftLink,
  deleteDraftMessage,
  getDraft,
  saveDraftItems,
  uploadDraftImage,
} from "@/lib/api/drafts";
import { confirmPayment, createOrder } from "@/lib/api/payments";
import { loadScript } from "@/utils/razorpayScript";
import { formatUrl, isValidLink } from "@/constants";

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

  // Loading states
  const [isLoading] = useState<boolean>(false);
  const [isFetchingDraft, setIsFetchingDraft] = useState<boolean>(false);
  const [isAddingItem, setIsAddingItem] = useState<boolean>(false);
  const [isAddingImage, setIsAddingImage] = useState<boolean>(false);
  const [isDeletingItem, setIsDeletingItem] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] =
    useState<boolean>(false);

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
      if (!ownerEmail || !listName) return;

      setIsFetchingDraft(true);
      try {
        const response = await getDraft(listName);

        if (response.success) {
          setMoreItems({
            [listName]: {
              link: response.data.links || [],
              message: response.data.messages || [],
              image: response.data.images || [],
            },
          });
          setDraftPaymentStatus(response.data.status);
        }
      } catch (error) {
        toast.error("Failed to fetch draft data.");
      } finally {
        setIsFetchingDraft(false);
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
      setIsAddingItem(true);
      const trimmedLink = moreItemLink.trim();
      const trimmedMessage = moreItemMessage.trim();

      if (!trimmedLink && !trimmedMessage) return;

      if (!trimmedMessage && !isValidLink(trimmedLink)) {
        toast.error("Invalid link.");
        return;
      }

      const updatedLinks =
        trimmedLink && !prevList.link.includes(trimmedLink)
          ? [...prevList.link, formatUrl(trimmedLink)]
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

      const response = await saveDraftItems(listName, {
        links: updatedLinks,
        messages: updatedMessages,
      });

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsAddingItem(false);
    }
  };

  const handleImageChange = (
    fileInputRef: React.RefObject<HTMLInputElement>
  ) => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const formattedName = file.name.split(".").slice(0, -1).join(".");
    setPreviewImage(URL.createObjectURL(file));
    setMoreItemImage(file);
    setImageName(formattedName);
  };

  const handleClickAddMoreImages = async (listName: string) => {
    if (!moreItemImage) {
      toast.error("Please select an image before adding.");
      return;
    }

    try {
      setIsAddingImage(true);
      const response = await uploadDraftImage(
        listName,
        moreItemImage,
        moreItemImage.name
      );

      if (response.success) {
        toast.success(response.message);
        setMoreItemImage(undefined);
        handleRemoveImage();
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsAddingImage(false);
    }
  };

  const handleLinkDelete = async (listName: string, link: string) => {
    try {
      setIsDeletingItem(true);
      const response = await deleteDraftLink(listName, link);

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
    } finally {
      setIsDeletingItem(false);
    }
  };

  const handleMessageDelete = async (listName: string, message: string) => {
    try {
      setIsDeletingItem(true);
      const response = await deleteDraftMessage(listName, message);

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
    } finally {
      setIsDeletingItem(false);
    }
  };

  const handleImageDelete = async (listName: string, imageUrl: string) => {
    try {
      setIsDeletingItem(true);
      const response = await deleteDraftImage(listName, imageUrl);

      if (response.success) {
        toast.success(response.message);

        const updatedImages = moreItems[listName].image.filter(
          (item) => item.url !== imageUrl
        );

        setMoreItems({
          ...moreItems,
          [listName]: {
            ...moreItems[listName],
            image: updatedImages,
          },
        });
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong while deleting image");
    } finally {
      setIsDeletingItem(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setImageName("");
    setMoreItemImage(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDraftPayment = async (listName: string, ownerEmail: string) => {
    try {
      setIsProcessingPayment(true);
      const response = await getDraft(listName);

      if (!response.success) {
        toast.error(response.message);
        setIsProcessingPayment(false);
        return { success: false };
      }

      // The same price and check the server uses for the order
      const price = priceOf("draft", response.data);
      setTotalPrice(price.amount);

      if (price.blocker) {
        toast.error(price.blocker);
        setIsProcessingPayment(false);
        return { success: false };
      }

      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        toast.error(
          "Razorpay SDK failed to load. Please check your internet connection."
        );
        setIsProcessingPayment(false);
        return { success: false };
      }

      const orderData = await createOrder(listName, "draft");

      if (!orderData.success) {
        toast.error(orderData.message || "Could not create order. Please try again.");
        setIsProcessingPayment(false);
        return { success: false };
      }

      // Return a promise that will resolve when payment is complete
      return new Promise((resolve) => {
        // Configure Razorpay options
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID,
          amount: orderData.data.amount,
          currency: orderData.data.currency,
          name: "Gift Qr",
          description: `Payment for list: ${listName}`,
          order_id: orderData.data.id,
          handler: async function (razorpayResponse: any) {
            try {
              // The server verifies the payment, then moves the draft items into the list
              const confirmData = await confirmPayment(listName, "draft", {
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
              });

              if (confirmData.success) {
                toast.success(confirmData.message);
                resolve({ success: true });
              } else {
                toast.error(
                  confirmData.message ||
                    "Payment verification failed. Please contact support."
                );
                resolve({ success: false });
              }
            } finally {
              setIsProcessingPayment(false);
            }
          },
          prefill: {
            email: ownerEmail,
            listName: listName,
          },
          theme: {
            color: "#3399cc",
          },
          onClose: () => {
            toast.info("Payment popup closed.");
            setIsProcessingPayment(false);
            resolve({ success: false }); // <-- resolve here too
          },
          onError: (error: any) => {
            toast.error(`Payment failed: ${error.error.description}`);
            setIsProcessingPayment(false);
          },
          onPaymentSuccess: (response: any) => {
            toast.success(response.message);
            setIsProcessingPayment(false);
          },
        };

        // Open Razorpay payment form
        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();

        // Handle payment failures
        paymentObject.on("payment.failed", function (failureResponse: any) {
          toast.error(`Payment failed: ${failureResponse.error.description}`);
          setIsProcessingPayment(false);
          resolve({ success: false });
        });
      });
    } catch (error) {
      toast.error("An error occurred while fetching the draft");
      setIsProcessingPayment(false);
      return { success: false };
    }
  };

  return {
    // States
    moreItems,
    fileInputRef,
    moreItemLink,
    moreItemMessage,
    moreItemImage,
    imageName,
    previewImage,
    totalPrice,
    draftPaymentStatus,

    // Loading states
    isLoading,
    isFetchingDraft,
    isAddingItem,
    isAddingImage,
    isDeletingItem,
    isProcessingPayment,

    // Setters
    setIsProcessingPayment,
    setDraftPaymentStatus,
    setMoreItemLink,
    setMoreItemMessage,
    setMoreItemImage,
    setImageName,
    setPreviewImage,
    setTotalPrice,

    // Handlers
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
