<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {PluginSearchResult, Step} from "../models";
import {appWindow, LogicalSize} from "@tauri-apps/api/window";
import {
  executeSearchResultMethod,
  goToStepMethod,
  receiveSearchResultsMethod,
  updateSearchResultsMethod,
  updateStepsMethod
} from "../constants";
import {convertFileSrc} from "@tauri-apps/api/tauri";
import {getConnection} from "../connectionHolder";
import {windowHeight, windowWidth} from "../main";

const searchString = ref("");
const steps = ref<Step[]>([]);
const activeIndex = ref(0);
const searchResults = ref<PluginSearchResult[]>([])
let unlistenFn: () => void;


async function handleKeyInput(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      if (activeIndex.value < searchResults.value.length)
        activeIndex.value++;
      break;
    case 'ArrowUp':
      if (activeIndex.value > 0)
        activeIndex.value--;
      break;
    case 'Escape':
      await hideSearchWindow();
  }


  if (searchResults.value.length > 0) {
    for (const action of searchResults.value[activeIndex.value].searchResult.actions) {
      if (event.key === action.id) {
        await getConnection().invoke(executeSearchResultMethod, searchResults.value[activeIndex.value].commandId, action.id)
        await updateSearchStringNew("")
        break;
      }
    }
  }
}

const hideSearchWindow = async () => {
  if (!await appWindow.isVisible())
    return;
  await appWindow.hide()
  await updateSearchStringNew("");

  await getConnection().send(goToStepMethod, steps.value[0].id)
  updateSteps([steps.value[0]])
}

onMounted(async () => {
  getConnection().on(receiveSearchResultsMethod, (searchString: string, commands: PluginSearchResult[]) => {
    const firstNCommands = commands.slice(0, 8);
    firstNCommands.forEach((x) => {
      if (x.searchResult.icon === "" || x.searchResult.webIcon !== undefined)
        return;
      x.searchResult.webIcon = convertFileSrc(x.searchResult.icon);
    })
    updateSearchResults(firstNCommands);
  });

  getConnection().on(updateStepsMethod, (steps: Step[]) => {
    updateSteps(steps);
  });
  await getConnection().invoke<Step[]>(updateStepsMethod);

  unlistenFn = await appWindow.listen('tauri://blur', () => hideSearchWindow());
});

onUnmounted(() => {
  unlistenFn();
});

async function updateSearchResults(newResults: PluginSearchResult[]) {
  searchResults.value = newResults;
  await appWindow.setSize(new LogicalSize(windowWidth, windowHeight + 50 * newResults.length));
}

async function updateSearchStringNew(newString: string) {
  searchString.value = newString;
  await updateSearchString();
}

function updateSearchString() {
  getConnection().send(updateSearchResultsMethod, searchString.value).then();
  activeIndex.value = 0;
}

function updateSteps(newSteps: Step[]) {
  steps.value = newSteps;
}

</script>

<template>
  <div class="w-full h-[60px] text-userInputText flex bg-userInputBackground items-center overflow-hidden"
       data-tauri-drag-region>
    <svg class="fill-userInputText w-[28px] h-[28px] m-[16px]" xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 32 32" data-tauri-drag-region>
      <g id="surface1">
        <path
            d="M 19 3 C 13.488281 3 9 7.488281 9 13 C 9 15.394531 9.839844 17.589844 11.25 19.3125 L 3.28125 27.28125 L 4.71875 28.71875 L 12.6875 20.75 C 14.410156 22.160156 16.605469 23 19 23 C 24.511719 23 29 18.511719 29 13 C 29 7.488281 24.511719 3 19 3 Z M 19 5 C 23.429688 5 27 8.570313 27 13 C 27 17.429688 23.429688 21 19 21 C 14.570313 21 11 17.429688 11 13 C 11 8.570313 14.570313 5 19 5 Z "></path>
      </g>
    </svg>
    <input
        class="appearance-none focus:outline-none w-full h-full bg-userInputBackground text-[24px] font-[200] overflow-hidden"
        type="text" data-tauri-drag-region
        v-model="searchString"
        v-on:keydown="(event: KeyboardEvent) => handleKeyInput(event)"
        autoFocus
        v-on:change="updateSearchString()"
    />
  </div>
  <div class="w-full h-[30px] flex bg-userInputBackground gap-[5px]">
    <div class="w-0"></div>
    <div v-for="step in steps.value"
         class="h-[25px] bg-searchResultActiveBackground text-searchResultNameText px-1 rounded">
      {{ step.name }}
    </div>
  </div>
  <div v-for="(pluginCommand, index) in searchResults" key={pluginCommand.commandId}
       :class="`w-full h-[50px] text-userInputText items-center flex ${index === activeIndex.value ? 'bg-searchResultActiveBackground' : 'bg-searchResultBackground'}`">
    <div class="w-[60px] h-full flex items-center justify-center">
      <img :src="pluginCommand.searchResult.webIcon" alt=""/>
    </div>
    <div>
      <p class="text-[17px] text-searchResultNameText">{{ pluginCommand.searchResult.title }}</p>
      <p class="text-[12px] text-searchResultDescriptionText whitespace-nowrap">
        {{ pluginCommand.searchResult.description }}</p>
    </div>
  </div>
</template>
