<template>
  <div class="resume" :style="{ backgroundImage: 'url(/images/resume/windows_xp_background.webp)' }">
    <div class='center-start windows-icon-offset'>
      <div class='start'>
        <div class='windows-icon' style="position: relative" v-bind="getIconProps(false)">
          <img src='/images/resume/wordicon_destop.svg' />
          <p>Jon Kido Resume 20XX Rough Draft</p>
        </div>
      </div>
      <div class='start'>
        <div class='windows-icon' style="position: relative" v-bind="getIconProps(true)">
          <img src='/images/resume/wordicon_destop.svg' />
          <p>Flavored Resume 20XX Rough Draft</p>
        </div>
      </div>
    </div>
    <div v-for="(window, i) in windows" :key="`windows-${window.key}`"
      :class="['window', { focused: window.focused, fullscreened: window.fullscreened, minimized: window.minimized }]"
      @mousedown="setWindowState(`focused-${i}`, true)">
      <div class="title-bar" v-bind="getTitleBarProps()">
        <div class="title-bar-text">
          <div class='wordIcon title' />
          Jon Kido Resume 20XX Rough Draft - Microsoft Word
        </div>
        <div class="title-bar-controls">
          <button class="minimize" aria-label="Minimize" :id="`minimized-${i}`" @click="setWindowState(`minimized-${i}`)"></button>
          <button class="maximize" aria-label="Maximize" :id="`fullscreened-${i}`" @click="setWindowState(`fullscreened-${i}`)"></button>
          <button class="close" aria-label="Close" :id="`closed-${i}`" @click="setWindowState(`closed-${i}`)"></button>
        </div>
      </div>
      <div class="window-options" />
      <div class="window-body">
        <div class='window-page' v-bind="getEditableProps()" @keyup="">
          <center>
            <h1>Want a polished resume?</h1>
            <h5>
              <button class='hyperlink' @click="openResume('complete')">Complete Resume</button>
              <button class='hyperlink' @click="openResume('gamedev')">Game Dev Resume</button>
              <button class='hyperlink' @click="openResume('full-stack')">Full Stack Resume</button>
            </h5>
            <br />
            <br />
            <h1>Want to create a custom resume?</h1>
            <h5>
              <button class='hyperlink' @click="createResume">Click Here</button>
            </h5>
          </center>
          <h2>Education:</h2>
          <p v-for="(edu, eduIndex) in resumeData.education" :key="`${edu.school}-${eduIndex}`" class='tab'>
            {{ edu.school }}: {{ edu.years }}
            <br />Major: <span v-for="(major, majorIndex) in edu.majors"
              :key="`${edu.school}-${major.short}-${majorIndex}`">
              <span v-if="majorIndex > 0">, </span><strong>{{ major.short }}</strong> ({{ major.long }})
            </span>
            <br />Minors: <span v-for="(minor, minorIndex) in edu.minors"
              :key="`${edu.school}-${minor.short}-${minorIndex}`">
              <span v-if="minorIndex > 0">, </span><strong>{{ minor.short }}</strong> ({{ minor.long }})
            </span>
          </p>

          <br />
          <div v-if="window.flavored">
            <h2>Experience:</h2>
            <div v-for="(exp, expIndex) in resumeData.flavored.experience" :key="`flavored-${expIndex}`">
              <p><strong>{{ exp.title }}</strong></p>
              <p><em>{{ exp.dates }}</em></p>
              <ul>
                <li v-for="(point, pointIndex) in exp.points" :key="`flavored-${expIndex}-${pointIndex}`">{{ point }}
                </li>
              </ul>
            </div>
          </div>
          <div v-else>
            <h2>Experience:</h2>
            <div v-for="(exp, expIndex) in resumeData.experience" :key="`exp-${expIndex}`">
              <p><strong>{{ exp.title }}{{ exp.subTitle ? `, ${exp.subTitle}` : "" }} - {{ exp.company
                  }}</strong></p>
              <p><em>{{ exp.dates }}</em></p>
              <ul v-if="exp.keyPoints">
                <li v-for="(point, pointIndex) in exp.keyPoints.split('\t ').filter(p => p.trim())"
                  :key="`${expIndex}-${pointIndex}`">{{ point }}</li>
              </ul>
            </div>
          </div>
          <br />
          <h2>Projects:<button class='hyperlink' @click="changePage('projects')">Click Here</button></h2>
          <br />
          <h2>Skills:<button class='hyperlink' @click="changePage('skills')">Click Here</button></h2>
          <br />
          <h2>Contact Information:<button class='hyperlink' @click="changePage('socials')">Click Here</button>
          </h2>
          <p>Email: jonkido@vfos.dev</p>
        </div>
      </div>
    </div>

    <div class='taskbar'>
      <div class='start'>
        <div class='windowIcon' />start
      </div>
      <div class='applications'>
        <div v-for="(window, i) in windows" :key="window.key" :class="['application', { focused: window.focused }]"
          @mousedown="setWindowState(`focused-${i}`, true)">
          <div class='wordIcon' />
          <div class='txt'>Jon Kido Resume 20XX Rough Draft - Microsoft Word</div>
        </div>
      </div>
      <div ref="timeEle" id="time">{{ currentTime }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import resumeData from '@/json/resumeData.json';
import { createKey, onDoubleClick, dragParentElement, editableFocusRot } from '@/utilities/window';

const router = useRouter();
const windows = ref([
  {
    flavored: false,
    focused: true,
    minimized: false,
    fullscreened: false,
    key: createKey()
  }
]);

const currentTime = ref('');
let timeInterval = null;

function getTime() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function updateTime() {
  currentTime.value = getTime();
}

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
  if (timeInterval) clearInterval(timeInterval);
});


