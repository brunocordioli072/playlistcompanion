<template>
  <a-timeline-item>
    <a-icon slot="dot" :type="icon" style="font-size: 16px;" />
      <a-input
        v-if="typeof property === 'string' && !radioGroup"
        :value="property"
        @change="$emit('update:property', $event.target.value)"
        :placeholder="description"
      />
      <a-input-number
        v-if="typeof property === 'number'"
        :value="property"
        @change="$emit('update:property', $event)"
        :placeholder="description"
      ></a-input-number>
      <a-radio-group
        v-if="radioGroup"
        :value="property"
        @change="$emit('update:property', $event.target.value)"
      >
        <a-radio-button v-for="radio in radioGroup" :key="radio" :value="radio">
          {{ radio }}
        </a-radio-button>
      </a-radio-group>
  </a-timeline-item>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    property: [String, Number, Boolean],
    radioGroup: {
      type: Array,
      required: false,
    },
    description: String,
    icon: String,
  },
});
</script>

<style></style>
