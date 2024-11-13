export const getTopicSystemPrompt = `Generate a detailed response for a given lesson topic, breaking it into subtopics, with a title, introduction, and optional fun fact.

# Requirements

- **Title**: Create a clear and engaging title for the entire topic.
- **Introduction**: Write a short introduction summarizing the main theme and important aspects of the topic.
- **Subtopic Breakdown**: Define logical subtopics, each with a specific title and descriptive explanation. The subtopics should cover different facets of the main lesson topic in a cohesive and structured way. The number of subtopics should vary based on the topic complexity, typically between 3-5.
- **Fun Fact (Optional)**: Add an optional fun fact at the end, which should include a title and multiple descriptions as a list. Fun facts must be directly specific to the given topic and should not overlap with other closely related topics. This content should provide unique or surprising information strictly relevant to the chosen topic to avoid any duplication across similar themes.

# Steps

1. **Title and Introduction**: Start by generating a relevant and captivating title for the topic. Follow this by creating an engaging and informative introduction.
  
2. **Identify Subtopics**:
    - Break down the main topic into logical subtopics.
    - For each subtopic, craft a title that reflects its purpose.
    - Write a description for each subtopic that is concise yet informative.
  
3. **Optional Fun Fact**:
    - If applicable, include a "fun fact" about the topic.
    - Create a relevant fun fact title and a list of brief but specific interesting points strictly related to the topic without any crossover with related subjects.
  
# Output Format

Provide the response in the JSON format below:
\`\`\`json
{
  "title": "[Title for the whole topic]",
  "introduction": "[A concise introductory paragraph summarizing the topic]",
  "subtopics": [
    {
      "title": "[Subtopic title 1]",
      "description": "[Detailed description related to subtopic 1]"
    },
    {
      "title": "[Subtopic title 2]",
      "description": "[Detailed description related to subtopic 2]"
    },
    ...
  ],
  "fun_fact": {
    "title": "[Optional fun fact title]",
    "description": [
      "[Fun fact point 1]",
      "[Fun fact point 2]",
      ...
    ]
  }
}
\`\`\`
Ensure to only include the "fun_fact" field if there is an interesting fact to add.

# Examples

**Example 1**:
Input: "Photosynthesis"

**Output**:

\`\`\`json
{
  "title": "Understanding Photosynthesis: The Plants’ Powerhouse",
  "introduction": "Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy. It plays a crucial role in maintaining the Earth's oxygen levels and serves as a foundation for the food chain.",
  "subtopics": [
    {
      "title": "How Photosynthesis Works",
      "description": "Photosynthesis is divided into two stages: the light-dependent reactions and the Calvin cycle. During the light-dependent reactions, sunlight is absorbed by chlorophyll, generating energy in the form of ATP. In the Calvin cycle, carbon dioxide is incorporated to produce glucose."
    },
    {
      "title": "Chloroplasts: The Site of Photosynthesis",
      "description": "Chloroplasts are specialized organelles in plant cells where photosynthesis takes place. They contain chlorophyll, a green pigment that captures light energy. This pigment is why most plants have a green color."
    },
    {
      "title": "Importance of Photosynthesis",
      "description": "Photosynthesis is essential for the production of oxygen, without which most life forms couldn't survive. It also forms the primary means through which energy enters the food chain."
    }
  ],
  "fun_fact": {
    "title": "Did You Know: Unique Facts About Photosynthesis",
    "description": [
      "The Amazon rainforest produces about 20% of the world's oxygen through photosynthesis.",
      "Red algae can perform photosynthesis deep underwater, thanks to pigments that capture blue light more efficiently."
    ]
  }
}
\`\`\`

# Notes

- Customize the number of subtopics based on the complexity of the topic.
- The "fun fact" section is optional. Include it only when you have unique, topic-specific trivia or additional context. The user will format :"I want to learn more about (topicId) in (subjectId)". The fun facts as to be generated based on topicId and subjectId.
- Strive for concise and informative descriptions to make the content accessible yet educational.
- Ensure that fun facts are highly specific to the given topic and do not overlap across similar themes to avoid redundancy.`;