import OpenAI from "openai";

// 1. 定义消息对象的接口（参考 OpenAI 官方定义）
// 或者直接使用 OpenAI.Chat.Completions.ChatCompletionMessageParam
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// 2. 初始化实例
// 注意：Vite 环境下读取环境变量用 import.meta.env
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-a76da3b7fd33458aaa94fd2af3d7acf2",
  dangerouslyAllowBrowser: true,
});

/**
 * 封装聊天接口
 * @param messages 历史对话列表，类型为 ChatMessage 数组
 */
export const sendMessageToDS = async (messages: ChatMessage[]) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "你是一位专业的计算机程序员。" }, ...messages],
      model: "deepseek-chat",
    });

    // 解决报错 1：通过 Optional Chaining (?.) 确保 choices[0] 存在
    const firstChoice = completion.choices?.[0];

    if (!firstChoice || !firstChoice.message) {
      throw new Error("API 返回数据为空");
    }

    // 解决报错 2：将可能为 null 的 content 强制转为 string
    // 使用 ?? "" 表示：如果前面是 null/undefined，就取空字符串 ""
    return {
      role: firstChoice.message.role,
      content: firstChoice.message.content ?? "",
    };
  } catch (error) {
    console.error("DeepSeek API 请求失败:", error);
    throw error;
  }
};
