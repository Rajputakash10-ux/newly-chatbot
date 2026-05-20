type Message = { role: "user" | "assistant"; content: string };
export const sessions: Record<string, Message[]> = {};
