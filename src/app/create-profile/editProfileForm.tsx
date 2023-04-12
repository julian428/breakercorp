"use client";

import StandardButton from "@/components/ui/button";
import StandardFileInput from "@/components/ui/file";
import StandardInput from "@/components/ui/input";
import StandardTextara from "@/components/ui/textarea";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

interface Props {
  userProfile: UserProfile;
}

export default function EditProfileForm({ userProfile }: Props) {
  const [imageData, setImageData] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const router = useRouter();

  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    let imageUrl = userProfile.image;
    if (imageData) {
      const data = new FormData();
      data.append("file", imageData);
      data.append("upload_preset", "shvfkewg");
      data.append("cloud_name", "dwhb1tygf");
      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dwhb1tygf/image/upload",
          {
            method: "POST",
            body: data,
          }
        );
        const { url } = await response.json();
        imageUrl = url as string;
      } catch (error) {
        console.log(error);
      }
    }
    try {
      const username = usernameRef.current?.value;
      const description = descriptionRef.current?.value;
      if (!username) throw new Error("Username is required.");
      if (!description) throw new Error("Description is required.");

      await axios.post("/api/user/add", { username, description, imageUrl });
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
      router.replace("/");
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col gap-8 items-center"
    >
      <h1 className="text-3xl">Edit your profile</h1>
      <StandardInput
        label="Username"
        required
        minLength={3}
        defaultValue={userProfile.username}
        ref={usernameRef}
      />
      <StandardTextara
        label="Description"
        required
        defaultValue={userProfile.description}
        minRows={3}
        minLength={32}
        maxLength={256}
        ref={descriptionRef}
      />
      <StandardFileInput
        defaultImage={{
          url: userProfile.image || "",
          name:
            userProfile.username.split(" ").join("_").toLowerCase() + ".png",
        }}
        setImageData={setImageData}
      />
      <StandardButton loading={submitting}>Save</StandardButton>
    </form>
  );
}
