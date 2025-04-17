"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import { addUser } from "../../action/add-user";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Lists from "@/components/lists";
import "@fontsource/poppins";
import "@fontsource/rubik";
import Image from "next/image";
import { get } from "http";
import { deleteUserByEmail } from "../../action/delete-user-by-email";
import { deleteList } from "../../action/delete-list";
import { IUser } from "@/models/user";

export default function Home() {
  const { data: session } = useSession();
  const hasRun = useRef(false);
  const [isGuest, setIsGuest] = useState<boolean>(
    typeof window !== "undefined" && localStorage.getItem("guest") === "true"
  );
  useEffect(() => {
    const addUserToDB = async () => {
      if (hasRun.current) return;
      hasRun.current = true;
      try {
        if (session) {
          const result = await addUser({
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            avatar: session.user.avatar,
            type: session.user.type,
          });

          if (result.success) {
            toast.success("User added successfully!");
          } else {
            toast.error(result.message);
          }
        }
      } catch (error) {
        toast.error("Error adding user: " + error);
      }
    };

    if (session) {
      addUserToDB();
    }
  }, [session]);

  useEffect(() => {
    console.log("pro star");
  }, []);

  // const handleGuestLogin = async () => {
  //   try {
  //     const guestUserEmail = "Guest_Email" + Math.floor(Math.random() * 10000);
  //     var guestUserName = "Guest_Name " + Math.floor(Math.random() * 10000);

  //     console.log("syska", guestUserName);
  //     const result = await addUser({
  //       id: "Guest-" + Math.floor(Math.random() * 10000),
  //       name: guestUserName,
  //       email: guestUserEmail,
  //       avatar: "demo",
  //       type: "guest",
  //     });
  //     setGuestEmail(guestUserEmail);
  //     setGuestName(guestUserName);
  //     if (result.success) {
  //       toast.success("Guest added successfully!");
  //       setIsGuest(true);
  //       localStorage.setItem("guest", "true");
  //     } else {
  //       toast.error(result.message);
  //     }
  //     console.log("oreo");
  //   } catch (error) {
  //     toast.error("Error adding guest: " + error);
  //   }
  // };

  // const handleLogout = async () => {
  //   try {
  //     const res = await deleteUserByEmail({
  //       email: guestEmail,
  //       type: "guest",
  //     });
  //     if (res.success) {
  //       setIsGuest(false);
  //       localStorage.removeItem("guest");
  //       toast.success("Guest deleted successfully");
  //     } else {
  //       toast.error(res.message);
  //     }
  //   } catch (error) {
  //     toast.error("Error deleting guest: " + error);
  //   }
  // };

  // const handleAllSignOut = () => {
  //   signOut();
  // };

  const handleAllSignOut = async (
    email: IUser["email"],
    type: IUser["type"]
  ) => {
    if (type === "guest") {
      try {
        const res = await deleteUserByEmail({
          email: email,
          type: "guest",
        });
        if (res.success) {
          toast.success("Guest Account deleted successfully");
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error("Error deleting guest: " + error);
      }
    }
    signOut();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#fdfbfb] via-[#ebedee] to-[#dfe9f3] text-gray-900 p-6 font-[Poppins]"
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-extrabold text-center mb-8 drop-shadow-lg font-[Rubik] text-gray-800"
      >
        Welcome to GiftQR
      </motion.h1>

      {session || isGuest ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className=" w-full flex flex-col items-center justify-center"
        >
          <Card className="bg-gray-50 w-9/12 p-8 rounded-2xl shadow-xl border border-gray-200 text-center">
            <CardHeader>
              <Image
                src={session?.user?.avatar || "/images/cat-guest.png"}
                alt="avatar"
                width={1200}
                height={1200}
                className="mx-auto w-20 h-20 border border-gray-300 shadow-md rounded-full"
              />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-gray-800">
                {session?.user?.name || "Guest User"}
              </p>
              <p className="text-sm text-gray-500">{session?.user?.email}</p>
              <Separator className="my-4" />
              <Button
                onClick={() =>
                  handleAllSignOut(
                    session?.user?.email || "",
                    session?.user?.type as IUser["type"]
                  )
                }
                variant="destructive"
                className=" border-gray-300 text-gray-200 hover:border-gray-900 hover:text-gray-900 transition-all text-lg font-semibold p-2 w-72"
              >
                Log Out
              </Button>

              <Lists
                ownerEmail={session?.user?.email || ""}
                ownerName={session?.user?.name || ""}
                ownerType={session?.user?.type as IUser["type"]}
              />
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center"
        >
          <Button
            onClick={() => signIn()}
            className="mt-6 bg-gradient-to-r from-[#7F00FF] to-[#E100FF] text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:from-[#6a00cc] hover:to-[#c300cc] transition-all"
          >
            Log In
          </Button>
          {/* <Button
        onClick={handleGuestLogin}
        className="mt-6 bg-gray-900 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-gray-700"
      >
        As Guest
      </Button> */}
          <Card className="mt-8 bg-white border border-gray-200 shadow-md w-full max-w-xl rounded-2xl">
            <CardHeader className="text-2xl font-semibold text-center text-gray-800 py-4">
              Steps to get started
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <ol className="list-decimal list-inside space-y-2 text-gray-700 text-base">
                <li>Get logged in using Google.</li>
                <li>Name your gift list (must be unique).</li>
                <li>Add links to the list.</li>
                <li>Generate a QR code.</li>
                <li>Share the QR code with your friends.</li>
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
