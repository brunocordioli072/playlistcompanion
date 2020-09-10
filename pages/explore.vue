<template>
  <div class="content">
    <a-space direction="vertical">
      <a-select
        label-in-value
        show-search
        :value="value"
        placeholder="Search artists"
        style="width: 50vw"
        :filter-option="false"
        :not-found-content="fetching ? undefined : null"
        @search="fetchArtists"
      >
        <a-spin v-if="fetching" slot="notFoundContent" size="small" />
        <a-select-option
          v-for="(item, index) in artists"
          :key="index"
          @click="updateSearchedArtist(item)"
        >
          <a-avatar slot="avatar" :src="getImageFromArtist(item)" />
          <b style="margin-left: 10px">{{ item.name }}</b>
          <a-tag
            style="margin-left: 5px"
            v-for="genre in item.genres"
            :key="genre"
            :color="genre === 'loser' ? 'volcano' : genre.length > 5 ? 'geekblue' : 'green'"
          >{{ genre.toUpperCase() }}</a-tag>
        </a-select-option>
      </a-select>

      <div style="text-align: left !important; max-height: 400px;">
        <a-list
          style="width: 81vw"
          v-show="searchedArtists.length > 0"
          item-layout="horizontal"
          :data-source="searchedArtists"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <a-list-item-meta>
              <div slot="title">
                <b>Selected:</b>
                <a href="https://www.antdv.com/">{{ item.name }}</a>
              </div>
              <div slot="description">
                <a-tag
                  class="tag"
                  v-for="genre in item.genres"
                  :key="genre"
                  :color="genre.length < 5 ? 'volcano' : genre.length > 5 ? 'violet' : 'green'"
                >{{ genre.toUpperCase() }}</a-tag>
                <a-tag
                  class="tag"
                  :color="'purple'"
                >Followers: {{ numberToLocaleFormat(item.followers.total) }}</a-tag>
                <a-tag class="tag" :color="'blue'">Popularity: {{ item.popularity }}</a-tag>
              </div>
              <a-avatar :size="64" style="margin-left: 20px" slot="avatar" :src="getImageFromArtist(item)" />
            </a-list-item-meta>
            <!-- <a-button
              slot="actions"
              size="small"
              type="dashed"
              :color="'red'"
              @click="removeSearchedArtist(item)"
            >Remove</a-button>-->
          </a-list-item>
        </a-list>
      </div>

      <a-space align="center">
        <a-table
          style="width: 81vw"
          v-show="relatedArtists.length > 0"
          :columns="relatedArtistsColumns"
          :pagination="{ pageSize: 5 }"
          :data-source="relatedArtists"
        >
          <span slot="images" slot-scope="images, item">
            <a-avatar  slot="avatar" :src="getImageFromArtist(item)" />
          </span>
          <span slot="genres" slot-scope="genres">
            <a-tag
              v-for="genre in genres"
              :key="genre"
              :color="genre === 'loser' ? 'volcano' : genre.length > 5 ? 'geekblue' : 'green'"
            >{{ genre.toUpperCase() }}</a-tag>
          </span>
          <span slot="action" slot-scope="text, item">
            <a @click="addSelectedArtists(item)">
              Add to
              <b>playlist</b>
            </a>
            <a-divider type="vertical" />
            <a @click="updateSearchedArtist(item)">Search</a>
            <!-- <a-divider type="vertical" />
          <a class="ant-dropdown-link">
            More actions
            <a-icon type="down" />
            </a>-->
          </span>
        </a-table>
      </a-space>

      <div
        v-show="selectedArtists.length > 0"
        style="margin-right: 20px; text-align: right !important"
      >
        <a-space direction="horizontal" align="end">
          <a-button type="dashed">{{ selectedArtists.length }}</a-button>
          <a-popover title="The Playlist Maker">
            <template slot="content">
              <p>Click and create a playlist with the artists selected!</p>
            </template>
            <a-button type="primary">Create Playlist</a-button>
          </a-popover>
        </a-space>
      </div>

      <a-timeline v-show="selectedArtists.length > 0">
        <a-space align="center">
          <a-list
            style="width: 81vw"
            :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 5, xxl: 3 }"
            :data-source="selectedArtists"
          >
            <a-list-item slot="renderItem" slot-scope="item, index">
              <a-card>
                <div slot="title">
                  <a-space direction="vertical">
                    <a-avatar slot="avatar" :src="getImageFromArtist(item)" />
                    <div>{{item.name}}</div>
                  </a-space>
                </div>
                <a-space direction="vertical">
                  <div>
                    <a-tag
                      class="tag"
                      :color="'purple'"
                    >Followers: {{ numberToLocaleFormat(item.followers.total) }}</a-tag>
                    <a-tag class="tag" :color="'blue'">Popularity: {{ item.popularity }}</a-tag>
                  </div>
                  <div>
                    <a-button size="small" type="primary" @click="updateSearchedArtist(item)">Search</a-button>
                    <a-button
                    style="margin: 5px" 
                      size="small"
                      type="dashed"
                      :color="'red'"
                      @click="removeSelectedArtists(item)"
                    >Remove</a-button>
                  </div>
                </a-space>
              </a-card>
            </a-list-item>
          </a-list>
        </a-space>
      </a-timeline>
    </a-space>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: [],
      fetching: false,
      artists: [],
      searchedArtists: [],
      selectedArtists: [],
      relatedArtists: [],
      relatedArtistsColumns: [
        {
          dataIndex: "images",
          key: "images",
          title: "",
          align: "center",
          scopedSlots: { customRender: "images" },
        },
        {
          title: "Name",
          dataIndex: "name",
          align: "center",
          key: "name",
        },
        {
          title: "Genres",
          key: "genres",
          align: "center",
          dataIndex: "genres",
          scopedSlots: { customRender: "genres" },
        },
        {
          title: "Action",
          key: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },

  methods: {
    async fetchArtists(value) {
      if (value) {
        let res = await this.$axios.$get(`/spotify/findByName/${value}`);
        let artists = res.body.artists.items;
        this.artists = artists;
      }
    },
    async fetchRelatedArtists() {
      if (this.searchedArtists.length > 0) {
        let artistId = this.searchedArtists[0].id;
        let res = await this.$axios.$get(`/spotify/relatedArtists/${artistId}`);
        let relatedArtists = res.body.artists;
        this.relatedArtists = relatedArtists;
      }
    },
    getImageFromArtist(item) {
      return item.images && item.images.length > 0 ? item.images[0].url : "";
    },
    addSelectedArtists(item) {
      this.selectedArtists.push(item);
    },
    removeSelectedArtists(item) {
      this.selectedArtists = this.selectedArtists.filter((a) => a != item);
    },
    updateSearchedArtist(item) {
      this.searchedArtists = [item];
    },
    removeSearchedArtist(item) {
      this.searchedArtists = this.searchedArtists.filter((a) => a != item);
    },
    numberToLocaleFormat(number) {
      return parseFloat(number.toFixed(0)).toLocaleString("pt-br", {
        minimumFractionDigits: 0,
      });
    },
  },
  watch: {
    async searchedArtists() {
      await this.fetchRelatedArtists();
    },
  },
};
</script>

<style>
.tag {
  margin: 2px;
}
</style>