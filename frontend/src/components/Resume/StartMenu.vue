<template>
  <Teleport to="body">
    <div v-if="isOpen" class="start-menu-overlay" @click="closeMenu">
      <div class="start-menu" @click.stop>
        <div class="start-menu-header">
          <span class="user-name">Guest</span>
        </div>
        <div class="start-menu-content">
          <div class="start-menu-left">
            <div v-for="item in menuItems" :key="item.title" class="start-menu-item" @click="handleItemClick(item)">
              <component :is="getIconComponent(item.icon)" v-if="item.icon && getIconComponent(item.icon)"
                :src="getIconSrc(item.icon)" class="start-menu-icon" />
              <span v-else class="start-menu-icon">📄</span>
              <span class="start-menu-text">{{ item.title }}</span>
            </div>
          </div>
          <div class="start-menu-right">
            <a :href="settingsUrls.documents" class="start-menu-item">
              <span class="start-menu-icon">📄</span>
              <span class="start-menu-text">My Documents</span>
            </a>
            <a :href="settingsUrls.computer" class="start-menu-item">
              <span class="start-menu-icon">💻</span>
              <span class="start-menu-text">My Computer</span>
            </a>
            <a :href="settingsUrls.network" class="start-menu-item">
              <span class="start-menu-icon">🌐</span>
              <span class="start-menu-text">My Network Places</span>
            </a>
            <a :href="settingsUrls.settings" class="start-menu-item">
              <span class="start-menu-icon">⚙️</span>
              <span class="start-menu-text">Control Panel</span>
            </a>
          </div>
        </div>
        <div class="start-menu-footer">
          <div class="start-menu-button" @click="handleShutdown">
            <div class="shutdown-icon"></div>
            <span>Shut Down</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { defineAsyncComponent, onMounted, onBeforeUnmount, computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  menuItems: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'open-app', 'shutdown']);

const settingsUrls = computed(() => {
  const settings = {
    documents: {
      w: 'ms-settings:privacy-documents',
      m: 'x-apple-finder:Documents'
    },
    computer: {
      w: 'ms-settings:storagesense',
      m: 'x-apple-systempreferences:com.apple.preference.universalaccess'
    },
    network: {
      w: 'ms-settings:network-wifi',
      m: 'x-apple-systempreferences:com.apple.preference.network'
    },
    settings: {
      w: 'ms-settings:general',
      m: 'x-apple-systempreferences:'
    },
  };

  const platform = /Win/i.test(navigator.platform) || /Windows/i.test(navigator.userAgent)
    ? 'w'
    : (/Mac/i.test(navigator.platform) || /Macintosh/i.test(navigator.userAgent)
      ? 'm'
      : null);

  if (!platform) {
    return {
      documents: '#',
      computer: '#',
      network: '#',
      settings: '#'
    };
  }

  return {
    documents: settings.documents[platform] || '#',
    computer: settings.computer[platform] || '#',
    network: settings.network[platform] || '#',
    settings: settings.settings[platform] || '#'
  };
});

function closeMenu() {
  emit('close');
}

// Close menu when clicking outside or pressing Escape
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleEscape);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleOutsideClick);
    window.removeEventListener('keydown', handleEscape);
  }
});

function handleOutsideClick(e) {
  if (props.isOpen && !e.target.closest('.start-menu') && !e.target.closest('.start')) {
    closeMenu();
  }
}

function handleEscape(e) {
  if (e.key === 'Escape' && props.isOpen) {
    closeMenu();
  }
}

function handleItemClick(item) {
  emit('open-app', item);
  closeMenu();
}

function handleShutdown() {
  emit('shutdown');
  closeMenu();
}

function getIconComponent(icon) {
  if (!icon) return null;

  if (typeof icon === 'string' && (icon.startsWith('/') || icon.startsWith('http'))) {
    return 'img';
  }

  if (typeof icon === 'string') {
    try {
      return defineAsyncComponent({
        loader: () => import(`@/components/${icon}.vue`),
        errorComponent: null,
      });
    } catch {
      return null;
    }
  }

  return icon;
}

function getIconSrc(icon) {
  if (typeof icon === 'string' && (icon.startsWith('/') || icon.startsWith('http'))) {
    return icon;
  }
  return null;
}
</script>

<style lang="less" scoped>
@start-menu-blue-dark: #1e3a8a;
@start-menu-blue-light: #3b82f6;
@start-menu-blue-gradient: linear-gradient(180deg, #4a90e2 0%, #2e5c8a 50%, #1e3a8a 100%);
@start-menu-gray: #d4d0c8;
@start-menu-gray-dark: #808080;
@start-menu-white: #ffffff;
@start-menu-text-blue: #000080;
@start-menu-hover: #316ac5;
@shutdown-red: #dc2626;

.start-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  pointer-events: all;
  background: transparent;
}

.start-menu {
  position: absolute;
  bottom: 30px;
  left: 0;
  width: 380px;
  background: @start-menu-blue-gradient;
  border: 2px outset @start-menu-white;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: @start-menu-gray-dark;
  border-bottom-color: @start-menu-gray-dark;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  z-index: 1001;
}

.start-menu-header {
  background: linear-gradient(180deg, #1e3a8a 0%, #2e5c8a 100%);
  padding: 8px 12px;
  border-bottom: 1px solid @start-menu-gray-dark;

  .user-name {
    color: @start-menu-white;
    font-weight: bold;
    font-size: 13px;
  }
}

.start-menu-content {
  display: flex;
  background: @start-menu-gray;
  min-height: 300px;
}

.start-menu-left {
  flex: 1;
  background: linear-gradient(90deg, #245edb 0%, #1e4a9e 100%);
  padding: 4px 0;
  min-width: 180px;
  max-width: 200px;
}

.start-menu-right {
  flex: 0 0 180px;
  background: linear-gradient(180deg, #a6c8e8 0%, #7db3e8 100%);
  padding: 4px 0;
  border-left: 1px solid @start-menu-gray-dark;
}

.start-menu-item {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  cursor: pointer;
  color: @start-menu-text-blue;
  font-size: 11px;
  position: relative;
  text-decoration: none;

  &:hover {
    background-color: @start-menu-hover;
    color: @start-menu-white;
  }

  .start-menu-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .start-menu-text {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.start-menu-footer {
  background: @start-menu-blue-dark;
  padding: 8px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid @start-menu-gray-dark;
}

.start-menu-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: @start-menu-blue-dark;
  border: 1px outset @start-menu-white;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: @start-menu-gray-dark;
  border-bottom-color: @start-menu-gray-dark;
  cursor: pointer;
  color: @start-menu-white;
  font-size: 11px;
  font-weight: bold;

  &:hover {
    background: @start-menu-blue-light;
  }

  &:active {
    border: 1px inset @start-menu-white;
    border-top-color: @start-menu-gray-dark;
    border-left-color: @start-menu-gray-dark;
    border-right-color: #ffffff;
    border-bottom-color: #ffffff;
  }

  .shutdown-icon {
    width: 20px;
    height: 20px;
    background: @shutdown-red;
    border-radius: 50%;
    position: relative;
    border: 2px solid @start-menu-white;

    &::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: 8px;
      background: @start-menu-white;
    }
  }
}
</style>
