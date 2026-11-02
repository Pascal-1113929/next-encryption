"use client"

import { useState } from "react";
import { Lock, Unlock } from "lucide-react"

import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [showKey, setShowKey] = useState(true);
  const [activeTab, setActiveTab] = useState("encrypt");
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-full max-w-2xl space-y-6">
        <Card>
          <CardHeader className="border-b border-zinc-800">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="bg-zinc-950 grid-cols-2">
                <TabsTrigger value="encrypt" className="gap-2 data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-900">
                  <Lock className="h-4 w-4" />
                  Encrypt
                </TabsTrigger>
                <TabsTrigger value="decrypt" className="gap-2 data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-900">
                  <Unlock className="h-4 w-4" />
                  Decrypt
                </TabsTrigger>
              </TabsList>
              <TabsContent value={"encrypt"}>
              </TabsContent>
              <TabsContent value={"decrypt"}>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
