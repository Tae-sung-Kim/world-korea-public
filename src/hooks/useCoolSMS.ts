import axios from 'axios';
import { useState } from 'react';

interface SMSResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const useCoolSMS = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<SMSResponse | null>(null);

  const sendSMS = async (to: string, text: string) => {
    setLoading(true);
    setResponse(null);

    try {
      const result = await axios.post('/api/coolsms', { to, text });

      setResponse({
        success: true,
        data: result.data.data,
      });

      return result.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data || error.message || 'Failed to send SMS';

      setResponse({
        success: false,
        error: errorMessage,
      });

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    onSendSMS: sendSMS,
    loading,
    response,
  };
};
