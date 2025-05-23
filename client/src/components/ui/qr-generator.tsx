import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Download, Share, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRGeneratorProps {
  defaultText?: string;
  title?: string;
  className?: string;
}

export function QRGenerator({ defaultText = '', title = 'QR Code Generator', className = '' }: QRGeneratorProps) {
  const [text, setText] = useState(defaultText);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateQR = async (inputText: string) => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    try {
      const dataUrl = await QRCode.toDataURL(inputText, {
        width: 256,
        margin: 2,
        color: {
          dark: '#2c3e50',
          light: '#ffffff'
        }
      });
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (text.trim()) {
      generateQR(text);
    }
  }, [text]);

  const downloadQR = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = qrDataUrl;
    link.click();
    
    toast({
      title: "Success",
      description: "QR code downloaded successfully",
    });
  };

  const copyToClipboard = async () => {
    if (!text.trim()) return;
    
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive"
      });
    }
  };

  const shareQR = async () => {
    if (!text.trim()) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QR Code',
          text: text
        });
      } catch (error) {
        // User cancelled or share failed, copy to clipboard instead
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="qr-input">Enter text, URL, or contact info:</Label>
          <Input
            id="qr-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://yourwebsite.com or contact information"
            className="w-full"
          />
        </div>

        {qrDataUrl && (
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <img 
                src={qrDataUrl} 
                alt="Generated QR Code" 
                className="w-64 h-64"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap justify-center">
              <Button onClick={downloadQR} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={shareQR} variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy Text
              </Button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="text-center text-gray-500">
            Generating QR code...
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Preset QR code generators for common use cases
export function ContactQRGenerator() {
  const contactInfo = `BEGIN:VCARD
VERSION:3.0
FN:Farsensor
ORG:Farsensor - TPMS Sensors
TEL:+7 (705) 444-04-40
EMAIL:info@farsensor.kz
ADR:;;Yassaui St 195a ("Nash servis" service station);Almaty;;;Kazakhstan
URL:${window.location.origin}
END:VCARD`;

  return (
    <QRGenerator
      defaultText={contactInfo}
      title="Contact QR Code"
    />
  );
}

export function WebsiteQRGenerator({ url = window.location.origin }: { url?: string }) {
  return (
    <QRGenerator
      defaultText={url}
      title="Website QR Code"
    />
  );
}