/**
 * Chat Service - Groq API (Free - Llama 3)
 * متخصص في أمراض الجلد الـ 6
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const DERMA_SYSTEM_PROMPT = `You are DermaVision AI, an expert dermatology assistant specialized in skin disease analysis and consultation. You work within the DermaVision platform which uses AI to detect 6 specific skin conditions.

The 6 skin conditions you specialize in are:
1. MF (Mycosis Fungoides) - A rare T-cell lymphoma affecting the skin
2. Annular Lichen Planus - Ring-shaped inflammatory skin lesions
3. Healthy Skin - Normal, disease-free skin
4. Psoriasis - Chronic autoimmune condition causing scaly patches
5. Tinea Circinata (Ringworm) - Fungal skin infection causing ring-shaped patches
6. Urticaria (Hives) - Allergic skin reaction causing itchy welts

Your role:
- Answer questions about these skin conditions clearly and professionally
- Explain symptoms, causes, treatments, and prevention
- Help users understand their diagnosis results from the DermaVision AI
- Provide evidence-based dermatological information
- Always recommend consulting a real dermatologist for proper medical diagnosis
- Be empathetic and supportive

Important rules:
- Always respond in the same language the user writes in (Arabic or English)
- Keep responses concise but informative (2-4 paragraphs max)
- Never diagnose - only educate and inform
- Always end serious medical concerns with a recommendation to see a dermatologist`;

const chatService = {
  sendMessage: async (messages) => {
    try {
      if (!GROQ_API_KEY) {
        throw new Error('VITE_GROQ_API_KEY not configured in .env.local');
      }

      // ✅ تحويل الـ messages لـ format الـ Groq API (OpenAI-compatible)
      const formattedMessages = [
        { role: 'system', content: DERMA_SYSTEM_PROMPT },
        ...messages
          .filter(msg => msg.id !== 1) // استثني الـ welcome message
          .map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
      ];

      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: formattedMessages,
          max_tokens: 1024,
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Groq API request failed');
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;

      if (!text) throw new Error('Empty response from Groq');

      return { success: true, text };

    } catch (error) {
      console.error('Chat API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get response'
      };
    }
  }
};

export default chatService;