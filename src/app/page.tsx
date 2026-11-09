"use client"

import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Eye, EyeOff, KeyRound, Lock, RefreshCcw, Unlock, MessageSquareText, Copy, Download, Upload } from "lucide-react"

import { buildFile, decodeFileText, decrypt, encrypt, generateKey } from "@/lib/crypto"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Dropzone from "@/components/dropzone";

export default function Home() {
  const [showKey, setShowKey] = useState(false);
  const [key, setKey] = useState<string>(() => generateKey());
  const [plainText, setPlainText] = useState("")
  const [cipherText, setCipherText] = useState("")
  const [iv, setIv] = useState("");
  const [decryptKey, setDecryptKey] = useState<string>("");
  const [decryptIv, setDecryptIv] = useState("")
  const [textToDecrypt, setTextToDecrypt] = useState("")
  const [decryptedText, setDecryptedText] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyRegen = () => {
    const generatedKey = generateKey();
    setKey(generatedKey)
    setShowKey(false)
    toast.success("Key generated successfully!")
  }

  const handleCopy = async (textToCopy: string, type: "key" | "ciphertext" | "text" | "iv" | "decryptedtext" | "texttodecrypt") => {
    try {
      // Copy text to clipboard
      await navigator.clipboard.writeText(textToCopy);
      toast.success(`Copied ${type} to clipboard!`);
    } catch (err) {
      console.error("Failed to copy text:", err);
      toast.error(`Failed to copy ${type}. Please try again.`);
    }
  };

  const handleEncrypt = () => {
    if (!plainText.trim()) {
      toast.error("Type a message first");
      return;
    }

    const result = encrypt(plainText, key);
    setCipherText(result.ciphertext);
    setIv(result.ivHex);
    toast.success("Encrypted successfully");
  };

  const fileTimestamp = () => {
    const timestamp = new Date()
    const pad = (n: number) => n.toString().padStart(2, "0");

    return (
      `${timestamp.getFullYear()}-${pad(timestamp.getMonth() + 1)}-${pad(timestamp.getDate())}` +
      `_${pad(timestamp.getHours())}-${pad(timestamp.getMinutes())}-${pad(timestamp.getSeconds())}`
    );
  }

  const handleDownload = () => {
    if (!cipherText.trim()) {
      toast.error("Encrypt a message first");
      return;
    }
    const content = buildFile(key, iv, cipherText);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = `encrypted_${fileTimestamp()}.txt`
    a.download = filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Downloading ${filename}`);
  }

  const handleFileDrop = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      const text = String(reader.result ?? "");

      try {
        const parsed = decodeFileText(text);

        setDecryptKey(parsed.keyHex);
        setDecryptIv(parsed.ivHex);
        setTextToDecrypt(parsed.ciphertext);
        setDecryptedText("");

        toast.success("Encrypted file loaded");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not read encrypted file");
      }
    };

    reader.onerror = () => {
      toast.error("Could not read file");
    };

    reader.readAsText(file);
  };

  const handleDecrypt = () => {
    const keyHex = decryptKey.trim();
    const ivHex = decryptIv.trim();
    const ciphertext = textToDecrypt.trim();

    if (!keyHex || !ivHex || !ciphertext) {
      toast.error("Key, IV and encrypted text are all required");
      return;
    }

    try {
      const plain = decrypt(ciphertext, keyHex, ivHex);

      if (!plain) {
        throw new Error("Decryption produced no readable text");
      }

      setDecryptedText(plain);
      toast.success("Decrypted successfully");
    } catch (err) {
      setDecryptedText("");
      toast.error(err instanceof Error ? err.message : "Decryption failed");
    }
  };

  return (
    <div>
      <div className=" w-[70vw] min-h-[90vh] mx-auto mt-10 bg-zinc-900/50 pb-[2vh] rounded-md ">
        <Tabs className="w-full mx-auto" defaultValue="all">
          <TabsList className="w-full">
            <TabsTrigger value="encrypt" className="">
              <Lock className="h-4 w-4" />
              Encrypt
            </TabsTrigger>
            <TabsTrigger value="decrypt" className="">
              <Unlock className="h-4 w-4" />
              Decrypt
            </TabsTrigger>
          </TabsList>
          <TabsContent value={"encrypt"}>
            <h1 className="text-xl text-center">Encrypt</h1>
            {/* Input */}

            <section className="w-[50vw] mx-auto">
              <h2 className="text-lg">Input</h2>
              {/* Key */}
              <div className="space-y-2 mt-3">
                <div className="">
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
                        value={showKey ? key : "•".repeat(key.length)}
                        className="pr-10 bg-zinc-950 border-zinc-800 font-mono text-xs"
                      />
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <button
                              type="button"
                              onClick={() => setShowKey(!showKey)}
                              className="absolute right-10 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200"
                            >
                              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          }
                        />
                        <TooltipContent side="top">
                          {showKey ? "Hide key" : "Show key"}
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <button
                              type="button"
                              onClick={() => handleCopy(key, "key")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          }
                        />
                        <TooltipContent side="top">
                          Copy key
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Button
                      variant="secondary"
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 shrink-0"
                      onClick={() => handleKeyRegen()}
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-xs text-zinc-500">
                    This key is required to decrypt. It is included in the exported file.
                  </p>
                </div>
              </div>
              {/* Text Input */}
              <div className="space-y-2 mt-5">
                <div className="w-[50vw] mx-auto space-y-2">
                  <Label htmlFor="enc-text" className="flex items-center gap-2">
                    <MessageSquareText className="h-4 w-4 text-zinc-400" />
                    Message
                  </Label>
                  <Textarea
                    id="enc-text"
                    rows={5}
                    value={plainText}
                    onChange={(e) => setPlainText(e.target.value)}
                    placeholder="Type the text you want to encrypt..."
                    className="bg-zinc-950 border-zinc-800 resize-y"
                  />

                  <Button
                    className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-medium gap-2"
                    onClick={handleEncrypt}
                  >
                    <Lock className="h-4 w-4" />
                    Encrypt
                  </Button>
                </div>
              </div>
            </section>

            {/* Output */}
            <section className="w-[50vw] mx-auto mt-10">
              <h2 className="text-lg">Output</h2>
              <div className="space-y-2 mt-5">
                <div className="w-[50vw] mx-auto space-y-2">
                  <Label className="flex items-center justify-between">
                    <span>Ciphertext</span>
                    <span className="text-xs font-normal text-zinc-500">AES-256 Encrypted</span>
                  </Label>
                  <div className="relative">
                    <Textarea
                      rows={3}
                      readOnly
                      value={cipherText}
                      placeholder="The encrypted result appears here (base64)..."
                      className="bg-zinc-950 border-zinc-800 font-mono text-xs"
                    />
                    <div className="absolute right-2 bottom-2 flex gap-1.5">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 h-8 w-8"
                        title="Copy ciphertext"
                        onClick={() => handleCopy(cipherText, "ciphertext")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={handleDownload}
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 h-8 w-8"
                        title="Download .txt file"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {iv && (
                    <div className="space-y-1.5">
                      <Label className="flex items-center justify-between">
                        <span>IV</span>
                        <span className="text-xs font-normal text-zinc-500">auto-generated per message</span>
                      </Label>
                      <div className="relative">
                        <Input
                          readOnly
                          value={iv}
                          className="pr-10 bg-zinc-950 border-zinc-800 font-mono text-xs h-8"
                        />
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <button
                                type="button"
                                onClick={() => handleCopy(iv, "iv")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            }
                          />
                          <TooltipContent side="top">Copy IV</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-zinc-600">
                    Send the .txt file through any channel you like. Whoever holds the file can open it.
                  </p>
                </div>
              </div>
            </section>

          </TabsContent>
          <TabsContent value={"decrypt"}>
            <h1 className="text-xl text-center">Decrypt</h1>
            {/* Input */}

            <section className="w-[50vw] mx-auto">
              <h2 className="text-lg">Input</h2>
              {/* File Upload */}
              <Dropzone accept={["text/plain"]} onDrop={handleFileDrop} className="w-full rounded-lg border-2 border-dashed border-zinc-700 hover:border-zinc-500 p-8 cursor-pointer transition-colors">
                <Upload className="h-8 w-8 text-zinc-500 mx-auto mb-3" />
                <p className="text-sm text-zinc-400 mb-4 text-center">
                  Drop a <span className="font-mono text-xs text-zinc-300">.txt</span> file here that has encrypted text from this app or browse for one from your device.
                </p>
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    Browse
                  </Button>
                </div>
              </Dropzone>
              {/* Key */}
              <div className="space-y-2 mt-3">
                <div className="">
                  <Label htmlFor="dec-key" className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-zinc-400" />
                    Key
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="dec-key"
                        value={decryptKey}
                        onChange={(e) => setDecryptKey(e.target.value)}
                        className="pr-10 bg-zinc-950 border-zinc-800 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* IV */}
              <div className="space-y-2 mt-3">
                <div className="">
                  <Label htmlFor="dec-iv" className="flex items-center gap-2">
                    IV
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="dec-iv"
                        value={decryptIv}
                        onChange={(e) => setDecryptIv(e.target.value)}
                        className="pr-10 bg-zinc-950 border-zinc-800 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Text Input */}
              <div className="space-y-2 mt-5">
                <div className="w-[50vw] mx-auto space-y-2">
                  <Label htmlFor="dec-text" className="flex items-center gap-2">
                    <MessageSquareText className="h-4 w-4 text-zinc-400" />
                    Encrypted text
                  </Label>
                  <Textarea
                    id="dec-text"
                    rows={5}
                    value={textToDecrypt}
                    onChange={(e) => setTextToDecrypt(e.target.value)}
                    placeholder="Type the text you want to encrypt..."
                    className="bg-zinc-950 border-zinc-800 resize-y"
                  />

                  <Button
                    className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-medium gap-2"
                    onClick={handleDecrypt}
                  >
                    <Lock className="h-4 w-4" />
                    Decrypt
                  </Button>
                </div>
              </div>
            </section>
            {/* Output */}
            <section className="w-[50vw] mx-auto mt-10">
              <h2 className="text-lg">Output</h2>
              <div className="space-y-2 mt-5">
                <div className="w-[50vw] mx-auto space-y-2">
                  <Label className="flex items-center justify-between">
                    <span>Decrypted Text</span>
                  </Label>
                  <div className="relative">
                    <Textarea
                      rows={3}
                      readOnly
                      value={decryptedText}
                      placeholder="The decrypted result appears here..."
                      className="bg-zinc-950 border-zinc-800 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
      {/* Hidden file browse */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,text/plain"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileDrop(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