function newWindow(flavored = false) {
  const keys = windows.value.map(function (w) {
    w.focused = false;
    return w.key;
  });
  windows.value.push({
    flavored,
    focused: true,
    minimized: false,
    fullscreened: false,
    key: createKey(keys)
  });
}

function setWindowState(info, value = null) {
  const [id, index] = info.split('-');
  const idx = parseInt(index);

  switch (id) {
    case 'closed':
      windows.value.splice(idx, 1);
      break;
    case 'focused':
      windows.value[idx].minimized = false;
      windows.value = windows.value.map(function (w, i) {
        return { ...w, focused: i === idx };
      });
      break;
    case 'minimized':
      windows.value[idx].focused = false;
      windows.value[idx][id] = value === null ? !windows.value[idx][id] : value;
      break;
    case 'fullscreened':
    default:
      windows.value[idx][id] = value === null ? !windows.value[idx][id] : value;
      break;
  }
}

function changePage(page) {
  router.push({ name: page });
}

function createResume() {
  window.open('/resume?create=1', '_blank');
}

function openResume(subset = 'complete') {
  window.open(`/pdf/${subset}_resume_eye_friendly.pdf`, '_blank');
}

function handleNewWindow(flavored) {
  newWindow(flavored);
}

function getIconProps(flavored) {
  return {
    ...onDoubleClick(handleNewWindow, [flavored]),
    ...dragParentElement(true, true)
  };
}

function getTitleBarProps() {
  return dragParentElement(false, false);
}

function getEditableProps() {
  return editableFocusRot();
}
</script>

