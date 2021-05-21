<template>
  <q-page class="column justify-center items-center">
      <div class="text-h4">
          {{oracleTitle}}
      </div>

      <div style="text-align: center">
        The feed updates for recent price oracles using 'write' action to <a href="https://telos.bloks.io/account/delphioracle" target="_blank">delphioracle</a> contract.
      </div>

      <q-markup-table flat bordered>
        <thead class="background: primary">
          <tr>
            <th class="text-left">Block</th>
            <th class="text-right">Timestamp</th>
            <th class="text-center">Oracle</th>
            <th class="text-center">Price Feeds</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="priceFeed in $store.state.oracles.priceFeeds" :key="priceFeed.global_sequence">
            <td class="text-left">{{ priceFeed.block_num }}</td>
            <td class="text-right">
              {{
                moment
                  .utc(priceFeed['@timestamp'])
                  .local()
                  .format("dddd, MMMM Do YYYY, h:mm:ss a")
              }}
            </td>
            <td class="text-right">{{ priceFeed.act.data.owner }}</td>
            <td class="text-right">
              {{ priceFeed.act.data.quotes }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
  </q-page>
</template>

<script>
const moment = require("moment");
//const HyperionSocketClient = require("@eosrio/hyperion-stream-client").default;
//const fetch = require("node-fetch");

export default {
  data() {
    return {
      oracleTitle: "Simplified Price Oracle Data",
      moment
    };
  },
  methods: {
    
  },
  mounted: function() {

  },
  destroyed() {
  }
};
</script>
