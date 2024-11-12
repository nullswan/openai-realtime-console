import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

const suggestionsPrompt = `Provide a list of subject recommendations tailored to the user based on the information provided.

Use the details I provide about each user to generate an array of subjects that best fit their preferences, needs, or context. 

# Steps

1. **Analyze User Information**: Carefully read the user's information to understand their preferences, interests, or any provided context.
2. **Identify Key Interests**: Extract information about hobbies, professions, aspirations, preferred topics, or other relevant details.
3. **Generate Tailored Subjects**: Based on these interests, generate topics or subjects that align with the user's preferences or needs.
4. **Ensure Relevance and Personalization**: All subjects suggested should directly connect to the user's profile in a meaningful way.

# Output Format

- The output must be a JSON array of strings named "subjects". 
- Each element in the array should be a unique subject suggestion.
  
Example:

\`\`\`json
{
  "subjects": [
    "Introduction to Python Programming",
    "Guitar Techniques for Beginners",
    "Eco-Friendly Gardening Tips",
    "Data Analysis with R"
  ]
}
\`\`\`

# Notes

- Ensure subjects are diverse but relevant to avoid repetition.
- If user information is sparse, generate generalized subjects that are suited to a wide audience.
- Aim to include a minimum of 3 and a maximum of 6 subjects based on the given information. 
- Use placeholders or examples where appropriate to illustrate more complex outputs.
`

const TEMPERATURE = 1.0;
const TOP_P = 1.0;
let last_call = new Date();
let isFirstCall = true;

interface Suggestion {
  subject: string;
}

interface SuggestionsResponse {
  subjects: string[];
}

const suggestionsSchema = z.object({
  subjects: z.array(z.string())
});

export async function getSuggestions(
  apiKey: string, 
  informations: string[], 
  setResponse: (response: Suggestion[]) => void
): Promise<Suggestion[]> {
    const perf = performance.now();
    if (!isFirstCall && new Date().getTime() - last_call.getTime() < 100) {
      throw new Error('Please wait a few seconds before making another informations');
    }
    isFirstCall = false;
    last_call = new Date();
  
    const client = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });
    console.log("getSuggestions", informations);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: suggestionsPrompt },
        { role: "user", content: informations.join('\n') }
      ],
      response_format: zodResponseFormat(suggestionsSchema, "suggestions"),
      temperature: TEMPERATURE,
      top_p: TOP_P,
    });

    const parsedResponse = JSON.parse(response.choices[0].message.content || '{}') as SuggestionsResponse;

    return parsedResponse.subjects.map((subject) => ({ subject }));
}
