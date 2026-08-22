import { useCallback, useRef, useState } from 'react';
import {
    createOrder,
    verifyPayment,
    type CreateOrderPayload,
    type VerifyPaymentResponse,
} from '../services/donationService';




interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image?: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill?: { name?: string; email?: string };
    theme?: { color: string };
    modal?: { ondismiss: () => void };
}

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface RazorpayInstance {
    open: () => void;
    on: (event: string, callback: () => void) => void;
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}




type PaymentStatus = 'idle' | 'loading' | 'success' | 'failed';

interface UseRazorpayReturn {
    status: PaymentStatus;
    error: string | null;
    successData: VerifyPaymentResponse | null;
    initiate: (payload: CreateOrderPayload) => Promise<void>;
    reset: () => void;
}




let sdkPromise: Promise<void> | null = null;

function loadRazorpaySDK(): Promise<void> {
    if (sdkPromise) return sdkPromise;

    sdkPromise = new Promise((resolve, reject) => {
        if (typeof window.Razorpay !== 'undefined') {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => {
            sdkPromise = null;
            reject(new Error('Failed to load Razorpay SDK'));
        };
        document.body.appendChild(script);
    });

    return sdkPromise;
}




export function useRazorpay(): UseRazorpayReturn {
    const [status, setStatus] = useState<PaymentStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<VerifyPaymentResponse | null>(null);
    const busyRef = useRef(false);

    const reset = useCallback(() => {
        setStatus('idle');
        setError(null);
        setSuccessData(null);
        busyRef.current = false;
    }, []);

    const initiate = useCallback(async (payload: CreateOrderPayload) => {
        if (busyRef.current) return;
        busyRef.current = true;

        setStatus('loading');
        setError(null);
        setSuccessData(null);

        try {
            
            await loadRazorpaySDK();

            
            const order = await createOrder(payload);

            
            await new Promise<void>((resolve, reject) => {
                const options: RazorpayOptions = {
                    key: order.key_id,
                    amount: order.amount,
                    currency: order.currency,
                    name: 'SAHIL',
                    description: 'Support Me ☕',
                    image: '/download.png',
                    order_id: order.order_id,
                    handler: async (response: RazorpayResponse) => {
                        try {
                            
                            const result = await verifyPayment({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            });
                            setSuccessData(result);
                            setStatus('success');
                            resolve();
                        } catch (err) {
                            setError(err instanceof Error ? err.message : 'Verification failed.');
                            setStatus('failed');
                            reject(err);
                        }
                    },
                    prefill: {
                        name: payload.name || '',
                        email: payload.email || '',
                    },
                    theme: { color: '#3b5bdb' },
                    modal: {
                        ondismiss: () => {
                            setStatus('idle');
                            busyRef.current = false;
                            resolve();
                        },
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', () => {
                    setError('Payment failed. Please try again.');
                    setStatus('failed');
                    reject(new Error('Payment failed'));
                });
                rzp.open();
            });
        } catch (err) {
            if (status !== 'failed') {
                setError(err instanceof Error ? err.message : 'Something went wrong.');
                setStatus('failed');
            }
        } finally {
            busyRef.current = false;
        }
    }, [status]);

    return { status, error, successData, initiate, reset };
}
