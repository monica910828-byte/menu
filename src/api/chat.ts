console.log(process.env.OPENAI_API_KEY);

export const fetchChatResponse = async (messages: { role: string; content: string }[]) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch from /api/chat';
      try {
        const errData = await response.json();
        if (errData.error) errorMessage = errData.error;
      } catch (e) {
        // ignore JSON parse error
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chat response:', error);
    throw error;
  }
};
