<template>
  <div>
    <a-space direction="vertical">
      <a-select
        label-in-value
        show-search
        :value="search"
        placeholder="Search artists"
        style="width: 50vw; min-width: 250px"
        :filter-option="false"
        :not-found-content="fetchingArtists ? undefined : null"
        @search="fetchArtists"
        @click="search = null"
      >
        <a-spin v-if="fetchingArtists" slot="notFoundContent" size="small" />
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
          v-if="searchedArtists.length > 0"
          item-layout="horizontal"
          :data-source="searchedArtists"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <a-list-item-meta>
              <div slot="title">
                <b>Selected:</b>
                <a target="_blank" :href="item.external_urls.spotify">{{ item.name }}</a>
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
              <a-avatar
                :size="64"
                style="margin-left: 20px"
                slot="avatar"
                :src="getImageFromArtist(item)"
              />
            </a-list-item-meta>
            <div style="margin: 5px;" slot="actions">
              <c-actions :search="false" :item="item"></c-actions>
            </div>
          </a-list-item>
        </a-list>
      </div>

      <div :style="innerWidth > 550 ? 'width: 81vw': 'width: 95vw'">
        <a-space v-if="relatedArtists.length > 0" direction="vertical" align="center">
          <div style="margin: 10px">
            <span style="text-align: left">
              <a-icon type="arrow-down" />&nbsp;Artists related to
              <a
                target="_blank"
                :href="this.searchedArtists[0].external_urls.spotify"
              >{{ this.searchedArtists[0].name}}</a>
              <a-icon type="arrow-down" />
            </span>
          </div>
          <a-table
            :style="innerWidth > 550 ? 'width: 81vw': 'width: 95vw'"
            :size="innerWidth > 550 ? 'default' : 'small'"
            :columns="innerWidth > 550 ? relatedArtistsColumns : relatedArtistsColumnsMobile"
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
                :color="genre === 'loser' ? 'volcano' : genre.length > 5 ? 'geekblue' : 'green'"
              >{{ genre.toUpperCase() }}</a-tag>
            </span>
            <div slot="action" slot-scope="item">
              <c-actions :search="true" :item="item"></c-actions>
            </div>
          </a-table>
        </a-space>
        <a-button
          v-show="selectedArtists.length > 0"
          type="primary"
          block
          @click="modalVisible = true;"
        >Create Playlist</a-button>
      </div>
      <div v-show="selectedArtists.length > 0">
        <span style="text-align: left">
          <a-icon type="arrow-down" />&nbsp;Artists selected to the playlist
          <a-icon type="arrow-down" />
        </span>
        <a-timeline>
          <a-space align="center">
            <a-list
              style="width: 81vw;"
              :grid="{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }"
              :data-source="selectedArtists"
            >
              <a-list-item slot="renderItem" slot-scope="item">
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
                      <a-button
                        size="small"
                        type="primary"
                        @click="updateSearchedArtist(item)"
                      >Search</a-button>
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
      </div>
    </a-space>
    <vue-plyr ref="plyr" style="display: none; visibility: hidden;">
      <audio>
        <source type="audio/mp3" />
      </audio>
    </vue-plyr>
    <a-modal
      title="The Playlist Maker"
      :visible="modalVisible"
      okText="Create"
      :confirm-loading="creatingPlaylist"
      @ok="createPlaylist"
      @cancel="modalVisible =false"
    >
      <a-input v-model="playlistName" placeholder="Name of your playlist" />
      <p style="text-align: justify">
        This playlist will be added to
        <b>your spotify account</b> with the
        <b>10</b> top tracks of
        <b>each artist</b> you selected!
      </p>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  middleware: "authentication",
  data() {
    return {
      modalVisible: false,
      playlistName: null,
      creatingPlaylist: false,
      fetchingArtists: false,
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
          scopedSlots: { customRender: "name" },
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
      relatedArtistsColumnsMobile: [
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
          scopedSlots: { customRender: "name" },
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
    clearView() {
      this.creatingPlaylist = false;
      this.modalVisible = false;
      this.playlistName = null;
      this.search = [];
      this.artists = [];
      this.searchedArtists = [];
      this.selectedArtists = [];
      this.relatedArtists = [];
    },
    async createPlaylist() {
      this.creatingPlaylist = true;
      let res = await this.$axios.$post(
        `/api/spotify/playlist/${this.playlistName}`
      );
      if (res) {
        let res2 = await this.$axios.$post(
          `/api/spotify/playlist/${res.body.id}/tracks`,
          {
            artistIds: this.selectedArtists.map((a) => a.id),
          }
        );
        if (res2) {
          this.$notification.open({
            message: "Playlist created!!!",
            description: `Playlist added to your spotify with the name ${this.playlistName}`,
            icon: <a-icon type="smile" style="color: #108ee9" />,
          });
          this.clearView();
        }
      }
    },
    async fetchArtists(value) {
      if (value) {
        this.fetchingArtists = true;
        let res = await this.$axios.$get(`/api/spotify/search?query=${value}`);
        this.fetchingArtists = false;
        if (res) {
          let artists = res.body.artists.items;
          this.artists = artists;
        }
      }
    },
    async fetchRelatedArtists() {
      if (this.searchedArtists.length > 0) {
        let artistId = this.searchedArtists[0].id;
        let res = await this.$axios.$get(
          `/api/spotify/relatedArtists/${artistId}`
        );
        let relatedArtists = res.body.artists;
        this.relatedArtists = relatedArtists;
      }
    },
    getImageFromArtist(item) {
      return item.images && item.images.length > 0 ? item.images[0].url : "";
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
  computed: {
    ...mapGetters({
      isPlaying: "explore/isPlaying",
      playerSource: "explore/playerSource",
    }),
    innerWidth() {
      return window.innerWidth;
    },
    search: {
      get: function () {
        return this.$store.getters["explore/search"];
      },
      set: function (val) {
        this.$store.commit("explore/search", val);
      },
    },
    artists: {
      get: function () {
        return this.$store.getters["explore/artists"];
      },
      set: function (val) {
        this.$store.commit("explore/artists", val);
      },
    },
    searchedArtists: {
      get: function () {
        return this.$store.getters["explore/searchedArtists"];
      },
      set: function (val) {
        this.$store.commit("explore/searchedArtists", val);
      },
    },
    selectedArtists: {
      get: function () {
        return this.$store.getters["explore/selectedArtists"];
      },
      set: function (val) {
        this.$store.commit("explore/selectedArtists", val);
      },
    },
    relatedArtists: {
      get: function () {
        return this.$store.getters["explore/relatedArtists"];
      },
      set: function (val) {
        this.$store.commit("explore/relatedArtists", val);
      },
    },
  },
  watch: {
    isPlaying() {
      if (this.isPlaying) {
        setTimeout(() => {
          this.$refs.plyr.player.play();
        }, 100);
      } else {
        setTimeout(() => {
          this.$refs.plyr.player.stop();
        }, 100);
      }
    },
    playerSource() {
      this.$refs.plyr.player.source = {
        type: "audio",
        sources: [{ src: this.playerSource, type: "audio/mp3" }],
      };
    },
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