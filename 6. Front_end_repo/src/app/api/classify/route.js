import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Server-side only
});

export async function POST(request) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return Response.json({ error: 'No image provided' }, { status: 400 });
    }

    const prompt = `You are an expert waste classification system. Your task is to analyze the provided image and identify the material of each distinct garbage item or its primary parts based on the rules and choices below.

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

{"material":[{"part_name":"<part_name>","answer":"<answer>"},{"part_name":"<part_name>","answer":"<answer>"}]}
`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const result = JSON.parse(content);
      return Response.json(result);
    } else {
      return Response.json({ error: 'No response from OpenAI' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in classify API:', error);
    return Response.json({ 
      error: 'Failed to classify image',
      details: error.message 
    }, { status: 500 });
  }
} 
