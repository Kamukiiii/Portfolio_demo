import OpenAI from "openai";

// 1. 定义消息对象的接口（参考 OpenAI 官方定义）
// 或者直接使用 OpenAI.Chat.Completions.ChatCompletionMessageParam
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// 2. 初始化实例
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-a76da3b7fd33458aaa94fd2af3d7acf2",
  dangerouslyAllowBrowser: true,
});

/**
 * 封装聊天接口
 * @param messages 历史对话列表，类型为 ChatMessage 数组
 */
export const sendMessageToDSStream = async function* (messages: ChatMessage[]) {
  try {
    const stream = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "你是一位专业的计算机考研辅导老师，擅长用表格总结知识点。在回答时，请尽可能详尽且符合数二/专业课考纲。",
        },
        ...messages,
      ],
      model: "deepseek-chat",
      stream: true, // 核心：开启流式传输模式
    });

    // 使用 for await...of 循环处理异步流
    for await (const chunk of stream) {
      // 解决之前你遇到的“对象可能未定义”和“null 类型不兼容”问题
      const content = chunk.choices[0]?.delta?.content ?? "";
      if (content) {
        yield content; // 将每一块字符推送到前端
      }
    }
  } catch (error: unknown) {
    // 针对你之前遇到的 402 余额不足错误进行捕获
    // 使用类型守卫检查 error 是否包含 status 属性
    if (error && typeof error === "object" && "status" in error) {
      const apiError = error as { status: number }; // 局部断言
      if (apiError.status === 402) {
        console.error("DeepSeek API 报错：账户余额不足，请检查后台充值状态。");
      }
    } else {
      console.error("流式请求过程中发生错误:", error);
    }
    throw error;
  }
};
