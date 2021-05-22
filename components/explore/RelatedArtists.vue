<template>
  <a-table
    :columns="$app.isMobile ? relatedArtistsColumnsMobile : relatedArtistsColumns"
    :size="$app.isMobile ? 'small' : ''"
    :pagination="{ pageSize: 5 }"
    :data-source="relatedArtists"
  >
    <span slot="images" slot-scope="images, item">
      <a-avatar slot="avatar" :src="getImageFromArtist(item)" />
    </span>
    <div slot="name" slot-scope="name, item">
      <a target="_blank" :href="item.external_urls.spotify">{{ item.name }}</a>
    </div>
    <span slot="genres" slot-scope="genres">
      <a-tag
        v-for="genre in genres"
        :key="genre"
        :color="
          genre === 'loser'
            ? 'volcano'
            : genre.length > 5
            ? 'geekblue'
            : 'green'
        "
        >{{ genre.toUpperCase() }}</a-tag
      >
    </span>
    <div slot="action" slot-scope="action, item">
      <Actions :search="true" :item="item"></Actions>
    </div>
  </a-table>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      relatedArtistsColumns: [
        {
          dataIndex: 'images',
          key: 'images',
          title: '',
          align: 'center',
          scopedSlots: {customRender: 'images'},
        },
        {
          title: 'Name',
          dataIndex: 'name',
          align: 'center',
          key: 'name',
          scopedSlots: {customRender: 'name'},
        },
        {
          title: 'Genres',
          key: 'genres',
          align: 'center',
          dataIndex: 'genres',
          scopedSlots: {customRender: 'genres'},
        },
        {
          title: 'Action',
          key: 'action',
          align: 'center',
          scopedSlots: {customRender: 'action'},
        },
      ],
      relatedArtistsColumnsMobile: [
        {
          dataIndex: 'images',
          key: 'images',
          title: '',
          align: 'center',
          scopedSlots: {customRender: 'images'},
        },
        {
          title: 'Name',
          dataIndex: 'name',
          align: 'center',
          key: 'name',
          scopedSlots: {customRender: 'name'},
        },
        {
          title: 'Action',
          key: 'action',
          align: 'center',
          scopedSlots: {customRender: 'action'},
        },
      ],
    };
  },
  computed: {
    relatedArtists: {
      get(): any {
        return this.$store.getters['explore/relatedArtists'];
      },
      set(val: any): void {
        this.$store.commit('explore/relatedArtists', val);
      },
    },
    modalVisible: {
      get(): any {
        return this.$store.getters['explore/modalVisible'];
      },
      set(val: any): void {
        this.$store.commit('explore/modalVisible', val);
      },
    },
  },
  methods: {
    getImageFromArtist(item: any) {
      return item.images && item.images.length > 0 ? item.images[0].url : '';
    },
  },
});
</script>

<style>
</style>
