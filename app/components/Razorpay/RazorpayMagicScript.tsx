import {useEffect} from 'react';

export default function RazorpayMagicScript({
  email,
  phone,
  config,
}: {
  email: string;
  phone: string;
  config: any;
}) {
  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://magic-plugins.razorpay.com/shopify/magic-shopify.js';
    script.async = true;
    document.body.appendChild(script);

    // Inject Razorpay config
    const configScript = document.createElement('script');
    configScript.type = 'application/json';
    configScript.id = 'RazorpayMagicCheckoutConfig';
    configScript.textContent = JSON.stringify({
      oneClickCheckoutEnabled: config.oneClickCheckoutEnabled,
      buyNowEnabled: config.buyNowEnabled,
      config: config.config,
      email,
      phone,
    });
    document.body.appendChild(configScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(configScript);
    };
  }, [email, phone, config]);

  return null;
}
