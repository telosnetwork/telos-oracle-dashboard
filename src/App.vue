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
  name: 'App',
  data() {
    return {
      client: null,
      startFrom: 0,
      moment
    };
  },
  methods: {
    ...mapActions("oracles", ["updatePriceFeeds"]),

    pFeedsUpdate (data) {
      this.updatePriceFeeds(data);
    },

    onDelta (data, ack) {
      console.log("delta found...");
      //console.log(data.content.act.name);
      console.log(data);


      ack();
    }
  },
  mounted: function() {

    if(this.client) return;

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
          .subtract(60*24, "minutes")
          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        read_until: 0,
        filters: []
      });

      this.client.streamActions({
        contract: "eosio",
        action: "buyrambytes",
        account: "eosio",
        start_from: moment
          .utc()
          .subtract(60*24, "minutes")
          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        read_until: 0,
        filters: []
      });

      this.client.streamDeltas({
        contract: "delphioracle",
        table: "stats",
        account: "delphioracle",
        start_from: moment
            .utc()
            .subtract(60*24, "minutes")
            .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        read_until: 0,
        filters: []
      });

    };

    this.client.onData = async (data, ack) => {
      //console.log("data found...");
      //console.log(data.content.act.name);
      //console.log(data);

      let dataType = data.type;
      if (dataType == "action") {
        if(data.content.act.name == "write") {
          //this.$store.state.oracles.priceFeeds.unshift(data.content);
          //this.updatePriceFeeds(data.content);
          //console.log("STORE--");
          //console.log(this.$store);
          console.log("PRICE FEEDS");
          this.pFeedsUpdate(data.content);

          //this.$store.dispatch('updatePriceFeeds', data.content);
        } else if (data.content.act.name == "buyrambytes") {
          //this.$store.state.oracles.buyRam[0] = data.content.act.data.receiver;
          console.log("BUY RAM");
        }
        else { console.log("OTHER"); }

        ack();
      } else if(dataType == "delta") {
        console.log("Delta HERE!");
        this.onDelta(data, ack);
      }

    };

    this.client.connect(() => {
      console.log("Connected to Hyperion Stream!");
    });
  },

  destroyed() {
   if (this.client) this.client.disconnect();

    this.client = null;
  }
}
</script>
