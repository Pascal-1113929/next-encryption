"use client"
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Lock,
  Unlock,
  Copy,
  Download,
  Upload,
  Eye,
  EyeOff,
  KeyRound,
  MessageSquareText,
  RefreshCcw,
  FileText,
  BadgeCheck,
} from "lucide-react";
export default function EncryptieUI() {
  const [showPassword, setShowPassword] = useState(false);
  const [showKey, setShowKey] = useState(true);
  const [activeTab, setActiveTab] = useState("encrypt");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3">
            <Lock className="h-7 w-7 text-zinc-100" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Encryptie</h1>
            <p className="text-sm text-zinc-500">
              Symmetric encryption · AES-256 · everything stays in your browser
            </p>
          </div>
        </div>

        {/* Main card */}
        <Card className="border-zinc-800 bg-zinc-900">
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

              {/* ─────────── ENCRYPT TAB ─────────── */}
              <TabsContent value="encrypt" className="space-y-5 mt-4">
                {/* Key row */}
                <div className="space-y-2">
                  <Label htmlFor="enc-key" className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-zinc-400" />
                    Key
                    <span className="ml-auto text-xs font-normal text-zinc-500 flex items-center gap-1.5">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      random · 256-bit · generated on load
                    </span>
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="enc-key"
                        readOnly
                        value="a3f8c2e1b4d74f9e0c...88912b0d"
                        className="pr-10 bg-zinc-950 border-zinc-800 font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200"
                      >
                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <Button
                      variant="secondary"
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 shrink-0"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-xs text-zinc-500">
                    This key is required to decrypt. It is included in the exported file.
                  </p>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="enc-text" className="flex items-center gap-2">
                    <MessageSquareText className="h-4 w-4 text-zinc-400" />
                    Message
                  </Label>
                  <Textarea
                    id="enc-text"
                    rows={5}
                    placeholder="Type the text you want to encrypt..."
                    className="bg-zinc-950 border-zinc-800 resize-y"
                  />
                </div>

                <Button className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-medium gap-2">
                  <Lock className="h-4 w-4" />
                  Encrypt
                </Button>

                {/* Output */}
                <div className="space-y-2 pt-1">
                  <Label className="flex items-center justify-between">
                    <span>Ciphertext</span>
                    <span className="text-xs font-normal text-zinc-500">AES-256-CBC · PKCS#7</span>
                  </Label>
                  <div className="relative">
                    <Textarea
                      rows={3}
                      readOnly
                      placeholder="The encrypted result appears here (base64)..."
                      className="bg-zinc-950 border-zinc-800 font-mono text-xs"
                    />
                    <div className="absolute right-2 bottom-2 flex gap-1.5">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 h-8 w-8"
                        title="Copy ciphertext"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 h-8 w-8"
                        title="Download .txt file"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Send the .txt file through any channel you like. Whoever holds the file can open it.
                  </p>
                </div>
              </TabsContent>

              {/* ─────────── DECRYPT TAB ─────────── */}
              <TabsContent value="decrypt" className="space-y-5 mt-4">
                {/* Upload or paste */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-zinc-400" />
                    Encrypted file
                  </Label>
                  <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950/50 p-6 text-center">
                    <Upload className="h-6 w-6 text-zinc-500 mx-auto mb-2" />
                    <p className="text-sm text-zinc-400 mb-3">
                      Drop a <span className="font-mono text-xs">.txt</span> file here, or
                    </p>
                    <Button
                      variant="outline"
                      className="border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Choose file
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-zinc-800" />
                  <span className="text-xs uppercase tracking-widest text-zinc-600">or paste</span>
                  <div className="h-px flex-1 bg-zinc-800" />
                </div>

                {/* Paste area */}
                <div className="space-y-2">
                  <Label htmlFor="dec-paste">Pasted file content</Label>
                  <Textarea
                    id="dec-paste"
                    rows={5}
                    placeholder={"key: a3f8c2e1...\niv: 7e2f90ab...\nciphertext: U2FsdGVk..."}
                    className="bg-zinc-950 border-zinc-800 font-mono text-xs resize-y"
                  />
                </div>

                <Button className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-medium gap-2">
                  <Unlock className="h-4 w-4" />
                  Decrypt
                </Button>

                {/* Result */}
                <div className="space-y-2 pt-1">
                  <Label className="flex items-center justify-between">
                    <span>Original message</span>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-zinc-400 hover:text-zinc-100" title="Copy">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </Label>
                  <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950/50 p-4 text-sm text-zinc-500 italic text-center">
                    The decrypted message appears here...
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>

        {/* Footer info strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-xs">
            <p className="font-semibold text-zinc-200 mb-1">Algorithm</p>
            <p className="text-zinc-500">AES-256, CBC mode, PKCS#7 padding</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-xs">
            <p className="font-semibold text-zinc-200 mb-1">Key management</p>
            <p className="text-zinc-500">Random 256-bit key, shared via .txt export</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-xs">
            <p className="font-semibold text-zinc-200 mb-1">Privacy</p>
            <p className="text-zinc-500">Runs locally in your browser, nothing is uploaded</p>
          </div>
        </div>
      </div>
    </div>
  );
}
