import { API_URL } from '../config/api';




export interface CreateOrderPayload {
    amount: number;
    name?: string;
    email?: string;
    message?: string;
}

export interface CreateOrderResponse {
    order_id: string;
    amount: number;
    currency: string;
    key_id: string;
}

export interface VerifyPaymentPayload {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface VerifyPaymentResponse {
    id: string;
    amount: number;
    name: string;
}

export interface DonationStats {
    total: number;
    count: number;
}

export interface Supporter {
    _id: string;
    name: string;
    amount: number;
    createdAt: string;
}

interface ApiResponse<T> {
    status: 'success' | 'error';
    message?: string;
    data: T;
}




async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    const json: ApiResponse<T> = await res.json();

    if (!res.ok || json.status === 'error') {
        throw new Error(json.message || 'Something went wrong.');
    }

    return json.data;
}




export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    return request<CreateOrderResponse>(`${API_URL}/donate/create-order`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function verifyPayment(payload: VerifyPaymentPayload): Promise<VerifyPaymentResponse> {
    return request<VerifyPaymentResponse>(`${API_URL}/donate/verify`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function getDonationTotal(): Promise<DonationStats> {
    return request<DonationStats>(`${API_URL}/donate/total`);
}

export async function getRecentSupporters(): Promise<Supporter[]> {
    return request<Supporter[]>(`${API_URL}/donate/recent`);
}
