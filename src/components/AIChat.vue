<template>
  <div class="chat-container">
    <header class="chat-header">
      <div class="ai-info">
        <el-avatar :size="32" src="https://api.dicebear.com/7.x/bottts/svg?seed=Gemini" />
        <span class="name">AI 智能助手</span>
        <el-tag size="small" type="success" effect="plain">在线</el-tag>
      </div>
      <el-button link icon="Delete" @click="clearMessages">清空对话</el-button>
    </header>

    <main class="chat-main" ref="chatScrollRef">
      <div v-for="(msg, index) in messages" :key="index" :class="['message-row', msg.role]">
        <el-avatar
          v-if="msg.role === 'system' || msg.role === 'assistant'"
          :size="36"
          src="https://api.dicebear.com/7.x/bottts/svg?seed=Gemini"
        />
        <div class="message-content">
          <MdPreview
            v-if="msg.role === 'system' || msg.role === 'user' || msg.role === 'assistant'"
            :modelValue="msg.content"
            theme="light"
            previewTheme="github"
          />
          <span v-else>{{ msg.content }}</span>
        </div>
        <el-avatar
          v-if="msg.role === 'user'"
          :size="36"
          src="https://pic.616pic.com/ys_bnew_img/00/54/97/9GArrbyNOm.jpg"
        />
      </div>
    </main>

    <footer class="chat-footer">
      <el-input
        v-model="inputMsg"
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 4 }"
        placeholder="输入问题，Shift + Enter 换行"
        @keyup.enter.prevent="sendMessage"
      />
      <el-button type="primary" icon="Promotion" :disabled="!inputMsg.trim()" @click="sendMessage">
        发送
      </el-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { MdPreview } from "md-editor-v3";
import { sendMessageToDSStream } from "../api/AIChatAPI.ts";
import { ElMessage } from "element-plus";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const inputMsg = ref("");
const loading = ref(false);
const chatScrollRef = ref<HTMLElement>();

const messages = ref<Message[]>([
  { role: "assistant", content: "你好！我是你的 AI 助手，有什么可以帮你的吗？" },
]);

// 自动滚动到底部
const scrollToBottom = async () => {
  await nextTick();
  if (chatScrollRef.value) {
    chatScrollRef.value.scrollTop = chatScrollRef.value.scrollHeight;
  }
};

const sendMessage = async () => {
  if (!inputMsg.value.trim() || loading.value) return;

  const userMsg: Message = { role: "user", content: inputMsg.value };
  messages.value.push(userMsg);

  // 1. 先在数组里占个座，放一条空的 AI 消息
  const aiMsg: Message = { role: "assistant", content: "" };
  messages.value.push(aiMsg);

  const currentMsgIndex = messages.value.length - 1; // 记录这条消息的索引

  inputMsg.value = "";
  loading.value = true;
  await scrollToBottom();

  try {
    // 2. 调用流式接口
    const stream = sendMessageToDSStream(messages.value.slice(0, -1)); // 排除掉刚加的那条空消息

    for await (const chunk of stream) {
      // 3. 实时追加内容到最后一条消息
      const targetMessage = messages.value[currentMsgIndex];
      if (targetMessage && typeof chunk === "string") {
        targetMessage.content += chunk;
        // 4. 每收到一个字就尝试滚动到底部
        scrollToBottom();
      }
    }
  } catch (error) {
    ElMessage.error("流式请求失败");
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const clearMessages = () => {
  messages.value = [{ role: "assistant", content: "会话已清空，请问有什么可以帮您？" }];
};
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%; // 你也可以设为 100%
  background: #f9f9f9;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  margin: 10vh;
  .chat-header {
    padding: 12px 20px;
    background: #fff;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .ai-info {
      display: flex;
      align-items: center;
      gap: 10px;

      .name {
        font-weight: bold;
        font-size: 15px;
      }
    }
  }

  .chat-main {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .message-row {
      display: flex;
      gap: 12px;
      max-width: 85%;

      &.user {
        align-self: flex-end;
        flex-direction: row;

        .message-content {
          background-color: #fff;
          color: #333;
          border-radius: 2px 12px 12px 12px;
          border: 1px solid #ebeef5;
        }
      }

      &.ai {
        align-self: flex-start;

        .message-content {
          background-color: #fff;
          color: #333;
          border-radius: 2px 12px 12px 12px;
          border: 1px solid #ebeef5;

          // 深度适配 md-preview 样式
          :deep(.md-editor-preview-wrapper) {
            padding: 0;
          }
        }
      }

      .message-content {
        padding: 10px 16px;
        font-size: 14px;
        line-height: 1.6;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }

      .loading {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #909399;
      }
    }
  }

  .chat-footer {
    padding: 15px 20px;
    background: #fff;
    border-top: 1px solid #eee;
    display: flex;
    gap: 10px;
    align-items: flex-end;
  }
}

// 滚动条美化
.chat-main::-webkit-scrollbar {
  width: 6px;
}

.chat-main::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 10px;
}
</style>
