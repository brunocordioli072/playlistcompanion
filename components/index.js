import Vue from "vue";

const requireComponent = require.context("@/components", true, /\.vue$/);

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);
  const formattedFileName = fileName.split("/")[2];
  const componentName =
    "c-" + formattedFileName.replace(/^\.\//, "").replace(/\.\w+$/, "");

  Vue.component(componentName, componentConfig.default || componentConfig);
});
