import Vue from "vue";

const requireComponent = require.context("@/components", true, /\.vue$/);

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);

  const componentName =
    "c-" + fileName.replace(/^\.\//, "").replace(/\.\w+$/, "");

  Vue.component(componentName, componentConfig.default || componentConfig);
});