<style lang="less" scoped>
// Variables
@black: black;
@white: white;
@blue: blue;
@darkblue: darkblue;
@taskbar-blue: #265fdb;
@taskbar-blue-light: #578cfd;
@taskbar-blue-light-alpha: #578cfdad;
@taskbar-blue-dark: #2d51c7;
@title-bar-blue: #0050ee;
@title-bar-blue-dark: #0831d9;
@title-bar-blue-darker: #001ea0;
@title-bar-blue-gradient: linear-gradient(180deg, #0997ff, #0053ee 8%, #0050ee 40%, #06f 88%, #06f 93%, #005bff 95%, #003dd7 96%, #003dd7);
@start-green: #52be27;
@start-green-dark: #2f6b07;
@start-green-light: #a6db96;
@window-bg: #ece9d8;
@window-body-bg: #afada1;
@scrollbar-track: #dddccd;
@scrollbar-thumb: #f1f0e7;
@scrollbar-border: #d4d4d4;
@gray-border: rgb(221, 221, 221);
@icon-size: 20px;
@icon-size-small: 16px;
@icon-size-large: 54px;
@taskbar-height: 30px;
@title-bar-height: 25px;
@window-min-size: 150px;
@border-radius: 8px;
@border-radius-small: 2px;
@border-radius-tiny: 3px;

// Mixins
.icon-base() {
  position: absolute;
  background-repeat: no-repeat;
  background-size: contain;
  width: @icon-size;
  height: @icon-size;
  margin: 3px;
  font-size: 30px !important;
}

.text-ellipsis() {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.resume {
  background-image: linear-gradient(lightblue, lightgreen);
  background-size: cover;
  background-position: 50%;
  overflow: hidden;
  padding: 0 !important;
  height: 100vh;

  .taskbar {
    z-index: 2;
    pointer-events: none;
    background-color: @taskbar-blue;
    border-top: @taskbar-blue-light-alpha 3px solid;
    box-shadow: inset 0 7px 19px -7px @taskbar-blue-light;
    width: 100vw;
    position: absolute;
    bottom: 0;
    height: @taskbar-height;
    display: flex;

    .start {
      pointer-events: all;
      background-color: @start-green;
      width: 90px;
      text-align: center;
      color: @white;
      height: @taskbar-height;
      padding: 2px;
      font-size: 1em;
      border-bottom-right-radius: 10px;
      border-top-right-radius: 10px;
      box-shadow: inset 0 0 19px 0 @start-green-dark, inset @start-green-light 0 7px 19px -7px;
      transform: translateY(-3px);
      position: relative;
      cursor: pointer;

      .windowIcon {
        .icon-base();
        background-image: url(/images/resume/xpIcon.png);
      }
    }

    .applications {
      display: flex;
      flex-grow: 1;
      overflow: hidden;
    }

    .application {
      pointer-events: all;
      border-radius: @border-radius-tiny;
      top: 0;
      left: 90px;
      width: 150px;
      box-shadow: inset rgba(0, 0, 0, 0.2) 0 0 5px;
      height: 25px;
      color: @white;
      margin-left: 10px;
      text-indent: 27px;
      font-size: 13px !important;
      cursor: pointer;
      display: flex;
      align-items: center;

      &.focused {
        background-color: @taskbar-blue-dark;
      }

      .txt {
        transform: translateY(2px);
        .text-ellipsis();
      }
    }

    #time {
      font-size: 1em;
      margin: 0 10px;
      width: 75px;
      color: @white;
      display: flex;
      align-items: center;
    }
  }

  .window-options {
    background-image: url(/images/resume/options.jpg);
    background-repeat: no-repeat;
    min-height: 80px;
    background-size: auto 80px;
    margin: 5px;
  }

  .wordIcon {
    .icon-base();
    background-image: url(/images/resume/wordIcon.png);

    &.title {
      height: @icon-size-small;
      width: @icon-size-small;
      margin: 2px;
    }
  }

  .window {
    z-index: 0;
    overflow: hidden;
    resize: both;
    box-shadow: inset -1px -1px #00138c, inset 1px 1px @title-bar-blue-dark, inset -2px -2px @title-bar-blue-darker, inset 2px 2px #166aee, inset -3px -3px #003bda, inset 3px 3px #0855dd;
    position: absolute;
    border-top-left-radius: @border-radius;
    border-top-right-radius: @border-radius;
    -webkit-font-smoothing: antialiased;
    min-width: @window-min-size;
    min-height: @window-min-size;
    height: 80vh;
    width: 90vw;
    left: 5vw;
    font-size: 11px;
    background: @window-bg;

    &.minimized {
      display: none;
    }

    &.fullscreened {
      width: 100vw !important;
      height: calc(100dvh - @taskbar-height) !important;
      top: 0 !important;
      left: 0 !important;
    }

    &.focused {
      z-index: 1;
    }

    ::-webkit-scrollbar {
      width: @icon-size;
      height: @icon-size;
      position: relative !important;
    }

    ::-webkit-scrollbar-track {
      box-shadow: none !important;
      background-color: transparent;
      background: @scrollbar-track;
    }

    ::-webkit-scrollbar-thumb {
      background-color: @scrollbar-thumb;
      border-radius: 0;
      border: outset 3px @scrollbar-border;
    }
  }
}

.window-page {
  display: flex;
  flex-direction: column;
  outline: none;
  font-family: "Times New Roman", Times, serif;
  margin: 30px auto;
  border: @black 2px solid;
  box-shadow: @black 5px 5px 0;
  padding: min(5%, 5rem);
  width: min(1000px, 95%);
  min-height: 1375px;
  background-color: @white;
  color: @black;
  -webkit-touch-callout: text;
  -webkit-user-select: text;
  user-select: text;

  h1, h2, p, li, strong, em {
    color: @black;
  }

  h1 {
    font-size: 2rem;
    margin: 0;
  }

  h2 {
    font-size: 2.25rem;
    margin: 0;
  }

  p {
    font-size: 1rem;
    margin: 0;
  }

  ul {
    margin-bottom: 0.5rem;
    padding-left: 2.25rem;
  }

  .tab {
    padding-left: calc(1vw * var(--tabAmount, 1));
  }
}

.center-start {
  position: absolute;
  top: 50vh;
  left: 50vw;

  .start {
    width: 70px;
  }

  &.windows-icon-offset {
    justify-content: space-between;
    width: 150px;
    height: 80px;
    display: flex;
    transform: translate(-50%, -50%);
  }
}

.windows-icon {
  border: solid #0000 1px;
  padding: 5px 5px 0;
  position: absolute;
  width: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  * {
    pointer-events: none;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: @border-radius-small;
    border: solid rgba(73, 73, 73, 0.353) 1px;
  }

  p {
    text-shadow: @black 2px 2px 2px;
    color: @white;
    align-self: baseline;
    font-size: 0.8rem;
    .text-ellipsis();
    width: 100%;
    margin: 0;
  }

  img {
    width: @icon-size-large;
    height: @icon-size-large;
  }
}

.title-bar {
  padding: 2px;
  font-family: Trebuchet MS;
  background: @title-bar-blue-gradient;
  border-top: 1px solid @title-bar-blue-dark;
  border-left: 1px solid @title-bar-blue-dark;
  border-right: 1px solid @title-bar-blue-darker;
  border-top-left-radius: @border-radius;
  border-top-right-radius: 7px;
  font-size: 13px;
  text-shadow: 1px 1px #0f1089;
  height: @title-bar-height;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &-text {
    pointer-events: none;
    .text-ellipsis();
    font-weight: 700;
    color: @white;
    text-indent: 25px;
    letter-spacing: 0;
    margin-right: 3px;
    padding-left: 3px;
    display: flex;
    align-items: center;
  }

  &-controls {
    display: flex;

    button {
      min-width: 21px;
      min-height: 21px;
      margin-left: 2px;
      background-repeat: no-repeat;
      background-position: 50%;
      box-shadow: none;
      background-color: @title-bar-blue;
      border: none;
      cursor: pointer;

      &.minimize {
        background-image: url(/images/resume/minimize.svg);
      }

      &.maximize {
        background-image: url(/images/resume/maximize.svg);
      }

      &.close {
        background-image: url(/images/resume/close.svg);
      }
    }
  }
}

.window-body {
  margin: 8px;
  background: @window-body-bg;
  border: @gray-border 3px inset;
  height: calc(100% - 125px);
  overflow: scroll;
  padding: 0 !important;
  scrollbar-color: @scrollbar-thumb @scrollbar-track !important;
  scrollbar-width: unset !important;
}

.hyperlink {
  background: none;
  border: none;
  color: @blue;
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  margin: 0 5px;

  &:hover {
    color: @darkblue;
  }
}
</style>
