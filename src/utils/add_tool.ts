import { RealtimeClient } from '@openai/realtime-api-beta';

interface MemoryKvSetter {
  (memoryKv: { [key: string]: any }): void;
}

interface MarkerSetter {
  (marker: Coordinates | null): void;
}

interface CoordsSetter {
  (coords: Coordinates | null): void;
}

interface Coordinates {
  lat: number;
  lng: number;
  location?: string;
  temperature?: {
    value: number;
    units: string;
  };
  wind_speed?: {
    value: number;
    units: string;
  };
}

export const setupTools = (
  client: RealtimeClient,
  setMemoryKv: MemoryKvSetter,
  setMarker: MarkerSetter,
  setCoords: CoordsSetter
) => {
  // Add set_memory tool
//   client.addTool(
//     {
//       name: 'set_memory',
//       description: 'Saves important data about the user into memory.',
//       parameters: {
//         type: 'object',
//         properties: {
//           key: {
//             type: 'string',
//             description:
//               'The key of the memory value. Always use lowercase and underscores, no other characters.',
//           },
//           value: {
//             type: 'string',
//             description: 'Value can be anything represented as a string',
//           },
//         },
//         required: ['key', 'value'],
//       },
//     },
//     async ({ key, value }: { [key: string]: any }) => {
//       setMemoryKv((memoryKv: { [key: string]: any }) => {
//         const newKv = { ...memoryKv };
//         newKv[key] = value;
//         return newKv;
//       });
//       return { ok: true };
//     }
//   );

  // Add get_weather tool
  client.addTool(
    {
      name: 'get_weather',
      description:
        'Retrieves the weather for a given lat, lng coordinate pair. Specify a label for the location.',
      parameters: {
        type: 'object',
        properties: {
          lat: {
            type: 'number',
            description: 'Latitude',
          },
          lng: {
            type: 'number',
            description: 'Longitude',
          },
          location: {
            type: 'string',
            description: 'Name of the location',
          },
        },
        required: ['lat', 'lng', 'location'],
      },
    },
    async ({ lat, lng, location }: { [key: string]: any }) => {
      setMarker({ lat, lng, location });
      setCoords({ lat, lng, location });
      const result = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m`
      );
      const json = await result.json();
      const temperature = {
        value: json.current.temperature_2m as number,
        units: json.current_units.temperature_2m as string,
      };
      const wind_speed = {
        value: json.current.wind_speed_10m as number,
        units: json.current_units.wind_speed_10m as string,
      };
      setMarker({ lat, lng, location, temperature, wind_speed });
      return json;
    }
  );

  // Add track_learning tool
  client.addTool(
    {
      name: 'track_learning',
      description: 'Records key learning points or insights from the conversation.',
      parameters: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            description: 'The main subject or category of the learning point',
          },
          insight: {
            type: 'string',
            description: 'The specific learning point or insight to remember',
          },
          timestamp: {
            type: 'string',
            description: 'The current timestamp when the learning occurred',
          }
        },
        required: ['topic', 'insight', 'timestamp'],
      },
    },
    async ({ topic, insight, timestamp }: { [key: string]: any }) => {
      setMemoryKv((memoryKv: { [key: string]: any }) => {
        const newKv = { ...memoryKv };
        const learningKey = `learning_${topic.toLowerCase().replace(/\s+/g, '_')}`;
        
        // Initialize learning array if it doesn't exist
        if (!newKv[learningKey]) {
          newKv[learningKey] = [];
        }
        
        // Add new learning point
        newKv[learningKey].push({
          insight,
          timestamp,
        });
        
        return newKv;
      });
      return { ok: true, message: 'Learning point recorded' };
    }
  );
};