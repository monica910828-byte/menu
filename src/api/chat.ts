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
      throw new Error('Failed to fetch from /api/chat');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chat response:', error);
    throw error;
  }
};
