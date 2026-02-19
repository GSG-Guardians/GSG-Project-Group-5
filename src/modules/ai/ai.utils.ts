import { PROMPT_TEMPLATE } from './ai.constants';
import { TGroqPromptInput } from './ai.types';
import { CategoryName } from '../../../database/enums';

export function sanitizeUsername(username: string): string {
  const u = (username ?? '').trim();
  return u.length ? u : 'User';
}

function safeStringify(value: unknown): string {
  return JSON.stringify(
    value,
    (_key, val) => {
      if (val instanceof Date) return val.toISOString();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return val;
    },
    2,
  );
}

export function buildGroqFinanceUserPrompt(input: TGroqPromptInput): string {
  const username = sanitizeUsername(input.username);

  const previousMessages = input.previousMessages;
  const userMessage = input.userMessage.trim();

  return [
    `username: ${username}`,
    ``,
    `monthlyBudgetSummary: ${safeStringify(input.monthlyBudgetSummary ?? [])}`,
    `monthlyBillSummary: ${safeStringify(input.monthlyBillSummary ?? [])}`,
    `monthlyDebtSummary: ${safeStringify(input.monthlyDebtSummary ?? [])}`,
    `monthlyExpenseSummary: ${safeStringify(input.monthlyExpenseSummary ?? [])}`,
    `monthlyIncomeSummary: ${safeStringify(input.monthlyIncomeSummary ?? [])}`,
    ``,
    `previousMessages: ${safeStringify(previousMessages)}`,
    ``,
    `userMessage: ${userMessage || '(empty)'}`,
  ].join('\n');
}

export function buildGroqFinanceFullPrompt(input: TGroqPromptInput): string {
  const userPrompt = buildGroqFinanceUserPrompt(input);

  return [`SYSTEM:\n${PROMPT_TEMPLATE}`, ``, `USER:\n${userPrompt}`].join(
    '\n\n',
  );
}

export function buildGroqBudgetSuggestionPrompt(
  input: TGroqPromptInput,
): string {
  const username = sanitizeUsername(input.username);
  const categories = [
    CategoryName.HOUSING,
    CategoryName.TRANSPORT,
    CategoryName.HEALTH,
  ];
  const allowedCategories = categories.join(', ');

  return `
    SYSTEM:
    You are a professional financial advisor AI. Your task is to analyze the user's financial data and provide a recommended budget distribution across exactly these three categories: ${allowedCategories}.

    Required JSON Output Structure:
    {
      "data": [
        { "category": "HOUSING", "amount": 123.45, "percentage": 50 },
        { "category": "TRANSPORT", "amount": 123.45, "percentage": 30 },
        { "category": "HEALTH", "amount": 123.45, "percentage": 20 }
      ]
    }

    Analysis & Calculation Rules:
    1. CALCULATE TOTAL INCOME: First, sum all "amount" values in the "Monthly Income" data. (e.g., if there are three $5000 entries, total income is $15000).
    2. 100% DISTRIBUTION: You MUST distribute 100% of the calculated total income across the three categories (${allowedCategories}).
    3. PERCENTAGE RULES:
       - The sum of "percentage" values for HOUSING, TRANSPORT, and HEALTH MUST equal exactly 100.
       - Base the relative distribution on financial best practices (e.g., Housing should typically get the largest share).
    4. AMOUNT CALCULATION:
       - The "amount" for each category MUST be: (Total Income * percentage / 100).
    5. ACCURACY: Ensure the logic is sound and reflects a realistic recommendation for a user with this specific income and expense profile, but condensed into these three target categories.
    6. FORMAT: Return ONLY the raw JSON string. No markdown, no conversational text, no \`\`\`json blocks.

    USER DATA:
    Username: ${username}
    Monthly Income: ${safeStringify(input.monthlyIncomeSummary)}
    Monthly Expenses: ${safeStringify(input.monthlyExpenseSummary)}
    Monthly Debts: ${safeStringify(input.monthlyDebtSummary)}
    Monthly Bills: ${safeStringify(input.monthlyBillSummary)}
    Current Budget Patterns: ${safeStringify(input.monthlyBudgetSummary)}
  `;
}

export const cleanAiResponse = (response: string) => {
  const cleaned = response
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    return cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
};
