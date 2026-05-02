"use client";

import { useEffect, useState } from "react";
import AccountSidebar from "./account-sidebar";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IProfileRoot } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { PencilLine } from "lucide-react";
import { useProfile } from "@/components/ui/context/ProfileContext";
import ChangeEmailDialog from "./change-email";
import DeleteAccount from "./delete-account";

const schema = z.object({
  firstname: z.string().min(2, "Your first name is required"),
  lastname: z.string().min(2, "Your last name is required"),
  username: z.string().min(2, "Your username is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(10, "Phone number is too short")
    .refine((val) => /^\+?[1-9]\d{1,14}$/.test(val), {
      message: "Invalid phone number format",
    }),
});

type ProfileValues = z.infer<typeof schema>;

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const form = useForm<ProfileValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      phone: "",
    },
  });

  //Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/account");
      const data: IProfileRoot = await res.json();
      const user = data.payload.user;
      console.log(data);
      form.reset({
        firstname: user.firstName,
        lastname: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
      });
    };

    fetchProfile();
  }, [form]);

  //  Submit
  const { refreshProfile } = useProfile();

  const onSubmit = async (values: ProfileValues) => {
    const res = await fetch("/api/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();
    console.log(data);
    if (data.status) {
      console.log("Profile updated!");
      await refreshProfile();
    } else {
      console.log(data.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className="flex gap-10 max-w-7xl">
        {/* Sidebar */}
        <div className="min-w-80 h-178 bg-white p-6">
          <AccountSidebar />
        </div>

        <div className="min-w-190 h-178 bg-white p-6">
          <div className="flex-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >
                {/* First & Last Name */}
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ahmed"
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Abdullah"
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="user123"
                          className="h-11"
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-2">
                        <FormLabel className="m-0">Email</FormLabel>

                       {/* Button change */}
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => setOpenEmailDialog(true)}
                          className="h-auto p-0 text-blue-600 hover:text-blue-700 font-mono flex items-center gap-1 text-sm"
                        >
                          <PencilLine className="w-4 h-4" />
                          Change
                        </Button>

                        <ChangeEmailDialog
                          open={openEmailDialog}
                          onOpenChange={setOpenEmailDialog}
                        />
                      </div>

                      <FormControl>
                        <Input
                          {...field}
                          placeholder="user@example.com"
                          className="h-11 bg-gray-50/50"
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl className="w-full">
                        <PhoneInput
                          placeholder="Enter phone number"
                          defaultCountry="EG"
                          value={field.value}
                          onChange={field.onChange}
                          className="flex h-11 w-full border border-input bg-background px-3 py-2 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Buttons */}
                <div className="flex gap-4 mt-2 ">
                  {/* Delete */}
              
                <DeleteAccount/>
                  {/* Save */}

                  <button
                    type="submit"
                    className="flex-1 cursor-pointer py-3 text-sm font-mono text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
