export async function POST(request) {
  try {
    const { imageBase64, apiUrl, prompt } = await request.json();

    if (!imageBase64) {
      return Response.json({ error: 'No image provided' }, { status: 400 });
    }

    if (!apiUrl) {
      return Response.json({ error: 'No API URL provided' }, { status: 400 });
    }

    // Default prompt if not provided
    const defaultPrompt = `You are an expert waste classification system. Your task is to analyze the provided image and identify the material of each distinct garbage item or its primary parts based on the rules and choices below.

**Rules:**
1.  Identify each distinct item or a significant part of an item (e.g., 'bottle', 'cap', 'box', 'label').
2.  For each part, choose the most accurate material from the choices. You must prioritize the specific materials ($A$ through $E$).
3.  The choice $F$: Trash should **only** be used for items that cannot be identified as materials $A, B, C, D,$ or $E$. This includes things like food waste, heavily soiled items, or complex composite materials.
4.  If the image contains no garbage items at all, the part_name should be "none" and the answer must be $G$.

**Choices:**
A: Cardboard
B: Glass
C: Metal
D: Paper
E: Plastic
F: Trash
G: None

Based on the image and the rules above, provide your answer strictly in the following JSON format. Do not write any other text, explanations, or code formatting before or after the JSON object.

{"material":[{"part_name":"<part_name>","answer":"<answer>"},{"part_name":"<part_name>","answer":"<answer>"}]}`;

    const requestPayload = {
      prompt: prompt || defaultPrompt,
      imageBase64: imageBase64
    };

    // Send request to local API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ 
        error: 'Local API request failed',
        status: response.status,
        details: errorText
      }, { status: response.status });
    }

    const result = await response.json();
    return Response.json(result);

  } catch (error) {
    console.error('Error in local classify API:', error);
    return Response.json({ 
      error: 'Failed to classify image with local API',
      details: error.message 
    }, { status: 500 });
  }
} 