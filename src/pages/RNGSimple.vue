<template>
  <q-page class="column justify-center items-center">
      <div class="text-h4">
          {{rngTitle}}
      </div>

<div v-if="isAuthenticated">
      <div style="text-align: center">
        The feed updates for recent random numbers from <a href="https://telos.bloks.io/account/rngconsumer1" target="_blank">rngconsumer1</a> (MAIN NET) contract,
        using account {{ accountName }}.
      </div>

      <q-markup-table flat bordered>
        <thead class="background: primary">
          <tr>
            <th class="text-left">Block</th>
            <th class="text-right">Timestamp</th>
            <th class="text-center">Caller</th>
            <th class="text-center">R-Number</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rngFeed in $store.state.oracles.rngFeeds" :key="rngFeed.global_sequence">
            <td class="text-left">{{ rngFeed.block_num }}</td>
            <td class="text-right">
              {{
                moment
                  .utc(rngFeed['@timestamp'])
                  .local()
                  .format("dddd, MMMM Do YYYY, h:mm:ss a")
              }}
            </td>
            <td class="text-right">{{ rngFeed.act.data.caller }}</td>
            <td class="text-right">
              {{ rngFeed.act.data.number }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
  </div>
  <div v-else>Please login to view!</div>

  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

const moment = require("moment");

export default {
  data() {
    return {
      rngTitle: "Simplified RNG Data",
      moment
    };
  },
  computed: {
    ...mapGetters("account", ["isAuthenticated", "accountName"])
  },
  methods: {
    
  },
  mounted: function() {

  },
  destroyed() {
  }
};
</script>
