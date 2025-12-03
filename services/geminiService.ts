import { GoogleGenAI, Type } from "@google/genai";
import { Order, Customer } from "../types";

// Initialize Gemini Client
// API Key is injected via process.env.API_KEY as per strict guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const GENERATION_MODEL = 'gemini-2.5-flash';

export const generateProductDescription = async (productName: string, features: string, tone: string = 'persuasive') => {
  try {
    const prompt = `
      Write a compelling product description for an e-commerce store.
      Product Name: ${productName}
      Key Features: ${features}
      Tone: ${tone}
      
      Return the result in JSON format with the following fields:
      - title: An SEO-optimized title
      - description: The HTML description (keep it clean, use <p> and <ul> tags)
      - tags: A comma-separated list of SEO tags
    `;

    const response = await ai.models.generateContent({
      model: GENERATION_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Product Gen Error:", error);
    throw error;
  }
};

export const analyzeStorePerformance = async (orders: Order[], customers: Customer[]) => {
  try {
    // Summarize data to avoid token limits
    const orderSummary = orders.slice(0, 30).map(o => ({
      date: o.created_at,
      total: o.total_price,
      currency: o.currency
    }));

    const customerSummary = {
      totalCount: customers.length,
      returningCount: customers.filter(c => c.orders_count > 1).length,
      avgSpend: customers.length > 0 
        ? (customers.reduce((acc, c) => acc + parseFloat(c.total_spent), 0) / customers.length).toFixed(2) 
        : "0"
    };

    const prompt = `
      Analyze the performance of this e-commerce store based on the data provided.
      
      Recent Orders (Sample): ${JSON.stringify(orderSummary)}
      Customer Metrics: ${JSON.stringify(customerSummary)}
      
      Provide a strategic summary, identify 2-3 key trends, and give 3 actionable recommendations to improve revenue and customer retention.
    `;

    const response = await ai.models.generateContent({
      model: GENERATION_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            trends: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};