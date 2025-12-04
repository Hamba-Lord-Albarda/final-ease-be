import { logger } from '../../config/logger';

interface FonnteSendResponse {
    status: boolean;
    detail?: string;
    id?: string;
}

export class FonnteService {
    private apiKey: string;
    private baseUrl = 'https://api.fonnte.com';

    constructor() {
        this.apiKey = process.env.FONNTE_API_KEY || '';
        if (!this.apiKey) {
        logger.warn('FONNTE_API_KEY is not set. WhatsApp notifications will be disabled.');
        }
    }

    async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
        if (!this.apiKey) {
        logger.warn('Fonnte API key not configured. Skipping WhatsApp notification.');
        return false;
        }

        // Normalize phone number (convert 08xx to 628xx)
        const normalizedPhone = this.normalizePhoneNumber(phoneNumber);

        try {
        const response = await fetch(`${this.baseUrl}/send`, {
            method: 'POST',
            headers: {
            'Authorization': this.apiKey,
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            target: normalizedPhone,
            message: message,
            countryCode: '62', // Indonesia
            }),
        });

        const result: FonnteSendResponse = await response.json();

        if (result.status) {
            logger.info(`WhatsApp message sent successfully to ${normalizedPhone}`);
            return true;
        } else {
            logger.error(`Failed to send WhatsApp message: ${result.detail}`);
            return false;
        }
        } catch (error) {
        logger.error('Error sending WhatsApp message:', error);
        return false;
        }
    }

    private normalizePhoneNumber(phone: string): string {
        // Remove spaces, dashes, and other characters
        let normalized = phone.replace(/[\s\-\(\)]/g, '');
        
        // Remove leading +
        if (normalized.startsWith('+')) {
        normalized = normalized.substring(1);
        }
        
        // Convert 08xx to 628xx
        if (normalized.startsWith('0')) {
        normalized = '62' + normalized.substring(1);
        }
        
        return normalized;
    }

    async notifyNewSubmission(
        dosenName: string,
        dosenPhone: string,
        studentName: string,
        submissionTitle: string
    ): Promise<boolean> {
        const feUrl = process.env.FE_URL || 'http://localhost:5173';
        const message = `Yth. Bpk/Ibu *${dosenName}*, ada pengajuan dokumen KP baru dari *${studentName}* dengan judul *"${submissionTitle}"*. Mohon dicek di dashboard: *${feUrl}*. Terima kasih.`;
        
        return this.sendMessage(dosenPhone, message);
    }

    async notifyApproved(
        studentName: string,
        studentPhone: string,
        submissionTitle: string
    ): Promise<boolean> {
        const message = `Halo *${studentName}*, dokumen TA kamu dengan judul *"${submissionTitle}"* telah diperiksa oleh Dosen Pembimbing dengan status: *DISETUJUI*. Silakan lanjut ke tahap berikutnya.`;
        
        return this.sendMessage(studentPhone, message);
    }

    async notifyRejected(
        studentName: string,
        studentPhone: string,
        submissionTitle: string,
        reason: string
    ): Promise<boolean> {
        const message = `Halo *${studentName}*, dokumen TA kamu dengan judul *"${submissionTitle}"* telah diperiksa oleh Dosen Pembimbing dengan status: *DITOLAK*. Alasan: *${reason}*. Silakan perbaiki dan submit ulang.`;
        
        return this.sendMessage(studentPhone, message);
    }
}
