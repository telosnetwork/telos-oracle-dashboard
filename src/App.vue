<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

//import store from './vuex/store'

const moment = require("moment");
const HyperionSocketClient = require("@eosrio/hyperion-stream-client").default;
const fetch = require("node-fetch");

export default {
  name: "App",
  data() {
    return {
      client: null,
      startFrom: 0,
      moment
    };
  },
  methods: {
    ...mapActions("oracles", ["updatePriceFeeds", "loadLeaderboards", "updateRNGFeeds"]),

    onAction(data) {
      if (data.content.act.name == "write") {
        this.updatePriceFeeds(data.content);
      } else if (data.content.act.name == "randreceipt") {
        this.updateRNGFeeds(data.content);
      }
    },

    onDelta(data) {
    },

    async loadTableData() {
      await this.loadLeaderboards();
    },

    setupStreamClient() {
      if (this.client) return;

      this.client = new HyperionSocketClient(process.env.HYPERION_ENDPOINT, {
        async: true,
        fetch: fetch
      });

      this.client.onConnect = () => {
        this.client.streamActions({
          contract: "delphioracle",
          action: "write",
          account: "delphioracle",
          start_from: moment
            .utc()
            .subtract(24, "hours")
            .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
          read_until: 0,
          filters: []
        });

        this.client.streamActions({
          contract: process.env.ORACLE_CONSUMER,
          action: "randreceipt",
          account: process.env.ORACLE_CONSUMER,
          start_from: moment
            .utc()
            .subtract(24, "hours")
            .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
          read_until: 0,
          filters: []
        });

        this.client.streamDeltas({
          code: "rng.oracle",
          table: "oracles",
          scope: "rng.oracle",
          start_from: 0,
          read_until: 0,
          filters: []
        });

        this.client.streamDeltas({
          code: "delphioracle",
          table: "stats",
          scope: "delphioracle",
          start_from: 0,
          read_until: 0,
          filters: []
        });
      };

      this.client.onData = async (data, ack) => {
        let dataType = data.type;
        if (dataType == "action") {
          this.onAction(data);
        } else if (dataType == "delta") {
          this.onDelta(data);
        }

        ack();
      };

      this.client.connect(() => {
        console.log("Connected to Hyperion Stream!");
      });
    }
  },
  created: async function() {
    await this.loadTableData();
    this.setupStreamClient();
  },

  destroyed() {
    if (this.client) this.client.disconnect();

    this.client = null;
  }
};
</script>
