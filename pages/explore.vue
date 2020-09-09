<template>
  <div class="content">
    <a-space direction="vertical">
      <a-select mode="tags" style="width: 30%;" @change="handleChange">
        <div slot="placeholder">
          Search artists
          <a-icon type="smile-o" />
        </div>
        <a-select-option
          v-for="i in 25"
          :key="(i + 9).toString(36) + i"
        >{{ (i + 9).toString(36) + i }}</a-select-option>
      </a-select>

      <div style="text-align: left !important">
        <a-list item-layout="horizontal" :data-source="data2">
          <a-list-item slot="renderItem" slot-scope="item">
            <a-list-item-meta>
              <div slot="title">
                <b>Selected:</b>
                <a href="https://www.antdv.com/">{{ item.name }}</a>
              </div>
              <div slot="description">
                <a-tag
                  v-for="tag in item.tags"
                  :key="tag"
                  :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
                >{{ tag.toUpperCase() }}</a-tag>
                <a-tag :color="'purple'">Followers: {{ numberToLocaleFormat(item.followers.total) }}</a-tag>
                <a-tag :color="'red'">Popularity: {{ item.popularity }}</a-tag>
              </div>
              <a-avatar
                slot="avatar"
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              />
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </div>

      <a-table :columns="columns" :data-source="data">
        <span slot="images" slot-scope="images">
          <a-avatar slot="avatar" :src="images[0].url" />
        </span>
        <span slot="genres" slot-scope="genres">
          <a-tag
            v-for="genre in genres"
            :key="genre"
            :color="genre === 'loser' ? 'volcano' : genre.length > 5 ? 'geekblue' : 'green'"
          >{{ genre.toUpperCase() }}</a-tag>
        </span>
        <span slot="action" slot-scope="text, item">
          <a @click="addToPlaylist(item)">Add to playlist</a>
          <a-divider type="vertical" />
          <a>Delete</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link">
            More actions
            <a-icon type="down" />
          </a>
        </span>
      </a-table>

      <div style="text-align: right !important">
        <a-space direction="horizontal" align="end">
          <a-button type="dashed">11</a-button>
          <a-popover title="The Playlist Maker">
            <template slot="content">
              <p>Click and create a playlist with the artists selected!</p>
            </template>
            <a-button type="primary">Create Playlist</a-button>
          </a-popover>
        </a-space>
      </div>

      <a-timeline>
        <a-timeline-item color="green">Create a services site 2015-09-01</a-timeline-item>
        <a-timeline-item color="green">Create a services site 2015-09-01</a-timeline-item>
        <a-timeline-item color="red">
          <p>Solve initial network problems 1</p>
          <p>Solve initial network problems 2</p>
          <p>Solve initial network problems 3 2015-09-01</p>
        </a-timeline-item>
        <a-timeline-item>
          <p>Technical testing 1</p>
          <p>Technical testing 2</p>
          <p>Technical testing 3 2015-09-01</p>
        </a-timeline-item>
      </a-timeline>
    </a-space>
  </div>
</template>

<script>
export default {
  async mounted() {
    let res = await this.$axios.$get("/recommendations", { a: 1});
    let artists = res.body;
    console.log(artists);
  },
  data() {
    return {
      data: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/0du5cEVh5yTK9QJze8zA0C",
          },
          followers: { href: null, total: 26531893 },
          genres: ["dance pop", "pop", "post-teen pop"],
          href: "https://api.spotify.com/v1/artists/0du5cEVh5yTK9QJze8zA0C",
          id: "0du5cEVh5yTK9QJze8zA0C",
          images: [
            {
              height: 640,
              url:
                "https://i.scdn.co/image/aa32d6d4ca2467974403518dd3ebfe8831c5ced1",
              width: 640,
            },
            {
              height: 320,
              url:
                "https://i.scdn.co/image/63cad86cb183568085a4e5f0be86aa187cc511e4",
              width: 320,
            },
            {
              height: 160,
              url:
                "https://i.scdn.co/image/5461dcbb3f23e1df62d85c8273fc49cc4edd49d5",
              width: 160,
            },
          ],
          name: "Bruno Mars",
          popularity: 88,
          type: "artist",
          uri: "spotify:artist:0du5cEVh5yTK9QJze8zA0C",
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/0du5cEVh5yTK9QJze8zA0C",
          },
          followers: { href: null, total: 26531893 },
          genres: ["dance pop", "pop", "post-teen pop"],
          href: "https://api.spotify.com/v1/artists/0du5cEVh5yTK9QJze8zA0C",
          id: "0du5cEVh5yTK9QJze8zA0C",
          images: [
            {
              height: 640,
              url:
                "https://i.scdn.co/image/aa32d6d4ca2467974403518dd3ebfe8831c5ced1",
              width: 640,
            },
            {
              height: 320,
              url:
                "https://i.scdn.co/image/63cad86cb183568085a4e5f0be86aa187cc511e4",
              width: 320,
            },
            {
              height: 160,
              url:
                "https://i.scdn.co/image/5461dcbb3f23e1df62d85c8273fc49cc4edd49d5",
              width: 160,
            },
          ],
          name: "Bruno Mars",
          popularity: 88,
          type: "artist",
          uri: "spotify:artist:0du5cEVh5yTK9QJze8zA0C",
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/0du5cEVh5yTK9QJze8zA0C",
          },
          followers: { href: null, total: 26531893 },
          genres: ["dance pop", "pop", "post-teen pop"],
          href: "https://api.spotify.com/v1/artists/0du5cEVh5yTK9QJze8zA0C",
          id: "0du5cEVh5yTK9QJze8zA0C",
          images: [
            {
              height: 640,
              url:
                "https://i.scdn.co/image/aa32d6d4ca2467974403518dd3ebfe8831c5ced1",
              width: 640,
            },
            {
              height: 320,
              url:
                "https://i.scdn.co/image/63cad86cb183568085a4e5f0be86aa187cc511e4",
              width: 320,
            },
            {
              height: 160,
              url:
                "https://i.scdn.co/image/5461dcbb3f23e1df62d85c8273fc49cc4edd49d5",
              width: 160,
            },
          ],
          name: "Bruno Mars",
          popularity: 88,
          type: "artist",
          uri: "spotify:artist:0du5cEVh5yTK9QJze8zA0C",
        },
      ],
      data2: [
        {
          key: "1",
          name: "John Brown",
          age: 32,
          address: "Sidney No. 1 Lake Park",
          popularity: 88,
          followers: { href: null, total: 26531893 },
          tags: ["dance pop", "pop", "post-teen pop"],
        },
      ],
      columns: [
        {
          dataIndex: "images",
          key: "images",
          title: "",
          scopedSlots: { customRender: "images" },
        },
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Genres",
          key: "genres",
          dataIndex: "genres",
          scopedSlots: { customRender: "genres" },
        },
        {
          title: "Action",
          key: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },

  methods: {
    addToPlaylist(item) {
      console.log(item);
    },
    numberToLocaleFormat(number) {
      return parseFloat(number.toFixed(0)).toLocaleString("pt-br", {
        minimumFractionDigits: 0,
      });
    },
  },
};
</script>

<style>
</style>