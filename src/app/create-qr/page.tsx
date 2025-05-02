"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { addUser } from "../../../action/add-user";
import { IUser } from "@/models/user";
import { deleteUserByEmail } from "../../../action/delete-user-by-email";
import Lists from "@/components/lists";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const hasRun = useRef(false);

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("guest") === "true";
    }
    return false;
  });

  useEffect(() => {
    const addUserToDB = async () => {
      if (hasRun.current || !session?.user) return;
      hasRun.current = true;

      try {
        const result = await addUser({
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          avatar: session.user.avatar,
          type: session.user.type,
        });

        if (result.success) {
          toast.success("Welcome back!");
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Error adding user: " + (error as string));
      }
    };

    if (session) addUserToDB();
  }, [session]);

  const handleAllSignOut = async (
    email: IUser["email"],
    type: IUser["type"]
  ) => {
    try {
      if (type === "guest") {
        const res = await deleteUserByEmail({ email, type: "guest" });
        if (res.success) {
          toast.success("Guest account deleted");
        } else {
          toast.error(res.message);
        }
      }
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      toast.error("Logout error: " + (error as string));
    }
  };

  const user = session?.user;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#fdfbfb] via-[#ebedee] to-[#dfe9f3] text-gray-900 p-6 font-[Poppins]"
    >
      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-extrabold text-center mb-8 drop-shadow-lg font-[Rubik] text-gray-800"
      >
        Welcome to GiftQR
      </motion.h1>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full flex flex-col items-center justify-center"
      >
        <Card className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border border-gray-200 text-center">
          <CardHeader>
            <Image
              src={user?.avatar || "/images/cat-guest.png"}
              alt="User Avatar"
              width={100}
              height={100}
              className="mx-auto w-24 h-24 border border-gray-300 shadow-md rounded-full object-cover"
            />
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold text-gray-800">
              {user?.name || "Guest User"}
            </p>
            {user?.email && (
              <p className="text-sm text-gray-500">{user.email}</p>
            )}
            <Separator className="my-4" />

            <Button
              onClick={() =>
                handleAllSignOut(user?.email || "", user?.type as IUser["type"])
              }
              variant="destructive"
              className="text-lg font-medium p-2 w-full transition hover:bg-red-600"
            >
              Log Out
            </Button>

            <div className="mt-6">
              <Lists
                ownerEmail={user?.email || ""}
                ownerName={user?.name || ""}
                ownerType={user?.type as IUser["type"]}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
