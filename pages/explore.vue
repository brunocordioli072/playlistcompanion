<template>
  <div class="container">
    <tree :data="tree" nodeText="name" layoutType="horizontal" type="tree">
      
    </tree>
  </div>
</template>

<script>
import { tree } from "vued3tree";

export default {
  components: {
    tree,
  },
  data() {
    return {
      checkedIds: [],
      tree: {
        name: "father",
        children: [
          {
            name: "son1",
            children: [{ name: "grandson" }, { name: "grandson2" }],
          },
          {
            name: "son2",
            children: [{ name: "grandson3" }, { name: "grandson4" }],
          },
        ],
      },
    };
  },
};
</script>

<style>
.container {
  margin: 0 auto;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>