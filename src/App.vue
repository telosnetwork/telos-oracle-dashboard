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
    ...mapActions("oracles", ["updatePriceFeeds", "updateRNGFeeds"]),

    pFeedsUpdate (data) {
      this.updatePriceFeeds(data);
    },
    nRNGUpdate (data) {
      this.updateRNGFeeds(data);
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
        contract: process.env.ORACLE_CONTRACT,
        action: "write",
        account: process.env.ORACLE_CONTRACT,
        start_from: moment
          .utc()
          .subtract(60*24, "minutes")
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
          .subtract(60*24, "minutes")
          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        read_until: 0,
        filters: []
      });

      //example of buyrambytes
      /*this.client.streamActions({
        contract: "eosio",
        action: "buyrambytes",
        account: "eosio",
        start_from: moment
          .utc()
          .subtract(60*24, "minutes")
          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        read_until: 0,
        filters: []
      });*/

      //example of streamDeltas
      /*this.client.streamDeltas({
        contract: "delphioracle",
        table: "stats",
        account: "delphioracle",
        start_from: moment
            .utc()
            .subtract(60*24, "minutes")
            .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        read_until: 0,
        filters: []
      });*/

      /*
      this.client.streamDeltas({
        code: "eosio",
        table: "producers",
        scope: "eosio",
        start_from: moment
          .utc()
          .subtract(60*24, "minutes")
          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        read_until: 0,
        filters: [],
      });*/

    };

    this.client.onData = async (data, ack) => {
      //console.log("data found...");
      //console.log(data.content.act.name);
      //console.log(data);

      let dataType = data.type;
      if (dataType == "action") {

        //console.log("DATA --- " + data.content.act.name);

        if(data.content.act.name == "write") {
          //console.log("onData - Price Oracle Feed");

          this.pFeedsUpdate(data.content);

        } else if (data.content.act.name == "buyrambytes") {
          // console.log("onData - buyrambytes");
        } else if (data.content.act.name == "randreceipt"){
          // console.log("onData - RNG Oracle Update");
          // console.log(JSON.stringify(data));

          this.nRNGUpdate(data.content);
        }
        else { console.log("onData - other stream action"); }

        ack();
      } else if(dataType == "delta") {
        console.log("onData - Table Delta Event");

        this.onDelta(data, ack);

      } else {
        console.log("onData - Misc Other");
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
