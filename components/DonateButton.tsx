"use client";

import { useState } from "react";
import { Heart, Copy, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { EthereumIcon, UsdtIcon, PayPalIcon } from "./icons/CryptoIcons";
import { useDonateDialog } from "./DonateDialogContext";

// Payment options configuration - replace with real addresses later
const PAYPAL_LINK = "https://paypal.me/ILWYennefer";

const CRYPTO_OPTIONS = {
  ethereum: {
    name: "ETH (ERC20)",
    icon: EthereumIcon,
    address: "0x4de6fa92ee3bb047a20a08076af4838930ffc721",
  },
  usdt: {
    name: "USDT (TRC20)",
    icon: UsdtIcon,
    address: "THbGmzaRz9VpQSiUvsDdGR9MpPrwjqBzTr",
  },
};

function CryptoOption({ name, address }: { name: string; address: string }) {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success(`${name} address copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      {/* QR Code - Generated client-side, instant rendering */}
      <div className="bg-white p-3 rounded-lg">
        <QRCodeSVG value={address} size={180} level="M" />
      </div>

      {/* Address with copy button */}
      <div className="w-full">
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
          <code className="flex-1 text-xs break-all text-center">
            {address}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={copyAddress}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DonateButton() {
  const { isOpen, setIsOpen } = useDonateDialog();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text-muted-foreground text-xs md:text-sm py-0 h-fit gap-1 transition-colors hover:text-foreground"
        >
          <Heart className="h-3 w-3" />
          Support Us
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Support MediaFlix
          </DialogTitle>
          <DialogDescription>
            Your support keeps MediaFlix running and ad-free. Every contribution
            helps!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* PayPal - Primary Option */}
          <Button asChild variant="outline" className="w-full gap-2">
            <a href={PAYPAL_LINK} target="_blank" rel="noopener noreferrer">
              <PayPalIcon className="h-5 w-5" />
              Donate with PayPal
            </a>
          </Button>

          {/* Divider */}
          <div className="relative">
            <Separator className="bg-border/80" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground flex items-center gap-1">
              or via crypto
            </span>
          </div>

          {/* Crypto Options */}
          <Tabs defaultValue="ethereum" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ethereum" className="text-xs gap-1.5">
                <CRYPTO_OPTIONS.ethereum.icon className="h-4 w-4" />
                {CRYPTO_OPTIONS.ethereum.name}
              </TabsTrigger>
              <TabsTrigger value="usdt" className="text-xs gap-1.5">
                <CRYPTO_OPTIONS.usdt.icon className="h-4 w-4" />
                {CRYPTO_OPTIONS.usdt.name}
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="ethereum"
              forceMount
              className="data-[state=inactive]:hidden"
            >
              <CryptoOption
                name={CRYPTO_OPTIONS.ethereum.name}
                address={CRYPTO_OPTIONS.ethereum.address}
              />
            </TabsContent>

            <TabsContent
              value="usdt"
              forceMount
              className="data-[state=inactive]:hidden"
            >
              <CryptoOption
                name={CRYPTO_OPTIONS.usdt.name}
                address={CRYPTO_OPTIONS.usdt.address}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
