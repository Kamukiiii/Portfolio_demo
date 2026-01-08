import { ref } from "vue";
import { defineStore } from 'pinia';


export const useThemeStore = defineStore('theme', () => {
  const theme = ref('');

  function setTheme(themeName: string) {
    theme.value = themeName;
  }
  return { theme, setTheme };
})


